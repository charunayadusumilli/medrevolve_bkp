import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff,
  Monitor, MonitorOff, Circle, StopCircle,
  MessageSquare, Users, Maximize, Minimize,
  Settings, ChevronUp, Volume2, VolumeX
} from 'lucide-react';

export default function VideoCall() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get('id') || urlParams.get('appointment');

  // Media state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting | live | ended
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const callTimerRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const containerRef = useRef(null);

  const { data: appointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const results = await base44.entities.Appointment.filter({ id: appointmentId });
      return results[0];
    },
    enabled: !!appointmentId
  });

  const { data: provider } = useQuery({
    queryKey: ['provider', appointment?.provider_id],
    queryFn: async () => {
      const results = await base44.entities.Provider.filter({ id: appointment?.provider_id });
      return results[0];
    },
    enabled: !!appointment?.provider_id
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Appointment.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] })
  });

  // Initialize local camera
  useEffect(() => {
    let stream;
    const initMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        // Simulate connection after 1.5s
        setTimeout(() => setCallStatus('live'), 1500);
      } catch {
        setCallStatus('live'); // proceed without camera
      }
    };
    initMedia();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (callStatus === 'live') {
      callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(callTimerRef.current);
  }, [callStatus]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 4000);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimerRef.current);
  }, [resetControlsTimer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => { t.enabled = !isVideoOn ? true : false; });
    }
    setIsVideoOn(v => !v);
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => { t.enabled = !isAudioOn ? true : false; });
    }
    setIsAudioOn(a => !a);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenStream(stream);
      setIsScreenSharing(true);
      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
      };
    } catch {
      // user cancelled
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }
    const streamToRecord = localStream;
    if (!streamToRecord) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(streamToRecord, { mimeType: 'video/webm;codecs=vp9' });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consultation-${appointmentId || Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleEndCall = () => {
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    if (screenStream) screenStream.getTracks().forEach(t => t.stop());
    if (isRecording && mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (appointmentId) {
      updateAppointmentMutation.mutate({ id: appointmentId, status: 'completed' });
    }
    setCallStatus('ended');
    setTimeout(() => navigate(createPageUrl('PatientPortal')), 2000);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(m => [...m, { role: 'user', text: chatInput, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  if (callStatus === 'ended') {
    return (
      <div className="h-screen bg-[#1A2318] flex items-center justify-center text-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <PhoneOff className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-light mb-2">Call Ended</h2>
          <p className="text-white/60">Duration: {formatTime(callDuration)}</p>
          <p className="text-white/40 text-sm mt-2">Redirecting to your portal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen bg-[#0D1510] flex flex-col relative overflow-hidden select-none"
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
    >
      {/* Main video area */}
      <div className="flex-1 relative flex">
        {/* Remote / Provider video (placeholder) */}
        <div className={`flex-1 relative ${showChat ? 'mr-80' : ''} transition-all duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2A1A] to-[#0D1510] flex items-center justify-center">
            {callStatus === 'connecting' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
                <div className="w-24 h-24 rounded-full bg-[#4A6741]/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="w-12 h-12 text-[#4A6741]" />
                </div>
                <p className="text-lg">Connecting to {provider?.name || 'your provider'}...</p>
                <div className="flex gap-1 justify-center mt-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-2 h-2 bg-[#4A6741] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-white">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto mb-3 text-5xl font-light">
                  {provider?.name?.[0] || 'P'}
                </div>
                <p className="text-xl font-light">{provider?.name || 'Provider'}</p>
                <p className="text-white/50 text-sm">{provider?.title}</p>
              </div>
            )}
          </div>

          {/* Screen share overlay */}
          {isScreenSharing && screenStream && (
            <video
              ref={screenVideoRef}
              autoPlay
              muted
              className="absolute inset-0 w-full h-full object-contain bg-black"
              ref={(el) => { if (el && screenStream) el.srcObject = screenStream; }}
            />
          )}

          {/* Top bar */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <div className={`w-2 h-2 rounded-full ${callStatus === 'live' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400 animate-pulse'}`} />
                    <span className="text-white text-sm font-medium">
                      {callStatus === 'connecting' ? 'Connecting...' : formatTime(callDuration)}
                    </span>
                  </div>
                  {isRecording && (
                    <div className="flex items-center gap-2 bg-red-500/80 backdrop-blur-sm rounded-full px-4 py-1.5">
                      <Circle className="w-3 h-3 text-white fill-white animate-pulse" />
                      <span className="text-white text-sm font-medium">REC {formatTime(recordingTime)}</span>
                    </div>
                  )}
                  {isScreenSharing && (
                    <Badge className="bg-blue-500/80 text-white border-none backdrop-blur-sm">Screen Sharing</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={toggleFullscreen} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors">
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setShowChat(c => !c)} className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors ${showChat ? 'bg-[#4A6741]/80' : 'bg-black/30'}`}>
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Local self-view (PiP) */}
          <motion.div
            drag
            dragConstraints={containerRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-24 right-6 w-44 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-grab active:cursor-grabbing z-10"
          >
            {isVideoOn && localStream ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#2D3A2D] to-[#1A2318] flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-6 h-6 mx-auto mb-1 opacity-60" />
                  <p className="text-xs opacity-60">Camera Off</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-1 left-2 text-white text-xs opacity-70">You</div>
            {!isAudioOn && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-[#0D1510]/95 backdrop-blur-sm border-l border-white/10 flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">In-call Chat</h3>
                <button onClick={() => setShowChat(false)} className="text-white/60 hover:text-white text-xs">Close</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 && (
                  <p className="text-white/30 text-xs text-center mt-8">No messages yet. Say hi!</p>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-3 py-2 max-w-[85%] ${msg.role === 'user' ? 'bg-[#4A6741] text-white' : 'bg-white/10 text-white'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <span className="text-white/30 text-xs mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10 flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 text-white placeholder-white/30 rounded-full px-4 py-2 text-sm outline-none focus:bg-white/15 transition-colors"
                />
                <button onClick={sendChatMessage} className="w-9 h-9 bg-[#4A6741] rounded-full flex items-center justify-center text-white hover:bg-[#3D5636] transition-colors">
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-[#0D1510]/90 backdrop-blur-md border-t border-white/10 px-6 py-4"
          >
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
              {/* Left controls */}
              <div className="flex items-center gap-2">
                <ControlBtn
                  active={isAudioOn}
                  onClick={toggleAudio}
                  icon={isAudioOn ? Mic : MicOff}
                  label={isAudioOn ? 'Mute' : 'Unmute'}
                />
                <ControlBtn
                  active={isVideoOn}
                  onClick={toggleVideo}
                  icon={isVideoOn ? Video : VideoOff}
                  label={isVideoOn ? 'Stop Video' : 'Start Video'}
                />
              </div>

              {/* Center — end call */}
              <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                <ControlBtn
                  active={!isScreenSharing}
                  activeColor="bg-blue-500"
                  onClick={toggleScreenShare}
                  icon={isScreenSharing ? MonitorOff : Monitor}
                  label={isScreenSharing ? 'Stop Share' : 'Share Screen'}
                />
                <ControlBtn
                  active={!isRecording}
                  activeColor="bg-red-500"
                  onClick={toggleRecording}
                  icon={isRecording ? StopCircle : Circle}
                  label={isRecording ? 'Stop Rec' : 'Record'}
                  danger={isRecording}
                />
              </div>
            </div>

            {/* Bottom hints */}
            <div className="flex justify-center gap-6 mt-3">
              {[
                isAudioOn ? '🎙 Mic On' : '🔇 Muted',
                isVideoOn ? '📹 Camera On' : '📵 Camera Off',
                isScreenSharing ? '🖥 Sharing' : null,
                isRecording ? `⏺ Recording ${formatTime(recordingTime)}` : null
              ].filter(Boolean).map((hint, i) => (
                <span key={i} className="text-white/40 text-xs">{hint}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ControlBtn({ onClick, icon: Icon, label, active = true, activeColor = 'bg-white/10', danger = false }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-1 group`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
        danger ? 'bg-red-500/80 hover:bg-red-500' :
        active ? `${activeColor} hover:bg-white/20` :
        'bg-red-500/80 hover:bg-red-500'
      } text-white`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-white/50 text-[10px] group-hover:text-white/70 transition-colors">{label}</span>
    </button>
  );
}