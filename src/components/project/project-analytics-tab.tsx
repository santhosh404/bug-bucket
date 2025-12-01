"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useBugs } from "@/hooks/use-api"
import { BarChart3, Bug, AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface ProjectAnalyticsTabProps {
  project: any
}

const COLORS = {
  OPEN: "#3b82f6",
  IN_PROGRESS: "#eab308",
  BLOCKED: "#ef4444",
  RESOLVED: "#22c55e",
  CLOSED: "#6b7280",
}

const PRIORITY_COLORS = {
  LOW: "#6b7280",
  MEDIUM: "#3b82f6",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
}

export function ProjectAnalyticsTab({ project }: ProjectAnalyticsTabProps) {
  const { data: bugs = [], isLoading } = useBugs(project.id)

  if (isLoading) {
    return <AnalyticsSkeleton />
  }

  if (bugs.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No analytics yet"
        description="Create some bugs first to see analytics and insights about your project. 📊"
      />
    )
  }

  // Calculate stats
  const bugsByStatus = bugs.reduce((acc: any, bug: any) => {
    acc[bug.status] = (acc[bug.status] || 0) + 1
    return acc
  }, {})

  const bugsByPriority = bugs.reduce((acc: any, bug: any) => {
    acc[bug.priority] = (acc[bug.priority] || 0) + 1
    return acc
  }, {})

  const statusData = Object.entries(bugsByStatus).map(([status, count]) => ({
    name: status.replace(/_/g, " "),
    value: count,
    fill: COLORS[status as keyof typeof COLORS],
  }))

  const priorityData = Object.entries(bugsByPriority).map(([priority, count]) => ({
    name: priority,
    value: count,
    fill: PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS],
  }))

  const openBugs = bugs.filter((b: any) => b.status === "OPEN").length
  const inProgressBugs = bugs.filter((b: any) => b.status === "IN_PROGRESS").length
  const resolvedBugs = bugs.filter((b: any) => b.status === "RESOLVED").length
  const criticalBugs = bugs.filter((b: any) => b.priority === "CRITICAL").length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Bugs</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openBugs}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressBugs}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedBugs}</div>
            <p className="text-xs text-muted-foreground">Fixed bugs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Bug className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalBugs}</div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bugs by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bugs by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Project Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            📊 <strong>{bugs.length}</strong> total bugs tracked
          </p>
          <p className="text-sm">
            ✅ <strong>{((resolvedBugs / bugs.length) * 100).toFixed(1)}%</strong> resolution rate
          </p>
          <p className="text-sm">
            🎯 <strong>{openBugs + inProgressBugs}</strong> bugs need attention
          </p>
          {criticalBugs > 0 && (
            <p className="text-sm text-red-600">
              ⚠️ <strong>{criticalBugs}</strong> critical bug(s) require immediate action!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
