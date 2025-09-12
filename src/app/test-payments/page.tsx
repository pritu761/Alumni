"use client";

import React from 'react';
import StripePayment from '@/components/StripePayment';

const TestPaymentsPage: React.FC = () => {
  const amountToPay = 1000; // Example amount in cents (e.g., 10.00 USD)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Payments</h1>
      <p className="mb-4">This page demonstrates Stripe payment integration.</p>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
        <StripePayment amount={amountToPay} />
      </div>
    </div>
  );
};

export default TestPaymentsPage;
