# Requirements Roadmap
## MedRevolve Knowledge Portal Bot v2.0
**Status:** Product Requirements | **Date:** Feb 2026 | **Audience:** Product & Engineering Teams

---

## 1. Feature Requirements

### 1.1 Core Chat Capabilities

#### R1.1: Multi-Persona Chatbot
- **Description:** AI assistant adapts communication style based on persona (Wellness Concierge, Treatment Advisor, Provider Support, etc)
- **Scope:** 
  - 10+ personas already defined in chatConfig.js
  - Each persona has tone, role, visual styling, audience target
  - Automatically selected based on page context
- **Acceptance Criteria:**
  - ✓ Persona selection is automatic per page
  - ✓ Tone + tone are evident in responses (varied sentence structure, no repetition)
  - ✓ Visual styling (avatar, gradient, FAB color) reflects persona
  - ✓ User perceives different "character" when switching pages
- **Priority:** HIGH
- **Effort:** 2 days (mostly refactoring existing code)

---

#### R1.2: Context-Aware Knowledge Retrieval (RAG)
- **Description:** AI retrieves relevant articles, products, FAQs from knowledge base before answering
- **Scope:**
  - Integrate Pinecone vector DB
  - Embed all Products, KnowledgeArticles, Provider bios
  - Search for top-3 relevant sources per query
  - Display source attribution in response
- **Acceptance Criteria:**
  - ✓ User asks about "semaglutide" → retrieves semaglutide product + 2 relevant articles
  - ✓ Retrieval accuracy > 85% (measured on test queries)
  - ✓ Source links clickable, attribution visible
  - ✓ RAG queries return within 500ms
- **Priority:** HIGH
- **Effort:** 1 week
- **Dependencies:** Pinecone account + API key

---

#### R1.3: Smart FAQ Suggestions
- **Description:** Contextual FAQ chips appear based on page + conversation topic
- **Scope:**
  - Use FAQ_BY_AUDIENCE from chatConfig (10-15 FAQs per audience)
  - Filter by page context (Products page shows treatment FAQs, etc)
  - Show top 4-6 most relevant FAQs as clickable chips
  - Refresh after each AI response
- **Acceptance Criteria:**
  - ✓ FAQs are relevant to current page
  - ✓ FAQs change based on conversation flow
  - ✓ Click FAQ = auto-populates input + sends
  - ✓ No repetition of same FAQ twice in row
- **Priority:** MEDIUM
- **Effort:** 2 days
- **Dependencies:** None (already have FAQ data)

---

### 1.2 Voice Capabilities

#### R2.1: Voice-to-Text Transcription
- **Description:** User speaks → speech converted to text → processed as normal message
- **Scope:**
  - Use Web Speech API for real-time transcription
  - Fallback to Twilio for advanced telephony
  - Support 5+ languages
  - Show transcript confidence score
- **Acceptance Criteria:**
  - ✓ Transcription accuracy > 90%
  - ✓ Works in Chrome, Safari, Firefox
  - ✓ Latency < 2 seconds
  - ✓ Error handling if no microphone permission
- **Priority:** HIGH
- **Effort:** 3 days
- **Dependencies:** Twilio account + SDK

---

#### R2.2: Text-to-Speech Response
- **Description:** AI responses are read aloud to user
- **Scope:**
  - Use browser native speechSynthesis API
  - Fallback to Twilio TTS for mobile
  - Strip markdown for natural speech
  - Support multiple voice options
- **Acceptance Criteria:**
  - ✓ Response audio plays immediately after AI responds
  - ✓ Natural-sounding voice (prefer female for warmth)
  - ✓ User can pause/resume playback
  - ✓ Works on mobile + desktop
- **Priority:** MEDIUM
- **Effort:** 2 days
- **Dependencies:** None

---

#### R2.3: Full Voice Call Experience
- **Description:** Seamless voice conversation loop (listen → speak → AI responds → repeat)
- **Scope:**
  - Full-screen video call overlay with persona avatar
  - Real-time transcription + response generation
  - Automatic speaking indicator (sound wave animation)
  - Pause/mute controls
  - One-click exit to chat
