# Technical Architecture Draft
## MedRevolve Knowledge Portal Bot v2.0
**Status:** Architecture Specification | **Date:** Feb 2026 | **Audience:** Engineering Team

---

## Executive Summary

This document outlines the technical architecture for upgrading MedRevolve's AI chatbot from a basic conversational assistant to a sophisticated **"Knowledge Portal Bot"** that rivals industry leaders like Hims Health Assistant and Ada Health's Clinical Decision Support system.

The system will maintain HIPAA compliance, support multi-user scenarios, leverage RAG (Retrieval-Augmented Generation), and provide clinical safety guardrails while delivering a premium patient experience.

---

## 1. System Overview

### 1.1 Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│   FRONTEND LAYER (React + Framer Motion)            │
│   ├─ Chat Interface (Web + Voice)                   │
│   ├─ Multi-Persona Dashboard                        │
│   └─ Context-Aware FAQ Discovery                    │
├─────────────────────────────────────────────────────┤
│   API ORCHESTRATION LAYER                           │
│   ├─ Conversation Manager (Session Routing)         │
│   ├─ RAG Pipeline Coordinator                       │
│   └─ Safety & Escalation Logic                      │
├─────────────────────────────────────────────────────┤
│   AI & KNOWLEDGE LAYER                              │
│   ├─ LLM Provider (Claude/GPT with streaming)       │
│   ├─ Vector DB (Pinecone/Weaviate for embeddings)  │
│   ├─ Knowledge Graph (Treatments, Providers, FAQs)  │
│   └─ Safety Classifier (Escalation Detection)       │
├─────────────────────────────────────────────────────┤
│   DATA PERSISTENCE LAYER                            │
│   ├─ Chat Logs (for compliance & analytics)         │
│   ├─ User Context Cache (Medical history, prefs)    │
│   ├─ Knowledge Index (Products, Articles, FAQs)     │
│   └─ Escalation Queue (Human handoff)               │
└─────────────────────────────────────────────────────┘
```

### 1.2 Core Components

| Component | Purpose | Technology |
|-----------|---------|-----------|
| Chat Engine | Real-time message routing, session management | Base44 SDK + WebSockets |
| RAG Pipeline | Context retrieval from knowledge base | LangChain + Vector DB |
| LLM Integration | Multi-model support, streaming responses | OpenAI/Anthropic API |
| Voice Handler | Speech-to-text, text-to-speech, voice call routing | Web Speech API + Twilio |
| Safety Layer | Clinical risk detection, escalation triggers | Custom ML classifier |
| Knowledge Graph | Structured product/provider/treatment data | Base44 Entities |
| Analytics Engine | Conversation tracking, usage metrics | Base44 Database |

---

## 2. Data Model & Entity Architecture

### 2.1 New Entities to Create

**ChatSession** - Represents a conversation thread
**ChatMessage** - Individual messages with metadata
**KnowledgeArticle** - Indexed content for RAG
**EscalationQueue** - Human handoff requests
**ChatAnalytics** - Daily metrics & insights

See Requirements Roadmap for detailed entity schemas.

---

## 3. Backend Functions (11 Core Functions)

### A. Conversation Management
- `chatConversation` - Main LLM + RAG handler
- `createChatSession` - Initialize new conversation

### B. RAG Pipeline  
- `retrieveKnowledge` - Vector search + ranking
- `syncKnowledgeBase` - Sync entities to vector DB

### C. Safety & Escalation
- `detectEscalationNeed` - Safety classifier
- `createEscalation` - Queue for human handoff

### D. Voice Integration
- `initializeVoiceCall` - Twilio setup
- `processVoiceTranscript` - Speech-to-text

### E. Analytics
- `logConversationEvent` - Event tracking
- `generateDailyAnalytics` - Rollup metrics
- `exportConversationSummary` - Clinical summary gen

---

## 4. Frontend Architecture

### 4.1 Enhanced AIAssistant Component

```
AIAssistant (refactored)
├─ ChatWindow (existing, enhanced)
│  ├─ MessageList + SourceAttribution
│  ├─ ContextualFAQChips (smart suggestions)
│  ├─ SafetyBanner (escalation notices)
│  └─ TextInput
├─ VoiceCallPanel (new full-screen modal)
├─ EscalationNotification (toast system)
└─ PersonaFAB (enhanced with voice button)
```

### 4.2 New Components
- **SourceAttribution.jsx** - Display RAG sources
- **SafetyBanner.jsx** - Escalation messaging
- **VoiceCallPanel.jsx** - Full voice interface
- **ContextualFAQChips.jsx** - Smart FAQ suggestions

---

## 5. LLM & Prompt Strategy

### 5.1 Prompt Architecture
```
System Prompt:
├─ Persona definition (from chatConfig)
├─ RAG context (injected dynamically)
├─ Safety boundaries (escalation rules)
├─ Page context (current page info)
└─ Output format (structured for parsing)
```

### 5.2 Model Strategy
- **Primary:** GPT-4 Turbo (best reasoning)
- **Fallback:** Claude 3.5 Sonnet (instruction following)
- **Budget:** GPT-4 Mini (simple queries)

---

## 6. Vector Database & RAG

### 6.1 Tech Stack
- **Vector DB:** Pinecone (SaaS, easiest deployment)
- **Embedding Model:** text-embedding-3-large (OpenAI, 3072 dims)
- **Framework:** LangChain for retrieval orchestration

### 6.2 Knowledge Index
```
Pinecone namespaces:
├─ products (Product catalog)
├─ articles (FAQs, guides)
├─ providers (Provider info)
├─ treatments (Mechanism, results)
└─ faqs (Page-specific FAQs)

Each with metadata:
├─ source_id, source_type
├─ title, category
├─ page_context
└─ updated_at
```

---

## 7. Safety & Compliance

### 7.1 Safety Classifier

**Triggers for escalation:**
- Clinical red flags (chest pain, severe symptoms)
- Off-topic requests (outside medical scope)
- User explicitly requests human
- Mental health crisis detected
- Billing/insurance questions
- Provider-specific questions

**Implementation:** Hybrid rules + Claude safety features

### 7.2 HIPAA Compliance
- ✓ TLS encryption in transit
- ✓ AES-256 encryption at rest
- ✓ User-based access control
- ✓ 7-year audit trail
- ✓ Right to be forgotten support

---

## 8. Deployment & Scaling

### 8.1 Infrastructure

| Component | Host | Tech |
|-----------|------|------|
| Frontend | Base44 Edge | React + Vite |
| Backend Functions | Deno Deploy | Deno + TypeScript |
| Vector DB | Pinecone Cloud | Managed |
| Chat Logs | Base44 DB | PostgreSQL |
| Voice | Twilio Cloud | SaaS |
| LLM | OpenAI/Anthropic | SaaS |

### 8.2 Performance Targets
- Response time: < 1 sec (p95)
- Message accuracy: > 95%
- Escalation accuracy: > 99%
- System uptime: > 99.9%
- RAG relevance: > 0.8
- Cost per 1000 interactions: < $2

---

## 9. Implementation Roadmap

**Phase 1 (Weeks 1-2):** Data model + RAG foundation
**Phase 2 (Weeks 3-4):** Safety & escalation system
**Phase 3 (Weeks 5-6):** Voice integration + advanced features
**Phase 4 (Weeks 7-8):** Analytics & performance optimization
**Phase 5 (Week 9+):** Beta testing & production launch

---

**END TECHNICAL ARCHITECTURE**

See also: REQUIREMENTS-ROADMAP.md and UI-UX-SPECIFICATION.md