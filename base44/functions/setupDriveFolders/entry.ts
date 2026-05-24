/**
 * setupDriveFolders — Creates complete Google Drive folder structure
 * Run once to set up: MedRevolve root + all subfolders (Providers, Pharmacies, Patients, etc.)
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SUBFOLDER_NAMES = [
  'Providers',
  'Pharmacies',
  'Patients',
  'Products',
  'Prescriptions',
  'Contracts',
  'Compliance',
  'Applications',
  'Merchants',
  'Competitors',
  'Leads',
  'Payments',
  'Partners',
  'Creators',
  'Analytics',
  'SocialMedia',
  'Invoices',
  'Intakes',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    const createFolder = async (name, parentId = null) => {
      const meta = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
      };
      if (parentId) meta.parents = [parentId];

      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meta),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`Drive API error: ${JSON.stringify(data)}`);
      return data.id;
    };

    // Clear old records
    const existing = await base44.asServiceRole.entities.DriveFolder.filter({});
    for (const rec of existing) {
      await base44.asServiceRole.entities.DriveFolder.delete(rec.id);
    }
    console.log(`Cleared ${existing.length} old Drive folder records`);

    // Create root
    const rootId = await createFolder('MedRevolve');
    await base44.asServiceRole.entities.DriveFolder.create({
      name: 'MedRevolve',
      folder_id: rootId,
      parent_id: null,
      path: 'MedRevolve',
    });
    console.log('✅ Created MedRevolve root:', rootId);

    // Create subfolders
    const created = [];
    for (const name of SUBFOLDER_NAMES) {
      const folderId = await createFolder(name, rootId);
      await base44.asServiceRole.entities.DriveFolder.create({
        name,
        folder_id: folderId,
        parent_id: rootId,
        path: `MedRevolve/${name}`,
      });
      created.push({ name, folder_id: folderId });
      console.log(`✅ Created subfolder: MedRevolve/${name} → ${folderId}`);
    }

    return Response.json({
      success: true,
      root: { name: 'MedRevolve', folder_id: rootId },
      subfolders: created,
      message: `Created root + ${created.length} subfolders`,
    });
  } catch (error) {
    console.error('setupDriveFolders error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});