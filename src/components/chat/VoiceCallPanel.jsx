import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, PhoneOff, Video, VideoOff, Monitor, MonitorOff,
  MessageSquare, ChevronDown, Sparkles, Loader2, Volume2, VolumeX,
  Camera, ScreenShare, StopCircle, Maximize2, Minimize2, Send, X
} from 'lucide-react';
import RevBotLogo from './RevBotLogo';

// ─── Sound Wave Visualizer ────────────────────────────────────────────────────
function SoundBars({ active, color = '#A8C99B', bars = 16, height = 48 }) {
  return (
    <div className="flex items-center gap-[2px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: 3, background: color, originY: 1 }}
          animate={active ? {
            height: [
              4,
              Math.random() * (height * 0.8) + height * 0.1,
              Math.random() * (height * 0.6) + height * 0.05,
              4
            ]
          } : { height: 4 }}
          transition={active ? {
            duration: 0.5 + Math.random() * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.04,
          } : { duration: 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Transcript line ──────────────────────────────────────────────────────────
function TranscriptLine({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
        isUser
          ? 'bg-white/20 text-white rounded-br-sm'
          : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/15'
      }`}>
        {msg.streaming ? (
          <span>
            {msg.content}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-0.5 h-4 bg-white/60 ml-0.5 align-middle"
            />
          </span>
        ) : msg.content}
      </div>
    </motion.div>
  );
}

// ─── Orbiting particle ring ───────────────────────────────────────────────────
function OrbitRing({ active, color, radius = 90, particles = 8 }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: particles }).map((_, i) => {
        const angle = (i / particles) * 360;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ background: color, opacity: 0.6 }}
            animate={{
              rotate: [angle, angle + 360],
              x: [
                Math.cos((angle * Math.PI) / 180) * radius,
                Math.cos(((angle + 360) * Math.PI) / 180) * radius
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * radius,
                Math.sin(((angle + 360) * Math.PI) / 180) * radius
              ],
              scale: [0.6, 1.2, 0.6],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.15,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VoiceCallPanel({
  ctx, status, isSpeaking, isListening, isListeningPaused,
  onEndCall, onToggleMic, transcript = [], onSendText,
}) {
  const { personaKey, persona, role, gradient } = ctx;
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenEnabled, setScreenEnabled] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [userVideoStream, setUserVideoStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const videoRef = useRef(null);
  const screenRef = useRef(null);
  const transcriptRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  // Camera toggle
  const toggleVideo = useCallback(async () => {
    if (videoEnabled) {
      userVideoStream?.getTracks().forEach(t => t.stop());
      setUserVideoStream(null);
      setVideoEnabled(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setUserVideoStream(stream);
      setVideoEnabled(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.warn('Camera not available:', e);
    }
  }, [videoEnabled, userVideoStream]);

  // Attach video stream
  useEffect(() => {
    if (videoRef.current && userVideoStream) {
      videoRef.current.srcObject = userVideoStream;
    }
  }, [userVideoStream]);

  // Screen share toggle
  const toggleScreen = useCallback(async () => {
    if (screenEnabled) {
      screenStream?.getTracks().forEach(t => t.stop());
      setScreenStream(null);
      setScreenEnabled(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        setScreenEnabled(false);
      };
      setScreenStream(stream);
      setScreenEnabled(true);
      if (screenRef.current) screenRef.current.srcObject = stream;
    } catch (e) {
      console.warn('Screen share not available:', e);
    }
  }, [screenEnabled, screenStream]);

  useEffect(() => {
    if (screenRef.current && screenStream) {
      screenRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      userVideoStream?.getTracks().forEach(t => t.stop());
      screenStream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleEnd = () => {
    userVideoStream?.getTracks().forEach(t => t.stop());
    screenStream?.getTracks().forEach(t => t.stop());
    onEndCall();
  };

  const handleSendText = () => {
    if (!textInput.trim()) return;
    onSendText?.(textInput.trim());
    setTextInput('');
  };

  const statusLabel = isSpeaking ? 'AI Speaking...'
    : isListening ? 'Listening...'
    : status === 'thinking' ? 'Processing...'
    : isListeningPaused ? 'Microphone Muted'
    : 'Tap mic to speak';

  const primaryColor = isSpeaking ? '#A8C99B'
    : isListening ? '#F87171'
    : 'rgba(255,255,255,0.5)';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #040d04 0%, ${gradient[0]}cc 45%, ${gradient[1]}cc 100%)`,
      }}
    >
      {/* ── Background ambient blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: gradient[0], filter: 'blur(120px)' }}
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: gradient[1], filter: 'blur(100px)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-red-500 rounded-full px-3 py-1">
            <motion.span
              className="w-2 h-2 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-white text-xs font-bold tracking-wide">LIVE</span>
          </div>
          <span className="text-white/60 text-sm">MedRevolve AI Session</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFullscreen(f => !f)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex relative z-10 min-h-0">

        {/* ── Screen share panel ── */}
        <AnimatePresence>
          {screenEnabled && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '55%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="relative bg-black/40 border-r border-white/10 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-black/30">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-xs font-medium">Screen Share</span>
                </div>
                <button onClick={toggleScreen} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 relative">
                <video
                  ref={screenRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
                <div className="absolute bottom-3 left-3 bg-black/50 rounded-lg px-2 py-1 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white text-xs">AI can see your screen</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI + User center ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-6">

          {/* AI Avatar with energy rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer glow pulse */}
            <AnimatePresence>
              {(isSpeaking || isListening) && (
                <>
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 160 + i * 40,
                        height: 160 + i * 40,
                        border: `1.5px solid ${primaryColor}`,
                        opacity: 0.4 / i,
                      }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.4 / i, 0, 0.4 / i] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Orbit particles when speaking */}
            {isSpeaking && (
              <OrbitRing active={true} color={gradient[1]} radius={100} particles={10} />
            )}

            {/* Avatar circle */}
            <motion.div
              className="relative w-36 h-36 rounded-full border-2 overflow-hidden shadow-2xl flex items-center justify-center"
              style={{
                borderColor: primaryColor,
                background: `linear-gradient(160deg, ${gradient[0]}33, ${gradient[1]}66)`,
                boxShadow: `0 0 40px ${gradient[0]}44, 0 0 80px ${gradient[1]}22`,
              }}
              animate={isSpeaking ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
            >
              <RevBotLogo size={72} color="white" />
            </motion.div>

            {/* Status dot */}
            <motion.span
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white shadow z-20"
              style={{ background: isListening ? '#F87171' : '#4ade80' }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>

          {/* Name + Role */}
          <div className="text-center">
            <p className="text-white text-xl font-bold">{persona}</p>
            <p className="text-white/50 text-sm">{role}</p>
          </div>

          {/* Sound bars */}
          <div className="flex flex-col items-center gap-2">
            <SoundBars
              active={isSpeaking || isListening}
              color={primaryColor}
              bars={20}
              height={40}
            />
            <div className="flex items-center gap-2">
              {status === 'thinking' && (
                <Loader2 className="w-3.5 h-3.5 text-white/60 animate-spin" />
              )}
              <p className="text-sm font-medium" style={{ color: primaryColor }}>
                {statusLabel}
              </p>
            </div>
          </div>

          {/* User camera (PiP) */}
          <AnimatePresence>
            {videoEnabled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute bottom-24 right-6 w-32 h-24 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl bg-black"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute top-1.5 left-1.5 bg-black/50 rounded-full px-1.5 py-0.5 flex items-center gap-1">
                  <Camera className="w-2.5 h-2.5 text-white" />
                  <span className="text-white text-[9px]">You</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Chat transcript sidebar ── */}
        <AnimatePresence>
          {chatVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col bg-white/5 border-l border-white/10 backdrop-blur-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm font-medium">Live Transcript</span>
                </div>
                <button onClick={() => setChatVisible(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                {transcript.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                    <Sparkles className="w-8 h-8 text-white/20" />
                    <p className="text-white/30 text-xs text-center">Start speaking or type below<br/>to see the conversation</p>
                  </div>
                ) : (
                  transcript.map((msg, i) => <TranscriptLine key={i} msg={msg} />)
                )}
              </div>

              {/* Text input in chat */}
              <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendText(); }}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 text-white placeholder-white/30 text-sm rounded-full px-3 py-2 border border-white/15 focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={handleSendText}
                    disabled={!textInput.trim()}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls bar ── */}
      <div className="relative z-10 flex items-center justify-center gap-4 px-6 py-5">
        {/* Mic */}
        <ControlButton
          active={!isListeningPaused}
          onClick={onToggleMic}
          icon={isListeningPaused ? MicOff : Mic}
          label={isListeningPaused ? 'Unmute' : 'Mute'}
          activeColor="#4ade80"
          inactiveColor="#ef4444"
        />

        {/* Speaker */}
        <ControlButton
          active={!speakerMuted}
          onClick={() => setSpeakerMuted(v => !v)}
          icon={speakerMuted ? VolumeX : Volume2}
          label={speakerMuted ? 'Speaker off' : 'Speaker on'}
          activeColor={gradient[1]}
          inactiveColor="#6b7280"
        />

        {/* Camera */}
        <ControlButton
          active={videoEnabled}
          onClick={toggleVideo}
          icon={videoEnabled ? Video : VideoOff}
          label={videoEnabled ? 'Camera on' : 'Camera'}
          activeColor="#60a5fa"
          inactiveColor="#6b7280"
        />

        {/* Screen share */}
        <ControlButton
          active={screenEnabled}
          onClick={toggleScreen}
          icon={screenEnabled ? MonitorOff : Monitor}
          label={screenEnabled ? 'Stop share' : 'Share screen'}
          activeColor="#a78bfa"
          inactiveColor="#6b7280"
        />

        {/* Transcript */}
        <ControlButton
          active={chatVisible}
          onClick={() => setChatVisible(v => !v)}
          icon={MessageSquare}
          label="Transcript"
          activeColor={gradient[0]}
          inactiveColor="#6b7280"
          badge={transcript.length > 0 ? transcript.length : null}
        />

        {/* End call */}
        <motion.button
          onClick={handleEnd}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="w-16 h-16 rounded-full flex flex-col items-center justify-center gap-0.5 shadow-2xl bg-red-500 hover:bg-red-600 transition-colors"
          aria-label="End call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* ── Bottom disclaimer ── */}
      <p className="relative z-10 text-center text-white/15 text-[10px] pb-3">
        MedRevolve AI • Not medical advice • AI voice session
      </p>
    </motion.div>
  );
}

// ─── Reusable control button ──────────────────────────────────────────────────
function ControlButton({ active, onClick, icon: Icon, label, activeColor, inactiveColor, badge }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      className="relative flex flex-col items-center gap-1.5 group"
      aria-label={label}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-200"
        style={{
          background: active ? `${activeColor}22` : 'rgba(255,255,255,0.08)',
          borderColor: active ? `${activeColor}66` : 'rgba(255,255,255,0.12)',
          color: active ? activeColor : 'rgba(255,255,255,0.5)',
          boxShadow: active ? `0 0 16px ${activeColor}33` : 'none',
        }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] text-white/40 group-hover:text-white/70 transition-colors">{label}</span>
      {badge !== null && badge !== undefined && (
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </motion.button>
  );
}