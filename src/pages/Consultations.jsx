import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { trackEvent } from '@/components/analytics/AnalyticsTracker';
import { 
  Video, Calendar, MessageSquare, Clock, Star, 
  ArrowRight, CheckCircle, Shield, Users
} from 'lucide-react';

export default function Consultations() {
  const [activeTab, setActiveTab] = useState('providers');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: upcomingAppointments = [] } = useQuery({
    queryKey: ['upcomingAppointments', user?.email],
    queryFn: () => base44.entities.Appointment.filter(
      { patient_email: user?.email, status: ['scheduled', 'confirmed'] },
      'appointment_date',
      10
    ),
    enabled: !!user?.email
  });

  const { data: providers = [] } = useQuery({
    queryKey: ['providers'],
    queryFn: () => base44.entities.Provider.filter({ is_active: true }, '-rating', 20)
  });

  const features = [
    {
      icon: Video,
      title: 'Secure Video Calls',
      description: 'HIPAA-compliant video consultations from anywhere'
    },
    {
      icon: MessageSquare,
      title: 'Direct Messaging',
      description: 'Secure messaging with your provider between visits'
    },
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments at times that work for you'
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your health information is protected and confidential'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
                Expert Care, <span className="font-medium text-[#4A6741]">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg text-[#5A6B5A] mb-8">
                Connect with licensed medical providers through secure video consultations. 
                Get personalized care, prescription adjustments, and expert guidance from the comfort of home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('BookAppointment')}>
                  <Button 
                    size="lg"
                    className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8"
                    onClick={() => trackEvent('Book Consultation', 'Consultations', { source: 'hero_cta' })}
                  >
                    Book Consultation
                    <Calendar className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to={createPageUrl('MyAppointments')}>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-full px-8"
                  >
                    My Appointments
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"
                alt="Telehealth Consultation"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#D4E5D7] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#4A6741]" />
                  </div>
                  <h3 className="font-medium text-[#2D3A2D] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#5A6B5A]">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Appointments Preview */}
      {upcomingAppointments.length > 0 && (
        <section className="py-16 px-6 lg:px-8 bg-[#F5F0E8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-light text-[#2D3A2D]">Your Upcoming Appointments</h2>
              <Link to={createPageUrl('MyAppointments')}>
                <Button variant="ghost" className="text-[#4A6741]">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meet Our Providers */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4">
              Meet Our <span className="font-medium text-[#4A6741]">Medical Team</span>
            </h2>
            <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
              Board-certified providers dedicated to your wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.slice(0, 6).map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProviderCard provider={provider} />
              </motion.div>
            ))}
          </div>

          {providers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-[#D4E5D7] mx-auto mb-4" />
              <p className="text-[#5A6B5A] mb-6">Loading our medical team...</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-[#4A6741] to-[#3D5636]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Book your consultation today and take the next step in your wellness journey
            </p>
            <Link to={createPageUrl('BookAppointment')}>
              <Button 
                size="lg"
                className="bg-white text-[#4A6741] hover:bg-white/90 rounded-full px-10 py-6"
              >
                Schedule Your Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function AppointmentCard({ appointment }) {
  const appointmentDate = new Date(appointment.appointment_date);
  
  return (
    <Link to={createPageUrl(`AppointmentDetails?id=${appointment.id}`)}>
      <motion.div 
        className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <Badge className="bg-[#D4E5D7] text-[#4A6741] border-none">
            {appointment.type.replace('_', ' ')}
          </Badge>
          <Clock className="w-4 h-4 text-[#5A6B5A]" />
        </div>
        <p className="font-medium text-[#2D3A2D] mb-2">
          {appointmentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p className="text-sm text-[#5A6B5A]">
          {appointmentDate.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
          })}
        </p>
      </motion.div>
    </Link>
  );
}

function ProviderCard({ provider }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="aspect-square bg-[#F5F0E8] overflow-hidden">
        <img 
          src={provider.photo || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80`}
          alt={provider.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-medium text-[#2D3A2D] text-lg mb-1">
          {provider.name}, {provider.title}
        </h3>
        <p className="text-sm text-[#4A6741] mb-3">{provider.specialty}</p>
        {provider.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-[#5A6B5A]">
              {provider.total_consultations}+ consultations
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <Link to={createPageUrl(`ProviderProfile?id=${provider.id}`)} className="flex-1">
            <Button 
              size="sm"
              variant="outline"
              className="w-full border-[#4A6741] text-[#4A6741] hover:bg-[#4A6741]/5 rounded-full"
            >
              Profile
            </Button>
          </Link>
          <Link to={createPageUrl(`BookAppointment?provider=${provider.id}`)} className="flex-1">
            <Button 
              size="sm"
              className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
            >
              Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}