- **Acceptance Criteria:**
  - ✓ User can initiate voice call from FAB button
  - ✓ Seamless listen → respond loop (no "click to start listening" each time)
  - ✓ Avatar animates when AI is speaking
  - ✓ Sound wave visualization shows audio activity
  - ✓ Call duration tracked for analytics
- **Priority:** HIGH
- **Effort:** 1 week
- **Dependencies:** Web Speech API + Twilio

---

### 1.3 Safety & Clinical Guardrails

#### R3.1: Escalation Detection
- **Description:** AI automatically detects when conversation needs human provider
- **Scope:**
  - Detect clinical red flags (chest pain, severe symptoms, allergic reactions)
  - Detect off-topic requests
  - Detect mental health crises
  - Detect when user explicitly requests human
- **Acceptance Criteria:**
  - ✓ Escalation accuracy > 98% (no missed critical cases)
  - ✓ False positive rate < 5% (avoid unnecessary escalations)
  - ✓ Clinical words (e.g., "chest pain") always escalate
  - ✓ Non-clinical off-topic (e.g., "write me code") handled gracefully
- **Priority:** CRITICAL
- **Effort:** 2 weeks (including testing + refinement)
- **Dependencies:** Claude API for safety classification

---

#### R3.2: Human Escalation Workflow
- **Description:** When escalation triggered, hand off to provider + notify user
- **Scope:**
  - Create EscalationQueue entity
  - Auto-assign to available provider (optional)
  - Send notification to provider dashboard
  - User sees "Provider connecting..." message + wait estimate
  - Session marked as "escalated" in logs
- **Acceptance Criteria:**
  - ✓ Escalation created within 1 second of trigger
  - ✓ Provider notified in real-time
  - ✓ User sees clear handoff message (not confusing)
  - ✓ Escalation reason logged for compliance
- **Priority:** CRITICAL
- **Effort:** 1 week
- **Dependencies:** Provider notification system

---

#### R3.3: Response Safety Checking
- **Description:** Before sending AI response, verify it's clinically appropriate
- **Scope:**
  - Check for specific medication dosages (red flag)
  - Check for medical diagnosis language (red flag)
  - Flag if response sounds like medical advice
  - Append disclaimer if needed ("Not medical advice...")
- **Acceptance Criteria:**
  - ✓ AI never recommends specific dosages
  - ✓ AI never diagnoses conditions
  - ✓ Disclaimers appear when appropriate
  - ✓ > 95% of responses pass safety check
- **Priority:** HIGH
- **Effort:** 3 days
- **Dependencies:** Claude safety features

---

### 1.4 Knowledge Management

#### R4.1: Knowledge Base Sync
- **Description:** Keep vector DB in sync with Product, Article, Provider catalogs
- **Scope:**
  - Daily cron job syncs all entities to Pinecone
  - Embed using text-embedding-3-large
  - Track sync timestamp + hash to avoid duplicate processing
  - Handle deletions + updates
- **Acceptance Criteria:**
  - ✓ New products appear in RAG within 24 hours
  - ✓ Updated articles reflect new content
  - ✓ Deletions removed from index
  - ✓ Zero data loss or duplicates
- **Priority:** MEDIUM
- **Effort:** 3 days
- **Dependencies:** Pinecone API

---

#### R4.2: Conversation Logging & Analytics
- **Description:** Every message logged for compliance, analytics, improvement
- **Scope:**
  - ChatSession entity tracks conversation metadata
  - ChatMessage entity logs each message + AI response + sources used
  - Track safety flags, escalations, persona used
  - Anonymize PHI for non-compliance queries
- **Acceptance Criteria:**
  - ✓ 100% of messages logged (no loss)
  - ✓ Logs retain for 7 years (compliance)
  - ✓ User can request deletion (GDPR)
  - ✓ Logs encrypted at rest
- **Priority:** HIGH
- **Effort:** 1 week
- **Dependencies:** Base44 DB entities

---

### 1.5 Analytics & Insights

#### R5.1: Daily Analytics Roll-up
- **Description:** Generate daily metrics on chat usage, user satisfaction, escalation rate
- **Scope:**
  - Total messages, sessions, avg session duration
  - Escalation rate + top escalation reasons
  - User satisfaction score (post-session rating)
  - Top topics discussed
  - Most-used personas
