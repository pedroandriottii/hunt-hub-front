"use client";
import React, { useEffect, useState } from "react";
import Task from "./task-component";

export interface TaskSummary {
  title: string;
  description: string;
  reward: number;
  tags: string[];
  ratingRequired: number;
}

export default function Tasks() {
  const [taskSummaries, setTaskSummaries] = useState<TaskSummary[]>([]);

  useEffect(() => {
    const getAllTasks = async () => {
      const res = await fetch("http://localhost:8080/task");
      const data = await res.json();
      
      const summaries = data.map((task: any) => ({
        title: task.title,
        description: task.description,
        reward: task.reward,
        tags: task.tags,
        ratingRequired: task.ratingRequired,
      }));
      
      setTaskSummaries(summaries);
    };
    getAllTasks();
  }, []);

  return (
      <div>
        {taskSummaries.map((taskSummary) => (
          <Task key={taskSummary.title} {...taskSummary} />
        ))}
      </div>
  );
}
