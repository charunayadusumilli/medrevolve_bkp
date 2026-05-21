import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Copy, Sparkles, Image, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ContentGenerator({ onContentGenerated }) {
  const [topic, setTopic] = useState('telehealth');
  const [contentType, setContentType] = useState('post');
  const [generatedContent, setGeneratedContent] = useState(null);

  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('generateSocialMediaContent', data);
      return response.data;
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      if (onContentGenerated) onContentGenerated(data.content);
      toast.success('Content generated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to generate content: ' + error.message);
    }
  });

  const handleGenerate = () => {
    generateMutation.mutate({ content_type: contentType, topic });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!generatedContent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4A6741]" />
            Generate Compliant Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">📸 Feed Post</SelectItem>
                  <SelectItem value="reel">🎬 Reel/Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telehealth">🩺 Telehealth Services</SelectItem>
                  <SelectItem value="business">💼 Business Platform</SelectItem>
                  <SelectItem value="compliance">🔒 Compliance & Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={generateMutation.isPending}
            className="w-full bg-[#4A6741] hover:bg-[#3D5636]"
          >
            {generateMutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Content
              </span>
            )}
          </Button>

          <div className="p-4 bg-[#FDFBF7] border border-[#E8E0D5] rounded-lg">
            <p className="text-xs text-[#5A6B5A] mb-2"><strong>What you'll get:</strong></p>
            <ul className="text-xs text-[#5A6B5A] space-y-1">
              <li>✅ Pre-written, compliant captions</li>
              <li>✅ Strategic hooks for engagement</li>
              <li>✅ Relevant hashtags included</li>
              <li>✅ Best posting times</li>
              <li>✅ Compliance guidelines</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#28A745]" />
              Generated Content
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">{generatedContent.topic}</Badge>
              <Badge variant="outline" className="capitalize">{generatedContent.type}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Caption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Caption</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(generatedContent.caption)}
                className="h-8 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            </div>
            <Textarea
              value={generatedContent.caption}
              readOnly
              rows={6}
              className="bg-[#FDFBF7] border-[#E8E0D5]"
            />
          </div>

          {/* Hook/Concept */}
          {generatedContent.hook && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                {generatedContent.type === 'reel' ? '🎬 Concept' : '🎯 Hook'}
              </label>
              <div className="p-3 bg-[#F5F0E8] border border-[#E8E0D5] rounded-lg">
                <p className="text-sm text-[#2D3A2D]">{generatedContent.hook}</p>
              </div>
            </div>
          )}

          {/* Hashtags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hashtags ({generatedContent.hashtags.length})</label>
            <div className="flex flex-wrap gap-2">
              {generatedContent.hashtags.map((tag, i) => (
                <Badge key={i} className="bg-[#4A6741]/10 text-[#4A6741] hover:bg-[#4A6741]/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Best Time */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>⏰ Best time to post:</strong> {generatedContent.best_time_to_post}
            </p>
          </div>

          {/* Compliance Notes */}
          <div className="p-3 bg-[#FFF3CD] border border-[#FFC107] rounded-lg">
            <p className="text-xs text-[#856404] mb-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <strong>Compliance Guidelines:</strong>
            </p>
            <ul className="text-xs text-[#856404] space-y-1">
              {generatedContent.compliance_notes.map((note, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span>•</span> {note}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => setGeneratedContent(null)}
              variant="outline" 
              className="flex-1"
            >
              Generate More
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}