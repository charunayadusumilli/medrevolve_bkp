# UI/UX Specification
## MedRevolve Knowledge Portal Bot v2.0
**Status:** Design Specification | **Date:** Feb 2026 | **Audience:** Design & Product Teams

---

## 1. Design System & Visual Language

### 1.1 Existing Design System (from MedRevolve brand)

**Colors:**
- Primary: `#2D3A2D` (dark forest green)
- Primary Accent: `#4A6741` (medium green)
- Secondary: `#6B8F5E` (light green)
- Background: `#FDFBF7` (cream/off-white)
- Error: `#DC2626` (red)
- Success: `#059669` (green)

**Typography:**
- Headlines: Inter Bold (24-32px)
- Body: Inter Regular (14-16px)
- Small: Inter Regular (12px)
- Mono (code): Fira Code (12px)

**Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px

**Border Radius:** 12px (standard), 8px (small), 16px (large)

---

### 1.2 Design Tokens for Chatbot

```
Shadow (cards): 0 4px 12px rgba(0,0,0,0.08)
Shadow (elevated): 0 12px 24px rgba(0,0,0,0.15)

Transitions: 200ms ease-in-out (standard), 300ms (complex animations)

Z-index hierarchy:
  - FAB: 35
  - Chat window: 35
  - Voice call overlay: 100
  - Modal backdrops: 40
```

---

## 2. Chat Interface Layout

### 2.1 Chat Window Structure

```
┌─────────────────────────────────────┐
│  HEADER (Persona Info)              │  Height: 60px
│  ┌─ Avatar  ┌─ Name + Role          │
│  └─ Status  └─ "AI Assistant"       │
│             [Reset] [Voice] [Minimize] [Close]
├─────────────────────────────────────┤
│  MESSAGE LIST (scrollable)          │  Height: calc(100% - 240px)
│  ┌─ User Bubble (right, dark)       │
│  │   "How does semaglutide work?"   │
│  │   12:34 PM                        │
│  │                                   │
│  ├─ AI Bubble (left, white)         │
│  │   "Semaglutide is a GLP-1        │
│  │    agonist that..."              │
│  │   [Sources: Article 1, Article 2]│
│  │   👍 👎 📋 (vote buttons)          │
│  │   12:35 PM                        │
│  │                                   │
│  └─ FAQ Suggestion                  │
│     [Semaglutide...] [Tirzepatide.] │
│     [Pricing] [Book Appointment]    │
├─────────────────────────────────────┤
│  INPUT AREA                         │  Height: 80px
│  [Ask your Wellness Concierge...] [▶]│
│  ✓ Not medical advice • Not human   │
└─────────────────────────────────────┘
```

### 2.2 Detailed Component Specs

#### Header
- **Height:** 60px
- **Background:** Gradient from persona color (e.g., `#4A6741` → `#6B8F5E`)
- **Content:**
  - Left: Avatar (48px), Name (bold 14px), Role (gray 12px)
  - Right: Icon buttons (Reset, Voice, Minimize, Close)
  - Status indicator: Green pulsing dot + "AI Assistant"
- **Persona Indicator:** Small "AI" badge in corner

#### Message List
- **Spacing:** 12px between bubbles
- **Auto-scroll:** Smooth scroll to bottom on new message

**User Bubble:**
- Background: `#2D3A2D` (dark)
- Text: White
- Alignment: Right
- Border radius: 16px (rounded, sharp bottom-right)
- Padding: 12px 16px
- Max-width: 85%
- Show timestamp on hover

**AI Bubble:**
- Background: `#FFFFFF`
- Border: 1px `#E8E0D5`
- Text: `#2D3A2D`
- Alignment: Left
- Border radius: 16px (rounded, sharp bottom-left)
- Padding: 12px 16px
- Max-width: 82%
- Contains: Message + sources + action buttons

**Sources Strip (below AI bubble):**
```
Sources: [Article 1 (confidence: 0.92)] → [Article 2 (0.87)]
  - Clickable links
  - Confidence score (optional)
  - Flex layout, wraps on mobile
```

**Vote Buttons (below sources):**
```
👍 Helpful    👎 Not helpful    📋 Copy
  - Small, subtle styling
  - Hover: slight color change
  - Click feedback (haptic on mobile)
```

