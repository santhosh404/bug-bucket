import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireProjectAccess, canManageBug } from "@/lib/auth-utils"
import { createBugSchema, updateBugSchema } from "@/lib/validations"
import { z } from "zod"

// POST /api/bugs - Create a new bug
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const data = createBugSchema.parse(body)

    // Verify user has access to the project
    await requireProjectAccess(data.projectId)

    // Verify assignee is a project member if assigned
    if (data.assignedToId) {
      const isMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: data.projectId,
            userId: data.assignedToId,
          },
        },
      })

      if (!isMember) {
        return NextResponse.json({ error: "Assignee must be a project member" }, { status: 400 })
      }
    }

    const bug = await prisma.bug.create({
      data: {
        ...data,
        createdById: user.id,
        deadline: data.deadline ? new Date(data.deadline) : null,
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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        bugGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "created",
        entityType: "bug",
        entityId: bug.id,
        projectId: data.projectId,
        bugId: bug.id,
        userId: user.id,
        metadata: {
          bugTitle: bug.title,
          priority: bug.priority,
        },
      },
    })

    // Create notification if assigned
    if (data.assignedToId && data.assignedToId !== user.id) {
      await prisma.notification.create({
        data: {
          type: "BUG_ASSIGNED",
          title: "Bug assigned to you",
          message: `You have been assigned to bug: ${bug.title}`,
          userId: data.assignedToId,
          projectId: data.projectId,
          metadata: {
            bugId: bug.id,
          },
        },
      })
    }

    return NextResponse.json({ bug }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create bug error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}
