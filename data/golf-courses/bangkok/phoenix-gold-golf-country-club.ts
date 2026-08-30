import type { GolfCourse } from '@/types/golf-courses'

/**
 * Merged 2026-08-30: this file absorbed
 * `data/golf-courses/bangkok/suvarnabhumi-golf-country-club.ts`, which
 * described the SAME 36-hole Robert Trent Jones Jr. facility in Nong Chok
 * under the club's former name. Both files said so in their own prose
 * ("rebranded again in the mid-2020s as Phoenix Gold Golf Bangkok" /
 * "the renamed Suvarnabhumi Golf & Country Club"), and the audit at
 * docs/golf-course-content-audit-2026-07.md item 8 confirmed it by web
 * research on 2026-07-30. The retired slug 308s here via next.config.js.
 *
 * `name` is now "Phoenix Gold Golf Bangkok" — the club's actual trading name
 * (Google Places returns exactly that string for this address) and NOT
 * "Phoenix Gold Golf & Country Club", which `pattaya/phoenix-gold-golf-club-
 * pattaya` also carries. That collision is documented as a live hazard at the
 * L6 call site in scripts/smoke-test.ts; distinguishing the two names removes
 * the content half of it, and L6 now keys on the item URL for the guard half.
 *
 * Naming note for future editors. The former CLUB name is kept in the title,
 * meta and prose on purpose: "suvarnabhumi golf and country club" is the only
 * query that has ever converted on this page (67 impressions, all 4 of its
 * clicks, pos ~13.9), and readers arriving through the 308 need to recognise
 * where they landed.
 *
 * What is deliberately absent from the title and meta is the word AIRPORT.
 * The retired page was absorbing ~1,720 impressions of "golf near Suvarnabhumi
 * airport" intent at position ~37 with zero clicks, while
 * /golf-courses/near/suvarnabhumi-airport/ — built for exactly that query —
 * has never recorded a single impression, and the identically generated Don
 * Mueang page holds position ~14.6. That airport page owns airport intent;
 * this one owns the club. The one airport reference in location_and_access is
 * factual, secondary, and labelled as what it is — a ~19 km STRAIGHT-LINE
 * distance, with the drive stated as longer — rather than selling proximity the
 * course does not have. It is 18.66 km from the terminal and ranks 15th by
 * distance, so it is not in that airport page's nearest eight.
 */
