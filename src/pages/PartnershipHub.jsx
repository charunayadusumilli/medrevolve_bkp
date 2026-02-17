import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Globe, Mail, FileText, TrendingUp, Search, 
  Send, CheckCircle, Clock, AlertCircle, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PartnershipHub() {
  const [selectedOutreach, setSelectedOutreach] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: outreachList, isLoading } = useQuery({
    queryKey: ['partnership-outreach'],
    queryFn: () => base44.entities.PartnershipOutreach.list('-created_date', 100)
  });

  const analyzeWebsite = async () => {
    if (!websiteUrl) return;
    setAnalyzing(true);
    
    try {
      const response = await base44.functions.invoke('analyzePartnerWebsite', {
        website: websiteUrl,
        partnerType: 'unknown'
      });

      const analysis = response.data.analysis;

      // Create outreach record
      await base44.entities.PartnershipOutreach.create({
        partner_name: new URL(websiteUrl).hostname.replace('www.', ''),
        partner_type: 'telehealth_platform',
        website: websiteUrl,
        core_services: analysis.coreServices || [],
        integration_points: analysis.integrationPoints || [],
        api_documentation: analysis.apiCapabilities || '',
        notes: JSON.stringify(analysis),
        status: 'researching'
      });

      queryClient.invalidateQueries(['partnership-outreach']);
      setWebsiteUrl('');
    } catch (error) {
      console.error('Error analyzing website:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateOutreach = async (outreachId) => {
    try {
      const response = await base44.functions.invoke('generatePartnershipDoc', {
        partnerId: outreachId,
        documentType: 'outreach'
      });

      setSelectedOutreach({
        ...selectedOutreach,
        generated_email: response.data.document
      });
    } catch (error) {
      console.error('Error generating outreach:', error);
    }
  };

  const sendOutreach = async (outreachId, email, content) => {
    try {
      await base44.functions.invoke('sendPartnershipEmail', {
        outreachId: outreachId,
        emailContent: content,
        recipientEmail: email
      });

      queryClient.invalidateQueries(['partnership-outreach']);
      setSelectedOutreach(null);
    } catch (error) {
      console.error('Error sending outreach:', error);
    }
  };

  const statusColors = {
    researching: 'bg-gray-100 text-gray-700',
    outreach_sent: 'bg-blue-100 text-blue-700',
    follow_up: 'bg-yellow-100 text-yellow-700',
    in_discussion: 'bg-purple-100 text-purple-700',
    agreement_sent: 'bg-orange-100 text-orange-700',
    active: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700'
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Access restricted to administrators</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2D3A2D] mb-2">Partnership Hub</h1>
          <p className="text-lg text-[#5A6B5A]">
            AI-powered partnership discovery and outreach automation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{outreachList?.filter(o => o.status === 'researching').length || 0}</p>
                  <p className="text-sm text-gray-600">Researching</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{outreachList?.filter(o => o.status === 'in_discussion').length || 0}</p>
                  <p className="text-sm text-gray-600">In Discussion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{outreachList?.filter(o => o.status === 'active').length || 0}</p>
                  <p className="text-sm text-gray-600">Active Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Partner Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter partner website URL..."
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={analyzeWebsite}
                disabled={!websiteUrl || analyzing}
                className="bg-[#4A6741] hover:bg-[#3D5636]"
              >
                {analyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outreachList?.map((outreach) => (
                <motion.div
                  key={outreach.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOutreach(outreach)}
                >
                  <div className="flex items-center gap-4">
                    <Globe className="w-5 h-5 text-[#4A6741]" />
                    <div>
                      <h3 className="font-semibold text-[#2D3A2D]">{outreach.partner_name}</h3>
                      <p className="text-sm text-gray-600">{outreach.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[outreach.status]}>
                      {outreach.status.replace('_', ' ')}
                    </Badge>
                    {outreach.priority === 'high' && (
                      <Badge className="bg-red-100 text-red-700">High Priority</Badge>
                    )}
                  </div>
                </motion.div>
              ))}

              {outreachList?.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No partnerships in pipeline</p>
                  <p className="text-sm text-gray-500">Add a website above to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedOutreach && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{selectedOutreach.partner_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input
                    placeholder="partner@example.com"
                    value={selectedOutreach.contact_email || ''}
                    onChange={(e) => setSelectedOutreach({
                      ...selectedOutreach,
                      contact_email: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Outreach Email</label>
                  <Textarea
                    rows={12}
                    placeholder="Generate email content..."
                    value={selectedOutreach.generated_email || selectedOutreach.outreach_email || ''}
                    onChange={(e) => setSelectedOutreach({
                      ...selectedOutreach,
                      generated_email: e.target.value
                    })}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => generateOutreach(selectedOutreach.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                  <Button
                    onClick={() => sendOutreach(
                      selectedOutreach.id,
                      selectedOutreach.contact_email,
                      selectedOutreach.generated_email || selectedOutreach.outreach_email
                    )}
                    disabled={!selectedOutreach.contact_email || !selectedOutreach.generated_email}
                    className="flex-1 bg-[#4A6741] hover:bg-[#3D5636]"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    onClick={() => setSelectedOutreach(null)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}