#### FAQ Suggestion Chips
- **Trigger:** Show after first AI response, then after every 2-3 responses
- **Layout:** Horizontal scrollable row
- **Chip Style:**
  - Background: `#F5F0E8`
  - Border: 1px `#E8E0D5`
  - Padding: 8px 12px
  - Border radius: 20px (fully rounded)
  - Font size: 13px
  - Max width: 150px (truncate with ellipsis)
- **Hover:** Light background shift
- **Click:** Populate input + auto-send
- **Filtering:** Show up to 6 most relevant, exclude repeated FAQs

#### Input Area
```
┌───────────────────────────────────┐
│ [🎤] [Ask your specialist...]  [▶] │ Height: 44px
├───────────────────────────────────┤
│ ✓ Not medical advice • Not human   │ Height: 20px
└───────────────────────────────────┘
```

- **Input field:**
  - Placeholder: "Ask your {persona}..."
  - Rounded: 20px
  - Padding: 12px 16px
  - Border: 1px `#E8E0D5`
  - Focus: Blue outline + slight lift
  - Multi-line support (max 3 lines visible)
  - Character limit: 2000

- **Microphone button:**
  - Left of input
  - Icon: Mic (lucide-react)
  - Click: Start listening
  - Hover: Slight background color
  - Recording state: Red pulsing dot

- **Send button:**
  - Right of input
  - Icon: Send arrow
  - Background: Persona gradient
  - Hover: Slightly darker
  - Disabled: Faded
  - Click feedback: Brief scale animation

- **Disclaimer:**
  - Font size: 11px
  - Color: `#999999`
  - Text: "🤖 AI Assistant · MedRevolve topics only · Not medical advice"

---

## 3. Voice Call Experience

### 3.1 Voice Call Overlay (Full Screen)

```
Background: Linear gradient (dark green to darker green)
  - from-[#1a2a1a] to [#4A6741]

┌─────────────────────────────────────────────────┐
│                                                 │
│          [Persona Avatar (200x200)]             │
│          Large animated avatar                  │
│          Pulsing ring when speaking             │
│                                                 │
│              Dr. Sarah Chen                     │
│              Treatment Specialist               │
│                                                 │
│     🎵 🎵 🎵 🎵 (Sound wave animation)           │
│         "Speaking..."                           │
│                                                 │
│         [🎤] [📞 (Red)]                         │
│          Mute    End Call                       │
│                                                 │
│      "Not medical advice · Tap mic to speak"   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3.2 Voice Call Components

**Avatar + Persona Info:**
- Large avatar: 200x200px with 4px white border
- Shadow: Drop shadow for depth
- Gradient background: Persona color
- Name: 20px bold below avatar
- Role: 14px gray below name
- Live indicator: Green pulsing dot in corner

**Sound Wave Visualization:**
- 5 vertical bars
- Animate up/down with audio frequency
- Color: Persona accent color
- Height range: 6px (baseline) to 20px (peak)
- Duration: 400ms per cycle
- Position: Center below role text

**Status Text:**
- "Speaking..." (cyan color)
- "Listening..." (red color with pulsing border)
- "Thinking..." (gray with spinner)
- "Tap mic to speak" (white/muted)

**Controls:**
- Mic toggle: 14px height, 60px width button
  - Normal: White/20 background, hover:30
  - Muted: Darker background, text "Muted"
- End call: 16px height, 60px width button
  - Background: Red (#DC2626)
  - Hover: Darker red

**Transcript Display (optional):**
- Below sound waves
- Max height: 200px, scrollable
- Font: 14px mono
- Background: `rgba(255,255,255,0.1)`
- Border radius: 12px
- Padding: 12px

---

## 4. Escalation & Safety UX

### 4.1 Escalation Triggered

**Safety Banner (appears inline in message list):**

```
┌─────────────────────────────────────────┐
│ ⚠️  Let me connect you with a provider   │
│                                         │
│  Reason: Clinical concern detected     │
│  Priority: High                        │
│  Estimated wait: 2-3 minutes           │
│                                         │
│  [Connecting...] [Cancel]              │
└─────────────────────────────────────────┘
```

- **Background:** Light red/orange (`#FEF3C7`)
- **Border:** 2px `#F59E0B`
- **Padding:** 16px
- **Border radius:** 12px
- **Icon:** Warning icon (⚠️)
- **Heading:** 14px bold, color `#92400E`
- **Details:** 12px gray

