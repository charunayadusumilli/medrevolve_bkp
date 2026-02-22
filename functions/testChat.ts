import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: 'Say hello in one sentence.',
      add_context_from_internet: false,
    });

    console.log('Response type:', typeof response);
    console.log('Response value:', JSON.stringify(response));

    return Response.json({ response, type: typeof response });
  } catch (err) {
    console.error('Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});