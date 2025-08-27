import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET: List donations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: Prisma.DonationWhereInput = {};

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (status) {
      where.status = status as any; // TypeScript workaround for enum type
    }

    // Check if there are any donations first
    const totalCount = await prisma.donation.count();
    
    if (totalCount === 0) {
      return NextResponse.json([]);
    }

    const donations = await prisma.donation.findMany({
      where,
      include: {
        user: {
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

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json([]);
  }
}

// POST: Create a donation
export async function POST(request: Request) {
  try {
    const { userId, amount, currency = 'USD', purpose } = await request.json();

    const donation = await prisma.donation.create({
      data: {
        userId,
        amount,
        currency,
        purpose,
        status: 'PENDING'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Here you would integrate with Razorpay/Stripe for actual payment processing
    // For now, we'll just return the donation record

    return NextResponse.json(donation);
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
