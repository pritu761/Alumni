"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Clock, DollarSign, Users, Building2, Search, Filter, Plus, XCircle } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data - in real app, this would come from API
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "TechCorp Inc",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120,000 - $160,000",
      description: "Join our growing engineering team to build scalable web applications...",
      requirements: ["5+ years React experience", "Node.js", "AWS"],
      posted: "2 days ago",
      applicants: 45,
      recruiter: "Sarah Johnson",
      featured: true
    },
    {
      id: 2,
      title: "Product Manager",
      company: "InnovateCo",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100,000 - $140,000",
      description: "Lead product strategy and work cross-functionally with engineering teams...",
      requirements: ["3+ years product management", "Agile methodologies", "Data analysis"],
      posted: "1 week ago",
      applicants: 28,
      recruiter: "Michael Chen"
    },
    {
      id: 3,
      title: "Data Science Intern",
      company: "DataTech Solutions",
      location: "Boston, MA",
      type: "Internship",
      salary: "$25/hour",
      description: "Summer internship opportunity to work on machine learning projects...",
      requirements: ["Python", "Statistics background", "Currently enrolled in university"],
      posted: "3 days ago",
      applicants: 67,
      recruiter: "Emily Rodriguez"
    },
    {
      id: 4,
      title: "Marketing Coordinator",
      company: "BrandBuilder Agency",
      location: "Remote",
      type: "Full-time",
      salary: "$50,000 - $65,000",
      description: "Help execute marketing campaigns and manage social media presence...",
      requirements: ["Digital marketing experience", "Content creation", "Social media management"],
      posted: "5 days ago",
      applicants: 34,
      recruiter: "David Park"
    },
    {
      id: 5,
      title: "UX Designer",
      company: "DesignStudio",
      location: "Austin, TX",
      type: "Contract",
      salary: "$70/hour",
      description: "Design user experiences for mobile and web applications...",
      requirements: ["Portfolio required", "Figma/Sketch", "User research experience"],
      posted: "1 day ago",
      applicants: 52,
      recruiter: "Lisa Wong"
    }
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const locations = ["San Francisco, CA", "New York, NY", "Boston, MA", "Austin, TX", "Remote"];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || job.location === locationFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3 flex items-center justify-center sm:justify-start gap-4">
              <Briefcase className="h-12 w-12 text-blue-600" />
              Job Board
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Discover exciting career opportunities and connect with leading companies through our exclusive alumni network.
            </p>
          </div>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105">
            <Link href="/jobs/create" className="flex items-center">
              <Plus className="h-6 w-6 mr-3" />
              Post a New Job
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-10 dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  className="pl-12 pr-4 py-2 border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full dark:bg-gray-900 dark:text-white dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:text-white rounded-lg shadow-lg">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full dark:bg-gray-900 dark:text-white dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:text-white rounded-lg shadow-lg">
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-8 text-lg text-gray-700 dark:text-gray-300 font-semibold">
          <p>
            Showing <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''} 
            {searchTerm && (
              <> for "<span className="text-blue-600 dark:text-blue-400 font-bold">{searchTerm}</span>"</>
            )}
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 dark:bg-gray-800 dark:border-gray-700 ${
              job.featured ? 'border-l-4 border-blue-500 bg-blue-50/30 dark:bg-blue-950/30' : ''
            }`}>
              {job.featured && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  FEATURED
                </div>
              )}
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-start justify-between mb-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400 mt-2 text-base">
                      <span className="flex items-center gap-2 font-medium">
                        <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-2 font-medium">
                        <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        {job.location}
                      </span>
                      <Badge variant="outline" className="px-3 py-1 text-sm dark:border-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">{job.type}</Badge>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mt-4 mb-5 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-5">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 3 && (
                        <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          +{job.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end md:ml-8 w-full md:w-auto min-w-[150px]">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                      {job.salary}
                    </div>
                    <Button className="mb-3 w-full md:w-40 bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-base rounded-lg shadow-md transition-all duration-200">Apply Now</Button>
                    <Button variant="outline" size="lg" className="w-full md:w-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 py-2.5 text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                      Save Job
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-0">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Posted {job.posted}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold">{job.applicants}</span> applicants
                    </span>
                    <span className="font-medium">By <span className="text-gray-700 dark:text-gray-300">{job.recruiter}</span></span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md">
                      Contact Recruiter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      {filteredJobs.length === 0 && (
        <Card className="text-center py-16 dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-lg">
          <CardContent>
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No jobs found</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base rounded-lg shadow-md transition-all duration-200">
              <Link href="/jobs/create">Post a Job</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Call to Action for Recruiters */}
      <Card className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl shadow-xl p-8 sm:p-10">
        <CardContent className="p-0 text-center">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Looking to hire alumni talent?</h2>
          <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg opacity-90">
            Post your job openings and connect with qualified alumni from our network. 
            Reach thousands of talented professionals across various industries and help them find their next career step.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105" asChild>
              <Link href="/jobs/create">Post a Job</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-blue-500 hover:bg-white hover:text-blue-600 px-8 py-3 text-lg rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105" asChild>
              <Link href="/dashboard/recruiter">Recruiter Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
