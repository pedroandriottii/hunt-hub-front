'use client';

import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";

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

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  skills: string[];
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
  projects: Project[];
  rating: number;
  ratingCount: number;
  tasks: Task[];
  totalRating: number;
}

const HunterProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<HunterProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const hunterId = localStorage.getItem('userId');
      if (!hunterId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Missing access token.');
        }

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

        const data: HunterProfile = await response.json();
        setProfile(data);
      } catch (error) {
        toast({
          title: 'Error loading profile',
          description: 'An error occurred when trying to load the hunter profile. Please try again.',
          variant: 'destructive'
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <div className="text-center p-6 text-gray-200 bg-gray-900 min-h-screen">No profile data available</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-200 p-6 min-h-screen">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-gray-800 border-none shadow-none">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profilePicture || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-gray-400">{profile.bio || "Hey there, I'm a dev currently located in Recife, Brazil, studying computer science at CESAR school!"}</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">{cert}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-none shadow-none">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Completed Tasks ({profile.tasks.length})</h2>
              <div className="space-y-4">
                {profile.tasks.length === 0 ? (
                  <p className="text-gray-400">No tasks completed yet</p>
                ) : (
                  profile.tasks.map((task) => (
                    <Card key={task.id} className="bg-gray-700 border-none shadow-none">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-200">{task.title}</h3>
                        <p className="text-sm text-gray-400">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-800 border-none shadow-none">
            <CardContent className="pt-6 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-gray-700 p-4 mb-4">
                <span className="text-3xl font-bold text-gray-200">Lvl {profile.levels}</span>
              </div>
              <h2 className="text-xl font-semibold">Legend</h2>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  i < Math.round(profile.rating) ? (
                    <StarFilledIcon key={i} className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <StarIcon key={i} className="h-5 w-5 text-gray-500" />
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-none shadow-none">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-gray-200 border-gray-600">
                  {profile.email}
                </Button>
                <Button variant="outline" className="w-full justify-start text-gray-200 border-gray-600">
                  {profile.linkPortfolio}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-none shadow-none">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="grid grid-cols-3 gap-4">
                {profile.achievements.slice(0, 9).map((achievement) => (
                  <div key={achievement.id} className="aspect-square rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs text-center p-1 text-gray-200">{achievement.name}</span>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 9 - profile.achievements.length) }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-full bg-gray-600" />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-gray-200 hover:bg-gray-700">
                View More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ProfileSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card className="bg-gray-800 border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-full bg-gray-700" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-1/2 bg-gray-600" />
                <Skeleton className="h-4 w-full bg-gray-600" />
                <Skeleton className="h-4 w-3/4 bg-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-none shadow-none">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-1/4 bg-gray-600" />
            <Skeleton className="h-24 w-full bg-gray-700" />
            <Skeleton className="h-24 w-full bg-gray-700" />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="bg-gray-800 border-none shadow-none">
          <CardContent className="p-6 text-center">
            <Skeleton className="h-16 w-16 rounded-full bg-gray-700 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 bg-gray-600 mx-auto" />
            <Skeleton className="h-4 w-1/4 bg-gray-600 mx-auto mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-none shadow-none">
          <CardContent className="p-6 space-y-2">
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-none shadow-none">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/2 bg-gray-600 mb-4" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-full bg-gray-700" />
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-4 bg-gray-700" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default HunterProfilePage;
