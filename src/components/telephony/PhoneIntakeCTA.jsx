import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

export default function PhoneIntakeCTA({ className = '' }) {
  const trackingNumber = '240-387-5224';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a 
        href={`tel:+12403875224`}
        className="hidden sm:flex items-center gap-2 text-[#4A6741] hover:text-[#3D5636] transition-colors"
      >
        <Phone className="w-4 h-4" />
        <span className="font-semibold">{trackingNumber}</span>
      </a>
      <Button asChild className="bg-[#4A6741] hover:bg-[#3D5636]">
        <Link to="/PhoneIntake">
          <Phone className="w-4 h-4 mr-2" />
          Phone Intake
        </Link>
      </Button>
    </div>
  );
}