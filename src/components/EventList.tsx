"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EventList() {
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');
  
  const { data: events, error, isLoading, mutate } = useSWR(
    `/api/events?upcoming=${filter === 'upcoming'}`, 
    fetcher
  );

  const handleRSVP = async (eventId: number, status: 'CONFIRMED' | 'DECLINED') => {
    try {
      // Get user from localStorage (in a real app, this would come from auth context)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        toast.error("Please log in to RSVP");
        return;
      }

      const response = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          userId: user.id,
          status
        }),
      });

      if (response.ok) {
        toast.success(`RSVP ${status.toLowerCase()} successfully!`);
        mutate(); // Refresh the events list
      } else {
        toast.error("Failed to RSVP");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (error) return <div className="text-center text-red-600">Error loading events.</div>;
  if (isLoading) return <div className="text-center">Loading events...</div>;

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex space-x-4">
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming Events
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Events
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(events) && events.map((event: any) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            {event.imageUrl && (
              <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <Badge variant={new Date(event.date) > new Date() ? 'default' : 'secondary'}>
                  {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                {new Date(event.date).toLocaleTimeString()}
              </div>
              
              {event.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {event.location}
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-2" />
                {event.rsvps?.length || 0} attending
                {event.capacity && ` / ${event.capacity} max`}
              </div>

              {event.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {event.description}
                </p>
              )}

              <div className="pt-4 space-y-2">
                {new Date(event.date) > new Date() && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleRSVP(event.id, 'CONFIRMED')}
                      className="flex-1"
                    >
                      RSVP Yes
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRSVP(event.id, 'DECLINED')}
                      className="flex-1"
                    >
                      Can't Attend
                    </Button>
                  </div>
                )}
                <Button size="sm" variant="ghost" className="w-full" asChild>
                  <Link href={`/events/${event.id}`}>
                    <ExternalLink size={16} className="mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!events || !Array.isArray(events) || events.length === 0) && (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'upcoming' 
              ? "There are no upcoming events at the moment." 
              : "No events have been created yet."
            }
          </p>
          <Button asChild>
            <Link href="/events/create">Create First Event</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
