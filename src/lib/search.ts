import Fuse from 'fuse.js';

// Search configuration for different entities
export const searchConfigs = {
  alumni: {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'email', weight: 0.2 },
      { name: 'currentJobTitle', weight: 0.2 },
      { name: 'currentCompany', weight: 0.2 },
      { name: 'department', weight: 0.15 },
    ],
    threshold: 0.4, // Lower = more strict
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  },
  events: {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'location', weight: 0.2 },
      { name: 'creator.name', weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  },
  donations: {
    keys: [
      { name: 'user.name', weight: 0.3 },
      { name: 'purpose', weight: 0.4 },
      { name: 'user.email', weight: 0.1 },
      { name: 'currency', weight: 0.1 },
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  },
};

export interface SearchFilters {
  // Alumni filters
  graduationYear?: { min?: number; max?: number };
  department?: string[];
  location?: string[];
  jobTitle?: string[];
  company?: string[];
  skills?: string[];
  
  // Event filters
  eventDate?: { start?: Date; end?: Date };
  eventType?: string[];
  eventLocation?: string[];
  
  // Donation filters
  donationAmount?: { min?: number; max?: number };
  donationCause?: string[];
  donationDate?: { start?: Date; end?: Date };
}

export class AdvancedSearch {
  private fuseInstances: { [key: string]: Fuse<any> } = {};

  constructor() {
    // Initialize Fuse instances for each entity type
  }

  // Initialize search index for a specific entity type
  initializeIndex(entityType: keyof typeof searchConfigs, data: any[]) {
    const config = searchConfigs[entityType];
    this.fuseInstances[entityType] = new Fuse(data, config);
  }

  // Perform text search
  textSearch(entityType: keyof typeof searchConfigs, query: string, limit = 50) {
    const fuse = this.fuseInstances[entityType];
    if (!fuse) {
      throw new Error(`Search index not initialized for ${entityType}`);
    }

    const results = fuse.search(query, { limit });
    return results.map(result => ({
      item: result.item,
      score: result.score,
      matches: result.matches,
    }));
  }

  // Apply filters to data
  applyFilters(data: any[], filters: SearchFilters, entityType: string) {
    return data.filter(item => {
      // Alumni filters
      if (entityType === 'alumni') {
        // Graduation year filter
        if (filters.graduationYear) {
          const gradYear = parseInt(item.graduationYear);
          if (filters.graduationYear.min && gradYear < filters.graduationYear.min) return false;
          if (filters.graduationYear.max && gradYear > filters.graduationYear.max) return false;
        }

        // Department filter
        if (filters.department && filters.department.length > 0) {
          if (!filters.department.some(dept => 
            item.department?.toLowerCase().includes(dept.toLowerCase())
          )) return false;
        }

        // Location filter
        if (filters.location && filters.location.length > 0) {
          if (!filters.location.some(loc => 
            item.location?.toLowerCase().includes(loc.toLowerCase())
          )) return false;
        }

        // Job title filter
        if (filters.jobTitle && filters.jobTitle.length > 0) {
          if (!filters.jobTitle.some(job => 
            item.currentJobTitle?.toLowerCase().includes(job.toLowerCase())
          )) return false;
        }

        // Company filter
        if (filters.company && filters.company.length > 0) {
          if (!filters.company.some(comp => 
            item.currentCompany?.toLowerCase().includes(comp.toLowerCase())
          )) return false;
        }
      }

      // Event filters
      if (entityType === 'events') {
        // Event date filter
        if (filters.eventDate) {
          const eventDate = new Date(item.date);
          if (filters.eventDate.start && eventDate < filters.eventDate.start) return false;
          if (filters.eventDate.end && eventDate > filters.eventDate.end) return false;
        }

        // Event type filter
        if (filters.eventType && filters.eventType.length > 0) {
          if (!filters.eventType.includes(item.type)) return false;
        }

        // Event location filter
        if (filters.eventLocation && filters.eventLocation.length > 0) {
          if (!filters.eventLocation.some(loc => 
            item.location?.toLowerCase().includes(loc.toLowerCase())
          )) return false;
        }
      }

      // Donation filters
      if (entityType === 'donations') {
        // Donation amount filter
        if (filters.donationAmount) {
          const amount = parseFloat(item.amount);
          if (filters.donationAmount.min && amount < filters.donationAmount.min) return false;
          if (filters.donationAmount.max && amount > filters.donationAmount.max) return false;
        }

        // Donation cause filter
        if (filters.donationCause && filters.donationCause.length > 0) {
          if (!filters.donationCause.includes(item.cause)) return false;
        }

        // Donation date filter
        if (filters.donationDate) {
          const donationDate = new Date(item.createdAt);
          if (filters.donationDate.start && donationDate < filters.donationDate.start) return false;
          if (filters.donationDate.end && donationDate > filters.donationDate.end) return false;
        }
      }

      return true;
    });
  }

