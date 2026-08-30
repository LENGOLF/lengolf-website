# Golf Course Guide — Project Progress

Last updated: 2026-04-21 (Krabi batch added — all Phase 3 complete; 14 regions live)

---

## Overall goal

Build programmatic course pages for every tourist-facing golf course in Thailand (206 courses across 14 regions). Each page: 800–1,200 word guide, green fee data, Schema.org GolfCourse JSON-LD, LENGOLF club rental CTA.

Live URL pattern: `https://www.len.golf/golf-courses/[region]/[slug]/`

---

## Phase summary

| Phase | Courses | Regions | Status |
|---|---|---|---|
| Phase 1 | 34 | Bangkok, Pattaya, Hua Hin, Phuket, Khao Yai | Bangkok done · Pattaya done · Phuket done · rest pending |
| Phase 2 | 118 | All regions (deeper cuts) | Bangkok Batch 1 done (12/50) · Pattaya Batch 1 done (9/25) |
| Phase 3 | 35 | Niche / remote regions | Batch 1 published (2 courses — Rancho Charnvee/Khao Yai, Kabinburi/Pattaya); 2 skipped (Suranaree GC 9H+MIL) |
| Skip | 17 | Military, private members-only | — |

---

## Infrastructure — DONE

- [x] Pipeline design (`docs/course-guide/README.md`)
- [x] Agent prompts — Stages 1–5 (`docs/course-guide/agents/`)
- [x] Course schema definition (`docs/course-guide/data/course-schema.md`)
- [x] Master course list — 206 courses (`docs/course-guide/data/regions.md`)
- [x] Knowledge base (`docs/course-guide/knowledge/`)
- [x] `GolfCourse` TypeScript type (`types/golf-courses.ts`)
- [x] Data loader — `getCourseBySlug`, `getAllCourseParams`, `getCoursesByRegion` (`lib/golf-courses.ts`)
- [x] Publish script — JSON → TypeScript data files (`docs/course-guide/agents/5.publish.ts`)
- [x] Next.js page route — `/golf-courses/[region]/[slug]/` (`app/[locale]/golf-courses/[region]/[slug]/page.tsx`)
- [x] Page component — hero, stat strip, prose sections, sidebar (`components/golf-courses/CoursePage.tsx`)
- [x] Smoke tests — 3 Bangkok courses added to CI (`scripts/smoke-test.ts`)

---

## Bangkok batch — DONE (11 / 11 courses published)

Pipeline run: 2026-04-16

| # | Course | Pipeline status | Page live |
|---|---|---|---|
| 1 | Alpine Golf & Sports Club | approved | ✅ /golf-courses/bangkok/alpine-golf-club/ |
| 2 | Nikanti Golf Club | approved | ✅ /golf-courses/bangkok/nikanti-golf-club/ |
| 3 | Thai Country Club | approved (review_required) | ✅ /golf-courses/bangkok/thai-country-club/ |
| 4 | Thana City Golf & Sports Club | approved (review_required) | ✅ /golf-courses/bangkok/thana-city-golf-sports-club/ |
| 5 | Suwan Golf & Country Club | approved — weekend 5,200 THB all-in | ✅ /golf-courses/bangkok/suwan-golf-country-club/ |
| 6 | Lam Luk Ka Country Club | approved | ✅ /golf-courses/bangkok/lam-luk-ka-country-club/ |
| 7 | Panya Indra Golf Club | approved (review_required) | ✅ /golf-courses/bangkok/panya-indra-golf-club/ |
| 8 | Krungthep Kreetha Sports Club | approved | ✅ /golf-courses/bangkok/krungthep-kreetha-sports-club/ |
| 9 | The RG City Golf Club | approved (review_required) | ✅ /golf-courses/bangkok/royal-gems-golf-sports-club/ |
| 10 | Summit Windmill Golf Club | approved — weekday 3,000 / weekend 4,000 THB | ✅ /golf-courses/bangkok/summit-windmill-golf-club/ |
| 11 | Phoenix Gold Golf & Country Club | approved — weekend 3,500 THB | ✅ /golf-courses/bangkok/phoenix-gold-golf-country-club/ |

**Outstanding:** Phone verification and GPS coordinates for most courses — tracked in `data/data-gaps.md`.

---

## Pattaya batch — DONE (6 / 6 courses published)

Pipeline run: 2026-04-17

| # | Course | Pipeline status | Page live |
|---|---|---|---|
| 1 | Siam Country Club Old Course | approved | ✅ /golf-courses/pattaya/siam-country-club-old-course/ |
| 2 | Siam Country Club Plantation | approved (weekend fee estimate — see data-gaps) | ✅ /golf-courses/pattaya/siam-country-club-plantation/ |
| 3 | Burapha Golf & Resort | approved (phone missing — see data-gaps) | ✅ /golf-courses/pattaya/burapha-golf-club/ |
| 4 | Laem Chabang International Country Club | approved | ✅ /golf-courses/pattaya/laem-chabang-international/ |
| 5 | Chee Chan Golf Resort | approved | ✅ /golf-courses/pattaya/chee-chan-golf-resort/ |
| 6 | Amata Spring Country Club | approved (private club; null green fees) | ✅ /golf-courses/pattaya/amata-spring-country-club/ |

**Outstanding:** GPS coordinates approximate, club rental brands unconfirmed, Siam CC Plantation weekend fee estimated — all tracked in `data/data-gaps.md`.

---

## Hua Hin & Cha-am batch — DONE (11 / 11 courses published)

Pipeline run: 2026-04-18–19

