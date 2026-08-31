const createNextIntlPlugin = require('next-intl/plugin')
const { LEGACY_BLOG_SLUGS } = require('./lib/blog-slugs.js')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// NEXT_PUBLIC_* vars are inlined at build time, so a key dropped from the
// Vercel env fails SILENTLY: every map (course satellite maps, region/hub
// explorers) degrades to its link/unavailable fallback with no error
// anywhere. Make that visible in the build log instead. Suppressed on
// GitHub Actions, where the key is intentionally not a secret — an
// unconditional warning on every CI run would train everyone to ignore it.
if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY && !process.env.GITHUB_ACTIONS) {
  console.warn(
    '[next.config] NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY is not set — all Google Maps ' +
      'sections (course satellite maps, region/hub explorers) will render their ' +
      'link-only fallbacks in this build.'
  )
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['isomorphic-dompurify', 'dompurify'],
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.len.golf',
      },
      {
        protocol: 'https',
        hostname: 'len.golf',
      },
      {
        protocol: 'https',
        hostname: 'bisimqmtxjsptehhqpeg.supabase.co',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        // Advertise the curated AI-assistant site map (app/llms.txt/route.ts)
        // on every page. An HTTP header rather than a <head> tag because Next
        // merges route metadata per KEY: `alternates` is declared page-level
        // on most routes (canonical), so a layout-level alternates.types would
        // be silently REPLACED on exactly those pages — the og:site_name trap
        // (see validate:open-graph in CLAUDE.md) all over again. One header
        // here covers every route with nothing to keep in sync.
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value:
              '<https://www.len.golf/llms.txt>; rel="alternate"; type="text/plain"; title="LLM-friendly site map"',
          },
        ],
      },
      {
        source: "/:path*.(ico|svg|png|jpg|jpeg|gif|webp)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.(woff|woff2|ttf|otf|eot)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    // WordPress blog posts lived at root level (/{slug}/).
    // Next.js serves them under /blog/{slug}/.
    // These 301 redirects preserve SEO equity from the old WordPress URLs.
    // Blog slugs are now defined in lib/blog-slugs.ts for reuse in middleware.

    // All destinations use trailing slashes to match trailingSlash: true
    // and avoid extra redirect hops from trailing-slash normalization.
    const blogRedirects = LEGACY_BLOG_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/blog/${slug}/`,
      permanent: true,
    }))

    // WordPress page-type taxonomy -> relevant Next.js service pages
    const pageTypeRedirects = [
      { source: '/page-type/corporate-events', destination: '/events/', permanent: true },
      { source: '/page-type/golf-club-rental', destination: '/golf-club-rental/', permanent: true },
      { source: '/page-type/golf-lessons', destination: '/lessons/', permanent: true },
      { source: '/page-type/golf-near', destination: '/golf/', permanent: true },
      { source: '/page-type/indoor-golf', destination: '/golf/', permanent: true },
      { source: '/page-type/things-to-do', destination: '/events/', permanent: true },
    ]

    // WordPress location-area taxonomy -> most relevant location page per area
    const locationAreas = [
      'ari', 'asok', 'chidlom', 'ekkamai', 'nana', 'phaya-thai',
      'phrom-phong', 'ploenchit', 'ratchadamri', 'sathorn', 'siam',
      'silom', 'sukhumvit', 'thong-lo',
    ]
    const locationAreaRedirects = locationAreas.map((area) => ({
      source: `/location-area/${area}`,
      destination: `/location/indoor-golf-${area}/`,
      permanent: true,
    }))

    // Fix for GSC 404 errors: redirect root-level location pages to /location/ prefix
    // NOTE: the no-slash variants below are REDUNDANT — but not for the reason
    // this note gave until 2026-08-23, and the difference matters. TRUE: with
    // trailingSlash: true a no-slash REQUEST is normalised to /x/ before this
    // table is consulted, so a slash-less inbound link costs two hops.
    // WRONG, as this note used to say: "only the trailing-slash `source` ever
    // matches". Next normalises the source PATTERN too, so /tournaments/
    // matches the no-slash source /tournaments in ONE hop (measured on prod,
    // likewise /bangkok-golf-centre-vs-lengolf/). The two spellings are the
    // SAME rule, so listing both is redundant — NOT one of them being dead.
    // Do not read this as licence to delete no-slash sources: blogRedirects,
    // pageTypeRedirects, locationAreaRedirects and /tournaments are no-slash
    // ONLY, and deleting theirs removes the rule entirely.
    // The pairs below are harmless but double the surface
    // an editor must keep in sync, and a typo in the redundant half is
    // undetectable — do not add more pairs on the belief that they help.
    // Outcome is asserted by redirectChainTests in scripts/smoke-test.ts,
    // which follows the no-slash form to its final landing path.
    const rootLocationRedirects = [
      { source: '/indoor-golf-ploenchit', destination: '/location/indoor-golf-ploenchit/', permanent: true },
      { source: '/indoor-golf-ploenchit/', destination: '/location/indoor-golf-ploenchit/', permanent: true },
      { source: '/golf-near-sathorn', destination: '/location/golf-near-sathorn/', permanent: true },
      { source: '/golf-near-sathorn/', destination: '/location/golf-near-sathorn/', permanent: true },
      { source: '/golf-near-phrom-phong', destination: '/location/golf-near-phrom-phong/', permanent: true },
      { source: '/golf-near-phrom-phong/', destination: '/location/golf-near-phrom-phong/', permanent: true },
      { source: '/golf-near-thong-lo', destination: '/location/golf-near-thong-lo/', permanent: true },
      { source: '/golf-near-thong-lo/', destination: '/location/golf-near-thong-lo/', permanent: true },
      { source: '/golf-near-silom', destination: '/location/golf-near-silom/', permanent: true },
      { source: '/golf-near-silom/', destination: '/location/golf-near-silom/', permanent: true },
      { source: '/golf-near-sukhumvit', destination: '/location/golf-near-sukhumvit/', permanent: true },
      { source: '/golf-near-sukhumvit/', destination: '/location/golf-near-sukhumvit/', permanent: true },
      { source: '/golf-near-phaya-thai', destination: '/location/golf-near-phaya-thai/', permanent: true },
      { source: '/golf-near-phaya-thai/', destination: '/location/golf-near-phaya-thai/', permanent: true },
      { source: '/indoor-golf-thong-lo', destination: '/location/indoor-golf-thong-lo/', permanent: true },
      { source: '/indoor-golf-thong-lo/', destination: '/location/indoor-golf-thong-lo/', permanent: true },
      { source: '/corporate-events-asok', destination: '/location/corporate-events-asok/', permanent: true },
      { source: '/corporate-events-asok/', destination: '/location/corporate-events-asok/', permanent: true },
      { source: '/golf-near-ari', destination: '/location/golf-near-ari/', permanent: true },
      { source: '/golf-near-ari/', destination: '/location/golf-near-ari/', permanent: true },
      { source: '/golf-near-ekkamai', destination: '/location/golf-near-ekkamai/', permanent: true },
      { source: '/golf-near-ekkamai/', destination: '/location/golf-near-ekkamai/', permanent: true },
      { source: '/lesson', destination: '/lessons/', permanent: true },
      { source: '/lesson/', destination: '/lessons/', permanent: true },
      // Legacy WordPress area-lesson page (indexed, now 404) -> its dedicated
      // location page, matching the sibling /{template}-{area} pattern above.
      { source: '/golf-lessons-ari', destination: '/location/golf-lessons-ari/', permanent: true },
      { source: '/golf-lessons-ari/', destination: '/location/golf-lessons-ari/', permanent: true },
      // GSC 404s: root-level corporate-events pages missing from the list above
      // (siblings of /corporate-events-asok). Both have live /location/ pages.
      { source: '/corporate-events-ratchadamri', destination: '/location/corporate-events-ratchadamri/', permanent: true },
      { source: '/corporate-events-ratchadamri/', destination: '/location/corporate-events-ratchadamri/', permanent: true },
      { source: '/corporate-events-thong-lo', destination: '/location/corporate-events-thong-lo/', permanent: true },
      { source: '/corporate-events-thong-lo/', destination: '/location/corporate-events-thong-lo/', permanent: true },
    ]

    // Rental-page consolidation: /rent-golf-clubs-bangkok/ was a duplicate
    // of /golf-course-club-rental/ (same title, description, h1, namespace).
    // 301 to consolidate organic equity onto the older, more descriptive URL.
    const rentalConsolidationRedirects = [
      { source: '/rent-golf-clubs-bangkok', destination: '/golf-course-club-rental/', permanent: true },
      { source: '/rent-golf-clubs-bangkok/', destination: '/golf-course-club-rental/', permanent: true },
      { source: '/:locale(th|ko|ja|zh)/rent-golf-clubs-bangkok', destination: '/:locale/golf-course-club-rental/', permanent: true },
      { source: '/:locale(th|ko|ja|zh)/rent-golf-clubs-bangkok/', destination: '/:locale/golf-course-club-rental/', permanent: true },
    ]

    // Trust-anchor aliases: /about, /contact and /privacy are the names an
    // agent or a person guesses before the fuller ones this site uses, and
    // all three returned 404 (measured on prod 2026-08-23, root and
    // locale-prefixed forms alike). /about-us/ is the right target for
    // /contact/ rather than a stub: it renders <ContactInfo /> and
    // <ContactForm /> — address, phone, email — under a "Contact
    // Information" heading. (It does NOT show opening hours there; those are
    // in the site-wide footer, so don't cite them as a reason.)
    //
    // ONE form per source is enough. Be precise about why, because the
    // sibling note on rootLocationRedirects is half right and the wrong half
    // is dangerous. Right: with trailingSlash: true a no-slash REQUEST is
    // normalised to the slash form before this table is consulted, which is
    // why /about costs two hops (measured locally — the second hop is not on
    // prod until this ships, so only the normalisation hop is observable there). Wrong: "only the trailing-slash
    // source ever matches" — Next normalises the source PATTERN too, so
    // /tournaments/ matches the no-slash source /tournaments in ONE hop
    // (measured on prod, likewise /bangkok-golf-centre-vs-lengolf/). The two
    // spellings are therefore the SAME rule, and listing both is redundant
    // rather than one of them being dead. Do not read that note as licence to
    // delete no-slash sources: blogRedirects, pageTypeRedirects,
    // locationAreaRedirects and /tournaments are no-slash ONLY, so deleting
    // theirs removes the rule entirely.
    //
    // The locale forms are listed because they already resolve and would
    // otherwise land on ENGLISH: prod shows /th/about/ 301 -> /about/, which
    // with the root rule below would continue to /about-us/ and serve 200 in
    // English, even though /about-us/ is translated in all four locales
    // (lib/translated-routes.ts). A config redirect pre-empts that middleware
    // 301 because redirects run before middleware. /privacy-policy/ is NOT a
    // translated route, so its locale form correctly targets the unprefixed
    // English page instead of /:locale/.
    //
    // TRAP, same shape as the /compare/ redirects below: redirects match
    // BEFORE the filesystem. If anyone later adds app/[locale]/contact/ (or
    // /about/, /privacy/), the page is unreachable behind its own redirect
    // and redirectChainTests stays GREEN, because it only asserts the chain
    // still ends at /about-us/. Delete the matching entry here when that
    // happens, and add the new route to routeTests in scripts/smoke-test.ts,
    // which DOES fail when a route's final path differs from its request.
    const trustAnchorRedirects = [
      { source: '/about/', destination: '/about-us/', permanent: true },
      { source: '/contact/', destination: '/about-us/', permanent: true },
      { source: '/privacy/', destination: '/privacy-policy/', permanent: true },
      { source: '/:locale(th|ko|ja|zh)/about/', destination: '/:locale/about-us/', permanent: true },
      { source: '/:locale(th|ko|ja|zh)/contact/', destination: '/:locale/about-us/', permanent: true },
      { source: '/:locale(th|ko|ja|zh)/privacy/', destination: '/privacy-policy/', permanent: true },
    ]

    // GSC 404s: content that lives under one section prefix was crawled under
    // the other (/faq/<guide-slug> and /guide/<faq-slug>). Current internal
    // links are clean (validate:links passes) — these are legacy URLs Google
    // still remembers. 301 each to where the content actually lives. Both
    // trailing-slash variants are listed to avoid a second normalization hop.
    const guideSlugsUnderFaq = [
      'renting-golf-clubs-thai-golf-courses',
      'best-golf-courses-near-bangkok',
      'what-to-wear-golf-thailand',
      'how-to-pack-golf-clubs-flight-thailand',
      'golf-club-baggage-fees-airlines-bangkok',
      'golf-lessons-bangkok-coaches',
    ]
    const faqSlugsUnderGuide = [
      'what-golf-clubs-available-rent-bangkok',
      'grab-vs-taxi-bangkok-golf',
      'do-you-need-caddie-thailand-golf',
    ]
    const prefixCorrectionRedirects = [
      ...guideSlugsUnderFaq.flatMap((slug) => [
        { source: `/faq/${slug}`, destination: `/guide/${slug}/`, permanent: true },
        { source: `/faq/${slug}/`, destination: `/guide/${slug}/`, permanent: true },
      ]),
      ...faqSlugsUnderGuide.flatMap((slug) => [
        { source: `/guide/${slug}`, destination: `/faq/${slug}/`, permanent: true },
        { source: `/guide/${slug}/`, destination: `/faq/${slug}/`, permanent: true },
      ]),
    ]

    return [
      ...blogRedirects,
      ...pageTypeRedirects,
      ...locationAreaRedirects,
      ...rootLocationRedirects,
      ...rentalConsolidationRedirects,
      ...trustAnchorRedirects,
      ...prefixCorrectionRedirects,

      // WordPress tag, category, and author archives -> blog listing
      { source: '/tag/:slug', destination: '/blog/', permanent: true },
      { source: '/tag/:slug/:path*', destination: '/blog/', permanent: true },
      { source: '/category/:slug', destination: '/blog/', permanent: true },
      { source: '/category/:slug/:path*', destination: '/blog/', permanent: true },
      { source: '/author/:slug', destination: '/blog/', permanent: true },
      { source: '/author/:slug/:path*', destination: '/blog/', permanent: true },

      // WordPress pagination archives -> blog listing
      { source: '/page/:path*', destination: '/blog/', permanent: true },

      // WordPress feed URLs -> blog listing
      { source: '/feed', destination: '/blog/', permanent: true },
      { source: '/feed/:path*', destination: '/blog/', permanent: true },
      { source: '/comments/feed', destination: '/blog/', permanent: true },

      // WordPress internal paths now return 404 (removed redirects).
      // Modern crawlers handle 404s properly; returning 404 is more semantically
      // correct than redirecting to homepage (which creates soft-404s).

      // WordPress image uploads -> relevant pages (not homepage).
      // Grouped by content type based on WordPress upload folder audit.
      // Lesson-related images (coach photos, packages, student photos)
      { source: '/wp-content/uploads/:y/:m/Copy-of-Pro-Boss:path*', destination: '/lessons/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/Pro-Rat:path*', destination: '/lessons/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/pro-min:path*', destination: '/lessons/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/GOLF_COACHING:path*', destination: '/lessons/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/Poster-for-Free-Swing:path*', destination: '/lessons/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/LENGOLF-Starter-Package:path*', destination: '/lessons/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/coachkids:path*', destination: '/lessons/', permanent: true },
      // Event-related images (venue photos, event setups)
      { source: '/wp-content/uploads/:y/:m/0B4A:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/DSC0:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/Copy_of_IMG:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/DJI_:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/online-conference:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/flags:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/people:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/handshake:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/confetti:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/film-camera:path*', destination: '/events/', permanent: true },
      // Tournament images
      { source: '/wp-content/uploads/:y/:m/TOURNAMENT:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/Copy-of-20240616:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/20240616:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/Copy-of-IMG_47:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/Copy-of-IMG_48:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/Copy-of-IMG_49:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/IMG_47:path*', destination: '/events/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/S__3792:path*', destination: '/events/', permanent: true },
      // Golf/setup images
      { source: '/wp-content/uploads/:y/:m/WAYS_TO_PLAY:path*', destination: '/golf/', permanent: true },
      { source: '/wp-content/uploads/:y/:m/OUR_SETUP:path*', destination: '/golf/', permanent: true },
      // Branding / logo
      { source: '/wp-content/uploads/:y/:m/Logo:path*', destination: '/', permanent: true },
      // Catch-all for remaining wp-content (promotional banners, misc) -> homepage
      { source: '/wp-content/:path*', destination: '/', permanent: true },

      // Tournaments page removed — redirect to events
      { source: '/tournaments', destination: '/events/', permanent: true },

      // Life Privilege CC re-regioned from Bangkok → Khao Yai (2026-04-20)
      { source: '/golf-courses/bangkok/life-privilege-country-club', destination: '/golf-courses/khao-yai/life-privilege-country-club/', permanent: true },
      { source: '/golf-courses/bangkok/life-privilege-country-club/', destination: '/golf-courses/khao-yai/life-privilege-country-club/', permanent: true },

      // Kumlung-Ake re-regioned from Bangkok → Isan (2026-08). It is in Loei
      // province: 500km / 6.5h from Bangkok, phone area code 042, and its own
      // meta description already said "in Loei province" — while the Bangkok
      // hub advertises courses within 90 minutes of the city centre. The old
      // URL was live and indexed, so it redirects rather than 404s (Next
      // emits 308 for `permanent: true`, which is what the smoke test asserts).
      { source: '/golf-courses/bangkok/kumlung-ake-golf-course', destination: '/golf-courses/isan/kumlung-ake-golf-course/', permanent: true },
      { source: '/golf-courses/bangkok/kumlung-ake-golf-course/', destination: '/golf-courses/isan/kumlung-ake-golf-course/', permanent: true },

      // Two more Bangkok-hub courses that fail the same 90-minute test
      // (2026-08). Toscana Valley is in Nakhon Ratchasima, 150km / 2h, and its
      // own meta description already said "Khao Yai"; Nichigo is in
      // Kanchanaburi, 155km / 2h45m. Both URLs were live and indexed.
      { source: '/golf-courses/bangkok/toscana-valley-country-club', destination: '/golf-courses/khao-yai/toscana-valley-country-club/', permanent: true },
      { source: '/golf-courses/bangkok/toscana-valley-country-club/', destination: '/golf-courses/khao-yai/toscana-valley-country-club/', permanent: true },
      { source: '/golf-courses/bangkok/nichigo-resort-country-club', destination: '/golf-courses/kanchanaburi/nichigo-resort-country-club/', permanent: true },
      { source: '/golf-courses/bangkok/nichigo-resort-country-club/', destination: '/golf-courses/kanchanaburi/nichigo-resort-country-club/', permanent: true },

      // Duplicate-course merge (2026-08). `suvarnabhumi-golf-country-club` and
      // `phoenix-gold-golf-country-club` described the SAME 36-hole Robert
      // Trent Jones Jr. facility in Nong Chok under two names — each file's own
      // prose said so, and the audit at docs/golf-course-content-audit-2026-07.md
      // item 8 confirmed it by web research. The Phoenix Gold slug survives
      // because that is the club's current trading name.
      //
      // The retired URL was the site's largest course page (1,792 impressions /
      // 90d), so this redirect carries real equity — but 96% of those were
      // "golf near Suvarnabhumi airport" queries ranking at position ~37 with
      // ZERO clicks, which this page was absorbing away from
      // /golf-courses/near/suvarnabhumi-airport/ (never once impressed, while
      // the identically-generated Don Mueang page holds position ~14.6). The
      // 67 impressions and all 4 clicks that were genuinely branded pass
      // through this 308.
      //
      // IF THIS MERGE IS EVER UNDONE, DELETE ALL FOUR RULES BELOW FIRST.
      // Redirects match BEFORE the filesystem, so restoring the data file and
      // its index entry without removing these leaves the resurrected page
      // unreachable behind its own 308 — with every CI check green. That is
      // the same reverse trap CLAUDE.md documents for the /compare/ pairs.
      { source: '/golf-courses/bangkok/suvarnabhumi-golf-country-club', destination: '/golf-courses/bangkok/phoenix-gold-golf-country-club/', permanent: true },
      { source: '/golf-courses/bangkok/suvarnabhumi-golf-country-club/', destination: '/golf-courses/bangkok/phoenix-gold-golf-country-club/', permanent: true },
      // The OG-image child route is a SEPARATE generateStaticParams route
      // (app/[locale]/golf-courses/[region]/[slug]/opengraph-image.tsx, also
      // dynamicParams=false), so the page rule above does not cover it.
      //
      // TWO different URLs exist for that image, and BOTH end up covered —
      // but by different routes, so state them separately rather than
      // collapsing them.
      //
      // (1) The schema.org `image`, hand-built at
      // app/[locale]/golf-courses/[region]/[slug]/page.tsx as
      // `${enUrl}opengraph-image/` — unprefixed, trailing slash. That is the
      // shape the retired page published in its GolfCourse JSON-LD, and the
      // rule below matches it DIRECTLY. scripts/smoke-test.ts pins it.
      //
      // (2) The <meta og:image>, which Next's file convention emits
      // locale-prefixed and content-hashed (/en/…/opengraph-image?<hash>).
      // No `source` here targets it directly — the obstacle is the /en
      // PREFIX, not the query (a redirect `source` matches the pathname
      // only; the query is never part of it). It is still covered
      // TRANSITIVELY: localePrefix is 'as-needed' in i18n/routing.ts, so
      // next-intl 307s /en/… to the unprefixed path, which this rule then
      // 308s. Verified on prod against a live course page: the chain is
      // 307 -> 308 -> 200.
      //
      // Do not restate this as "the meta URL is uncovered". An earlier
      // revision said exactly that, concluded no `source` could match, and
      // DROPPED the rule — which is how the JSON-LD URL lost its redirect.
      // The four earlier re-region redirects above still leave their OG
      // children uncovered; this is the first that does not.
      { source: '/golf-courses/bangkok/suvarnabhumi-golf-country-club/opengraph-image', destination: '/golf-courses/bangkok/phoenix-gold-golf-country-club/opengraph-image/', permanent: true },
      { source: '/golf-courses/bangkok/suvarnabhumi-golf-country-club/opengraph-image/', destination: '/golf-courses/bangkok/phoenix-gold-golf-country-club/opengraph-image/', permanent: true },

      // Fallout of the two re-regions above. /golf-courses/compare/<region>/
      // <pair> is DERIVED from each region's top 3 by popularityScore, and the
      // route sets dynamicParams = false, so a pair that drops out of the top 3
      // becomes a hard 404 — and these URLs are in app/sitemap.ts, i.e. already
      // submitted to Google. Toscana (score 7800) displaces Rancho Charnvee in
      // khao-yai; Nichigo (3300) displaces Blue Sapphire in kanchanaburi,
      // retiring four indexed comparison pages.
      //
      // Target is the region hub, not a surviving pair: the hub is the canonical
      // parent, lists both courses of the retired comparison, and does not
      // misrepresent one comparison as another. Both displaced courses keep
      // their own detail pages, which the hub links.
      //
      // TRAP: redirects match BEFORE the filesystem, so if one of these pairs
      // ever re-enters its region's top 3 the regenerated page becomes
      // unreachable behind its own redirect. The margins are thin — rancho-
      // charnvee 3650 vs khao-yai-golf-club 3700, blue-sapphire 3000 vs
      // nichigo 3300 — so a single fee correction or a website field can flip
      // one back. Delete the matching entry here when that happens.
      //
      // Kanchanaburi is thinner than the 300-point gap suggests: blue-sapphire's
      // 3000 is a THREE-WAY TIE with evergreen-hills-golf-club and
      // woo-sung-castle-hill, and blue-sapphire only holds 4th place because
      // byPopularity() breaks ties on slug.localeCompare. Editing any of those
      // three, or renaming a slug, reshuffles 4th–6th; +300 on any of them
      // enters the top 3 and rewrites which compare pages exist.
      //
      // NOTE for future course edits: this churn is not unique to re-regioning.
      // Editing a green fee, adding a website, or lengthening prose can move a
      // course across the top-3 line and retire a compare URL just as silently.
      // There is no guard for it; see the follow-up.
      { source: '/golf-courses/compare/khao-yai/life-privilege-country-club-vs-rancho-charnvee-country-club', destination: '/golf-courses/khao-yai/', permanent: true },
      { source: '/golf-courses/compare/khao-yai/life-privilege-country-club-vs-rancho-charnvee-country-club/', destination: '/golf-courses/khao-yai/', permanent: true },
      { source: '/golf-courses/compare/khao-yai/khao-yai-golf-club-vs-rancho-charnvee-country-club', destination: '/golf-courses/khao-yai/', permanent: true },
      { source: '/golf-courses/compare/khao-yai/khao-yai-golf-club-vs-rancho-charnvee-country-club/', destination: '/golf-courses/khao-yai/', permanent: true },
      { source: '/golf-courses/compare/kanchanaburi/blue-sapphire-golf-resort-vs-grand-prix-golf-club', destination: '/golf-courses/kanchanaburi/', permanent: true },
      { source: '/golf-courses/compare/kanchanaburi/blue-sapphire-golf-resort-vs-grand-prix-golf-club/', destination: '/golf-courses/kanchanaburi/', permanent: true },
      { source: '/golf-courses/compare/kanchanaburi/blue-sapphire-golf-resort-vs-dragon-hills-golf-country-club', destination: '/golf-courses/kanchanaburi/', permanent: true },
      { source: '/golf-courses/compare/kanchanaburi/blue-sapphire-golf-resort-vs-dragon-hills-golf-country-club/', destination: '/golf-courses/kanchanaburi/', permanent: true },

      // LINE shortlink — used as sitelink URL in Google Ads (lin.ee domain causes
      // "Destination mismatch" disapproval, so we redirect via our own domain)
      { source: '/line', destination: 'https://lin.ee/uxQpIXn', permanent: false },
      { source: '/line/', destination: 'https://lin.ee/uxQpIXn', permanent: false },

      // WordPress search -> homepage (no search in Next.js app)
      { source: '/search/:path*', destination: '/', permanent: false },
    ]
  },
};

module.exports = withNextIntl(nextConfig);
