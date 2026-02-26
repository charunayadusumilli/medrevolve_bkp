import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2, XCircle, Loader2, RefreshCw, Search,
  Users, FileText, Pill, Activity, ChevronRight, AlertTriangle,
  Plug, Database, Shield, Zap
} from 'lucide-react';

const TABS = ['Overview', 'Patients', 'Cases', 'Prescriptions', 'Medications', 'Metadata'];

const statusColor = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

async function callMDI(action, params = {}) {
  const res = await base44.functions.invoke('mdIntegrations', { action, params });
  return res.data;
}

export default function MDIntegrationsDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [search, setSearch] = useState('');
  const [partner, setPartner] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await callMDI('test_connection');
      setConnection(res);
      if (res.connected) {
        const p = await callMDI('get_partner');
        setPartner(p.data);
      }
    } catch (e) {
      setConnection({ connected: false, message: e.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  const loadTabData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'Patients') {
        const res = await callMDI('list_patients', { page: 1, per_page: 20 });
        setData(d => ({ ...d, patients: res.data }));
      } else if (tab === 'Cases') {
        const res = await callMDI('list_cases', { page: 1, per_page: 20 });
        setData(d => ({ ...d, cases: res.data }));
      } else if (tab === 'Medications') {
        const res = await callMDI('search_medications', { page: 1, per_page: 20 });
        setData(d => ({ ...d, medications: res.data }));
      } else if (tab === 'Metadata') {
        const res = await callMDI('get_states', {});
        setData(d => ({ ...d, states: res.data }));
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (connection?.connected && tab !== 'Overview' && tab !== 'Prescriptions') {
      loadTabData(tab);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      if (activeTab === 'Patients') {
        const res = await callMDI('list_patients', { search });
        setData(d => ({ ...d, patients: res.data }));
      } else if (activeTab === 'Cases') {
        const res = await callMDI('list_cases', { search });
        setData(d => ({ ...d, cases: res.data }));
      } else if (activeTab === 'Medications') {
        const res = await callMDI('search_medications', { search });
        setData(d => ({ ...d, medications: res.data }));
      } else if (activeTab === 'Metadata') {
        const res = await callMDI('get_states', { search });
        setData(d => ({ ...d, states: res.data }));
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D3A2D] to-[#4A6741] flex items-center justify-center shadow-md">
              <Plug className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2D3A2D]">MD Integrations</h1>
              <p className="text-sm text-gray-500">E-Prescribing via DoseSpot — Partner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {connection && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${connection.connected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {connection.connected ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {connection.connected ? 'Connected' : 'Not Connected'}
              </div>
            )}
            <Button onClick={testConnection} variant="outline" size="sm" className="gap-2 rounded-full border-[#4A6741] text-[#4A6741]">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Test Connection
            </Button>
          </div>
        </div>

        {/* Credentials Warning */}
        {connection && !connection.connected && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">Credentials Not Configured</p>
              <p className="text-sm text-amber-700 mt-1">{connection.message}</p>
              <p className="text-sm text-amber-700 mt-2">
                To activate: go to <strong>Dashboard → Code → Settings → Secrets</strong> and add:
                <code className="mx-1 px-2 py-0.5 bg-amber-100 rounded text-xs font-mono">MDI_CLIENT_ID</code> and
                <code className="mx-1 px-2 py-0.5 bg-amber-100 rounded text-xs font-mono">MDI_CLIENT_SECRET</code>
              </p>
            </div>
          </div>
        )}

        {/* Partner Info Card */}
        {partner && (
          <div className="mb-6 p-5 bg-white rounded-2xl border border-[#E8E0D5] shadow-sm flex items-center gap-6">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Partner Account</p>
              <p className="text-lg font-bold text-[#2D3A2D]">{partner.name || 'MedRevolve'}</p>
              {partner.email && <p className="text-sm text-gray-500">{partner.email}</p>}
            </div>
            {partner.status && (
              <Badge className={statusColor[partner.status] || 'bg-gray-100 text-gray-600'}>{partner.status}</Badge>
            )}
            <div className="text-right">
              <p className="text-xs text-gray-400">Partner ID</p>
              <p className="text-xs font-mono text-gray-600">{partner.partner_id || '—'}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl border border-[#E8E0D5] p-1.5 w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-[#2D3A2D] text-white shadow-sm' : 'text-gray-500 hover:text-[#2D3A2D] hover:bg-[#F5F0E8]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* TAB: Overview */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Patients', desc: 'Create & manage patient records synced with DoseSpot', color: 'bg-blue-50 text-blue-600' },
                { icon: FileText, label: 'Cases', desc: 'Submit prescription cases to MD Integrations clinicians', color: 'bg-purple-50 text-purple-600' },
                { icon: Pill, label: 'Prescriptions', desc: 'Track Rx status, refills, and pharmacy fulfillment', color: 'bg-green-50 text-green-600' },
                { icon: Activity, label: 'Medications', desc: 'Search medication & compound database', color: 'bg-orange-50 text-orange-600' },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-[#E8E0D5] p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTabChange(label)}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[#2D3A2D] mb-1">{label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-[#4A6741] font-medium">
                    Open <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-white rounded-2xl border border-[#E8E0D5] p-6">
                <h3 className="font-semibold text-[#2D3A2D] mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-[#4A6741]" /> Integration Flow</h3>
                <div className="space-y-3">
                  {[
                    { step: '1', title: 'Patient Intake', desc: 'Patient completes onboarding → create patient via API', done: true },
                    { step: '2', title: 'Questionnaire / Intake', desc: 'Patient answers clinical questionnaire, photo uploads', done: true },
                    { step: '3', title: 'Create Case', desc: 'Submit patient case with desired medication to MD Integrations', done: false },
                    { step: '4', title: 'Clinician Review', desc: 'Licensed MD reviews and approves/denies prescription', done: false },
                    { step: '5', title: 'Prescription Issued', desc: 'Rx sent to pharmacy via DoseSpot automatically', done: false },
                    { step: '6', title: 'Fulfillment & Delivery', desc: 'Pharmacy ships directly to patient', done: false },
                  ].map(({ step, title, desc, done }) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${done ? 'bg-[#4A6741] text-white' : 'bg-gray-100 text-gray-500'}`}>{step}</div>
                      <div>
                        <p className="text-sm font-medium text-[#2D3A2D]">{title} {done && <Badge className="ml-1 bg-green-100 text-green-700 text-[10px] py-0">Built</Badge>}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
                <h3 className="font-semibold text-[#2D3A2D] mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#4A6741]" /> API Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Base URL</p>
                    <p className="font-mono text-xs bg-gray-50 rounded px-2 py-1 mt-1">api.mdintegrations.com/v1</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Auth</p>
                    <p className="text-xs text-gray-700 mt-1">OAuth2 Client Credentials → Bearer Token (auto-refreshed)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">E-Prescribing</p>
                    <p className="text-xs text-gray-700 mt-1">Proxied via DoseSpot — no direct DoseSpot integration needed</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Credentials Needed</p>
                    <div className="mt-1 space-y-1">
                      <code className="block text-xs bg-gray-50 rounded px-2 py-1">MDI_CLIENT_ID</code>
                      <code className="block text-xs bg-gray-50 rounded px-2 py-1">MDI_CLIENT_SECRET</code>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Support</p>
                    <p className="text-xs text-[#4A6741] mt-1">support@mdintegrations.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar for data tabs */}
        {['Patients', 'Cases', 'Medications', 'Metadata'].includes(activeTab) && (
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="pl-9 rounded-full border-[#E8E0D5]"
              />
            </div>
            <Button onClick={handleSearch} className="bg-[#2D3A2D] hover:bg-[#1D2A1D] text-white rounded-full px-5">Search</Button>
            <Button variant="outline" onClick={() => loadTabData(activeTab)} className="rounded-full border-[#4A6741] text-[#4A6741]">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#4A6741]" />
            <span className="text-gray-500">Loading from MD Integrations...</span>
          </div>
        )}

        {/* TAB: Patients */}
        {activeTab === 'Patients' && !loading && (
          <DataTable
            rows={data.patients}
            columns={['First Name', 'Last Name', 'Email', 'DOB', 'State', 'Status']}
            rowKey={r => r.patient_id}
            rowData={r => [r.first_name, r.last_name, r.email, r.date_of_birth, r.state?.abbreviation || r.state, r.status]}
            emptyText="No patients found. Add credentials and try again."
            notConnected={!connection?.connected}
          />
        )}

        {/* TAB: Cases */}
        {activeTab === 'Cases' && !loading && (
          <DataTable
            rows={data.cases}
            columns={['Case ID', 'Patient', 'Medication', 'Status', 'Created']}
            rowKey={r => r.case_id}
            rowData={r => [r.case_id?.substring(0, 8) + '...', r.patient?.full_name || r.patient_id, r.medication_name || '—', r.status, r.created_at ? new Date(r.created_at).toLocaleDateString() : '—']}
            emptyText="No cases found."
            notConnected={!connection?.connected}
          />
        )}

        {/* TAB: Prescriptions */}
        {activeTab === 'Prescriptions' && !loading && (
          <div className="bg-white rounded-2xl border border-[#E8E0D5] p-8 text-center">
            <Pill className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500 mb-1">Select a Case to View Prescriptions</p>
            <p className="text-sm text-gray-400">Navigate to the Cases tab and click on a case to view its prescriptions.</p>
            <Button onClick={() => handleTabChange('Cases')} variant="outline" className="mt-4 rounded-full border-[#4A6741] text-[#4A6741]">Go to Cases</Button>
          </div>
        )}

        {/* TAB: Medications */}
        {activeTab === 'Medications' && !loading && (
          <DataTable
            rows={data.medications}
            columns={['Name', 'Type', 'NDC', 'Form', 'Strength']}
            rowKey={r => r.medication_id || r.ndc}
            rowData={r => [r.name, r.type || r.medication_type || '—', r.ndc || '—', r.form || '—', r.strength || '—']}
            emptyText="Search for medications above."
            notConnected={!connection?.connected}
          />
        )}

        {/* TAB: Metadata */}
        {activeTab === 'Metadata' && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataTable
              title="US States"
              rows={data.states}
              columns={['State', 'Abbreviation', 'e-Prescribing', 'AV Flow']}
              rowKey={r => r.state_id}
              rowData={r => [r.name, r.abbreviation, r.is_sync ? '✓' : '—', r.is_av_flow ? '✓' : '—']}
              emptyText="Loading states..."
              notConnected={!connection?.connected}
            />
          </div>
        )}

      </div>
    </div>
  );
}

function DataTable({ rows, columns, rowKey, rowData, emptyText, title, notConnected }) {
  if (notConnected) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E0D5] p-8 text-center">
        <Database className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-medium text-gray-500">Connect MD Integrations First</p>
        <p className="text-sm text-gray-400 mt-1">Add your MDI_CLIENT_ID and MDI_CLIENT_SECRET to enable this.</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E0D5] p-8 text-center">
        <Database className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden">
      {title && <div className="px-5 py-3 border-b border-[#E8E0D5] font-semibold text-[#2D3A2D] text-sm">{title}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F0E8]">
            <tr>
              {columns.map(col => (
                <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F0E8]">
            {rows.map(row => (
              <tr key={rowKey(row)} className="hover:bg-[#FDFBF7] transition-colors">
                {rowData(row).map((cell, i) => (
                  <td key={i} className="px-4 py-3 text-gray-700">{cell ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}