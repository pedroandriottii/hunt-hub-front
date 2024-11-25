'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  reward: number;
  numberOfMeetings: number;
  numberOfHuntersRequired: number;
  ratingRequired: number;
}

interface HunterProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  bio: string;
  profilePicture: string;
  achievements: Achievement[];
  certifications: string[];
  levels: number;
  linkPortfolio: string;
  rating: number;
  tasks: Task[];
}

const fetchProfile = async (): Promise<HunterProfile | null> => {
  const hunterId = localStorage.getItem('userId');
  if (!hunterId) return null;

  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('Missing access token.');

  const response = await fetch(`http://localhost:8080/api/hunters/${hunterId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

export default function HunterProfilePage() {
  const [profile, setProfile] = useState<HunterProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-200">Profile not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <div className="flex items-start gap-6">
              <User className="h-24 w-24 text-gray-200" />
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-400">{profile.bio || "No bio available"}</p>
                <div className="flex gap-2">
                  {profile.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary">{cert}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Completed Tasks ({profile.tasks.length})
            </h2>
            {profile.tasks.length > 0 ? (
              <div className="space-y-4">
                {profile.tasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg shadow-sm bg-gray-700 border-gray-600">
                    <h3 className="font-medium text-gray-200 mb-2">{task.title}</h3>
                    <p className="text-gray-400">{task.description}</p>
                    <div className="flex justify-end mt-4">
                      <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                        View More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tasks available yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <div className="text-center">
              <div className="inline-block px-4 py-2 rounded-lg bg-gray-700 mb-4">
                <span className="text-3xl font-bold text-gray-200">Lvl {profile.levels}</span>
              </div>
              <h2 className="text-sm text-gray-400">Legend</h2>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(profile.rating) ? "text-yellow-500" : "text-gray-500"}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-3 gap-4">
              {profile.achievements.slice(0, 9).map((achievement) => (
                <div key={achievement.id} className="aspect-square rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-xs text-center p-1 text-gray-200">{achievement.name}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
