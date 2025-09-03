import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { verifyJWT } from '@/lib/jwt';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

// GET: List donations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Prisma.DonationWhereInput = {};

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (status) {
      where.status = status as any;
    }

    // Check if there are any donations first
    const totalCount = await prisma.donation.count({ where });
    
    if (totalCount === 0) {
      return NextResponse.json({ donations: [], total: 0 });
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
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      donations,
      total: totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ donations: [], total: 0 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a donation
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      amount, 
      currency = 'INR', 
      purpose,
      donorName,
      email,
      phone,
      message,
      isAnonymous = false 
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        userId: decoded.userId,
        amount: parseFloat(amount),
        currency,
        purpose: purpose || 'General Support',
        status: 'PENDING',
        paymentId: null, // Will be updated after payment confirmation
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

    // Send initial confirmation email
    if (email && !isAnonymous) {
      try {
        await sendEmail({
          to: email,
          template: 'donation-confirmation',
          data: {
            donorName: donorName || donation.user.name,
            amount: amount,
            cause: purpose || 'General Support',
            transactionId: donation.id.toString(),
            date: new Date().toLocaleDateString(),
          },
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the donation creation if email fails
      }
    }

    return NextResponse.json({
      id: donation.id,
      amount: donation.amount,
      currency: donation.currency,
      purpose: donation.purpose,
      status: donation.status,
      createdAt: donation.createdAt,
      user: donation.user,
    });

  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update donation status (typically called by payment webhooks)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const donationId = searchParams.get('id');
    
    if (!donationId) {
      return NextResponse.json({ error: 'Donation ID required' }, { status: 400 });
    }

    const { status, paymentId, paymentIntentId } = await request.json();

    const updatedDonation = await prisma.donation.update({
      where: { id: parseInt(donationId) },
      data: {
        status: status || 'COMPLETED',
        paymentId: paymentId || paymentIntentId,
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

    return NextResponse.json(updatedDonation);

  } catch (error) {
    console.error('Error updating donation:', error);
    return NextResponse.json(
      { error: 'Failed to update donation' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
