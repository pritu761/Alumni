import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: RSVP to an event
export async function POST(request: Request) {
  try {
    const { eventId, userId, status = 'CONFIRMED' } = await request.json();

    // Check if RSVP already exists
    const existingRSVP = await prisma.eventRSVP.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    });

    if (existingRSVP) {
      // Update existing RSVP
      const updatedRSVP = await prisma.eventRSVP.update({
        where: {
          id: existingRSVP.id
        },
        data: {
          status
        },
        include: {
          event: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return NextResponse.json(updatedRSVP);
    } else {
      // Create new RSVP
      const rsvp = await prisma.eventRSVP.create({
        data: {
          eventId,
          userId,
          status
        },
        include: {
          event: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return NextResponse.json(rsvp);
    }
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
