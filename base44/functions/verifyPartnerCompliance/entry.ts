import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

async function verifyLegitScript(businessName, licenseNumber) {
  const apiKey = Deno.env.get("LEGITSCRIPT_API_KEY");
  const apiUrl = Deno.env.get("LEGITSCRIPT_API_URL") || "https://api.legitscript.com/v1";
  
  if (!apiKey) {
    return {
      status: "pending",
      notes: "LegitScript API key not configured"
    };
  }

  try {
    const response = await fetch(`${apiUrl}/merchant/verify`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        business_name: businessName,
        license_number: licenseNumber
      })
    });

    if (!response.ok) {
      throw new Error(`LegitScript API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      status: data.verified ? "verified" : "failed",
      verification_id: data.verification_id,
      verified_date: new Date().toISOString(),
      classification: data.classification,
      notes: data.notes || ""
    };
  } catch (error) {
    console.error("LegitScript verification error:", error);
    return {
      status: "failed",
      notes: `Verification error: ${error.message}`
    };
  }
}

function calculateComplianceScore(complianceData) {
  let score = 0;
  let totalChecks = 0;

  // License verification (20 points)
  if (complianceData.license_verification?.status === "verified") score += 20;
  totalChecks += 20;

  // LegitScript verification (15 points)
  if (complianceData.legitscript_verification?.status === "verified") score += 15;
  else if (complianceData.legitscript_verification?.status === "not_applicable") score += 15;
  totalChecks += 15;

  // Insurance (15 points)
  if (complianceData.insurance_verification?.status === "verified") score += 15;
  totalChecks += 15;

  // Background check (15 points)
  if (complianceData.background_check?.status === "cleared") score += 15;
  else if (complianceData.background_check?.status === "not_required") score += 15;
  totalChecks += 15;

  // HIPAA compliance (20 points)
  if (complianceData.hipaa_compliance?.status === "compliant") score += 20;
  totalChecks += 20;

  // State compliance (15 points)
  if (complianceData.state_compliance && complianceData.state_compliance.length > 0) {
    const compliantStates = complianceData.state_compliance.filter(s => s.status === "compliant").length;
    score += (compliantStates / complianceData.state_compliance.length) * 15;
  }
  totalChecks += 15;

  return Math.round((score / totalChecks) * 100);
}

function determineOverallStatus(complianceScore, alerts) {
  const criticalAlerts = alerts?.filter(a => a.severity === "critical" && !a.resolved) || [];
  
  if (criticalAlerts.length > 0) {
    return "non_compliant";
  }
  
  if (complianceScore >= 80) {
    return "compliant";
  } else if (complianceScore >= 60) {
    return "under_review";
  } else {
    return "non_compliant";
  }
}

function generateAlerts(partner, complianceData) {
  const alerts = [];
  const now = new Date();

  // Check license expiration
  if (complianceData.license_verification?.expiration_date) {
    const expirationDate = new Date(complianceData.license_verification.expiration_date);
    const daysUntilExpiration = Math.floor((expirationDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) {
      alerts.push({
        severity: "critical",
        message: "License has expired",
        created_date: now.toISOString(),
        resolved: false
      });
    } else if (daysUntilExpiration < 30) {
      alerts.push({
        severity: "high",
        message: `License expires in ${daysUntilExpiration} days`,
        created_date: now.toISOString(),
        resolved: false
      });
    }
  }

  // Check insurance expiration
  if (complianceData.insurance_verification?.expiration_date) {
    const expirationDate = new Date(complianceData.insurance_verification.expiration_date);
    const daysUntilExpiration = Math.floor((expirationDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) {
      alerts.push({
        severity: "critical",
        message: "Insurance has expired",
        created_date: now.toISOString(),
        resolved: false
      });
    } else if (daysUntilExpiration < 30) {
      alerts.push({
        severity: "high",
        message: `Insurance expires in ${daysUntilExpiration} days`,
        created_date: now.toISOString(),
        resolved: false
      });
    }
  }

  // Check HIPAA BAA
  if (partner.partner_type !== "creator" && !complianceData.hipaa_compliance?.baa_signed) {
    alerts.push({
      severity: "high",
      message: "HIPAA Business Associate Agreement not signed",
      created_date: now.toISOString(),
      resolved: false
    });
  }

  // Check pending documents
  const pendingDocs = complianceData.required_documents?.filter(d => d.status === "pending" || d.status === "rejected") || [];
  if (pendingDocs.length > 0) {
    alerts.push({
      severity: "medium",
      message: `${pendingDocs.length} document(s) require attention`,
      created_date: now.toISOString(),
      resolved: false
    });
  }

  return alerts;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    
    const { partner_id, partner_type } = payload;

    if (!partner_id || !partner_type) {
      return Response.json({ error: "partner_id and partner_type required" }, { status: 400 });
    }

    // Fetch partner data based on type
    let partner;
    let businessName;
    let licenseNumber;
    let states = [];

    if (partner_type === "pharmacy") {
      const contracts = await base44.asServiceRole.entities.PharmacyContract.filter({ id: partner_id });
      if (!contracts || contracts.length === 0) {
        return Response.json({ error: "Pharmacy contract not found" }, { status: 404 });
      }
      partner = contracts[0];
      businessName = partner.pharmacy_name;
      licenseNumber = partner.license_number;
      states = partner.states_serviced || [];
    } else if (partner_type === "provider") {
      const contracts = await base44.asServiceRole.entities.ProviderContract.filter({ id: partner_id });
      if (!contracts || contracts.length === 0) {
        return Response.json({ error: "Provider contract not found" }, { status: 404 });
      }
      partner = contracts[0];
      businessName = partner.provider_name;
      licenseNumber = partner.license_number;
      states = partner.states_licensed || [];
    } else if (partner_type === "partner") {
      const partners = await base44.asServiceRole.entities.Partner.filter({ id: partner_id });
      if (!partners || partners.length === 0) {
        return Response.json({ error: "Partner not found" }, { status: 404 });
      }
      partner = partners[0];
      businessName = partner.business_name;
      licenseNumber = null;
      states = [];
    } else {
      return Response.json({ error: "Invalid partner_type" }, { status: 400 });
    }

    // Verify with LegitScript
    const legitscriptResult = await verifyLegitScript(businessName, licenseNumber);

    // Build compliance data
    const complianceData = {
      partner_id,
      partner_type,
      partner_name: businessName,
      license_verification: {
        status: licenseNumber ? "pending" : "not_applicable",
        notes: licenseNumber ? "License verification pending manual review" : "No license required"
      },
      legitscript_verification: legitscriptResult,
      insurance_verification: {
        status: "pending",
        notes: "Insurance verification pending"
      },
      background_check: {
        status: partner_type === "creator" ? "not_required" : "pending",
        notes: partner_type === "creator" ? "Not required for creators" : "Background check pending"
      },
      hipaa_compliance: {
        status: "pending",
        training_completed: false,
        baa_signed: false
      },
      state_compliance: states.map(state => ({
        state,
        status: "pending",
        requirements: ["License verification", "State registration"],
        verified_date: null
      })),
      required_documents: [],
      last_verification_date: new Date().toISOString(),
      next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
    };

    // Generate alerts
    complianceData.alerts = generateAlerts({ partner_type }, complianceData);

    // Calculate score
    complianceData.compliance_score = calculateComplianceScore(complianceData);

    // Determine overall status
    complianceData.overall_status = determineOverallStatus(complianceData.compliance_score, complianceData.alerts);

    // Check if compliance record exists
    const existingCompliance = await base44.asServiceRole.entities.PartnerCompliance.filter({ partner_id });

    let complianceRecord;
    if (existingCompliance && existingCompliance.length > 0) {
      // Update existing record
      complianceRecord = await base44.asServiceRole.entities.PartnerCompliance.update(
        existingCompliance[0].id,
        complianceData
      );
    } else {
      // Create new record
      complianceRecord = await base44.asServiceRole.entities.PartnerCompliance.create(complianceData);
    }

    // Send notification if non-compliant
    if (complianceData.overall_status === "non_compliant") {
      const adminEmail = Deno.env.get("ADMIN_EMAIL");
      if (adminEmail) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: "MedRevolve Compliance",
          to: adminEmail,
          subject: `🚨 Compliance Alert: ${businessName}`,
          body: `
            <h2>Non-Compliant Partner Detected</h2>
            <p><strong>Partner:</strong> ${businessName}</p>
            <p><strong>Type:</strong> ${partner_type}</p>
            <p><strong>Compliance Score:</strong> ${complianceData.compliance_score}/100</p>
            <p><strong>Status:</strong> ${complianceData.overall_status}</p>
            <hr>
            <h3>Critical Alerts:</h3>
            <ul>
              ${complianceData.alerts.filter(a => !a.resolved).map(a => `<li>[${a.severity.toUpperCase()}] ${a.message}</li>`).join('')}
            </ul>
            <p>Please review this partner's compliance status immediately.</p>
          `
        });
      }
    }

    return Response.json({
      success: true,
      compliance_record: complianceRecord,
      message: `Compliance verification completed for ${businessName}`
    });

  } catch (error) {
    console.error("Compliance verification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});