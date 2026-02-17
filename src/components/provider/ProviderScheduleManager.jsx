import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, Ban, RefreshCw, Clock, Users, Layers, BarChart2 } from 'lucide-react';
import { format, parseISO, isSameDay, startOfWeek, addDays } from 'date-fns';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const APPOINTMENT_TYPES = [
  { value: 'initial_consult', label: 'Initial Consult', duration: 60, color: 'bg-violet-500' },
  { value: 'follow_up', label: 'Follow-up', duration: 20, color: 'bg-blue-500' },
  { value: 'video', label: 'Video Call', duration: 30, color: 'bg-green-500' },
  { value: 'phone', label: 'Phone Call', duration: 15, color: 'bg-amber-500' },
  { value: 'lab_review', label: 'Lab Review', duration: 30, color: 'bg-rose-500' },
];

function getDensityColor(count) {
  if (count === 0) return 'bg-gray-100 text-gray-400';
  if (count <= 2) return 'bg-green-100 text-green-700';
  if (count <= 4) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}

function getDensityLabel(count, capacity) {
  if (count === 0) return 'Free';
  const pct = capacity > 0 ? Math.round((count / capacity) * 100) : 100;
  if (pct < 50) return 'Light';
  if (pct < 80) return 'Moderate';
  return 'Heavy';
}

