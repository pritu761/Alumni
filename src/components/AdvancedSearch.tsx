'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  X, 
  Users, 
  Calendar, 
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Building,
  IndianRupee
} from 'lucide-react';
import { toast } from 'sonner';
import { debounce } from 'lodash';

interface SearchResult {
  item: any;
  score?: number;
  matches?: any[];
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  filterOptions: any;
  query: string;
  filters: any;
  entityType: string;
}

interface SearchFilters {
  [key: string]: any;
}

const entityConfig = {
  alumni: {
    icon: Users,
    title: 'Alumni',
    description: 'Find fellow graduates',
    color: 'blue',
  },
  events: {
    icon: Calendar,
    title: 'Events',
    description: 'Discover upcoming events',
    color: 'green',
  },
  donations: {
    icon: Heart,
    title: 'Donations',
    description: 'View recent contributions',
    color: 'red',
  },
};

export function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('alumni');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [total, setTotal] = useState(0);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, entityType: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim() && Object.keys(searchFilters).length === 0) {
        setResults([]);
        setTotal(0);
        return;
      }

      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          type: entityType,
          q: searchQuery,
          limit: '20',
        });

        // Add filters to params
        Object.entries(searchFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, value.toString());
            }
          }
        });

        const response = await fetch(`/api/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data: SearchResponse = await response.json();
        setResults(data.results);
        setTotal(data.total);
        setFilterOptions(data.filterOptions);

      } catch (error) {
        console.error('Search error:', error);
        toast.error('Search failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Effect for performing search
  useEffect(() => {
    debouncedSearch(query, activeTab, filters);
  }, [query, activeTab, filters, debouncedSearch]);

  // Initialize from URL params
  useEffect(() => {
    const type = searchParams.get('type');
    const q = searchParams.get('q');
    
    if (type && ['alumni', 'events', 'donations'].includes(type)) {
      setActiveTab(type);
    }
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setResults([]);
    setFilters({});
    updateURL(query, newTab, {});
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    updateURL(newQuery, activeTab, filters);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    updateURL(query, activeTab, newFilters);
  };

  const clearFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
    updateURL(query, activeTab, newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    updateURL(query, activeTab, {});
  };

  const updateURL = (searchQuery: string, entityType: string, searchFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (entityType !== 'alumni') params.set('type', entityType);
    
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, Array.isArray(value) ? value.join(',') : value.toString());
      }
    });

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/search${newURL}`);
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTab === 'alumni' && (
            <>
              {/* Graduation Year Filter */}
              {filterOptions.graduationYearRange && (
                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="From"
                      value={filters.gradYearMin || ''}
                      onChange={(e) => handleFilterChange('gradYearMin', e.target.value)}
                      min={filterOptions.graduationYearRange.min}
                      max={filterOptions.graduationYearRange.max}
                    />
                    <Input
                      type="number"
                      placeholder="To"
                      value={filters.gradYearMax || ''}
                      onChange={(e) => handleFilterChange('gradYearMax', e.target.value)}
                      min={filterOptions.graduationYearRange.min}
                      max={filterOptions.graduationYearRange.max}
                    />
                  </div>
                </div>
              )}

              {/* Department Filter */}
              {filterOptions.departments && filterOptions.departments.length > 0 && (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.departments.slice(0, 10).map((dept: string) => {
                      const isSelected = filters.departments?.includes(dept);
                      return (
                        <Badge
                          key={dept}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = filters.departments || [];
                            const newDepts = isSelected 
                              ? current.filter((d: string) => d !== dept)
                              : [...current, dept];
                            handleFilterChange('departments', newDepts);
                          }}
                        >
                          {dept}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Company Filter */}
              {filterOptions.companies && filterOptions.companies.length > 0 && (
                <div className="space-y-2">
                  <Label>Company</Label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.companies.slice(0, 10).map((company: string) => {
                      const isSelected = filters.companies?.includes(company);
                      return (
                        <Badge
                          key={company}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = filters.companies || [];
                            const newCompanies = isSelected 
                              ? current.filter((c: string) => c !== company)
                              : [...current, company];
                            handleFilterChange('companies', newCompanies);
                          }}
                        >
                          {company}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'events' && (
            <>
              {/* Event Date Filter */}
              <div className="space-y-2">
                <Label>Event Date Range</Label>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={filters.eventStartDate || ''}
                    onChange={(e) => handleFilterChange('eventStartDate', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={filters.eventEndDate || ''}
                    onChange={(e) => handleFilterChange('eventEndDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Event Location Filter */}
              {filterOptions.eventLocations && filterOptions.eventLocations.length > 0 && (
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.eventLocations.slice(0, 8).map((location: string) => {
                      const isSelected = filters.eventLocations?.includes(location);
                      return (
                        <Badge
                          key={location}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = filters.eventLocations || [];
                            const newLocations = isSelected 
                              ? current.filter((l: string) => l !== location)
                              : [...current, location];
                            handleFilterChange('eventLocations', newLocations);
                          }}
                        >
                          {location}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'donations' && (
            <>
              {/* Donation Amount Filter */}
              {filterOptions.amountRange && (
                <div className="space-y-2">
                  <Label>Donation Amount (₹)</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Minimum"
                      value={filters.donationAmountMin || ''}
                      onChange={(e) => handleFilterChange('donationAmountMin', e.target.value)}
                      min={filterOptions.amountRange.min}
                      max={filterOptions.amountRange.max}
                    />
                    <Input
                      type="number"
                      placeholder="Maximum"
                      value={filters.donationAmountMax || ''}
                      onChange={(e) => handleFilterChange('donationAmountMax', e.target.value)}
                      min={filterOptions.amountRange.min}
                      max={filterOptions.amountRange.max}
                    />
                  </div>
                </div>
              )}

              {/* Purpose Filter */}
              {filterOptions.purposes && filterOptions.purposes.length > 0 && (
                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.purposes.map((purpose: string) => {
                      const isSelected = filters.donationCauses?.includes(purpose);
                      return (
                        <Badge
                          key={purpose}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = filters.donationCauses || [];
                            const newPurposes = isSelected 
                              ? current.filter((p: string) => p !== purpose)
                              : [...current, purpose];
                            handleFilterChange('donationCauses', newPurposes);
                          }}
                        >
                          {purpose}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        </div>
      );
    }

    if (!query.trim() && Object.keys(filters).length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
          <p className="text-gray-600">
            Enter keywords or use filters to find {entityConfig[activeTab as keyof typeof entityConfig]?.title.toLowerCase()}
          </p>
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search query or filters
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Found {total} result{total !== 1 ? 's' : ''} for "{query}"
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {renderFilters()}

        <div className="grid gap-4">
          {results.map((result, index) => (
            <SearchResultCard 
              key={`${result.item.id}-${index}`} 
              result={result} 
              entityType={activeTab} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Advanced Search</h1>
          <p className="text-gray-600">
            Find alumni, events, and donations across our network
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder={`Search ${entityConfig[activeTab as keyof typeof entityConfig]?.title.toLowerCase()}...`}
            value={query}
            onChange={handleQueryChange}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>

        {/* Entity Type Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(entityConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4" />
                  <span>{config.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {renderResults()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Search Result Card Component
function SearchResultCard({ result, entityType }: { result: SearchResult; entityType: string }) {
  const { item } = result;

  if (entityType === 'alumni') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {item.currentJobTitle && (
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{item.currentJobTitle}</span>
                    {item.currentCompany && <span>at {item.currentCompany}</span>}
                  </div>
                )}
                {item.department && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{item.department}</span>
                    {item.graduationYear && <span>• Class of {item.graduationYear}</span>}
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline">{item.role}</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entityType === 'events') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                {item.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                )}
                {item.creator && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Organized by {item.creator.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline">{item._count?.rsvps || 0} RSVPs</Badge>
              {item.capacity && (
                <p className="text-xs text-gray-500 mt-1">
                  Capacity: {item.capacity}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (entityType === 'donations') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
                  <IndianRupee className="h-5 w-5" />
                  <span>{parseFloat(item.amount).toLocaleString()}</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {item.currency}
                </Badge>
              </div>
              {item.purpose && (
                <p className="text-gray-600 mb-2">{item.purpose}</p>
              )}
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{item.user?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`${
                item.status === 'COMPLETED' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-yellow-50 text-yellow-700'
              }`}
            >
              {item.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
