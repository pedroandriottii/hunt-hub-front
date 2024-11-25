"use client";

import React, { useEffect, useState } from "react";
import Task from "./task-component-hunter";
import { TaskSummary } from "./task-component-hunter";
import TaskPO from "./task-component-po";
import { UUID } from "crypto";
import { toast } from "@/hooks/use-toast";

interface TaskApiResponse {
  id: UUID;
  title: string;
  description: string;
  reward: number;
  tags: string[];
  ratingRequired: number;
  deadline: string;
  numberOfHuntersRequired: number;
  numberOfMeetings: number;
  po_id: string;
  status: string;
}

export const handleApply = async (taskId: UUID) => {
  try {
    const token = localStorage.getItem("accessToken");
    const hunterId = localStorage.getItem("userId");

    if (!token || !hunterId) {
      throw new Error("Missing access token or hunter ID.");
    }

    const response = await fetch(`http://localhost:8080/api/task/${taskId}/applying/${hunterId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to apply: ${response.statusText}`);
    }

    const result = await response.text();
    toast({
      title: "Aplicado com sucesso!",
      description: result,
      duration: 5000,
      variant: "default",
    });
  } catch (error) {
    console.error("Error applying to task:", error);
    toast({
      title: "Erro ao aplicar",
      description: "Erro ao aplicar para a tarefa. Tente novamente mais tarde.",
      duration: 5000,
      variant: "destructive",
    });
  }
};

export default function Tasks() {
  const [taskSummaries, setTaskSummaries] = useState<TaskSummary[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    setRole(roleFromStorage);

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        if (!roleFromStorage) {
          console.error("Role is not defined in localStorage.");
          return;
        }

        let url = "http://localhost:8080/api/task";
        if (roleFromStorage === "ROLE_PO") {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            console.warn("User ID is missing in localStorage.");
            return;
          }
          url = `http://localhost:8080/api/task/po/${userId}`;
        }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`No tasks found or request failed: ${response.statusText}`);
        }

        const data: TaskApiResponse[] = await response.json();

        if (data.length === 0) {
          console.log("No tasks available.");
          setTaskSummaries([]);
          return;
        }

        const summaries: TaskSummary[] = data.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          reward: task.reward,
          tags: task.tags,
          ratingRequired: task.ratingRequired,
          deadline: task.deadline,
          number_of_hunters_required: task.numberOfHuntersRequired,
          number_of_meetings: task.numberOfMeetings,
          onApply: () => { },
        }));

        setTaskSummaries(summaries);
        console.log("Task Summaries:", summaries);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="w-full">
      {isLoading ? (
        <p className="text-center text-gray-500">Carregando tarefas...</p>
      ) : taskSummaries.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {taskSummaries.map((taskSummary, index) => (
            role === "ROLE_HUNTER" ? (
              <Task
                key={`${taskSummary.id}-${index}`}
                {...taskSummary}
                onApply={handleApply}
              />
            ) : (
              <TaskPO
                key={`${taskSummary.id}-${index}`}
                {...taskSummary}
              />
            )
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No momento, não há tarefas disponíveis.</p>
      )}
    </div>
  );
}