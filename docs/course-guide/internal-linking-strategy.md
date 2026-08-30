# Internal Linking Strategy — Golf Course Pages

Last updated: 2026-04-22

---

## Purpose

This document maps every internal linking opportunity for the ~160 tourist-facing golf course pages being built under `/golf-courses/[region]/[slug]/`. The goal is 3–5 meaningful links per course page (2–3 minimum), distributed across outbound links FROM course pages and inbound links TO course pages from elsewhere on the site.

---

## 1. What's Already There (Don't Re-add)

The `CoursePage` component (`components/golf-courses/CoursePage.tsx`) already places these links on every course detail page:

| Link | Placement | Anchor text |
|---|---|---|
| `/golf-course-club-rental` | Sidebar CTA + footer card | "Rent Premium Golf Clubs" |
| `/golf-club-rental` | Footer card | "Indoor Club Rental" |
| `/second-hand-golf-clubs-bangkok` | Footer card | "Second-Hand Golf Clubs" |
| `/golf` | Footer card | "Simulator Bay Rates" |
| `/lessons` | Footer card | "Golf Lessons" |

These 5 links require no action. All new opportunities below are additive.

---

## 2. The Primary Outbound Link: Golf in Thailand Guide

**Every single course page should include an in-prose contextual link to `/golf-in-thailand-guide/`.**

This page is the site's master planning hub and is the single highest-value destination for the intent of someone reading a course guide page. It covers planning, booking, travel logistics, and on-the-ground tips — exactly what someone researching a Thailand golf trip needs next.

**Placement:** Within the `overview` or `location_and_access` prose section.

**Anchor text options (rotate by context):**
- "planning a golf trip to Thailand" → `/golf-in-thailand-guide/`
- "Thailand golf trip planning guide" → `/golf-in-thailand-guide/`
- "first-time golfers visiting Thailand" → `/golf-in-thailand-guide/`

**Target:** 100% of course pages (all ~160).

---

## 3. Outbound Links by Course Region

Each course page should contextually link to its own **region index page** and, where useful, the **hub page**.

| Region | Region index link | Notes |
|---|---|---|
| Bangkok | `/golf-courses/bangkok/` | "Bangkok golf courses" in location/overview section |
| Pattaya & Eastern Seaboard | `/golf-courses/pattaya/` | "Pattaya golf courses" or "Eastern Seaboard courses" |
| Hua Hin & Pranburi | `/golf-courses/hua-hin/` | "Hua Hin golf" — add when region publishes |
| Phuket | `/golf-courses/phuket/` | "Phuket golf courses" — add when region publishes |
| Khao Yai | `/golf-courses/khao-yai/` | "Khao Yai golf" — add when region publishes |
| Chiang Mai & North | `/golf-courses/chiang-mai/` | — |
| All other regions | `/golf-courses/` | Link to hub until region index exists |

**Anchor text:** Use the region name naturally in the `location_and_access` prose section — e.g., "one of the most-played [Bangkok golf courses](/golf-courses/bangkok/)".

**Target:** 100% of course pages.

---

## 4. Outbound Links to FAQ / Cost / Guide Pages

These are the highest-leverage contextual links. Match the link to the course content:

### 4a. Green Fee / Cost Links (all courses)

Every course page shows a green fee. Link to the relevant cost guide from the prose or sidebar:

| Course condition | Target page | Suggested anchor text |
|---|---|---|
| Has a stated weekday green fee | `/cost/how-much-does-golf-cost-bangkok` | "Thailand green fee guide" |
| Mentions caddie or cart costs | `/cost/golf-lesson-prices-bangkok` | — |
| Any fee discussion in prose | `/faq/how-much-does-indoor-golf-cost-in-bangkok` | "how much golf costs in Thailand" |

**Practical rule:** Add one fee-related contextual link per course page, in the `tips` or `overview` prose section. `/cost/how-much-does-golf-cost-bangkok` is the default target; swap for more specific pages when the prose naturally mentions lessons or rentals.

**Target:** 100% of course pages (all ~160).

### 4b. Club Rental Links (courses where `club_rental_available = true`)

