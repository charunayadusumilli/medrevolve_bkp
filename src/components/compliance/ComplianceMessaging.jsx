import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, MessageSquare, CheckCircle } from 'lucide-react';

export default function ComplianceMessaging({ compliance, user }) {
  const [newMessage, setNewMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['compliance-messages', compliance.id],
    queryFn: () => base44.entities.ComplianceMessage.filter(
      { compliance_id: compliance.id },
      'created_date',
      100
    ),
    refetchInterval: 10000 // poll every 10s
  });

  // Mark unread messages as read
  useEffect(() => {
    const unread = messages.filter(m => !m.is_read && m.sender_role !== user.role);
    unread.forEach(m => {
      base44.entities.ComplianceMessage.update(m.id, {
        is_read: true,
        read_at: new Date().toISOString()
      });
    });
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.ComplianceMessage.subscribe((event) => {
      if (event.data?.compliance_id === compliance.id) {
        queryClient.invalidateQueries(['compliance-messages', compliance.id]);
      }
    });
    return unsubscribe;
  }, [compliance.id]);

  const handleSend = async () => {
    if (!newMessage.trim() && !attachmentFile) return;
    setSending(true);
    try {
      let attachment_url = null;
      let attachment_name = null;

      if (attachmentFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: attachmentFile });
        attachment_url = file_url;
        attachment_name = attachmentFile.name;
      }

      await base44.entities.ComplianceMessage.create({
        compliance_id: compliance.id,
        partner_id: compliance.partner_id,
        sender_email: user.email,
        sender_name: user.full_name || user.email,
        sender_role: user.role === 'admin' ? 'admin' : 'partner',
        message: newMessage.trim() || `Attached: ${attachment_name}`,
        attachment_url,
        attachment_name,
        is_read: false,
      });

      setNewMessage('');
      setAttachmentFile(null);
      queryClient.invalidateQueries(['compliance-messages', compliance.id]);
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isPartner = user.role !== 'admin';

  return (
    <Card className="flex flex-col" style={{ height: '600px' }}>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#4A6741]" />
          Compliance Team
        </CardTitle>
        <CardDescription>Communicate securely with our compliance team</CardDescription>
      </CardHeader>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4A6741]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start a conversation with the compliance team</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_email === user.email;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`flex items-center gap-2 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-gray-500">{msg.sender_name || msg.sender_email}</span>
                    {msg.sender_role === 'admin' && (
                      <Badge className="bg-[#4A6741]/10 text-[#4A6741] text-xs py-0">
                        Compliance Team
                      </Badge>
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-[#4A6741] text-white rounded-br-sm' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}>
                    <p>{msg.message}</p>
                    {msg.attachment_url && (
                      <a
                        href={msg.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 mt-2 text-xs underline ${isMe ? 'text-white/80' : 'text-blue-600'}`}
                      >
                        <Paperclip className="w-3 h-3" />
                        {msg.attachment_name || 'Attachment'}
                      </a>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      {new Date(msg.created_date).toLocaleDateString()}
                    </span>
                    {isMe && msg.is_read && (
                      <CheckCircle className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-gray-50">
        {attachmentFile && (
          <div className="mb-2 flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
            <Paperclip className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800 flex-1 truncate">{attachmentFile.name}</span>
            <button onClick={() => setAttachmentFile(null)} className="text-blue-600 hover:text-blue-800 font-medium">×</button>
          </div>
        )}
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setAttachmentFile(e.target.files[0])}
            />
            <div className="h-10 w-10 flex items-center justify-center rounded-lg border hover:bg-gray-100 transition-colors">
              <Paperclip className="w-4 h-4 text-gray-500" />
            </div>
          </label>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            className="flex-1"
            disabled={sending}
          />
          <Button
            onClick={handleSend}
            disabled={sending || (!newMessage.trim() && !attachmentFile)}
            className="bg-[#4A6741] hover:bg-[#3D5636]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Messages are private and encrypted. Response time is typically 1-2 business days.</p>
      </div>
    </Card>
  );
}