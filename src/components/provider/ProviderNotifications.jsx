import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Bell, X, Calendar, XCircle, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ProviderNotifications({ providerId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!providerId) return;

    // Real-time subscription to appointment changes for this provider
    const unsub = base44.entities.Appointment.subscribe((event) => {
      if (!['create', 'update'].includes(event.type)) return;
      const data = event.data;
      if (!data || data.provider_id !== providerId) return;

      let title = '';
      let icon = Calendar;
      let color = 'text-blue-600 bg-blue-50';

      if (event.type === 'create') {
        title = `New appointment from ${data.patient_email?.split('@')[0]}`;
        color = 'text-green-600 bg-green-50';
        icon = CheckCircle;
      } else if (event.type === 'update' && data.status === 'cancelled') {
        title = `Appointment cancelled by ${data.patient_email?.split('@')[0]}`;
        color = 'text-red-600 bg-red-50';
        icon = XCircle;
      } else if (event.type === 'update' && data.status === 'confirmed') {
        title = `Appointment confirmed`;
        color = 'text-green-600 bg-green-50';
      } else {
        return; // ignore other updates
      }

      const notif = {
        id: `${event.type}-${data.id}-${Date.now()}`,
        title,
        subtitle: data.appointment_date ? format(parseISO(data.appointment_date), 'MMM d · h:mm a') : '',
        color,
        icon,
        time: new Date(),
        read: false
      };

      setNotifications(prev => [notif, ...prev].slice(0, 20));
      setUnread(u => u + 1);
    });

    return () => unsub();
  }, [providerId]);

  const markAllRead = () => {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    setUnread(0);
  };

  const dismiss = (id) => setNotifications(n => n.filter(x => x.id !== id));

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
        className="relative w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-[#F5F0E8] transition-colors"
      >
        <Bell className="w-4 h-4 text-[#2D3A2D]" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-sm text-[#2D3A2D]">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-xs text-[#4A6741] hover:underline">Mark all read</button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-[#5A6B5A]">No notifications yet</p>
                    <p className="text-xs text-gray-400 mt-1">New appointments & changes will appear here</p>
                  </div>
                ) : (
                  notifications.map(n => {
                    const Icon = n.icon || Calendar;
                    return (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 ${!n.read ? 'bg-[#FDFBF7]' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#2D3A2D] font-medium leading-snug">{n.title}</p>
                          {n.subtitle && <p className="text-xs text-[#5A6B5A] mt-0.5">{n.subtitle}</p>}
                          <p className="text-[10px] text-gray-400 mt-1">{format(n.time, 'h:mm a')}</p>
                        </div>
                        <button onClick={() => dismiss(n.id)} className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}