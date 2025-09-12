"use client";

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { getStripe } from '@/lib/stripe-client';

interface StripePaymentProps {
  amount: number;
}

const StripePayment: React.FC<StripePaymentProps> = ({ amount }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [amount]);

  if (loading) {
    return <div>Loading payment options...</div>;
  }

  if (error) {
    return <div>Error loading payment: {error}</div>;
  }

  if (!clientSecret) {
    return <div>Failed to load payment options. Please try again.</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'flat',
    },
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripePayment;
