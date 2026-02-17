import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, CheckCircle, AlertTriangle, FileText, Upload, Download, ExternalLink 
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function PartnerCompliance() {
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: partner } = useQuery({
    queryKey: ['partner', user?.email],
    queryFn: async () => {
      const partners = await base44.entities.Partner.filter({ email: user.email });
      return partners[0];
    },
    enabled: !!user
  });

  const { data: complianceRecord, isLoading } = useQuery({
    queryKey: ['partner-compliance', partner?.id],
    queryFn: async () => {
      const records = await base44.entities.ComplianceRecord.filter({ 
        partner_id: partner.id 
      });
      return records[0];
    },
    enabled: !!partner
  });

  const uploadDocMutation = useMutation({
    mutationFn: async ({ document_type, file, expiry_date }) => {
      const formData = new FormData();
      formData.append('compliance_id', complianceRecord.id);
      formData.append('document_type', document_type);
      formData.append('file', file);
      if (expiry_date) formData.append('expiry_date', expiry_date);

      const response = await fetch('/api/functions/uploadComplianceDocument', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${await base44.auth.getToken()}`
        }
      });

      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partner-compliance']);
      setUploadingDoc(null);
    }
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to view your compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(createPageUrl('Login'))}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Partner Account</CardTitle>
            <CardDescription>You don't have an active partner account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(createPageUrl('PartnerSignup'))}>
              Become a Partner
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]" />
      </div>
    );
  }

  if (!complianceRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Compliance Verification Pending</CardTitle>
            <CardDescription>
              Your compliance verification is being processed. You'll receive an email when it's ready.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const passedChecks = complianceRecord.compliance_checks?.filter(c => c.status === 'passed').length || 0;
  const totalChecks = complianceRecord.compliance_checks?.length || 0;
  const progress = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

  const pendingDocs = complianceRecord.documents_required?.filter(d => d.status === 'pending').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Status</h1>
          <p className="text-gray-600">Manage your compliance documentation and requirements</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className={`w-8 h-8 ${
                  complianceRecord.compliance_status === 'compliant' 
                    ? 'text-green-600' 
                    : complianceRecord.compliance_status === 'non_compliant'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`} />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-bold capitalize">
                    {complianceRecord.compliance_status.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {passedChecks}/{totalChecks} checks completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-lg font-bold">
                    {pendingDocs} Pending
                  </p>
                  <p className="text-xs text-gray-500">
                    {complianceRecord.documents_required?.length || 0} total required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-8 h-8 ${
                  complianceRecord.risk_score >= 70 ? 'text-red-600' :
                  complianceRecord.risk_score >= 40 ? 'text-orange-600' :
                  'text-green-600'
                }`} />
                <div>
                  <p className="text-sm text-gray-600">Risk Score</p>
                  <p className="text-lg font-bold">{complianceRecord.risk_score}/100</p>
                  <p className="text-xs text-gray-500">
                    {complianceRecord.risk_score >= 70 ? 'High' :
                     complianceRecord.risk_score >= 40 ? 'Medium' : 'Low'} risk
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Checks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Compliance Requirements</CardTitle>
            <CardDescription>Track your compliance verification progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceRecord.compliance_checks?.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {check.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : check.status === 'failed' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <div>
                      <p className="font-medium">{check.check_type}</p>
                      {check.notes && <p className="text-sm text-gray-600">{check.notes}</p>}
                    </div>
                  </div>
                  <Badge className={
                    check.status === 'passed' ? 'bg-green-100 text-green-800' :
                    check.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {check.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>Upload and manage your compliance documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceRecord.documents_required?.map((doc, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.document_type}</p>
                        {doc.expiry_date && (
                          <p className="text-sm text-gray-600">
                            Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className={
                      doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                      doc.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {doc.status}
                    </Badge>
                  </div>

                  {doc.status === 'pending' && (
                    <div className="space-y-3">
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            uploadDocMutation.mutate({
                              document_type: doc.document_type,
                              file
                            });
                          }
                        }}
                        disabled={uploadDocMutation.isPending}
                      />
                      {uploadDocMutation.isPending && (
                        <p className="text-sm text-blue-600">Uploading...</p>
                      )}
                    </div>
                  )}

                  {doc.file_url && (
                    <Button variant="outline" size="sm" className="mt-3">
                      <Download className="w-4 h-4 mr-2" />
                      Download Document
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* LegitScript Portal Link */}
        {complianceRecord.legitscript_url && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-[#4A6741]" />
                  <div>
                    <p className="font-medium">LegitScript Certification Portal</p>
                    <p className="text-sm text-gray-600">
                      Verify your business through LegitScript
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(complianceRecord.legitscript_url, '_blank')}
                  className="bg-[#4A6741]"
                >
                  Open Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}