"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, BookOpen, DollarSign } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const features = [
    {
      title: "Alumni Directory",
      description: "Connect with fellow alumni and discover career opportunities",
      icon: Users,
      href: "/alumni"
    },
    {
      title: "Events & Reunions",
      description: "Stay updated with upcoming events and reunions",
      icon: Calendar,
      href: "/events"
    },
    {
      title: "Mentorship Program",
      description: "Find mentors or become one to help fellow alumni",
      icon: BookOpen,
      href: "/mentorship"
    },
    {
      title: "Give Back",
      description: "Support your alma mater through donations and contributions",
      icon: DollarSign,
      href: "/donations"
    }
  ];

  const stats = [
    { label: "Alumni Registered", value: "5,000+" },
    { label: "Events Hosted", value: "150+" },
    { label: "Mentorship Connections", value: "800+" },
    { label: "Donations Raised", value: "$2M+" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Our Alumni Network
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect, grow, and give back. Join thousands of alumni building lasting relationships and creating opportunities together.
            </p>
            {!isLoading && (
              <div className="space-x-4">
                {isAuthenticated ? (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/alumni">Browse Alumni</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/events">View Events</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link href="/auth/register">Join Network</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/alumni">Browse Alumni</Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools you need to build meaningful connections and advance your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={feature.href}>
                    <CardHeader className="text-center">
                      <IconComponent className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our thriving community of alumni and start building meaningful connections today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/register">Create Your Profile</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
