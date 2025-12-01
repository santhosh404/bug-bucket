"use client"

import * as React from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form"

interface FormFieldWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  label?: string
  description?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "date" | "textarea" | "select"
  options?: { label: string; value: string }[]
  disabled?: boolean
  hideLabel?: boolean
}

export function FormFieldWrapper<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  type = "text",
  options,
  disabled,
  hideLabel = false,
}: FormFieldWrapperProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!hideLabel && label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value || ""}
              />
            ) : type === "select" ? (
              <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value || ""}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
