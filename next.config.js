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
    // Include both trailing-slash variants to avoid 2-hop redirects (trailingSlash: true)
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
      // URL was live and indexed, so it 301s rather than 404s.
      { source: '/golf-courses/bangkok/kumlung-ake-golf-course', destination: '/golf-courses/isan/kumlung-ake-golf-course/', permanent: true },
      { source: '/golf-courses/bangkok/kumlung-ake-golf-course/', destination: '/golf-courses/isan/kumlung-ake-golf-course/', permanent: true },

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
