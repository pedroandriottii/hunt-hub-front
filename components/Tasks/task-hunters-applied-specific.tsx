"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HunterDetails {
  id: string;
  levels: number;
  name: string;
  bio: string;
}

interface TaskHuntersAppliedSpecificProps {
  hunterId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskHuntersAppliedSpecific({ hunterId, isOpen, onClose }: TaskHuntersAppliedSpecificProps) {
  const [hunter, setHunter] = useState<HunterDetails | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHunterDetails = async () => {
      try {
        if (!hunterId) {
          throw new Error("Hunter ID is missing.");
        }

        console.log("Fetching details for Hunter ID:", hunterId);
        const res = await fetch(`http://localhost:8080/api/hunters/${hunterId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch hunter details. Status: ${res.status}`);
        }

        const data: HunterDetails = await res.json();
        console.log("Fetched Hunter Data:", data);
        setHunter(data);
      } catch (err) {
        console.error(`Error fetching hunter details for Hunter ID: ${hunterId}`, err);
        toast({
          title: "Error",
          description: `Failed to load hunter details. Please try again.`,
          variant: "destructive",
        });
      }
    };

    if (isOpen && hunterId) {
      fetchHunterDetails();
    }
  }, [hunterId, isOpen, toast]);

  const handleAccept = () => {
    toast({
      title: "Accepted",
      description: "You have accepted the hunter's application.",
    });
    onClose();
  };

  const handleRefuse = () => {
    toast({
      title: "Refused",
      description: "You have refused the hunter's application.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hunter Details</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          {hunter ? (
            <>
              <ul className="space-y-2">
                <li>
                  <span className="font-bold">Name:</span> {hunter.name}
                </li>
                <li>
                  <span className="font-bold">Level:</span> {hunter.levels}
                </li>
                <li>
                  <span className="font-bold">Biography:</span> {hunter.bio}
                </li>
              </ul>
              <div className="mt-4 flex justify-between">
                <Button variant="destructive" onClick={handleRefuse}>
                  Refuse
                </Button>
                <Button variant="default" onClick={handleAccept}>
                  Accept
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Loading hunter details...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