- **Acceptance Criteria:**
  - ✓ Dashboard shows accurate numbers
  - ✓ Trends visible over time
  - ✓ Drill-down to individual conversations (admin only)
- **Priority:** MEDIUM
- **Effort:** 1 week
- **Dependencies:** ChatAnalytics entity

---

#### R5.2: Conversation Quality Metrics
- **Description:** Measure relevance, accuracy, safety of AI responses
- **Scope:**
  - Track user feedback (thumbs up/down on each response)
  - Measure RAG source relevance (manual review + scoring)
  - Monitor for hallucinations + misinformation
  - Track escalation appropriateness
- **Acceptance Criteria:**
  - ✓ User satisfaction > 4.5/5 stars
  - ✓ RAG relevance > 85%
  - ✓ Zero critical errors per 1000 messages
- **Priority:** MEDIUM
- **Effort:** 2 weeks (ongoing)
- **Dependencies:** User feedback UI + analytics pipeline

---

## 2. Entity Requirements

### 2.1 New Entities to Create

#### **ChatSession**
```json
{
  "id": "UUID",
  "user_email": "string (optional)",
  "created_date": "timestamp",
  "persona_key": "string enum",
  "page_context": "string",
  "status": "enum: active | archived | escalated",
  "message_count": "integer",
  "contains_pii": "boolean",
  "escalation_reason": "string (optional)",
  "escalated_to_provider_id": "string (optional)",
  "conversation_summary": "string (AI-generated)",
  "user_satisfaction": "float 0-5 (optional)"
}
```

#### **ChatMessage**
```json
{
  "id": "UUID",
  "session_id": "FK: ChatSession",
  "role": "enum: user | assistant",
  "content": "string",
  "content_type": "enum: text | voice_transcript | image",
  "file_urls": "array of strings",
  "sources_used": "array of FK: KnowledgeArticle",
  "safety_flags": "array of strings",
  "timestamp": "timestamp",
  "voice_metadata": {
    "duration_seconds": "integer",
    "confidence_score": "float 0-1",
    "language": "string"
  }
}
```

#### **KnowledgeArticle**
```json
{
  "id": "UUID",
  "title": "string",
  "category": "enum: product | treatment | provider | faq | guide",
  "content": "string (markdown)",
  "treatment_ids": "array FK: Product",
  "tags": "array of strings",
  "embedding_vector": "array of floats (for RAG)",
  "last_updated": "timestamp",
  "author": "string",
  "version": "integer"
}
```

#### **EscalationQueue**
```json
{
  "id": "UUID",
  "session_id": "FK: ChatSession",
  "reason": "enum: clinical_concern | off_topic | user_request | safety_flag",
  "priority": "enum: low | medium | high | critical",
  "status": "enum: pending | assigned | in_progress | resolved",
  "assigned_to": "FK: Provider (optional)",
  "assigned_at": "timestamp (optional)",
  "resolved_at": "timestamp (optional)",
  "notes": "string"
}
```

#### **ChatAnalytics**
```json
{
  "id": "UUID",
  "date": "date",
  "total_sessions": "integer",
  "total_messages": "integer",
  "avg_session_duration_seconds": "integer",
  "escalation_rate": "float 0-1",
  "top_topics": "array of strings",
  "top_personas": "array of objects",
  "user_satisfaction_avg": "float 0-5"
}
```

### 2.2 Modified Entities

**ChatLog** (existing)
- Add: `session_id` (FK: ChatSession)
- Add: `safety_flags` (array)
- Add: `sources_used` (array of FK: KnowledgeArticle)

---

## 3. Backend Function Requirements

### 3.1 Conversation Management

**Function: `chatConversation`**
```
Input:
  - session_id (string, optional)
  - message (string)
  - user_email (string, optional)
  - page_context (string)
  - persona_key (string)
  - conversation_history (array)
  - file_urls (array, optional)
  - is_voice_mode (boolean, optional)

Output:
  - response_text (string)
  - sources (array with title + link)
  - safety_flags (array)
  - suggested_next_steps (array)
  - voice_audio_url (string, optional)
  - session_id (string)

Requirements:
  - Retrieve top-3 sources via RAG
  - Inject RAG context into system prompt
  - Call LLM with streaming enabled
  - Validate response for safety (no specific dosages, etc)
  - Log message + metadata to ChatMessage entity
  - Return response within 2 seconds
```

