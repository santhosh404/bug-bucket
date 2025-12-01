import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireProjectAccess, requireProjectOwner } from "@/lib/auth-utils"
import { updateProjectSchema } from "@/lib/validations"
import { z } from "zod"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id] - Get project details
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const user = await requireProjectAccess(id)

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
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
        },
        bugGroups: {
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: { bugs: true },
            },
          },
        },
        _count: {
          select: {
            bugs: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const user = await requireProjectOwner(id)
    const body = await req.json()
    const data = updateProjectSchema.parse(body)

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
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
        },
      },
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: "updated",
        entityType: "project",
        entityId: project.id,
        projectId: project.id,
        userId: user.id,
        metadata: {
          changes: data,
        },
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update project error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const user = await requireProjectOwner(id)

    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}
