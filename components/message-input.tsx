import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, Paperclip, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function MessageInput() {
  return (
    <div className="relative flex w-full">
      <textarea
        aria-label="Write your prompt here"
        placeholder="Ask AI..."
        className="z-10 w-full grow resize-none rounded-xl border border-input bg-background p-3 pr-24 text-sm ring-offset-background transition-[border] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="absolute right-3 top-3 z-20 flex gap-2">
        <Button size="icon" variant="outline" className="h-8 w-8" aria-label="Attach a file">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button size="icon" className="h-8 w-8" aria-label="Send message">
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export function InterruptPrompt({ isOpen }: { isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ top: 0, filter: "blur(5px)" }}
          animate={{ top: -40, filter: "blur(0px)", transition: { type: "spring", filter: { type: "tween" } } }}
          exit={{ top: 0, filter: "blur(5px)" }}
          className="absolute left-1/2 flex -translate-x-1/2 overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-sm text-muted-foreground"
        >
          <span className="ml-2.5">Press Enter again to interrupt</span>
          <button className="ml-1 mr-2.5 flex items-center" type="button" aria-label="Close">
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function FileUploadOverlay({ isDragging }: { isDragging: boolean }) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center space-x-2 rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <Paperclip className="h-4 w-4" />
          <span>Drop your files here to attach them.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
