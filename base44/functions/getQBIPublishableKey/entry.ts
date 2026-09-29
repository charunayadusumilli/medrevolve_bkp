import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

Deno.serve(async (req) => {
  try {
    const tokenizationKey = Deno.env.get("QBI_TOKENIZATION_KEY");

    if (!tokenizationKey) {
      return Response.json({
        error: 'QBI tokenization key not configured. Add QBI_TOKENIZATION_KEY in Settings → Secrets.'
      }, { status: 500 });
    }

    return Response.json({
      publishableKey: tokenizationKey,
      // Production tokenization script URL
      scriptUrl: 'https://tokenization.qbigateway.com/tokenization/v0.2'
    });
  } catch (error) {
    console.error('Error getting QBI publishable key:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});