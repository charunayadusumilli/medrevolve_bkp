import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Plus, Package, TrendingUp, MapPin } from 'lucide-react';

export default function PharmacyContracts() {
  const { data: contracts } = useQuery({
    queryKey: ['pharmacy-contracts'],
    queryFn: () => base44.entities.PharmacyContract.list('-created_date'),
    initialData: []
  });

  const activeContracts = contracts.filter(c => c.status === 'active');
  const totalRevenue = contracts.reduce((sum, c) => sum + (c.total_revenue || 0), 0);
  const totalPrescriptions = contracts.reduce((sum, c) => sum + (c.total_prescriptions_filled || 0), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3A2D]">Pharmacy Network</h1>
            <p className="text-[#5A6B5A] mt-2">Fulfillment partnerships</p>
          </div>
          <Button className="bg-[#4A6741] hover:bg-[#3D5636]">
            <Plus className="w-4 h-4 mr-2" />
            Add Pharmacy
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[#E8E0D5]">
            <CardContent className="p-6">
              <Package className="w-5 h-5 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-[#2D3A2D]">{activeContracts.length}</div>
              <div className="text-sm text-[#5A6B5A]">Active Pharmacies</div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E0D5]">
            <CardContent className="p-6">
              <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-[#2D3A2D]">{totalPrescriptions}</div>
              <div className="text-sm text-[#5A6B5A]">Prescriptions Filled</div>
            </CardContent>
          </Card>

          <Card className="border-[#E8E0D5]">
            <CardContent className="p-6">
              <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-[#2D3A2D]">${totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-[#5A6B5A]">Total Revenue</div>
            </CardContent>
          </Card>
        </div>

        {/* Pharmacies List */}
        <Card className="border-[#E8E0D5]">
          <CardHeader>
            <CardTitle>Active Pharmacy Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            {activeContracts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-[#D4E5D7] mx-auto mb-4" />
                <p className="text-[#5A6B5A]">No active pharmacy contracts yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {activeContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="p-6 bg-[#F5F0E8] rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-[#2D3A2D]">{contract.pharmacy_name}</h3>
                        <Badge className="mt-1 bg-blue-100 text-blue-800 border-blue-200">
                          {contract.pharmacy_type}
                        </Badge>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5A6B5A] mb-3">
                      <MapPin className="w-4 h-4" />
                      {contract.states_serviced?.length || 0} states
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[#5A6B5A]">Fulfilled</p>
                        <p className="font-medium text-[#2D3A2D]">{contract.total_prescriptions_filled || 0}</p>
                      </div>
                      <div>
                        <p className="text-[#5A6B5A]">Revenue</p>
                        <p className="font-medium text-[#2D3A2D]">${contract.total_revenue?.toFixed(2) || '0.00'}</p>
                      </div>
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