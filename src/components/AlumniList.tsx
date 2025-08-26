"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MapPin, Briefcase, GraduationCap, Linkedin, Mail, Phone } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AlumniList() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: "12",
    ...(search && { search }),
    ...(department && { department }),
    ...(graduationYear && { graduationYear })
  });

  const { data, error, isLoading } = useSWR(`/api/alumni?${queryParams}`, fetcher);

  if (error) return <div className="text-center text-red-600">Error loading alumni.</div>;
  if (isLoading) return <div className="text-center">Loading alumni...</div>;

  const alumni = data?.alumni || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search alumni..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Graduation Year"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
        />
        <Button 
          onClick={() => {
            setSearch("");
            setDepartment("");
            setGraduationYear("");
            setPage(1);
          }}
          variant="outline"
        >
          Clear Filters
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {alumni.length} of {total} alumni
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map((alumnus: any) => (
          <Card key={alumnus.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {alumnus.name.charAt(0)}
                </span>
              </div>
              <CardTitle className="text-lg">{alumnus.name}</CardTitle>
              <div className="text-sm text-gray-600">
                Class of {alumnus.graduationYear}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {alumnus.degree && alumnus.department && (
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap size={16} className="mr-2" />
                  {alumnus.degree} • {alumnus.department}
                </div>
              )}
              
              {alumnus.currentJob && alumnus.company && (
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase size={16} className="mr-2" />
                  {alumnus.currentJob} at {alumnus.company}
                </div>
              )}
              
              {alumnus.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {alumnus.location}
                </div>
              )}

              {alumnus.skills && alumnus.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {alumnus.skills.slice(0, 3).map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {alumnus.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{alumnus.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                <Button size="sm" asChild>
                  <Link href={`mailto:${alumnus.email}`}>
                    <Mail size={16} className="mr-1" />
                    Email
                  </Link>
                </Button>
                {alumnus.linkedin && (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={alumnus.linkedin} target="_blank">
                      <Linkedin size={16} className="mr-1" />
                      LinkedIn
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="py-2 px-4 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
