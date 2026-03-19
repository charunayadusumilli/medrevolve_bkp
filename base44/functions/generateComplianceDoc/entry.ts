import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { jsPDF } from 'npm:jspdf@4.0.0';

const templates = {
  pharmacy: {
    title: 'Pharmacy Partnership Compliance Agreement',
    sections: [
      { heading: 'Regulatory Compliance', content: 'The pharmacy agrees to maintain all required licenses, DEA registration, and state-specific authorizations.' },
      { heading: 'Quality Standards', content: 'All medications dispensed must meet USP standards and FDA requirements.' },
      { heading: 'HIPAA Compliance', content: 'Pharmacy must maintain strict HIPAA compliance for all patient information.' },
      { heading: 'Reporting Requirements', content: 'Monthly reporting of prescription volumes and any adverse events.' },
      { heading: 'Insurance & Liability', content: 'Maintain minimum $2M professional liability insurance coverage.' }
    ]
  },
  provider: {
    title: 'Healthcare Provider Compliance Agreement',
    sections: [
      { heading: 'Licensure Requirements', content: 'Provider must maintain active medical license in all states where providing services.' },
      { heading: 'Prescribing Authority', content: 'Valid DEA registration and compliance with state prescribing laws.' },
      { heading: 'Standard of Care', content: 'Adhere to applicable standards of care and clinical guidelines.' },
      { heading: 'Malpractice Insurance', content: 'Maintain minimum $1M/$3M malpractice insurance coverage.' },
      { heading: 'Telemedicine Compliance', content: 'Follow state-specific telemedicine regulations and establish proper provider-patient relationships.' }
    ]
  },
  partner: {
    title: 'Business Partner Compliance Agreement',
    sections: [
      { heading: 'Business Authorization', content: 'Maintain valid business licenses and operating permits in all jurisdictions.' },
      { heading: 'Marketing Compliance', content: 'All marketing materials must comply with FTC and FDA advertising regulations.' },
      { heading: 'Data Protection', content: 'Implement appropriate security measures for customer data.' },
      { heading: 'Referral Compliance', content: 'Comply with anti-kickback statutes and stark law where applicable.' },
      { heading: 'Insurance Requirements', content: 'Maintain general liability insurance of at least $1M.' }
    ]
  },
  creator: {
    title: 'Creator Partnership Compliance Agreement',
    sections: [
      { heading: 'Content Guidelines', content: 'All promotional content must include proper disclosures and comply with FTC endorsement guidelines.' },
      { heading: 'Medical Claims', content: 'No unapproved medical claims or testimonials. All content must be reviewed and approved.' },
      { heading: 'Disclosure Requirements', content: 'Clearly disclose partnership and compensation in all promotional content.' },
      { heading: 'Platform Compliance', content: 'Adhere to advertising policies of social media platforms.' },
      { heading: 'Tax Compliance', content: 'Provide W-9 documentation and comply with 1099 reporting requirements.' }
    ]
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { compliance_id, partner_type } = await req.json();

    if (!compliance_id || !partner_type) {
      return Response.json({ 
        error: 'compliance_id and partner_type required' 
      }, { status: 400 });
    }

    // Get compliance record
    const record = await base44.asServiceRole.entities.ComplianceRecord.get(compliance_id);
    if (!record) {
      return Response.json({ error: 'Compliance record not found' }, { status: 404 });
    }

    const template = templates[partner_type];
    if (!template) {
      return Response.json({ error: 'Invalid partner type' }, { status: 400 });
    }

    // Generate PDF
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(74, 103, 65);
    doc.text('MedRevolve', 20, y);
    y += 15;

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(template.title, 20, y);
    y += 10;

    // Partner Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Partner: ${record.partner_name}`, 20, y);
    y += 5;
    doc.text(`License: ${record.license_number || 'N/A'}`, 20, y);
    y += 5;
    doc.text(`State: ${record.license_state || 'N/A'}`, 20, y);
    y += 5;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);
    y += 15;

    // Sections
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    for (const section of template.sections) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFont(undefined, 'bold');
      doc.text(section.heading, 20, y);
      y += 7;

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(section.content, 170);
      doc.text(lines, 20, y);
      y += (lines.length * 5) + 8;
    }

    // Signature section
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    y += 20;
    doc.setFontSize(10);
    doc.text('Partner Signature: _________________________', 20, y);
    y += 10;
    doc.text(`Date: _________________________`, 20, y);
    y += 20;
    doc.text('MedRevolve Representative: _________________________', 20, y);
    y += 10;
    doc.text(`Date: _________________________`, 20, y);

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${partner_type}_compliance_${record.partner_name.replace(/\s+/g, '_')}.pdf"`
      }
    });

  } catch (error) {
    console.error('Generate compliance doc error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});