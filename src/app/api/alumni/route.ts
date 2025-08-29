import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List all alumni with pagination and search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const graduationYear = searchParams.get('graduationYear');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { currentJobTitle: { contains: search, mode: 'insensitive' } },
        { currentCompany: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }

    if (graduationYear) {
      where.graduationYear = parseInt(graduationYear);
    }

    const alumni = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        graduationYear: true,
        department: true,
        currentJobTitle: true,
        currentCompany: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    const total = await prisma.user.count({ where });

    return NextResponse.json({
      alumni,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    // Return the users directly without pagination for now
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          graduationYear: true,
          department: true,
          currentJobTitle: true,
          currentCompany: true,
          createdAt: true,
        },
        orderBy: {
          name: 'asc'
        }
      });
      return NextResponse.json(users);
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return NextResponse.json([]);
    }
  }
}

// POST: Create a new alumni profile
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create alumni profile linked to user
    const alumni = await prisma.user.create({
      data: {
        ...data,
        skills: data.skills || [],
        interests: data.interests || []
      }
    });

    return NextResponse.json(alumni);
  } catch (error) {
    console.error('Error creating alumni:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
