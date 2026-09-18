import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Sparkles } from 'lucide-react';

// Shows a "continue your setup" banner for returning logged-in users who already
// have a merchant (Partner) record — sends them straight to their dashboard.
export default function ResumeSetupBanner() {
  const [partner, setPartner] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ok = await base44.auth.isAuthenticated();
        if (!ok || cancelled) return;
        const me = await base44.auth.me();
        if (!me?.email || cancelled) return;
        const partners = await base44.entities.Partner.filter({ email: me.email });
        if (!cancelled && partners.length > 0) {
          setPartner(partners[0]);
          setShow(true);
        }
      } catch { /* anonymous or no partner — show nothing */ }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <AnimatePresence>
      {show && partner && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="bg-gradient-to-r from-[#1F2D27] to-[#0f1f0f] border-b border-[#4A6741]/30">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#4A6741]/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-[#A8C99B]" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Welcome back, {partner.business_name}!</p>
                <p className="text-white/50 text-xs">Pick up where you left off — your platform setup is in progress.</p>
              </div>
            </div>
            <Link to="/MerchantDashboard" className="flex-shrink-0">
              <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-sm font-bold px-6">
                Continue Your Setup <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}