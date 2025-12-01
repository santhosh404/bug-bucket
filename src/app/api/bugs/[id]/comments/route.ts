import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { createCommentSchema } from "@/lib/validations"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/bugs/[id]/comments - Add comment to bug
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id: bugId } = await context.params
    const user = await requireAuth()
    const body = await req.json()
    const { content } = createCommentSchema.parse({ ...body, bugId })

    // Verify bug exists and get project info
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      select: {
        id: true,
        title: true,
        projectId: true,
        assignedToId: true,
        createdById: true,
      },
    })

    if (!bug) {
      return NextResponse.json({ error: "Bug not found" }, { status: 404 })
    }

    const comment = await prisma.bugComment.create({
      data: {
        content,
        bugId,
        userId: user.id,
      },
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
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "comment_added",
        entityType: "bug",
        entityId: bugId,
        projectId: bug.projectId,
        bugId,
        userId: user.id,
        metadata: {
          commentId: comment.id,
        },
      },
    })

    // Notify assignee and creator (if different from commenter)
    const notifyUserIds = new Set([bug.assignedToId, bug.createdById].filter(Boolean))
    notifyUserIds.delete(user.id) // Don't notify the commenter

    for (const userId of notifyUserIds) {
      await prisma.notification.create({
        data: {
          type: "BUG_COMMENT",
          title: "New comment on bug",
          message: `${user.name || user.email} commented on bug: ${bug.title}`,
          userId: userId!,
          projectId: bug.projectId,
          metadata: {
            bugId,
            commentId: comment.id,
          },
        },
      })
    }

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create comment error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /api/bugs/[id]/comments - Get bug comments
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id: bugId } = await context.params
    await requireAuth()

    const comments = await prisma.bugComment.findMany({
      where: { bugId },
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
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