export const course: GolfCourse = {
  slug: 'phoenix-gold-golf-country-club',
  region: 'bangkok',
  name: `Phoenix Gold Golf Bangkok`,
  province: `Bangkok`,
  designer: `Robert Trent Jones Jr.`,
  holes: 36,
  par: 72,
  // Opened 1993 as President Country Club (carried over from the merged file;
  // the Phoenix Gold file had this as null).
  year_opened: 1993,
  // golfdigg 2026 booking rate: green fee + caddie 999 wd / 1,199 we; cart 600.
  // The 3,000+ rack rates on phoenixgoldgolf.com belong to the Pattaya sister
  // course, which shares the brand and the website.
  green_fee_weekday_thb: 999,
  green_fee_weekend_thb: 1199,
  fees_verified_at: '2026-07-30',
  // 0, not null: the 999/1,199 booking rate already includes the caddie, so 0
  // is the semantically correct value where null means "unknown".
  //
  // Be precise about what that does and does not buy TODAY, because an earlier
  // version of this comment justified it with a benefit this course cannot
  // reach. SpecTable's `=== 0` branch does render "Included" — but SpecTable is
  // imported only by the /compare/ route, and this course is in no comparison
  // pair (bangkok popularity rank 42/54). On the one page it does have,
  // CoursePage gates the caddie row on `> 0`, so the row is suppressed at 0
  // exactly as it was at null. The change is therefore behaviourally inert
  // today and correct for the day the course enters a pair.
  //
  // NOT fee_is_package: the cart is charged separately at 600. That is the
  // caddie-bundled-but-cart-extra shape still awaiting an owner ruling, and the
  // corpus is consistent — hang-dong (0/300) and thana-city (0/800) are the
  // only other courses in this shape and neither is flagged, while all 19
  // flagged courses have cart_fee_thb 0 or no cart. See CLAUDE.md.
  caddie_fee_thb: 0,
  // Both merged sources' prose state 600; the Phoenix Gold file had it null
  // while its own `tips` said "carts 600 THB", so this closes a data gap rather
  // than adding a charge. KNOWN PRESENTATION GAP it creates: CoursePage's fee
  // card now renders a "Cart 600" row under a "Green fees" heading with NO
  // caddie row (suppressed by the `> 0` gate above), while caddie_required is
  // true. The prose and the generated FAQ both state the caddie is included, so
  // nothing is hidden, but the card alone reads as though the caddie were an
  // unpriced extra. Fixing that means changing CoursePage's `> 0` gate to
  // distinguish 0 from null, which moves 24 other courses — a deliberate
  // decision, not a drive-by. Named in the PR's Known gaps.
  cart_fee_thb: 600,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  club_rental_available: true,
  club_rental_fee_thb: 1300,
  club_rental_brands: 'TaylorMade, Titleist',
  website: 'https://www.phoenixgoldgolf.com/',
  phone: null,
  // Google Places Text Search, 2026-08-30, using the exact query format of
  // scripts/verify-course-coordinates.ts. Resolves "Phoenix Gold Golf Bangkok"
  // at 54 Moo 5 Soi Suwinthawong 96, Lam Toi Ting, Nong Chok 10530 — the same
  // street address the merged file's location_and_access already stated.
  // BOTH pre-merge values were drift beyond the script's 1.5 km MATCH_KM:
  // the Phoenix Gold file's 13.862/100.914 was 8.75 km out and the
  // Suvarnabhumi file's 13.816/100.865 was 4.37 km out.
  latitude: 13.786383,
  longitude: 100.891548,
  // HAND-STAMPED from the single lookup described above, NOT produced by
  // `verify:coordinates --write` (which would have re-queried all 148 courses).
  // Flagging that because this stamp is what silences validate:courses'
  // staleness rule and what hasTrustedCoordinates() reads before emitting
  // GeoCoordinates and the satellite pin - so it asserts more than a hand edit
  // normally does. Re-run the script over this course to reproduce it.
  coordinates_verified_at: '2026-08-30',
  // 55 km / 70 min retained from the Phoenix Gold file, in preference to the
  // merged file's 40 km / 60 min. Straight-line distance from central Bangkok to
  // the verified coordinates, measured: Asok 36.2, Chidlom 37.9, Siam 38.9,
  // REGION_META.bangkok.center 40.3, Grand Palace 43.4 km. So a 40 km ROAD
  // distance implies a road-to-crow ratio of 1.05-1.10 against the nearer
  // anchors - implausible for the Suwinthawong approach, though not the flat
  // impossibility an earlier draft of this comment asserted. 55 km sits at a
  // ratio of ~1.45, which is ordinary for this corridor. Treat 55 as the better
  // of two unverified editorial figures, not as a measured one.
  distance_from_bangkok_km: 55,
  drive_time_from_bangkok_min: 70,
  google_maps_url: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Phoenix Gold Golf Bangkok\",\n  \"url\": \"https://len.golf/golf-courses/bangkok/phoenix-gold-golf-country-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"streetAddress\": \"54 Moo 5, Suwinthawong Road\",\n    \"addressLocality\": \"Nong Chok, Bangkok\",\n    \"postalCode\": \"10530\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 13.786383,\n    \"longitude\": 100.891548\n  },\n  \"priceRange\": \"฿฿\",\n  \"sameAs\": [\n    \"https://www.phoenixgoldgolf.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": false\n    }\n  ]\n}",
  prose: {
    overview: `Phoenix Gold Golf Bangkok — opened in 1993 as President Country Club, later known as Suvarnabhumi Golf & Country Club, and now trading under the Phoenix Gold brand shared with its Pattaya sister course — is a 36-hole Robert Trent Jones Jr. design in Nong Chok, on the eastern fringe of Bangkok and east of Suvarnabhumi Airport. Trent Jones Jr. designed three courses in the Bangkok area and this is the most expansive: four nine-hole championship loops offering multiple combination plays, each with a distinct character so that no two rounds repeat. The setting is genuinely rural: paddy fields, marshland and tall reeds provide an agricultural backdrop that feels far removed from the city despite sitting inside Bangkok's administrative boundaries, and the wetland supports a notable population of migratory birds and fish. Booking-platform rates of roughly 999 THB weekday and 1,199 THB weekend including caddie (cart 600 THB extra) make it one of the cheapest Trent Jones designs in the Bangkok region.`,
    layout_and_experience: `The four nines (playable in North/East/West/South combinations) extend to 7,059 yards at par 72 from the gold tees, with a slope of 128 and a rating of 73 — figures that confirm genuine challenge. Trent Jones Jr.'s Bangkok courses are known for large, fast greens, and Phoenix Gold follows that pattern. Fairways are wider and tree coverage sparser than on many Bangkok layouts, creating broad vistas across the rural landscape and honest sight lines that expose wayward drives. Water is woven throughout in the form of marshland, channels and ponds, giving the layout a links-adjacent feel unusual for an inland Bangkok course, and the open ground means the wind is a real factor. Dog-legs and carries over water demand strategic tee shots on the more demanding holes, and the Bermuda rough punishes a miss. The Jones design's characteristic risk-and-reward par-5s and demanding par-3s provide the highlight holes, and the overall challenge suits a broad range of handicaps. The 36-hole scale means early morning tee times are generally available even on weekends, without the congestion common at central city venues. The Hole-In-One coffee shop on site is a pleasant post-round stop.`,
    tips: `Booking platforms list green fee plus caddie at roughly 999 THB weekday and 1,199 THB weekend, with carts 600 THB extra — search under the current name, Phoenix Gold Golf Bangkok, as older listings still use Suvarnabhumi Golf & Country Club or President Country Club. The higher rack rates shown on the shared phoenixgoldgolf.com website refer to the Pattaya course, not this one. Caddies are compulsory. Advance booking is required (minimum one day weekday, two days weekend), so the good weekend availability is not a walk-up invitation. Allow at least 70 minutes from central Bangkok, and more in rush hour. Grab is available but confirm a return pickup before you travel — a pre-arranged transfer is more reliable from this part of the city.`,
    location_and_access: `Phoenix Gold Golf Bangkok is located at 54 Moo 5, Suwinthawong Road (Soi Suwinthawong 96), Lam Toi Ting, Nong Chok, Bangkok 10530. Despite the Bangkok address, the course sits in the far eastern reaches of the province, roughly 55 km and 70 minutes from the city centre. By car, take the Bang Na Expressway east toward Chonburi, then head north toward Nong Chok via Suwinthawong Road. Suvarnabhumi Airport (BKK) lies about 19 km to the south-west in a straight line, and the drive is longer than that figure suggests — allow 30–40 minutes. Several Bangkok courses sit considerably closer to the terminal, so this is a workable stop around a late-afternoon flight rather than the airport's nearest course. No public transport serves the area directly.`,
    rental_cta_context: `Heading out to Nong Chok for a round at Phoenix Gold Golf Bangkok? LENGOLF delivers premium club rentals to Bangkok hotels city-wide, so you can travel without golf baggage and collect your clubs before the drive east.`,
  },
  locales: {
    en: {
      // Deliberately NOT the "<name> — Green Fees, Course Guide & Golf Club
      // Rentals" boilerplate. That form matches BOILERPLATE_TITLE in
      // lib/course-seo.ts, which discards it for the generated
      // "<name> — Green Fees & Guide" — and the generated form cannot carry the
      // former club name. A non-boilerplate hand-written title is returned
      // verbatim (getCourseTitle, the `!BOILERPLATE_TITLE.test` branch).
      //
      // The former name has to be HERE specifically: getCourseDescription
      // always generates the EN description and never reads the
      // meta_description below, so after the slug and H1 moved to Phoenix Gold
      // the <title> is the only place left carrying the one query that
      // converts on this page ("suvarnabhumi golf and country club", pos ~13.9,
      // all 4 of the page's clicks). It is spelled out rather than abbreviated
      // to "G&CC" for two reasons: the converting query IS the full phrase, and
      // a census of the 148 EN titles found nine carrying a former/alternate
      // name in parentheses — "(formerly Banyan Golf Club)", "(now Wang Noi
      // Prestige Golf & Country Club)" — and all nine spell it out. At 90
      // characters this sits under the corpus maximum of 95, and SERP
      // truncation lands inside the trailing "Green Fees & Guide", which is the
      // half worth losing. The word "airport" appears nowhere: airport intent
      // belongs to /golf-courses/near/suvarnabhumi-airport/.
      title: `Phoenix Gold Golf Bangkok (formerly Suvarnabhumi Golf & Country Club) — Green Fees & Guide`,
      // Not rendered for EN (see above) — kept accurate for the data shape and
      // for any future consumer that does read it.
      meta_description: `Phoenix Gold Golf Bangkok, formerly Suvarnabhumi Golf & Country Club — green fees, 36-hole Robert Trent Jones Jr. course guide, and golf club rentals delivered to your Bangkok hotel.`,
    },
    ko: null,
    zh: null,
    ja: null,
  },
  status: 'published',
  published_at: '2026-04-16',
}
