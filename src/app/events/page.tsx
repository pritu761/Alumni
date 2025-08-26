import EventList from "@/components/EventList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Events & Reunions</h1>
          <p className="text-gray-600">
            Stay connected through alumni events, reunions, and networking opportunities
          </p>
        </div>
        <Button asChild>
          <Link href="/events/create">
            <Plus size={16} className="mr-2" />
            Create Event
          </Link>
        </Button>
      </div>
      
      <EventList />
    </div>
  );
}
