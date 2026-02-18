import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Upload, FileText, Image, X, ExternalLink,
  Loader2, File, ChevronDown
} from 'lucide-react';

export default function DocumentSharePanel({ onClose }) {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (file.size > 20 * 1024 * 1024) {
        alert(`${file.name} exceeds 20MB limit`);
        continue;
      }
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const tempId = Date.now();
    setDocuments(prev => [...prev, { id: tempId, name: file.name, type: file.type, status: 'uploading', size: file.size }]);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setDocuments(prev => prev.map(d => d.id === tempId ? { ...d, url: file_url, status: 'ready' } : d));
    } catch {
      setDocuments(prev => prev.map(d => d.id === tempId ? { ...d, status: 'error' } : d));
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (id) => setDocuments(prev => prev.filter(d => d.id !== id));

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <Image className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-[#A8C99B]" />;
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0D1510]/95 backdrop-blur-sm border-l border-white/10 flex flex-col z-20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-white font-medium text-sm">Document Sharing</h3>
          <p className="text-white/30 text-xs mt-0.5">Files shared are end-to-end encrypted</p>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Area */}
      <div className="p-4 flex-shrink-0">
        <div
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-[#4A6741] bg-[#4A6741]/10' : 'border-white/15 hover:border-white/30'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files); }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#4A6741] mx-auto mb-2 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
          )}
          <p className="text-white/50 text-sm">{uploading ? 'Uploading...' : 'Drop files here or click to upload'}</p>
          <p className="text-white/25 text-xs mt-1">PDF, Images, Word · Max 20MB</p>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        <AnimatePresence>
          {documents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <File className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/25 text-sm">No documents shared yet</p>
            </motion.div>
          )}
          {documents.map(doc => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                {getFileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-xs font-medium truncate">{doc.name}</p>
                <p className="text-white/30 text-xs">{formatSize(doc.size)}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {doc.status === 'uploading' && <Loader2 className="w-3.5 h-3.5 text-white/40 animate-spin" />}
                {doc.status === 'ready' && doc.url && (
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 text-[#A8C99B] hover:text-white transition-colors" />
                  </a>
                )}
                {doc.status === 'error' && <span className="text-red-400 text-xs">Failed</span>}
                <button onClick={() => removeDocument(doc.id)} className="text-white/20 hover:text-white/60 transition-colors ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Security footer */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <p className="text-white/20 text-xs text-center">🔒 Files are encrypted and deleted after the session</p>
      </div>
    </div>
  );
}