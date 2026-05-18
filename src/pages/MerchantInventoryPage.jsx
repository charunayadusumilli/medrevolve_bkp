import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import RequireAuth from '@/components/auth/RequireAuth';
import {
  Package, Plus, AlertCircle, Check, Search, RefreshCw,
  TrendingDown, TrendingUp, X, Save, Edit2, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';

const PRODUCT_TEMPLATES = [
  { product_name: 'Semaglutide 0.5mg/mL', product_type: 'GLP', category: 'weight_loss', unit_cost: 45, retail_price: 149 },
  { product_name: 'Tirzepatide 5mg/mL', product_type: 'GLP', category: 'weight_loss', unit_cost: 65, retail_price: 249 },
  { product_name: 'BPC-157', product_type: 'RUO', category: 'peptides', unit_cost: 28, retail_price: 89 },
  { product_name: 'TB-500', product_type: 'RUO', category: 'peptides', unit_cost: 35, retail_price: 109 },
  { product_name: 'Sermorelin 9mg', product_type: 'RUO', category: 'peptides', unit_cost: 42, retail_price: 139 },
  { product_name: 'NAD+ 500mg', product_type: 'supplement', category: 'longevity', unit_cost: 22, retail_price: 79 },
  { product_name: 'Testosterone Cypionate', product_type: 'GLP', category: 'hormone', unit_cost: 38, retail_price: 129 },
  { product_name: 'Finasteride 1mg', product_type: 'GLP', category: 'hair_loss', unit_cost: 12, retail_price: 49 },
];

const TYPE_COLORS = {
  GLP: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  RUO: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  supplement: 'bg-green-500/20 text-green-300 border-green-500/30',
  device: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const EMPTY_FORM = {
  product_name: '', product_type: 'GLP', category: 'weight_loss',
  current_stock: 0, min_stock_threshold: 10, reorder_quantity: 50,
  unit_cost: 0, retail_price: 0, supplier_name: '', avg_delivery_days: 3,
  backup_product_name: '', auto_reorder: false, notes: '', is_active: true
};

function InventoryRow({ item, onEdit, onDelete, onAdjust }) {
  const [adjusting, setAdjusting] = useState(false);
  const [adjVal, setAdjVal] = useState('');
  const isLow = item.current_stock <= item.min_stock_threshold;

  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className={`border-b border-white/5 hover:bg-white/3 transition-colors ${isLow ? 'bg-amber-500/5' : ''}`}>
      <td className="px-4 py-3">
        <div>
          <p className="text-white font-medium text-sm">{item.product_name}</p>
          {item.supplier_name && <p className="text-white/40 text-xs mt-0.5">{item.supplier_name}</p>}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className={`text-xs border ${TYPE_COLORS[item.product_type] || TYPE_COLORS.other}`}>
          {item.product_type || 'N/A'}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isLow && <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
          <span className={`text-sm font-bold ${isLow ? 'text-amber-400' : 'text-white'}`}>
            {item.current_stock}
          </span>
          <span className="text-white/30 text-xs">/ {item.min_stock_threshold} min</span>
        </div>
      </td>
      <td className="px-4 py-3 text-white/60 text-sm">${item.retail_price || '—'}</td>
      <td className="px-4 py-3 text-white/60 text-sm">{item.avg_delivery_days}d</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {adjusting ? (
            <>
              <Input value={adjVal} onChange={e => setAdjVal(e.target.value)} type="number"
                className="w-16 h-7 bg-white/10 border-white/20 text-white text-xs px-2" />
              <button onClick={() => { onAdjust(item.id, Number(adjVal)); setAdjusting(false); setAdjVal(''); }}
                className="w-7 h-7 bg-[#4A6741] rounded-lg flex items-center justify-center hover:bg-[#3D5636]">
                <Check className="w-3.5 h-3.5 text-white" />
              </button>
              <button onClick={() => setAdjusting(false)}
                className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setAdjusting(true)}
                className="text-xs text-white/40 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors">
                Adjust
              </button>
              <button onClick={() => onEdit(item)}
                className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors">
                <Edit2 className="w-3.5 h-3.5 text-white/60" />
              </button>
              <button onClick={() => onDelete(item.id)}
                className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5 text-white/60" />
              </button>
            </>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

function MerchantInventoryInner() {
  const queryClient = useQueryClient();
  const [partner, setPartner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  const { data: partners = [] } = useQuery({
    queryKey: ['my-partner-inv'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Partner.filter({ email: user.email });
    }
  });

  useEffect(() => { if (partners.length > 0) setPartner(partners[0]); }, [partners]);

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['merchant-inventory-full', partner?.id],
    queryFn: () => base44.entities.MerchantInventory.filter({ merchant_id: partner.id }),
    enabled: !!partner
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['merchant-modules-inv', partner?.id],
    queryFn: () => base44.entities.MerchantModule.filter({ merchant_id: partner.id }),
    enabled: !!partner
  });

  const activeModuleKeys = modules.filter(m => m.is_active).map(m => m.module_key);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, merchant_id: partner.id, merchant_name: partner.business_name };
      if (editingItem) return base44.entities.MerchantInventory.update(editingItem.id, payload);
      return base44.entities.MerchantInventory.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-inventory-full'] });
      queryClient.invalidateQueries({ queryKey: ['merchant-inventory', partner?.id] });
      setShowForm(false);
      setEditingItem(null);
      setForm(EMPTY_FORM);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MerchantInventory.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['merchant-inventory-full'] })
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, qty }) => base44.entities.MerchantInventory.update(id, { current_stock: qty }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['merchant-inventory-full'] })
  });

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ ...EMPTY_FORM, ...item });
    setShowForm(true);
  };

  const applyTemplate = (tmpl) => setForm(prev => ({ ...prev, ...tmpl }));

  const filtered = inventory.filter(item => {
    const matchSearch = !search || item.product_name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || item.product_type === filterType;
    const matchStock = filterStock === 'all' ||
      (filterStock === 'low' && item.current_stock <= item.min_stock_threshold) ||
      (filterStock === 'ok' && item.current_stock > item.min_stock_threshold);
    return matchSearch && matchType && matchStock;
  });

  const lowCount = inventory.filter(i => i.current_stock <= i.min_stock_threshold).length;
  const totalValue = inventory.reduce((sum, i) => sum + ((i.current_stock || 0) * (i.retail_price || 0)), 0);

  return (
    <div className="min-h-screen bg-[#0F1A0F] flex">
      <MerchantSidebar partner={partner} activeModules={activeModuleKeys} currentPage="MerchantInventoryPage" />

      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
              <p className="text-white/40 text-sm mt-1">Track stock, manage products, set reorder alerts</p>
            </div>
            <Button onClick={() => { setEditingItem(null); setForm(EMPTY_FORM); setShowForm(true); }}
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Products', value: inventory.length, icon: Package, color: 'text-white' },
              { label: 'Low Stock Alerts', value: lowCount, icon: AlertCircle, color: lowCount > 0 ? 'text-amber-400' : 'text-white' },
              { label: 'Inventory Value', value: `$${totalValue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
              { label: 'GLP Products', value: inventory.filter(i => i.product_type === 'GLP').length, icon: Package, color: 'text-blue-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <s.icon className={`w-4 h-4 ${s.color} mb-2`} />
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-white/40 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="GLP">GLP</SelectItem>
                <SelectItem value="RUO">RUO</SelectItem>
                <SelectItem value="supplement">Supplement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStock} onValueChange={setFilterStock}>
              <SelectTrigger className="w-36 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="ok">In Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-6 h-6 text-white/40 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 font-medium">No products yet</p>
                <p className="text-white/20 text-sm mb-4">Add your first product to start tracking inventory</p>
                <Button onClick={() => { setEditingItem(null); setForm(EMPTY_FORM); setShowForm(true); }}
                  className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add First Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Product', 'Type', 'Stock', 'Retail Price', 'Delivery', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => (
                      <InventoryRow key={item.id} item={item}
                        onEdit={openEdit}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        onAdjust={(id, qty) => adjustMutation.mutate({ id, qty })} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Drawer */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex justify-end">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-[#0F1A0F] border-l border-white/10 h-full overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-xl">{editingItem ? 'Edit Product' : 'Add Product'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!editingItem && (
                  <div>
                    <Label className="text-white/60 text-xs mb-2 block">Quick Templates</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRODUCT_TEMPLATES.map(t => (
                        <button key={t.product_name} type="button" onClick={() => applyTemplate(t)}
                          className="text-left p-2 bg-white/5 rounded-lg border border-white/10 hover:border-[#4A6741]/50 transition-colors">
                          <p className="text-white text-xs font-medium truncate">{t.product_name}</p>
                          <p className="text-white/40 text-xs">{t.product_type}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {[
                    { label: 'Product Name *', field: 'product_name', type: 'text', placeholder: 'e.g. Semaglutide 0.5mg/mL' },
                    { label: 'Supplier', field: 'supplier_name', type: 'text', placeholder: 'Supplier name' },
                  ].map(f => (
                    <div key={f.field}>
                      <Label className="text-white/70 text-sm">{f.label}</Label>
                      <Input value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                        placeholder={f.placeholder} className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-white/70 text-sm">Product Type</Label>
                      <Select value={form.product_type} onValueChange={v => setForm(p => ({ ...p, product_type: v }))}>
                        <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GLP">GLP (FDA-regulated)</SelectItem>
                          <SelectItem value="RUO">RUO (Research Use)</SelectItem>
                          <SelectItem value="supplement">Supplement</SelectItem>
                          <SelectItem value="device">Device</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white/70 text-sm">Category</Label>
                      <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                        <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['weight_loss', 'mens_health', 'womens_health', 'longevity', 'hormone', 'peptides', 'hair_loss', 'other'].map(c => (
                            <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Current Stock', field: 'current_stock' },
                      { label: 'Min Threshold', field: 'min_stock_threshold' },
                      { label: 'Reorder Qty', field: 'reorder_quantity' },
                    ].map(f => (
                      <div key={f.field}>
                        <Label className="text-white/70 text-xs">{f.label}</Label>
                        <Input type="number" value={form[f.field]}
                          onChange={e => setForm(p => ({ ...p, [f.field]: Number(e.target.value) }))}
                          className="mt-1 bg-white/10 border-white/20 text-white" />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Unit Cost ($)', field: 'unit_cost' },
                      { label: 'Retail Price ($)', field: 'retail_price' },
                    ].map(f => (
                      <div key={f.field}>
                        <Label className="text-white/70 text-xs">{f.label}</Label>
                        <Input type="number" value={form[f.field]}
                          onChange={e => setForm(p => ({ ...p, [f.field]: Number(e.target.value) }))}
                          className="mt-1 bg-white/10 border-white/20 text-white" />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Backup Product (if out of stock)</Label>
                    <Input value={form.backup_product_name} onChange={e => setForm(p => ({ ...p, backup_product_name: e.target.value }))}
                      placeholder="e.g. Semaglutide 0.25mg/mL" className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Notes</Label>
                    <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                      placeholder="Internal notes..." className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30" />
                  </div>
                </div>

                <Button onClick={() => saveMutation.mutate(form)} disabled={!form.product_name || saveMutation.isPending}
                  className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white">
                  {saveMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {editingItem ? 'Save Changes' : 'Add Product'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MerchantInventoryPage() {
  return (
    <RequireAuth portalName="Inventory Manager">
      <MerchantInventoryInner />
    </RequireAuth>
  );
}