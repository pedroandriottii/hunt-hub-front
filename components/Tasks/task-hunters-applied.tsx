"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import { TaskHuntersAppliedSpecific } from "./task-hunters-applied-specific";

interface Hunter {
  id: string;
  name: string;
}

interface RawHunter {
  id: {
    id: string;
  };
  name: string;
}

interface TaskHuntersAppliedPopupProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskHuntersAppliedPopup({ taskId, isOpen, onClose }: TaskHuntersAppliedPopupProps) {
  const [hunters, setHunters] = useState<Hunter[]>([]);
  const { toast } = useToast();
  const [selectedHunterId, setSelectedHunterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHunters = async () => {
      try {
        if (!taskId) {
          throw new Error("Task ID is missing.");
        }

        console.log("Fetching hunters for task ID:", taskId);
        const res = await fetch(`http://localhost:8080/api/task/${taskId}/hunters`);

        if (res.status === 204 || res.status === 404 || !res.ok) {
          console.log("No hunters found or request failed with status:", res.status);
          setHunters([]);
          return;
        }

        const rawData: RawHunter[] = await res.json();
        console.log("Fetched hunters:", rawData);

        const processedData: Hunter[] = rawData.map((hunter) => ({
          id: hunter.id.id,
          name: hunter.name,
        }));

        setHunters(processedData);
      } catch (err) {
        console.error("Error fetching hunters:", err);
        toast({
          title: "Error",
          description: "Failed to load hunters. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      fetchHunters();
    }
  }, [taskId, isOpen, toast]);

  const handleHunterClick = (hunterId: string) => {
    console.log("Selected Hunter ID (on click):", hunterId);
    setSelectedHunterId(hunterId);
  };

  const handleSpecificPopupClose = () => {
    console.log("Closing specific hunter popup.");
    setSelectedHunterId(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby="task-hunters-description">
          <DialogHeader>
            <DialogTitle>Task´s applicants</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4" id="task-hunters-description">
            {hunters.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {hunters.map((hunter, index) => (
                  <div
                    key={`${hunter.id}-${index}`}
                    className="border rounded-md p-4 cursor-pointer hover:bg-gray-100 flex items-center gap-4"
                    onClick={() => handleHunterClick(hunter.id)}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-blue-400 text-white bg-gray-950">
                      <User className="w-6 h-6" />
                    </div>
                    <p className="font-semibold">{hunter.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">There are no hunters applied for this task</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {selectedHunterId && (
        <TaskHuntersAppliedSpecific
          hunterId={selectedHunterId}
          isOpen={!!selectedHunterId}
          onClose={handleSpecificPopupClose}
        />
      )}
    </>
  );
}