| # | Course | Pipeline status | Page live |
|---|---|---|---|
| 1 | Black Mountain Golf Club | approved | ✅ /golf-courses/hua-hin/black-mountain-golf-club/ |
| 2 | Pineapple Valley Golf Club (formerly Banyan Golf Club) | approved | ✅ /golf-courses/hua-hin/pineapple-valley-golf-club/ |
| 3 | Springfield Royal Country Club | approved | ✅ /golf-courses/hua-hin/springfield-royal-country-club/ |
| 4 | Palm Hills Golf Club & Residence | approved (fee provisional — see data-gaps) | ✅ /golf-courses/hua-hin/palm-hills-golf-club/ |
| 5 | Majestic Creek Country Club | approved (fee provisional — see data-gaps) | ✅ /golf-courses/hua-hin/majestic-creek-country-club/ |

**Notes:** Springfield and Palm Hills are in Phetchaburi province (Cha-am area), not Prachuap Khiri Khan. All GPS coordinates approximate — tracked in `data/data-gaps.md`. Three green fees flagged for phone confirmation.

### Phase 2 Batch 1 — PUBLISHED (6 / 6 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Sea Pines Golf Resort | `sea-pines-golf-resort` | ✅ /golf-courses/hua-hin/sea-pines-golf-resort/ |
| 2 | Royal Hua Hin Golf Course | `royal-hua-hin-golf-course` | ✅ /golf-courses/hua-hin/royal-hua-hin-golf-course/ |
| 3 | Imperial Lake View Resort & Golf Club | `lake-view-resort-golf-club` | ✅ /golf-courses/hua-hin/lake-view-resort-golf-club/ |
| 4 | Hua Hin Korea Golf Club | `korea-golf-club-hua-hin` | ✅ /golf-courses/hua-hin/korea-golf-club-hua-hin/ |
| 5 | Sawang Resort & Golf Course | `sawang-resort-golf-course` | ✅ /golf-courses/hua-hin/sawang-resort-golf-course/ |
| 6 | Kaeng Krachan Country Club | `kaeng-krachan-country-club` | ✅ /golf-courses/hua-hin/kaeng-krachan-country-club/ |

**Region corrections:** Milford Golf Club (skip — duplicate of Korea GC same physical course), Royal Dusit (moved → Bangkok region, par 65 urban course under royal patronage), Treasure Hill (moved → Pattaya region, Chon Buri), Royal Hills (moved → Khao Yai region, Nakhon Nayok), Southern Hills (deleted — Hat Yai Songkhla, ~950 km south, hold for future Southern Thailand region). **Outstanding:** Korea GC all-in fee (800 THB confirmed; individual breakdown 400+300+500 provisional), Sawang caddie/cart inclusion unconfirmed, Kaeng Krachan open-to-public access to verify — all tracked in `data/data-gaps.md`.

---

## Phuket batch — DONE (5 / 5 courses published)

Pipeline run: 2026-04-19–20

| # | Course | Pipeline status | Page live |
|---|---|---|---|
| 1 | Red Mountain Golf Club | approved (high season fee TBC — see data-gaps) | ✅ /golf-courses/phuket/red-mountain-golf-club/ |
| 2 | Blue Canyon — Canyon Course | approved (high season fee TBC — see data-gaps) | ✅ /golf-courses/phuket/blue-canyon-canyon-course/ |
| 3 | Blue Canyon — Lakes Course | approved (high season fee TBC; caddie fee minor dispute resolved) | ✅ /golf-courses/phuket/blue-canyon-lakes-course/ |
| 4 | Loch Palm Golf Club | approved (high season fee TBC; year opened minor dispute resolved) | ✅ /golf-courses/phuket/loch-palm-golf-club/ |
| 5 | Laguna Golf Phuket | approved (designer dispute noted; both seasons confirmed) | ✅ /golf-courses/phuket/laguna-golf-phuket/ |

**Outstanding:** High season (Nov–Mar) green fees for courses 1–4 — tracked in `data/data-gaps.md`. GPS coordinates approximate for all 5. Google Maps URLs missing.

### Phase 2 Batch 1 — PUBLISHED (3 / 3 courses)

Pipeline run: 2026-04-20

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Mission Hills Phuket Golf Resort & Spa | `mission-hills-phuket` | ✅ /golf-courses/phuket/mission-hills-phuket/ |
| 2 | Phuket Country Club | `phuket-country-club` | ✅ /golf-courses/phuket/phuket-country-club/ |
| 3 | Aquella Golf & Country Club | `aquella-golf-country-club` | ✅ /golf-courses/phuket/aquella-golf-country-club/ |

**Notes:** Mission Hills is 18 holes only (not 36 — corrected from brief). Phuket CC opened 1989 (corrected from 1988). Aquella high-season GF ฿3,150 provisional (sourced from golfsavers). All three use Phuket seasonal pricing convention: `green_fee_weekday_thb` = low season (Apr–Oct), `green_fee_weekend_thb` = high season (Nov–Mar). Aquella province = Phang Nga (factually correct), region = phuket per pipeline. All GPS coordinates model estimates; Google Maps URLs not set. **Outstanding:** Aquella high-season GF confirmation (email booking@aquellagolf.com); all GPS coordinates approximate — tracked in `data/data-gaps.md`.

---

## Khao Yai batch — DONE (2 / 2 courses published)

Pipeline run: 2026-04-20

| # | Course | Pipeline status | Page live |
|---|---|---|---|
| 1 | Kirimaya Golf Course | approved (green fee 1,700 THB provisional — see data-gaps) | ✅ /golf-courses/khao-yai/kirimaya-golf-course/ |
| 2 | Khao Yai Golf Club | approved (green fee 1,900 THB — GolfSavers discrepancy; see data-gaps) | ✅ /golf-courses/khao-yai/khao-yai-golf-club/ |

**Outstanding:** Kirimaya green fee unconfirmed, Kirimaya phone number missing, both GPS coordinates approximate, Khao Yai Golf Club green fee disputed — all tracked in `data/data-gaps.md`.

### Phase 2 Batch 1 — PUBLISHED (4 / 5 courses; 1 held)

