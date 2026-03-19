import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { 
            eventType, 
            pageName, 
            action, 
            metadata 
        } = await req.json();

        if (!eventType || !pageName) {
            return Response.json({ 
                error: 'Event type and page name required' 
            }, { status: 400 });
        }

        // Try to get current user (may fail during login flow)
        let userEmail = null;
        try {
            const isAuth = await base44.auth.isAuthenticated();
            if (isAuth) {
                const user = await base44.auth.me();
                userEmail = user?.email;
            }
        } catch {
            // User not logged in or in login flow — safe to ignore
        }

        // Get session ID from cookie or generate
        const cookies = req.headers.get('cookie') || '';
        let sessionId = cookies.match(/session_id=([^;]+)/)?.[1];
        
        if (!sessionId) {
            sessionId = crypto.randomUUID();
        }

        // Get referrer and user agent
        const referrer = req.headers.get('referer') || 'direct';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        // Create analytics record
        const analyticsRecord = await base44.asServiceRole.entities.Analytics.create({
            event_type: eventType,
            page_name: pageName,
            action: action || null,
            user_email: userEmail,
            session_id: sessionId,
            referrer: referrer,
            user_agent: userAgent,
            metadata: metadata || {}
        });

        // Send notifications for critical events
        const criticalEvents = ['booking', 'order', 'signup'];
        if (criticalEvents.includes(eventType)) {
            try {
                await base44.asServiceRole.functions.invoke('sendActivityNotification', {
                    eventType,
                    pageName,
                    userEmail,
                    action,
                    metadata,
                    severity: 'high'
                });
            } catch (notifyErr) {
                console.error('Notification send error:', notifyErr);
            }
        }

        return Response.json({ 
            success: true,
            sessionId: sessionId
        }, {
            headers: {
                'Set-Cookie': `session_id=${sessionId}; Path=/; Max-Age=86400; SameSite=Lax`
            }
        });
    } catch (error) {
        console.error('Error tracking event:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});