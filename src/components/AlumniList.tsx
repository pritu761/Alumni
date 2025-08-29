"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, GraduationCap, Mail } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface AlumniUser {
  id: string;
  name: string;
  email: string;
  graduationYear?: number;
  department?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  createdAt: string;
}

interface AlumniListProps {
  alumni: AlumniUser[];
  isLoading: boolean;
}

export default function AlumniList({ alumni, isLoading }: AlumniListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="text-center">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (alumni.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
        <p className="text-gray-600">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alumni.map((alumnus) => (
        <Card key={alumnus.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {alumnus.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <CardTitle className="text-lg">{alumnus.name}</CardTitle>
            {alumnus.graduationYear && (
              <div className="text-sm text-gray-600">
                Class of {alumnus.graduationYear}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {alumnus.department && (
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap size={16} className="mr-2" />
                {alumnus.department}
              </div>
            )}
            
            {alumnus.currentJobTitle && (
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase size={16} className="mr-2" />
                {alumnus.currentJobTitle}
                {alumnus.currentCompany && ` at ${alumnus.currentCompany}`}
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button size="sm" asChild>
                <Link href={`mailto:${alumnus.email}`}>
                  <Mail size={16} className="mr-1" />
                  Email
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
