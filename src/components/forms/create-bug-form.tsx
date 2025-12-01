"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createBugSchema, type CreateBugInput } from "@/lib/validations"
import { useCreateBug, useProjectMembers, useBugGroups } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormFieldWrapper } from "@/components/form-field-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Loader2,
  Check,
  ChevronsUpDown,
  User,
  Flag,
  FolderTree,
  Calendar as CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateBugFormProps {
  projectId: string
  onSuccess?: () => void
}

export function CreateBugForm({ projectId, onSuccess }: CreateBugFormProps) {
  const createBug = useCreateBug()
  const { data: projectMembers = [] } = useProjectMembers(projectId)
  const { data: bugGroups = [] } = useBugGroups(projectId)
  const [openAssignee, setOpenAssignee] = useState(false)
  const [openBugGroup, setOpenBugGroup] = useState(false)

  const form = useForm<CreateBugInput>({
    resolver: zodResolver(createBugSchema),
    defaultValues: {
      projectId,
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
      bugGroupId: bugGroups[0]?.id || "",
    },
  })

  const selectedAssignee = projectMembers.find((m: any) => m.user.id === form.watch("assignedToId"))
  const selectedBugGroup = bugGroups.find((g: any) => g.id === form.watch("bugGroupId"))

  const onSubmit = async (data: CreateBugInput) => {
    await createBug.mutateAsync(data)
    form.reset()
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <FormFieldWrapper
            form={form}
            name="title"
            label="Bug Title"
            placeholder="e.g., Login button not responding on mobile"
            disabled={createBug.isPending}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <FormFieldWrapper
            form={form}
            name="description"
            label="Description"
            type="textarea"
            placeholder="Provide detailed information:&#10;• Steps to reproduce&#10;• Expected behavior&#10;• Actual behavior&#10;• Browser/device information"
            disabled={createBug.isPending}
          />
        </div>

        <Separator />

        {/* Quick Properties Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Priority
            </Label>
            <FormFieldWrapper
              form={form}
              name="priority"
              type="select"
              options={[
                { label: "🟢 Low", value: "LOW" },
                { label: "🟡 Medium", value: "MEDIUM" },
                { label: "🟠 High", value: "HIGH" },
                { label: "🔴 Critical", value: "CRITICAL" },
              ]}
              disabled={createBug.isPending}
              hideLabel
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <FormFieldWrapper
              form={form}
              name="status"
              type="select"
              options={[
                { label: "Open", value: "OPEN" },
                { label: "In Progress", value: "IN_PROGRESS" },
                { label: "Blocked", value: "BLOCKED" },
                { label: "Resolved", value: "RESOLVED" },
              ]}
              disabled={createBug.isPending}
              hideLabel
            />
          </div>
        </div>

        {/* Bug Group */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Bug Group
          </Label>
          <Popover open={openBugGroup} onOpenChange={setOpenBugGroup}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBugGroup}
                className="w-full justify-between"
                disabled={createBug.isPending || bugGroups.length === 0}
              >
                {selectedBugGroup ? (
                  <span>{selectedBugGroup.name}</span>
                ) : (
                  <span className="text-muted-foreground">Select bug group</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search bug group..." />
                <CommandList>
                  <CommandEmpty>No bug group found.</CommandEmpty>
                  <CommandGroup>
                    {bugGroups.map((group: any) => (
                      <CommandItem
                        key={group.id}
                        value={group.name}
                        onSelect={() => {
                          form.setValue("bugGroupId", group.id)
                          setOpenBugGroup(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.watch("bugGroupId") === group.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {group.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Assignee */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Assign To
          </Label>
          <Popover open={openAssignee} onOpenChange={setOpenAssignee}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openAssignee}
                className="w-full justify-between"
                disabled={createBug.isPending}
              >
                {selectedAssignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedAssignee.user.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {selectedAssignee.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedAssignee.user.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Assign to a team member</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search member..." />
                <CommandList>
                  <CommandEmpty>No member found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="unassigned"
                      onSelect={() => {
                        form.setValue("assignedToId", undefined)
                        setOpenAssignee(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !form.watch("assignedToId") ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="text-muted-foreground">Unassigned</span>
                    </CommandItem>
                    {projectMembers.map((member: any) => (
                      <CommandItem
                        key={member.user.id}
                        value={member.user.name}
                        onSelect={() => {
                          form.setValue("assignedToId", member.user.id)
                          setOpenAssignee(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            form.watch("assignedToId") === member.user.id
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
                          <span className="text-xs text-muted-foreground">{member.user.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Deadline (Optional)
          </Label>
          <FormFieldWrapper
            form={form}
            name="deadline"
            type="date"
            disabled={createBug.isPending}
            hideLabel
          />
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
            disabled={createBug.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createBug.isPending}>
            {createBug.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Bug
          </Button>
        </div>
      </form>
    </Form>
  )
}
