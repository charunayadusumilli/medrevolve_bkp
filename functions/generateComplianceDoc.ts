import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function generatePharmacyComplianceDoc(partner, compliance) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { color: #4A6741; border-bottom: 3px solid #4A6741; padding-bottom: 10px; }
    h2 { color: #6B8F5E; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin: 30px 0; padding: 20px; background: #F5F0E8; border-radius: 8px; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
    .compliant { background: #C8E6C9; color: #2E7D32; }
    .pending { background: #FFF9C4; color: #F57F17; }
    .non-compliant { background: #FFCDD2; color: #C62828; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #4A6741; color: white; }
    .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PHARMACY COMPLIANCE CERTIFICATION</h1>
    <p><strong>Generated:</strong> ${today}</p>
  </div>

  <div class="section">
    <h2>Pharmacy Information</h2>
    <table>
      <tr><td><strong>Pharmacy Name:</strong></td><td>${partner.pharmacy_name}</td></tr>
      <tr><td><strong>License Number:</strong></td><td>${partner.license_number}</td></tr>
      <tr><td><strong>NPI Number:</strong></td><td>${partner.npi_number || 'N/A'}</td></tr>
      <tr><td><strong>Address:</strong></td><td>${partner.address}</td></tr>
      <tr><td><strong>Contact Email:</strong></td><td>${partner.contact_email}</td></tr>
      <tr><td><strong>Pharmacy Type:</strong></td><td>${partner.pharmacy_type}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Compliance Status</h2>
    <p><strong>Overall Status:</strong> <span class="status ${compliance.overall_status}">${compliance.overall_status.toUpperCase()}</span></p>
    <p><strong>Compliance Score:</strong> ${compliance.compliance_score}/100</p>
    <p><strong>Last Verification:</strong> ${new Date(compliance.last_verification_date).toLocaleDateString()}</p>
    <p><strong>Next Review:</strong> ${new Date(compliance.next_review_date).toLocaleDateString()}</p>
  </div>

  <div class="section">
    <h2>Verification Checklist</h2>
    <table>
      <tr>
        <th>Requirement</th>
        <th>Status</th>
        <th>Details</th>
      </tr>
      <tr>
        <td>Pharmacy License</td>
        <td><span class="status ${compliance.license_verification?.status}">${compliance.license_verification?.status || 'pending'}</span></td>
        <td>${compliance.license_verification?.notes || 'Pending verification'}</td>
      </tr>
      <tr>
        <td>LegitScript Verification</td>
        <td><span class="status ${compliance.legitscript_verification?.status}">${compliance.legitscript_verification?.status || 'pending'}</span></td>
        <td>${compliance.legitscript_verification?.notes || 'Pending verification'}</td>
      </tr>
      <tr>
        <td>Professional Liability Insurance</td>
        <td><span class="status ${compliance.insurance_verification?.status}">${compliance.insurance_verification?.status || 'pending'}</span></td>
        <td>Coverage: $${compliance.insurance_verification?.coverage_amount?.toLocaleString() || 'Pending'}</td>
      </tr>
      <tr>
        <td>HIPAA Compliance</td>
        <td><span class="status ${compliance.hipaa_compliance?.status}">${compliance.hipaa_compliance?.status || 'pending'}</span></td>
        <td>BAA Signed: ${compliance.hipaa_compliance?.baa_signed ? 'Yes' : 'No'}</td>
      </tr>
    </table>
  </div>

  ${partner.states_serviced && partner.states_serviced.length > 0 ? `
  <div class="section">
    <h2>State Licensing</h2>
    <table>
      <tr>
        <th>State</th>
        <th>Status</th>
        <th>Verified Date</th>
      </tr>
      ${compliance.state_compliance?.map(state => `
        <tr>
          <td>${state.state}</td>
          <td><span class="status ${state.status}">${state.status}</span></td>
          <td>${state.verified_date ? new Date(state.verified_date).toLocaleDateString() : 'Pending'}</td>
        </tr>
      `).join('') || '<tr><td colspan="3">State compliance data pending</td></tr>'}
    </table>
  </div>
  ` : ''}

  ${compliance.alerts && compliance.alerts.length > 0 ? `
  <div class="section">
    <h2>Compliance Alerts</h2>
    <table>
      <tr>
        <th>Severity</th>
        <th>Message</th>
        <th>Date</th>
      </tr>
      ${compliance.alerts.filter(a => !a.resolved).map(alert => `
        <tr>
          <td><span class="status ${alert.severity}">${alert.severity.toUpperCase()}</span></td>
          <td>${alert.message}</td>
          <td>${new Date(alert.created_date).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </table>
  </div>
  ` : ''}

  <div class="footer">
    <p>This document was automatically generated by MedRevolve Compliance System</p>
    <p>For questions, contact compliance@medrevolve.com</p>
  </div>
</body>
</html>
  `;
}

function generateProviderComplianceDoc(partner, compliance) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { color: #4A6741; border-bottom: 3px solid #4A6741; padding-bottom: 10px; }
    h2 { color: #6B8F5E; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin: 30px 0; padding: 20px; background: #F5F0E8; border-radius: 8px; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
    .compliant { background: #C8E6C9; color: #2E7D32; }
    .pending { background: #FFF9C4; color: #F57F17; }
    .non-compliant { background: #FFCDD2; color: #C62828; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #4A6741; color: white; }
    .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PROVIDER COMPLIANCE CERTIFICATION</h1>
    <p><strong>Generated:</strong> ${today}</p>
  </div>

  <div class="section">
    <h2>Provider Information</h2>
    <table>
      <tr><td><strong>Provider Name:</strong></td><td>${partner.provider_name}</td></tr>
      <tr><td><strong>License Number:</strong></td><td>${partner.license_number}</td></tr>
      <tr><td><strong>Contact Email:</strong></td><td>${partner.contact_email}</td></tr>
      <tr><td><strong>Specialties:</strong></td><td>${partner.specialties?.join(', ') || 'N/A'}</td></tr>
      <tr><td><strong>Contract Type:</strong></td><td>${partner.contract_type}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Compliance Status</h2>
    <p><strong>Overall Status:</strong> <span class="status ${compliance.overall_status}">${compliance.overall_status.toUpperCase()}</span></p>
    <p><strong>Compliance Score:</strong> ${compliance.compliance_score}/100</p>
    <p><strong>Last Verification:</strong> ${new Date(compliance.last_verification_date).toLocaleDateString()}</p>
    <p><strong>Next Review:</strong> ${new Date(compliance.next_review_date).toLocaleDateString()}</p>
  </div>

  <div class="section">
    <h2>Verification Checklist</h2>
    <table>
      <tr>
        <th>Requirement</th>
        <th>Status</th>
        <th>Details</th>
      </tr>
      <tr>
        <td>Medical License</td>
        <td><span class="status ${compliance.license_verification?.status}">${compliance.license_verification?.status || 'pending'}</span></td>
        <td>${compliance.license_verification?.notes || 'Pending verification'}</td>
      </tr>
      <tr>
        <td>Malpractice Insurance</td>
        <td><span class="status ${compliance.insurance_verification?.status}">${compliance.insurance_verification?.status || 'pending'}</span></td>
        <td>Coverage: $${compliance.insurance_verification?.coverage_amount?.toLocaleString() || 'Pending'}</td>
      </tr>
      <tr>
        <td>Background Check</td>
        <td><span class="status ${compliance.background_check?.status}">${compliance.background_check?.status || 'pending'}</span></td>
        <td>${compliance.background_check?.notes || 'Pending verification'}</td>
      </tr>
      <tr>
        <td>HIPAA Compliance</td>
        <td><span class="status ${compliance.hipaa_compliance?.status}">${compliance.hipaa_compliance?.status || 'pending'}</span></td>
        <td>BAA Signed: ${compliance.hipaa_compliance?.baa_signed ? 'Yes' : 'No'}, Training: ${compliance.hipaa_compliance?.training_completed ? 'Completed' : 'Pending'}</td>
      </tr>
    </table>
  </div>

  ${partner.states_licensed && partner.states_licensed.length > 0 ? `
  <div class="section">
    <h2>State Licensing</h2>
    <table>
      <tr>
        <th>State</th>
        <th>Status</th>
        <th>Verified Date</th>
      </tr>
      ${compliance.state_compliance?.map(state => `
        <tr>
          <td>${state.state}</td>
          <td><span class="status ${state.status}">${state.status}</span></td>
          <td>${state.verified_date ? new Date(state.verified_date).toLocaleDateString() : 'Pending'}</td>
        </tr>
      `).join('') || '<tr><td colspan="3">State compliance data pending</td></tr>'}
    </table>
  </div>
  ` : ''}

  ${compliance.alerts && compliance.alerts.length > 0 ? `
  <div class="section">
    <h2>Compliance Alerts</h2>
    <table>
      <tr>
        <th>Severity</th>
        <th>Message</th>
        <th>Date</th>
      </tr>
      ${compliance.alerts.filter(a => !a.resolved).map(alert => `
        <tr>
          <td><span class="status ${alert.severity}">${alert.severity.toUpperCase()}</span></td>
          <td>${alert.message}</td>
          <td>${new Date(alert.created_date).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </table>
  </div>
  ` : ''}

  <div class="footer">
    <p>This document was automatically generated by MedRevolve Compliance System</p>
    <p>For questions, contact compliance@medrevolve.com</p>
  </div>
</body>
</html>
  `;
}

function generatePartnerComplianceDoc(partner, compliance) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { color: #4A6741; border-bottom: 3px solid #4A6741; padding-bottom: 10px; }
    h2 { color: #6B8F5E; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin: 30px 0; padding: 20px; background: #F5F0E8; border-radius: 8px; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
    .compliant { background: #C8E6C9; color: #2E7D32; }
    .pending { background: #FFF9C4; color: #F57F17; }
    .non-compliant { background: #FFCDD2; color: #C62828; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #4A6741; color: white; }
    .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>PARTNER COMPLIANCE REPORT</h1>
    <p><strong>Generated:</strong> ${today}</p>
  </div>

  <div class="section">
    <h2>Business Information</h2>
    <table>
      <tr><td><strong>Business Name:</strong></td><td>${partner.business_name}</td></tr>
      <tr><td><strong>Business Type:</strong></td><td>${partner.business_type}</td></tr>
      <tr><td><strong>Contact Name:</strong></td><td>${partner.contact_name}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${partner.email}</td></tr>
      <tr><td><strong>Partner Code:</strong></td><td>${partner.partner_code}</td></tr>
      <tr><td><strong>Status:</strong></td><td>${partner.status}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Compliance Status</h2>
    <p><strong>Overall Status:</strong> <span class="status ${compliance.overall_status}">${compliance.overall_status.toUpperCase()}</span></p>
    <p><strong>Compliance Score:</strong> ${compliance.compliance_score}/100</p>
    <p><strong>Last Verification:</strong> ${new Date(compliance.last_verification_date).toLocaleDateString()}</p>
    <p><strong>Next Review:</strong> ${new Date(compliance.next_review_date).toLocaleDateString()}</p>
  </div>

  <div class="section">
    <h2>Agreement Status</h2>
    <table>
      <tr>
        <th>Requirement</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>Partner Agreement Signed</td>
        <td><span class="status ${compliance.overall_status}">${compliance.overall_status}</span></td>
      </tr>
      <tr>
        <td>HIPAA Business Associate Agreement</td>
        <td><span class="status ${compliance.hipaa_compliance?.status || 'pending'}">${compliance.hipaa_compliance?.baa_signed ? 'Signed' : 'Pending'}</span></td>
      </tr>
    </table>
  </div>

  ${compliance.alerts && compliance.alerts.length > 0 ? `
  <div class="section">
    <h2>Compliance Alerts</h2>
    <table>
      <tr>
        <th>Severity</th>
        <th>Message</th>
        <th>Date</th>
      </tr>
      ${compliance.alerts.filter(a => !a.resolved).map(alert => `
        <tr>
          <td><span class="status ${alert.severity}">${alert.severity.toUpperCase()}</span></td>
          <td>${alert.message}</td>
          <td>${new Date(alert.created_date).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </table>
  </div>
  ` : ''}

  <div class="footer">
    <p>This document was automatically generated by MedRevolve Compliance System</p>
    <p>For questions, contact compliance@medrevolve.com</p>
  </div>
</body>
</html>
  `;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { partner_id, partner_type } = await req.json();

    if (!partner_id || !partner_type) {
      return Response.json({ error: "partner_id and partner_type required" }, { status: 400 });
    }

    // Fetch partner data
    let partner;
    if (partner_type === "pharmacy") {
      const contracts = await base44.asServiceRole.entities.PharmacyContract.filter({ id: partner_id });
      if (!contracts || contracts.length === 0) {
        return Response.json({ error: "Pharmacy contract not found" }, { status: 404 });
      }
      partner = contracts[0];
    } else if (partner_type === "provider") {
      const contracts = await base44.asServiceRole.entities.ProviderContract.filter({ id: partner_id });
      if (!contracts || contracts.length === 0) {
        return Response.json({ error: "Provider contract not found" }, { status: 404 });
      }
      partner = contracts[0];
    } else if (partner_type === "partner") {
      const partners = await base44.asServiceRole.entities.Partner.filter({ id: partner_id });
      if (!partners || partners.length === 0) {
        return Response.json({ error: "Partner not found" }, { status: 404 });
      }
      partner = partners[0];
    } else {
      return Response.json({ error: "Invalid partner_type" }, { status: 400 });
    }

    // Fetch compliance data
    const complianceRecords = await base44.asServiceRole.entities.PartnerCompliance.filter({ partner_id });
    if (!complianceRecords || complianceRecords.length === 0) {
      return Response.json({ error: "Compliance record not found. Run verification first." }, { status: 404 });
    }
    const compliance = complianceRecords[0];

    // Generate appropriate document
    let htmlContent;
    if (partner_type === "pharmacy") {
      htmlContent = generatePharmacyComplianceDoc(partner, compliance);
    } else if (partner_type === "provider") {
      htmlContent = generateProviderComplianceDoc(partner, compliance);
    } else {
      htmlContent = generatePartnerComplianceDoc(partner, compliance);
    }

    return new Response(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });

  } catch (error) {
    console.error("Document generation error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});