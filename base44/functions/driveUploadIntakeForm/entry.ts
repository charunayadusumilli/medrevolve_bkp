import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Core utility: create or get a folder in Drive (app-created files only)
async function getOrCreateFolder(accessToken, name, parentId = null) {
  // Try to find in our DriveFolder entity first
  return { name, parentId, accessToken };
}

async function createDriveFolder(accessToken, name, parentId = null) {
  const meta = { name, mimeType: 'application/vnd.google-apps.folder' };
  if (parentId) meta.parents = [parentId];
  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(meta),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Drive folder create failed: ${JSON.stringify(data)}`);
  return data.id;
}

async function uploadTextFile(accessToken, name, content, parentId) {
  const meta = JSON.stringify({ name, mimeType: 'text/html', parents: parentId ? [parentId] : [] });
  const body = new TextEncoder().encode(content);

  const boundary = 'form_boundary_medrevolve';
  const multipart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n--${boundary}\r\nContent-Type: text/html\r\n\r\n${content}\r\n--${boundary}--`;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipart,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Drive upload failed: ${JSON.stringify(data)}`);
  return data.id;
}

// HTML template for intake summaries
function buildIntakeHtml(title, sections) {
  const sectionHtml = sections.map(({ heading, rows }) => `
    <h2 style="color:#4A6741;border-bottom:2px solid #4A6741;padding-bottom:6px;margin-top:24px">${heading}</h2>
    <table style="width:100%;border-collapse:collapse">
      ${rows.map(([label, val]) => `
        <tr>
          <td style="padding:8px 12px;background:#f5f0e8;font-weight:600;width:200px;border:1px solid #e8e0d5">${label}</td>
          <td style="padding:8px 12px;border:1px solid #e8e0d5">${val || '—'}</td>
        </tr>`).join('')}
    </table>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#2D3A2D}
  h1{color:#2D3A2D;text-align:center} .footer{margin-top:40px;padding-top:16px;border-top:1px solid #ccc;font-size:12px;color:#888;text-align:center}</style>
  </head><body>
  <div style="text-align:center;margin-bottom:32px">
    <div style="display:inline-block;background:#4A6741;color:white;padding:8px 20px;border-radius:8px;font-weight:bold;font-size:18px">MedRevolve</div>
  </div>
  <h1>${title}</h1>
  <p style="text-align:center;color:#888">Submitted: ${new Date().toLocaleString()}</p>
  ${sectionHtml}
  <div class="footer">MedRevolve — Confidential Medical Document — ${new Date().getFullYear()}</div>
  </body></html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { form_type, data, submitter_name, submitter_email } = payload;

    // form_type: 'patient' | 'provider' | 'pharmacy' | 'customer' | 'creator' | 'business'

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // Get or create root MedRevolve folder
    let rootFolder = await base44.asServiceRole.entities.DriveFolder.filter({ name: 'MedRevolve', parent_id: null });
    let rootId;
    if (rootFolder.length > 0) {
      rootId = rootFolder[0].folder_id;
    } else {
      rootId = await createDriveFolder(accessToken, 'MedRevolve');
      await base44.asServiceRole.entities.DriveFolder.create({ name: 'MedRevolve', folder_id: rootId, parent_id: null, path: 'MedRevolve' });
    }

    // Map form_type to subfolder name
    const folderMap = {
      patient: 'Patients',
      customer: 'Patients',
      provider: 'Providers',
      pharmacy: 'Pharmacies',
      creator: 'Applications',
      business: 'Applications',
    };
    const subfolderName = folderMap[form_type] || 'Applications';

    // Get or create type subfolder
    let typeFolder = await base44.asServiceRole.entities.DriveFolder.filter({ name: subfolderName, parent_id: rootId });
    let typeFolderId;
    if (typeFolder.length > 0) {
      typeFolderId = typeFolder[0].folder_id;
    } else {
      typeFolderId = await createDriveFolder(accessToken, subfolderName, rootId);
      await base44.asServiceRole.entities.DriveFolder.create({ name: subfolderName, folder_id: typeFolderId, parent_id: rootId, path: `MedRevolve/${subfolderName}` });
    }

    // Create per-person folder
    const personName = submitter_name || submitter_email || 'Unknown';
    const timestamp = new Date().toISOString().slice(0, 10);
    const personFolderName = `${personName} (${timestamp})`;
    const personFolderId = await createDriveFolder(accessToken, personFolderName, typeFolderId);
    console.log(`Created person folder: ${personFolderName} → ${personFolderId}`);

    // Build HTML content based on form_type
    let htmlContent = '';
    let fileTitle = '';

    if (form_type === 'provider') {
      fileTitle = `Provider Application — ${personName}`;
      htmlContent = buildIntakeHtml(fileTitle, [
        { heading: 'Personal Information', rows: [
          ['Full Name', data.full_name], ['Email', data.email], ['Phone', data.phone], ['Title', data.title], ['Specialty', data.specialty],
        ]},
        { heading: 'Credentials', rows: [
          ['License Number', data.license_number], ['States Licensed', (data.states_licensed || []).join(', ')],
          ['Education', data.education], ['Certifications', data.certifications],
        ]},
        { heading: 'Experience & Availability', rows: [
          ['Years Experience', data.years_experience], ['Practice Type', data.practice_type],
          ['Availability', data.availability], ['Bio', data.bio],
        ]},
      ]);
    } else if (form_type === 'pharmacy') {
      fileTitle = `Pharmacy Application — ${personName}`;
      htmlContent = buildIntakeHtml(fileTitle, [
        { heading: 'Pharmacy Information', rows: [
          ['Pharmacy Name', data.pharmacy_name], ['Contact Name', data.contact_name],
          ['Email', data.email], ['Phone', data.phone], ['Type', data.pharmacy_type],
        ]},
        { heading: 'Location', rows: [
          ['Address', data.address], ['City', data.city], ['State', data.state], ['ZIP', data.zip_code],
          ['Shipping', data.shipping_capabilities],
        ]},
        { heading: 'Licensing', rows: [
          ['License Number', data.license_number], ['NPI Number', data.npi_number],
        ]},
        { heading: 'Partnership', rows: [
          ['Why Partner', data.partnership_interest],
        ]},
      ]);
    } else if (form_type === 'customer' || form_type === 'patient') {
      fileTitle = `Patient Intake — ${personName}`;
      htmlContent = buildIntakeHtml(fileTitle, [
        { heading: 'Personal Information', rows: [
          ['Full Name', data.full_name], ['Email', data.email], ['Phone', data.phone], ['Date of Birth', data.date_of_birth],
        ]},
        { heading: 'Location', rows: [
          ['Address', data.address], ['City', data.city], ['State', data.state], ['ZIP', data.zip_code],
        ]},
        { heading: 'Health Goals', rows: [
          ['Primary Interest', data.primary_interest], ['Consultation Preference', data.consultation_preference],
          ['How They Found Us', data.heard_about_us], ['Referral Code', data.referral_code],
        ]},
        { heading: 'Medical Information', rows: [
          ['Insurance Provider', data.insurance_provider], ['Insurance ID', data.insurance_id],
          ['Medical History', data.medical_history_notes],
        ]},
      ]);
    } else if (form_type === 'creator') {
      fileTitle = `Creator Application — ${personName}`;
      htmlContent = buildIntakeHtml(fileTitle, [
        { heading: 'Creator Information', rows: [
          ['Full Name', data.full_name], ['Email', data.email], ['Phone', data.phone],
          ['Platform', data.platform], ['Handle', data.platform_handle],
          ['Followers', data.followers_count], ['Niche', data.audience_niche],
        ]},
        { heading: 'Application', rows: [
          ['Why Partner', data.why_partner],
        ]},
      ]);
    } else if (form_type === 'business') {
      fileTitle = `Business Inquiry — ${personName}`;
      htmlContent = buildIntakeHtml(fileTitle, [
        { heading: 'Business Information', rows: [
          ['Company', data.company_name], ['Contact', data.contact_name], ['Email', data.email],
          ['Phone', data.phone], ['Industry', data.industry], ['Interest', data.interest_type],
          ['Company Size', data.company_size],
        ]},
        { heading: 'Message', rows: [
          ['Details', data.message],
        ]},
      ]);
    }

    // Upload the HTML file to Drive
    const fileName = `${fileTitle}.html`;
    const fileId = await uploadTextFile(accessToken, fileName, htmlContent, personFolderId);
    console.log(`Uploaded ${fileName} → Drive file ID: ${fileId}`);

    return Response.json({
      success: true,
      file_id: fileId,
      folder_id: personFolderId,
      folder_name: personFolderName,
      file_name: fileName,
    });

  } catch (error) {
    console.error('driveUploadIntakeForm error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});