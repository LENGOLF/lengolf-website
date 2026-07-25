/**
 * Lighthouse CI configuration: the mobile performance floor for len.golf.
 *
 * WHY THIS EXISTS
 * In March 2026 /golf-course-club-rental/ scored 88 on Lighthouse mobile with an
 * LCP of 2.6s. By July 2026 the same page had degraded to roughly 49-60 with an
 * LCP of 10.9-12.2s, and nobody noticed for four months because no automated
 * check watched performance. This config is that watchdog. It is deliberately a
 * regression floor, not a target: the numbers below sit well under what the site
 * measures today, so the check is green on the current build and only goes red
 * when something makes the site meaningfully slower than it already is. Raise
 * the floor as pages get faster, never lower it to make a red build pass.
 *
 * WHY THE HOMEPAGE (/) IS NOT IN THIS LIST
 * The homepage is the one page carrying an infinitely looping autoplay hero
 * video (confirmed: it renders a <video ... loop>, the three URLs below render
 * no <video> at all). Lighthouse ends its trace once the page reaches a
 * network-and-CPU-quiet state, and a video that never stops looping can prevent
 * that state from ever arriving. Earlier in this work the homepage was measured
 * twice on one unchanged build, minutes apart, returning a plausible score (72)
 * and then a flat 0 with no LCP value at all.
 *
 * Worth being precise about the current evidence: 6 consecutive local runs
 * against this build did NOT reproduce the 0, scoring a steady 69-72. So the
 * failure is either intermittent, or it was mitigated by PR #67 which took the
 * hero video off the critical path. Either way the homepage stays out of the
 * gate for now. A check that returns 0 at random is worse than no check,
 * because it trains everyone to ignore a red build, which is precisely the
 * blindness this PR exists to remove. The homepage is covered by manual review
 * (PageSpeed Insights and field data) instead. Revisit once it has a longer
 * track record of scoring reproducibly.
 *
 * Every URL below must stay video-free. If a looping video is ever added to one
 * of these pages, remove the URL from this list rather than loosening the
 * thresholds, otherwise the flake moves into the gate.
 */

module.exports = {
  ci: {
    collect: {
      // Assumes a production server is already running on :3000 (the CI job
      // starts one with the same curl-poll used by the smoke tests). Trailing
      // slashes are required: the site sets `trailingSlash: true`, so the
      // unslashed form 308s and Lighthouse would audit the redirect hop.
      url: [
        'http://localhost:3000/golf/',
        'http://localhost:3000/golf-course-club-rental/',
        'http://localhost:3000/lessons/',
      ],
      // Lighthouse is noisy run to run. Three runs asserted on the median,
      // which is what `lhci autorun` does by default, absorbs the jitter a
      // single run would turn into a false alarm.
      numberOfRuns: 3,
      settings: {
        // No form factor is set on purpose: Lighthouse's default already is
        // mobile (Moto G Power emulation, 4x CPU slowdown, simulated slow 4G),
        // and mobile is where this site's users and its regression lived.
        // Simulated throttling also means a payload blowup still shows up even
        // though CI fetches over a localhost connection with no real latency.
        //
        // Only the performance category is collected, which roughly halves run
        // time. Accessibility and SEO are already covered by the smoke tests
        // and the link/i18n validators in the lint job.
        onlyCategories: ['performance'],
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      // No `preset` here, so these two assertions are the only ones that run.
      // Pulling in lighthouse:recommended would drag in dozens of unrelated
      // audits and make the check impossible to keep green.
      assertions: {
        // Baseline, measured on a local production build (2026-07-25) as 3
        // passes x 3 runs per URL, 27 runs total, zero unscored:
        //   /golf/                    medians 72, 71, 72  (all runs 69-73)
        //   /golf-course-club-rental/ medians 69, 69, 69  (all runs 68-69)
        //   /lessons/                 medians 73, 72, 74  (all runs 69-74)
        // Production over a real network measures lower (roughly 50-62). A
        // floor of 0.45 sits under both, so it fires on a genuine regression
        // rather than on the gap between a CI runner and the real world.
        'categories:performance': ['error', { minScore: 0.45, aggregationMethod: 'median' }],
        // Same 27 runs: median LCP was 5.0-5.7s and no individual run exceeded
        // 6.0s. 15s is far past anything the current build produces, so noise
        // cannot reach it, and it still catches a blowup of the size that went
        // unnoticed for four months. Score alone is not enough here: the score
        // is a weighted blend and can stay flat while LCP alone doubles.
        'largest-contentful-paint': [
          'error',
          { maxNumericValue: 15000, aggregationMethod: 'median' },
        ],
      },
    },
    upload: {
      // Written to disk and attached to the workflow run as an artifact.
      // Deliberately NOT `temporary-public-storage`, which would publish every
      // report to a public URL on every PR.
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
}