Pipeline run: 2026-04-20

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Mountain Creek Golf Resort | `mountain-creek-golf-resort` | ✅ /golf-courses/khao-yai/mountain-creek-golf-resort/ |
| 2 | Bonanza Golf & Country Club | `bonanza-golf-country-club` | ✅ /golf-courses/khao-yai/bonanza-golf-country-club/ |
| 3 | Seoul Siam Resort & Country Club | `seoul-siam-resort-country-club` | ✅ /golf-courses/khao-yai/seoul-siam-resort-country-club/ |
| 5 | Life Privilege Country Club | `life-privilege-country-club` | ✅ /golf-courses/khao-yai/life-privilege-country-club/ (re-regioned from Bangkok) |
| 4 | Rooks Korat Country Club | `rooks-korat-country-club` | ✅ /golf-courses/khao-yai/rooks-korat-country-club/ |

**Notes:** Mountain Creek has 27 holes (Highlands/Creek/Valley loops); fees null (all-in bundled, no clean weekday/weekend split found). Bonanza green fees provisional (1golf.eu ฿800/1,200 vs visitor reports of ฿1,500–1,800). Seoul Siam caddie/cart status unconfirmed; fees provisional (฿400/800 GF only). Rooks Korat ~240 km from Bangkok — further than Pak Chong area. Life Privilege CC re-regioned from Bangkok to Khao Yai on 2026-04-20 — permanent redirect in place at `next.config.js` (Next emits 308 for `permanent: true`). All GPS coordinates model estimates — tracked in `data/data-gaps.md`.

---

## Chiang Mai batch — DONE (2 / 2 courses published)

Pipeline run: 2026-04-20

| # | Course | Pipeline status | Page live |
|---|---|---|---|
| 1 | Alpine Golf Resort Chiang Mai | approved (3,700 THB low-season rate — high season unconfirmed; see data-gaps) | ✅ /golf-courses/chiang-mai/alpine-golf-resort-chiang-mai/ |
| 2 | Chiangmai Highlands Golf & Spa Resort | approved | ✅ /golf-courses/chiang-mai/chiangmai-highlands-golf/ |

**Notes:** Both courses charge an "everyday" rate with no weekday/weekend distinction. Alpine's high-season (Nov–Mar) rate is unconfirmed — page caveats the low-season rate. GPS approximate for both; Google Maps URLs missing. Tracked in `data/data-gaps.md`.

### Phase 2 Batch 1 — PUBLISHED (10 / 13 courses; 3 skipped)

Pipeline run: 2026-04-21

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Gassan Khuntan Golf & Resort | `gassan-khuntan-golf-resort` | ✅ /golf-courses/chiang-mai/gassan-khuntan-golf-resort/ |
| 2 | Gassan Legacy Golf Club (was Gassan Lake City) | `gassan-lake-city-golf-club` | ✅ /golf-courses/chiang-mai/gassan-lake-city-golf-club/ |
| 3 | Gassan Panorama Golf Club | `gassan-panorama-golf-club` | ✅ /golf-courses/chiang-mai/gassan-panorama-golf-club/ |
| 4 | Royal Chiang Mai Golf Club & Resort | `royal-chiang-mai-golf-club` | ✅ /golf-courses/chiang-mai/royal-chiang-mai-golf-club/ |
| 5 | Summit Green Valley Chiangmai | `summit-green-valley-chiangmai` | ✅ /golf-courses/chiang-mai/summit-green-valley-chiangmai/ |
| 6 | North Hill Golf Club Chiang Mai | `north-hill-chiang-mai` | ✅ /golf-courses/chiang-mai/north-hill-chiang-mai/ |
| 7 | Mae Jo Golf Club & Resort | `mae-jo-golf-club` | ✅ /golf-courses/chiang-mai/mae-jo-golf-club/ |
| 8 | Chiangmai Inthanon Golf & Natural Resort | `chiangmai-inthanon-golf` | ✅ /golf-courses/chiang-mai/chiangmai-inthanon-golf/ |
| 9 | Lanna Golf Course | `lanna-golf-course` | ✅ /golf-courses/chiang-mai/lanna-golf-course/ |
| 10 | Hang Dong Golf Club | `hang-dong-golf-club` | ✅ /golf-courses/chiang-mai/hang-dong-golf-club/ (9-hole par-36) |

**Skipped:** Chiangmai Green Valley CC (duplicate of Summit Green Valley), The Royal Chiangmai Golf Resort (duplicate of Royal Chiang Mai Golf Club — royalchiangmai.com), The Pine Golf & Lodge (wrong region — located in Bangkok, not Chiang Mai).

**Outstanding:** All GPS coordinates are model approximations — need Google Maps verification. Summit Green Valley green fee disputed (2,100 vs 4,400 THB — call +66 53 298 222). Lanna green fee from 2022 data — call +66 53 221 911. All tracked in `data/data-gaps.md`.

---

## Kanchanaburi & River Kwai batch — DONE (7 / 7 courses published)

Pipeline run: 2026-04-20

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Blue Sapphire Golf & Resort | `blue-sapphire-golf-resort` | ✅ /golf-courses/kanchanaburi/blue-sapphire-golf-resort/ |
| 2 | Dragon Hills Golf & Country Club | `dragon-hills-golf-country-club` | ✅ /golf-courses/kanchanaburi/dragon-hills-golf-country-club/ |
| 3 | Evergreen Hills Golf Club & Resort | `evergreen-hills-golf-club` | ✅ /golf-courses/kanchanaburi/evergreen-hills-golf-club/ |
| 4 | Grand Prix Golf Club | `grand-prix-golf-club` | ✅ /golf-courses/kanchanaburi/grand-prix-golf-club/ |
| 5 | River Kwai Golf & Country Club | `river-kwai-golf-country-club` | ✅ /golf-courses/kanchanaburi/river-kwai-golf-country-club/ |
| 6 | Royal Ratchaburi Golf Club & Resort | `royal-ratchaburi-golf-club` | ✅ /golf-courses/kanchanaburi/royal-ratchaburi-golf-club/ |
| 7 | Woo Sung Castle Hill Country Club | `woo-sung-castle-hill` | ✅ /golf-courses/kanchanaburi/woo-sung-castle-hill/ |

