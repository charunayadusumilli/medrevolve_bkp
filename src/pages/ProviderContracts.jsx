import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Plus, FileText, DollarSign, Users, CheckCircle } from 'lucide-react';

export default function ProviderContracts() {
  const [showForm, setShowForm] = useState(false);

  const { data: contracts } = useQuery({
    queryKey: ['provider-contracts'],
    queryFn: () => base44.entities.ProviderContract.list('-created_date'),
    initialData: []
  });

  const activeContracts = contracts.filter(c => c.status === 'active');
  const totalCompensation = contracts.reduce((sum, c) => sum + (c.total_compensation_paid || 0), 0);
  const totalConsultations = contracts.reduce((sum, c) => sum + (c.total_consultations || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D]">Provider Network</h1>
            <p className="text-[#5A6B5A] mt-2">Operational provider partnerships</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[#4A6741] hover:bg-[#3D5636]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-[#E8E0D5]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-[#2D3A2D]">{activeContracts.length}</div>
              <div className="text-sm text-[#5A6B5A]">Active Providers</div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E0D5]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-[#2D3A2D]">{totalConsultations}</div>
              <div className="text-sm text-[#5A6B5A]">Total Consultations</div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E0D5]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-[#2D3A2D]">${totalCompensation.toFixed(2)}</div>
              <div className="text-sm text-[#5A6B5A]">Total Paid</div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E0D5]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-[#2D3A2D]">{contracts.length}</div>
              <div className="text-sm text-[#5A6B5A]">Total Contracts</div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        <Card className="border-[#E8E0D5]">
          <CardHeader>
            <CardTitle>Active Provider Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            {activeContracts.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-[#D4E5D7] mx-auto mb-4" />
                <p className="text-[#5A6B5A]">No active provider contracts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-4 bg-[#F5F0E8] rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-[#2D3A2D]">{contract.provider_name}</h3>
                      <p className="text-sm text-[#5A6B5A]">
                        {contract.specialties?.join(', ')} • {contract.states_licensed?.length} states
                      </p>
                      <p className="text-xs text-[#5A6B5A] mt-1">
                        {contract.total_consultations || 0} consultations
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {contract.contract_type}
                      </Badge>
                      <p className="text-sm font-medium text-[#2D3A2D] mt-2">
                        ${contract.total_compensation_paid?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}