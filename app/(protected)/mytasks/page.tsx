"use client";

import { useEffect, useState } from "react";
import { TaskSummary } from "@/components/Tasks/task-component-hunter";

export default function Page() {
    const [tasks, setTasks] = useState<TaskSummary[]>([]); // State to store tasks
    const [error, setError] = useState<string | null>(null); // State for error handling

    const getAllTasksByUserId = async () => {
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            setError("Token de acesso não encontrado");
            return;
        }

        let url: string;

        if (role === "ROLE_HUNTER") {
            url = `http://localhost:8080/api/task/hunter/${userId}`;
        } else {
            url = `http://localhost:8080/api/task/po/${userId}`;
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar tarefas: ${response.statusText}`);
            }

            const text = await response.text();
            if (!text) {
                setTasks([]); // No tasks
                return;
            }

            const tasks: TaskSummary[] = JSON.parse(text);
            setTasks(tasks);
            console.log("Tarefas recebidas:", tasks);
        } catch (err) {
            if (err instanceof SyntaxError) {
                console.error("Resposta não é um JSON válido:", err);
                setError("Erro: Resposta inesperada do servidor");
            } else {
                setError("Erro ao buscar tarefas");
                console.error(err);
            }
        }
    };

    useEffect(() => {
        getAllTasksByUserId();
    }, []);

    const navigateToTask = (taskId: string) => {
        window.location.href = `/task/${taskId}`;
    };

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : tasks.length > 0 ? (
                <ul className="space-y-4">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="p-4 bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-bold">{task.title}</h2>
                            <p className="text-gray-400">{task.description}</p>
                            <p className="mt-2">
                                <span className="text-yellow-400 font-medium">Reward:</span>{" "}
                                {task.reward} Gold
                            </p>
                            <p className="mt-1">
                                <span className="text-blue-400 font-medium">Rating Required:</span>{" "}
                                {task.ratingRequired}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {task.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <button
                                onClick={() => navigateToTask(task.id)}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Ver Detalhes
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">Você não está em nenhuma task no momento.</p>
            )}
        </div>
    );
}
