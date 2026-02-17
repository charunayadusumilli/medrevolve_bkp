import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const formData = await req.formData();
    
    const compliance_id = formData.get('compliance_id');
    const document_type = formData.get('document_type');
    const file = formData.get('file');
    const expiry_date = formData.get('expiry_date');

    if (!compliance_id || !document_type || !file) {
      return Response.json({ 
        error: 'compliance_id, document_type, and file required' 
      }, { status: 400 });
    }

    // Get compliance record
    const record = await base44.asServiceRole.entities.ComplianceRecord.get(compliance_id);
    if (!record) {
      return Response.json({ error: 'Compliance record not found' }, { status: 404 });
    }

    // Upload file to private storage
    const { file_uri } = await base44.asServiceRole.integrations.Core.UploadPrivateFile({ file });

    // Update the document status
    const updatedDocs = record.documents_required.map(doc => {
      if (doc.document_type === document_type) {
        return {
          ...doc,
          status: 'submitted',
          file_url: file_uri,
          expiry_date: expiry_date || doc.expiry_date
        };
      }
      return doc;
    });

    // Update compliance record
    const updated = await base44.asServiceRole.entities.ComplianceRecord.update(compliance_id, {
      documents_required: updatedDocs
    });

    return Response.json({
      success: true,
      file_uri,
      compliance_record: updated,
      message: `Document "${document_type}" uploaded successfully`
    });

  } catch (error) {
    console.error('Upload compliance document error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});