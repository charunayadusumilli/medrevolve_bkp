import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, ChevronRight, Video, Phone,
  MessageSquare, Clock, Ban, CalendarOff
} from 'lucide-react';
import {
  format, startOfWeek, addDays, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths,
  parseISO, getHours, getMinutes
} from 'date-fns';

const TYPE_ICONS = { video: Video, phone: Phone, chat: MessageSquare };
const TYPE_COLORS = {
  video: 'bg-blue-100 text-blue-800 border-blue-200',
  phone: 'bg-amber-100 text-amber-800 border-amber-200',
  chat: 'bg-purple-100 text-purple-800 border-purple-200',
  in_person: 'bg-green-100 text-green-800 border-green-200',
  initial_consultation: 'bg-violet-100 text-violet-800 border-violet-200',
  follow_up: 'bg-blue-100 text-blue-800 border-blue-200',
  dosage_adjustment: 'bg-purple-100 text-purple-800 border-purple-200',
  general_inquiry: 'bg-amber-100 text-amber-800 border-amber-200',
};
const STATUS_DOT = {
  scheduled: 'bg-blue-400',
  confirmed: 'bg-green-400',
  in_progress: 'bg-yellow-400',
  completed: 'bg-gray-300',
  cancelled: 'bg-red-400',
  pending: 'bg-orange-400',
};
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7am–7pm

// Check if a given hour slot is within a blocked time range
function isHourBlocked(date, hour, blockedTimes) {
  const slotStart = new Date(date);
  slotStart.setHours(hour, 0, 0, 0);
  const slotEnd = new Date(date);
  slotEnd.setHours(hour, 59, 59, 999);
  const dayOfWeek = date.getDay();

  return blockedTimes.some(block => {
    if (block.is_recurring) {
      const blockDay = block.recurring_day_of_week ?? new Date(block.start_datetime).getDay();
      if (blockDay !== dayOfWeek) return false;
      const [bsh, bsm] = (block.recurring_start_time || '00:00').split(':').map(Number);
      const [beh, bem] = (block.recurring_end_time || '23:59').split(':').map(Number);
      const blockStart = new Date(date); blockStart.setHours(bsh, bsm, 0, 0);
      const blockEnd = new Date(date); blockEnd.setHours(beh, bem, 0, 0);
      return slotStart < blockEnd && slotEnd > blockStart;
    }
    const blockStart = new Date(block.start_datetime);
    const blockEnd = new Date(block.end_datetime);
    return slotStart < blockEnd && slotEnd > blockStart;
  });
}

// Check if hour is a working hour based on schedules
function isWorkingHour(date, hour, schedules) {
  const dayOfWeek = date.getDay();
  const daySchedules = schedules.filter(s => s.day_of_week === dayOfWeek && s.is_available);
  if (daySchedules.length === 0) return false;
  return daySchedules.some(s => {
    const startH = parseInt(s.start_time?.split(':')[0] || 0);
    const endH = parseInt(s.end_time?.split(':')[0] || 24);
    return hour >= startH && hour < endH;
  });
}