**Function: `createChatSession`**
```
Input:
  - user_email (string, optional)
  - persona_key (string)
  - page_context (string)

Output:
  - session_id (string)
  - initial_greeting (string)
  - persona_info (object)

Requirements:
  - Create ChatSession record
  - Return empty message history
  - Set session expiry (24 hours)
```

---

### 3.2 RAG Pipeline

**Function: `retrieveKnowledge`**
```
Input:
  - query (string)
  - category_filter (array, optional)
  - limit (integer, default: 3)
  - page_context (string, optional)

Output:
  - articles (array of KnowledgeArticle)
  - confidence_scores (array of floats)

Requirements:
  - Embed query using text-embedding-3-large
  - Search Pinecone for similar vectors
  - Filter by page context if provided
  - Rank by relevance + recency
  - Return within 500ms
```

**Function: `syncKnowledgeBase`**
```
Input:
  - source_type (enum: products | providers | articles)
  - force_refresh (boolean, default: false)

Output:
  - sync_id (string)
  - records_synced (integer)
  - timestamp (timestamp)

Requirements:
  - Fetch all entities of type from Base44
  - Generate embeddings for each
  - Upsert into Pinecone (no duplicates)
  - Track sync for incremental updates
  - Run daily via cron
```

---

### 3.3 Safety & Escalation

**Function: `detectEscalationNeed`**
```
Input:
  - message (string)
  - session_history (array, optional)
  - user_email (string, optional)

Output:
  - should_escalate (boolean)
  - reason (string)
  - priority (enum: low | medium | high | critical)
  - suggested_action (string)

Requirements:
  - Use Claude's safety features + custom rules
  - Check for clinical red flags
  - Detect off-topic requests
  - Detect user's explicit "I want to talk to human"
  - Return within 1 second
  - Log decision to ChatMessage for audit
```

**Function: `createEscalation`**
```
Input:
  - session_id (string)
  - reason (string)
  - priority (enum)
  - preferred_provider_id (string, optional)

Output:
  - escalation_id (string)
  - assigned_provider (object, optional)
  - wait_time_estimate (string)

Requirements:
  - Create EscalationQueue record
  - Mark ChatSession as "escalated"
  - Notify provider (email + dashboard toast)
  - Notify admin if priority = critical
  - Set escalation timeout (1 hour)
```

---

### 3.4 Voice Integration

**Function: `initializeVoiceCall`**
```
Input:
  - session_id (string)
  - user_email (string, optional)

Output:
  - access_token (string)
  - room_name (string)
  - audio_stream_url (string)

Requirements:
  - Create Twilio video room
  - Generate access token (valid 1 hour)
  - Register audio stream handler
  - Mark session as "voice_mode"
```

**Function: `processVoiceTranscript`**
```
Input:
  - session_id (string)
  - audio_stream (binary or URL)

Output:
  - transcript (string)
  - confidence_score (float)
  - duration_seconds (integer)

Requirements:
  - Send to speech-to-text API
  - Extract transcript + confidence
  - Store as ChatMessage with voice_metadata
  - Return transcript to client for routing to chatConversation
```

---

### 3.5 Analytics

**Function: `logConversationEvent`**
```
Input:
  - session_id (string)
  - event_type (enum: message_sent | escalation | faq_clicked | voice_started)
  - metadata (object)

Output:
  - event_id (string)

Requirements:
  - Log to ChatMessage or dedicated event log
  - Update ChatSession message_count
  - Aggregate for daily analytics
```

**Function: `generateDailyAnalytics`**
```
Input:
  - date (date, optional, default: yesterday)

Output:
  - ChatAnalytics record with metrics

Requirements:
  - Count unique sessions
  - Sum messages
  - Calculate avg session duration
  - Calculate escalation rate
  - Extract top topics (word frequency from messages)
  - Calculate avg user satisfaction
  - Run daily via cron (1 AM UTC)
```

