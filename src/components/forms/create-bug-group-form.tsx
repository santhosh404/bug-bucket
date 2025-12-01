"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createBugGroupSchema, type CreateBugGroupInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface CreateBugGroupFormProps {
  projectId: string
  onSuccess?: () => void
}

export function CreateBugGroupForm({ projectId, onSuccess }: CreateBugGroupFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CreateBugGroupInput>({
    resolver: zodResolver(createBugGroupSchema),
    defaultValues: {
      projectId,
      name: "",
      description: "",
    },
  })

  const onSubmit = async (data: CreateBugGroupInput) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/projects/${projectId}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to create bug group")
      }

      toast.success("Bug group created successfully!")
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] })
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldWrapper
          form={form}
          name="name"
          label="Group Name"
          placeholder="V1.0 Launch Bugs"
          disabled={isLoading}
        />

        <FormFieldWrapper
          form={form}
          name="description"
          label="Description (Optional)"
          type="textarea"
          placeholder="Describe this bug group..."
          disabled={isLoading}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Group
          </Button>
        </div>
      </form>
    </Form>
  )
}
