import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, canManageBug } from "@/lib/auth-utils"
import { updateBugSchema } from "@/lib/validations"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/bugs/[id] - Get bug details
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    await requireAuth()

    const bug = await prisma.bug.findUnique({
      where: { id },
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
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            attachments: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        attachments: true,
        activityLogs: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
      },
    })

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    return NextResponse.json({ bug })
  } catch (error) {
    console.error("Get bug error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/bugs/[id] - Update bug
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const user = await requireAuth()
    const body = await req.json()
    const data = updateBugSchema.parse(body)

    // Check permissions
    const hasPermission = await canManageBug(id, user.id)
    if (!hasPermission) {
      return NextResponse.json(
        { error: "You don't have permission to update this bug" },
        { status: 403 }
      )
    }

    // Get current bug for comparison
    const currentBug = await prisma.bug.findUnique({
      where: { id },
      select: {
        status: true,
        assignedToId: true,
        projectId: true,
        title: true,
      },
    })

    if (!currentBug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    const bug = await prisma.bug.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
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
        action: "updated",
        entityType: "bug",
        entityId: bug.id,
        projectId: currentBug.projectId,
        bugId: bug.id,
        userId: user.id,
        metadata: {
          changes: data,
        },
      },
    })

    // Create notifications for status change
    if (data.status && data.status !== currentBug.status && currentBug.assignedToId) {
      await prisma.notification.create({
        data: {
          type: "BUG_STATUS_CHANGED",
          title: "Bug status changed",
          message: `Bug "${currentBug.title}" status changed to ${data.status}`,
          userId: currentBug.assignedToId,
          projectId: currentBug.projectId,
          metadata: {
            bugId: bug.id,
            oldStatus: currentBug.status,
            newStatus: data.status,
          },
        },
      })
    }

    // Create notification for new assignment
    if (
      data.assignedToId &&
      data.assignedToId !== currentBug.assignedToId &&
      data.assignedToId !== user.id
    ) {
      await prisma.notification.create({
        data: {
          type: "BUG_ASSIGNED",
          title: "Bug assigned to you",
          message: `You have been assigned to bug: ${currentBug.title}`,
          userId: data.assignedToId,
          projectId: currentBug.projectId,
          metadata: {
            bugId: bug.id,
          },
        },
      })
    }

    return NextResponse.json({ bug })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update bug error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/bugs/[id] - Delete bug
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const user = await requireAuth()

    const bug = await prisma.bug.findUnique({
      where: { id },
      include: {
        project: true,
      },
    })

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    // Only project owner can delete bugs
    if (bug.project.ownerId !== user.id) {
      return NextResponse.json({ error: "Only project owner can delete bugs" }, { status: 403 })
    }

    await prisma.bug.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Bug deleted successfully" })
  } catch (error) {
    console.error("Delete bug error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
