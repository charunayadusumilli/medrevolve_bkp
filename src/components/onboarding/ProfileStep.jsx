import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export default function ProfileStep({ data, onUpdate }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const fields = [
    { label: 'Full Name', key: 'full_name', type: 'text', required: true },
    { label: 'Email', key: 'email', type: 'email', required: true },
    { label: 'Phone', key: 'phone', type: 'tel', required: true },
    { label: 'Date of Birth', key: 'date_of_birth', type: 'date', required: true },
    { label: 'Address', key: 'address', type: 'text', required: true },
    { label: 'City', key: 'city', type: 'text', required: true },
    { label: 'State', key: 'state', type: 'text', required: true },
    { label: 'ZIP Code', key: 'zip_code', type: 'text', required: true }
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
          {fields.map((field, idx) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Label htmlFor={field.key} className="block mb-2 text-sm font-medium text-[#2D3A2D]">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={`rounded-lg border ${
                  errors[field.key]
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-[#E8E0D5] focus:ring-[#4A6741]'
                }`}
                placeholder={field.label}
              />
              {errors[field.key] && (
                <div className="flex items-center gap-2 mt-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors[field.key]}
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