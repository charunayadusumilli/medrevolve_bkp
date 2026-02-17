import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ 
                error: 'Unauthorized - Admin access required' 
            }, { status: 403 });
        }

        const url = new URL(req.url);
        const days = parseInt(url.searchParams.get('days')) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get all analytics events
        const events = await base44.asServiceRole.entities.Analytics.filter({
            created_date: { $gte: startDate.toISOString() }
        }, '-created_date', 10000);

        // Calculate metrics
        const totalVisitors = new Set(events.map(e => e.session_id)).size;
        const totalPageViews = events.filter(e => e.event_type === 'page_view').length;
        
        // Page views by page
        const pageViews = {};
        events.filter(e => e.event_type === 'page_view').forEach(e => {
            pageViews[e.page_name] = (pageViews[e.page_name] || 0) + 1;
        });

        // Traffic sources
        const sources = {};
        events.forEach(e => {
            const source = e.referrer.includes('google') ? 'Google' 
                : e.referrer.includes('facebook') ? 'Facebook'
                : e.referrer.includes('instagram') ? 'Instagram'
                : e.referrer === 'direct' ? 'Direct'
                : 'Other';
            sources[source] = (sources[source] || 0) + 1;
        });

        // Top events by action
        const topActions = {};
        events.filter(e => e.action).forEach(e => {
            topActions[e.action] = (topActions[e.action] || 0) + 1;
        });

        // Daily trends
        const dailyViews = {};
        events.filter(e => e.event_type === 'page_view').forEach(e => {
            const date = new Date(e.created_date).toISOString().split('T')[0];
            dailyViews[date] = (dailyViews[date] || 0) + 1;
        });

        return Response.json({
            summary: {
                totalVisitors,
                totalPageViews,
                averagePageViewsPerVisitor: (totalPageViews / totalVisitors || 0).toFixed(2)
            },
            pageViews: Object.entries(pageViews)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10),
            sources: Object.entries(sources)
                .sort((a, b) => b[1] - a[1]),
            topActions: Object.entries(topActions)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10),
            dailyTrends: Object.entries(dailyViews)
                .sort((a, b) => a[0].localeCompare(b[0]))
        });
    } catch (error) {
        console.error('Error getting analytics:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});