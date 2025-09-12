"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardRouter() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    if (user) {
      // Route based on user role and type
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        default:
          // For regular users, we can determine their type based on various factors
          // For now, we'll default to alumni dashboard
          // In a real application, you might have user.userType or similar
          if (user.graduationYear && user.graduationYear <= new Date().getFullYear() - 1) {
            // Likely an alumni if they graduated more than a year ago
            router.push('/dashboard/alumni');
          } else {
            // Likely a current student or recent graduate
            router.push('/dashboard/students');
          }
          break;
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
}