**Toast Notification (optional, for mobile):**
- Top right corner
- Dismissable
- 5 second timeout
- Icon: Alert icon
- Message: "Connecting you with a provider..."

### 4.2 Provider Connection States

**State 1: Searching**
```
"Connecting with an available provider..."
[Spinner animation] [Cancel]
```

**State 2: Found**
```
"Provider found: Dr. Sarah Chen"
"Specializing in weight loss"
[Accept] [Decline + suggest another]
```

**State 3: Transferring**
```
"Transferring to Dr. Chen..."
[Audio/Video call overlay appears]
```

---

## 5. Responsive Design (Mobile)

### 5.1 Mobile Breakpoints

**Small phones (< 375px):**
- Chat window: Full screen minus 12px margin
- Avatar: Reduced to 40px
- Font sizes: Reduced 1-2px
- Input: Single button (combine mic + send)

**Tablets (> 768px):**
- Chat window: 450px width, centered
- Enhanced readability
- Side-by-side layout for multi-panel views

### 5.2 Mobile-Specific Adjustments

- **Touch targets:** Minimum 44px for buttons
- **Input keyboard:** Auto-dismiss after send
- **Voice:** Always show transcript (helps with small screen)
- **Orientation:** Adapt to portrait/landscape
- **Haptic feedback:** Vibrate on send, escalation, voice start/stop

---

## 6. Color & Styling for Personas

### 6.1 Persona Color Mapping

```
wellness_concierge:        #4A6741 → #6B8F5E (green)
treatment_advisor:         #3B6B5A → #5A9E84 (teal)
consultation_coordinator:  #2563EB → #1D4ED8 (blue)
patient_support:           #0891B2 → #0E7490 (cyan)
provider_onboarding:       #0F766E → #0D9488 (dark teal)
creator_manager:           #7C3AED → #6D28D9 (purple)
partner_manager:           #D97706 → #B45309 (amber)
compliance_specialist:     #B91C1C → #991B1B (red)
```

Each persona:
- Header gradient
- FAB background
- Avatar accent
- Button hover color
- Toast background

---

## 7. Accessibility

### 7.1 WCAG 2.1 AA Compliance

- **Color contrast:** All text > 4.5:1 (normal), > 3:1 (large)
- **Focus indicators:** 2px blue outline, visible on all interactive elements
- **Keyboard navigation:** Tab through all elements in logical order
- **Screen reader:** All icons have aria-labels, regions labeled
- **Motion:** Reduced motion support (disable animations if `prefers-reduced-motion`)

### 7.2 Accessible Component Examples

```jsx
// Mic button
<button
  aria-label="Start recording voice message"
  aria-pressed={isRecording}
  className="...focus:outline-2 outline-blue-500..."
>
  <Mic className="w-4 h-4" aria-hidden="true" />
</button>

// Chat region
<div role="log" aria-live="polite" aria-label="Chat messages">
  {messages.map(msg => (
    <div key={msg.id} role="article">
      {msg.role === 'user' ? 'You' : 'Assistant'}: {msg.content}
    </div>
  ))}
</div>
```

---

## 8. Animation & Micro-interactions

### 8.1 Entrance Animations

**Chat window open:**
- Initial state: Scale 0.95, opacity 0
- Animate to: Scale 1, opacity 1
- Duration: 300ms, easing: ease-out

**New message appears:**
- Slide up from bottom + fade in
- Duration: 200ms

**FAQ chips expand:**
- Height: 0 → auto
- Opacity: 0 → 1
- Duration: 250ms

### 8.2 Hover & Click Feedback

**Button hover:** Slight scale (1.02) + color shift

**FAB pulse:** Subtle scale pulse every 2 seconds when closed

**Voice recording:** Pulsing red dot (scale 1 → 1.2 → 1)

**Message send:** Brief scale animation on button (0.95 → 1)

---

## 9. Dark Mode (Optional Future)

