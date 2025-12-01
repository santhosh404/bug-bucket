import { z } from "zod"

// ============================================
// Auth Schemas
// ============================================

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>

// ============================================
// Project Schemas
// ============================================

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(1000).optional(),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
  avatar: z.string().url().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const addProjectMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>

// ============================================
// Bug Group Schemas
// ============================================

export const createBugGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().max(500).optional(),
  projectId: z.string().cuid(),
  order: z.number().int().min(0).optional(),
})

export const updateBugGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).optional(),
})

export type CreateBugGroupInput = z.infer<typeof createBugGroupSchema>
export type UpdateBugGroupInput = z.infer<typeof updateBugGroupSchema>

// ============================================
// Bug Schemas
// ============================================

export const createBugSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  status: z.enum(["OPEN", "IN_PROGRESS", "BLOCKED", "RESOLVED", "CLOSED"]).default("OPEN"),
  deadline: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null
      // If it's just a date (YYYY-MM-DD), add time to make it a valid datetime
      if (val.length === 10) {
        return `${val}T23:59:59.999Z`
      }
      return val
    }),
  assignedToId: z.string().cuid().optional().nullable(),
  bugGroupId: z.string().cuid(),
  projectId: z.string().cuid(),
})

export const updateBugSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "BLOCKED", "RESOLVED", "CLOSED"]).optional(),
  deadline: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null
      // If it's just a date (YYYY-MM-DD), add time to make it a valid datetime
      if (val.length === 10) {
        return `${val}T23:59:59.999Z`
      }
      return val
    }),
  assignedToId: z.string().cuid().optional().nullable(),
  bugGroupId: z.string().cuid().optional(),
})

export const bugFilterSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "BLOCKED", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  assignedToId: z.string().cuid().optional(),
  bugGroupId: z.string().cuid().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "priority", "deadline", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type CreateBugInput = z.infer<typeof createBugSchema>
export type UpdateBugInput = z.infer<typeof updateBugSchema>
export type BugFilterInput = z.infer<typeof bugFilterSchema>

// ============================================
// Comment Schemas
// ============================================

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  bugId: z.string().cuid(),
})

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>

// ============================================
// Upload Schemas
// ============================================

export const uploadFileSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().min(1).max(10485760), // 10MB max
})

export type UploadFileInput = z.infer<typeof uploadFileSchema>

// ============================================
// Notification Schemas
// ============================================

export const markNotificationReadSchema = z.object({
  notificationId: z.string().cuid(),
})

export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>
