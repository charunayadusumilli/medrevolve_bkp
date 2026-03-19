import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { compliance_id, document_type, file_url, expiry_date } = await req.json();

    if (!compliance_id || !document_type || !file_url) {
      return Response.json({ 
        error: 'compliance_id, document_type, and file_url required' 
      }, { status: 400 });
    }

    // Get compliance record
    const record = await base44.asServiceRole.entities.ComplianceRecord.get(compliance_id);
    if (!record) {
      return Response.json({ error: 'Compliance record not found' }, { status: 404 });
    }

    // Update the document status
    const updatedDocs = (record.documents_required || []).map(doc => {
      if (doc.document_type === document_type) {
        return {
          ...doc,
          status: 'submitted',
          file_url,
          expiry_date: expiry_date || doc.expiry_date
        };
      }
      return doc;
    });

    const updated = await base44.asServiceRole.entities.ComplianceRecord.update(compliance_id, {
      documents_required: updatedDocs
    });

    return Response.json({
      success: true,
      compliance_record: updated,
      message: `Document "${document_type}" submitted successfully`
    });

  } catch (error) {
    console.error('Upload compliance document error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});