export default function AppointmentCalendar({ appointments, blockedTimes = [], schedules = [], onSelectAppointment }) {
  const [view, setView] = useState('week');
  const [current, setCurrent] = useState(new Date());

  const prev = () => {
    if (view === 'day') setCurrent(d => addDays(d, -1));
    else if (view === 'week') setCurrent(d => addDays(d, -7));
    else setCurrent(d => subMonths(d, 1));
  };
  const next = () => {
    if (view === 'day') setCurrent(d => addDays(d, 1));
    else if (view === 'week') setCurrent(d => addDays(d, 7));
    else setCurrent(d => addMonths(d, 1));
  };
  const goToday = () => setCurrent(new Date());

  const title = useMemo(() => {
    if (view === 'day') return format(current, 'EEEE, MMMM d, yyyy');
    if (view === 'week') {
      const ws = startOfWeek(current);
      const we = addDays(ws, 6);
      return `${format(ws, 'MMM d')} – ${format(we, 'MMM d, yyyy')}`;
    }
    return format(current, 'MMMM yyyy');
  }, [view, current]);

  const aptsForDay = (day) =>
    appointments.filter(a => {
      try { return isSameDay(parseISO(a.appointment_date), day); } catch { return false; }
    });

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday} className="rounded-full text-xs">Today</Button>
          <Button variant="ghost" size="icon" onClick={prev}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={next}><ChevronRight className="w-4 h-4" /></Button>
          <span className="font-medium text-[#2D3A2D] text-sm ml-1">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#5A6B5A]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-200" />
              <span>Appointment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-200" />
              <span>Blocked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
              <span>Off hours</span>
            </div>
          </div>
          <div className="flex gap-1 bg-[#F5F0E8] rounded-full p-1">
            {['day', 'week', 'month'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-1 rounded-full text-xs font-medium transition-colors capitalize ${view === v ? 'bg-white text-[#2D3A2D] shadow-sm' : 'text-[#5A6B5A] hover:text-[#2D3A2D]'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={view + format(current, 'yyyy-MM-dd')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {view === 'month' && <MonthView current={current} aptsForDay={aptsForDay} blockedTimes={blockedTimes} setCurrent={setCurrent} setView={setView} onSelectAppointment={onSelectAppointment} />}
          {view === 'week' && <WeekView current={current} aptsForDay={aptsForDay} blockedTimes={blockedTimes} schedules={schedules} onSelectAppointment={onSelectAppointment} setCurrent={setCurrent} setView={setView} />}
          {view === 'day' && <DayView current={current} apts={aptsForDay(current)} blockedTimes={blockedTimes} schedules={schedules} onSelectAppointment={onSelectAppointment} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MonthView({ current, aptsForDay, blockedTimes, setCurrent, setView, onSelectAppointment }) {
  const days = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) });
  const startPad = startOfMonth(current).getDay();
  const cells = [...Array(startPad).fill(null), ...days];

  const isDayBlocked = (day) => blockedTimes.some(block => {
    if (block.is_recurring) {
      const blockDay = block.recurring_day_of_week ?? new Date(block.start_datetime).getDay();
      return blockDay === day.getDay();
    }
    const bs = new Date(block.start_datetime);
    const be = new Date(block.end_datetime);
    return isSameDay(bs, day) || (bs <= day && be >= day);
  });

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-[#5A6B5A] py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />;
          const apts = aptsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, current);
          const blocked = isDayBlocked(day);
          return (
            <div key={day.toISOString()}
              className={`min-h-[80px] rounded-xl p-1.5 cursor-pointer transition-colors relative
                ${isToday ? 'bg-[#4A6741]/10 ring-1 ring-[#4A6741]' : blocked ? 'bg-red-50/60' : 'hover:bg-[#F5F0E8]'}
                ${!isCurrentMonth ? 'opacity-30' : ''}`}
              onClick={() => { setCurrent(day); setView('day'); }}>
              <span className={`text-xs font-semibold block mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#4A6741] text-white' : 'text-[#2D3A2D]'}`}>
                {format(day, 'd')}
              </span>
              {blocked && apts.length === 0 && (
                <div className="flex items-center gap-0.5 text-[10px] text-red-400">
                  <Ban className="w-2.5 h-2.5" /><span>Blocked</span>
                </div>
              )}
              <div className="space-y-0.5">
                {apts.slice(0, 2).map(a => (
                  <div key={a.id} onClick={e => { e.stopPropagation(); onSelectAppointment(a); }}
                    className={`text-[10px] px-1.5 py-0.5 rounded-md truncate border ${TYPE_COLORS[a.type] || TYPE_COLORS.video} cursor-pointer`}>
                    {format(parseISO(a.appointment_date), 'h:mm a')} · {a.patient_email?.split('@')[0]}
                  </div>
                ))}
                {apts.length > 2 && <div className="text-[10px] text-[#5A6B5A] pl-1">+{apts.length - 2} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ current, aptsForDay, blockedTimes, schedules, onSelectAppointment, setCurrent, setView }) {
  const weekStart = startOfWeek(current);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-gray-100">
          <div className="p-3" />
          {days.map(day => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toISOString()} className="p-3 text-center border-l border-gray-50 cursor-pointer hover:bg-[#F5F0E8] transition-colors" onClick={() => { setCurrent(day); setView('day'); }}>
                <div className="text-xs text-[#5A6B5A] font-medium">{format(day, 'EEE')}</div>
                <div className={`text-lg font-semibold mt-0.5 w-9 h-9 rounded-full flex items-center justify-center mx-auto ${isToday ? 'bg-[#4A6741] text-white' : 'text-[#2D3A2D]'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
        {/* Time grid */}
        <div className="overflow-y-auto max-h-[540px]">
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-50 min-h-[56px]">
              <div className="p-2 text-right pr-3 text-xs text-[#5A6B5A] pt-1 flex-shrink-0">
                {hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`}
              </div>
              {days.map(day => {
                const apts = aptsForDay(day).filter(a => {
                  try { return getHours(parseISO(a.appointment_date)) === hour; } catch { return false; }
                });
                const blocked = isHourBlocked(day, hour, blockedTimes);
                const working = isWorkingHour(day, hour, schedules);
                return (
                  <div key={day.toISOString()} className={`border-l border-gray-50 p-0.5 relative
                    ${blocked ? 'bg-red-50' : !working ? 'bg-gray-50/60' : ''}`}>
                    {blocked && apts.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <Ban className="w-3.5 h-3.5 text-red-400" />
                      </div>
                    )}
                    {apts.map(a => (
                      <div key={a.id} onClick={() => onSelectAppointment(a)}
                        className={`text-[10px] px-1.5 py-1 rounded-md mb-0.5 border cursor-pointer hover:opacity-80 transition-opacity ${TYPE_COLORS[a.type] || TYPE_COLORS.video}`}>
                        <div className="font-semibold">{format(parseISO(a.appointment_date), 'h:mm a')}</div>
                        <div className="truncate">{a.patient_email?.split('@')[0]}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayView({ current, apts, blockedTimes, schedules, onSelectAppointment }) {
  const blockedRanges = useMemo(() => {
    const dayOfWeek = current.getDay();
    return blockedTimes
      .filter(block => {
        if (block.is_recurring) {
          const blockDay = block.recurring_day_of_week ?? new Date(block.start_datetime).getDay();
          return blockDay === dayOfWeek;
        }
        const bs = new Date(block.start_datetime);
        const be = new Date(block.end_datetime);
        const startOfCurrent = new Date(current); startOfCurrent.setHours(0,0,0,0);
        const endOfCurrent = new Date(current); endOfCurrent.setHours(23,59,59,999);
        return bs <= endOfCurrent && be >= startOfCurrent;
      })
      .map(block => {
        if (block.is_recurring) {
          const [bsh, bsm] = (block.recurring_start_time || '00:00').split(':').map(Number);
          const [beh, bem] = (block.recurring_end_time || '23:59').split(':').map(Number);
          return { startH: bsh, startM: bsm, endH: beh, endM: bem, reason: block.reason };
        }
        const bs = new Date(block.start_datetime);
        const be = new Date(block.end_datetime);
        return { startH: bs.getHours(), startM: bs.getMinutes(), endH: be.getHours(), endM: be.getMinutes(), reason: block.reason };
      });
  }, [current, blockedTimes]);

  return (
    <div className="overflow-y-auto max-h-[600px]">
      {HOURS.map(hour => {
        const slotApts = apts.filter(a => {
          try { return getHours(parseISO(a.appointment_date)) === hour; } catch { return false; }
        });
        const blocked = isHourBlocked(current, hour, blockedTimes);
        const working = isWorkingHour(current, hour, schedules);
        const blockedRange = blockedRanges.find(r => hour >= r.startH && hour < r.endH);

        return (
          <div key={hour} className={`flex border-b border-gray-50 min-h-[64px] ${blocked ? 'bg-red-50/50' : !working ? 'bg-gray-50/40' : ''}`}>
            <div className="w-20 flex-shrink-0 p-3 text-right text-xs text-[#5A6B5A]">
              {hour === 12 ? '12:00 pm' : hour > 12 ? `${hour - 12}:00 pm` : `${hour}:00 am`}
            </div>
            <div className="flex-1 p-1 space-y-1 relative">
              {blocked && slotApts.length === 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-100/60 border border-red-200/60 text-red-500 text-xs">
                  <Ban className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">{blockedRange?.reason || 'Blocked'}</span>
                </div>
              )}
              {!working && !blocked && (
                <div className="text-xs text-gray-300 px-3 py-2">Off hours</div>
              )}
              {slotApts.map(a => {
                const Icon = TYPE_ICONS[a.type] || Video;
                return (
                  <div key={a.id} onClick={() => onSelectAppointment(a)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer hover:opacity-90 transition-opacity ${TYPE_COLORS[a.type] || TYPE_COLORS.video}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[a.status] || 'bg-gray-300'}`} />
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-xs">{format(parseISO(a.appointment_date), 'h:mm a')}</span>
                      <span className="text-xs ml-2 truncate">{a.patient_email}</span>
                    </div>
                    <Badge className="text-[10px] border-none bg-white/60 text-gray-700">{a.status}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {apts.length === 0 && blockedRanges.length === 0 && (
        <div className="text-center py-16 text-[#5A6B5A]">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No appointments on this day</p>
        </div>
      )}
    </div>
  );
}