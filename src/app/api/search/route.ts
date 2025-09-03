import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { advancedSearch, SearchFilters } from '@/lib/search';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('type') as 'alumni' | 'events' | 'donations';
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Parse filters from query parameters
    const filters: SearchFilters = {};
    
    // Alumni filters
    const gradYearMin = searchParams.get('gradYearMin');
    const gradYearMax = searchParams.get('gradYearMax');
    if (gradYearMin || gradYearMax) {
      filters.graduationYear = {};
      if (gradYearMin) filters.graduationYear.min = parseInt(gradYearMin);
      if (gradYearMax) filters.graduationYear.max = parseInt(gradYearMax);
    }
    
    const departments = searchParams.get('departments');
    if (departments) filters.department = departments.split(',');
    
    const locations = searchParams.get('locations');
    if (locations) filters.location = locations.split(',');
    
    const skills = searchParams.get('skills');
    if (skills) filters.skills = skills.split(',');
    
    const companies = searchParams.get('companies');
    if (companies) filters.company = companies.split(',');
    
    // Event filters
    const eventStartDate = searchParams.get('eventStartDate');
    const eventEndDate = searchParams.get('eventEndDate');
    if (eventStartDate || eventEndDate) {
      filters.eventDate = {};
      if (eventStartDate) filters.eventDate.start = new Date(eventStartDate);
      if (eventEndDate) filters.eventDate.end = new Date(eventEndDate);
    }
    
    const eventTypes = searchParams.get('eventTypes');
    if (eventTypes) filters.eventType = eventTypes.split(',');
    
    const eventLocations = searchParams.get('eventLocations');
    if (eventLocations) filters.eventLocation = eventLocations.split(',');
    
    // Donation filters
    const donationAmountMin = searchParams.get('donationAmountMin');
    const donationAmountMax = searchParams.get('donationAmountMax');
    if (donationAmountMin || donationAmountMax) {
      filters.donationAmount = {};
      if (donationAmountMin) filters.donationAmount.min = parseFloat(donationAmountMin);
      if (donationAmountMax) filters.donationAmount.max = parseFloat(donationAmountMax);
    }
    
    const donationCauses = searchParams.get('donationCauses');
    if (donationCauses) filters.donationCause = donationCauses.split(',');

    if (!entityType) {
      return NextResponse.json({ error: 'Entity type is required' }, { status: 400 });
    }

    let data: any[] = [];
    let filterOptions: any = {};

    try {
      // Fetch data based on entity type
      switch (entityType) {
        case 'alumni':
          data = await prisma.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              graduationYear: true,
              department: true,
              currentJobTitle: true,
              currentCompany: true,
              role: true,
              createdAt: true,
            },
            where: {
              role: 'USER', // Only get regular users, not admins
            },
          });
          break;
          
        case 'events':
          data = await prisma.event.findMany({
            select: {
              id: true,
              title: true,
              description: true,
              date: true,
              endDate: true,
              location: true,
              capacity: true,
              isPublic: true,
              createdAt: true,
              creator: {
                select: {
                  name: true,
                  email: true,
                },
              },
              _count: {
                select: { rsvps: true }
              }
            },
            where: {
              isPublic: true, // Only show public events in search
            },
          });
          break;
          
        case 'donations':
          data = await prisma.donation.findMany({
            select: {
              id: true,
              amount: true,
              currency: true,
              purpose: true,
              status: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            where: {
              status: 'COMPLETED', // Only show completed donations
            },
          });
          break;
          
        default:
          return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
      }

      // Get filter options
      filterOptions = advancedSearch.getFilterOptions(data, entityType);
      
      // Perform search
      const searchResults = advancedSearch.search(
        entityType,
        data,
        query.trim() || undefined,
        Object.keys(filters).length > 0 ? filters : undefined,
        limit
      );

      const response = {
        results: searchResults,
        total: searchResults.length,
        filterOptions,
        query,
        filters,
        entityType,
      };

      return NextResponse.json(response);

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET suggestions for autocomplete
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityType, field, query, limit = 10 } = body;

    if (!entityType || !field || !query) {
      return NextResponse.json(
        { error: 'entityType, field, and query are required' },
        { status: 400 }
      );
    }

    let data: any[] = [];

    try {
      // Fetch relevant data for suggestions
      switch (entityType) {
        case 'alumni':
          data = await prisma.user.findMany({
            select: { [field]: true },
            where: {
              [field]: {
                contains: query,
                mode: 'insensitive',
              },
              role: 'USER',
            },
            take: limit * 2, // Get more to account for duplicates
          });
          break;
          
        case 'events':
          data = await prisma.event.findMany({
            select: { [field]: true },
            where: {
              [field]: {
                contains: query,
                mode: 'insensitive',
              },
              isPublic: true,
            },
            take: limit * 2,
          });
          break;
          
        case 'donations':
          data = await prisma.donation.findMany({
            select: { [field]: true },
            where: {
              [field]: {
                contains: query,
                mode: 'insensitive',
              },
              status: 'COMPLETED',
            },
            take: limit * 2,
          });
          break;
          
        default:
          return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
      }

      const suggestions = advancedSearch.getSuggestions(data, field, query, limit);

      return NextResponse.json({ suggestions });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
