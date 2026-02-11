import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  MessageSquare, Settings, Users
} from 'lucide-react';

export default function VideoCall() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get('appointment');

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const { data: appointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => base44.entities.Appointment.filter({ id: appointmentId }),
    enabled: !!appointmentId,
    select: (data) => data[0]
  });

  const { data: provider } = useQuery({
    queryKey: ['provider', appointment?.provider_id],
    queryFn: () => base44.entities.Provider.filter({ id: appointment?.provider_id }),
    enabled: !!appointment?.provider_id,
    select: (data) => data[0]
  });

  const handleEndCall = () => {
    navigate(createPageUrl('MyAppointments'));
  };

  if (!appointment) {
    return (
      <div className="h-screen bg-[#2D3A2D] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">Loading appointment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#2D3A2D] flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Main Video (Provider) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2D3A2D] to-[#1A2318]">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-[#4A6741] mx-auto mb-4 flex items-center justify-center">
              <Users className="w-16 h-16 text-white" />
            </div>
            <p className="text-white text-xl mb-2">{provider?.name || 'Provider'}</p>
            <p className="text-white/60">Waiting for provider to join...</p>
            <p className="text-white/40 text-sm mt-4">
              Note: Video calls require backend integration with a service like Twilio or Agora.
              This is a UI preview. Enable backend functions to integrate real video calling.
            </p>
          </div>
        </div>

        {/* Self Video (Picture-in-Picture) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 w-48 h-36 bg-[#1A2318] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl"
        >
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A6741] to-[#3D5636]">
            <div className="text-center text-white">
              <Video className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">You</p>
            </div>
          </div>
        </motion.div>

        {/* Appointment Info */}
        <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-3 text-white">
          <p className="text-sm opacity-80">Video Consultation</p>
          <p className="font-medium">{appointment.type.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1A2318] px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left - Info */}
          <div className="text-white">
            <p className="text-sm opacity-60">
              {new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Center - Main Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`w-14 h-14 rounded-full ${
                isAudioOn 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-14 h-14 rounded-full ${
                isVideoOn 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            <Button
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>

          {/* Right - Additional Actions */}
          <div className="flex items-center gap-3">
            <Link to={createPageUrl(`Messages?appointment=${appointmentId}`)}>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}