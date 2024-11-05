"use client";
import React, { useEffect, useState } from "react";
import Task from "./task-component";
import { TaskSummary } from "./task-component";

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
        id: task.id,
        ratingRequired: task.ratingRequired,
      }));
      
      setTaskSummaries(summaries);
      console.log(summaries);
    };
    getAllTasks();
  }, []);

  return (
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2">
          {taskSummaries.map((taskSummary, index) => (
              <Task key={`${taskSummary.id}-${index}`} {...taskSummary} />
          ))}
        </div>
      </div>
  );
}
