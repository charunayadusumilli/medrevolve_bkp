import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, CheckCircle, ExternalLink, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_URL = 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/3929f8269_generated_image.png';
const COVER_URL = 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/365373e0a_generated_image.png';

const BRAND_COLORS = [
  { name: 'Primary Green', hex: '#4A6741', usage: 'CTAs, accents, logos' },
  { name: 'Mint', hex: '#A8C99B', usage: 'Highlights, badges' },
  { name: 'Deep Black', hex: '#0A0A0A', usage: 'Backgrounds' },
  { name: 'Navy Dark', hex: '#111D30', usage: 'Gradient backgrounds' },
  { name: 'White', hex: '#FFFFFF', usage: 'Text, icons on dark' },
];

const FACEBOOK_STEPS = [
  { step: '1', title: 'Download Profile Photo', desc: 'Use the square logo (180×180px recommended). Download below.' },
  { step: '2', title: 'Download Cover Photo', desc: 'Use the cover banner (820×312px). Download below.' },
  { step: '3', title: 'Go to your Facebook Page', desc: 'Navigate to your MedRevolve Facebook Business Page.' },
  { step: '4', title: 'Upload Profile Picture', desc: 'Click your profile photo → Update Profile Picture → Upload.' },
  { step: '5', title: 'Upload Cover Photo', desc: 'Click "Add a Cover" or the camera icon on your cover → Upload Photo.' },
  { step: '6', title: 'Add Facebook Pixel ID', desc: 'Go to Meta Business Manager → Events Manager → copy your Pixel ID and replace YOUR_PIXEL_ID in the app code.' },
];

export default function BrandingAssets() {
  const [copied, setCopied] = useState(null);

  const copyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <div className="inline-flex items-center gap-2 bg-[#4A6741]/20 border border-[#4A6741]/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[#A8C99B] text-xs font-bold uppercase tracking-widest">Brand Kit</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-3" style={{ letterSpacing: '-0.03em' }}>
            MedRevolve <span className="text-[#A8C99B]">Branding Assets</span>
          </h1>
          <p className="text-white/50 text-lg">Download logos, cover photos, and set up your Facebook presence.</p>
        </motion.div>

        {/* Logo + Cover Downloads */}
        <section className="mb-14">
          <h2 className="text-xl font-bold mb-6 text-white/80">Brand Assets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-[#111] flex items-center justify-center p-10">
                <img src={LOGO_URL} alt="MedRevolve Logo" className="w-40 h-40 object-contain rounded-xl" />
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-1">Profile Logo</h3>
                <p className="text-white/40 text-sm mb-4">Square format — ideal for Facebook/Instagram profile picture (180×180px)</p>
                <a href={LOGO_URL} download="medrevolve-logo.png" target="_blank" rel="noreferrer">
                  <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold">
                    <Download className="w-4 h-4 mr-2" /> Download Logo
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Cover */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-[#111] flex items-center justify-center p-6">
                <img src={COVER_URL} alt="MedRevolve Facebook Cover" className="w-full rounded-lg object-cover" style={{ aspectRatio: '820/312' }} />
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-1">Facebook Cover Photo</h3>
                <p className="text-white/40 text-sm mb-4">Wide banner — ideal for Facebook Page cover (820×312px)</p>
                <a href={COVER_URL} download="medrevolve-fb-cover.png" target="_blank" rel="noreferrer">
                  <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold">
                    <Download className="w-4 h-4 mr-2" /> Download Cover
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brand Colors */}
        <section className="mb-14">
          <h2 className="text-xl font-bold mb-6 text-white/80">Brand Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BRAND_COLORS.map((color) => (
              <motion.button
                key={color.hex}
                whileHover={{ scale: 1.03 }}
                onClick={() => copyColor(color.hex)}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:border-white/20 transition-all">
                <div className="w-full h-12 rounded-lg mb-3" style={{ background: color.hex, border: color.hex === '#FFFFFF' ? '1px solid rgba(255,255,255,0.2)' : 'none' }} />
                <p className="text-white text-xs font-bold mb-0.5">{color.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-white/40 text-xs font-mono">{color.hex}</p>
                  {copied === color.hex
                    ? <CheckCircle className="w-3 h-3 text-[#A8C99B]" />
                    : <Copy className="w-3 h-3 text-white/30" />}
                </div>
                <p className="text-white/30 text-[10px] mt-1">{color.usage}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Facebook Setup Guide */}
        <section className="mb-14">
          <h2 className="text-xl font-bold mb-2 text-white/80 flex items-center gap-2">
            <Facebook className="w-5 h-5 text-blue-400" /> Facebook Page Setup Guide
          </h2>
          <p className="text-white/40 text-sm mb-6">Follow these steps to set up your MedRevolve Facebook Business Page with the brand assets above.</p>
          <div className="space-y-3">
            {FACEBOOK_STEPS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex gap-4 bg-white/5 border border-white/8 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-[#4A6741]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#A8C99B] text-xs font-black">{item.step}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/45 text-xs mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-300 text-sm font-bold mb-1">⚠️ Important: Activate Facebook Pixel</p>
            <p className="text-white/50 text-xs leading-relaxed">
              To finish Facebook Pixel setup, go to <strong className="text-white/70">Meta Business Manager → Events Manager</strong>, 
              copy your Pixel ID, then ask your developer to replace <code className="bg-white/10 px-1 rounded text-[#A8C99B]">YOUR_PIXEL_ID</code> in <code className="bg-white/10 px-1 rounded text-[#A8C99B]">index.html</code> with your actual ID.
            </p>
            <a href="https://business.facebook.com/events_manager" target="_blank" rel="noreferrer">
              <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs">
                Open Meta Business Manager <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </a>
          </div>
        </section>

        {/* Social Share Snippet */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-white/80">Share Your Platform</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://medrevolve.com" target="_blank" rel="noreferrer">
              <Button className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-bold py-5">
                <Facebook className="w-5 h-5 mr-2" /> Share on Facebook
              </Button>
            </a>
            <a href="https://twitter.com/intent/tweet?url=https://medrevolve.com&text=Launch+your+telehealth+business+with+MedRevolve+%F0%9F%9A%80" target="_blank" rel="noreferrer">
              <Button className="w-full bg-[#1DA1F2] hover:bg-[#1a91da] text-white rounded-xl font-bold py-5">
                <Twitter className="w-5 h-5 mr-2" /> Share on Twitter
              </Button>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              <Button className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white rounded-xl font-bold py-5">
                <Instagram className="w-5 h-5 mr-2" /> Open Instagram
              </Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}