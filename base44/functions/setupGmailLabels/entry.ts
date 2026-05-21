/**
 * setupGmailLabels — Creates a complete Gmail label taxonomy for MedRevolve
 * Run once (or re-run safely) from admin dashboard or test tool.
 * Creates nested labels: MedRevolve/Providers, MedRevolve/Pharmacies, etc.
 * Also creates Google Drive subfolder structure for Competitors + Merchants.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const LABEL_TREE = [
  // Parent            Child labels
  { parent: 'MedRevolve', children: [] },
  { parent: 'MedRevolve/📥 Leads',         children: ['New', 'Contacted', 'Qualified', 'Closed'] },
  { parent: 'MedRevolve/👨‍⚕️ Providers',     children: ['Applications', 'Under Review', 'Approved', 'Rejected'] },
  { parent: 'MedRevolve/💊 Pharmacies',     children: ['Applications', 'Under Review', 'Approved', 'Rejected'] },
  { parent: 'MedRevolve/🏢 Merchants',      children: ['Onboarding', 'Active', 'Past Due', 'Cancelled'] },
  { parent: 'MedRevolve/🤝 Partners',       children: ['Applications', 'Active', 'Issues'] },
  { parent: 'MedRevolve/🎨 Creators',       children: ['Applications', 'Active'] },
  { parent: 'MedRevolve/🏥 Patients',       children: ['Intakes', 'Appointments', 'Prescriptions'] },
  { parent: 'MedRevolve/💳 Payments',       children: ['Successful', 'Failed', 'Refunds'] },
  { parent: 'MedRevolve/⚠️ Compliance',     children: ['Flagged', 'Resolved'] },
  { parent: 'MedRevolve/🔬 Competitors',    children: ['Intelligence', 'Outreach'] },
  { parent: 'MedRevolve/🤖 Automations',    children: ['Sent', 'Errors'] },
  { parent: 'MedRevolve/📋 Action Required', children: [] },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    // Fetch existing labels
    const existingRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', { headers });
    const existingData = await existingRes.json();
    const existingLabels = existingData.labels || [];
    const existingMap = {}; // name → id
    existingLabels.forEach(l => { existingMap[l.name] = l.id; });
    console.log(`Found ${existingLabels.length} existing labels`);

    const createLabel = async (name) => {
      if (existingMap[name]) {
        console.log(`Label already exists: ${name} → ${existingMap[name]}`);
        return existingMap[name];
      }
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(`Failed to create label "${name}":`, JSON.stringify(data));
        return null;
      }
      existingMap[name] = data.id;
      console.log(`✅ Created label: ${name} → ${data.id}`);
      return data.id;
    };

    const createdLabels = {};

    // Create all labels in order (parent first, then children)
    for (const { parent, children } of LABEL_TREE) {
      const parentId = await createLabel(parent);
      if (parentId) createdLabels[parent] = parentId;

      for (const child of children) {
        const fullName = `${parent}/${child}`;
        const childId = await createLabel(fullName);
        if (childId) createdLabels[fullName] = childId;
      }
    }

    // Also update Drive folder structure — add Merchants and Competitors subfolders
    try {
      const { accessToken: driveToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
      const driveHeaders = { Authorization: `Bearer ${driveToken}`, 'Content-Type': 'application/json' };

      const createDriveFolder = async (name, parentId = null) => {
        const meta = { name, mimeType: 'application/vnd.google-apps.folder' };
        if (parentId) meta.parents = [parentId];
        const r = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST', headers: driveHeaders, body: JSON.stringify(meta),
        });
        const d = await r.json();
        if (!r.ok) { console.error('Drive folder error:', JSON.stringify(d)); return null; }
        return d.id;
      };

      // Get root
      let rootFolder = await base44.asServiceRole.entities.DriveFolder.filter({ name: 'MedRevolve', parent_id: null });
      let rootId = rootFolder[0]?.folder_id;

      if (!rootId) {
        rootId = await createDriveFolder('MedRevolve');
        await base44.asServiceRole.entities.DriveFolder.create({ name: 'MedRevolve', folder_id: rootId, parent_id: null, path: 'MedRevolve' });
        console.log('Created MedRevolve root Drive folder');
      }

      const newSubfolders = ['Merchants', 'Competitors', 'Leads', 'Payments', 'Compliance', 'Partners', 'Creators'];
      for (const name of newSubfolders) {
        const exists = await base44.asServiceRole.entities.DriveFolder.filter({ name, parent_id: rootId });
        if (exists.length === 0) {
          const fid = await createDriveFolder(name, rootId);
          if (fid) {
            await base44.asServiceRole.entities.DriveFolder.create({ name, folder_id: fid, parent_id: rootId, path: `MedRevolve/${name}` });
            console.log(`✅ Created Drive subfolder: MedRevolve/${name}`);
          }
        } else {
          console.log(`Drive subfolder already exists: MedRevolve/${name}`);
        }
      }
    } catch (driveErr) {
      console.error('Drive folder update failed (non-blocking):', driveErr.message);
    }

    return Response.json({
      success: true,
      labels_created: Object.keys(createdLabels).length,
      labels: createdLabels,
      message: 'Gmail label taxonomy + Drive folders set up successfully',
    });

  } catch (error) {
    console.error('setupGmailLabels error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});