"use client";
import React, { useEffect, useState } from "react";
import Task from "./task-component-hunter";
import { TaskSummary } from "./task-component-hunter";
import TaskPO from "./task-component-po";
import { UUID } from "crypto";

interface TaskApiResponse {
  title: string;
  description: string;
  reward: number;
  tags: string[];
  id: UUID;
  ratingRequired: number;
}

export default function Tasks() {
  const [taskSummaries, setTaskSummaries] = useState<TaskSummary[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    setRole(roleFromStorage);

    const fetchTasks = async () => {
      try {
        if (!roleFromStorage) {
          console.error("Role is not defined in localStorage.");
          return;
        }

        let url = "http://localhost:8080/api/task";
        if (roleFromStorage === "ROLE_PO") {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            throw new Error("User ID is missing in localStorage.");
          }
          url = `http://localhost:8080/api/task/po/${userId}`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch tasks: ${res.statusText}`);
        }

        const data: TaskApiResponse[] = await res.json();

        const summaries: TaskSummary[] = data.map((task) => ({
          title: task.title,
          description: task.description,
          reward: task.reward,
          tags: task.tags,
          id: task.id,
          ratingRequired: task.ratingRequired,
          onApply: () => {},
        }));

        setTaskSummaries(summaries);
        console.log(summaries);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const handleApply = async (taskId: UUID) => {
    try {
      const token = localStorage.getItem("accessToken");
      const hunterId = localStorage.getItem("userId");

      if (!token || !hunterId) {
        throw new Error("Missing access token or hunter ID.");
      }

      const response = await fetch(`http://localhost:8080/api/task/${taskId}/applying/${hunterId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to apply: ${response.statusText}`);
      }

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error("Error applying to task:", error);
      alert("Could not apply to task. Please try again later.");
    }
  };

  return (
    <div className="w-full">
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
    </div>
  );
}
