"use client";
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons"

interface HunterProfile {
  id: string;
  name: string;
  age: number;
  experience: string;
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
        const response = await fetch(`http://localhost:8080/api/hunters/${hunterId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });

        toast({
          title: 'Profile loaded successfully',
          description: 'The hunter profile was loaded successfully'
        });
        const data: HunterProfile = await response.json();
        setProfile(data);
      } catch (error) {
        toast({
          title: 'Error loading profile',
          description: 'An error occurred when trying to load the hunter profile. Please try again.',
          variant: 'destructive'
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100/40 p-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{profile?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{profile?.name}</h1>
                <p className="text-muted-foreground">
                  {profile?.experience || "No experience provided"}
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Hunter</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Tasks Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Completed Tasks (0)</h2>
            <p className="text-muted-foreground">No tasks completed yet</p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Card */}
          <Card className="p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
                <span className="text-3xl font-bold">Lvl 1</span>
              </div>
              <h2 className="text-xl font-semibold">Beginner</h2>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  i < 1 ? (
                    <StarFilledIcon key={i} className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <StarIcon key={i} className="h-5 w-5 text-gray-300" />
                  )
                ))}
              </div>
            </div>
          </Card>

          {/* Links Card */}
          <Card className="p-6">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Contact {profile?.name}
              </Button>
            </div>
          </Card>

          {/* Achievements Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-full bg-gray-100" />
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View More
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HunterProfilePage;
