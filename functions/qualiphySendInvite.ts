import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            exams,
            first_name,
            last_name,
            email,
            dob,
            phone_number,
            tele_state,
            webhook_url,
            additional_data,
            redirect_approve,
            redirect_reject,
            redirect_na,
            redirect_missed,
            address_line_1,
            address_line_2,
            city,
            state,
            zip_code,
            shipping_address_line_1,
            shipping_address_line_2,
            shipping_city,
            shipping_state,
            shipping_zip_code,
            gender
        } = body;

        if (!exams || !first_name || !last_name || !email || !dob || !phone_number || !tele_state) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const apiKey = Deno.env.get("QUALIPHY_API_KEY");

        const payload = {
            api_key: apiKey,
            exams,
            first_name,
            last_name,
            email,
            dob,
            phone_number,
            tele_state,
            ...(webhook_url && { webhook_url }),
            ...(additional_data && { additional_data }),
            ...(redirect_approve && { redirect_approve }),
            ...(redirect_reject && { redirect_reject }),
            ...(redirect_na && { redirect_na }),
            ...(redirect_missed && { redirect_missed }),
            ...(address_line_1 && { address_line_1 }),
            ...(address_line_2 && { address_line_2 }),
            ...(city && { city }),
            ...(state && { state }),
            ...(zip_code && { zip_code }),
            ...(shipping_address_line_1 && { shipping_address_line_1 }),
            ...(shipping_address_line_2 && { shipping_address_line_2 }),
            ...(shipping_city && { shipping_city }),
            ...(shipping_state && { shipping_state }),
            ...(shipping_zip_code && { shipping_zip_code }),
            ...(gender && { gender })
        };

        const response = await fetch("https://api.qualiphy.me/api/exam_invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Qualiphy exam invite response:", JSON.stringify(data));

        return Response.json(data);
    } catch (error) {
        console.error("qualiphySendInvite error:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
});