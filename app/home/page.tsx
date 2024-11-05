

import Navbar from "@/components/base/login-navbar";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/grid-pattern";
import FeaturesSection from "@/components/home/features-section";
import ProtectedLayout from "../protected-layout";
import Task from "@/components/Tasks/task-component";
import { useEffect } from "react";
import Tasks from "@/components/Tasks/tasks";


export default function Home() {
    return (
    <ProtectedLayout>
        <Tasks />
    </ProtectedLayout>
  );
}
