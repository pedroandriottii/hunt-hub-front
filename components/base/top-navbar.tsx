'use client';
import { useEffect, useState } from "react";

export default function TopNavbar() {
    const [userData, setUserData] = useState({
        name: "",
        points: 0,
        levels: 0,
        profilePicture: "",
    });

    useEffect(() => {
        const role = localStorage.getItem("role");
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("accessToken");
        const url = role === "ROLE_PO"
            ? `http://localhost:8080/po/${id}`
            : `http://localhost:8080/hunters/${id}`;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados do usuário");
                }
                return response.json();
            })
            .then((data) => {
                setUserData({
                    name: data.name,
                    points: data.points,
                    levels: data.levels,
                    profilePicture: data.profilePicture || "img/profile.svg",
                });
            })
            .catch((error) => console.error("Erro ao buscar dados:", error));
    }, []);

    return (
        <div className="w-full bg-gray-900 h-20 flex items-center justify-end gap-4 pr-6">
            <div className="w-80 h-3/5 rounded-xl bg-black flex items-center justify-between border border-blue-400">
                <div className="w-8 h-8 rounded-full ml-4 flex items-center justify-center border border-blue-400">
                    <img
                        src={userData.profilePicture}
                        className="w-5"
                        alt="profile"
                    />
                </div>
                <p className="text-white text-sm">{userData.name}</p>
                <div className="h-full w-1/4 rounded-r-xl flex items-center justify-center border-l border-blue-400">
                    <p className="text-white">lvl.{userData.levels}</p>
                </div>
            </div>
            <div className="w-28 h-3/5 rounded-xl bg-black flex items-center px-3 justify-between border border-blue-400">
                <img src="img/gold.svg" className="w-6 h-6" alt="gold" />
                <p className="text-white text-sm">{userData.points}</p>
            </div>
        </div>
    );
}