**Region corrections:** Friendship Meadows (Pak Chong, Nakhon Ratchasima → moved to Khao Yai region as pending), Forest Hills / Sir James CC (Muak Lek, Saraburi → published in Khao Yai region). Dragon Hills, Royal Ratchaburi, and Woo Sung Castle Hill are physically in Ratchaburi province but grouped under Kanchanaburi per industry convention. **Outstanding:** River Kwai green fees unknown (contact for rates), Royal Ratchaburi fees vary by source (750/1,050 THB used), Blue Sapphire caddie fee structure unclear, Dragon Hills caddie/cart mandatory status, Grand Prix GPS missing, Woo Sung caddie/cart fees missing — all tracked in `data/data-gaps.md`.

### Khao Yai Phase 2 Batch 2 — PUBLISHED (1 course)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Forest Hills Country Club (Sir James CC) | `forest-hills-country-club` | ✅ /golf-courses/khao-yai/forest-hills-country-club/ |

**Notes:** 27-hole course in Muak Lek, Saraburi — originally in the Kanchanaburi batch list but correctly a Khao Yai corridor course. Caddie mandatory (400 THB). Wide weekday/weekend fee gap (400 vs 1,200 THB).

---

## Phase 2 — Pattaya (16 / 25 published)

25 courses total. Phase 1 published 6; Phase 2 adds the remaining 19 in batches.

### Batch 1 — PUBLISHED (9 / 10 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Pattana Golf Club & Resort | `pattana-golf-club-resort` | ✅ /golf-courses/pattaya/pattana-golf-club-resort/ |
| 2 | Eastern Star Country Club | `eastern-star-country-club` | ✅ /golf-courses/pattaya/eastern-star-country-club/ |
| 3 | Crystal Bay Golf Resort | `crystal-bay-golf-resort` | ✅ /golf-courses/pattaya/crystal-bay-golf-resort/ |
| 4 | Pattaya Country Club | `pattaya-country-club` | ✅ /golf-courses/pattaya/pattaya-country-club/ |
| 5 | Phoenix Gold Golf Club Pattaya | `phoenix-gold-golf-club-pattaya` | ✅ /golf-courses/pattaya/phoenix-gold-golf-club-pattaya/ |
| 6 | St Andrews 2000 | `st-andrews-2000` | ✅ /golf-courses/pattaya/st-andrews-2000/ (green fees null — contact for rates) |
| 7 | Khao Kheow Country Club | `khao-kheow-country-club` | ✅ /golf-courses/pattaya/khao-kheow-country-club/ |
| 8 | Mountain Shadow Golf Club | `mountain-shadow-golf-club` | ✅ /golf-courses/pattaya/mountain-shadow-golf-club/ |
| 9 | Pleasant Valley Golf & Country Club | `pleasant-valley-golf-country-club` | ✅ /golf-courses/pattaya/pleasant-valley-golf-country-club/ |
| 10 | Rayong Green Valley Country Club | `rayong-green-valley` | ✅ /golf-courses/pattaya/rayong-green-valley/ |

**Outstanding:** St Andrews 2000 published with null green fees (Desmond Muirhead par-74; closed for renovation, Dec 2025 projected reopening; fees not findable online — contact course directly). Phone and GPS unconfirmed. Fee splits and phone verification for 5 other courses tracked in `data/data-gaps.md`.

### Batch 2 — PUBLISHED (5 / 6 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | The Emerald Golf Club | `the-emerald-golf-club` | ✅ /golf-courses/pattaya/the-emerald-golf-club/ |
| 2 | Siam Country Club Waterside | `siam-country-club-waterside` | ✅ /golf-courses/pattaya/siam-country-club-waterside/ |
| 3 | Chatrium Golf Resort Soi Dao | `chatrium-golf-resort-soi-dao` | ✅ /golf-courses/pattaya/chatrium-golf-resort-soi-dao/ |
| 4 | Sriracha International Golf Club | `sriracha-international-golf-club` | ⏸ SKIP — confirmed closed 2026 |
| 5 | Pattavia Century Golf Club | `pattavia-century-golf-club` | ✅ /golf-courses/pattaya/pattavia-century-golf-club/ |
| 6 | Greenwood Golf Club | `greenwood-golf-club` | ✅ /golf-courses/pattaya/greenwood-golf-club/ |

**Region corrections:** Blue Sapphire (Kanchanaburi), NCR CC (Nakhon Pathom), and Chonburi Century CC (duplicate of Pattavia Century) all marked `skip` in regions.md. **Outstanding:** Greenwood green fees provisional, SCC Waterside rate unverified, Chatrium fee split unverified — tracked in `data/data-gaps.md`.

### Batch 3 — PUBLISHED (2 / 2 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Bangpra International Golf Club | `bangpra-international-golf-club` | ✅ /golf-courses/pattaya/bangpra-international-golf-club/ |
| 2 | Wangjuntr Golf Park | `wangjuntr-golf-park` | ✅ /golf-courses/pattaya/wangjuntr-golf-park/ |

**Notes:** Bangpra was previously listed under Bangkok region (Si Racha is Chonburi/Eastern Seaboard — correctly placed as Pattaya). Wangjuntr was held in the Bangkok pipeline for region mismatch — it is in Wang Chan, Rayong. Bangpra fee structure provisional: multiple booking platforms show different rates; pattayagolf.net (1,700/2,500 THB) used as primary. Wangjuntr foreigner rate 3,650 THB all-in; Thai national rate is significantly lower (1,150/1,750 THB). Both courses closed on Mondays.

---

## Phase 2 — Bangkok (46 / 50 published; Life Privilege re-regioned to Khao Yai)

