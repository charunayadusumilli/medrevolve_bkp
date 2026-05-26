import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download, FileSpreadsheet, CheckCircle2, AlertCircle,
  Building2, User, FlaskConical, Globe, RefreshCw
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DOMAIN_CONFIG = {
  B2B: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Building2, hex: '#3B82F6' },
  B2C: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: User, hex: '#22C55E' },
  RUO: { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: FlaskConical, hex: '#A855F7' },
  WATER: { color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: Globe, hex: '#06B6D4' },
  ALL:  { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Globe, hex: '#F59E0B' },
};

export default function ComplianceAuditReport() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke('generateComplianceAuditReport', {});
    setReport(res.data);
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!report?.csv_data) return;
    const blob = new Blob([report.csv_data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MedRevolve_Compliance_Audit_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Compliance Audit Report</h1>
            <p className="text-white/50 text-sm">Healthcare Marketing & Regulatory Compliance — Action Items Log</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchReport}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              variant="outline"
            >
              {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              {report ? 'Refresh' : 'Load Report'}
            </Button>
            {report && (
              <Button
                onClick={downloadCSV}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV (Excel)
              </Button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!report && !loading && (
          <Card className="bg-[#111] border-white/10">
            <CardContent className="py-16 text-center">
              <FileSpreadsheet className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 text-sm mb-4">Click "Load Report" to generate the compliance audit document</p>
              <Button onClick={fetchReport} className="bg-white text-black hover:bg-white/90 font-bold">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="bg-[#111] border-white/10">
            <CardContent className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-white/40 mx-auto mb-4 animate-spin" />
              <p className="text-white/50 text-sm">Generating compliance report…</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(report.items_by_domain).map(([domain, count]) => {
                const cfg = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.ALL;
                const Icon = cfg.icon;
                return (
                  <Card key={domain} className="bg-[#111] border-white/10">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: cfg.hex + '20' }}>
                        <Icon className="w-4 h-4" style={{ color: cfg.hex }} />
                      </div>
                      <div className="text-3xl font-black" style={{ color: cfg.hex }}>{count}</div>
                      <div className="text-xs text-white/40 font-bold uppercase tracking-wider mt-0.5">{domain}</div>
                    </CardContent>
                  </Card>
                );
              })}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-green-400">{report.total_items}</div>
                  <div className="text-xs text-white/40 font-bold uppercase tracking-wider mt-0.5">Total Fixed</div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <Card className="bg-[#111] border-white/10 overflow-hidden">
              <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-green-400" />
                  All Action Items — {report.total_items} items
                </CardTitle>
                <Button onClick={downloadCSV} size="sm" className="bg-green-600 hover:bg-green-500 text-white text-xs">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download CSV
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0A0A0A] border-b border-white/10">
                        {['Domain','Area','File / Page','Component','Service Level','Product Level','Issue Type','Issue Description','Action Taken','Compliance Category','Status','Fix Date','Verified By'].map(h => (
                          <th key={h} className="text-left text-white/40 text-xs font-bold uppercase tracking-wider px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.items.map((item, i) => {
                        const cfg = DOMAIN_CONFIG[item.domain] || DOMAIN_CONFIG.ALL;
                        return (
                          <tr key={i} className={`border-b border-white/5 hover:bg-white/3 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge className={`text-xs font-bold ${cfg.color}`}>{item.domain}</Badge>
                            </td>
                            <td className="px-4 py-3 text-white/70 text-xs max-w-[160px]">{item.area}</td>
                            <td className="px-4 py-3 text-white/40 text-xs font-mono whitespace-nowrap">{item.page}</td>
                            <td className="px-4 py-3 text-white/70 text-xs max-w-[140px]">{item.component}</td>
                            <td className="px-4 py-3 text-white/70 text-xs whitespace-nowrap">{item.service_level}</td>
                            <td className="px-4 py-3 text-white/70 text-xs whitespace-nowrap">{item.product_level}</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs whitespace-nowrap">{item.issue_type}</Badge>
                            </td>
                            <td className="px-4 py-3 text-white/60 text-xs max-w-[280px]">{item.issue_description}</td>
                            <td className="px-4 py-3 text-green-300/80 text-xs max-w-[280px]">{item.action_taken}</td>
                            <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">{item.compliance_category}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">{item.status}</Badge>
                            </td>
                            <td className="px-4 py-3 text-white/50 text-xs whitespace-nowrap">{item.fix_date}</td>
                            <td className="px-4 py-3 text-white/30 text-xs">{item.verified_by || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-white/20 text-xs mt-6">
              MedRevolve Compliance Audit · Generated {new Date(report.generated_at).toLocaleString()} · Confidential
            </p>
          </>
        )}
      </div>
    </div>
  );
}