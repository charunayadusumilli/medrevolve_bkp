import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

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

    // Check if MedRevolve root already exists
    const existing = await base44.asServiceRole.entities.DriveFolder.filter({ name: 'MedRevolve', parent_id: null });
    let rootId;

    if (existing.length > 0) {
      rootId = existing[0].folder_id;
      console.log('MedRevolve root folder already exists:', rootId);
    } else {
      rootId = await createFolder('MedRevolve');
      await base44.asServiceRole.entities.DriveFolder.create({
        name: 'MedRevolve',
        folder_id: rootId,
        parent_id: null,
        path: 'MedRevolve',
      });
      console.log('Created MedRevolve root:', rootId);
    }

    const subfolders = [
      'Providers',
      'Pharmacies',
      'Patients',
      'Products',
      'Prescriptions',
      'Contracts',
      'Compliance',
      'Applications',
    ];

    const created = [];
    for (const name of subfolders) {
      const alreadyExists = await base44.asServiceRole.entities.DriveFolder.filter({ name, parent_id: rootId });
      if (alreadyExists.length > 0) {
        created.push({ name, folder_id: alreadyExists[0].folder_id, status: 'existing' });
        continue;
      }
      const folderId = await createFolder(name, rootId);
      await base44.asServiceRole.entities.DriveFolder.create({
        name,
        folder_id: folderId,
        parent_id: rootId,
        path: `MedRevolve/${name}`,
      });
      created.push({ name, folder_id: folderId, status: 'created' });
      console.log(`Created subfolder ${name}:`, folderId);
    }

    return Response.json({
      success: true,
      root: { name: 'MedRevolve', folder_id: rootId },
      subfolders: created,
    });
  } catch (error) {
    console.error('setupDriveFolders error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});