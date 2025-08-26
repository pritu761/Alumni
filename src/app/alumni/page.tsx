import AlumniList from "@/components/AlumniList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

export default function AlumniPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600">
            Connect with fellow graduates and expand your professional network
          </p>
        </div>
        <Button asChild>
          <Link href="/alumni/create">
            <Plus size={16} className="mr-2" />
            Add Profile
          </Link>
        </Button>
      </div>
      
      <AlumniList />
    </div>
  );
}
