import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List mentorship requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    const menteeId = searchParams.get('menteeId');
    const status = searchParams.get('status');

    const where: Prisma.MentorshipRequestWhereInput = {};

    if (mentorId) {
      where.mentorId = parseInt(mentorId);
    }

    if (menteeId) {
      where.menteeId = parseInt(menteeId);
    }

    if (status) {
      where.status = status as any; // TypeScript workaround for enum type
    }

    // Check if there are any mentorship requests first
    const totalCount = await prisma.mentorshipRequest.count();
    
    if (totalCount === 0) {
      return NextResponse.json([]);
    }

    const requests = await prisma.mentorshipRequest.findMany({
      where,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        mentee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching mentorship requests:', error);
    return NextResponse.json([]);
  }
}

// POST: Create a mentorship request
export async function POST(request: Request) {
  try {
    const { mentorId, menteeId, subject, message } = await request.json();

    const mentorshipRequest = await prisma.mentorshipRequest.create({
      data: {
        mentorId,
        menteeId,
        subject,
        message
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        mentee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(mentorshipRequest);
  } catch (error) {
    console.error('Error creating mentorship request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