50 courses total — running in batches of ~12. Phase 2 courses appear on the Bangkok region page once published.

### Batch 1 — PUBLISHED (12 / 12 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Bangkok Golf Club | `bangkok-golf-club` | ✅ /golf-courses/bangkok/bangkok-golf-club/ |
| 2 | Navatanee Golf Course | `navatanee-golf-course` | ✅ /golf-courses/bangkok/navatanee-golf-course/ |
| 3 | Flora Ville Golf & Country Club | `flora-ville-golf-country-club` | ✅ /golf-courses/bangkok/flora-ville-golf-country-club/ |
| 4 | Royal Bang Pa-In Golf Club | `royal-bang-pa-in-golf-club` | ✅ /golf-courses/bangkok/royal-bang-pa-in-golf-club/ |
| 5 | Artitaya Country Club | `artitaya-country-club` | ✅ /golf-courses/bangkok/artitaya-country-club/ |
| 6 | Rajpruek Club | `rajpruek-club` | ✅ /golf-courses/bangkok/rajpruek-club/ |
| 7 | Lakewood Country Club | `lakewood-country-club` | ✅ /golf-courses/bangkok/lakewood-country-club/ |
| 8 | Suvarnabhumi Golf & Country Club | `suvarnabhumi-golf-country-club` | ⛔ MERGED 2026-08-30 into `phoenix-gold-golf-country-club` (same Nong Chok course); slug 308s |
| 9 | Windsor Park & Golf Club | `windsor-park-golf-club` | ✅ /golf-courses/bangkok/windsor-park-golf-club/ |
| 10 | Cascata Golf Club | `cascata-golf-club` | ✅ /golf-courses/bangkok/cascata-golf-club/ |
| 11 | Kiarti Thanee Country Club | `kiarti-thanee-country-club` | ✅ /golf-courses/bangkok/kiarti-thanee-country-club/ |
| 12 | Green Valley Country Club | `green-valley-country-club` | ✅ /golf-courses/bangkok/green-valley-country-club/ |

### Batch 2 — PUBLISHED (12 / 12 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Siam Country Club Bangkok | `siam-country-club-bangkok` | ✅ /golf-courses/bangkok/siam-country-club-bangkok/ |
| 2 | The Royal Golf & Country Club | `royal-golf-country-club` | ✅ /golf-courses/bangkok/royal-golf-country-club/ |
| 3 | Rose Garden Country Club | `rose-garden-country-club` | ✅ /golf-courses/bangkok/rose-garden-country-club/ |
| 4 | Riverdale Golf Club | `riverdale-golf-club` | ✅ /golf-courses/bangkok/riverdale-golf-club/ |
| 5 | Toscana Valley Country Club | `toscana-valley-country-club` | ✅ /golf-courses/khao-yai/toscana-valley-country-club/ |
| 6 | Bangsai Country Club | `bangsai-country-club` | ✅ /golf-courses/bangkok/bangsai-country-club/ |
| 7 | Subhapruek Golf Club | `subhapruek-golf-course` | ✅ /golf-courses/bangkok/subhapruek-golf-course/ |
| 8 | Pinehurst Golf & Country Club | `pinehurst-golf-country-club` | ✅ /golf-courses/bangkok/pinehurst-golf-country-club/ |
| 9 | Dynasty Golf & Country Club | `dynasty-golf-country-club` | ✅ /golf-courses/bangkok/dynasty-golf-country-club/ |
| 10 | Lotus Valley Golf Resort | `lotus-valley-golf-resort` | ✅ /golf-courses/bangkok/lotus-valley-golf-resort/ |
| 11 | Thanont Golf View & Sports Club | `thanont-golf-view-sports-club` | ✅ /golf-courses/bangkok/thanont-golf-view-sports-club/ |
| 12 | The Vintage Club | `the-vintage-club` | ✅ /golf-courses/bangkok/the-vintage-club/ |

### Batch 3 — PUBLISHED (12 / 12 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Unico Grande Golf Course | `unico-grande-golf-course` | ✅ /golf-courses/bangkok/unico-grande-golf-course/ |
| 2 | Ekachai Golf & Country Club | `ekachai-golf-country-club` | ✅ /golf-courses/bangkok/ekachai-golf-country-club/ |
| 3 | Robinswood Golf Club | `robinswood-golf-club` | ✅ /golf-courses/bangkok/robinswood-golf-club/ |
| 4 | Royal Lakeside Golf Club | `royal-lakeside-golf-club` | ✅ /golf-courses/bangkok/royal-lakeside-golf-club/ |
| 5 | Krung Kavee Golf Course & Country Club | `krung-kavee-golf-course` | ✅ /golf-courses/bangkok/krung-kavee-golf-course/ |
| 6 | Sai Golf Club | `sai-golf-club` | ✅ /golf-courses/bangkok/sai-golf-club/ |
| 7 | Life Privilege Country Club | `life-privilege-country-club` | ➡️ Re-regioned to Khao Yai — 308 redirect from /golf-courses/bangkok/life-privilege-country-club/ |
| 8 | Star Country Club (Aquarius CC) | `star-country-club` | ✅ /golf-courses/bangkok/star-country-club/ |
| 9 | The Legacy Golf Club | `the-legacy-golf-club` | ✅ /golf-courses/bangkok/the-legacy-golf-club/ |
| 10 | Panurangsi Golf Club | `panurangsi-golf-club` | ✅ /golf-courses/bangkok/panurangsi-golf-club/ |
| 11 | Rachakram Golf Club | `rachakram-golf-club` | ✅ /golf-courses/bangkok/rachakram-golf-club/ |
| 12 | Nichigo Resort & Country Club | `nichigo-resort-country-club` | ✅ /golf-courses/kanchanaburi/nichigo-resort-country-club/ |

**Notes:** Robinswood is private (fees null). Star CC fees provisional (200/400 THB flagged suspicious). Life Privilege CC is in Nakhon Ratchasima (Pak Chong), not Ayutthaya as some directories state. GPS unconfirmed for ~10 courses — tracked in `data/data-gaps.md`.

