"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquare, User, Clock } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MentorshipList() {
  const { data: requests, error, isLoading } = useSWR('/api/mentorship', fetcher);

  if (error) return <div className="text-center text-red-600">Error loading mentorship requests.</div>;
  if (isLoading) return <div className="text-center">Loading mentorship requests...</div>;

  return (
    <div className="space-y-6">
      {/* Available Mentors Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* This would typically fetch from an alumni endpoint with mentor availability */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
              <CardTitle className="text-lg">Find a Mentor</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Browse our network of experienced alumni ready to guide your career
              </p>
              <Button asChild>
                <Link href="/mentorship/browse">Browse Mentors</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen size={24} className="text-green-600" />
              </div>
              <CardTitle className="text-lg">Become a Mentor</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Share your experience and help fellow alumni grow in their careers
              </p>
              <Button variant="outline" asChild>
                <Link href="/mentorship/become-mentor">Join as Mentor</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MessageSquare size={24} className="text-purple-600" />
              </div>
              <CardTitle className="text-lg">Quick Request</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Have a specific question? Send a quick mentorship request
              </p>
              <Button variant="secondary" asChild>
                <Link href="/mentorship/request">Send Request</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Mentorship Requests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Mentorship Activity</h2>
        <div className="space-y-4">
          {requests?.length > 0 ? (
            requests.slice(0, 5).map((request: any) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{request.subject}</h3>
                        <Badge 
                          variant={
                            request.status === 'PENDING' ? 'destructive' :
                            request.status === 'ACCEPTED' ? 'default' : 
                            request.status === 'COMPLETED' ? 'secondary' : 'outline'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Mentee:</strong> {request.mentee?.name} → 
                        <strong> Mentor:</strong> {request.mentor?.user?.name}
                      </p>
                      <p className="text-gray-700 line-clamp-2">{request.message}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 ml-4">
                      <Clock size={16} className="mr-1" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mentorship activity yet</h3>
                <p className="text-gray-600 mb-4">
                  Be the first to connect with a mentor or start mentoring others
                </p>
                <div className="space-x-2">
                  <Button asChild>
                    <Link href="/mentorship/browse">Find Mentor</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/mentorship/become-mentor">Become Mentor</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
