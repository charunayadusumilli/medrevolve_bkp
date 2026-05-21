import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Check, ExternalLink } from 'lucide-react';

const SIGNATURE_HTML = `
<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.4;color:#2D3A2D;">
  <div style="padding-bottom:12px;">
    <img src="https://media.base44.com/images/public/698bb392815cbad420c2ec1a/74d6bc580_generated_image.png" alt="MedRevolve" style="height:40px;width:auto;" />
  </div>
  <div style="padding-bottom:8px;">
    <strong style="font-size:16px;color:#2D3A2D;">Raj Nedunuri</strong><br/>
    <span style="color:#4A6741;font-size:13px;">President & CEO</span><br/>
    <span style="color:#5A6B5A;font-size:13px;">MedRevolve Corporation</span>
  </div>
  <div style="padding-bottom:8px;">
    <span style="color:#5A6B5A;font-size:13px;">📞 (234) 567-890 | ✉️ rned@medrevolve.com</span>
  </div>
  <div style="padding-top:8px;border-top:1px solid #E8E0D5;padding-bottom:8px;">
    <a href="https://instagram.com/medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="Instagram" style="width:18px;height:18px;" />
    </a>
    <a href="https://twitter.com/medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" style="width:18px;height:18px;" />
    </a>
    <a href="https://facebook.com/medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174848.png" alt="Facebook" style="width:18px;height:18px;" />
    </a>
    <a href="https://youtube.com/@medrevolve" style="text-decoration:none;margin-right:8px;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174860.png" alt="YouTube" style="width:18px;height:18px;" />
    </a>
    <a href="https://linkedin.com/company/medrevolve" style="text-decoration:none;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" style="width:18px;height:18px;" />
    </a>
  </div>
  <div style="padding-top:8px;font-size:11px;color:#8B9A8B;">
    MedRevolve Corporation | Launch a compliant telehealth, GLP-1, or RUO business under your own brand
  </div>
</div>
`;

export default function EmailSignature() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SIGNATURE_HTML.trim());
      setCopied(true);
      toast.success('Signature HTML copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy. Please select and copy manually.');
    }
  };

  const handleOpenGmail = () => {
    window.open('https://mail.google.com/mail/u/0/#settings/signatures', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2D3A2D] mb-2">Email Signature Setup</h1>
          <p className="text-[#5A6B5A]/70">Professional email signature for MedRevolve</p>
        </div>

        <div className="grid gap-6">
          {/* Instructions */}
          <Card className="border-[#4A6741]/20">
            <CardHeader>
              <CardTitle className="text-[#2D3A2D]">How to Add Your Signature</CardTitle>
              <CardDescription>Follow these steps to add the professional signature to your Gmail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-[#5A6B5A]">
              <ol className="list-decimal list-inside space-y-2">
                <li>Click "Copy Signature HTML" below</li>
                <li>Click "Open Gmail Settings" to go to Gmail signature settings</li>
                <li>In the signature editor, paste the HTML code</li>
                <li>Gmail will render the HTML automatically</li>
                <li>Scroll down and click "Save Changes"</li>
              </ol>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-[#4A6741]/20">
            <CardHeader>
              <CardTitle className="text-[#2D3A2D]">Signature Preview</CardTitle>
              <CardDescription>This is how your signature will appear in emails</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg p-6 bg-white"
                dangerouslySetInnerHTML={{ __html: SIGNATURE_HTML }}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-[#4A6741]/20">
            <CardHeader>
              <CardTitle className="text-[#2D3A2D]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button 
                onClick={handleCopy}
                className="bg-[#4A6741] hover:bg-[#4A6741]/90 text-white"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Signature HTML'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleOpenGmail}
                className="border-[#4A6741]/30 text-[#4A6741] hover:bg-[#4A6741]/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Gmail Settings
              </Button>
            </CardContent>
          </Card>

          {/* HTML Code (for manual copy) */}
          <Card className="border-[#4A6741]/20">
            <CardHeader>
              <CardTitle className="text-[#2D3A2D]">HTML Code</CardTitle>
              <CardDescription>Copy this code and paste it into Gmail signature editor</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-[#1a1a1a] text-[#8B9A8B] p-4 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto">
                {SIGNATURE_HTML.trim()}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}