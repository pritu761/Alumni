"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import RouteGuard from "@/components/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageSquare, Building2, MapPin, Trophy, TrendingUp, Clock, Edit3, Settings, Heart, Star } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { publicFetcher, authenticatedFetcher } from "@/lib/fetcher";

export default function AlumniDashboard() {
  const { user } = useAuth();
  const { data: events } = useSWR('/api/events', publicFetcher);
  const { data: mentorship } = useSWR('/api/mentorship', authenticatedFetcher);
  const { data: donations } = useSWR('/api/donations', authenticatedFetcher);

  const dashboardStats = [
    {
      title: "Profile Views",
      value: Math.floor(Math.random() * 100) + 50,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12%"
    },
    {
      title: "Events Attended",
      value: events?.filter((e: any) => e.rsvps?.some((r: any) => r.userId === user?.id && r.status === 'CONFIRMED')).length || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+8%"
    },
    {
      title: "Mentorship Provided",
      value: mentorship?.filter((m: any) => m.mentorId === user?.id).length || 0,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+5%"
    },
    {
      title: "Total Donations",
      value: `$${donations?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0}`,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "+15%"
    }
  ];

  const quickActions = [
    {
      title: "Update Profile",
      description: "Keep your professional information current",
      icon: Edit3,
      href: "/alumni/create",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Join Events",
      description: "Attend alumni reunions and networking events",
      icon: Calendar,
      href: "/events",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Donate",
      description: "Support your alma mater and fellow alumni",
      icon: Heart,
      href: "/donations",
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Become a Mentor",
      description: "Guide current students and recent graduates",
      icon: MessageSquare,
      href: "/mentorship",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const recentActivity = [
    { type: "mentorship", message: "New mentorship request from Sarah Chen", time: "3 hours ago", icon: MessageSquare },
    { type: "event", message: "Registered for Alumni Gala 2024", time: "1 day ago", icon: Calendar },
    { type: "donation", message: "Donation of $100 processed successfully", time: "2 days ago", icon: Heart },
    { type: "profile", message: "Profile viewed by 5 new connections", time: "3 days ago", icon: Users }
  ];

  const upcomingEvents = [
    {
      title: "Alumni Gala 2024",
      date: "Dec 15, 2024",
      location: "Grand Ballroom",
      status: "confirmed",
      attendees: 245
    },
    {
      title: "Tech Industry Meetup",
      date: "Dec 22, 2024",
      location: "Innovation Hub",
      status: "pending",
      attendees: 67
    },
    {
      title: "Annual Fundraiser",
      date: "Jan 10, 2025",
      location: "Virtual Event",
      status: "available",
      attendees: 120
    }
  ];

  return (
    <RouteGuard requireAuth={true}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 🎓
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {user?.currentJobTitle} at {user?.currentCompany}
              {user?.graduationYear && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>Class of {user.graduationYear}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/alumni/create">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                      </div>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-full`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Make the most of your alumni network membership
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
                        <Link href={action.href}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`bg-gradient-to-r ${action.color} p-2 rounded-lg`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Professional Impact */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Your Impact
                </CardTitle>
                <CardDescription>
                  See how you're contributing to the alumni community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Mentorship</h4>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Currently mentoring 3 students</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Event Participation</h4>
                        <Badge variant="secondary">High</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Attended 8 events this year</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Giving Back</h4>
                        <Badge variant="secondary">Supporter</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Total donations: $500 this year</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity & Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <IconComponent className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Your Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <Badge 
                          variant={event.status === 'confirmed' ? 'default' : event.status === 'pending' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        {event.attendees} attendees
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/events">View All Events</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
