import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  ArrowLeft, Star, Calendar, MapPin, Award, 
  CheckCircle, GraduationCap, Stethoscope, Shield
} from 'lucide-react';

export default function ProviderProfile() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('id');

  const { data: provider, isLoading } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => base44.entities.Provider.get(providerId),
    enabled: !!providerId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-[#5A6B5A]">Loading provider profile...</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Provider Not Found</h2>
          <Link to={createPageUrl('Consultations')}>
            <Button>Back to Consultations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl('Consultations'))}
          className="text-[#5A6B5A]"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Providers
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <img
                src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'}
                alt={provider.name}
                className="w-48 h-48 rounded-2xl object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-light text-[#2D3A2D] mb-2">
                    {provider.name}, {provider.title}
                  </h1>
                  <p className="text-lg text-[#4A6741] font-medium mb-3">{provider.specialty}</p>
                  
                  {/* Rating */}
                  {provider.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(provider.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#5A6B5A]">
                        {provider.rating} ({provider.total_consultations || 0} consultations)
                      </span>
                    </div>
                  )}
                </div>

                <Link to={createPageUrl(`BookAppointment?provider=${providerId}`)}>
                  <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                    <Calendar className="mr-2 w-4 h-4" />
                    Book Appointment
                  </Button>
                </Link>
              </div>

              <p className="text-[#5A6B5A] mb-6">{provider.bio}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                {provider.years_experience && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-[#4A6741]" />
                    <span className="text-[#5A6B5A]">{provider.years_experience} years experience</span>
                  </div>
                )}
                {provider.states_licensed?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#4A6741]" />
                    <span className="text-[#5A6B5A]">Licensed in {provider.states_licensed.length} states</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Philosophy Section */}
            {provider.philosophy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">About Me</h2>
                <p className="text-[#5A6B5A] leading-relaxed whitespace-pre-line">
                  {provider.philosophy}
                </p>
              </motion.div>
            )}

            {/* Areas of Expertise */}
            {provider.areas_of_expertise?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Stethoscope className="w-6 h-6 text-[#4A6741]" />
                  <h2 className="text-2xl font-light text-[#2D3A2D]">Areas of Expertise</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {provider.areas_of_expertise.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#4A6741] flex-shrink-0" />
                      <span className="text-[#5A6B5A]">{area}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Testimonials */}
            {provider.testimonials?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-sm"
              >
                <h2 className="text-2xl font-light text-[#2D3A2D] mb-6">Patient Reviews</h2>
                <div className="space-y-6">
                  {provider.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b border-[#E8E0D5] last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-[#2D3A2D]">{testimonial.patient_initials}</span>
                            {testimonial.verified && (
                              <Badge className="bg-[#4A6741] text-white text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < testimonial.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-[#5A6B5A]">
                          {new Date(testimonial.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[#5A6B5A] leading-relaxed">{testimonial.comment}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#4A6741]" />
                <h3 className="font-medium text-[#2D3A2D]">Credentials</h3>
              </div>
              
              {provider.license_number && (
                <div className="mb-4">
                  <p className="text-xs text-[#5A6B5A] mb-1">Medical License</p>
                  <p className="font-mono text-sm text-[#2D3A2D]">{provider.license_number}</p>
                </div>
              )}

              {provider.states_licensed?.length > 0 && (
                <div>
                  <p className="text-xs text-[#5A6B5A] mb-2">Licensed States</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.states_licensed.map((state, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Education */}
            {provider.education?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-[#4A6741]" />
                  <h3 className="font-medium text-[#2D3A2D]">Education</h3>
                </div>
                <div className="space-y-3">
                  {provider.education.map((edu, index) => (
                    <p key={index} className="text-sm text-[#5A6B5A] leading-relaxed">
                      {edu}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#4A6741] to-[#3D5636] rounded-3xl p-6 text-white"
            >
              <h3 className="font-medium mb-3">Ready to get started?</h3>
              <p className="text-sm text-white/80 mb-4">
                Book a consultation with {provider.name.split(' ')[0]} today.
              </p>
              <Link to={createPageUrl(`BookAppointment?provider=${providerId}`)}>
                <Button className="w-full bg-white text-[#4A6741] hover:bg-white/90">
                  Book Appointment
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}