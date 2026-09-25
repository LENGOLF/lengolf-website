# LENGOLF Knowledge Base — Course Guide

Verified facts Claude checks before relying on web search or training knowledge.
Update this file when you have confirmed corrections or new information.

Each entry includes a source and date so we know how fresh it is.

---

## LENGOLF rental business facts

**What LENGOLF offers:**
LENGOLF provides premium golf club rentals for use at any Bangkok course, with
hotel AND course delivery for 500 THB (the earlier "hotel only, not delivered to
courses" line here was false). Source: messages/en.json CourseClubRental
(heroSubtitle, courseBannerText in ClubRental) | Verified: 2026-09-24

**Rental brands available:**
Callaway: Premium+ Paradym Forged Carbon, Premium Warbird (men), Premium REVA
(women). Write "premium Callaway" in course copy. Do NOT write "TaylorMade and
Callaway": the one exception is a single left-handed set (TaylorMade / Ping),
offered on request only, which is not the default offer. Majesty is retired.
Source: rental_club_sets table (Supabase) + messages/en.json CourseClubRental | Verified: 2026-09-24

**Delivery area:**
Bangkok hotels. Not Phuket, Hua Hin, or Pattaya (as of April 2026).
Source: lengolf.com | Verified: 2026-04

**CTA framing:**
The value proposition for course pages is: "Skip airline baggage fees: rent clubs delivered to your Bangkok hotel."
This is relevant for courses in all regions because most visitors stay in Bangkok before/after playing.

---

## Golf in Thailand — general facts

**Caddies:**
Caddies are mandatory at most Thai golf courses. The standard caddie fee is 300-500 THB depending on the course. Caddies are tipped separately (100-200 THB is typical).
Source: general industry knowledge | Verified: 2026-04

**Cart rental:**
Cart rental is typically 300-600 THB at Bangkok-area courses and is often optional unless the course policy states otherwise.
Source: general industry knowledge | Verified: 2026-04

**Green fee price ranges (approximate, Bangkok region):**
- Budget courses: 800-1,500 THB weekday
- Mid-range courses: 1,500-2,500 THB weekday
- Premium courses: 2,500-4,000 THB weekday
Weekend rates are typically 20-40% higher than weekday.
Source: general industry knowledge | Verified: 2026-04

**Tee time booking:**
Most Thai courses accept direct bookings by phone or email. Third-party platforms (GolfNow, GolfAsian, Golfboo) cover many courses. Advance booking is recommended on weekends.
Source: general industry knowledge | Verified: 2026-04

**Best time to play:**
November to February is the cool/dry season — ideal conditions. March-May is hot (35°C+). June-October is rainy season — courses are open but afternoon rounds may be interrupted.
Source: general industry knowledge | Verified: 2026-04

---

## Distance and travel times from Bangkok (approximate)

These are driving times from central Bangkok under normal traffic. Add 30-60 min during peak hours.

| Course area | Distance | Drive time |
|---|---|---|
| Eastern Bangkok suburbs (Ladkrabang, Minburi) | 20-35 km | 30-50 min |
| Western suburbs (Nakhon Pathom, Salaya) | 30-50 km | 45-75 min |
| Northern suburbs (Pathum Thani, Rangsit) | 30-50 km | 45-75 min |
| Pattaya / Eastern Seaboard | 130-150 km | 90-120 min |
| Hua Hin | 200-230 km | 2.5-3.5 hours |
| Phuket | 860 km | fly or 10+ hour drive |

Source: general knowledge / Google Maps estimates | Verified: 2026-04

---

## Course overrides

No overrides yet. Add entries here when you have confirmed corrections that should override what web search finds.

Format:
```
### <Course Name>
Field: <field_name>
Correct value: <value>
Source: <where you got this>
Date confirmed: <date>
Note: <why this override exists>
```
