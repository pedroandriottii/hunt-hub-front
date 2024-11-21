import ProtectedLayout from "../protected-layout";
import Tasks from "@/components/Tasks/tasks";


export default function Home() {
  return (
    <ProtectedLayout>
      <Tasks />
    </ProtectedLayout>
  );
}
