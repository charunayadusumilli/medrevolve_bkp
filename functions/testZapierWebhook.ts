Deno.serve(async (req) => {
  try {
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/26459574/uevpiil/';
    
    const payload = {
      form_type: "TestPing",
      name: "Test User",
      email: "test@test.com",
      timestamp: new Date().toISOString()
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    
    return Response.json({
      success: true,
      webhook_status: response.status,
      webhook_statusText: response.statusText,
      webhook_response: responseText,
      payload_sent: payload
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});