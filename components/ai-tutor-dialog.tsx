"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Send, Sparkles } from "lucide-react"
import type { Question } from "@/lib/types"

interface AITutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: Question
}

export function AITutorDialog({ open, onOpenChange, question }: AITutorDialogProps) {
  const [userQuestion, setUserQuestion] = useState("")
  const [conversation, setConversation] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return

    setIsLoading(true)
    const newUserMessage = { role: "user" as const, content: userQuestion }
    setConversation([...conversation, newUserMessage])

    // Simulate AI response - in production, this would call an AI API
    setTimeout(() => {
      const aiResponse = {
        role: "assistant" as const,
        content: `Great question! Let me help you understand this better. 

The question "${question.question_text}" is testing your understanding of ${question.difficulty_level === 1 ? "basic" : question.difficulty_level === 2 ? "intermediate" : "advanced"} concepts.

${question.explanation || "Let me break this down step by step: First, identify the key information given. Then, apply the relevant formula or concept. Finally, verify your answer makes sense in the context of the question."}

Is there a specific part you'd like me to explain further?`,
      }
      setConversation((prev) => [...prev, aiResponse])
      setIsLoading(false)
      setUserQuestion("")
    }, 1500)
  }

  const handleQuickQuestion = (quickQ: string) => {
    setUserQuestion(quickQ)
  }

  const quickQuestions = [
    "Can you explain this in simpler terms?",
    "What concept is being tested here?",
    "How do I approach similar questions?",
    "What are common mistakes to avoid?",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            AI Tutor
          </DialogTitle>
          <DialogDescription>
            Ask me anything about this question and I'll help you understand it better
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {conversation.length === 0 ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
                <Sparkles className="h-5 w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Hi! I'm your AI tutor.</p>
                  <p className="text-sm text-muted-foreground">
                    I can help you understand this question better, explain concepts, and guide you through the
                    solution. Try asking me one of these questions:
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/5 transition-colors text-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((message, i) => (
                <div key={i} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/10 border border-accent/20"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-accent/10 border border-accent/20 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            placeholder="Ask me anything about this question..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleAskQuestion()
              }
            }}
            className="min-h-[60px] resize-none"
          />
          <Button
            onClick={handleAskQuestion}
            disabled={!userQuestion.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
