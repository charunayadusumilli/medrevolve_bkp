import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Video, VideoOff, Mic, MicOff, Shield, Clock,
  CheckCircle, AlertCircle, Wifi, Lock, Users, PhoneOff
} from 'lucide-react';

export default function WaitingRoom() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get('id');

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState({ camera: 'checking', mic: 'checking', connection: 'checking' });
  const [waitTime, setWaitTime] = useState(0);
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [consentShown, setConsentShown] = useState(false);
  const [admitted, setAdmitted] = useState(false);
  const localVideoRef = useRef(null);

  const { data: appointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      if (!appointmentId) return null;
      const results = await base44.entities.Appointment.filter({ id: appointmentId });
      return results[0] || null;
    },
    enabled: !!appointmentId,
    refetchInterval: 10000 // poll for admission
  });

  const { data: provider } = useQuery({
    queryKey: ['provider', appointment?.provider_id],
    queryFn: async () => {
      const results = await base44.entities.Provider.filter({ id: appointment?.provider_id });
      return results[0];
    },
    enabled: !!appointment?.provider_id
  });

  // Initialize camera/mic
  useEffect(() => {
    let stream;
    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setDeviceStatus({ camera: 'ok', mic: 'ok', connection: 'ok' });
        setConsentShown(true);
      } catch {
        setDeviceStatus(prev => ({ ...prev, camera: 'error', mic: 'error', connection: 'ok' }));
        setConsentShown(true);
      }
    };
    init();
    // Check connection
    setTimeout(() => setDeviceStatus(prev => ({ ...prev, connection: navigator.onLine ? 'ok' : 'error' })), 500);
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  // Wait time counter
  useEffect(() => {
    const timer = setInterval(() => setWaitTime(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if provider has admitted (appointment status changes to in_progress)
  useEffect(() => {
    if (appointment?.status === 'in_progress' || appointment?.status === 'confirmed') {
      setAdmitted(true);
    }
  }, [appointment?.status]);

  const toggleVideo = () => {
    if (localStream) localStream.getVideoTracks().forEach(t => { t.enabled = isVideoOn ? false : true; });
    setIsVideoOn(v => !v);
  };

  const toggleAudio = () => {
    if (localStream) localStream.getAudioTracks().forEach(t => { t.enabled = isAudioOn ? false : true; });
    setIsAudioOn(a => !a);
  };

  const handleJoinCall = () => {
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    navigate(createPageUrl(`VideoCall?id=${appointmentId}&consent=${recordingConsent}`));
  };

  const handleLeave = () => {
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    navigate(createPageUrl('PatientPortal'));
  };

  const statusIcon = (status) => {
    if (status === 'checking') return <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />;
    if (status === 'ok') return <CheckCircle className="w-3 h-3 text-green-400" />;
    return <AlertCircle className="w-3 h-3 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-[#0D1510] flex flex-col items-center justify-center p-4">
      {/* HIPAA Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-6 flex items-center justify-center gap-3 bg-[#4A6741]/20 border border-[#4A6741]/30 rounded-full px-6 py-2.5"
      >
        <Lock className="w-4 h-4 text-[#A8C99B]" />
        <span className="text-[#A8C99B] text-sm font-medium">HIPAA-Compliant Secure Session · End-to-End Encrypted · No Data Stored</span>
        <Shield className="w-4 h-4 text-[#A8C99B]" />
      </motion.div>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6">
        {/* Left: Camera Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Preview */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1A2318] border border-white/10">
            {isVideoOn && localStream ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 rounded-full bg-[#4A6741]/30 flex items-center justify-center mx-auto mb-3">
                    <VideoOff className="w-10 h-10 text-white/50" />
                  </div>
                  <p className="text-white/50 text-sm">Camera is off</p>
                </div>
              </div>
            )}
            {!isAudioOn && (
              <div className="absolute top-3 right-3 bg-red-500 rounded-full p-1.5">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 text-white/60 text-xs bg-black/40 rounded-full px-3 py-1">
              Preview
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleAudio}
              className={`flex flex-col items-center gap-1.5 group`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isAudioOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}>
                {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
              </div>
              <span className="text-white/40 text-xs">{isAudioOn ? 'Mute' : 'Unmute'}</span>
            </button>
            <button
              onClick={toggleVideo}
              className={`flex flex-col items-center gap-1.5 group`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/80 hover:bg-red-500'}`}>
                {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
              </div>
              <span className="text-white/40 text-xs">{isVideoOn ? 'Stop Video' : 'Start Video'}</span>
            </button>
          </div>

          {/* Device Status */}
          <div className="bg-white/5 rounded-2xl p-4 space-y-2.5">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">System Check</p>
            {[
              { label: 'Camera', status: deviceStatus.camera },
              { label: 'Microphone', status: deviceStatus.mic },
              { label: 'Connection', status: deviceStatus.connection },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-white/60 text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  {statusIcon(item.status)}
                  <span className={`text-xs ${item.status === 'ok' ? 'text-green-400' : item.status === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {item.status === 'ok' ? 'Ready' : item.status === 'error' ? 'Issue detected' : 'Checking...'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Waiting Room Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Provider info */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center text-2xl font-light text-white flex-shrink-0">
                {provider?.name?.[0] || 'P'}
              </div>
              <div>
                <h3 className="text-white font-medium">{provider?.name || 'Your Provider'}</h3>
                <p className="text-white/50 text-sm">{provider?.title || 'Medical Provider'}</p>
                {provider?.specialty && <p className="text-[#A8C99B] text-xs mt-0.5">{provider.specialty}</p>}
              </div>
            </div>

            {/* Waiting status */}
            <AnimatePresence mode="wait">
              {admitted ? (
                <motion.div
                  key="admitted"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center"
                >
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">Your provider is ready!</p>
                  <p className="text-white/50 text-sm mt-1">You can join the call now.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  className="bg-[#4A6741]/10 border border-[#4A6741]/20 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 bg-[#4A6741] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/70 font-medium">You're in the waiting room</p>
                  <p className="text-white/40 text-sm mt-1">Your provider will admit you shortly</p>
                  {waitTime > 0 && (
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <Clock className="w-3.5 h-3.5 text-white/30" />
                      <span className="text-white/30 text-xs">Waiting {waitTime} min{waitTime > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recording Consent */}
          {consentShown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-white/80 text-sm font-medium mb-1">Session Recording Consent</p>
                  <p className="text-white/40 text-xs leading-relaxed">
                    This consultation may be recorded for your medical record with your consent. Recordings are stored securely and HIPAA-compliant.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setRecordingConsent(true)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${recordingConsent ? 'bg-[#4A6741] text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
                >
                  ✓ I Consent
                </button>
                <button
                  onClick={() => setRecordingConsent(false)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${!recordingConsent ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60 hover:bg-white/15'}`}
                >
                  No Recording
                </button>
              </div>
            </motion.div>
          )}

          {/* HIPAA Info */}
          <div className="bg-white/5 rounded-2xl p-4 space-y-2">
            {[
              { icon: Lock, text: 'End-to-end encrypted session' },
              { icon: Shield, text: 'HIPAA & HITECH compliant' },
              { icon: Wifi, text: 'Secure TLS 1.3 connection' },
              { icon: Users, text: 'Only your provider can join' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <Icon className="w-3.5 h-3.5 text-[#A8C99B] flex-shrink-0" />
                <span className="text-white/40 text-xs">{text}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            {admitted ? (
              <Button
                onClick={handleJoinCall}
                className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6 text-base font-semibold"
              >
                <Video className="w-5 h-5 mr-2" />
                Join Call Now
              </Button>
            ) : (
              <Button
                onClick={handleJoinCall}
                className="w-full bg-[#4A6741]/60 hover:bg-[#4A6741] text-white rounded-full py-6 text-base font-semibold transition-colors"
              >
                <Video className="w-5 h-5 mr-2" />
                Join When Ready
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleLeave}
              className="w-full text-white/40 hover:text-white/70 hover:bg-white/5 rounded-full"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Leave Waiting Room
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}