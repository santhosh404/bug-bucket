"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmptyState } from "@/components/empty-state"
import { useBugs, useBugGroups } from "@/hooks/use-api"
import { Bug, Plus, Search, Filter } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateBugForm } from "@/components/forms/create-bug-form"

interface ProjectBugsTabProps {
  project: any
  isOwner: boolean
}

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

export function ProjectBugsTab({ project, isOwner }: ProjectBugsTabProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setSearchQuery("")
  }, [pathname])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [bugGroupFilter, setBugGroupFilter] = useState<string>("all")
  const [assignedToMeFilter, setAssignedToMeFilter] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const { data: bugs = [], isLoading } = useBugs(project.id)
  const { data: bugGroups = [] } = useBugGroups(project.id)

  const hasActiveFilters =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    bugGroupFilter !== "all" ||
    assignedToMeFilter

  const clearFilters = () => {
    setStatusFilter("all")
    setPriorityFilter("all")
    setBugGroupFilter("all")
    setAssignedToMeFilter(false)
  }

  const filteredBugs = bugs.filter((bug: any) => {
    const matchesSearch =
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || bug.status === statusFilter
    const matchesPriority = priorityFilter === "all" || bug.priority === priorityFilter
    const matchesBugGroup = bugGroupFilter === "all" || bug.bugGroupId === bugGroupFilter
    const matchesAssignedToMe = !assignedToMeFilter || bug.assignedToId === session?.user?.id

    return (
      matchesSearch && matchesStatus && matchesPriority && matchesBugGroup && matchesAssignedToMe
    )
  })

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {
                      [
                        statusFilter !== "all",
                        priorityFilter !== "all",
                        bugGroupFilter !== "all",
                        assignedToMeFilter,
                      ].filter(Boolean).length
                    }
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Priority</Label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Bug Group</Label>
                    <Select value={bugGroupFilter} onValueChange={setBugGroupFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {bugGroups.map((group: any) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="assigned-to-me"
                      checked={assignedToMeFilter}
                      onCheckedChange={(checked) => setAssignedToMeFilter(checked as boolean)}
                    />
                    <Label
                      htmlFor="assigned-to-me"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Assigned to me
                    </Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Bug
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Bug</DialogTitle>
              <DialogDescription>Report a bug and assign it to a team member.</DialogDescription>
            </DialogHeader>
            <CreateBugForm projectId={project.id} onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Bugs Table */}
      {filteredBugs.length === 0 ? (
        bugs.length === 0 ? (
          <EmptyState
            icon={Bug}
            title="No bugs yet"
            description="Found a bug? Great — now you can track it here! Create your first bug to get started. 🐛"
            action={
              isOwner
                ? {
                    label: "Create Bug",
                    onClick: () => setIsCreateDialogOpen(true),
                  }
                : undefined
            }
          />
        ) : (
          <EmptyState
            icon={Search}
            title="No bugs found"
            description="No bugs match your search criteria. Try adjusting the filters."
          />
        )
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBugs.map((bug: any) => (
                <TableRow key={bug.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Link href={`/bugs/${bug.id}`} className="hover:underline">
                      {bug.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${statusColors[bug.status]}`} />
                      <span className="text-sm">{bug.status.replace(/_/g, " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariants[bug.priority]}>{bug.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    {bug.assignedTo ? (
                      <span className="text-sm">{bug.assignedTo.name}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{bug.bugGroup?.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(bug.createdAt), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
