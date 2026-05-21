# MedRevolve · Social Media Brand Kit

> Everything in this folder is generated from the same brand tokens that
> drive the deployed `medrevolve.com` site — same moss / rust / spine /
> cream palette, same Fraunces serif headlines with italic rust accents,
> same JetBrains Mono editorial eyebrows.

---

## What's in the box

```
MedRevolve_Social_Brand_Kit/
├── 00-BRAND-SYSTEM.md            ← Brand bible. Read this first.
├── 01-COPY-BUNDLE.md              ← Per-channel about / bio / services / first-post copy.
├── 02-UPLOAD-CHECKLIST.md         ← Step-by-step platform setup instructions
├── logos/                          ← 4 SVG logo variants (master files, editable)
├── banners/
│   ├── facebook/                   ← cover + first-post share image + profile
│   ├── instagram/                  ← profile + 3 feed posts + story + 5 highlight covers
│   ├── linkedin/                   ← cover + post + profile
│   ├── twitter/                    ← cover + profile
│   └── youtube/                    ← banner + thumbnail + channel icon
└── png/                            ← PNG exports of all above (web-ready, RGB, 72dpi)
    ├── facebook/
    ├── instagram/
    ├── linkedin/
    ├── twitter/
    └── youtube/
```

---

## File naming & specs

All assets follow the format: `[platform]-[type]-[dimensions].[ext]`

### Facebook
- `facebook-profile-320x320.png` — circular, 1:1
- `facebook-cover-1640x856.png` — landscape, 1.91:1
- `facebook-firstpost-1200x628.png` — share image for initial post

### Instagram
- `instagram-profile-320x320.png` — circular, 1:1
- `instagram-feed-1080x1080.png` — square posts (3 variants)
- `instagram-story-1080x1920.png` — full-height story (5 variants)
- `instagram-highlight-1080x1080.png` — highlight covers (5 variants)

### LinkedIn
- `linkedin-profile-400x400.png` — company logo, 1:1
- `linkedin-cover-1500x500.png` — landscape header, 3:1
- `linkedin-post-1200x627.png` — share card for posts

### Twitter/X
- `twitter-profile-400x400.png` — profile pic, 1:1
- `twitter-header-1500x500.png` — header banner, 3:1

### YouTube
- `youtube-profile-400x400.png` — channel icon, 1:1
- `youtube-banner-2560x1440.png` — channel art, 16:9 (safe zone: center 1546×423px)
- `youtube-thumbnail-1280x720.png` — video thumbnail, 16:9

---

## Color palette

| Name | Use | Hex | RGB |
|------|-----|-----|-----|
| Cream | Background | #FDFBF7 | 253, 251, 247 |
| Spine (black) | Text, headlines | #0A0A0A | 10, 10, 10 |
| Moss (green) | Accent, buttons | #4A6741 | 74, 103, 65 |
| Rust (brown) | Italic accents | #8B6F47 | 139, 111, 71 |
| Compliance OK | Status (light green) | #D4E7D0 | 212, 231, 208 |
| Compliance flag | Status (light orange) | #F5E6D3 | 245, 230, 211 |

---

## Typography

### Headlines (Fraunces)
- Weight: 600–700 (bold)
- Style: Roman or Italic (rust accents in italics)
- Size: 32–64px (scale as needed)

### Body (Sans-serif, JetBrains Mono for tech)
- Weight: 400–500
- Size: 14–18px
- Line-height: 1.5–1.6

---

## Usage guidelines

### Do's ✓
- Use compliant color palette (no custom colors)
- Maintain 1:1 profile picture aspect ratio
- Test all banners on mobile before upload
- Keep MedRevolve logotype consistent
- Use moss green for compliance status (OK)
- Use rust brown for accents and italic text

### Don'ts ✗
- Don't stretch or distort logos
- Don't change brand colors to match platform aesthetics
- Don't remove compliance ledger from hero images
- Don't use consumer language (we're B2B)
- Don't edit SVG files without design knowledge
- Don't publish without verifying compliance messaging

---

## Platform-specific notes

### Facebook
- Mobile-safe zone (cover photo): center 820×312px
- Profile picture displays as circle
- Test cover on both desktop and mobile preview

### Instagram
- Stories auto-crop to 1080×1920, safe zone: center 1080×1350px
- Highlights: upload as square (1080×1080), will display as circles
- Feed posts: 1080×1080 for best quality
- Avoid text near edges (Instagram adds UI elements)

### LinkedIn
- Banner displays at 1500×500 on desktop, 1235×694 on mobile
- Logo should be at least 200×200px for clarity
- Company name appears next to profile picture in small space

### YouTube
- Channel banner safe zone: 1546×423px (center of 2560×1440)
- Mobile: 1235×694 safe zone
- Thumbnails: all text should be readable at 170×90px (small thumbnail size)
- Use high contrast for text

### Twitter/X
- Header photo displays at 1500×500 on desktop, 1500×284 on mobile
- Profile picture circles at 400×400
- Avoid critical content in outer edges

---

## Exporting from source files

If editing SVG masters in Illustrator or Figma:

1. **Export for web:** Use "Export for screens" (Figma) or "Asset export" (AI)
2. **PNG settings:** RGB color mode, 72dpi, no interlacing
3. **File size:** Aim for <500KB per image (platform upload limits)
4. **Naming:** Follow the pattern above
5. **Backup:** Keep SVG source files; PNG exports are for deployment only

---

## Updating the brand kit

When refreshing assets:
1. Update SVG master files first
2. Re-export all PNG variants
3. Test on each platform (upload preview, don't publish)
4. Update this README with new specs
5. Archive old assets (don't delete)

---

## Support & questions

For brand consistency questions, refer to:
- `00-BRAND-SYSTEM.md` — positioning, tone, audience
- `01-COPY-BUNDLE.md` — platform-specific messaging
- `02-UPLOAD-CHECKLIST.md` — deployment instructions

For visual changes, consult the deployed site at `medrevolve.com` for the source of truth on colors and typography.

---

## Last updated
May 2026

---

## Version notes

v1.0 — Initial launch kit (Facebook, Instagram, LinkedIn, YouTube, Twitter/X)
- 4 logo variants
- Platform-specific banners and profiles
- Comprehensive copy templates
- Compliance ledger integration on all hero assets