import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        // Only providers can submit prescriptions
        if (!user || user.role !== 'admin') {
            return Response.json({ 
                error: 'Unauthorized' 
            }, { status: 403 });
        }

        const { prescriptionId, pharmacyId } = await req.json();

        if (!prescriptionId) {
            return Response.json({ 
                error: 'Prescription ID required' 
            }, { status: 400 });
        }

        // Get prescription details
        const prescriptions = await base44.entities.Prescription.filter({
            id: prescriptionId
        });

        if (prescriptions.length === 0) {
            return Response.json({ 
                error: 'Prescription not found' 
            }, { status: 404 });
        }

        const prescription = prescriptions[0];

        // Get patient info
        const customerIntakes = await base44.asServiceRole.entities.CustomerIntake.filter({
            email: prescription.patient_email
        }, '-created_date', 1);

        if (customerIntakes.length === 0) {
            return Response.json({ 
                error: 'Customer info not found' 
            }, { status: 404 });
        }

        const customer = customerIntakes[0];

        // Get pharmacy contract
        const pharmacies = await base44.asServiceRole.entities.PharmacyContract.filter({
            status: 'active'
        }, '-created_date', 1);

        if (pharmacies.length === 0) {
            console.error('No active pharmacies available');
            return Response.json({ 
                error: 'No pharmacies available' 
            }, { status: 503 });
        }

        const pharmacy = pharmacyId 
            ? pharmacies.find(p => p.id === pharmacyId) 
            : pharmacies[0]; // Default to first active

        if (!pharmacy) {
            return Response.json({ 
                error: 'Pharmacy not found' 
            }, { status: 404 });
        }

        // Send prescription to pharmacy (email for now, API integration later)
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: pharmacy.contact_email,
            subject: `New Prescription - ${customer.full_name}`,
            body: `
                <h2>New Prescription to Fulfill</h2>
                
                <h3>Patient Information:</h3>
                <p><strong>Name:</strong> ${customer.full_name}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone || 'Not provided'}</p>
                <p><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state} ${customer.zip_code}</p>
                
                <h3>Prescription Details:</h3>
                <p><strong>Medication:</strong> ${prescription.medication_name}</p>
                <p><strong>Dosage:</strong> ${prescription.dosage}</p>
                <p><strong>Frequency:</strong> ${prescription.frequency}</p>
                <p><strong>Quantity:</strong> ${prescription.quantity}</p>
                <p><strong>Refills:</strong> ${prescription.refills}</p>
                <p><strong>Instructions:</strong> ${prescription.instructions || 'Standard'}</p>
                
                <p><strong>Rx Number:</strong> ${prescription.rx_number || 'To be assigned'}</p>
                
                <p>Please process and ship within 3-5 business days.</p>
            `
        });

        // Update prescription status
        await base44.entities.Prescription.update(prescriptionId, {
            status: 'pending',
            pharmacy_name: pharmacy.pharmacy_name
        });

        // Update pharmacy stats
        await base44.asServiceRole.entities.PharmacyContract.update(pharmacy.id, {
            total_prescriptions_filled: (pharmacy.total_prescriptions_filled || 0) + 1
        });

        // Notify patient
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: prescription.patient_email,
            subject: 'Your Prescription is Being Processed',
            body: `
                <h2>Prescription Sent to Pharmacy</h2>
                <p>Your prescription for <strong>${prescription.medication_name}</strong> has been sent to our partner pharmacy.</p>
                <p>You'll receive tracking information within 3-5 business days.</p>
                <p>Track your order in the Patient Portal.</p>
            `
        });

        console.log('Prescription submitted to pharmacy:', {
            prescriptionId,
            pharmacy: pharmacy.pharmacy_name,
            patient: prescription.patient_email
        });

        return Response.json({ 
            success: true,
            pharmacyId: pharmacy.id,
            estimatedFulfillmentDays: pharmacy.average_fulfillment_days || 3
        });
    } catch (error) {
        console.error('Error submitting prescription:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});