### Batch 4 — PUBLISHED (11 / 14 courses)

| # | Course | Slug | Page live |
|---|---|---|---|
| 1 | Bangpoo Golf & Sports Club | `bangpoo-golf-sports-club` | ✅ /golf-courses/bangkok/bangpoo-golf-sports-club/ |
| 2 | Killien Golf Club | `killien-golf-club` | ✅ /golf-courses/bangkok/killien-golf-club/ |
| 3 | Muang Ake Golf Course | `muang-ake-golf-course` | ✅ /golf-courses/bangkok/muang-ake-golf-course/ |
| 4 | Muang Ake Vista Golf Course | `muang-ake-vista-golf-course` | ✅ /golf-courses/bangkok/muang-ake-vista-golf-course/ |
| 5 | Muang Ake Wang Noi Golf Course | `muang-ake-wang-noi-golf-course` | ✅ /golf-courses/bangkok/muang-ake-wang-noi-golf-course/ |
| 6 | Northern Rangsit Golf Club | `northern-rangsit-golf-club` | ✅ /golf-courses/bangkok/northern-rangsit-golf-club/ |
| 7 | Rangsit Sports Club | `rangsit-sports-club` | ✅ /golf-courses/bangkok/rangsit-sports-club/ |
| 8 | Prime City Golf Club | `prime-city-golf-club` | ✅ /golf-courses/bangkok/prime-city-golf-club/ |
| 9 | Kumlung-Ake Golf Course | `kumlung-ake-golf-course` | ✅ /golf-courses/isan/kumlung-ake-golf-course/ |
| 10 | Krisda City Golf Hills | `krisda-city-golf-hills` | ✅ /golf-courses/bangkok/krisda-city-golf-hills/ |
| 11 | Ayutthaya Golf Club | `ayutthaya-golf-club` | ✅ /golf-courses/bangkok/ayutthaya-golf-club/ |
| — | Iyara Park Golf Course | — | ⏸ HELD — permanently closed ~2012 |
| — | Wangjuntr Golf Park | — | ⏸ HELD — Rayong/Pattaya area, wrong region |
| — | Prapasri Golf Course | — | ⏸ HELD — Sakon Nakhon province (~650 km), wrong region |

**Notes:** Killien province corrected to Nakhon Pathom (not Chachoengsao). Northern Rangsit province corrected to Ayutthaya (Wang Noi, not Pathum Thani). Muang Ake Vista rebranded RSU Vista 2022. Kumlung-Ake is in Loei province (~500 km) — originally published under Bangkok with prose noting it is not a Bangkok day-trip; that caveat was the wrong fix and it was re-regioned to isan in PR #88 (old URL redirects via next.config.js — `permanent: true`, so Next emits a **308**, which is what the smoke test asserts). Re-region a misfiled course rather than caveating it in prose.

### Batch 5 — pending

Remaining 3 Bangkok Phase 2 courses — pending after Batch 4 is verified live.

---

## Phase 3 — Batch 1 (scattered courses in existing regions)

Pipeline run: 2026-04-21

| # | Course | Region | Status |
|---|---|---|---|
| 1 | Rancho Charnvee Resort & Country Club | `khao-yai` | ✅ /golf-courses/khao-yai/rancho-charnvee-country-club/ (green fee 1,050/1,850 THB provisional — see data-gaps.md) |
| 2 | Kabinburi Sport Club | `pattaya` | ✅ /golf-courses/pattaya/kabinburi-sportclub/ |
| 3 | Suranaree Golf Club | — | ⏸ SKIP — 9H + MIL (Camp Suranaree army base) |

**Region corrections:** Rancho Charnvee re-regioned from Bangkok to khao-yai (Pak Chong, Nakhon Ratchasima). Suranaree Golf Club (both khao-yai row 8 and isan row 10) marked skip — confirmed 9-hole military course.

**Report:** `docs/course-guide/reports/phase3-batch1.report.md`

---

## Phase 3 — Batch 2 (Isan) — PUBLISHED

Pipeline run: 2026-04-21

5 courses verified; 6 of 11 skipped. Report: `docs/course-guide/reports/phase3-batch2-isan.report.md`

| # | Course | Province | Status |
|---|---|---|---|
| 1 | Dancoon Golf Club | Khon Kaen | ✅ /golf-courses/isan/dancoon-golf-club/ (green fee 680/980 THB provisional) |
| 2 | Singha Park Khon Kaen Golf Club | Khon Kaen | ✅ /golf-courses/isan/singha-park-khon-kaen/ (fees confirmed official site) |
| 3 | Victory Park Golf & Country Club | Nong Khai | ✅ /golf-courses/isan/victory-park-golf-country-club/ (fees provisional) |
| 4 | Royal Creek Golf Club Udon Thani | Udon Thani | ✅ /golf-courses/isan/royal-creek-golf-club-udon-thani/ (weekday provisional; weekend null) |
| 5 | Ubolratana Dam Golf Course | Khon Kaen | ✅ /golf-courses/isan/ubolratana-dam-golf-course/ (560/760 THB caddie-inclusive) |
| — | Urbonrat Golf Course | — | ⏸ SKIP — nonexistent/typo |
| — | Udon Golf Club | — | ⏸ SKIP — 9-hole |
| — | Great Lake Golf & Country Club | — | ⏸ SKIP — wrong region (Rayong/Pattaya) |
| — | Siharatdechochai Golf Course | — | ⏸ SKIP — 9H + MIL |
| — | Ubonrat Golf Course | — | ⏸ SKIP — probable duplicate of Ubolratana Dam (same phone) |
| — | Uniland Golf & Country Club | — | ⏸ SKIP — wrong region (Nakhon Pathom) |

