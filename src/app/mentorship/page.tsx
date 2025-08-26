import MentorshipList from "@/components/MentorshipList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";

export default function MentorshipPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
          <p className="text-gray-600">
            Connect with experienced alumni for guidance or share your expertise as a mentor
          </p>
        </div>
        <Button asChild>
          <Link href="/mentorship/request">
            <Plus size={16} className="mr-2" />
            Find Mentor
          </Link>
        </Button>
      </div>
      
      <MentorshipList />
    </div>
  );
}
