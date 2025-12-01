import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProjectRole } from "@prisma/client"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function isProjectOwner(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })
  return project?.ownerId === userId
}

export async function isProjectMember(projectId: string, userId: string): Promise<boolean> {
  const membership = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  })
  return !!membership
}

export async function canAccessProject(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      visibility: true,
      members: {
        where: { userId },
      },
    },
  })

  if (!project) return false
  if (project.ownerId === userId) return true
  if (project.members.length > 0) return true
  if (project.visibility === "PUBLIC") return true

  return false
}

export async function canManageProject(projectId: string, userId: string): Promise<boolean> {
  return isProjectOwner(projectId, userId)
}

export async function canManageBug(bugId: string, userId: string): Promise<boolean> {
  const bug = await prisma.bug.findUnique({
    where: { id: bugId },
    include: {
      project: true,
    },
  })

  if (!bug) return false

  // Project owner can manage any bug
  if (bug.project.ownerId === userId) return true

  // Assignee can update status and add comments
  if (bug.assignedToId === userId) return true

  return false
}

export async function requireProjectAccess(projectId: string) {
  const user = await requireAuth()
  const hasAccess = await canAccessProject(projectId, user.id)

  if (!hasAccess) {
    throw new Error("Forbidden: You don't have access to this project")
  }

  return user
}

export async function requireProjectOwner(projectId: string) {
  const user = await requireAuth()
  const isOwner = await isProjectOwner(projectId, user.id)

  if (!isOwner) {
    throw new Error("Forbidden: Only project owners can perform this action")
  }

  return user
}