**Published 2026-04-21. New Isan region infrastructure created: `data/golf-courses/isan/index.ts`, `REGION_META.isan` in `lib/golf-courses.ts`, hub page updated, 6 smoke tests added.**

---

## Phase 3 — Batch 3 (Southern Thailand) — PUBLISHED

Pipeline run: 2026-04-21

3 courses published; 2 of 5 skipped. Report: `docs/course-guide/reports/phase3-batch3-southern-thailand.report.md`

| # | Course | Province | Status |
|---|---|---|---|
| 1 | Southern Hills Golf & Country Club | Songkhla | ✅ /golf-courses/southern-thailand/southern-hills-golf-country-club/ (GF 950/1,400 THB confirmed) |
| 2 | Hat Yai Resort & Golf Club | Songkhla | ✅ /golf-courses/southern-thailand/hat-yai-resort-golf-club/ (GF 600/900 THB provisional; caddie 300 THB very provisional) |
| 3 | Sri Trang Golf Club | Trang | ✅ /golf-courses/southern-thailand/sri-trang-golf-club/ (GF 300/400 THB provisional; GPS model estimate) |
| — | Tungsong Golf Course | — | ⏸ SKIP — 9H + MIL + reported closed |
| — | Phatthalung Golf Club | — | ⏸ SKIP — 9H + MIL |

**Published 2026-04-21. New Southern Thailand region infrastructure created: `data/golf-courses/southern-thailand/index.ts`, `REGION_META['southern-thailand']` in `lib/golf-courses.ts`, hub page updated, 4 smoke tests added.**

---

## Phase 3 — Batch 4 (Koh Samui & Gulf South) — PUBLISHED

Pipeline run: 2026-04-21

2 courses published; 2 of 4 skipped. Report: `docs/course-guide/reports/phase3-batch4-koh-samui.report.md`

| # | Course | Province | Status |
|---|---|---|---|
| 1 | Santiburi Samui Country Club | Surat Thani | ✅ /golf-courses/koh-samui/santiburi-samui-country-club/ (5,800 THB all-in; caddie + cart bundled) |
| 2 | Rajjaprabha Dam Golf Course | Surat Thani | ✅ /golf-courses/koh-samui/rajjaprabha-dam-golf-course/ (1,000 THB foreigner rate; dual pricing) |
| — | Chumphon Beach Golf Club | — | ⏸ SKIP — confirmed closed ~2021 + 9-hole |
| — | Royal Samui Golf & Country Club | — | ⏸ SKIP — 9-hole |

**Published 2026-04-21. New Koh Samui region infrastructure created: `data/golf-courses/koh-samui/index.ts`, `REGION_META['koh-samui']` in `lib/golf-courses.ts`, hub page updated, 3 smoke tests added.**

---

## Phase 3 — Batch 5 (North Miscellaneous) — PUBLISHED

Pipeline run: 2026-04-21

1 course published; 15 of 16 skipped. Report: `docs/course-guide/reports/phase3-batch5-north-misc.report.md`

| # | Course | Province | Status |
|---|---|---|---|
| 1 | Mae Moh Golf Course | Lampang | ✅ /golf-courses/north-misc/mae-moh-golf-course/ (null green fees — contact course; EGAT pattern, all-null commercial data) |
| — | Wangjuntr Golf Park | — | ⏸ SKIP — already published at /golf-courses/pattaya/wangjuntr-golf-park/ |
| — | Kamphaeng Phet Akarayothin GC | — | ⏸ SKIP — probable MIL (Royal Thai Army Infantry Center, Wachira Prakarn Camp) |
| — | Chaophraya Dam GC | — | ⏸ SKIP — existence uncertain (Chaophraya Dam is a weir, not a hydroelectric compound) |
| — | Phrae Golf Course | — | ⏸ SKIP — insufficient data (holes unknown, no fees/phone) |
| — | Kwan Pha Yao GC | — | ⏸ SKIP — insufficient data (may be 9H) |
| — | Tanyatanee Country Club | — | ⏸ SKIP — insufficient data |
| — | Hillside Country Home | — | ⏸ SKIP — province unknown |
| — | Naraihill Golf & CC | — | ⏸ SKIP — province inferred only; no fees/phone |
| — | Panorama Golf & CC | — | ⏸ SKIP — province unknown |
| — | Mida Golf Club (Lion Hills) | — | ⏸ SKIP — province unknown |
| — | Nong Samrong GC | — | ⏸ SKIP — insufficient data |
| — | Green World Hot Spring | — | ⏸ SKIP — likely not 18H |
| — | Dongpukurd GC | — | ⏸ SKIP — insufficient data |
| — | Khao Laem GC | — | ⏸ SKIP — probable 9H (small EGAT compound, Sangkhlaburi) |
| — | Bhumibol Dam GC | — | ⏸ SKIP — hole count unconfirmed (may be 9H) |

**Published 2026-04-21. New north-misc region infrastructure created: `data/golf-courses/north-misc/index.ts`, `REGION_META['north-misc']` in `lib/golf-courses.ts`, hub page updated, 2 smoke tests added. Mae Moh all data null except holes (18, EGAT pattern) — 7 data-gap items logged.**

---

## Phase 3 — Batch 6 (Khao Lak) — PUBLISHED

Pipeline run: 2026-04-21

1 course published; 0 skipped. Report: `docs/course-guide/reports/khao-lak-batch.report.md` (not yet created — batch was small)

| # | Course | Province | Status |
|---|---|---|---|
| 1 | Katathong Golf Resort & Spa | Phang Nga | ✅ /golf-courses/khao-lak/katathong-golf-resort/ (GF 2,350/3,200 THB seasonal; caddie 400 THB + cart 700 THB compulsory) |

**Published 2026-04-21. New khao-lak region infrastructure created: `data/golf-courses/khao-lak/index.ts`, `REGION_META['khao-lak']` in `lib/golf-courses.ts`, hub page updated, 2 smoke tests added. Phone +66-76-592999 confirmed, GPS coordinates confirmed (8.559593, 98.481254), website https://www.katathong.com confirmed, club rental 1,500 THB.**

