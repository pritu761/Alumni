"use client";

import { useAuth } from "@/lib/auth-context";
import RouteGuard from "@/components/RouteGuard";
import AdminDashboard from "@/components/AdminDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, DollarSign, MessageSquare, Shield, Settings, UserCheck, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { authenticatedFetcher } from "@/lib/fetcher";

export default function AdminPage() {
  const { user } = useAuth();
  const { data: alumniData } = useSWR('/api/alumni', authenticatedFetcher);
  const { data: eventsData } = useSWR('/api/events', authenticatedFetcher);
  const { data: donationsData } = useSWR('/api/donations', authenticatedFetcher);
  const { data: mentorshipData } = useSWR('/api/mentorship', authenticatedFetcher);

  const dashboardStats = [
    {
      title: "Total Alumni",
      value: alumniData?.total || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+15"
    },
    {
      title: "Active Events",
      value: eventsData?.filter((e: any) => new Date(e.date) > new Date()).length || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+3"
    },
    {
      title: "Total Donations",
      value: `$${donationsData?.reduce((sum: number, d: any) => sum + d.amount, 0)?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+8%"
    },
    {
      title: "Pending Verifications",
      value: Math.floor(Math.random() * 25) + 5,
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "+2"
    }
  ];

  const quickActions = [
    {
      title: "Verify Alumni",
      description: "Review and approve alumni registrations",
      icon: UserCheck,
      href: "/admin/verify",
      color: "from-green-500 to-emerald-500",
      urgent: true
    },
    {
      title: "Manage Events",
      description: "Create and oversee alumni events",
      icon: Calendar,
      href: "/events",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Track Donations",
      description: "Monitor fundraising campaigns",
      icon: DollarSign,
      href: "/donations",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Platform Settings",
      description: "Configure system settings",
      icon: Settings,
      href: "/admin/settings",
      color: "from-gray-500 to-slate-500"
    }
  ];

  const recentActivity = [
    { type: "verification", message: "5 new alumni profiles awaiting verification", time: "1 hour ago", icon: UserCheck, urgent: true },
    { type: "event", message: "Alumni Gala 2024 reached capacity (250 attendees)", time: "3 hours ago", icon: Calendar },
    { type: "donation", message: "New $5,000 donation received for scholarship fund", time: "5 hours ago", icon: DollarSign },
    { type: "user", message: "50 new users registered this week", time: "1 day ago", icon: Users },
    { type: "mentorship", message: "12 new mentorship requests submitted", time: "2 days ago", icon: MessageSquare }
  ];

  const systemAlerts = [
    { type: "warning", message: "Database backup is 2 days overdue", severity: "high" },
    { type: "info", message: "Server maintenance scheduled for Dec 20", severity: "low" },
    { type: "success", message: "Email service restored successfully", severity: "resolved" }
  ];

  return (
    <RouteGuard requireAuth={true} requireRole="ADMIN">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and oversee the entire alumni platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              System Online
            </Badge>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.some(alert => alert.severity !== 'resolved') && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemAlerts.filter(alert => alert.severity !== 'resolved').map((alert, index) => (
                  <div key={index} className={`flex items-center gap-2 p-2 rounded ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                    alert.severity === 'low' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                  <Shield className="h-5 w-5 text-blue-500" />
                  Admin Actions
                </CardTitle>
                <CardDescription>
                  Key administrative functions and management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Card key={index} className={`hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${
                        action.urgent ? 'border-l-orange-500 bg-orange-50' : 'border-l-transparent hover:border-l-blue-500'
                      }`}>
                        <Link href={action.href}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`bg-gradient-to-r ${action.color} p-2 rounded-lg relative`}>
                                <IconComponent className="h-5 w-5 text-white" />
                                {action.urgent && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                  {action.title}
                                  {action.urgent && <Badge variant="outline" className="text-xs">Urgent</Badge>}
                                </h3>
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

            {/* Detailed Admin Dashboard Component */}
            <div className="mt-6">
              <AdminDashboard />
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest platform activities requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                        activity.urgent ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                      }`}>
                        <div className={`p-2 rounded-full ${
                          activity.urgent ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-4 w-4 ${
                            activity.urgent ? 'text-orange-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            activity.urgent ? 'text-orange-900' : 'text-gray-900'
                          }`}>
                            {activity.message}
                          </p>
                          <p className={`text-xs ${
                            activity.urgent ? 'text-orange-600' : 'text-gray-500'
                          }`}>
                            {activity.time}
                          </p>
                        </div>
                        {activity.urgent && (
                          <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                            Action Required
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Server Status</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-800">Database</span>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">Healthy</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-800">Email Service</span>
                    </div>
                    <Badge variant="outline" className="text-purple-600 border-purple-600">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-800">Backup Status</span>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">Warning</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
