'use client';

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface POProfile {
  id: string;
  name: string;
  level: number;
  experience: string;
  projects?: string[];
}

export default function PoPage() {
  const [profile, setProfile] = useState<POProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const poId = localStorage.getItem('userId');
      if (!poId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const response = await fetch(`http://localhost:8080/api/po/${poId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data: POProfile = await response.json();
        setProfile(data);

        toast({
          title: 'Profile loaded successfully',
          description: 'The PO profile was loaded successfully',
        });
      } catch (error) {
        toast({
          title: 'Error loading profile',
          description: 'An error occurred while loading the PO profile. Please try again.',
          variant: 'destructive',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">
                  {profile.experience || "No experience provided"}
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Product Owner</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Open Tasks ({profile.projects ? profile.projects.length : 0})
            </h2>
            {profile.projects && profile.projects.length > 0 ? (
              <div className="space-y-4">
                {profile.projects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-gray-700 border-gray-600">
                    <div>
                      <h3 className="font-medium text-gray-200 mb-2">Task {index + 1}: {project}</h3>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-sm rounded bg-purple-600 text-white">Design</span>
                        <span className="px-2 py-1 text-sm rounded bg-blue-600 text-white">Development</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">View Details</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tasks available yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Card */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <div className="text-center">
              <div className="inline-block px-4 py-2 rounded-lg bg-gray-700 mb-4">
                <span className="text-3xl font-bold text-gray-200">
                  Lvl {profile.level !== undefined ? profile.level : 0}
                </span>
              </div>
              <h2 className="text-sm text-gray-400">Legend</h2>
              <div className="flex justify-center mt-2">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className={i < profile.level ? "text-yellow-500" : "text-gray-500"}>{star}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-full bg-gray-100" />
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
