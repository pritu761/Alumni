"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateAlumniPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: 1, // This should come from auth context in a real app
    name: "",
    email: "",
    phone: "",
    graduationYear: new Date().getFullYear(),
    degree: "",
    department: "",
    currentJob: "",
    company: "",
    location: "",
    linkedin: "",
    bio: "",
    skills: "",
    interests: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        interests: formData.interests.split(',').map(s => s.trim()).filter(s => s)
      };

      const response = await fetch('/api/alumni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Alumni profile created successfully!");
        router.push('/alumni');
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create alumni profile");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Alumni Profile</CardTitle>
            <CardDescription>
              Add a new alumni member to the directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    name="graduationYear"
                    type="number"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    name="degree"
                    type="text"
                    value={formData.degree}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentJob">Current Job Title</Label>
                  <Input
                    id="currentJob"
                    name="currentJob"
                    type="text"
                    value={formData.currentJob}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  type="text"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Brief description about yourself"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, React, Node.js"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma-separated)</Label>
                <Input
                  id="interests"
                  name="interests"
                  type="text"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. Mentoring, Volunteering, Travel"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create Alumni Profile"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/alumni')}
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
