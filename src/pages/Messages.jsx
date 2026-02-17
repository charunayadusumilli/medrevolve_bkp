import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Send, ArrowLeft, Paperclip, Loader2, Check, CheckCheck,
  Image, FileText, X, Reply, ChevronDown, ChevronRight, Circle
} from 'lucide-react';

export default function Messages() {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [expandedThreads, setExpandedThreads] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get('appointment');
  const providerId = urlParams.get('provider');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: appointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => base44.entities.Appointment.filter({ id: appointmentId }),
    enabled: !!appointmentId,
    select: (data) => data[0]
  });

  const selectedProviderId = appointment?.provider_id || providerId;

  const { data: provider } = useQuery({
    queryKey: ['provider', selectedProviderId],
    queryFn: () => base44.entities.Provider.filter({ id: selectedProviderId }),
    enabled: !!selectedProviderId,
    select: (data) => data[0]
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', selectedProviderId, user?.email],
    queryFn: () => base44.entities.Message.filter(
      { provider_id: selectedProviderId, patient_email: user?.email },
      'created_date'
    ),
    enabled: !!selectedProviderId && !!user?.email
  });

  // Real-time subscription
  useEffect(() => {
    if (!selectedProviderId || !user?.email) return;
    const unsubscribe = base44.entities.Message.subscribe((event) => {
      if (
        event.data?.provider_id === selectedProviderId &&
        event.data?.patient_email === user.email
      ) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedProviderId, user.email] });
        // Mark as read if it's incoming
        if (event.type === 'create' && event.data?.sender_type !== 'patient' && !event.data?.is_read) {
          base44.entities.Message.update(event.id, { is_read: true });
        }
      }
    });
    return unsubscribe;
  }, [selectedProviderId, user?.email, queryClient]);

  // Mark unread provider messages as read when conversation opens
  useEffect(() => {
    if (!messages.length || !user?.email) return;
    messages.forEach((msg) => {
      if (msg.sender_type !== 'patient' && !msg.is_read) {
        base44.entities.Message.update(msg.id, { is_read: true });
      }
    });
  }, [messages.length]);

  const sendMessage = useMutation({
    mutationFn: (data) => base44.entities.Message.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setMessageText('');
      setAttachments([]);
      setReplyTo(null);
    }
  });

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          return {
            url: file_url,
            name: file.name,
            type: file.type,
            size: file.size
          };
        })
      );
      setAttachments((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if ((!messageText.trim() && attachments.length === 0) || !selectedProviderId || !user?.email) return;

    sendMessage.mutate({
      appointment_id: appointmentId || null,
      provider_id: selectedProviderId,
      patient_email: user.email,
      sender_type: 'patient',
      message_text: messageText.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
      reply_to_id: replyTo?.id || null,
      reply_to_preview: replyTo ? replyTo.message_text?.slice(0, 80) : null,
      is_read: false
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages: top-level (no reply_to_id) get their replies nested
  const topLevel = messages.filter((m) => !m.reply_to_id);
  const replies = messages.filter((m) => !!m.reply_to_id);
  const repliesByParent = replies.reduce((acc, msg) => {
    if (!acc[msg.reply_to_id]) acc[msg.reply_to_id] = [];
    acc[msg.reply_to_id].push(msg);
    return acc;
  }, {});

  const unreadCount = messages.filter((m) => m.sender_type !== 'patient' && !m.is_read).length;

  if (!selectedProviderId) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#5A6B5A] mb-4">Please select a provider or appointment to message</p>
          <Link to={createPageUrl('MyAppointments')}>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
              View Appointments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E0D5] px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to={createPageUrl('MyAppointments')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          {provider ? (
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <img
                  src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80'}
                  alt={provider.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="font-medium text-[#2D3A2D]">{provider.name}, {provider.title}</p>
                <p className="text-xs text-green-500 font-medium">Online</p>
              </div>
              {unreadCount > 0 && (
                <Badge className="ml-auto bg-[#4A6741] text-white">{unreadCount} new</Badge>
              )}
            </div>
          ) : (
            <p className="text-[#2D3A2D] font-medium">Messages</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {topLevel.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#F5F0E8] flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-[#5A6B5A]" />
              </div>
              <p className="text-[#5A6B5A]">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            topLevel.map((message) => {
              const threadReplies = repliesByParent[message.id] || [];
              const isExpanded = expandedThreads[message.id];
              return (
                <div key={message.id}>
                  <MessageBubble
                    message={message}
                    isPatient={message.sender_type === 'patient'}
                    onReply={() => setReplyTo(message)}
                  />
                  {threadReplies.length > 0 && (
                    <div className={`ml-8 mt-1`}>
                      <button
                        onClick={() => setExpandedThreads(prev => ({ ...prev, [message.id]: !isExpanded }))}
                        className="flex items-center gap-1 text-xs text-[#4A6741] hover:underline mb-1"
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        {threadReplies.length} {threadReplies.length === 1 ? 'reply' : 'replies'}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 border-l-2 border-[#E8E0D5] pl-4"
                          >
                            {threadReplies.map((reply) => (
                              <MessageBubble
                                key={reply.id}
                                message={reply}
                                isPatient={reply.sender_type === 'patient'}
                                onReply={() => setReplyTo(message)}
                                isReply
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Banner */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-[#F5F0E8] border-t border-[#E8E0D5] px-6 py-2 flex items-center gap-3 flex-shrink-0"
          >
            <div className="w-0.5 h-8 bg-[#4A6741] rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#4A6741]">Replying to {replyTo.sender_type === 'patient' ? 'yourself' : (provider?.name || 'Provider')}</p>
              <p className="text-xs text-[#5A6B5A] truncate">{replyTo.message_text}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-[#5A6B5A] hover:text-[#2D3A2D]">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white border-t border-[#E8E0D5] px-6 py-2 flex gap-2 flex-wrap flex-shrink-0"
          >
            {attachments.map((att, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-[#F5F0E8] rounded-lg px-3 py-1.5 text-xs">
                {att.type?.startsWith('image/') ? (
                  <Image className="w-3.5 h-3.5 text-[#4A6741]" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-[#4A6741]" />
                )}
                <span className="text-[#2D3A2D] max-w-[120px] truncate">{att.name}</span>
                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}>
                  <X className="w-3 h-3 text-[#5A6B5A] hover:text-red-500" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="bg-white border-t border-[#E8E0D5] px-4 sm:px-6 py-4 flex-shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-[#5A6B5A] hover:text-[#4A6741] hover:bg-[#F5F0E8] rounded-full flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
          </Button>
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-[#E8E0D5] bg-[#FDFBF7] focus:border-[#4A6741]"
            disabled={sendMessage.isPending}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full w-10 h-10 flex-shrink-0"
            disabled={(!messageText.trim() && attachments.length === 0) || sendMessage.isPending || uploading}
          >
            {sendMessage.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message, isPatient, onReply, isReply = false }) {
  const hasAttachments = message.attachments?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex group ${isPatient ? 'justify-end' : 'justify-start'} ${isReply ? 'my-1' : 'my-2'}`}
    >
      <div className={`max-w-[75%] ${isReply ? 'max-w-[90%]' : ''}`}>
        {/* Reply preview */}
        {message.reply_to_preview && (
          <div className={`mb-1 px-3 py-1.5 rounded-xl text-xs border-l-2 border-[#4A6741] bg-[#4A6741]/5 text-[#5A6B5A] truncate`}>
            {message.reply_to_preview}
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 ${
            isPatient
              ? 'bg-[#4A6741] text-white rounded-br-sm'
              : 'bg-white border border-[#E8E0D5] text-[#2D3A2D] rounded-bl-sm'
          }`}
        >
          {message.message_text && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message_text}</p>
          )}

          {/* Attachments */}
          {hasAttachments && (
            <div className="mt-2 space-y-1.5">
              {message.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isPatient
                      ? 'bg-white/20 hover:bg-white/30 text-white'
                      : 'bg-[#F5F0E8] hover:bg-[#EDE5D8] text-[#2D3A2D]'
                  }`}
                >
                  {att.type?.startsWith('image/') ? (
                    <Image className="w-3.5 h-3.5 flex-shrink-0" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                  <span className="truncate max-w-[160px]">{att.name}</span>
                </a>
              ))}
            </div>
          )}

          {/* Timestamp + read status */}
          <div className={`flex items-center gap-1 mt-1.5 ${isPatient ? 'justify-end' : 'justify-start'}`}>
            <span className={`text-[10px] ${isPatient ? 'text-white/50' : 'text-[#5A6B5A]'}`}>
              {new Date(message.created_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
            {isPatient && (
              message.is_read
                ? <CheckCheck className="w-3 h-3 text-white/70" />
                : <Check className="w-3 h-3 text-white/40" />
            )}
            {!isPatient && !message.is_read && (
              <Circle className="w-2 h-2 fill-[#4A6741] text-[#4A6741]" />
            )}
          </div>
        </div>

        {/* Reply button */}
        <button
          onClick={onReply}
          className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-[#5A6B5A] hover:text-[#4A6741] mt-1 ${isPatient ? 'justify-end w-full' : ''}`}
        >
          <Reply className="w-3 h-3" />
          Reply
        </button>
      </div>
    </motion.div>
  );
}