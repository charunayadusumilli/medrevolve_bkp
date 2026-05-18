import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function DocumentUploadStep({ data, onUpdate }) {
  const [uploading, setUploading] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const fileInputRefs = useRef({});

  const documentTypes = [
    {
      key: 'id_document',
      label: 'Government ID',
      description: 'Upload a clear photo of your driver\'s license or passport',
      accepts: 'image/*,.pdf'
    },
    {
      key: 'insurance_card',
      label: 'Insurance Card',
      description: 'Front and back of your insurance card',
      accepts: 'image/*,.pdf'
    }
  ];

  const handleFileUpload = async (e, docKey) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn('No file selected');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadErrors(prev => ({ ...prev, [docKey]: 'Please upload a valid image or PDF file' }));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadErrors(prev => ({ ...prev, [docKey]: 'File size must be less than 10MB' }));
      return;
    }

    setUploading(prev => ({ ...prev, [docKey]: true }));
    setUploadProgress(prev => ({ ...prev, [docKey]: 0 }));
    setUploadErrors(prev => ({ ...prev, [docKey]: '' }));

    try {
      console.log(`📤 Uploading ${docKey}...`, file.name, file.type, file.size);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      console.log(`✅ Upload successful: ${file_url}`);
      
      onUpdate({
        ...data,
        [docKey]: file_url
      });
      setUploadProgress(prev => ({ ...prev, [docKey]: 100 }));
    } catch (error) {
      console.error(`❌ Failed to upload ${docKey}:`, error);
      setUploadErrors(prev => ({ ...prev, [docKey]: error.message || 'Failed to upload file. Please try again.' }));
    } finally {
      setUploading(prev => ({ ...prev, [docKey]: false }));
    }
  };

  const triggerFileInput = (docKey) => {
    console.log(`🖱️ Triggering file input for ${docKey}`);
    fileInputRefs.current[docKey]?.click();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8"
      >
        <h2 className="text-xl font-medium text-[#2D3A2D] mb-2">Upload Documents</h2>
        <p className="text-[#5A6B5A] mb-8">
          To verify your identity and process your account, we need a few documents
        </p>

        <div className="space-y-6">
          {documentTypes.map((doc, idx) => (
            <motion.div
              key={doc.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border-2 border-dashed border-[#E8E0D5] rounded-2xl p-8 hover:border-[#4A6741] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-[#2D3A2D] mb-1">{doc.label}</h3>
                  <p className="text-sm text-[#5A6B5A] mb-4">{doc.description}</p>

                  {data[doc.key] ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">Document uploaded</span>
                    </div>
                  ) : (
                    <div>
                      <Button
                        type="button"
                        onClick={() => triggerFileInput(doc.key)}
                        disabled={uploading[doc.key]}
                        className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg"
                      >
                        {uploading[doc.key] ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </Button>
                      <input
                        ref={(el) => {
                          if (el) fileInputRefs.current[doc.key] = el;
                        }}
                        type="file"
                        accept={doc.accepts}
                        onChange={(e) => handleFileUpload(e, doc.key)}
                        disabled={uploading[doc.key]}
                        className="hidden"
                        aria-label={`Upload ${doc.label}`}
                      />
                      {uploadErrors[doc.key] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {uploadErrors[doc.key]}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {data[doc.key] && (
                  <FileText className="w-8 h-8 text-green-500 flex-shrink-0" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
      >
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          Documents should be clear and legible. We'll verify them within 24 hours. Your documents are encrypted and securely stored.
        </p>
      </motion.div>
    </div>
  );
}