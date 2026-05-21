export const EmailSignatureHTML = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #2D3A2D;">
  <tr>
    <td style="padding-bottom: 12px;">
      <img src="https://media.base44.com/images/public/698bb392815cbad420c2ec1a/74d6bc580_generated_image.png" alt="MedRevolve" style="height: 40px; width: auto;" />
    </td>
  </tr>
  <tr>
    <td style="padding-bottom: 8px;">
      <strong style="font-size: 16px; color: #2D3A2D;">Raj Nedunuri</strong><br/>
      <span style="color: #4A6741; font-size: 13px;">President & CEO</span><br/>
      <span style="color: #5A6B5A; font-size: 13px;">MedRevolve Corporation</span>
    </td>
  </tr>
  <tr>
    <td style="padding-bottom: 8px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right: 12px;">
            <a href="tel:+1234567890" style="color: #5A6B5A; text-decoration: none; font-size: 13px;">📞 (234) 567-890</a>
          </td>
          <td>
            <a href="mailto:rned@medrevolve.com" style="color: #5A6B5A; text-decoration: none; font-size: 13px;">✉️ rned@medrevolve.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 8px; border-top: 1px solid #E8E0D5; padding-bottom: 8px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right: 8px;">
            <a href="https://instagram.com/medrevolve" style="text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="Instagram" style="width: 18px; height: 18px;" />
            </a>
          </td>
          <td style="padding-right: 8px;">
            <a href="https://twitter.com/medrevolve" style="text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" style="width: 18px; height: 18px;" />
            </a>
          </td>
          <td style="padding-right: 8px;">
            <a href="https://facebook.com/medrevolve" style="text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/32/174/174848.png" alt="Facebook" style="width: 18px; height: 18px;" />
            </a>
          </td>
          <td style="padding-right: 8px;">
            <a href="https://youtube.com/@medrevolve" style="text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/32/174/174860.png" alt="YouTube" style="width: 18px; height: 18px;" />
            </a>
          </td>
          <td>
            <a href="https://linkedin.com/company/medrevolve" style="text-decoration: none;">
              <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" style="width: 18px; height: 18px;" />
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top: 8px; font-size: 11px; color: #8B9A8B;">
      MedRevolve Corporation | Launch a compliant telehealth, GLP-1, or RUO business under your own brand
    </td>
  </tr>
</table>
`;

export default function EmailSignature() {
  return (
    <div className="border-l-2 border-[#4A6741] pl-4 mt-6 pt-4">
      <div className="mb-3">
        <img src="https://media.base44.com/images/public/698bb392815cbad420c2ec1a/74d6bc580_generated_image.png" alt="MedRevolve" className="h-10 w-auto" />
      </div>
      <div className="mb-2">
        <p className="font-semibold text-[#2D3A2D] text-base">Raj Nedunuri</p>
        <p className="text-[#4A6741] text-sm">President & CEO</p>
        <p className="text-[#5A6B5A] text-sm">MedRevolve Corporation</p>
      </div>
      <div className="mb-3 text-sm text-[#5A6B5A]">
        <p>📞 (234) 567-890 | ✉️ rned@medrevolve.com</p>
      </div>
      <div className="flex gap-2 mb-3 pt-3 border-t border-[#E8E0D5]">
        <a href="https://instagram.com/medrevolve" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
          <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="Instagram" className="w-4 h-4" />
        </a>
        <a href="https://twitter.com/medrevolve" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
          <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" alt="Twitter" className="w-4 h-4" />
        </a>
        <a href="https://facebook.com/medrevolve" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
          <img src="https://cdn-icons-png.flaticon.com/32/174/174848.png" alt="Facebook" className="w-4 h-4" />
        </a>
        <a href="https://youtube.com/@medrevolve" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
          <img src="https://cdn-icons-png.flaticon.com/32/174/174860.png" alt="YouTube" className="w-4 h-4" />
        </a>
        <a href="https://linkedin.com/company/medrevolve" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
          <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" className="w-4 h-4" />
        </a>
      </div>
      <p className="text-xs text-[#8B9A8B]">
        MedRevolve Corporation | Launch a compliant telehealth, GLP-1, or RUO business under your own brand
      </p>
    </div>
  );
}