"use client";

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import AlumniList from "@/components/AlumniList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Plus, Search, Filter, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

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

export default function AlumniPage() {
  const { isAuthenticated } = useAuth();
  const [alumni, setAlumni] = useState<AlumniUser[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [alumni, searchTerm, departmentFilter, yearFilter]);

  const fetchAlumni = async () => {
    try {
      const response = await fetch('/api/alumni');
      if (response.ok) {
        const data = await response.json();
        
        let alumniData: AlumniUser[] = [];
        
        if (Array.isArray(data)) {
          alumniData = data;
        } else if (data && Array.isArray(data.alumni)) {
          alumniData = data.alumni;
        } else {
          console.error('Alumni API returned unexpected format:', data);
          alumniData = [];
        }
        
        setAlumni(alumniData);
      } else {
        console.error('Failed to fetch alumni:', response.status, response.statusText);
        setAlumni([]);
      }
    } catch (error) {
      console.error('Failed to fetch alumni:', error);
      setAlumni([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAlumni = () => {
    if (!Array.isArray(alumni)) {
      setFilteredAlumni([]);
      return;
    }

    let filtered = alumni;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.currentJobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.currentCompany?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter && departmentFilter !== "all") {
      filtered = filtered.filter(user => user.department === departmentFilter);
    }

    if (yearFilter && yearFilter !== "all") {
      filtered = filtered.filter(user => user.graduationYear === parseInt(yearFilter));
    }

    setFilteredAlumni(filtered);
  };

  const safeAlumni = Array.isArray(alumni) ? alumni : [];
  const uniqueDepartments = [...new Set(safeAlumni.map(user => user.department).filter(Boolean))];
  const uniqueYears = [...new Set(safeAlumni.map(user => user.graduationYear).filter(Boolean))].sort((a, b) => b! - a!);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center justify-center sm:justify-start">
              <Users className="h-9 w-9 text-blue-600 mr-3" /> Alumni Directory
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Connect with fellow graduates and expand your professional network.
            </p>
          </div>
          <div className="flex space-x-3">
            {isAuthenticated ? (
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/events/create" className="flex items-center">
                  <Plus size={20} className="mr-2" />
                  Create Event
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/auth/register" className="flex items-center">
                  <Plus size={20} className="mr-2" />
                  Join Network
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by name, email, job, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full dark:bg-gray-900 dark:text-white dark:border-gray-700">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 dark:text-white">
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full dark:bg-gray-900 dark:text-white dark:border-gray-700">
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-900 dark:text-white">
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year!.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("all");
                setYearFilter("all");
              }}
              className="w-full flex items-center justify-center dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Filter size={20} className="mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="mb-6 text-md text-gray-700 dark:text-gray-300 font-medium">
          Showing {filteredAlumni.length} of {alumni.length} alumni
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredAlumni.length > 0 ? (
          <AlumniList alumni={filteredAlumni} isLoading={false} />
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p className="text-xl font-semibold mb-4">No alumni found matching your criteria.</p>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
