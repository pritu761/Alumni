"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RouteGuard from "@/components/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, DollarSign, Calendar, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    category: "",
    imageUrl: ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would typically send the data to your API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Campaign created successfully!");
      router.push('/donations');
    } catch (error) {
      alert("Failed to create campaign. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-[#FCFCF9]">
        <div className="relative overflow-hidden border-b bg-white">
          <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute right-8 top-6 w-24 h-24 rounded-full border-4 border-pink-100 hidden sm:block" />
          <motion.div animate={{ scale: [1.08, 1, 1.08] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute right-16 top-12 w-16 h-16 rounded-full bg-pink-500/10 hidden sm:block" />
          <div className="max-w-4xl mx-auto px-4 py-6">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-pink-600 text-white"><Target className="w-5 h-5" /></span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Create campaign — target pulses</h1>
                <p className="text-sm text-zinc-600">Goal preview morphs as you type.</p>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="container mx-auto py-8 px-4 max-w-4xl">

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Campaign Details
              </CardTitle>
              <CardDescription>
                Provide the essential information about your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. New Science Lab Equipment"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your campaign goals and impact..."
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goalAmount">Goal Amount ($) *</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    value={formData.goalAmount}
                    onChange={(e) => handleChange('goalAmount', e.target.value)}
                    placeholder="50000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Campaign Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="e.g. Education, Sports, Infrastructure"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Campaign Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Campaign Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Campaign Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-gray-50">
                <h3 className="text-xl font-bold mb-2">
                  {formData.title || "Your Campaign Title"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {formData.description || "Your campaign description will appear here..."}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Goal: ${formData.goalAmount || "0"}
                  </span>
                  {formData.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ends: {new Date(formData.deadline).toLocaleDateString()}
                    </span>
                  )}
                  {formData.category && (
                    <Badge variant="secondary">{formData.category}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-full">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="rounded-full bg-pink-600 hover:bg-pink-700 gap-2">
              {isLoading ? "Creating..." : "Create campaign"}
            </Button>
          </motion.div>
        </form>
      </div>
      </div>
    </RouteGuard>
  );
}
