import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, XCircle, 
  FileText, RefreshCw, Download, Filter, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComplianceDashboard() {
  const [user, setUser] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {
        window.location.href = '/';
      }
    };
    checkUser();
  }, []);

  const { data: complianceRecords = [], isLoading, refetch } = useQuery({
    queryKey: ['compliance'],
    queryFn: () => base44.entities.PartnerCompliance.list('-updated_date'),
    enabled: !!user
  });

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Admin access required</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredRecords = complianceRecords.filter(record => {
    if (selectedType !== 'all' && record.partner_type !== selectedType) return false;
    if (selectedStatus !== 'all' && record.overall_status !== selectedStatus) return false;
    return true;
  });

  const stats = {
    total: complianceRecords.length,
    compliant: complianceRecords.filter(r => r.overall_status === 'compliant').length,
    pending: complianceRecords.filter(r => r.overall_status === 'pending' || r.overall_status === 'under_review').length,
    nonCompliant: complianceRecords.filter(r => r.overall_status === 'non_compliant').length,
    criticalAlerts: complianceRecords.reduce((sum, r) => 
      sum + (r.alerts?.filter(a => a.severity === 'critical' && !a.resolved).length || 0), 0
    ),
    avgScore: Math.round(complianceRecords.reduce((sum, r) => sum + (r.compliance_score || 0), 0) / complianceRecords.length || 0)
  };

  const handleVerify = async (partnerId, partnerType) => {
    try {
      await base44.functions.invoke('verifyPartnerCompliance', {
        partner_id: partnerId,
        partner_type: partnerType
      });
      refetch();
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const handleDownloadDoc = async (partnerId, partnerType) => {
    try {
      const response = await base44.functions.invoke('generateComplianceDoc', {
        partner_id: partnerId,
        partner_type: partnerType
      });
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-${partnerId}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      compliant: { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      under_review: { className: 'bg-blue-100 text-blue-800', icon: Clock },
      non_compliant: { className: 'bg-red-100 text-red-800', icon: XCircle },
      expired: { className: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#4A6741]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D] flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#4A6741]" />
              Compliance Dashboard
            </h1>
            <p className="text-[#5A6B5A] mt-2">Real-time partner compliance monitoring</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#4A6741]">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Partners</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.compliant}</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.nonCompliant}</div>
              <div className="text-sm text-muted-foreground">Non-Compliant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.criticalAlerts}</div>
              <div className="text-sm text-muted-foreground">Critical Alerts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[#4A6741] flex items-center gap-1">
                {stats.avgScore}
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="provider">Provider</option>
                <option value="partner">Partner</option>
                <option value="creator">Creator</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="compliant">Compliant</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="non_compliant">Non-Compliant</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Records */}
        <div className="space-y-4">
          {filteredRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{record.partner_name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{record.partner_type}</Badge>
                        {getStatusBadge(record.overall_status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#4A6741]">
                        {record.compliance_score || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Verification Status */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">License</div>
                        {getStatusBadge(record.license_verification?.status || 'pending')}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">LegitScript</div>
                        {getStatusBadge(record.legitscript_verification?.status || 'pending')}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Insurance</div>
                        {getStatusBadge(record.insurance_verification?.status || 'pending')}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">HIPAA</div>
                        {getStatusBadge(record.hipaa_compliance?.status || 'pending')}
                      </div>
                    </div>

                    {/* Alerts */}
                    {record.alerts && record.alerts.filter(a => !a.resolved).length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-900">Active Alerts</span>
                        </div>
                        <div className="space-y-1">
                          {record.alerts.filter(a => !a.resolved).slice(0, 3).map((alert, i) => (
                            <div key={i} className="text-xs text-red-800">
                              [{alert.severity.toUpperCase()}] {alert.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(record.partner_id, record.partner_type)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-verify
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadDoc(record.partner_id, record.partner_type)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredRecords.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No compliance records found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}