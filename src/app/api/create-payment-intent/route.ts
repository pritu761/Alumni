import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe-server';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 400 });
  }
}
