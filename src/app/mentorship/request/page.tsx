"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export default function MentorshipRequestPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mentorId: "",
    message: "",
    area: "",
    goals: "",
    timeline: ""
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login?redirect=/mentorship/request');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        mentorId: parseInt(formData.mentorId),
        requestedBy: user?.id // Use authenticated user's ID
      };

      // Get token from cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const token = getCookie('auth-token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/mentorship', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Mentorship request sent successfully!");
        router.push('/mentorship');
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to send mentorship request");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };



  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Request Mentorship</CardTitle>
            <CardDescription>
              Connect with experienced alumni for career guidance and professional development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mentorId">Select Mentor</Label>
                <Select onValueChange={(value) => handleSelectChange("mentorId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">John Doe - Software Engineering</SelectItem>
                    <SelectItem value="2">Jane Smith - Product Management</SelectItem>
                    <SelectItem value="3">Mike Johnson - Data Science</SelectItem>
                    <SelectItem value="4">Sarah Wilson - Marketing</SelectItem>
                    <SelectItem value="5">David Brown - Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Mentorship Area</Label>
                <Select onValueChange={(value) => handleSelectChange("area", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mentorship area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Career Development">Career Development</SelectItem>
                    <SelectItem value="Technical Skills">Technical Skills</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                    <SelectItem value="Industry Transition">Industry Transition</SelectItem>
                    <SelectItem value="Work-Life Balance">Work-Life Balance</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Your Goals</Label>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="What do you hope to achieve through this mentorship? Be specific about your goals..."
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Expected Timeline</Label>
                <Select onValueChange={(value) => handleSelectChange("timeline", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long do you need mentorship?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="1+ years">1+ years</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message</Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Introduce yourself and explain why you'd like this person as your mentor..."
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Mentorship Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be respectful of your mentor's time and schedule</li>
                  <li>• Come prepared with specific questions and goals</li>
                  <li>• Follow through on commitments and action items</li>
                  <li>• Provide updates on your progress regularly</li>
                </ul>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Sending Request..." : "Send Mentorship Request"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/mentorship')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
