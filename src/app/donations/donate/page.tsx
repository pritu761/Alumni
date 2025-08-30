"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, GraduationCap, Building, Users, Trophy, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";

const donationCauses = [
  {
    id: "Scholarship Fund",
    title: "Scholarship Fund",
    description: "Support deserving students with financial assistance for their education",
    icon: GraduationCap,
    color: "bg-blue-500"
  },
  {
    id: "Infrastructure Development",
    title: "Infrastructure Development",
    description: "Help improve campus facilities and learning environments",
    icon: Building,
    color: "bg-green-500"
  },
  {
    id: "Student Activities",
    title: "Student Activities",
    description: "Fund extracurricular activities, clubs, and student events",
    icon: Users,
    color: "bg-purple-500"
  },
  {
    id: "Sports & Athletics",
    title: "Sports & Athletics",
    description: "Support sports teams, equipment, and athletic programs",
    icon: Trophy,
    color: "bg-orange-500"
  },
  {
    id: "Library & Research",
    title: "Library & Research",
    description: "Enhance library resources and support research initiatives",
    icon: BookOpen,
    color: "bg-indigo-500"
  },
  {
    id: "Emergency Fund",
    title: "Emergency Fund",
    description: "Provide immediate assistance to students and alumni in need",
    icon: Heart,
    color: "bg-red-500"
  }
];

const suggestedAmounts = [500, 1000, 2500, 5000, 10000, 25000];

function DonateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCause, setSelectedCause] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    donorName: "",
    email: "",
    phone: "",
    isAnonymous: false,
    message: ""
  });

  useEffect(() => {
    const cause = searchParams.get('cause');
    if (cause) {
      setSelectedCause(cause);
    }
  }, [searchParams]);

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
    router.push('/auth/login?redirect=/donations/donate');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid donation amount");
      setIsLoading(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        amount,
        cause: selectedCause,
        isAnonymous: formData.isAnonymous,
        donatedBy: user?.id // Use authenticated user's ID
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

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Thank you for your donation! Redirecting to payment...");
        // In a real app, redirect to payment gateway
        setTimeout(() => {
          router.push('/donations?success=true');
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to process donation");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const currentCause = donationCauses.find(cause => cause.id === selectedCause);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Make a Donation</h1>
          <p className="text-gray-600">
            Support your alma mater and help create opportunities for future generations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Causes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select a Cause</CardTitle>
                <CardDescription>Choose what you'd like to support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donationCauses.map((cause) => {
                    const IconComponent = cause.icon;
                    return (
                      <div
                        key={cause.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedCause === cause.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCause(cause.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-md ${cause.color} text-white`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{cause.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{cause.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Donation Details</CardTitle>
                {currentCause && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{currentCause.title}</Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <Label>Donation Amount (₹)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {suggestedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={selectedAmount === amount ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                          className="h-12"
                        >
                          ₹{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Custom Amount</Label>
                      <Input
                        id="customAmount"
                        type="number"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter custom amount"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="donorName">Full Name</Label>
                      <Input
                        id="donorName"
                        name="donorName"
                        type="text"
                        value={formData.donorName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Leave a message with your donation..."
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isAnonymous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Make this donation anonymous
                    </Label>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Tax Benefits</h4>
                    <p className="text-sm text-yellow-800">
                      Your donation is eligible for tax deduction under Section 80G of the Income Tax Act. 
                      You will receive a tax receipt after successful payment.
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isLoading || !selectedCause || (!selectedAmount && !customAmount)} 
                      className="flex-1"
                    >
                      {isLoading ? "Processing..." : `Donate ₹${selectedAmount?.toLocaleString() || customAmount || '0'}`}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => router.push('/donations')}
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
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div>Loading donation form...</div>}>
      <DonateForm />
    </Suspense>
  );
}
