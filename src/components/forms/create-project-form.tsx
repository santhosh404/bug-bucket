"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations"
import { useCreateProject } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Loader2 } from "lucide-react"

interface CreateProjectFormProps {
  onSuccess?: () => void
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const createProject = useCreateProject()

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "PRIVATE",
    },
  })

  const onSubmit = async (data: CreateProjectInput) => {
    await createProject.mutateAsync(data)
    form.reset()
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldWrapper
          form={form}
          name="name"
          label="Project Name"
          placeholder="My Awesome Project"
          disabled={createProject.isPending}
        />

        <FormFieldWrapper
          form={form}
          name="description"
          label="Description"
          type="textarea"
          placeholder="Describe what this project is about..."
          description="Optional. A brief description of your project."
          disabled={createProject.isPending}
        />

        <FormFieldWrapper
          form={form}
          name="visibility"
          label="Visibility"
          type="select"
          options={[
            { label: "Private - Only members can view", value: "PRIVATE" },
            { label: "Public - Anyone can view", value: "PUBLIC" },
          ]}
          description="Control who can see this project"
          disabled={createProject.isPending}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={createProject.isPending}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg hover:shadow-purple-500/50"
          >
            {createProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Project
          </Button>
        </div>
      </form>
    </Form>
  )
}