  // Combined search with text query and filters
  search(
    entityType: keyof typeof searchConfigs,
    data: any[],
    query?: string,
    filters?: SearchFilters,
    limit = 50
  ) {
    let results = data;

    // Apply filters first
    if (filters) {
      results = this.applyFilters(results, filters, entityType);
    }

    // If there's a text query, perform fuzzy search
    if (query && query.trim()) {
      this.initializeIndex(entityType, results);
      const searchResults = this.textSearch(entityType, query, limit);
      return searchResults;
    }

    // Return filtered results without text search
    return results.slice(0, limit).map(item => ({ item, score: 1 }));
  }

  // Get suggestions for autocomplete
  getSuggestions(data: any[], field: string, query: string, limit = 10) {
    const values = data
      .map(item => item[field])
      .filter(value => value && typeof value === 'string')
      .filter(value => value.toLowerCase().includes(query.toLowerCase()));

    const uniqueValues = [...new Set(values)];
    return uniqueValues.slice(0, limit);
  }

  // Get filter options based on current data
  getFilterOptions(data: any[], entityType: string) {
    const options: any = {};

    if (entityType === 'alumni') {
      // Get unique departments
      options.departments = [...new Set(
        data.map(item => item.department).filter(Boolean)
      )];

      // Get unique companies
      options.companies = [...new Set(
        data.map(item => item.currentCompany).filter(Boolean)
      )];

      // Get unique job titles
      options.jobTitles = [...new Set(
        data.map(item => item.currentJobTitle).filter(Boolean)
      )];

      // Get graduation year range
      const gradYears = data
        .map(item => parseInt(item.graduationYear))
        .filter(year => !isNaN(year));
      
      if (gradYears.length > 0) {
        options.graduationYearRange = {
          min: Math.min(...gradYears),
          max: Math.max(...gradYears),
        };
      }
    }

    if (entityType === 'events') {
      // Get unique event locations
      options.eventLocations = [...new Set(
        data.map(item => item.location).filter(Boolean)
      )];

      // Get date range
      const dates = data
        .map(item => new Date(item.date))
        .filter(date => !isNaN(date.getTime()));
      
      if (dates.length > 0) {
        options.dateRange = {
          min: new Date(Math.min(...dates.map(d => d.getTime()))),
          max: new Date(Math.max(...dates.map(d => d.getTime()))),
        };
      }
    }

    if (entityType === 'donations') {
      // Get unique purposes
      options.purposes = [...new Set(
        data.map(item => item.purpose).filter(Boolean)
      )];

      // Get unique currencies
      options.currencies = [...new Set(
        data.map(item => item.currency).filter(Boolean)
      )];

      // Get donation amount range
      const amounts = data
        .map(item => parseFloat(item.amount))
        .filter(amount => !isNaN(amount));
      
      if (amounts.length > 0) {
        options.amountRange = {
          min: Math.min(...amounts),
          max: Math.max(...amounts),
        };
      }
    }

    return options;
  }
}

// Export singleton instance
export const advancedSearch = new AdvancedSearch();