---

## Phase 3 — Batch 7 (Krabi) — PUBLISHED

Pipeline run: 2026-04-21

1 course published; 1 skipped. Report: `docs/course-guide/reports/krabi-batch.report.md`

| # | Course | Province | Status |
|---|---|---|---|
| 1 | Pakasai Country Club | Krabi | ✅ /golf-courses/krabi/pakasai-country-club/ (GF 2,500 THB provisional; caddie 300 THB provisional + cart 500 THB provisional) |
| — | Pakasai Golf (9H) | — | ⏸ SKIP — 9-hole annex / same site as above |

**Published 2026-04-21. New krabi region infrastructure created: `data/golf-courses/krabi/index.ts`, `REGION_META.krabi` in `lib/golf-courses.ts`, hub page updated, 2 smoke tests added. Green fee provisional (single aggregator source — call +66 75 for confirmation); phone null (not found); no official website. Club rental available, fee unknown — 5 data-gap items logged in `data-gaps.md`.**

---

## Phase 3 — complete

All planned Phase 3 batches have now been processed (Batches 1–7). 14 regions live; 148 courses published (149 until the 2026-08-30 duplicate-course merge). Remaining low-priority courses (Bhumibol Dam, Khao Laem, Naraihill, etc.) are documented in `data-gaps.md` as candidates for future phone verification.

---

## Pending — Phase 1 regions

Run each region through the full pipeline (Stages 1–5) in order.

| Region | Phase 1 courses | Status |
|---|---|---|
| Bangkok | 11 | ✅ Done |
| Pattaya & Eastern Seaboard | 6 | ✅ Done |
| Hua Hin & Cha-am | 5 | ✅ Done |
| Phuket | 5 | ✅ Done |
| Khao Yai & Central Highlands | 2 | ✅ Done |
| Chiang Mai | 2 | ✅ Done |

---

## Pages & features

| Item | Priority | Status | Notes |
|---|---|---|---|
| Region index page `/golf-courses/bangkok/` | High | ✅ Done | Lists all Bangkok courses with fee + distance |
| Hub page `/golf-courses/` | High | ✅ Done | Landing page linking to all regions + coming-soon teasers |
| Smoke tests — hub + region indexes | Low | ✅ Done | Hub, Bangkok, Pattaya, Hua Hin, Phuket indexes + course detail routes in CI |
| Internal linking — course pages | High | ✅ Done | Each course page now carries 10 unique internal links: 5 pre-existing footer/sidebar links + "Plan Your Trip" sidebar card (3 new links: `/golf-in-thailand-guide`, `/cost/how-much-does-golf-cost-bangkok`, `/lessons`) + "More [Region] courses" section (up to 3 sibling course cards + region index "View all" link). Guide page (`/golf-in-thailand-guide`) updated: 5 featured course rows now link to `/golf-courses/` pages; "Full guide" link replaced with "Browse all Bangkok courses" + "All {totalCourses} Thailand courses" links (the count is derived at render time, 148 today); 7 new HubCards added for the hub and 6 region pages. |
| GPS coordinates + Google Maps URLs | Medium | Pending | All 11 Bangkok courses approximate — see `data-gaps.md` |
| Phone number verification | Medium | Pending | 9 courses missing — see `data-gaps.md` |
| Multilingual pages (KO / ZH / JA) | Phase 2 | Pending | Infrastructure in place (`locales` field), content not written |
| Add new regions to `lib/golf-courses.ts` | As needed | — | Add to `REGIONS` + `REGION_META` when new batches are published |
| Update `data/golf-courses/[region]/index.ts` | As needed | — | Add slugs when new courses are published |

---

## How to run the next batch

1. Pick a region from the pending list above (e.g. Pattaya)
2. Tell Claude: `"Collect Phase 1 Pattaya courses"` → runs Stages 1–3
3. Read `docs/course-guide/reports/pattaya-batch.report.md`
4. Approve: `"Approve Pattaya batch"` (with any dispute resolutions)
5. Claude runs Stage 5 publish script and updates the region `index.ts`
6. Add the region to `REGIONS` and `REGION_META` in `lib/golf-courses.ts`
7. Move the region from `COMING_SOON_REGIONS` → `PUBLISHED_REGIONS` in `app/[locale]/golf-courses/page.tsx`, and add it to `hubRegions`
8. Add 2–3 smoke test routes for the new region in `scripts/smoke-test.ts`

---

## File map

```
docs/course-guide/
  PROGRESS.md                  ← this file
  README.md                    ← pipeline overview
  agents/
    1.collect.md               ← Stage 1 instructions
    2.enrich.md                ← Stage 2 instructions
    3.verify.md                ← Stage 3 instructions
    4.review.md                ← Stage 4 instructions (for Chris)
    5.publish.ts               ← Stage 5 publish script
  data/
    course-schema.md           ← field definitions
    regions.md                 ← master course list (206 courses)
    data-gaps.md               ← fields needing phone verification
    1.raw/bangkok/             ← 11 raw JSON files
    2.enriched/bangkok/        ← 11 enriched JSON files (+ prose)
    4.approved/bangkok/        ← 11 approved JSON files
  knowledge/
    lengolf-facts.md           ← LENGOLF rental business facts
    course-overrides.md        ← manual corrections
  reports/
    bangkok-batch.report.md    ← Bangkok verification report

data/golf-courses/
  bangkok/
    index.ts                   ← slug registry
    alpine-golf-club.ts        ← published TypeScript data
    ... (10 more)

app/[locale]/golf-courses/
  [region]/[slug]/page.tsx     ← Next.js route

components/golf-courses/
  CoursePage.tsx               ← page component

lib/golf-courses.ts            ← data loader (server-only)
types/golf-courses.ts          ← GolfCourse type
```
