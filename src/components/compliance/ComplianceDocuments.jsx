import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Upload, CheckCircle, AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const docStatusConfig = {
  approved: { badge: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
  submitted: { badge: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4 text-blue-600" /> },
  rejected: { badge: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
  pending: { badge: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4 text-gray-400" /> },
};

function DocumentRow({ doc, complianceId, onUploaded }) {
  const [expanded, setExpanded] = useState(doc.status === 'pending' || doc.status === 'rejected');
  const [expiryDate, setExpiryDate] = useState(doc.expiry_date || '');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const config = docStatusConfig[doc.status] || docStatusConfig.pending;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.functions.invoke('uploadComplianceDocument', {
        compliance_id: complianceId,
        document_type: doc.document_type,
        file_url,
        expiry_date: expiryDate || undefined
      });
      setUploadSuccess(true);
      onUploaded();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {config.icon}
          <span className="font-medium text-sm">{doc.document_type}</span>
          {doc.expiry_date && (
            <span className="text-xs text-gray-500">
              Exp: {new Date(doc.expiry_date).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className={config.badge}>{doc.status}</Badge>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 bg-gray-50 border-t space-y-4">
              {doc.status === 'rejected' && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  This document was rejected. Please upload a corrected version.
                </div>
              )}

              {(doc.status === 'pending' || doc.status === 'rejected') && (
                <div className="mt-4 space-y-3">
                  <div>
                    <Label className="text-xs">Document Expiry Date (if applicable)</Label>
                    <Input
                      type="date"
                      value={expiryDate}
                      onChange={e => setExpiryDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Upload Document</Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#4A6741] transition-colors">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">PDF, JPG, or PNG up to 10MB</p>
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-[#4A6741] text-white text-sm rounded-lg hover:bg-[#3D5636] transition-colors">
                          {uploading ? 'Uploading...' : 'Choose File'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {uploadSuccess && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Uploaded successfully
                      </p>
                    )}
                  </div>
                </div>
              )}

              {doc.status === 'submitted' && (
                <p className="mt-3 text-sm text-blue-700">Document is under review by the compliance team.</p>
              )}

              {doc.status === 'approved' && (
                <div className="mt-3 flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <p className="text-sm font-medium">Document approved</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ComplianceDocuments({ compliance, partnerType }) {
  const queryClient = useQueryClient();

  const handleUploaded = () => {
    queryClient.invalidateQueries(['partner-compliance']);
  };

  const pending = compliance.documents_required?.filter(d => d.status === 'pending' || d.status === 'rejected') || [];
  const done = compliance.documents_required?.filter(d => d.status === 'submitted' || d.status === 'approved') || [];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Required', value: compliance.documents_required?.length || 0, color: 'text-gray-900' },
          { label: 'Pending Upload', value: pending.length, color: 'text-orange-600' },
          { label: 'Under Review', value: compliance.documents_required?.filter(d => d.status === 'submitted').length || 0, color: 'text-blue-600' },
          { label: 'Approved', value: compliance.documents_required?.filter(d => d.status === 'approved').length || 0, color: 'text-green-600' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Required */}
      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Action Required ({pending.length})
            </CardTitle>
            <CardDescription>These documents need to be uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pending.map((doc, idx) => (
                <DocumentRow
                  key={idx}
                  doc={doc}
                  complianceId={compliance.id}
                  onUploaded={handleUploaded}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submitted / Approved */}
      {done.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Submitted Documents ({done.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {done.map((doc, idx) => (
                <DocumentRow
                  key={idx}
                  doc={doc}
                  complianceId={compliance.id}
                  onUploaded={handleUploaded}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!compliance.documents_required || compliance.documents_required.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Document requirements will appear once your compliance review is initiated.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}