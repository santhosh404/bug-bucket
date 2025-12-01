"use client"

import { useState } from "react"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useBug, useUpdateBug, useProjectMembers } from "@/hooks/use-api"
import {
  ArrowLeft,
  Calendar,
  User,
  FolderTree,
  MessageSquare,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Paperclip,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { BugComments } from "@/components/bug/bug-comments"
import { BugActivityTimeline } from "@/components/bug/bug-activity-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  OPEN: "bg-blue-500",
  IN_PROGRESS: "bg-yellow-500",
  BLOCKED: "bg-red-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-500",
}

const priorityVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
  CRITICAL: "destructive",
}

export default function BugDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const bugId = params?.id as string
  const { data: bug, isLoading } = useBug(bugId)
  const { data: projectMembers = [] } = useProjectMembers(bug?.projectId)
  const updateBug = useUpdateBug()
  const [openAssignee, setOpenAssignee] = useState(false)

  if (status === "loading" || isLoading) {
    return <BugDetailSkeleton />
  }

  if (!session) {
    redirect("/auth/signin")
  }

  if (!bug) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Bug not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const isOwner = bug.project.ownerId === session.user.id
  const isAssignee = bug.assignedTo?.id === session.user.id
  const canEdit = isOwner || isAssignee

  const handleStatusChange = async (status: string) => {
    await updateBug.mutateAsync({
      bugId: bug.id,
      status,
    })
  }

  const handlePriorityChange = async (priority: string) => {
    await updateBug.mutateAsync({
      bugId: bug.id,
      priority,
    })
  }

  const handleAssigneeChange = async (assignedToId: string) => {
    await updateBug.mutateAsync({
      bugId: bug.id,
      assignedToId: assignedToId === "unassigned" ? null : assignedToId,
    })
    setOpenAssignee(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        {/* Breadcrumb & Actions Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href={`/projects/${bug.project.id}`}
                  className="hover:text-foreground transition-colors font-medium"
                >
                  {bug.project.name}
                </Link>
                <span>/</span>
                <span>#{bug.id.slice(0, 8)}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
                {bug.title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${statusColors[bug.status]}`} />
                  <span className="text-sm text-muted-foreground">
                    {bug.status.replace(/_/g, " ")}
                  </span>
                </div>
                <Badge variant={priorityVariants[bug.priority]} className="font-medium">
                  {bug.priority}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {format(new Date(bug.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:border-purple-500/50 hover:text-purple-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="border-2 border-purple-500/20 shadow-lg shadow-purple-500/10">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status
                    </label>
                    {canEdit ? (
                      <Select value={bug.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              Open
                            </div>
                          </SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500" />
                              In Progress
                            </div>
                          </SelectItem>
                          <SelectItem value="BLOCKED">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500" />
                              Blocked
                            </div>
                          </SelectItem>
                          <SelectItem value="RESOLVED">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              Resolved
                            </div>
                          </SelectItem>
                          <SelectItem value="CLOSED">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-gray-500" />
                              Closed
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 h-9">
                        <div className={`h-2 w-2 rounded-full ${statusColors[bug.status]}`} />
                        <span className="text-sm">{bug.status.replace(/_/g, " ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Priority
                    </label>
                    {canEdit ? (
                      <Select value={bug.priority} onValueChange={handlePriorityChange}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-9 flex items-center">
                        <Badge variant={priorityVariants[bug.priority]}>{bug.priority}</Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Assignee
                    </label>
                    {isOwner ? (
                      <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openAssignee}
                            className="w-full justify-between h-9"
                          >
                            {bug.assignedTo ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={bug.assignedTo.image || undefined} />
                                  <AvatarFallback className="text-xs">
                                    {bug.assignedTo.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate text-sm">
                                  {bug.assignedTo.name?.split(" ")[0]}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Unassigned</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0">
                          <Command>
                            <CommandInput placeholder="Search member..." />
                            <CommandList>
                              <CommandEmpty>No member found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="unassigned"
                                  onSelect={() => handleAssigneeChange("unassigned")}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      !bug.assignedToId ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <span className="text-muted-foreground">Unassigned</span>
                                </CommandItem>
                                {projectMembers.map((member: any) => (
                                  <CommandItem
                                    key={member.user.id}
                                    value={member.user.name}
                                    onSelect={() => handleAssigneeChange(member.user.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        bug.assignedToId === member.user.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src={member.user.image || undefined} />
                                      <AvatarFallback>
                                        {member.user.name?.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span>{member.user.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {member.user.email}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : bug.assignedTo ? (
                      <div className="flex items-center gap-2 h-9">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={bug.assignedTo.image || undefined} />
                          <AvatarFallback className="text-xs">
                            {bug.assignedTo.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{bug.assignedTo.name}</span>
                      </div>
                    ) : (
                      <div className="h-9 flex items-center">
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{bug.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {bug.attachments && bug.attachments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments ({bug.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {bug.attachments.map((attachment: any) => (
                      <div
                        key={attachment.id}
                        className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors cursor-pointer"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          <Paperclip className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments & Activity */}
            <Card className="shadow-lg">
              <Tabs defaultValue="comments" className="w-full">
                <CardHeader className="pb-0 ">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-purple-600 bg-clip-text text-transparent">
                      Discussion & History
                    </h2>
                  </div>
                  <TabsList className="w-full justify-start bg-white dark:bg-gray-950 border">
                    <TabsTrigger value="comments" className="gap-2 ">
                      <MessageSquare className="h-4 w-4" />
                      Comments
                      <Badge variant="secondary" className="ml-1 data-[state=active]:bg-white/20">
                        {bug.comments?.length || 0}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2 ">
                      <Clock className="h-4 w-4" />
                      Activity
                      <Badge variant="secondary" className="ml-1 data-[state=active]:bg-white/20">
                        {bug.activityLogs?.length || 0}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="pt-6">
                  <TabsContent value="comments" className="mt-0">
                    <BugComments bugId={bug.id} comments={bug.comments || []} />
                  </TabsContent>

                  <TabsContent value="activity" className="mt-0">
                    <BugActivityTimeline activities={bug.activityLogs || []} />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bug Group</span>
                    <div className="flex items-center gap-2">
                      <FolderTree className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{bug.bugGroup.name}</span>
                    </div>
                  </div>

                  {bug.deadline && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Deadline</span>
                        <div className="flex flex-col items-end">
                          <span className="font-medium">
                            {format(new Date(bug.deadline), "MMM d, yyyy")}
                          </span>
                          {new Date(bug.deadline) < new Date() && bug.status !== "CLOSED" && (
                            <div className="flex items-center gap-1 mt-1 text-destructive">
                              <AlertCircle className="h-3 w-3" />
                              <span className="text-xs font-medium">Overdue</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex items-start justify-between text-sm">
                    <span className="text-muted-foreground">Created by</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={bug.createdBy.image || undefined} />
                        <AvatarFallback className="text-xs">
                          {bug.createdBy.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{bug.createdBy.name}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span>{format(new Date(bug.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Updated</span>
                      <span>{format(new Date(bug.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function BugDetailSkeleton() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-8 w-96" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
