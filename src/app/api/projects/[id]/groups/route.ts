import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireProjectOwner } from "@/lib/auth-utils"
import { createBugGroupSchema, updateBugGroupSchema } from "@/lib/validations"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/projects/[id]/groups - Create bug group
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params
    const user = await requireProjectOwner(projectId)
    const body = await req.json()

    // Override projectId from params
    const data = createBugGroupSchema.parse({ ...body, projectId })

    // Get the max order for this project
    const maxOrder = await prisma.bugGroup.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
      select: { order: true },
    })

    const bugGroup = await prisma.bugGroup.create({
      data: {
        ...data,
        order: data.order ?? (maxOrder?.order ?? 0) + 1,
      },
      include: {
        _count: {
          select: { bugs: true },
        },
      },
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "created",
        entityType: "bug_group",
        entityId: bugGroup.id,
        projectId,
        userId: user.id,
        metadata: {
          groupName: bugGroup.name,
        },
      },
    })

    return NextResponse.json({ bugGroup }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create bug group error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}

// GET /api/projects/[id]/groups - List bug groups
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params

    const bugGroups = await prisma.bugGroup.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { bugs: true },
        },
      },
    })

    return NextResponse.json({ bugGroups })
  } catch (error) {
    console.error("Get bug groups error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
