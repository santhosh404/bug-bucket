"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface BugCommentsProps {
  bugId: string
  comments: any[]
}

export function BugComments({ bugId, comments }: BugCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch(`/api/bugs/${bugId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to add comment")
      }

      toast.success("Comment added successfully")
      queryClient.invalidateQueries({ queryKey: ["bugs", bugId] })
      setNewComment("")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <div className="rounded-xl p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
              <AvatarImage src={session?.user?.image || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-400 text-white">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts, ask questions, or provide updates..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[120px] resize-none  focus:border-purple-500 focus:ring-purple-500/20"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  💡 Tip: You can use line breaks and emojis
                </p>
                <Button
                  type="submit"
                  variant={"default"}
                  disabled={isSubmitting || !newComment.trim()}
                  className="hover:opacity-90 transition-opacity shadow-lg hover:shadow-purple-500/50"
                >
                  {isSubmitting ? (
                    "Posting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-purple-200 dark:border-purple-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Be the first to share your thoughts! Comments help team members collaborate and stay
              updated.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
              </h3>
            </div>
            {comments.map((comment: any) => (
              <Card
                key={comment.id}
                className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-purple-500/30"
              >
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 ring-2 ring-purple-100 dark:ring-purple-900">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
                      {comment.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{comment.user.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                        {comment.content}
                      </p>
                    </div>
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground w-full mb-1">
                          Attachments:
                        </p>
                        {comment.attachments.map((attachment: any) => (
                          <div
                            key={attachment.id}
                            className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
                          >
                            📎 {attachment.filename}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
