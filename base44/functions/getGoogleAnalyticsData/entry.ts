import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days')) || 7;

    // Get Google Analytics access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');

    // Get GA4 property ID (medrevolve.com typically has this)
    const propertyId = 'properties/443894885'; // GA4 property for medrevolve.com

    // Date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const formatDate = (d) => d.toISOString().split('T')[0];

    // Fetch daily active users from Google Analytics Data API v1
    const response = await fetch('https://analyticsdata.googleapis.com/v1beta/' + propertyId + ':runReport', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [
          {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          },
        ],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
        ],
        dimensions: [
          { name: 'date' },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GA API error:', data);
      throw new Error(`Google Analytics API error: ${data.error?.message || 'Unknown error'}`);
    }

    // Parse the response
    const dailyActiveUsers = [];
    if (data.rows) {
      data.rows.forEach((row) => {
        const date = row.dimensionValues[0].value;
        const activeUsers = parseInt(row.metricValues[0].value) || 0;
        const newUsers = parseInt(row.metricValues[1].value) || 0;
        const sessions = parseInt(row.metricValues[2].value) || 0;

        dailyActiveUsers.push({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: activeUsers,
          newUsers,
          sessions,
        });
      });
    }

    // Calculate summary stats
    const totalActiveUsers = dailyActiveUsers.reduce((sum, d) => sum + d.users, 0);
    const avgDAU = Math.round(totalActiveUsers / (dailyActiveUsers.length || 1));
    const peakDAU = Math.max(...dailyActiveUsers.map(d => d.users), 0);

    return Response.json({
      success: true,
      dailyActiveUsers,
      summary: {
        totalActiveUsers,
        avgDAU,
        peakDAU,
        daysReported: dailyActiveUsers.length,
      },
    });
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});