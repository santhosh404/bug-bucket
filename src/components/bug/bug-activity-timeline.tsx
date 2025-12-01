"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import {
  Activity,
  Plus,
  Edit3,
  Trash2,
  MessageSquare,
  UserPlus,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle2,
  Circle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react"

interface BugActivityTimelineProps {
  activities: any[]
}

export function BugActivityTimeline({ activities }: BugActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
          <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Activity history will appear here as actions are performed on this bug.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {activities.length} {activities.length === 1 ? "Activity" : "Activities"}
        </h3>
      </div>
      {activities.map((activity: any, index: number) => (
        <div key={activity.id} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-purple-100 dark:ring-purple-900 transition-all group-hover:ring-purple-300 dark:group-hover:ring-purple-700">
                <AvatarImage src={activity.user?.image || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                  {activity.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                {getActivityIcon(activity)}
              </div>
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-full bg-gradient-to-b from-purple-200 to-transparent dark:from-purple-800 mt-2 min-h-[40px]" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="bg-card rounded-lg border border-purple-100 dark:border-purple-900/30 p-3 hover:shadow-md transition-all group-hover:border-purple-300 dark:group-hover:border-purple-700">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">
                      {activity.user?.name || "Unknown"}
                    </span>{" "}
                    <span className="text-muted-foreground">{getActivityMessage(activity)}</span>
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 whitespace-nowrap">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div className="mt-2 pt-2 border-t border-purple-100 dark:border-purple-900/30">
                  {renderMetadata(activity)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getActivityIcon(activity: any) {
  const action = activity.action.toLowerCase()
  const iconClass = "h-3.5 w-3.5"

  switch (action) {
    case "created":
      return <Plus className={`${iconClass} text-green-600`} />
    case "updated":
      return <Edit3 className={`${iconClass} text-blue-600`} />
    case "deleted":
      return <Trash2 className={`${iconClass} text-red-600`} />
    case "commented":
      return <MessageSquare className={`${iconClass} text-purple-600`} />
    case "assigned":
      return <UserPlus className={`${iconClass} text-indigo-600`} />
    case "status_changed":
      return getStatusIcon(activity.metadata?.to)
    case "priority_changed":
      return getPriorityIcon(activity.metadata?.to)
    default:
      return <Circle className={`${iconClass} text-muted-foreground`} />
  }
}

function getStatusIcon(status: string) {
  const iconClass = "h-3.5 w-3.5"
  switch (status?.toUpperCase()) {
    case "OPEN":
      return <Circle className={`${iconClass} text-blue-600`} />
    case "IN_PROGRESS":
      return <Clock className={`${iconClass} text-yellow-600`} />
    case "BLOCKED":
      return <AlertCircle className={`${iconClass} text-red-600`} />
    case "RESOLVED":
      return <CheckCircle2 className={`${iconClass} text-green-600`} />
    case "CLOSED":
      return <XCircle className={`${iconClass} text-gray-600`} />
    default:
      return <Circle className={`${iconClass} text-muted-foreground`} />
  }
}

function getPriorityIcon(priority: string) {
  const iconClass = "h-3.5 w-3.5"
  switch (priority?.toUpperCase()) {
    case "CRITICAL":
    case "HIGH":
      return <ArrowUpCircle className={`${iconClass} text-red-600`} />
    case "LOW":
      return <ArrowDownCircle className={`${iconClass} text-green-600`} />
    default:
      return <Circle className={`${iconClass} text-yellow-600`} />
  }
}

function getActivityMessage(activity: any): string {
  const action = activity.action.toLowerCase()
  const entityType = activity.entityType

  switch (action) {
    case "created":
      return `created this ${entityType}`
    case "updated":
      return `made changes to this ${entityType}`
    case "deleted":
      return `deleted this ${entityType}`
    case "commented":
      return `left a comment`
    case "assigned":
      return `assigned this bug to someone`
    case "status_changed":
      return `updated the status`
    case "priority_changed":
      return `changed the priority level`
    default:
      return action.replace(/_/g, " ")
  }
}

function renderMetadata(activity: any) {
  const metadata = activity.metadata

  if (metadata.from && metadata.to) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <Badge
          variant="outline"
          className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
        >
          {formatValue(metadata.from)}
        </Badge>
        <span className="text-muted-foreground">→</span>
        <Badge
          variant="outline"
          className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
        >
          {formatValue(metadata.to)}
        </Badge>
      </div>
    )
  }

  if (metadata.bugTitle) {
    return (
      <p className="text-xs text-muted-foreground">
        <span className="font-medium">Bug:</span> {metadata.bugTitle}
      </p>
    )
  }

  if (metadata.assignedTo) {
    return (
      <p className="text-xs text-muted-foreground">
        <span className="font-medium">Assigned to:</span> {metadata.assignedTo}
      </p>
    )
  }

  if (metadata.priority) {
    return (
      <Badge variant="outline" className="text-xs">
        {metadata.priority}
      </Badge>
    )
  }

  return (
    <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1">
      {JSON.stringify(metadata, null, 2)}
    </div>
  )
}

function formatValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
}
