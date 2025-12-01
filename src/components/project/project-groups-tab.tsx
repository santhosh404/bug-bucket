"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/empty-state"
import { FolderTree, Plus, GripVertical, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateBugGroupForm } from "@/components/forms/create-bug-group-form"

interface ProjectGroupsTabProps {
  project: any
  isOwner: boolean
}

export function ProjectGroupsTab({ project, isOwner }: ProjectGroupsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const bugGroups = project.bugGroups || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bug Groups ({bugGroups.length})</h3>
        {isOwner && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Bug Group</DialogTitle>
                <DialogDescription>
                  Organize bugs into groups like "V1.0 Launch" or "Performance Issues".
                </DialogDescription>
              </DialogHeader>
              <CreateBugGroupForm
                projectId={project.id}
                onSuccess={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {bugGroups.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No bug groups yet"
          description="Create bug groups to organize your bugs by feature, version, or category. 📁"
          action={
            isOwner
              ? {
                  label: "Create Group",
                  onClick: () => setIsCreateDialogOpen(true),
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-2">
          {bugGroups.map((group: any) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {isOwner && (
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{group.name}</h4>
                    {group.description && (
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {group._count?.bugs || 0} bugs
                    </span>
                    {isOwner && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
