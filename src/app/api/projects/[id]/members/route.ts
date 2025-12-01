import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireProjectOwner } from "@/lib/auth-utils"
import { addProjectMemberSchema } from "@/lib/validations"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/members - Get all project members
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params

    const members = await prisma.projectMember.findMany({
      where: { projectId },
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
        addedAt: "asc",
      },
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error("Get members error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/projects/[id]/members - Add member to project
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params
    const user = await requireProjectOwner(projectId)
    const body = await req.json()
    const { email } = addProjectMemberSchema.parse(body)

    // Find user by email
    const memberUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!memberUser) {
      return NextResponse.json({ error: "User with this email not found" }, { status: 404 })
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberUser.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this project" },
        { status: 400 }
      )
    }

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: memberUser.id,
        role: "MEMBER",
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
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        type: "PROJECT_MEMBER_ADDED",
        title: "Added to project",
        message: `You have been added to the project`,
        userId: memberUser.id,
        projectId,
      },
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "member_added",
        entityType: "project",
        entityId: projectId,
        projectId,
        userId: user.id,
        metadata: {
          memberEmail: email,
          memberId: memberUser.id,
        },
      },
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Add member error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}

// DELETE /api/projects/[id]/members/[memberId] - Remove member from project
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params
    const user = await requireProjectOwner(projectId)

    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get("memberId")

    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    // Cannot remove owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    })

    if (project?.ownerId === memberId) {
      return NextResponse.json({ error: "Cannot remove project owner" }, { status: 400 })
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "member_removed",
        entityType: "project",
        entityId: projectId,
        projectId,
        userId: user.id,
        metadata: {
          memberId,
        },
      },
    })

    return NextResponse.json({ message: "Member removed successfully" })
  } catch (error) {
    console.error("Remove member error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}
