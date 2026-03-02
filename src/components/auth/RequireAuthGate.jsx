import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, Loader2, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * Wraps any form/page and blocks access until the user is authenticated.
 * On login, redirects back to the current page.
 */
export default function RequireAuthGate({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authed' | 'guest'

  useEffect(() => {
    base44.auth.isAuthenticated().then((isAuth) => {
      setStatus(isAuth ? 'authed' : 'guest');
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A6741]" />
      </div>
    );
  }

  if (status === 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-[#E8E0D5] p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#4A6741]/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-[#4A6741]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D3A2D] mb-2">Sign in to continue</h2>
          <p className="text-[#5A6B5A] mb-8 leading-relaxed">
            You need to be logged in to complete this form. Sign in or create a free account — it only takes a moment.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full py-5 font-semibold text-base"
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to My Account
            </Button>
            <Button
              variant="outline"
              className="border-[#4A6741] text-[#4A6741] rounded-full py-5 font-semibold text-base"
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create a Free Account
            </Button>
          </div>
          <p className="text-xs text-[#9A8B7A] mt-6">
            After signing in, you'll be brought right back here to pick up where you left off.
          </p>
        </motion.div>
      </div>
    );
  }

  return children;
}