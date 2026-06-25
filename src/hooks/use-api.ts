import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { CreateProjectInput, CreateBugInput, UpdateBugInput, BugFilterInput } from "@/lib/validations"

// Projects
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Failed to fetch projects")
      const data = await res.json()
      return data.projects
    },
  })
}

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required")
      const res = await fetch(`/api/projects/${projectId}`)
      if (!res.ok) throw new Error("Failed to fetch project")
      const data = await res.json()
      return data.project
    },
    enabled: !!projectId,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to create project")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      toast.success("Project created successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Bugs
export function useBugs(projectId: string | undefined, filters?: Partial<BugFilterInput>) {
  const queryString = filters
    ? new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)])
        )
      ).toString()
    : ""

  return useQuery({
    queryKey: ["bugs", projectId, filters],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required")
      const url = `/api/projects/${projectId}/bugs${queryString ? `?${queryString}` : ""}`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch bugs")
      const data = await res.json()
      return data.bugs
    },
    enabled: !!projectId,
  })
}

export function useBug(bugId: string | undefined) {
  return useQuery({
    queryKey: ["bugs", bugId],
    queryFn: async () => {
      if (!bugId) throw new Error("Bug ID is required")
      const res = await fetch(`/api/bugs/${bugId}`)
      if (!res.ok) throw new Error("Failed to fetch bug")
      const data = await res.json()
      return data.bug
    },
    enabled: !!bugId,
  })
}

export function useCreateBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateBugInput) => {
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to create bug")
      }
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] })
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] })
      toast.success("Bug created successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ bugId, ...data }: { bugId: string } & UpdateBugInput) => {
      const res = await fetch(`/api/bugs/${bugId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update bug")
      }
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bugs", variables.bugId] })
      queryClient.invalidateQueries({ queryKey: ["bugs"] })
      toast.success("Bug updated successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Notifications
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications")
      if (!res.ok) throw new Error("Failed to fetch notifications")
      const data = await res.json()
      return data.notifications
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: false, // Don't retry failed requests
    staleTime: 0, // Always consider data stale so it refetches appropriately
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true, notificationId }),
      })
      if (!res.ok) throw new Error("Failed to mark notification as read")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

// Project Members
export function useProjectMembers(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required")
      const res = await fetch(`/api/projects/${projectId}/members`)
      if (!res.ok) throw new Error("Failed to fetch project members")
      const data = await res.json()
      return data.members
    },
    enabled: !!projectId,
  })
}

// Bug Groups
export function useBugGroups(projectId: string | undefined) {
  return useQuery({
    queryKey: ["projects", projectId, "bugGroups"],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required")
      const res = await fetch(`/api/projects/${projectId}/groups`)
      if (!res.ok) throw new Error("Failed to fetch bug groups")
      const data = await res.json()
      return data.bugGroups
    },
    enabled: !!projectId,
  })
}
