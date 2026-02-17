import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock, AlertTriangle, FileText, Bell, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { formatDistanceToNow, isPast, differenceInDays } from 'date-fns';

const statusConfig = {
  compliant: { color: 'text-green-600', bg: 'bg-green-100', badge: 'bg-green-100 text-green-800', label: 'Compliant' },
  in_review: { color: 'text-blue-600', bg: 'bg-blue-100', badge: 'bg-blue-100 text-blue-800', label: 'In Review' },
  pending: { color: 'text-gray-500', bg: 'bg-gray-100', badge: 'bg-gray-100 text-gray-800', label: 'Pending' },
  non_compliant: { color: 'text-red-600', bg: 'bg-red-100', badge: 'bg-red-100 text-red-800', label: 'Non-Compliant' },
  expired: { color: 'text-orange-600', bg: 'bg-orange-100', badge: 'bg-orange-100 text-orange-800', label: 'Expired' },
};

export default function ComplianceOverview({ compliance, partner, unreadMessages }) {
  const passedChecks = compliance.compliance_checks?.filter(c => c.status === 'passed').length || 0;
  const totalChecks = compliance.compliance_checks?.length || 0;
  const progress = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;

  const pendingDocs = compliance.documents_required?.filter(d => d.status === 'pending' || d.status === 'rejected').length || 0;
  const failedChecks = compliance.compliance_checks?.filter(c => c.status === 'failed') || [];

  const status = statusConfig[compliance.compliance_status] || statusConfig.pending;

  // Upcoming deadlines
  const deadlines = [];
  if (compliance.next_review_date) {
    const days = differenceInDays(new Date(compliance.next_review_date), new Date());
    deadlines.push({
      label: 'Next Review',
      date: compliance.next_review_date,
      days,
      urgent: days <= 30,
    });
  }
  if (compliance.license_expiry_date) {
    const days = differenceInDays(new Date(compliance.license_expiry_date), new Date());
    deadlines.push({
      label: 'License Expiry',
      date: compliance.license_expiry_date,
      days,
      urgent: days <= 60,
      expired: days < 0,
    });
  }

  // Required actions
  const actions = [];
  if (pendingDocs > 0) actions.push({ text: `Upload ${pendingDocs} required document${pendingDocs > 1 ? 's' : ''}`, severity: 'high' });
  if (failedChecks.length > 0) actions.push({ text: `Resolve ${failedChecks.length} failed compliance check${failedChecks.length > 1 ? 's' : ''}`, severity: 'critical' });
  if (!compliance.compliance_checks || totalChecks === 0) actions.push({ text: 'Compliance review has been initiated — await admin verification', severity: 'info' });
  if (progress === 100) actions.push({ text: 'All checks passed — awaiting final review', severity: 'info' });

  return (
    <div className="space-y-6">
      {/* Hero Status Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-l-4" style={{ borderLeftColor: compliance.compliance_status === 'compliant' ? '#16a34a' : compliance.compliance_status === 'non_compliant' ? '#dc2626' : '#2563eb' }}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${status.bg} flex items-center justify-center`}>
                  <Shield className={`w-8 h-8 ${status.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Compliance Status</p>
                  <h2 className="text-2xl font-bold text-gray-900">{status.label}</h2>
                  <p className="text-sm text-gray-600 mt-1">{partner?.business_name}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-4xl font-bold text-[#4A6741]">{progress}%</div>
                <p className="text-sm text-gray-500">{passedChecks}/{totalChecks} checks passed</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-[#4A6741]'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Required Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-4 h-4 text-orange-500" />
                Required Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {actions.length === 0 ? (
                <div className="flex items-center gap-3 text-green-700 bg-green-50 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">No actions required at this time</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {actions.map((action, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                      action.severity === 'critical' ? 'bg-red-50 text-red-800' :
                      action.severity === 'high' ? 'bg-orange-50 text-orange-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      {action.severity === 'critical' ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> :
                       action.severity === 'high' ? <FileText className="w-4 h-4 mt-0.5 shrink-0" /> :
                       <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                      <p className="text-sm font-medium">{action.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {unreadMessages > 0 && (
                <div className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-purple-50 text-purple-800">
                  <Bell className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">
                    You have {unreadMessages} unread message{unreadMessages > 1 ? 's' : ''} from the compliance team
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Deadlines */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-blue-500" />
                Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deadlines.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming deadlines</p>
              ) : (
                <div className="space-y-4">
                  {deadlines.map((d, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">{d.label}</p>
                        <Badge className={d.expired ? 'bg-red-100 text-red-800' : d.urgent ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}>
                          {d.expired ? 'Expired' : d.days === 0 ? 'Today' : `${d.days}d`}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(d.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Compliance Checks Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            {(!compliance.compliance_checks || compliance.compliance_checks.length === 0) ? (
              <p className="text-sm text-gray-500">Verification in progress — checks will appear here once initiated.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {compliance.compliance_checks.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border">
                    {check.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    ) : check.status === 'failed' ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{check.check_type}</p>
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
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* LegitScript Link */}
      {compliance.legitscript_url && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="bg-[#4A6741]/5 border-[#4A6741]/20">
            <CardContent className="pt-5 pb-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#2D3A2D]">LegitScript Certification Required</p>
                  <p className="text-sm text-gray-600 mt-1">Complete your certification through the official LegitScript portal.</p>
                </div>
                <Button onClick={() => window.open(compliance.legitscript_url, '_blank')} className="bg-[#4A6741] hover:bg-[#3D5636] shrink-0">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open LegitScript Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}