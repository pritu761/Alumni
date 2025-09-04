import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;

      // Update donation status in database
      if (metadata.donationId) {
        await prisma.donation.update({
          where: { id: parseInt(metadata.donationId) },
          data: {
            status: 'COMPLETED',
          },
        });

        // Send confirmation email
        if (metadata.donorEmail) {
          await sendEmail({
            to: metadata.donorEmail,
            subject: 'Donation Confirmation - Thank You!',
            template: 'donation-confirmation',
            data: {
              donorName: metadata.donorName,
              amount: paymentIntent.amount / 100,
              cause: metadata.cause,
              transactionId: paymentIntent.id,
              date: new Date().toLocaleDateString(),
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
