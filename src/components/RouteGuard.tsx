"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'ADMIN' | 'USER';
  redirectTo?: string;
}

export default function RouteGuard({ 
  children, 
  requireAuth = false, 
  requireRole, 
  redirectTo = '/auth/login' 
}: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    if (requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${currentPath}`);
      return;
    }

    if (requireRole && user && user.role !== requireRole) {
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard/alumni');
      }
      return;
    }
  }, [user, isAuthenticated, isLoading, requireAuth, requireRole, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireRole && user && user.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}