"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, BookOpen, DollarSign, TrendingUp, Mail, Phone } from "lucide-react";
import { publicFetcher, authenticatedFetcher } from "@/lib/fetcher";

export default function AdminDashboard() {
  const { data: alumniData } = useSWR('/api/alumni?limit=100', publicFetcher);
  const { data: eventsData } = useSWR('/api/events', publicFetcher);
  const { data: mentorshipData } = useSWR('/api/mentorship', authenticatedFetcher);
  const { data: donationsData } = useSWR('/api/donations', authenticatedFetcher);

  const stats = [
    {
      title: "Total Alumni",
      value: alumniData?.total || 0,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Events",
      value: eventsData?.filter((e: any) => new Date(e.date) > new Date()).length || 0,
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Mentorship Requests",
      value: mentorshipData?.filter((m: any) => m.status === 'PENDING').length || 0,
      icon: BookOpen,
      color: "text-orange-600"
    },
    {
      title: "Total Donations",
      value: `$${donationsData?.reduce((sum: number, d: any) => sum + d.amount, 0).toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="alumni" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="alumni" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Alumni</h3>
            <Button>Add Alumni</Button>
          </div>
          <div className="grid gap-4">
            {alumniData?.alumni?.slice(0, 5).map((alumni: any) => (
              <Card key={alumni.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {alumni.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{alumni.name}</p>
                      <p className="text-sm text-gray-600">
                        {alumni.degree} • Class of {alumni.graduationYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Mail size={16} />
                    </Button>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Event Management</h3>
            <Button asChild>
              <Link href="/events/create">Create Event</Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {eventsData?.slice(0, 5).map((event: any) => (
              <Card key={event.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} • {event.rsvps?.length || 0} attending
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={new Date(event.date) > new Date() ? 'default' : 'secondary'}>
                      {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                    </Badge>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Mentorship Requests</h3>
          </div>
          <div className="grid gap-4">
            {mentorshipData?.slice(0, 5).map((request: any) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{request.subject}</p>
                    <Badge 
                      variant={
                        request.status === 'PENDING' ? 'destructive' :
                        request.status === 'ACCEPTED' ? 'default' : 'secondary'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    From: {request.mentee?.name} → To: {request.mentor?.user?.name}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">{request.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Donations</h3>
          </div>
          <div className="grid gap-4">
            {donationsData?.slice(0, 5).map((donation: any) => (
              <Card key={donation.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{donation.user?.name}</p>
                    <p className="text-sm text-gray-600">
                      {donation.purpose || 'General Fund'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-green-600">
                      ${donation.amount.toLocaleString()}
                    </span>
                    <Badge 
                      variant={
                        donation.status === 'COMPLETED' ? 'default' :
                        donation.status === 'PENDING' ? 'secondary' : 'destructive'
                      }
                    >
                      {donation.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
