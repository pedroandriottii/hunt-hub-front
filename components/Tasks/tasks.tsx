"use client";
import React, { useEffect, useState } from "react";
import Task from "./task-component";
import { TaskSummary } from "./task-component";
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

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        const res = await fetch("http://localhost:8080/task");
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

    getAllTasks();
  }, []);

  const handleApply = async (taskId: UUID) => {
    try {
      const token = localStorage.getItem("accessToken");
      const hunterId = localStorage.getItem("userId");

      if (!token || !hunterId) {
        throw new Error("Missing access token or hunter ID.");
      }

      const response = await fetch(`http://localhost:8080/task/${taskId}/applying/${hunterId}`, {
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
          <Task
            key={`${taskSummary.id}-${index}`}
            {...taskSummary}
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
}