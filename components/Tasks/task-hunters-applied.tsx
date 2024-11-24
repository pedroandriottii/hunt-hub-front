"use client"

import React, { useEffect, useState } from "react"
import { UUID } from "crypto"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Hunter {
  id: UUID
  name: string
  email: string
  rating: number
}

interface TaskHuntersAppliedPopupProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
}

export function TaskHuntersAppliedPopup({ taskId, isOpen, onClose }: TaskHuntersAppliedPopupProps) {
  const [hunters, setHunters] = useState<Hunter[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchHunters = async () => {
      try {
        if (!taskId) {
          throw new Error("Task ID is missing.")
        }

        const res = await fetch(`http://localhost:8080/api/task/${taskId}/hunters`)

        if (res.status === 204 || res.status === 404 || !res.ok) {
          setHunters([])
          return
        }

        const data: Hunter[] = await res.json()
        setHunters(data)
      } catch (err) {
        console.error("Error fetching hunters:", err)
        toast({
          title: "Error",
          description: "Failed to load hunters. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (isOpen) {
      fetchHunters()
    }
  }, [taskId, isOpen, toast])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hunters Applied to the Task</DialogTitle>
          <DialogDescription>List of hunters who applied for this task.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {hunters.length > 0 ? (
            <ul className="space-y-4">
              {hunters.map((hunter, index) => (
                <li
                  key={`${hunter.id}-${index}`} 
                  className="border-b pb-2 last:border-b-0"
                >
                  <p className="font-semibold">{hunter.name}</p>
                  <p className="text-sm text-gray-500">{hunter.email}</p>
                  <p className="text-sm">Rating: {hunter.rating}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">There are no hunters applied for this task</p>
          )}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}