When the course data confirms club rental is available at the course, the prose `rental_cta_context` section already sets this up. Add a secondary link to LENGOLF's competing service:

| Scenario | Target page | Anchor text |
|---|---|---|
| Course has on-site rentals | `/golf-course-club-rental` | "premium club delivery" or "rent clubs delivered to the course" |
| Course has no on-site rental | `/golf-course-club-rental` | "arrange club delivery before you arrive" |
| Visitor from Bangkok | `/faq/can-i-rent-golf-clubs-in-bangkok` | "renting golf clubs in Bangkok" |

**Target:** All courses (rental CTA already present in sidebar; add a second prose link for courses where it's contextually natural — estimate 80% of courses).

### 4c. "Should I bring my clubs?" Links (destination courses)

Courses outside Bangkok (Phuket, Hua Hin, Chiang Mai, Pattaya, Khao Yai) are typically reached by flight or long drive. In the `location_and_access` or `tips` section, link to:

- `/faq/should-i-bring-golf-clubs-to-thailand-or-rent` — "whether to bring or rent clubs"
- `/faq/cost-to-fly-with-golf-clubs-to-thailand` — "flying with golf clubs to Thailand"

**Target:** All non-Bangkok courses (~100 courses).

### 4d. Beginner / First-Timer Links (resort and accessible courses)

For courses described in the prose as beginner-friendly, resort-style, or welcoming to casual players:

- `/faq/can-beginners-play-golf-simulators` — contextually weak; skip
- `/faq/do-i-need-experience-to-play-golf-simulator` — too simulator-focused; skip
- **Better:** `/golf-in-thailand-guide/` — "first-time golfer planning a Thailand trip"

### 4e. Rainy Season / Weather Links (all courses)

Thai golf is weather-sensitive. In the `tips` or `location_and_access` section for any course that mentions weather, monsoon, or peak season:

- `/faq/can-you-play-golf-in-bangkok-when-it-rains` — for Bangkok-area courses
- Any explainer guide on Thailand golf weather (e.g., `/guide/golf-weather-in-thailand`) — check `data/explainer-pages.ts` for the exact slug

**Target:** Courses in Bangkok, Pattaya, Hua Hin (~40% will have weather context in prose).

---

## 5. Outbound Links to Location Pages (Bangkok Courses Only)

Bangkok has 14 published location pages (`/location/indoor-golf-[neighborhood]`) that target golfers staying near each BTS stop. Course pages for Bangkok-area venues can link to the nearest LENGOLF location page with language like "warm up at our simulator in [neighbourhood]".

| Bangkok course (by driving proximity to Bangkok centre) | Suggested location page link |
|---|---|
| Alpine Golf Club (Pathum Thani — North) | `/location/indoor-golf-ari`, `/location/indoor-golf-phaya-thai` |
| Nikanti Golf Club (Nonthaburi — NW) | `/location/indoor-golf-ari` |
| Lam Luk Ka Country Club (Pathum Thani — NE) | `/location/indoor-golf-phaya-thai`, `/location/indoor-golf-ari` |
| Thai Country Club (Chachoengsao — SE) | `/location/indoor-golf-asok`, `/location/indoor-golf-ekkamai` |
| Thana City Golf (Samut Prakan — SE) | `/location/indoor-golf-asok`, `/location/indoor-golf-ekkamai` |
| Suwan Golf (Pathum Thani — NE) | `/location/indoor-golf-phaya-thai` |
| Panya Indra (Minburi — E) | `/location/indoor-golf-ekkamai`, `/location/indoor-golf-thong-lo` |
| Krungthep Kreetha (Huamark — E) | `/location/indoor-golf-ekkamai` |
| Royal Gems / RG City (Nakhon Pathom — W) | `/location/indoor-golf-silom`, `/location/indoor-golf-siam` |
| Summit Windmill (Bangna — SE) | `/location/indoor-golf-asok`, `/location/indoor-golf-sukhumvit` |
| Phoenix Gold (Bangna — SE) | `/location/indoor-golf-asok`, `/location/indoor-golf-sukhumvit` |

**Anchor text pattern:** "The nearest LENGOLF simulator is in [neighbourhood] — [15 min by BTS from Asok](/location/indoor-golf-asok/)"

**For Phase 2 Bangkok courses:** Apply the same proximity logic (use `latitude`/`longitude` and `drive_time_from_bangkok_min` from course data to assign the closest 1–2 location pages).

**Target:** All Bangkok-region courses (~70 courses).

---

## 6. Outbound Links to Lessons Page

The lessons page (`/lessons/`) targets golfers who want coaching alongside playing real courses. Add a contextual link in course pages where the prose mentions:

- A course with a golf academy or pro shop
- A course described as good for improving / technique-focused
- A course that is challenging / recommended for experienced golfers (flip: "sharpen your game at LENGOLF before your round")

**Anchor text:** "private lesson before your round" → `/lessons/`

The `CoursePage` footer already has a lessons card, but an in-prose link in the `tips` section adds a second touchpoint.

**Target:** ~50% of courses (30 Bangkok, 20 Pattaya/Hua Hin — wherever prose has a "skill level" angle).

---

## 7. Cross-Course Links (Within Same Region)

Each course page should reference 2–3 sibling courses in the same region by name and link. This is the strongest "explore more" signal for SEO and user navigation.

**Where to add:** At the end of the `overview` or `layout_and_experience` section, or as a dedicated "You might also like" row below the prose (component update required).

**Rules for selecting sibling links:**

| Rule | Example |
|---|---|
| Same region, different price tier | From a luxury course (฿฿฿฿) → link 1 mid-range (฿฿฿) and 1 budget (฿฿) option in same region |
| Same region, different course type | Resort 36-hole → link to championship 18-hole and accessible par-3 in region |
| Same region, different location within province | Pathum Thani cluster → link other Pathum Thani courses |
| Designer-based | Jack Nicklaus–designed → link other Nicklaus courses in Thailand |
| Same "drive from Bangkok" window | 60–90 min corridor → cluster of courses in that drive band |

**Published cross-links to add now (17 live courses):**

**Bangkok courses — add cross-links to each other:**
Each of the 11 Bangkok courses should link to 2–3 of the others. Priority pairings:

1. Alpine Golf Club ↔ Nikanti Golf Club (both premium, Pathum Thani corridor)
2. Summit Windmill ↔ Phoenix Gold ↔ Thana City (Bangna/South Bangkok cluster)
3. Thai Country Club ↔ Royal Gems (Eastern corridor, similar drive time)
4. Lam Luk Ka ↔ Suwan Golf ↔ Panya Indra (North/Northeast corridor)
5. Krungthep Kreetha — link to Panya Indra (closest geographically)

**Pattaya courses — add cross-links to each other:**
Each of the 6 Pattaya courses should link to 2–3 of the others:

1. Siam CC Old Course ↔ Siam CC Plantation (same club, different experience)
2. Laem Chabang ↔ Burapha (both championship-grade, mid-range pricing)
3. Chee Chan ↔ Burapha (hillside resort pair)
4. Amata Spring — link to Laem Chabang and Siam CC Old (comparable prestige)

**As new regions publish:** Apply same logic — every new course links to the 2–3 most contextually related courses that are already published.

---

## 8. Inbound Links TO Course Pages (FROM Elsewhere on the Site)

These links need to be added to existing site pages as courses are published. This is where `/golf-in-thailand-guide/` becomes especially important.

### 8a. Golf in Thailand Guide (`/golf-in-thailand-guide/`) — DONE (2026-04-22)

The guide page has been updated with the following `/golf-courses/` links:

- 5 featured course rows in the "Courses worth putting on your list" section now link directly to their course pages: Black Mountain → `/golf-courses/hua-hin/black-mountain-golf-club`, Pineapple Valley (formerly Banyan) → `/golf-courses/hua-hin/pineapple-valley-golf-club`, Nikanti → `/golf-courses/bangkok/nikanti-golf-club`, Alpine → `/golf-courses/bangkok/alpine-golf-club`, Thai Country Club → `/golf-courses/bangkok/thai-country-club`.
- The former "Full guide: best golf courses near Bangkok" link has been replaced with two links: "Browse all Bangkok courses" → `/golf-courses/bangkok/` and "All {totalCourses} Thailand courses" → `/golf-courses/` (the count is derived from REGION_META at render time, so it tracks the corpus automatically - it read 149 when this was written and 148 since the 2026-08-30 duplicate-course merge).
- 7 new HubCards added to the Stage 1 Plan grid linking to `/golf-courses/` (hub) and 6 region pages: bangkok, pattaya, hua-hin, phuket, chiang-mai, khao-yai.

This creates full reciprocal linking with the outbound links added to course pages (section 2).

### 8b. FAQ Pages — Add "See also" links to relevant courses

| FAQ page | Courses to link |
|---|---|
| `/faq/can-i-rent-golf-clubs-in-bangkok` | All Bangkok courses with `club_rental_available = true` |
| `/faq/should-i-bring-golf-clubs-to-thailand-or-rent` | 2–3 flagship courses in Phuket, Hua Hin, Chiang Mai |
| `/faq/where-to-play-golf-at-night-in-bangkok` | Bangkok courses with floodlit / late opening hours |
| `/faq/how-much-does-indoor-golf-cost-in-bangkok` | Mention `/golf-courses/bangkok/` as real-course alternative |

### 8c. Cost / Price Guide Pages

| Cost page | Courses to link |
|---|---|
| `/cost/how-much-does-golf-cost-bangkok` | 3–5 Bangkok courses across price tiers (budget, mid, premium) |
| `/cost/cost-of-renting-golf-clubs-bangkok` | All Bangkok courses where rental is a relevant decision |

### 8d. Explainer / Guide Pages

| Guide page | Courses to link |
|---|---|
| Any guide about Black Mountain Hua Hin | `/golf-courses/hua-hin/black-mountain-golf-club` (when published) |
| Guide about golf in Chiang Mai | `/golf-courses/chiang-mai/alpine-golf-resort-chiang-mai` (when published) |
| Guide about golfing in Phuket | `/golf-courses/phuket/red-mountain-golf-club` (when published) |
| Guide about golf near Bangkok | `/golf-courses/bangkok/` region index |

### 8e. Blog Posts

When blog posts are published about golf travel, course reviews, or destination guides, include a contextual link to the relevant course page(s). No structural change required — editorial linking per post.

### 8f. Location Pages

The 14 Bangkok location pages (`/location/indoor-golf-[neighbourhood]/`) can each link to 1–2 nearby Bangkok golf courses with language like "If you're planning a round at [Alpine Golf Club](/golf-courses/bangkok/alpine-golf-club/), drop into our [Ari simulator](/location/indoor-golf-ari/) for a warm-up session."

| Location page | Bangkok courses to link |
|---|---|
| `/location/indoor-golf-ari` | Alpine Golf Club, Nikanti Golf Club |
| `/location/indoor-golf-phaya-thai` | Alpine Golf Club, Lam Luk Ka, Suwan Golf |
| `/location/indoor-golf-ekkamai` | Panya Indra, Krungthep Kreetha |
| `/location/indoor-golf-thong-lo` | Panya Indra, Thai Country Club |
| `/location/indoor-golf-asok` | Summit Windmill, Phoenix Gold, Thana City |
| `/location/indoor-golf-sukhumvit` | Summit Windmill, Phoenix Gold |
| `/location/indoor-golf-silom` | Royal Gems, Krungthep Kreetha |
| `/location/indoor-golf-siam` | Royal Gems, Thai Country Club |
| Others | Add as Phase 2 Bangkok courses publish |

---

## 9. Summary: Minimum Link Checklist Per Course Page

Use this as a per-course QA checklist when publishing each batch:

| # | Link target | Applies to | Placement |
|---|---|---|---|
| 1 | `/golf-in-thailand-guide/` | ALL courses | Prose (overview or location section) |
| 2 | `/golf-courses/[region]/` | ALL courses | Prose (location section) |
| 3 | Cross-course sibling #1 (same region) | ALL courses | Prose (overview or separate "also in this region" block) |
| 4 | Cross-course sibling #2 (same region) | ALL courses | Prose |
| 5 | `/cost/how-much-does-golf-cost-bangkok` OR relevant cost page | ALL courses | Prose (tips or fees section) |
| 6 | Location page (nearest BTS neighbourhood) | Bangkok courses only | Prose (location section) |
| 7 | `/faq/should-i-bring-golf-clubs-to-thailand-or-rent` | Non-Bangkok courses | Prose (tips section) |
| 8 | `/lessons/` (in-prose, second touchpoint) | ~50% — courses with skill/challenge angle | Prose (tips section) |

**Minimum to ship:** Items 1–4 = 4 links per course (2 structural + 2 cross-course). Items 5–8 are additive based on context.

---

## 10. Per-Region Targeting Quick Reference

| Region | Structural links (all courses) | Contextual add-ons |
|---|---|---|
| Bangkok (70 courses) | `/golf-in-thailand-guide/`, `/golf-courses/bangkok/`, 2 sibling courses | Nearest location page, cost guide |
| Pattaya (28 courses) | `/golf-in-thailand-guide/`, `/golf-courses/pattaya/`, 2 sibling courses | Club fly/rent FAQ, weather FAQ |
| Hua Hin (18 courses) | `/golf-in-thailand-guide/`, `/golf-courses/hua-hin/`, 2 sibling courses | Club fly/rent FAQ, Black Mountain guide link |
| Phuket (9 courses) | `/golf-in-thailand-guide/`, `/golf-courses/phuket/`, 2 sibling courses | Club fly/rent FAQ, Phuket guide link |
| Khao Yai (9 courses) | `/golf-in-thailand-guide/`, `/golf-courses/khao-yai/`, 2 sibling courses | Day-trip from Bangkok angle |
| Chiang Mai (16 courses) | `/golf-in-thailand-guide/`, `/golf-courses/chiang-mai/`, 2 sibling courses | Club fly/rent FAQ, highland weather note |
| Kanchanaburi (8 courses) | `/golf-in-thailand-guide/`, `/golf-courses/kanchanaburi/`, 2 sibling courses | Day-trip / weekend break angle |
| Chiang Rai (6 courses) | `/golf-in-thailand-guide/`, `/golf-courses/chiang-rai/`, 2 sibling courses | Club fly/rent FAQ |
| Smaller regions (each <5 courses) | `/golf-in-thailand-guide/`, `/golf-courses/`, 1–2 sibling courses | Region-specific travel context |

---

## 11. Implementation Notes for the Pipeline

When Stage 2 (enrich) prose is written for each course, the agent should be prompted to:

1. Include a natural mention of the region index (e.g., "Browse all [Bangkok golf courses](/golf-courses/bangkok/)") in the `location_and_access` section.
2. Include a natural mention of the guide (e.g., "For first-timers planning a golf trip, see our [Thailand golf guide](/golf-in-thailand-guide/)") in the `overview` section.
3. Name-drop 2 sibling courses from the same region in the `overview` or `layout_and_experience` section, with links.

This keeps the links editorially natural rather than mechanically appended.

**For the Stage 4 review:** Verify that items 1–3 above are present. If prose was written without them, add contextual sentences as part of the approval edit.

---

## 12. "More [Region] Courses" Section — IMPLEMENTED (2026-04-22)

The `RelatedCourses` concept has been implemented as a prop-driven section in `CoursePage.tsx`. Implementation details:

- `app/[locale]/golf-courses/[region]/[slug]/page.tsx` fetches all courses in the current region via `getCoursesByRegion`, filters out the current course, and passes up to 3 siblings as a `relatedCourses` prop to `CoursePage`.
- `CoursePage.tsx` renders a "More [Region] courses" section below the rental CTA banner when `relatedCourses.length > 0`. Each card links to `/golf-courses/[region]/[slug]`. A "View all →" link points to the region index.
- A "Plan Your Trip" sidebar card was also added (between the Facilities card and the rental nudge) with 3 fixed links: `/golf-in-thailand-guide`, `/cost/how-much-does-golf-cost-bangkok`, `/lessons`.
- The section is statically prop-driven (no client-side query); data comes from the same server-side `getCoursesByRegion` call used at build time.

This replaces the need to hard-code sibling links in prose for all published and future courses.

---

*This document should be updated each time a new batch publishes. Add region-specific pairings and flag any FAQ/cost/guide pages that become available as new targets.*
