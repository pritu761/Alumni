import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET: List all alumni with pagination and search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const graduationYear = searchParams.get('graduationYear');

    const skip = (page - 1) * limit;

    const where: Prisma.AlumniWhereInput = {
      isVisible: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { currentJob: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }

    if (graduationYear) {
      where.graduationYear = parseInt(graduationYear);
    }

    // First, let's check if there are any alumni at all
    const totalCount = await prisma.alumni.count();
    
    if (totalCount === 0) {
      // Return empty result if no alumni exist
      return NextResponse.json({
        alumni: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }

    const alumni = await prisma.alumni.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        graduationYear: 'desc'
      }
    });

    const total = await prisma.alumni.count({ where });

    return NextResponse.json({
      alumni,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    // Return empty result on error instead of 500
    return NextResponse.json({
      alumni: [],
      total: 0,
      page: 1,
      totalPages: 0,
      error: 'Failed to fetch alumni'
    });
  }
}

// POST: Create a new alumni profile
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create alumni profile linked to user
    const alumni = await prisma.alumni.create({
      data: {
        ...data,
        skills: data.skills || [],
        interests: data.interests || []
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
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