If dark mode is added:
- Background: `#0F172A` (very dark blue)
- Chat bubbles: User stays dark, AI becomes `#1E293B` (dark slate)
- Text: White / `#E2E8F0`
- Borders: Lighter (opacity 0.2)
- Persona headers: Maintain gradient, slight desaturation

---

## 10. Localization (i18n)

### 10.1 Multi-language Support

**Supported languages:** EN, ES, FR, DE, JA (at launch)

**Key strings to localize:**
- Persona names + roles
- Greeting messages
- Input placeholder: "Ask your {persona}..."
- Disclaimer text
- Escalation messages
- Voice states ("Speaking...", "Listening...")
- Button labels

**RTL Support (Arabic, Hebrew):**
- Message bubbles align correctly
- Input field layout flips
- Icons mirror where appropriate

---

## 11. Error States & Fallbacks

### 11.1 Error Scenarios

**Network error (message send fails):**
```
┌─────────────────────────────┐
│ ⚠️  Message failed to send   │
│ [Retry] [Discard]           │
└─────────────────────────────┘
```

**Voice transcription failed:**
```
"Sorry, I didn't catch that. Could you repeat?"
[Try again] [Type instead]
```

**LLM timeout (response takes > 5 seconds):**
```
"Still thinking... This is taking longer than usual."
[Wait] [Cancel]
```

**RAG unavailable (knowledge base offline):**
- Continue chat without sources
- Show banner: "Knowledge sources unavailable - information may be less accurate"

---

## 12. User Feedback Mechanisms

### 12.1 Post-Response Feedback

After each AI response:
```
👍 Helpful    👎 Not helpful    📋 Copy
```

Optional (after escalation or special events):
```
Rate this interaction:
⭐⭐⭐⭐⭐ (1-5 stars)
[Optional feedback text area]
```

---

## 13. Analytics & Metrics UI

**Admin dashboard additions:**
- Daily message volume chart
- Escalation rate trend
- User satisfaction gauge
- Top topics word cloud
- Response time histogram

---

## 14. Responsive Breakpoints Summary

| Breakpoint | Use Case |
|-----------|----------|
| < 375px | Small phones |
| 375-767px | Standard phones |
| 768-1024px | Tablets |
| > 1024px | Desktop |

Chat window widths:
- Mobile: 100% - 24px margin
- Tablet: 500px (centered)
- Desktop: 420px (fixed right side)

---

## 15. Component States & Variants

All components support states:
- **Default:** Standard appearance
- **Hover:** Slight color/shadow change
- **Active/Pressed:** Emphasized appearance
- **Disabled:** Faded, no cursor change
- **Loading:** Spinner or skeleton
- **Error:** Red border, error message
- **Focus:** Blue outline (keyboard nav)

---

## 16. File & Asset Organization

```
components/
├─ chat/
│  ├─ AIAssistant.jsx (refactored)
│  ├─ ChatWindow.jsx (new)
│  ├─ MessageBubble.jsx (enhanced)
│  ├─ SourceAttribution.jsx (new)
│  ├─ SafetyBanner.jsx (new)
│  ├─ ContextualFAQChips.jsx (new)
│  └─ VoiceCallPanel.jsx (new)
├─ ui/
│  └─ ... (existing components)
└─ specs/
   ├─ TECHNICAL-ARCHITECTURE.md
   ├─ REQUIREMENTS-ROADMAP.md
   └─ UI-UX-SPECIFICATION.md (this file)

assets/
└─ personas/
   ├─ wellness_concierge.svg
   ├─ treatment_advisor.svg
   └─ ... (10+ persona avatars)
```

---

**END UI/UX SPECIFICATION**

See also: TECHNICAL-ARCHITECTURE.md and REQUIREMENTS-ROADMAP.md

---

## Design Review Checklist

- [ ] All colors pass WCAG AA contrast ratio
- [ ] All interactive elements > 44px (mobile)
- [ ] Keyboard navigation fully functional
- [ ] Screen reader tested with NVDA/JAWS
- [ ] Mobile layout tested on real devices (iOS/Android)
- [ ] Animations smooth on 60Hz + high refresh rate displays
- [ ] Loading states prevent user confusion
- [ ] Error messages are clear and actionable
- [ ] Persona differentiation is clear visually
- [ ] Voice UI doesn't feel robotic or overwhelming