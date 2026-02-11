import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send, ArrowLeft, Paperclip, Loader2 } from 'lucide-react';

export default function Messages() {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState('');
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
    enabled: !!selectedProviderId && !!user?.email,
    refetchInterval: 5000 // Poll every 5 seconds for new messages
  });

  const sendMessage = useMutation({
    mutationFn: (data) => base44.entities.Message.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      setMessageText('');
    }
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedProviderId || !user?.email) return;

    sendMessage.mutate({
      appointment_id: appointmentId || null,
      provider_id: selectedProviderId,
      patient_email: user.email,
      sender_type: 'patient',
      message_text: messageText.trim(),
      is_read: false
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      <div className="bg-white border-b border-[#E8E0D5] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to={createPageUrl('MyAppointments')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          {provider && (
            <>
              <img 
                src={provider.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&q=80'}
                alt={provider.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-[#2D3A2D]">{provider.name}, {provider.title}</p>
                <p className="text-sm text-[#5A6B5A]">{provider.specialty}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#5A6B5A]">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender_type === 'patient' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender_type === 'patient'
                      ? 'bg-[#4A6741] text-white'
                      : 'bg-white border border-[#E8E0D5] text-[#2D3A2D]'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.message_text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender_type === 'patient' ? 'text-white/60' : 'text-[#5A6B5A]'
                  }`}>
                    {new Date(message.created_date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[#E8E0D5] px-6 py-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full"
            disabled={sendMessage.isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full w-12 h-12"
            disabled={!messageText.trim() || sendMessage.isPending}
          >
            {sendMessage.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}