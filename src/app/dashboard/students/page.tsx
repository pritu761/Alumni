"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import RouteGuard from "@/components/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, Briefcase, MessageSquare, Star, Award, TrendingUp, Clock, UserPlus } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { publicFetcher } from "@/lib/fetcher";

export default function StudentsDashboard() {
  const { user } = useAuth();
  const { data: events } = useSWR('/api/events', publicFetcher);
  const { data: mentorship } = useSWR('/api/mentorship', publicFetcher);
  const { data: alumni } = useSWR('/api/alumni', publicFetcher);

  const dashboardStats = [
    {
      title: "Mentorship Requests",
      value: mentorship?.filter((m: any) => m.menteeId === user?.id).length || 0,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Events Registered",
      value: events?.filter((e: any) => e.rsvps?.some((r: any) => r.userId === user?.id)).length || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Alumni Connections",
      value: alumni?.alumni?.length || alumni?.length || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Career Resources",
      value: 25,
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const quickActions = [
    {
      title: "Request Mentorship",
      description: "Connect with experienced alumni mentors",
      icon: UserPlus,
      href: "/mentorship",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Browse Jobs",
      description: "Explore career opportunities posted by alumni",
      icon: Briefcase,
      href: "/jobs",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Join Events",
      description: "Attend networking events and workshops",
      icon: Calendar,
      href: "/events",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Alumni Directory",
      description: "Connect with graduates in your field",
      icon: Users,
      href: "/alumni",
      color: "from-orange-500 to-red-500"
    }
  ];

  const recentActivity = [
    { type: "mentorship", message: "New mentor response received", time: "2 hours ago", icon: MessageSquare },
    { type: "event", message: "Tech Career Fair registration confirmed", time: "1 day ago", icon: Calendar },
    { type: "job", message: "5 new job postings in your field", time: "2 days ago", icon: Briefcase },
    { type: "connection", message: "3 new alumni joined your department", time: "3 days ago", icon: Users }
  ];

  return (
    <RouteGuard requireAuth={true}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Your student dashboard - explore opportunities and connect with alumni
          </p>
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
                  Start your journey with these key activities
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

            {/* Career Resources */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Career Development
                </CardTitle>
                <CardDescription>
                  Resources to help you succeed in your career journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Award className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Resume Review</h4>
                      <p className="text-sm text-gray-600">Get your resume reviewed by alumni professionals</p>
                    </div>
                    <Button size="sm" className="ml-auto">Start</Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <BookOpen className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Interview Prep</h4>
                      <p className="text-sm text-gray-600">Practice interviews with industry professionals</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto">Learn More</Button>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Networking Events</h4>
                      <p className="text-sm text-gray-600">Join upcoming virtual and in-person events</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-auto">View Events</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Stay updated with your latest activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-gray-600 mt-0.5" />
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
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-900">Tech Career Fair</h4>
                    <p className="text-sm text-gray-600">Dec 15, 2024 • Virtual</p>
                    <div className="mt-2">
                      <Button size="sm" className="w-full">Join Event</Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-900">Alumni Networking</h4>
                    <p className="text-sm text-gray-600">Dec 20, 2024 • Campus</p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="w-full">RSVP</Button>
                    </div>
                  </div>
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
