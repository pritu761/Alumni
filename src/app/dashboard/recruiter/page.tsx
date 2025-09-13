"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import RouteGuard from "@/components/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageSquare, Building2, Briefcase, Trophy, TrendingUp, Clock, Plus, FileText, UserCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { authenticatedFetcher } from "@/lib/fetcher";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { data: jobs } = useSWR('/api/jobs', authenticatedFetcher);
  const { data: candidates } = useSWR('/api/jobs/applications', authenticatedFetcher);

  const dashboardStats = [
    {
      title: "Active Job Posts",
      value: jobs?.filter((j: any) => j.status === 'active').length || 0,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+5"
    },
    {
      title: "Applications Received",
      value: candidates?.length || 0,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+23"
    },
    {
      title: "Talent Pool Access",
      value: Math.floor(Math.random() * 500) + 200,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+12"
    },
    {
      title: "Successful Hires",
      value: Math.floor(Math.random() * 15) + 8,
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "+3"
    }
  ];

  const quickActions = [
    {
      title: "Post New Job",
      description: "Create and publish a new job opening",
      icon: Plus,
      href: "/jobs/create",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Browse Talent Pool",
      description: "Search through alumni profiles and resumes",
      icon: Users,
      href: "/alumni",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Manage Applications",
      description: "Review and process job applications",
      icon: FileText,
      href: "/jobs/applications",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Host Event",
      description: "Organize recruitment events and job fairs",
      icon: Calendar,
      href: "/events/create",
      color: "from-orange-500 to-red-500"
    }
  ];

  const recentJobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      applicants: 45,
      status: "active",
      posted: "3 days ago"
    },
    {
      title: "Product Manager",
      company: "InnovateCo",
      location: "New York, NY",
      applicants: 28,
      status: "active",
      posted: "1 week ago"
    },
    {
      title: "Data Scientist",
      company: "DataTech",
      location: "Boston, MA",
      applicants: 67,
      status: "reviewing",
      posted: "2 weeks ago"
    }
  ];

  const recentActivity = [
    { type: "application", message: "15 new applications for Software Engineer role", time: "2 hours ago", icon: FileText },
    { type: "job", message: "Product Manager job post approved and published", time: "5 hours ago", icon: Briefcase },
    { type: "hire", message: "John Doe accepted offer for Data Analyst position", time: "1 day ago", icon: UserCheck },
    { type: "talent", message: "3 new alumni joined the platform", time: "2 days ago", icon: Users }
  ];

  const talentMetrics = [
    { skill: "Software Engineering", count: 145, growth: "+12%" },
    { skill: "Data Science", count: 89, growth: "+8%" },
    { skill: "Product Management", count: 67, growth: "+15%" },
    { skill: "Marketing", count: 78, growth: "+5%" },
    { skill: "Finance", count: 92, growth: "+10%" }
  ];

  return (
    <RouteGuard requireAuth={true}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recruiter Dashboard 💼
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Connect with top alumni talent for your open positions
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/jobs/create">
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Link>
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
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Streamline your recruitment process
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

            {/* Recent Job Posts */}
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      Your Job Posts
                    </CardTitle>
                    <CardDescription>
                      Track performance of your latest job openings
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/jobs">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                        </div>
                        <Badge 
                          variant={job.status === 'active' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {job.applicants} applications
                        </span>
                        <span>{job.posted}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Talent Pool Insights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Talent Pool by Skills
                </CardTitle>
                <CardDescription>
                  Available alumni by skill categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {talentMetrics.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                        <p className="text-sm text-gray-600">{skill.count} alumni available</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{skill.growth}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/alumni">Browse All Talent</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity & Applications */}
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

            {/* Top Performers */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Candidates
                </CardTitle>
                <CardDescription>
                  Highly qualified alumni profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Sarah Chen</h4>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Senior Software Engineer</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>5+ years exp</span>
                      <span>•</span>
                      <span>React, Node.js</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Michael Rodriguez</h4>
                      <Badge variant="outline">Open to offers</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Product Manager</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>7+ years exp</span>
                      <span>•</span>
                      <span>B2B, SaaS</span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Emily Johnson</h4>
                      <Badge variant="outline">Actively looking</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Data Scientist</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>4+ years exp</span>
                      <span>•</span>
                      <span>ML, Python</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/alumni">View All Profiles</Link>
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
