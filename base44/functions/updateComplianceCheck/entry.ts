import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { compliance_id, check_type, status, notes } = await req.json();

    if (!compliance_id || !check_type || !status) {
      return Response.json({ 
        error: 'compliance_id, check_type, and status required' 
      }, { status: 400 });
    }

    // Get compliance record
    const record = await base44.asServiceRole.entities.ComplianceRecord.get(compliance_id);
    if (!record) {
      return Response.json({ error: 'Compliance record not found' }, { status: 404 });
    }

    // Update the specific check
    const updatedChecks = record.compliance_checks.map(check => {
      if (check.check_type === check_type) {
        return {
          ...check,
          status,
          checked_at: new Date().toISOString(),
          notes: notes || check.notes
        };
      }
      return check;
    });

    // Calculate overall compliance status
    const allPassed = updatedChecks.every(check => check.status === 'passed');
    const anyFailed = updatedChecks.some(check => check.status === 'failed');
    
    let complianceStatus = record.compliance_status;
    if (allPassed) {
      complianceStatus = 'compliant';
    } else if (anyFailed) {
      complianceStatus = 'non_compliant';
    } else {
      complianceStatus = 'in_review';
    }

    // Calculate risk score
    const passedCount = updatedChecks.filter(c => c.status === 'passed').length;
    const totalCount = updatedChecks.length;
    const riskScore = 100 - ((passedCount / totalCount) * 100);

    // Update compliance record
    const updated = await base44.asServiceRole.entities.ComplianceRecord.update(compliance_id, {
      compliance_checks: updatedChecks,
      compliance_status: complianceStatus,
      risk_score: Math.round(riskScore),
      verification_date: new Date().toISOString(),
      verified_by: user.email
    });

    return Response.json({
      success: true,
      compliance_record: updated,
      message: `Check "${check_type}" updated to ${status}`
    });

  } catch (error) {
    console.error('Update compliance check error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});