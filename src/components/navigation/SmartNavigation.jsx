import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import {
  Building2, Users, Sparkles, Package, MessageCircle,
  ShoppingCart, Stethoscope, BarChart3, FileText
} from 'lucide-react';

// Dynamic navigation based on user type and behavior
export default function SmartNavigation({ user }) {
  const [userType, setUserType] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const location = useLocation();

  useEffect(() => {
    identifyUserType();
  }, [user, location]);

  const identifyUserType = async () => {
    // Identify user type based on their data
    if (!user) {
      setUserType('visitor');
      setRecommendations([
        { label: 'Shop Products', icon: Package, path: 'Products', badge: 'Popular' },
        { label: 'Book Consultation', icon: Stethoscope, path: 'Consultations', badge: 'New' },
        { label: 'For Creators', icon: Sparkles, path: 'ForCreators' },
        { label: 'For Business', icon: Building2, path: 'ForBusiness' }
      ]);
      return;
    }

    // Check if user has partner relationship
    try {
      const partners = await base44.entities.Partner.filter({ 
        email: user.email 
      });
      
      if (partners.length > 0) {
        setUserType('partner');
        setRecommendations([
          { label: 'Partner Portal', icon: Building2, path: 'PartnerPortal', badge: 'Dashboard' },
          { label: 'Analytics', icon: BarChart3, path: 'AdminDashboard' },
          { label: 'Products', icon: Package, path: 'Products' },
          { label: 'Contracts', icon: FileText, path: 'PartnerContracts' }
        ]);
        return;
      }

      // Check if creator
      const creatorMetrics = await base44.entities.CreatorMetrics.filter({
        creator_email: user.email
      });

      if (creatorMetrics.length > 0) {
        setUserType('creator');
        setRecommendations([
          { label: 'Creator Dashboard', icon: Sparkles, path: 'CreatorDashboard', badge: 'Earnings' },
          { label: 'Marketing Assets', icon: MessageCircle, path: 'MarketingAssets' },
          { label: 'Products', icon: Package, path: 'Products' },
          { label: 'Analytics', icon: BarChart3, path: 'CreatorAnalytics' }
        ]);
        return;
      }

      // Check if patient
      const appointments = await base44.entities.ConsultationBooking.filter({
        patient_email: user.email
      });

      if (appointments.length > 0) {
        setUserType('patient');
        setRecommendations([
          { label: 'Patient Portal', icon: Users, path: 'PatientPortal', badge: 'Health' },
          { label: 'My Appointments', icon: Stethoscope, path: 'MyAppointments' },
          { label: 'Shop Products', icon: Package, path: 'Products' },
          { label: 'Messages', icon: MessageCircle, path: 'Messages' }
        ]);
        return;
      }

      // Default authenticated user
      setUserType('user');
      setRecommendations([
        { label: 'Shop Products', icon: Package, path: 'Products', badge: 'Recommended' },
        { label: 'Consultations', icon: Stethoscope, path: 'Consultations' },
        { label: 'Cart', icon: ShoppingCart, path: 'Cart' }
      ]);
    } catch (error) {
      console.error('Error identifying user type:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {recommendations.map((rec) => {
        const Icon = rec.icon;
        return (
          <Link
            key={rec.path}
            to={createPageUrl(rec.path)}
            className="relative group"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#4A6741]/5 transition-colors">
              <Icon className="w-4 h-4 text-[#5A6B5A] group-hover:text-[#4A6741]" />
              <span className="text-sm font-medium text-[#5A6B5A] group-hover:text-[#4A6741]">
                {rec.label}
              </span>
              {rec.badge && (
                <Badge className="bg-[#4A6741] text-white text-xs">
                  {rec.badge}
                </Badge>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}