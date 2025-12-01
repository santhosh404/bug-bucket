"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectSettingsTabProps {
  project: any
}

export function ProjectSettingsTab({ project }: ProjectSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{project.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-sm text-muted-foreground">
              {project.description || "No description"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Visibility</label>
            <div className="mt-1">
              <Badge variant={project.visibility === "PUBLIC" ? "default" : "secondary"}>
                {project.visibility}
              </Badge>
            </div>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              Deleting this project will permanently remove all bugs, groups, and activity logs.
              This action cannot be undone.
            </AlertDescription>
          </Alert>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
