import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Mic, Upload, FileText, CheckCircle2, Loader2, Zap, Video } from 'lucide-react';

export default function MeetingTranscriptPanel({ meetingId, meeting, onComplete }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [audioFile, setAudioFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleProcess = async () => {
    setProcessing(true);
    setError(null);

    try {
      let audio_url = null;

      if (mode === 'upload' && audioFile) {
        // Upload audio file first
        const { file_url } = await base44.integrations.Core.UploadFile({ file: audioFile });
        audio_url = file_url;
      }

      const res = await base44.functions.invoke('processMeetingTranscript', {
        meeting_id: meetingId,
        audio_url: audio_url || undefined,
        transcript_text: mode === 'paste' ? pastedText : undefined,
      });

      setResult(res.data);
      onComplete?.();
    } catch (err) {
      setError(err.message || 'Processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Meeting processed successfully!</span>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <p className="text-sm text-gray-700"><strong>Summary:</strong> {result.summary}</p>
          <div className="flex gap-4 text-sm">
            <span className="text-violet-700 font-semibold">🎫 {result.tickets_created} tickets created</span>
            <span className="text-blue-700 font-semibold">✅ {result.action_items} action items</span>
          </div>
          {result.key_decisions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Key Decisions:</p>
              <ul className="space-y-1">
                {result.key_decisions.map((d, i) => (
                  <li key={i} className="text-xs text-gray-600">• {d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400">Team members have been notified via email.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Video className="w-4 h-4 text-violet-600" />
        <span className="text-sm font-semibold text-gray-700">Process Meeting Recording / Transcript</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${mode === 'upload' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}
        >
          <Upload className="w-3 h-3 inline mr-1" />Upload Audio
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${mode === 'paste' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}
        >
          <FileText className="w-3 h-3 inline mr-1" />Paste Transcript
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition-all"
          >
            <Mic className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            {audioFile ? (
              <p className="text-sm font-semibold text-violet-700">{audioFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-gray-500">Click to upload audio file</p>
                <p className="text-xs text-gray-400 mt-1">mp3, mp4, wav, m4a, webm, ogg (max 25MB)</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".mp3,.mp4,.wav,.m4a,.webm,.ogg,.oga,.mpga,.mpeg,.flac"
            className="hidden"
            onChange={e => setAudioFile(e.target.files?.[0] || null)}
          />
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            AI will transcribe the audio, summarize the meeting, extract action items, and auto-create tickets
          </p>
        </div>
      ) : (
        <div>
          <textarea
            value={pastedText}
            onChange={e => setPastedText(e.target.value)}
            placeholder="Paste your meeting transcript here (from Google Meet captions, Otter.ai, etc.)..."
            rows={8}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button
        onClick={handleProcess}
        disabled={processing || (mode === 'upload' ? !audioFile : !pastedText.trim())}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white"
      >
        {processing ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing with AI...</>
        ) : (
          <><Zap className="w-4 h-4 mr-2" />Process & Create Tickets</>
        )}
      </Button>
    </div>
  );
}