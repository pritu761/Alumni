"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { User, Briefcase, GraduationCap, MapPin, Heart, Award } from "lucide-react";

export default function CreateAlumniPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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

  const steps = [
    { id: 1, title: "Personal Info", icon: User, description: "Basic information about you" },
    { id: 2, title: "Education", icon: GraduationCap, description: "Your academic background" },
    { id: 3, title: "Professional", icon: Briefcase, description: "Career and work experience" },
    { id: 4, title: "Additional", icon: Heart, description: "Skills, interests, and more" }
  ];

  // Show loading while authentication state is being determined
  if (authLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated after loading is complete
  if (!authLoading && !isAuthenticated) {
    router.push('/auth/login?redirect=/alumni/create');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        userId: user?.id, // Use authenticated user's ID
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        interests: formData.interests.split(',').map(s => s.trim()).filter(s => s)
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

      const response = await fetch('/api/alumni', {
        method: 'POST',
        headers,
        credentials: 'include',
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

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.graduationYear;
      case 3:
        return true; // Professional info is optional
      case 4:
        return true; // Additional info is optional
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="mx-auto h-12 w-12 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User size={16} />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <MapPin size={16} />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <MapPin size={16} />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin size={16} />
                  Current Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State/Country"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <GraduationCap className="mx-auto h-12 w-12 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold">Education Background</h3>
              <p className="text-gray-600">Your academic journey</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="graduationYear" className="flex items-center gap-2">
                  <Award size={16} />
                  Graduation Year *
                </Label>
                <Input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2020"
                  className="h-12"
                  min="1950"
                  max="2030"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree" className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  Degree/Program
                </Label>
                <Input
                  id="degree"
                  name="degree"
                  type="text"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="Bachelor of Science, Master's, PhD, etc."
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  Department/Major
                </Label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Computer Science, Business, Engineering, etc."
                  className="h-12"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="mx-auto h-12 w-12 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold">Professional Experience</h3>
              <p className="text-gray-600">Your career journey</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentJob" className="flex items-center gap-2">
                  <Briefcase size={16} />
                  Current Job Title
                </Label>
                <Input
                  id="currentJob"
                  name="currentJob"
                  type="text"
                  value={formData.currentJob}
                  onChange={handleChange}
                  placeholder="Senior Software Engineer, Marketing Manager, etc."
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Briefcase size={16} />
                  Current Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Google, Microsoft, Startup Inc., etc."
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <MapPin size={16} />
                  LinkedIn Profile (Optional)
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="mx-auto h-12 w-12 text-red-600 mb-3" />
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <p className="text-gray-600">Skills, interests, and more about you</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <User size={16} />
                  Professional Bio
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share your professional story, achievements, and what drives you..."
                  rows={4}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills" className="flex items-center gap-2">
                  <Award size={16} />
                  Skills & Expertise
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, Project Management, Data Analysis, etc."
                  className="h-12"
                />
                <p className="text-xs text-gray-500">Separate multiple skills with commas</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interests" className="flex items-center gap-2">
                  <Heart size={16} />
                  Interests & Hobbies
                </Label>
                <Input
                  id="interests"
                  name="interests"
                  type="text"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Mentoring, Photography, Travel, Volunteering, etc."
                  className="h-12"
                />
                <p className="text-xs text-gray-500">Separate multiple interests with commas</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Our Alumni Network</h1>
          <p className="text-xl text-gray-600">Create your profile and connect with fellow alumni</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                  ${currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'}`}>
                  <step.icon size={20} />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="outline" className="px-4 py-2">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </Badge>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="text-center">
              <CardTitle className="text-2xl">{steps[currentStep - 1]?.title}</CardTitle>
              <CardDescription className="text-blue-100">
                {steps[currentStep - 1]?.description}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6"
                >
                  Previous
                </Button>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push('/alumni')}
                  >
                    Cancel
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="px-6 bg-blue-600 hover:bg-blue-700"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? "Creating Profile..." : "Create Profile"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Need help? Contact our alumni office at support@university.edu</p>
        </div>
      </div>
    </div>
  );
}
