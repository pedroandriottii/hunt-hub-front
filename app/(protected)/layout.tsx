import TopNavbar from "@/components/base/top-navbar";
import LeftNavbar from "@/components/base/left-navbar";
import { Toaster } from "@/components/ui/toaster";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <LeftNavbar />
      <div className="flex flex-col w-full">
        <TopNavbar />
        <main className="flex-1 p-6  bg-slate-700 overflow-y-scroll">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  );
}