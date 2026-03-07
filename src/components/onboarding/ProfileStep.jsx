import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import PhoneInput from '@/components/ui/PhoneInput';

export default function ProfileStep({ data, onUpdate, emailLocked = false }) {
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    const v = (value || '').toString().trim();
    if (!v) return `${fieldLabels[field] || field} is required.`;
    if (field === 'full_name' && v.split(' ').filter(Boolean).length < 2)
      return 'Please enter your first and last name.';
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return 'Please enter a valid email address.';
    if (field === 'phone' && v.replace(/\D/g, '').length < 10)
      return 'Please enter a valid 10-digit phone number.';
    if (field === 'zip_code' && !/^\d{5}(-\d{4})?$/.test(v))
      return 'Please enter a valid ZIP code (e.g. 12345).';
    if (field === 'date_of_birth' && new Date(v) >= new Date())
      return 'Date of birth cannot be a future date.';
    return '';
  };

  const fieldLabels = {
    full_name: 'Full Name', email: 'Email', date_of_birth: 'Date of Birth',
    address: 'Address', city: 'City', state: 'State', zip_code: 'ZIP Code', phone: 'Phone'
  };

  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    if (error) setErrors(prev => ({ ...prev, [field]: error }));
  };

  const fields = [
    { label: 'Full Name', key: 'full_name', type: 'text', required: true, placeholder: 'John Smith' },
    { label: 'Email', key: 'email', type: 'email', required: true, placeholder: 'john@example.com' },
    { label: 'Date of Birth', key: 'date_of_birth', type: 'date', required: true },
    { label: 'Address', key: 'address', type: 'text', required: true, placeholder: '123 Main St' },
    { label: 'City', key: 'city', type: 'text', required: true, placeholder: 'New York' },
    { label: 'State', key: 'state', type: 'text', required: true, placeholder: 'NY' },
    { label: 'ZIP Code', key: 'zip_code', type: 'text', required: true, placeholder: '10001' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8"
      >
        <h2 className="text-xl font-medium text-[#2D3A2D] mb-6">Your Information</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone field rendered separately */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Label htmlFor="phone" className="block mb-2 text-sm font-medium text-[#2D3A2D]">
              Phone <span className="text-red-500">*</span>
            </Label>
            <PhoneInput
              id="phone"
              value={data.phone || ''}
              onChange={(v) => handleChange('phone', v)}
              onBlur={() => handleBlur('phone', data.phone)}
            />
            {errors.phone && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-red-500">
                <AlertCircle className="w-3.5 h-3.5" />{errors.phone}
              </div>
            )}
          </motion.div>

          {fields.map((field, idx) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Label htmlFor={field.key} className="block mb-2 text-sm font-medium text-[#2D3A2D]">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onBlur={(e) => handleBlur(field.key, e.target.value)}
                className={`rounded-lg border ${
                  errors[field.key]
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-[#E8E0D5] focus:ring-[#4A6741]'
                }`}
                placeholder={field.placeholder || field.label}
              />
              {errors[field.key] && (
                <div className="flex items-center gap-1.5 mt-1 text-sm text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" />{errors[field.key]}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Your information is encrypted and secured. We'll use this to verify your identity and send you updates.
        </p>
      </motion.div>
    </div>
  );
}