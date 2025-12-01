import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireProjectAccess } from "@/lib/auth-utils"
import { Prisma } from "@prisma/client"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/analytics - Get project analytics
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params
    await requireProjectAccess(projectId)

    // Bug counts by status
    const bugsByStatus = await prisma.bug.groupBy({
      by: ["status"],
      where: { projectId },
      _count: true,
    })

    // Bug counts by priority
    const bugsByPriority = await prisma.bug.groupBy({
      by: ["priority"],
      where: { projectId },
      _count: true,
    })

    // Bugs over time (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const bugsOverTime = await prisma.$queryRaw<
      Array<{ date: Date; open: bigint; closed: bigint }>
    >`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) FILTER (WHERE status IN ('OPEN', 'IN_PROGRESS', 'BLOCKED')) as open,
        COUNT(*) FILTER (WHERE status IN ('RESOLVED', 'CLOSED')) as closed
      FROM bugs
      WHERE project_id = ${projectId}
        AND created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Upcoming deadlines
    const upcomingDeadlines = await prisma.bug.findMany({
      where: {
        projectId,
        deadline: {
          gte: new Date(),
        },
        status: {
          notIn: ["RESOLVED", "CLOSED"],
        },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
      take: 10,
    })

    // Bug assignment distribution
    const bugsByAssignee = await prisma.bug.groupBy({
      by: ["assignedToId"],
      where: {
        projectId,
        assignedToId: { not: null },
      },
      _count: true,
    })

    // Get assignee details
    const assigneeIds = bugsByAssignee
      .map((b) => b.assignedToId)
      .filter((id): id is string => id !== null)

    const assignees = await prisma.user.findMany({
      where: {
        id: { in: assigneeIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })

    const assigneeMap = new Map(assignees.map((a) => [a.id, a]))

    const bugAssignmentDistribution = bugsByAssignee.map((b) => ({
      assignee: b.assignedToId ? assigneeMap.get(b.assignedToId) : null,
      count: b._count,
    }))

    // Total stats
    const totalBugs = await prisma.bug.count({ where: { projectId } })
    const openBugs = await prisma.bug.count({
      where: {
        projectId,
        status: { in: ["OPEN", "IN_PROGRESS", "BLOCKED"] },
      },
    })
    const closedBugs = await prisma.bug.count({
      where: {
        projectId,
        status: { in: ["RESOLVED", "CLOSED"] },
      },
    })

    return NextResponse.json({
      stats: {
        total: totalBugs,
        open: openBugs,
        closed: closedBugs,
      },
      bugsByStatus: bugsByStatus.map((b) => ({
        status: b.status,
        count: b._count,
      })),
      bugsByPriority: bugsByPriority.map((b) => ({
        priority: b.priority,
        count: b._count,
      })),
      bugsOverTime: bugsOverTime.map((b) => ({
        date: b.date,
        open: Number(b.open),
        closed: Number(b.closed),
      })),
      upcomingDeadlines,
      bugAssignmentDistribution,
    })
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}
