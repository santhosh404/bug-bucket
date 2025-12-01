import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireProjectAccess } from "@/lib/auth-utils"
import { bugFilterSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/bugs - List bugs with filtering and pagination
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id: projectId } = await context.params
    await requireProjectAccess(projectId)

    const { searchParams } = new URL(req.url)

    const filters = bugFilterSchema.parse({
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      assignedToId: searchParams.get("assignedToId") || undefined,
      bugGroupId: searchParams.get("bugGroupId") || undefined,
      search: searchParams.get("search") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    })

    // Build where clause
    const where: Prisma.BugWhereInput = {
      projectId,
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.assignedToId && { assignedToId: filters.assignedToId }),
      ...(filters.bugGroupId && { bugGroupId: filters.bugGroupId }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    }

    // Get total count
    const total = await prisma.bug.count({ where })

    // Get bugs
    const bugs = await prisma.bug.findMany({
      where,
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
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
      orderBy: {
        [filters.sortBy]: filters.sortOrder,
      },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    })

    return NextResponse.json({
      bugs,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
    })
  } catch (error) {
    console.error("Get bugs error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof Error && error.message.includes("Forbidden") ? 403 : 500 }
    )
  }
}