// ─── Weekly Density Heatmap ──────────────────────────────────────────────────
function WeeklyDensityView({ appointments, schedules }) {
  const weekStart = startOfWeek(new Date());
  const week = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Build hourly slots 8am–6pm
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  const getAptsForSlot = (date, hour) =>
    appointments.filter(apt => {
      const d = new Date(apt.appointment_date);
      return isSameDay(d, date) && d.getHours() === hour;
    });

  const getScheduleForDay = (dayIndex) =>
    schedules.filter(s => s.day_of_week === dayIndex);

  const isWorkingHour = (dayIndex, hour) => {
    const daySched = getScheduleForDay(dayIndex);
    if (daySched.length === 0) return false;
    return daySched.some(s => {
      const start = parseInt(s.start_time?.split(':')[0] || 0);
      const end = parseInt(s.end_time?.split(':')[0] || 0);
      return hour >= start && hour < end;
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Header */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="text-xs text-[#5A6B5A] font-medium p-2" />
          {week.map((day, i) => (
            <div key={i} className={`text-center p-2 rounded-lg text-xs font-semibold ${isSameDay(day, new Date()) ? 'bg-[#4A6741] text-white' : 'text-[#2D3A2D]'}`}>
              <div>{DAYS_SHORT[day.getDay()]}</div>
              <div className="font-normal text-[10px] opacity-70">{format(day, 'MMM d')}</div>
            </div>
          ))}
        </div>

        {/* Hour rows */}
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs text-[#5A6B5A] p-2 flex items-center justify-end pr-3">
              {hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`}
            </div>
            {week.map((day, di) => {
              const apts = getAptsForSlot(day, hour);
              const working = isWorkingHour(day.getDay(), hour);
              return (
                <TooltipProvider key={di}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`rounded-md h-10 flex items-center justify-center text-xs font-semibold cursor-default transition-colors
                        ${!working ? 'bg-gray-50 text-gray-300' : getDensityColor(apts.length)}`}>
                        {working && apts.length > 0 ? apts.length : working ? '·' : ''}
                      </div>
                    </TooltipTrigger>
                    {working && (
                      <TooltipContent side="top" className="text-xs max-w-[180px]">
                        <p className="font-semibold">{format(day, 'EEE MMM d')} {hour > 12 ? `${hour - 12}pm` : `${hour}am`}</p>
                        <p>{apts.length} appointment{apts.length !== 1 ? 's' : ''}</p>
                        {apts.map((a, i) => (
                          <p key={i} className="text-gray-300 truncate">{a.patient_email}</p>
                        ))}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-[#5A6B5A] font-medium">Density:</span>
          {[['bg-gray-100 text-gray-400', 'Free'], ['bg-green-100 text-green-700', 'Light'], ['bg-yellow-100 text-yellow-700', 'Moderate'], ['bg-red-100 text-red-700', 'Heavy']].map(([cls, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded ${cls} flex items-center justify-center text-[10px] font-bold`}>{label[0]}</div>
              <span className="text-xs text-[#5A6B5A]">{label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-gray-50 border border-dashed border-gray-200" />
            <span className="text-xs text-[#5A6B5A]">Not scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Availability Slots (per type) ──────────────────────────────────────────
function AvailabilitySlots({ providerId, schedules, scheduleMutation, deleteScheduleMutation }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    day_of_week: '1',
    start_time: '09:00',
    end_time: '17:00',
    appointment_type: 'initial_consult',
    slot_duration_minutes: 60,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleMutation.mutate({
      provider_id: providerId,
      day_of_week: parseInt(form.day_of_week),
      start_time: form.start_time,
      end_time: form.end_time,
      slot_duration_minutes: parseInt(form.slot_duration_minutes),
      is_available: true,
      appointment_type: form.appointment_type,
    }, { onSuccess: () => setDialogOpen(false) });
  };

  const handleTypeChange = (val) => {
    const type = APPOINTMENT_TYPES.find(t => t.value === val);
    setForm(f => ({ ...f, appointment_type: val, slot_duration_minutes: type?.duration || 30 }));
  };

  // Group by appointment type
  const byType = useMemo(() => {
    const map = {};
    APPOINTMENT_TYPES.forEach(t => { map[t.value] = []; });
    schedules.forEach(s => {
      const key = s.appointment_type || 'initial_consult';
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [schedules]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#2D3A2D]">Availability by Appointment Type</h3>
          <p className="text-sm text-[#5A6B5A]">Define different slot lengths and time windows per visit type.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636]"><Plus className="w-4 h-4 mr-2" />Add Slot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Availability Slot</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <Label>Appointment Type</Label>
                <Select value={form.appointment_type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label} ({t.duration} min default)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Day of Week</Label>
                <Select value={form.day_of_week} onValueChange={val => setForm(f => ({ ...f, day_of_week: val }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Slot Duration (minutes)</Label>
                <Input type="number" min="5" max="180" value={form.slot_duration_minutes} onChange={e => setForm(f => ({ ...f, slot_duration_minutes: e.target.value }))} className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-[#4A6741] hover:bg-[#3D5636]" disabled={scheduleMutation.isPending}>
                {scheduleMutation.isPending ? 'Saving…' : 'Save Slot'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {APPOINTMENT_TYPES.map(type => {
        const slots = byType[type.value] || [];
        return (
          <Card key={type.value}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${type.color}`} />
                <CardTitle className="text-base font-semibold text-[#2D3A2D]">{type.label}</CardTitle>
                <Badge variant="outline" className="ml-auto text-xs">{type.duration} min default</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {slots.length === 0 ? (
                <p className="text-sm text-[#5A6B5A] italic">No availability slots defined</p>
              ) : (
                <div className="space-y-2">
                  {slots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between bg-[#F5F3EF] rounded-lg px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#2D3A2D] w-20">{DAYS[slot.day_of_week]}</span>
                        <span className="text-sm text-[#5A6B5A]">{slot.start_time} – {slot.end_time}</span>
                        <Badge variant="outline" className="text-xs">{slot.slot_duration_minutes} min slots</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteScheduleMutation.mutate(slot.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Blocked Time (recurring + one-off) ─────────────────────────────────────
function BlockedTimeManager({ providerId, blockedTimes, blockTimeMutation, deleteBlockMutation }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    reason: '',
    is_recurring: false,
    // one-off
    start_datetime: '',
    end_datetime: '',
    // recurring
    recurring_day: '5',
    recurring_start_time: '13:00',
    recurring_end_time: '17:00',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = { provider_id: providerId, reason: form.reason, is_recurring: form.is_recurring };
    if (form.is_recurring) {
      // Store recurring as weekly: encode as a special datetime where day/time are meaningful
      const now = new Date();
      const dayDiff = (parseInt(form.recurring_day) - now.getDay() + 7) % 7;
      const nextOccurrence = addDays(now, dayDiff);
      const [sh, sm] = form.recurring_start_time.split(':');
      const [eh, em] = form.recurring_end_time.split(':');
      const start = new Date(nextOccurrence); start.setHours(parseInt(sh), parseInt(sm), 0);
      const end = new Date(nextOccurrence); end.setHours(parseInt(eh), parseInt(em), 0);
      payload.start_datetime = start.toISOString();
      payload.end_datetime = end.toISOString();
      payload.recurring_day_of_week = parseInt(form.recurring_day);
      payload.recurring_start_time = form.recurring_start_time;
      payload.recurring_end_time = form.recurring_end_time;
    } else {
      payload.start_datetime = new Date(form.start_datetime).toISOString();
      payload.end_datetime = new Date(form.end_datetime).toISOString();
    }
    blockTimeMutation.mutate(payload, { onSuccess: () => { setDialogOpen(false); setForm({ reason: '', is_recurring: false, start_datetime: '', end_datetime: '', recurring_day: '5', recurring_start_time: '13:00', recurring_end_time: '17:00' }); } });
  };

  const recurring = blockedTimes.filter(b => b.is_recurring);
  const oneOff = blockedTimes.filter(b => !b.is_recurring);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#2D3A2D]">Blocked Time</h3>
          <p className="text-sm text-[#5A6B5A]">Block one-off or recurring time windows.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636]"><Plus className="w-4 h-4 mr-2" />Block Time</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Block Time Slot</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <Label>Reason</Label>
                <Input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Vacation, Admin time, Lunch…" className="mt-1" required />
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#F5F3EF] rounded-lg">
                <Switch
                  checked={form.is_recurring}
                  onCheckedChange={val => setForm(f => ({ ...f, is_recurring: val }))}
                  id="recurring-switch"
                />
                <Label htmlFor="recurring-switch" className="cursor-pointer flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#4A6741]" />
                  Recurring weekly
                </Label>
              </div>

              {form.is_recurring ? (
                <>
                  <div>
                    <Label>Every</Label>
                    <Select value={form.recurring_day} onValueChange={val => setForm(f => ({ ...f, recurring_day: val }))}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>From</Label>
                      <Input type="time" value={form.recurring_start_time} onChange={e => setForm(f => ({ ...f, recurring_start_time: e.target.value }))} className="mt-1" />
                    </div>
                    <div>
                      <Label>Until</Label>
                      <Input type="time" value={form.recurring_end_time} onChange={e => setForm(f => ({ ...f, recurring_end_time: e.target.value }))} className="mt-1" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Start</Label>
                    <Input type="datetime-local" value={form.start_datetime} onChange={e => setForm(f => ({ ...f, start_datetime: e.target.value }))} className="mt-1" required />
                  </div>
                  <div>
                    <Label>End</Label>
                    <Input type="datetime-local" value={form.end_datetime} onChange={e => setForm(f => ({ ...f, end_datetime: e.target.value }))} className="mt-1" required />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-[#4A6741] hover:bg-[#3D5636]" disabled={blockTimeMutation.isPending}>
                {blockTimeMutation.isPending ? 'Saving…' : 'Save Block'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recurring blocks */}
      {recurring.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#5A6B5A] mb-3 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Recurring Weekly</p>
          <div className="space-y-2">
            {recurring.map(b => (
              <div key={b.id} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <div>
                  <p className="font-medium text-[#2D3A2D] text-sm">{b.reason}</p>
                  <p className="text-xs text-[#5A6B5A] mt-0.5">
                    Every {DAYS[b.recurring_day_of_week ?? new Date(b.start_datetime).getDay()]}
                    {' '}{b.recurring_start_time ?? format(parseISO(b.start_datetime), 'h:mm a')} – {b.recurring_end_time ?? format(parseISO(b.end_datetime), 'h:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-700 border-none text-xs">Weekly</Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteBlockMutation.mutate(b.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One-off blocks */}
      {oneOff.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#5A6B5A] mb-3 flex items-center gap-2"><Ban className="w-3 h-3" /> One-off Blocks</p>
          <div className="space-y-2">
            {oneOff.map(b => (
              <div key={b.id} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <div>
                  <p className="font-medium text-[#2D3A2D] text-sm">{b.reason}</p>
                  <p className="text-xs text-[#5A6B5A] mt-0.5">
                    {format(parseISO(b.start_datetime), 'EEE MMM d, h:mm a')} → {format(parseISO(b.end_datetime), 'h:mm a')}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteBlockMutation.mutate(b.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {blockedTimes.length === 0 && (
        <Card><CardContent className="py-10 text-center text-[#5A6B5A]"><Ban className="w-10 h-10 mx-auto mb-3 opacity-30" />No blocked time slots yet.</CardContent></Card>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function ProviderScheduleManager({ providerId, appointments }) {
  const queryClient = useQueryClient();

  const { data: schedules = [] } = useQuery({
    queryKey: ['schedules', providerId],
    queryFn: () => base44.entities.ProviderSchedule.filter({ provider_id: providerId }),
    enabled: !!providerId,
  });

  const { data: blockedTimes = [] } = useQuery({
    queryKey: ['blockedTimes', providerId],
    queryFn: () => base44.entities.BlockedTime.filter({ provider_id: providerId }),
    enabled: !!providerId,
  });

  const scheduleMutation = useMutation({
    mutationFn: (data) => base44.entities.ProviderSchedule.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules', providerId] }),
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id) => base44.entities.ProviderSchedule.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules', providerId] }),
  });

  const blockTimeMutation = useMutation({
    mutationFn: (data) => base44.entities.BlockedTime.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blockedTimes', providerId] }),
  });

  const deleteBlockMutation = useMutation({
    mutationFn: (id) => base44.entities.BlockedTime.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blockedTimes', providerId] }),
  });

  return (
    <Tabs defaultValue="density" className="space-y-6">
      <TabsList className="bg-white border border-gray-100">
        <TabsTrigger value="density" className="flex items-center gap-1.5"><BarChart2 className="w-4 h-4" />Week Overview</TabsTrigger>
        <TabsTrigger value="availability" className="flex items-center gap-1.5"><Layers className="w-4 h-4" />Availability Slots</TabsTrigger>
        <TabsTrigger value="blocked" className="flex items-center gap-1.5"><Ban className="w-4 h-4" />Blocked Time</TabsTrigger>
      </TabsList>

      <TabsContent value="density">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart2 className="w-5 h-5 text-[#4A6741]" />Appointment Density — This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyDensityView appointments={appointments} schedules={schedules} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="availability">
        <AvailabilitySlots
          providerId={providerId}
          schedules={schedules}
          scheduleMutation={scheduleMutation}
          deleteScheduleMutation={deleteScheduleMutation}
        />
      </TabsContent>

      <TabsContent value="blocked">
        <BlockedTimeManager
          providerId={providerId}
          blockedTimes={blockedTimes}
          blockTimeMutation={blockTimeMutation}
          deleteBlockMutation={deleteBlockMutation}
        />
      </TabsContent>
    </Tabs>
  );
}