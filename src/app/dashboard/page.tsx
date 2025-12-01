"use client"

import { useState } from "react"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/empty-state"
import { useProjects } from "@/hooks/use-api"
import {
  FolderKanban,
  Bug,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateProjectForm } from "@/components/forms/create-project-form"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { data: projects = [], isLoading } = useProjects()

  if (status === "loading") {
    return <DashboardSkeleton />
  }

  if (!session) {
    redirect("/auth/signin")
  }

  const totalProjects = projects.length
  const totalBugs = projects.reduce((sum: number, p: any) => sum + (p._count?.bugs || 0), 0)
  const totalMembers = projects.reduce((sum: number, p: any) => sum + (p.members?.length || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              Welcome back, {session.user?.name || "Developer"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalBugs > 0
                ? `You have ${totalBugs} bugs to squash across ${totalProjects} projects`
                : "Ready to track some bugs?"}
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg hover:shadow-purple-500/50">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a new project to start tracking bugs and managing your team.
                </DialogDescription>
              </DialogHeader>
              <CreateProjectForm onSuccess={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <FolderKanban className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {totalProjects}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalProjects > 0 ? "Active projects" : "Create your first project"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Bugs</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <Bug className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {totalBugs}
              </div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10">
                <Users className="h-4 w-4 text-pink-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">Total collaborators</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">
              Your Projects
            </h2>
            <Button variant="ghost" asChild className="hover:text-purple-600 transition-colors">
              <Link href="/projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Create your first project to start tracking bugs. It only takes a minute! 🚀"
              action={{
                label: "Create Project",
                onClick: () => setIsCreateDialogOpen(true),
              }}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project: any) => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:border-purple-500/50"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={project.visibility === "PUBLIC" ? "default" : "secondary"}>
                        {project.visibility}
                      </Badge>
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {project.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bug className="h-4 w-4" />
                        <span>{project._count?.bugs || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.members?.length || 0}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Updated {format(new Date(project.updatedAt), "MMM d, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        {projects.length === 0 && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium">Create a project</p>
                  <p className="text-sm text-muted-foreground">
                    Start by creating a project for your application or team
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium">Invite team members</p>
                  <p className="text-sm text-muted-foreground">
                    Collaborate with your team by adding members to your project
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-purple-600 text-white font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium">Track bugs</p>
                  <p className="text-sm text-muted-foreground">
                    Create bug groups and start tracking issues with full context
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

function DashboardSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
