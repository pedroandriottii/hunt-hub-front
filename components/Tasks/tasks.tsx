"use client";

import React, { useEffect, useState } from "react";
import Task from "./task-component-hunter";
import { TaskSummary } from "./task-component-hunter";
import TaskPO from "./task-component-po";
import { toast } from "@/hooks/use-toast";
import MultiSelect from "@/components/ui/select";
import { Button } from "../ui/button";

export const FilterEnum = [
  "REWARD",
  "NUMBER OF MEETINGS",
  "RATING REQUIRED",
  "PO RATING",
  "NUMBER OF HUNTERS REQUIRED",
  "TAGS",
];

export const TagsEnum = [
  "KOTLIN", "NODE", "TYPESCRIPT", "CRIMINAL_DATA", "FIREBASE", "SQLITE",
  "SPRING", "STATISTICAL_DATA", "GOOGLE_CLOUD", "WEB_DEVELOPMENT",
  "DEEP_LEARNING", "FRONTEND", "CLOUD", "XAMARIN", "ELASTICSEARCH",
  "JAVA", "NATURAL_LANGUAGE_PROCESSING", "SCALA", "SYNCHRONOUS",
  "ACTIVEMQ", "HTML", "SQL", "DATA_SCIENCE", "NO_SQL", "MACHINE_LEARNING",
  "MEDICAL_DATA", "FULLSTACK", "RABBITMQ", "SECURITY", "ANGULAR", "C",
  "ASYNCHRONOUS", "GRAPHQL", "ANDROID", "EXPRESS", "MONGODB", "HASKELL",
  "APACHE_KAFKA", "PHP", "RUBY", "REDIS", "PYTHON", "DATABASE_MODELING",
  "REACT", "CSS", "RUST", "APACHE_CAMEL", "VUE", "GEOGRAPHICAL_DATA",
  "PRIVACY", "JAVASCRIPT", "AZURE", "OTHER", "SWIFT", "SQL_SERVER",
  "CPLUSPLUS", "API", "DATABASE", "FLUTTER", "DEVOPS", "MOBILE_DEVELOPMENT",
  "HISTORICAL_DATA", "MYSQL", "KAFKA", "REINFORCEMENT_LEARNING",
  "ARTIFICIAL_INTELLIGENCE", "BIG_DATA", "POSTGRESQL", "AWS", "CSHARP",
  "GO", "IOS", "BACKEND", "REACT_NATIVE", "APACHE_ACTIVEMQ", "ORACLE",
  "COMPUTER_VISION", "MICROSERVICES", "REST",
];

export default function Tasks() {
  const [taskSummaries, setTaskSummaries] = useState<TaskSummary[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | number | string[] | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const roleFromStorage = localStorage.getItem("role");
      setRole(roleFromStorage);
  
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
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
  
      const data: TaskSummary[] = await response.json();
      setTaskSummaries(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const applyFilters = async () => {
    try {
      setIsLoading(true);
  
      const backendFilterKeys: Record<string, string> = {
        "REWARD": "reward",
        "NUMBER OF MEETINGS": "numberOfMeetings",
        "RATING REQUIRED": "ratingRequired",
        "PO RATING": "PORating",
        "NUMBER OF HUNTERS REQUIRED": "numberOfHuntersRequired",
        "TAGS": "tags",
      };
  
      if (selectedFilter && filterValue !== null) {
        const backendKey = backendFilterKeys[selectedFilter];
        if (!backendKey) {
          toast({
            title: "Error",
            description: `Invalid Filter: ${selectedFilter}`,
            variant: "destructive",
          });
          return;
        }
  
        switch (backendKey) {
          case "numberOfMeetings":
          case "numberOfHuntersRequired":
            if (typeof filterValue !== "number" || filterValue < 1 || filterValue > 5) {
              toast({
                title: "Validation Error",
                description: `${selectedFilter} must be between 1 and 5.`,
                variant: "destructive",
              });
              return;
            }
            break;
          case "ratingRequired":
          case "PORating":
            if (typeof filterValue !== "number" || filterValue < 1 || filterValue > 5) {
              toast({
                title: "Validation Error",
                description: `${selectedFilter} must be between 1 and 5.`,
                variant: "destructive",
              });
              return;
            }
            break;
          default:
            break;
        }
  
        const params = new URLSearchParams();
        params.append(
          backendKey,
          Array.isArray(filterValue) ? filterValue.join(",") : filterValue.toString()
        );
  
        const response = await fetch(
          `http://localhost:8080/api/task/filter?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`Failed to apply filters: ${response.statusText}`);
        }
  
        const filteredTasks: TaskSummary[] = await response.json();
        setTaskSummaries(filteredTasks);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      toast({
        title: "Error applying filters",
        description: "Unable to filter tasks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="w-full">
      <div className="mb-4">
        {role !== "ROLE_PO" && (
          <div className="flex flex-col gap-2 text-black">
            {!selectedFilter ? (
              <div className="bg-white rounded">
                <MultiSelect
                  options={FilterEnum}
                  value={[]}
                  onChange={(selected) => setSelectedFilter(selected[0] || null)}
                />
              </div>
            ) : (
              <div className="flex flex-row gap-4 items-center text-black">
                {selectedFilter === "TAGS" ? (
                  <div className="bg-white rounded flex-grow">
                    <MultiSelect
                      options={TagsEnum}
                      value={Array.isArray(filterValue) ? filterValue : []}
                      onChange={(value) => setFilterValue(value)}
                    />
                  </div>
                ) : (
                  <input
                    type="number"
                    className="border rounded px-2 py-1 flex-grow"
                    placeholder={`Enter ${selectedFilter}`}
                    value={typeof filterValue === "number" ? filterValue : ""}
                    onChange={(e) => setFilterValue(parseInt(e.target.value, 10) || null)}
                  />
                )}
                <Button
                  className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => {
                    setSelectedFilter(null);
                    setFilterValue(null);
                    fetchTasks();
                  }}
                >
                  Reset
                </Button>

                <Button
                  variant="secondary"
                  className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                  onClick={applyFilters}
                  >
                  Apply Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading Tasks...</p>
      ) : taskSummaries.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {taskSummaries.map((taskSummary, index) =>
            role === "ROLE_HUNTER" ? (
              <Task key={`${taskSummary.id}-${index}`} {...taskSummary} />
            ) : (
              <TaskPO key={`${taskSummary.id}-${index}`} {...taskSummary} />
            )
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">There are no tasks available at the moment</p>
      )}
    </div>
  );
}
