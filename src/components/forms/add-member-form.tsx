"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addProjectMemberSchema, type AddProjectMemberInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface AddMemberFormProps {
  projectId: string
  onSuccess?: () => void
}

export function AddMemberForm({ projectId, onSuccess }: AddMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<AddProjectMemberInput>({
    resolver: zodResolver(addProjectMemberSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: AddProjectMemberInput) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to add member")
      }

      toast.success("Member added successfully!")
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
          name="email"
          label="Email Address"
          type="email"
          placeholder="user@example.com"
          description="The user must have an account to be added"
          disabled={isLoading}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Member
          </Button>
        </div>
      </form>
    </Form>
  )
}
