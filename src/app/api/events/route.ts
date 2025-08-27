import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET: List all events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    
    const where: Prisma.EventWhereInput = {
      isPublic: true
    };

    if (upcoming) {
      where.date = {
        gte: new Date()
      };
    }

    // Check if there are any events first
    const totalCount = await prisma.event.count();
    
    if (totalCount === 0) {
      // Return empty array if no events exist
      return NextResponse.json([]);
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array on error
    return NextResponse.json([]);
  }
}

// POST: Create a new event
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const event = await prisma.event.create({
      data: {
        ...data,
        date: new Date(data.date),
        endDate: data.endDate ? new Date(data.endDate) : null
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
