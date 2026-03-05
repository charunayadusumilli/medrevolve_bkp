import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiKey = Deno.env.get("QUALIPHY_API_KEY");

        const response = await fetch("https://api.qualiphy.me/api/exam_list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_key: apiKey })
        });

        const data = await response.json();
        console.log("Qualiphy exam list response:", JSON.stringify(data));

        return Response.json(data);
    } catch (error) {
        console.error("qualiphyGetExams error:", error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
});