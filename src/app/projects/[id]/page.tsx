"use client"

import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProject } from "@/hooks/use-api"
import { Settings, Bug, Users, BarChart3, FolderTree } from "lucide-react"
import { ProjectBugsTab } from "@/components/project/project-bugs-tab"
import { ProjectMembersTab } from "@/components/project/project-members-tab"
import { ProjectAnalyticsTab } from "@/components/project/project-analytics-tab"
import { ProjectGroupsTab } from "@/components/project/project-groups-tab"
import { ProjectSettingsTab } from "@/components/project/project-settings-tab"

export default function ProjectDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const projectId = params?.id as string
  const { data: project, isLoading } = useProject(projectId)

  if (status === "loading" || isLoading) {
    return <ProjectDetailSkeleton />
  }

  if (!session) {
    redirect("/auth/signin")
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Project not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const isOwner = project.ownerId === session.user.id

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
                {project.name}
              </h1>
              <Badge variant={project.visibility === "PUBLIC" ? "default" : "secondary"}>
                {project.visibility}
              </Badge>
              {isOwner && (
                <Badge variant="outline" className="border-purple-500/50 text-purple-600">
                  Owner
                </Badge>
              )}
            </div>
            {project.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bugs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bugs" className="gap-2 cursor-pointer">
              <Bug className="h-4 w-4" />
              Bugs
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2 cursor-pointer">
              <FolderTree className="h-4 w-4" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2 cursor-pointer">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 cursor-pointer">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="settings" className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="bugs" className="space-y-4">
            <ProjectBugsTab project={project} isOwner={isOwner} />
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <ProjectGroupsTab project={project} isOwner={isOwner} />
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <ProjectMembersTab project={project} isOwner={isOwner} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <ProjectAnalyticsTab project={project} />
          </TabsContent>

          {isOwner && (
            <TabsContent value="settings" className="space-y-4">
              <ProjectSettingsTab project={project} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function ProjectDetailSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
