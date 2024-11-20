"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProtectedLayout from "../protected-layout";

interface Task {
    id: string;
    description: string;
    title: string;
    deadline: string;
    reward: number;
    numberOfMeetings: number;
    numberOfHuntersRequired: number;
    ratingRequired: number;
    tags: string[];
}

export default function Component() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('accessToken');
                const hunterId = localStorage.getItem("userId");

                if (!token) {
                    throw new Error('No access token found');
                }

                const response = await fetch(`http://localhost:8080/task/not-applied/${hunterId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                setTasks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleApply = async (taskId: string) => {
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

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const jobTypes = [
        { name: "Web Development", count: 2000 },
        { name: "App Development", count: 1000 },
        { name: "Machine Learning", count: 1000 },
        { name: "Data Science", count: 1000 },
        { name: "Physical Computation", count: 300 },
        { name: "DevOps", count: 700 },
        { name: "Cyber Security", count: 500 },
        { name: "DataBase Engineering", count: 500 },
        { name: "Systems Architect", count: 100 },
        { name: "Other", count: 300 },
    ];

    const sortOptions = [
        "Most Well Compensated",
        "Best POs",
        "Most Time available",
        "Least Time available",
    ];


    return (
        <ProtectedLayout>
            <div className="min-h-screen bg-gray-100">
                <main className="p-6">
                <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <h1 className="text-2xl font-medium text-gray-700">Browse tasks</h1>
                    </div>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search tasks..."
                            className="w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="fixed-layout">
                        <div className="scrollable-container space-y-6">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h2 className="font-medium mb-4">Payment</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>5 USD</span>
                                            <span>10,000 USD</span>
                                        </div>
                                        <Slider
                                            defaultValue={[5000]}
                                            max={10000}
                                            min={5}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h2 className="font-medium mb-4">Rating Required</h2>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="4">4.0+ Stars</SelectItem>
                                            <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                            <SelectItem value="5">5.0 Stars</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h2 className="font-medium mb-4">Type</h2>
                                    <ul className="space-y-2">
                                        {jobTypes.map((type) => (
                                            <li key={type.name} className="flex items-center gap-2">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                                <span className="text-sm text-gray-600">{type.name}</span>
                                                <span className="text-xs text-gray-400">({type.count})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h2 className="font-medium mb-4">Sort By</h2>
                                    <ul className="space-y-2">
                                        {sortOptions.map((option) => (
                                            <li key={option} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    className="border-gray-300"
                                                />
                                                <span className="text-sm text-gray-600">{option}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        <div className="scrollable-container space-y-4">
                            {loading && <p>Loading tasks...</p>}
                            {error && <p className="text-red-500">Error: {error}</p>}
                            {!loading && !error && filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-white rounded-lg p-4 shadow-sm space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex gap-2 flex-wrap">
                                                {task.tags.map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="secondary"
                                                        className="rounded-full"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p className="text-gray-700">{task.title}</p>
                                            <p className="text-sm text-gray-500">{task.description}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-medium">{task.reward} USD</div>
                                            <div className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" className="w-full">
                                            View More
                                        </Button>
                                        <Button className="w-full" onClick={() => handleApply(task.id)}>Apply</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedLayout>
    );
}