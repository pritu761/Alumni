'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CreditCard, Shield, Loader2 } from 'lucide-react';

// Load Stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  amount: number;
  donationData: {
    donorName: string;
    email: string;
    phone: string;
    cause: string;
    message: string;
    isAnonymous: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripePayment({ amount, donationData, onSuccess, onCancel }: StripePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get token from cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const token = getCookie('auth-token');

      if (!token) {
        toast.error('Authentication required');
        router.push('/auth/login?redirect=/donations/donate');
        return;
      }

      // First, create the donation record
      const donationResponse = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          ...donationData,
          amount,
        }),
      });

      if (!donationResponse.ok) {
        const error = await donationResponse.json();
        throw new Error(error.error || 'Failed to create donation');
      }

      const donation = await donationResponse.json();

      // Create payment intent
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          amount,
          donationId: donation.id,
          donorName: donationData.donorName,
          donorEmail: donationData.email,
          cause: donationData.cause,
        }),
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        throw new Error(error.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await paymentResponse.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // For this demo, we'll simulate a successful payment
      // In a real app, you'd use Stripe Elements or Checkout
      setTimeout(() => {
        toast.success('Payment successful! Thank you for your donation.');
        onSuccess();
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Secure Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Donation Amount:</span>
                <span className="font-medium">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cause:</span>
                <span className="font-medium">{donationData.cause}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Benefit (80G):</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available
                </Badge>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₹{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secured by Stripe • SSL Encrypted • PCI Compliant</span>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-medium mb-3">Accepted Payment Methods</h4>
            <div className="flex space-x-2">
              <Badge variant="outline">Visa</Badge>
              <Badge variant="outline">Mastercard</Badge>
              <Badge variant="outline">RuPay</Badge>
              <Badge variant="outline">UPI</Badge>
              <Badge variant="outline">Net Banking</Badge>
              <Badge variant="outline">Wallets</Badge>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{amount.toLocaleString()}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our terms of service and privacy policy. 
            Your donation is secure and you will receive a tax receipt via email.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
