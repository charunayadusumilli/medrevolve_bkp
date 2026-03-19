import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Compliance checks by partner type
const complianceChecks = {
  pharmacy: [
    { check_type: 'DEA Registration', required: true },
    { check_type: 'State Pharmacy License', required: true },
    { check_type: 'NPI Verification', required: true },
    { check_type: 'NABP Accreditation', required: false },
    { check_type: 'Insurance Coverage', required: true },
    { check_type: 'HIPAA Compliance', required: true }
  ],
  provider: [
    { check_type: 'Medical License Verification', required: true },
    { check_type: 'Board Certification', required: false },
    { check_type: 'DEA Registration', required: true },
    { check_type: 'Malpractice Insurance', required: true },
    { check_type: 'State License Active Status', required: true },
    { check_type: 'HIPAA Training', required: true }
  ],
  partner: [
    { check_type: 'Business License', required: true },
    { check_type: 'Insurance Coverage', required: true },
    { check_type: 'Tax ID Verification', required: true },
    { check_type: 'Background Check', required: false }
  ],
  creator: [
    { check_type: 'Identity Verification', required: true },
    { check_type: 'Social Media Verification', required: true },
    { check_type: 'Tax Documentation', required: true },
    { check_type: 'Content Guidelines Agreement', required: true }
  ]
};

// Required documents by partner type
const requiredDocuments = {
  pharmacy: [
    'Pharmacy License',
    'DEA Certificate',
    'Insurance Certificate',
    'NABP Accreditation',
    'NPI Documentation'
  ],
  provider: [
    'Medical License',
    'DEA Certificate',
    'Malpractice Insurance',
    'Board Certification',
    'CV/Resume'
  ],
  partner: [
    'Business License',
    'Insurance Certificate',
    'Tax ID (EIN)',
    'Operating Agreement'
  ],
  creator: [
    'Photo ID',
    'W-9 Form',
    'Social Media Screenshots',
    'Content Guidelines Signed'
  ]
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { partner_id, partner_type, license_number, license_state, license_expiry_date, notes } = await req.json();

    if (!partner_id || !partner_type) {
      return Response.json({ error: 'partner_id and partner_type required' }, { status: 400 });
    }

    // Get partner details
    let partner;
    let partner_name;
    
    if (partner_type === 'pharmacy') {
      const contracts = await base44.asServiceRole.entities.PharmacyContract.filter({ id: partner_id });
      partner = contracts[0];
      partner_name = partner?.pharmacy_name;
    } else if (partner_type === 'provider') {
      const contracts = await base44.asServiceRole.entities.ProviderContract.filter({ id: partner_id });
      partner = contracts[0];
      partner_name = partner?.provider_name;
    } else if (partner_type === 'partner') {
      const partners = await base44.asServiceRole.entities.Partner.filter({ id: partner_id });
      partner = partners[0];
      partner_name = partner?.business_name;
    } else if (partner_type === 'creator') {
      const creators = await base44.asServiceRole.entities.CreatorMetrics.filter({ creator_email: partner_id });
      partner = creators[0];
      partner_name = creators[0]?.creator_email;
    }

    if (!partner) {
      return Response.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Initialize compliance checks
    const checks = complianceChecks[partner_type].map(check => ({
      check_type: check.check_type,
      status: 'pending',
      checked_at: new Date().toISOString(),
      notes: check.required ? 'Required check' : 'Optional check'
    }));

    // Initialize required documents
    const documents = requiredDocuments[partner_type].map(doc => ({
      document_type: doc,
      status: 'pending',
      file_url: null,
      expiry_date: null
    }));

    // Calculate next review date (1 year from now or license expiry, whichever is sooner)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    let nextReviewDate = oneYearFromNow.toISOString().split('T')[0];
    if (license_expiry_date) {
      const expiryDate = new Date(license_expiry_date);
      if (expiryDate < oneYearFromNow) {
        nextReviewDate = license_expiry_date;
      }
    }

    // Check if compliance record already exists
    const existing = await base44.asServiceRole.entities.ComplianceRecord.filter({ 
      partner_id,
      partner_type 
    });

    let complianceRecord;
    if (existing.length > 0) {
      // Update existing record
      complianceRecord = await base44.asServiceRole.entities.ComplianceRecord.update(existing[0].id, {
        compliance_status: 'in_review',
        verification_method: 'manual',
        license_number: license_number || existing[0].license_number,
        license_state: license_state || existing[0].license_state,
        license_expiry_date: license_expiry_date || existing[0].license_expiry_date,
        verification_date: new Date().toISOString(),
        next_review_date: nextReviewDate,
        compliance_checks: checks,
        documents_required: documents,
        verified_by: user.email,
        notes: notes || existing[0].notes,
        legitscript_url: 'https://certification.legitscript.com/s/'
      });
    } else {
      // Create new compliance record
      complianceRecord = await base44.asServiceRole.entities.ComplianceRecord.create({
        partner_id,
        partner_type,
        partner_name,
        compliance_status: 'in_review',
        verification_method: 'manual',
        license_number,
        license_state,
        license_expiry_date,
        verification_date: new Date().toISOString(),
        next_review_date: nextReviewDate,
        compliance_checks: checks,
        documents_required: documents,
        risk_score: 50,
        issues: [],
        verified_by: user.email,
        notes: notes || '',
        legitscript_url: 'https://certification.legitscript.com/s/'
      });
    }

    return Response.json({
      success: true,
      compliance_record: complianceRecord,
      message: 'Compliance verification initiated. Please complete checks and upload required documents.'
    });

  } catch (error) {
    console.error('Compliance verification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});