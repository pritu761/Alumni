"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, BookOpen, DollarSign, ArrowRight, Star, Trophy, Heart, Globe } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  
  const features = [
    {
      title: "Alumni Directory",
      description: "Connect with fellow alumni and discover career opportunities across industries",
      icon: Users,
      href: "/alumni",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Events & Reunions",
      description: "Stay updated with upcoming events, reunions, and networking opportunities",
      icon: Calendar,
      href: "/events",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Mentorship Program",
      description: "Find experienced mentors or become one to guide fellow alumni",
      icon: BookOpen,
      href: "/mentorship",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Give Back",
      description: "Support your alma mater through donations and meaningful contributions",
      icon: DollarSign,
      href: "/donations",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Alumni Registered", value: "5,000+", icon: Users },
    { label: "Events Hosted", value: "150+", icon: Calendar },
    { label: "Mentorship Connections", value: "800+", icon: Heart },
    { label: "Donations Raised", value: "$2M+", icon: Trophy }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      year: "Class of 2018",
      content: "The alumni network helped me land my dream job. The mentorship program connected me with industry leaders who guided my career path.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Startup Founder",
      year: "Class of 2015",
      content: "Through this platform, I found my co-founder and received invaluable advice from experienced entrepreneurs in our network.",
      rating: 5
    },
    {
      name: "Dr. Emily Johnson",
      role: "Research Scientist",
      year: "Class of 2012",
      content: "The ongoing connections and collaborative opportunities have been instrumental in advancing my research and career.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <Image 
                  src="/icons/icon-192x192.png" 
                  alt="Alumni Network" 
                  width={120} 
                  height={120}
                  className="rounded-full shadow-2xl border-4 border-white/30 hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-75 animate-pulse"></div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Welcome to Our
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Alumni Network
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-blue-100 leading-relaxed">
              Connect, grow, and give back. Join <span className="font-semibold text-white">thousands of alumni</span> building lasting relationships and creating opportunities together.
            </p>
            
            {!isLoading && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                {isAuthenticated ? (
                  <>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group" asChild>
                      <Link href="/alumni" className="flex items-center gap-2">
                        Browse Alumni
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-full border-2 transition-all duration-300" asChild>
                      <Link href="/events">View Events</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group" asChild>
                      <Link href="/auth/register" className="flex items-center gap-2">
                        Join Network
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-full border-2 transition-all duration-300" asChild>
                      <Link href="/alumni">Browse Alumni</Link>
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300">
                    <IconComponent className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-200 text-sm lg:text-base">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Stay Connected
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform provides all the tools you need to build meaningful connections and advance your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white hover:-translate-y-2 overflow-hidden">
                  <Link href={feature.href}>
                    <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                    <CardHeader className="text-center pb-4">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center justify-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Alumni Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from successful alumni who have benefited from our network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-blue-600">{testimonial.year}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Globe className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Join our thriving community of alumni and start building meaningful connections today. Your next opportunity is just one connection away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group" asChild>
                <Link href="/auth/register" className="flex items-center gap-2">
                  Create Your Profile
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-full border-2 transition-all duration-300" asChild>
                <Link href="/alumni">Explore Network</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