---

## 4. Frontend Component Requirements

### 4.1 Existing Components to Enhance

**AIAssistant.jsx**
- Add: RAG source display in bubbles
- Add: Safety banner when escalation triggered
- Add: Smart FAQ chip suggestions
- Add: Voice call button in header
- Enhance: Message input to support voice transcription

**ChatBubble.jsx**
- Add: Source links below response
- Add: "Helpful?" voting buttons
- Add: Copy response button

---

### 4.2 New Components to Create

**SourceAttribution.jsx** (Small component)
```
Props:
  - sources (array of articles)
  - show_confidence (boolean)

Display:
  - "Sources: Article 1, Article 2"
  - Click = open article in new tab
  - Show confidence score if requested
```

**SafetyBanner.jsx** (Inline component)
```
Props:
  - escalation_reason (string)
  - priority (enum)
  - wait_estimate (string)

Display:
  - Clear messaging: "Let me connect you with a provider"
  - Escalation reason
  - Estimated wait time
  - Cancel escalation option
```

**VoiceCallPanel.jsx** (Full-screen modal)
```
Props:
  - session_id (string)
  - persona_key (string)
  - on_end_call (callback)

Display:
  - Full-screen dark background (dark green gradient)
  - Large persona avatar + animated speaking indicator
  - Sound wave visualization when AI speaking
  - "Listening..." indicator when waiting for user input
  - Mic toggle + End call button (red)
  - Live transcript (optional)
```

**ContextualFAQChips.jsx** (Chip group)
```
Props:
  - faq_list (array)
  - on_faq_selected (callback)

Display:
  - 4-6 expandable chip buttons
  - Click = auto-populate input + send
  - Refresh after each AI response
  - No repetition of same FAQ
```

---

## 5. Non-Functional Requirements

### Performance
- Chat response time: < 1 second (p95)
- RAG retrieval: < 500ms
- Voice transcription: < 2 seconds
- Page load time: < 2 seconds

### Scalability
- Support 1,000+ concurrent sessions
- Handle 10M+ messages/month
- Support 100+ simultaneous voice calls
- Cost per interaction: < $0.002

### Security & Compliance
- HIPAA compliant (encryption, audit trails)
- GDPR compliant (right to be forgotten)
- No data loss (100% message logging)
- SOC 2 Type II (target)

### Reliability
- 99.9% uptime
- Zero escalation misses (safety critical)
- Zero data corruption
- Auto-recovery from LLM API failures

---

## 6. User Experience Requirements

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Voice-only mode support
- High contrast mode

### Mobile Experience
- Responsive design (mobile-first)
- Touch-friendly buttons (48px minimum)
- Optimized for low bandwidth
- Works offline for cached responses

### Internationalization
- Support 5+ languages
- Localized persona names + greetings
- Currency/date formatting per locale

---

## 7. Testing Requirements

### Unit Tests
- Prompt generation logic (10 test cases)
- Safety classifier accuracy (20 test cases)
- Escalation rules (15 test cases)

### Integration Tests
- LLM API integration (5 test cases)
- RAG retrieval (10 test cases)
- Voice transcription (5 test cases)

### E2E Tests
- Full chat flow (3 scenarios)
- Voice call flow (2 scenarios)
- Escalation workflow (3 scenarios)
- Analytics logging (1 scenario)

### Load Tests
- 1,000 concurrent sessions
- 100 messages/second throughput
- 100 concurrent voice calls

---

## 8. Success Metrics (KPIs)

### User Engagement
- Session duration: > 3 minutes (average)
- Messages per session: > 5
- Return user rate: > 60% (weekly)
- Voice call adoption: > 20% of users

### Clinical Safety
- Escalation accuracy: > 98%
- User satisfaction: > 4.5/5 stars
- Provider satisfaction: > 4.5/5 stars
- Zero critical errors per 100K messages

### Business Metrics
- Cost per interaction: < $0.002
- System uptime: > 99.9%
- RAG accuracy: > 85%
- NPS score: > 50

---

**END REQUIREMENTS ROADMAP**

See also: TECHNICAL-ARCHITECTURE.md and UI-UX-SPECIFICATION.md