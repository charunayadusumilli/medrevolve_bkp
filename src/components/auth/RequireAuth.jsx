import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Leaf, Lock } from 'lucide-react';

/**
 * Wraps any portal page — shows a branded login gate if not authenticated.
 * Pass `requiredRole` (e.g. "admin") to also enforce role-based access.
 */
export default function RequireAuth({ children, portalName = 'Portal', requiredRole = null }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center animate-pulse">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <p className="text-[#5A6B5A] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D3A2D] mb-2">{portalName}</h2>
          <p className="text-[#5A6B5A] mb-8">
            Sign in or create an account to access your {portalName.toLowerCase()}.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#4A6741] text-[#4A6741] rounded-full"
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
            >
              Create Account
            </Button>
          </div>
          <p className="text-xs text-[#5A6B5A] mt-6">
            Your session is secure and private.
          </p>
        </div>
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D3A2D] mb-2">Access Restricted</h2>
          <p className="text-[#5A6B5A] mb-6">
            You don't have permission to view this area. Please contact your administrator.
          </p>
          <Button
            variant="outline"
            className="border-[#4A6741] text-[#4A6741] rounded-full"
            onClick={() => base44.auth.logout('/')}
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return children;
}