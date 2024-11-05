import TopNavbar from "@/components/base/top-navbar";
import LeftNavbar from "@/components/base/left-navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="flex h-screen">
      <LeftNavbar />
      <div className="flex flex-col w-full">
        <TopNavbar />
        <main className="flex-1 p-6  bg-slate-700">
          {children}
        </main>
      </div>
    </div>
  );
}