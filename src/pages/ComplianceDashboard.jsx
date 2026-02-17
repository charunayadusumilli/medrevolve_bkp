import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Clock, 
  FileText, Upload, Download, ExternalLink, RefreshCw
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_review: 'bg-blue-100 text-blue-800',
  compliant: 'bg-green-100 text-green-800',
  non_compliant: 'bg-red-100 text-red-800',
  expired: 'bg-orange-100 text-orange-800',
  suspended: 'bg-red-100 text-red-800'
};

const checkStatusIcons = {
  passed: <CheckCircle className="w-4 h-4 text-green-600" />,
  failed: <XCircle className="w-4 h-4 text-red-600" />,
  pending: <Clock className="w-4 h-4 text-gray-400" />
};

export default function ComplianceDashboard() {
  const [selectedType, setSelectedType] = useState('all');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['compliance-records'],
    queryFn: () => base44.entities.ComplianceRecord.list('-created_date')
  });

  const generateDocMutation = useMutation({
    mutationFn: async ({ compliance_id, partner_type }) => {
      const response = await base44.functions.invoke('generateComplianceDoc', { 
        compliance_id, 
        partner_type 
      });
      return response.data;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compliance_agreement.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Admin access required to view compliance dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(createPageUrl('Home'))}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredRecords = selectedType === 'all' 
    ? records 
    : records.filter(r => r.partner_type === selectedType);

  const stats = {
    total: records.length,
    compliant: records.filter(r => r.compliance_status === 'compliant').length,
    in_review: records.filter(r => r.compliance_status === 'in_review').length,
    non_compliant: records.filter(r => r.compliance_status === 'non_compliant').length,
    expired: records.filter(r => r.compliance_status === 'expired').length
  };

  const highRiskRecords = records.filter(r => r.risk_score >= 70);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Dashboard</h1>
          <p className="text-gray-600">Monitor and manage partner compliance across all categories</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-[#4A6741]" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.compliant}</p>
                  <p className="text-sm text-gray-600">Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.in_review}</p>
                  <p className="text-sm text-gray-600">In Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.non_compliant}</p>
                  <p className="text-sm text-gray-600">Non-Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{highRiskRecords.length}</p>
                  <p className="text-sm text-gray-600">High Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            className={selectedType === 'all' ? 'bg-[#4A6741]' : ''}
          >
            All Partners
          </Button>
          <Button
            variant={selectedType === 'pharmacy' ? 'default' : 'outline'}
            onClick={() => setSelectedType('pharmacy')}
            className={selectedType === 'pharmacy' ? 'bg-[#4A6741]' : ''}
          >
            Pharmacies
          </Button>
          <Button
            variant={selectedType === 'provider' ? 'default' : 'outline'}
            onClick={() => setSelectedType('provider')}
            className={selectedType === 'provider' ? 'bg-[#4A6741]' : ''}
          >
            Providers
          </Button>
          <Button
            variant={selectedType === 'partner' ? 'default' : 'outline'}
            onClick={() => setSelectedType('partner')}
            className={selectedType === 'partner' ? 'bg-[#4A6741]' : ''}
          >
            Business Partners
          </Button>
          <Button
            variant={selectedType === 'creator' ? 'default' : 'outline'}
            onClick={() => setSelectedType('creator')}
            className={selectedType === 'creator' ? 'bg-[#4A6741]' : ''}
          >
            Creators
          </Button>
        </div>

        {/* Records List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No compliance records found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <ComplianceRecordCard
                key={record.id}
                record={record}
                onGenerateDoc={() => generateDocMutation.mutate({
                  compliance_id: record.id,
                  partner_type: record.partner_type
                })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ComplianceRecordCard({ record, onGenerateDoc }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const updateCheckMutation = useMutation({
    mutationFn: async ({ check_type, status, notes }) => {
      const response = await base44.functions.invoke('updateComplianceCheck', {
        compliance_id: record.id,
        check_type,
        status,
        notes
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['compliance-records']);
    }
  });

  const passedChecks = record.compliance_checks?.filter(c => c.status === 'passed').length || 0;
  const totalChecks = record.compliance_checks?.length || 0;
  const progress = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{record.partner_name}</CardTitle>
              <Badge className={statusColors[record.compliance_status]}>
                {record.compliance_status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">
                {record.partner_type}
              </Badge>
              {record.risk_score >= 70 && (
                <Badge className="bg-red-100 text-red-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  High Risk
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Risk Score: {record.risk_score}/100</span>
              {record.license_number && <span>License: {record.license_number}</span>}
              {record.license_state && <span>State: {record.license_state}</span>}
              {record.license_expiry_date && (
                <span>Expires: {new Date(record.license_expiry_date).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateDoc}
            >
              <Download className="w-4 h-4 mr-2" />
              Generate Doc
            </Button>
            {record.legitscript_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(record.legitscript_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                LegitScript
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Hide Details' : 'View Details'}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Compliance Progress</span>
            <span className="font-medium">{passedChecks}/{totalChecks} checks passed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#4A6741] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <Tabs defaultValue="checks">
            <TabsList>
              <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="checks" className="space-y-2">
              {record.compliance_checks?.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {checkStatusIcons[check.status]}
                    <div>
                      <p className="font-medium">{check.check_type}</p>
                      {check.notes && <p className="text-sm text-gray-600">{check.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {check.status !== 'passed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCheckMutation.mutate({
                          check_type: check.check_type,
                          status: 'passed',
                          notes: 'Verified'
                        })}
                        disabled={updateCheckMutation.isPending}
                      >
                        Mark Passed
                      </Button>
                    )}
                    {check.status !== 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCheckMutation.mutate({
                          check_type: check.check_type,
                          status: 'failed',
                          notes: 'Non-compliant'
                        })}
                        disabled={updateCheckMutation.isPending}
                      >
                        Mark Failed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="documents" className="space-y-2">
              {record.documents_required?.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{doc.document_type}</p>
                      <Badge className={statusColors[doc.status] || 'bg-gray-100'}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                  {doc.file_url && (
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="issues">
              {record.issues && record.issues.length > 0 ? (
                <div className="space-y-2">
                  {record.issues.map((issue, idx) => (
                    <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-medium">{issue.issue_type}</span>
                        </div>
                        <Badge className={`bg-${issue.severity === 'critical' ? 'red' : 'orange'}-100`}>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{issue.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">No compliance issues</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}