import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Video, Loader2, AlertCircle } from 'lucide-react';

export default function VideoCallInitiator({ appointmentId, appointmentTime, providerId, isProvider = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartCall = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize Twilio session
      const { data } = await base44.functions.invoke('initializeTwilioVideoSession', {
        appointmentId
      });

      // Navigate to video call with session token
      navigate(createPageUrl(`VideoCall?id=${appointmentId}&token=${data.token}&room=${data.room}`));
    } catch (err) {
      setError(err.message || 'Failed to initialize video call');
      console.error('Video call error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if appointment time is within window (5 min before to 1 hour after scheduled time)
  const appointmentDate = new Date(appointmentTime);
  const now = new Date();
  const minutesDiff = (appointmentDate - now) / (1000 * 60);
  const canJoin = minutesDiff >= -5 && minutesDiff <= 60;

  if (!canJoin) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#5A6B5A]">
        <AlertCircle className="w-4 h-4" />
        Call available 5 min before scheduled time
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleStartCall}
        disabled={loading}
        className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Video className="w-4 h-4 mr-2" />
            Start Video Call
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}