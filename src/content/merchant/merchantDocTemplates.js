// Merchant onboarding document templates
// Each function takes a MerchantApplication record and returns populated HTML content.
// These are legal document templates — populated with merchant data and rendered for e-signature.

const MEDREVOLVE_LEGAL_NAME = 'MedRevolve Corporation';
const MEDREVOLVE_ADDRESS = '240-387-5224 | medrevolve.com';
const MEDREVOLVE_SIGNER = 'Phani Nedunuri, CEO';

function fmtDate(d) {
  if (!d) return '_______________';
  try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return d; }
}

function fmtMoney(n) {
  if (n == null) return '$_____';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

const baseStyles = `
  <style>
    .doc { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; line-height: 1.7; max-width: 800px; margin: 0 auto; padding: 40px; }
    .doc h1 { font-size: 22px; text-align: center; margin-bottom: 4px; letter-spacing: 1px; }
    .doc h2 { font-size: 14px; text-align: center; color: #555; margin-top: 0; font-weight: normal; margin-bottom: 32px; }
    .doc h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 28px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    .doc p, .doc li { font-size: 12px; line-height: 1.8; }
    .doc .section { margin-bottom: 20px; }
    .doc .field-table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
    .doc .field-table td { padding: 6px 10px; border: 1px solid #ccc; vertical-align: top; }
    .doc .field-table td:first-child { background: #f7f7f7; font-weight: bold; width: 35%; }
    .doc .sig-block { margin-top: 40px; border: 1px solid #999; padding: 20px; background: #fafafa; }
    .doc .sig-line { border-bottom: 1px solid #333; margin: 24px 0 8px; height: 20px; }
    .doc .initials { display: inline-block; border-bottom: 1px solid #333; width: 40px; height: 20px; margin-right: 12px; }
    .doc .page-break { page-break-after: always; }
    .doc ol, .doc ul { padding-left: 20px; }
    .doc .center { text-align: center; }
    .doc .small { font-size: 10px; color: #666; }
  </style>
`;

// ─── MERCHANT PROCESSING APPLICATION (MPA) ─────────────────────────────────
export function generateMPA(app) {
  const ownersRows = (app.beneficial_owners || []).map((o, i) => `
    <tr><td>Owner ${i + 1} Name</td><td>${o.name || '—'}</td></tr>
    <tr><td>Ownership %</td><td>${o.ownership_pct || '—'}%</td></tr>
    <tr><td>Date of Birth</td><td>${fmtDate(o.dob)}</td></tr>
    <tr><td>Address</td><td>${o.address || '—'}</td></tr>
    <tr><td>SSN (last 4)</td><td>XXX-XX-${o.ssn_last4 || '____'}</td></tr>
  `).join('');

  return `
  <div class="doc">
  ${baseStyles}
  <h1>MERCHANT PROCESSING APPLICATION</h1>
  <h2>${MEDREVOLVE_LEGAL_NAME} — Card Acceptance Agreement</h2>

  <p class="small center">This Merchant Processing Application ("MPA") is submitted by the business identified below ("Merchant") to ${MEDREVOLVE_LEGAL_NAME} ("MedRevolve") acting as Independent Sales Organization, for the purpose of establishing card-based payment processing services through a sponsor bank. By signing this application, Merchant certifies that all information provided is true, complete, and accurate.</p>

  <h3>1. Business Information</h3>
  <table class="field-table">
    <tr><td>Legal Business Name</td><td>${app.legal_business_name || '—'}</td></tr>
    <tr><td>DBA Name</td><td>${app.dba_name || '—'}</td></tr>
    <tr><td>Entity Type</td><td>${app.entity_type || '—'}</td></tr>
    <tr><td>State of Formation</td><td>${app.state_of_formation || '—'}</td></tr>
    <tr><td>EIN</td><td>${app.ein || '—'}</td></tr>
    <tr><td>Business Address</td><td>${app.business_address || '—'}, ${app.business_city || ''}, ${app.business_state || ''} ${app.business_zip || ''}</td></tr>
    <tr><td>Business Phone</td><td>${app.business_phone || '—'}</td></tr>
    <tr><td>Website</td><td>${app.business_website || '—'}</td></tr>
    <tr><td>Industry</td><td>${app.industry || '—'}</td></tr>
    <tr><td>Business Description</td><td>${app.business_description || '—'}</td></tr>
  </table>

  <h3>2. Processing Information</h3>
  <table class="field-table">
    <tr><td>Expected Monthly Volume</td><td>${fmtMoney(app.expected_monthly_volume)}</td></tr>
    <tr><td>Average Ticket Amount</td><td>${fmtMoney(app.average_ticket_amount)}</td></tr>
    <tr><td>Highest Ticket Amount</td><td>${fmtMoney(app.highest_ticket_amount)}</td></tr>
    <tr><td>Accepted Card Brands</td><td>${(app.accepted_card_brands || []).join(', ') || '—'}</td></tr>
  </table>

  <h3>3. Settlement Account</h3>
  <table class="field-table">
    <tr><td>Bank Name</td><td>${app.bank_name || '—'}</td></tr>
    <tr><td>Account Type</td><td>${app.bank_account_type || '—'}</td></tr>
    <tr><td>Account Number (last 4)</td><td>****${app.bank_account_last4 || '____'}</td></tr>
    <tr><td>Routing Number</td><td>${app.bank_routing_number || '—'}</td></tr>
  </table>
  <p class="small">Merchant authorizes ${MEDREVOLVE_LEGAL_NAME} and its sponsor bank to initiate debit and credit entries to the account identified above for the purpose of settling card transaction proceeds and processing fees, chargebacks, and adjustments.</p>

  <h3>4. Beneficial Owners (25%+ Ownership)</h3>
  ${app.beneficial_owners && app.beneficial_owners.length > 0
    ? `<table class="field-table">${ownersRows}</table>`
    : '<p>No additional beneficial owners identified at 25% or greater ownership threshold.</p>'}

  <h3>5. Authorized Signer & Personal Guarantee</h3>
  <table class="field-table">
    <tr><td>Signer Name</td><td>${app.signing_officer_name || '—'}</td></tr>
    <tr><td>Title</td><td>${app.signing_officer_title || '—'}</td></tr>
    <tr><td>Email</td><td>${app.signing_officer_email || '—'}</td></tr>
    <tr><td>Phone</td><td>${app.signing_officer_phone || '—'}</td></tr>
    <tr><td>Date of Birth</td><td>${fmtDate(app.signing_officer_dob)}</td></tr>
    <tr><td>SSN (last 4)</td><td>XXX-XX-${app.signing_officer_ssn_last4 || '____'}</td></tr>
    <tr><td>Home Address</td><td>${app.signing_officer_home_address || '—'}</td></tr>
  </table>

  <p><strong>Personal Guarantee.</strong> The undersigned signer personally guarantees the full and timely performance of all obligations of the Merchant under this Agreement, including but not limited to the payment of all fees, chargebacks, and adjustments. This personal guarantee is irrevocable and continues for the duration of the processing relationship and any outstanding balances thereafter.</p>
  <p>Signer acknowledges personal guarantee: <strong>${app.personal_guarantee_accepted ? 'YES — ACCEPTED' : 'NOT ACCEPTED'}</strong></p>

  <h3>6. Merchant Certifications</h3>
  <p>Merchant certifies that:</p>
  <ol>
    <li>All information provided in this application is true, complete, and accurate to the best of Merchant's knowledge.</li>
    <li>Merchant's business operations are legal and compliant with all applicable federal, state, and local laws, including FDA, FTC, and HIPAA regulations where applicable.</li>
    <li>Merchant will not process payments for prohibited categories including but not limited to: illegal substances, unauthorized prescription drugs, counterfeit goods, or any activity prohibited by card network rules.</li>
    <li>Merchant will maintain PCI DSS compliance throughout the term of this agreement.</li>
    <li>Merchant authorizes ${MEDREVOLVE_LEGAL_NAME} and its sponsor bank to perform credit checks, background verification, and risk assessment as part of underwriting.</li>
  </ol>

  <h3>7. Agreement to Terms</h3>
  <p>By signing below, Merchant agrees to the terms of this Merchant Processing Application, the associated Merchant Agreement, and all card network rules and regulations as amended from time to time. This application is subject to approval by the sponsor bank.</p>

  <div class="sig-block">
    <p><strong>MERCHANT SIGNATURE</strong></p>
    <p>By typing my full legal name below, I acknowledge this constitutes my electronic signature under the E-SIGN Act (15 U.S.C. §7001) and has the same legal effect as a handwritten signature.</p>
    <p>Signature: <span class="sig-line"></span></p>
    <p>Print Name: ${app.signing_officer_name || '—'} &nbsp;&nbsp; Title: ${app.signing_officer_title || '—'}</p>
    <p>Date: ${fmtDate(app.mpa_signed_at || new Date().toISOString())}</p>
    ${app.mpa_signed ? `<p class="small"><strong>✓ SIGNED ELECTRONICALLY</strong> by ${app.mpa_signature_name} on ${fmtDate(app.mpa_signed_at)}</p>` : '<p class="small">— Awaiting signature —</p>'}
  </div>
  </div>
  `;
}

// ─── B2B PLATFORM SERVICE AGREEMENT ────────────────────────────────────────
export function generateServiceAgreement(app) {
  const servicesList = (app.selected_services || []).map(s => `<li>${s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</li>`).join('');

  return `
  <div class="doc">
  ${baseStyles}
  <h1>B2B PLATFORM SERVICE AGREEMENT</h1>
  <h2>${MEDREVOLVE_LEGAL_NAME}</h2>

  <p class="small center">This B2B Platform Service Agreement ("Agreement") is entered into as of ${fmtDate(app.start_date || new Date().toISOString())} ("Effective Date") by and between ${MEDREVOLVE_LEGAL_NAME} ("MedRevolve", "Provider", "we") and ${app.legal_business_name || '_____'} ("Client", "Merchant", "you").</p>

  <h3>1. Services</h3>
  <p>MedRevolve agrees to provide the following services to Client:</p>
  <ul>${servicesList || '<li>Services to be determined</li>'}</ul>
  <p>The specific scope, deliverables, and configuration of each service shall be detailed in one or more Statements of Work or service orders executed by the parties. Services include access to MedRevolve's white-label telehealth infrastructure platform, including but not limited to website builder, provider integration, pharmacy network, compliance tools, payment processing, and marketing integrations as selected by Client.</p>

  <h3>2. Term</h3>
  <p>This Agreement shall commence on the Effective Date and continue for an initial term of <strong>${app.service_term_months || 12} months</strong>. This Agreement shall automatically renew for successive ${app.service_term_months || 12}-month terms unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the then-current term.</p>

  <h3>3. Fees</h3>
  <p>Client agrees to pay MedRevolve the following fees:</p>
  <table class="field-table">
    <tr><td>Monthly Platform Fee</td><td>${fmtMoney(app.monthly_fee)} per month</td></tr>
    <tr><td>Term</td><td>${app.service_term_months || 12} months</td></tr>
    <tr><td>Start Date</td><td>${fmtDate(app.start_date)}</td></tr>
  </table>
  <p>Fees are billed monthly in advance and are due upon receipt of invoice. Late payments may incur a 1.5% monthly late fee. MedRevolve may adjust fees upon renewal with thirty (30) days prior written notice.</p>

  <h3>4. Client Responsibilities</h3>
  <p>Client shall:</p>
  <ol>
    <li>Provide accurate and timely information required for the provision of Services, including business, compliance, and operational data.</li>
    <li>Maintain all required licenses, permits, and regulatory approvals necessary for Client's business operations.</li>
    <li>Ensure that all content, products, and services offered through the Platform comply with applicable federal, state, and local laws, including FDA, FTC, DEA, and state medical/pharmacy regulations.</li>
    <li>Obtain and maintain all necessary clinical relationships, including licensed providers and pharmacy partnerships, for telehealth services.</li>
    <li>Not use the Platform for any illegal, fraudulent, or prohibited purpose.</li>
    <li>Pay all fees when due and maintain current billing information.</li>
  </ol>

  <h3>5. Intellectual Property</h3>
  <p>MedRevolve retains all right, title, and interest in and to the Platform, including all software, code, designs, methodologies, and intellectual property. Client retains all right, title, and interest in its business name, brand, content, and customer data. Client is granted a limited, non-exclusive, non-transferable license to use the Platform for the term of this Agreement, subject to compliance with this Agreement.</p>

  <h3>6. Data & Privacy</h3>
  <p>MedRevolve shall handle all Client and patient data in accordance with applicable data protection laws, including HIPAA where Protected Health Information is involved (as further detailed in the Business Associate Agreement). Client retains ownership of all data processed through the Platform. MedRevolve shall not access, use, or disclose Client data except as necessary to provide the Services or as required by law.</p>

  <h3>7. Confidentiality</h3>
  <p>Each party agrees to maintain the confidentiality of any non-public information disclosed by the other party, including pricing, business strategies, and technical information. Confidentiality obligations shall survive termination of this Agreement for a period of three (3) years.</p>

  <h3>8. Limitation of Liability</h3>
  <p>Except for a party's breach of confidentiality or intellectual property obligations, neither party shall be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits or revenue. Each party's total liability under this Agreement shall not exceed the fees paid by Client to MedRevolve in the twelve (12) months preceding the claim.</p>

  <h3>9. Indemnification</h3>
  <p>Client shall indemnify and hold harmless MedRevolve from any claims, damages, or expenses arising from Client's business operations, content, products, services, or breach of this Agreement. MedRevolve shall indemnify Client from third-party claims arising from MedRevolve's gross negligence or willful misconduct in providing the Services.</p>

  <h3>10. Termination</h3>
  <p>Either party may terminate this Agreement for material breach upon thirty (30) days written notice if the breach is not cured. MedRevolve may terminate immediately for non-payment, illegal activity, or breach of compliance obligations. Upon termination, Client shall pay all outstanding fees, and MedRevolve shall provide Client with a reasonable transition period of thirty (30) days to migrate data.</p>

  <h3>11. Governing Law</h3>
  <p>This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration administered by the American Arbitration Association in Los Angeles, California.</p>

  <h3>12. Entire Agreement</h3>
  <p>This Agreement, together with any Statements of Work, the Business Associate Agreement, and the Merchant Processing Application, constitutes the entire agreement between the parties and supersedes all prior agreements and understandings, whether written or oral.</p>

  <div class="sig-block">
    <p><strong>CLIENT SIGNATURE</strong></p>
    <p>By typing my full legal name below, I acknowledge this constitutes my electronic signature under the E-SIGN Act (15 U.S.C. §7001) and that I am authorized to bind the Client entity.</p>
    <p>Signature: <span class="sig-line"></span></p>
    <p>Print Name: ${app.signing_officer_name || '—'} &nbsp;&nbsp; Title: ${app.signing_officer_title || '—'}</p>
    <p>Date: ${fmtDate(app.service_agreement_signed_at || new Date().toISOString())}</p>
    ${app.service_agreement_signed ? `<p class="small"><strong>✓ SIGNED ELECTRONICALLY</strong> by ${app.service_agreement_signature_name} on ${fmtDate(app.service_agreement_signed_at)}</p>` : '<p class="small">— Awaiting signature —</p>'}
    <br/>
    <p>For ${MEDREVOLVE_LEGAL_NAME}: ${MEDREVOLVE_SIGNER}</p>
  </div>
  </div>
  `;
}

// ─── HIPAA BUSINESS ASSOCIATE AGREEMENT (BAA) ──────────────────────────────
export function generateBAA(app) {
  return `
  <div class="doc">
  ${baseStyles}
  <h1>BUSINESS ASSOCIATE AGREEMENT</h1>
  <h2>HIPAA — 45 CFR Parts 160 and 164</h2>

  <p class="small center">This Business Associate Agreement ("BAA") is entered into as of ${fmtDate(app.start_date || new Date().toISOString())} by and between ${app.legal_business_name || '_____'} ("Covered Entity") and ${MEDREVOLVE_LEGAL_NAME} ("Business Associate"), collectively the "Parties."</p>

  <h3>1. Definitions</h3>
  <p>The terms used in this BAA shall have the same meanings as those set forth in the HIPAA Privacy and Security Rules (45 CFR Parts 160 and 164). "Protected Health Information" or "PHI" means individually identifiable health information transmitted or maintained in any form or medium. "Designated Record Set" means a group of records maintained by or for a Covered Entity.</p>

  <h3>2. Covered Entity Information</h3>
  <table class="field-table">
    <tr><td>Covered Entity Name</td><td>${app.legal_business_name || '—'}</td></tr>
    <tr><td>Address</td><td>${app.business_address || '—'}, ${app.business_city || ''}, ${app.business_state || ''} ${app.business_zip || ''}</td></tr>
    <tr><td>Authorized Representative</td><td>${app.signing_officer_name || '—'}, ${app.signing_officer_title || '—'}</td></tr>
    <tr><td>Handles PHI</td><td>${app.handles_phi ? 'YES' : 'NO'}</td></tr>
    <tr><td>PHI Services Description</td><td>${app.phi_services_description || 'Telehealth platform services including patient intake, consultation scheduling, and clinical data routing.'}</td></tr>
  </table>

  <h3>3. Obligations of Business Associate</h3>
  <p>Business Associate agrees to:</p>
  <ol>
    <li>Not use or disclose PHI other than as permitted or required by this BAA or as required by law.</li>
    <li>Use appropriate safeguards to prevent use or disclosure of PHI other than as provided for by this BAA.</li>
    <li>Report to Covered Entity any use or disclosure of PHI not provided for by this BAA, or any Security Incident, of which Business Associate becomes aware, without unreasonable delay and in no case later than sixty (60) calendar days after discovery.</li>
    <li>Report any Breach of unsecured PHI in accordance with 45 CFR §164.410, without unreasonable delay and in no case later than sixty (60) calendar days after discovery.</li>
    <li>Ensure that any subcontractors that create, receive, maintain, or transmit PHI on behalf of Business Associate agree to the same restrictions and conditions that apply to Business Associate under this BAA.</li>
    <li>Make available to Covered Entity all PHI in a Designated Record Set, if applicable, to fulfill Covered Entity's obligations under 45 CFR §164.524 (access) and §164.526 (amendment).</li>
    <li>Maintain and make available to Covered Entity information required to provide an accounting of disclosures of PHI in accordance with 45 CFR §164.528.</li>
    <li>Make Business Associate's internal practices, books, and records relating to the use and disclosure of PHI available to the Secretary of Health and Human Services for purposes of determining Covered Entity's compliance with the HIPAA Rules.</li>
    <li>At termination of this BAA, return or destroy all PHI received from, or created or received by Business Associate on behalf of, Covered Entity, if feasible. If return or destruction is not feasible, Business Associate shall extend the protections of this BAA to the PHI and limit further uses and disclosures to those that make the return or destruction infeasible.</li>
  </ol>

  <h3>4. Permitted Uses and Disclosures</h3>
  <p>Business Associate may use or disclose PHI only as permitted or required by this BAA or as required by law. Business Associate may use PHI for the proper management and administration of Business Associate and to carry out the legal responsibilities of Business Associate. Business Associate may disclose PHI for the purposes authorized by this BAA provided the disclosure is required by law or Business Associate obtains reasonable assurances from the recipient that the PHI will be held confidentially and used or further disclosed only as required by law or for the purpose for which it was disclosed.</p>

  <h3>5. Security Obligations</h3>
  <p>Business Associate shall implement administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of PHI, in accordance with the HIPAA Security Rule (45 CFR Part 164, Subpart C). Business Associate shall conduct risk assessments, implement security awareness training, maintain access controls, encrypt PHI in transit and at rest, and maintain audit controls.</p>

  <h3>6. Breach Notification</h3>
  <p>In the event of a Breach of unsecured PHI, Business Associate shall notify Covered Entity without unreasonable delay and in no case later than sixty (60) calendar days after discovery. Notification shall include: (a) identification of each individual affected, (b) a description of what happened, (c) the types of information involved, (d) steps individuals should take to protect themselves, (e) what Business Associate is doing to investigate and mitigate, and (f) contact procedures.</p>

  <h3>7. Term and Termination</h3>
  <p>This BAA shall be effective as of the Effective Date and shall continue until terminated. Either party may terminate this BAA upon thirty (30) days written notice if the other party has materially breached a material term of this BAA and has failed to cure such breach within thirty (30) days. Upon termination, Business Associate shall return or destroy all PHI as set forth in Section 3(i).</p>

  <h3>8. Regulatory References</h3>
  <p>A reference in this BAA to a section in the HIPAA Rules means the section as in effect or as amended. This BAA shall be interpreted to comply with the HIPAA Rules, and any ambiguity shall be resolved in favor of compliance.</p>

  <h3>9. Survival</h3>
  <p>The obligations of Business Associate under this BAA shall survive the termination of this BAA with respect to any PHI in the possession or control of Business Associate.</p>

  <div class="sig-block">
    <p><strong>COVERED ENTITY SIGNATURE</strong></p>
    <p>By typing my full legal name below, I acknowledge this constitutes my electronic signature under the E-SIGN Act (15 U.S.C. §7001) and that I am authorized to bind the Covered Entity.</p>
    <p>Signature: <span class="sig-line"></span></p>
    <p>Print Name: ${app.signing_officer_name || '—'} &nbsp;&nbsp; Title: ${app.signing_officer_title || '—'}</p>
    <p>Date: ${fmtDate(app.baa_signed_at || new Date().toISOString())}</p>
    ${app.baa_signed ? `<p class="small"><strong>✓ SIGNED ELECTRONICALLY</strong> by ${app.baa_signature_name} on ${fmtDate(app.baa_signed_at)}</p>` : '<p class="small">— Awaiting signature —</p>'}
    <br/>
    <p>For ${MEDREVOLVE_LEGAL_NAME}: ${MEDREVOLVE_SIGNER}</p>
  </div>
  </div>
  `;
}

export const DOC_LIST = [
  { key: 'mpa', title: 'Merchant Processing Application', desc: 'Card acceptance agreement with sponsor bank — business info, processing volume, banking, beneficial owners, personal guarantee.', generate: generateMPA, signedField: 'mpa_signed' },
  { key: 'service_agreement', title: 'B2B Platform Service Agreement', desc: 'Master service agreement for MedRevolve platform — scope, fees, term, IP, liability.', generate: generateServiceAgreement, signedField: 'service_agreement_signed' },
  { key: 'baa', title: 'HIPAA Business Associate Agreement', desc: 'Required for PHI handling — obligations, security, breach notification, termination.', generate: generateBAA, signedField: 'baa_signed' },
];