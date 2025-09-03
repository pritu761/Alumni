"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import AlumniList from "@/components/AlumniList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";

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
        
        // Handle different response formats from the API
        let alumniData: AlumniUser[] = [];
        
        if (Array.isArray(data)) {
          // Direct array response (fallback case)
          alumniData = data;
        } else if (data && Array.isArray(data.alumni)) {
          // Paginated response with alumni property
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
    // Ensure alumni is an array before filtering
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

  // Safety check: ensure alumni is an array before mapping
  const safeAlumni = Array.isArray(alumni) ? alumni : [];
  const uniqueDepartments = [...new Set(safeAlumni.map(user => user.department).filter(Boolean))];
  const uniqueYears = [...new Set(safeAlumni.map(user => user.graduationYear).filter(Boolean))].sort((a, b) => b! - a!);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600">
            Connect with fellow graduates and expand your professional network
          </p>
        </div>
        {isAuthenticated && (
          <Button asChild>
            <Link href="/events/create">
              <Plus size={16} className="mr-2" />
              Create Event
            </Link>
          </Button>
        )}
        {!isAuthenticated && (
          <Button asChild>
            <Link href="/auth/register">
              <Plus size={16} className="mr-2" />
              Join Network
            </Link>
          </Button>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map(dept => (
                <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Year" />
            </SelectTrigger>
            <SelectContent>
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
          >
            <Filter size={16} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredAlumni.length} of {alumni.length} alumni
      </div>
      
      <AlumniList alumni={filteredAlumni} isLoading={isLoading} />
    </div>
  );
}
