#!/usr/bin/env tsx
/**
 * Landing-page -> CTA funnel for the translated (non-EN) pages.
 *
 * Answers: "of the sessions that ENTERED the site on a translated page, how
 * many went on to click a CTA — including a CTA on a different page?"
 *
 * Why this shape works: in GA4 `landingPage` is SESSION-scoped, so pairing it
 * with the `sessions` metric and an `eventName` breakdown yields "sessions that
 * entered on page P and fired event E at some point in that session" — the
 * event does not have to happen on P. That is exactly the cross-page question.
 *
 * Scope limit worth knowing before quoting numbers: this is session-scoped, not
 * user-scoped. A visitor who lands on /ja/guide/... today and books next week
 * in a fresh session is credited to the LATER session's landing page. True
 * first-touch attribution needs the GA4 BigQuery export (or a first-touch
 * custom dimension); see the note at the bottom of the README section.
 *
 * Usage:
 *   GA4_PROPERTY_ID=123456789 npx tsx scripts/ga4-landing-funnel.ts [days]
 *   GA4_PROPERTY_ID=123456789 npx tsx scripts/ga4-landing-funnel.ts --events
 *
 * `--events` lists every eventName the property actually collects, so the CTA
 * allowlist below can be set from evidence rather than assumption.
 *
 * Auth: reuses the Search Console service account by default. That account must
 * be granted Viewer on the GA4 property, and the Analytics Data API must be
 * enabled in its Google Cloud project.
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import {
  getRegisteredGuidePaths,
  getRegisteredFaqPaths,
  getRegisteredRegionHubPaths,
  getRegisteredPriceTierPaths,
  getRegisteredCourseDetailPaths,
} from '../lib/translated-routes';

const CREDENTIALS_PATH =
  process.env.GSC_CREDENTIALS_PATH ??
  path.join(process.cwd(), 'search-console-access-487306-dbcd7b7eecec.json');
const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const LOCALES = ['th', 'ja', 'ko', 'zh'] as const;

/**
 * Events that count as "clicked a CTA".
 *
 * `rental_intent` is the only CTA event this codebase pushes itself
 * (lib/analytics.ts, fired by the club-rental funnel). The primary Book Now
 * button (components/shared/BookingCTA.tsx) pushes NOTHING, so booking clicks
 * are only visible via GA4 Enhanced Measurement's automatic outbound `click`
 * event — which is site-wide and cannot distinguish a Book Now press from any
 * other external link. Run with `--events` first and refine this list.
 */
const CTA_EVENTS = ['rental_intent', 'click', 'generate_lead', 'form_submit'];

function daysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().split('T')[0];
}

async function getClient() {
  if (!PROPERTY_ID) {
    console.error('GA4_PROPERTY_ID is not set. Find it in GA4 → Admin → Property Settings.');
    process.exit(1);
  }
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const authClient = await auth.getClient();
  return google.analyticsdata({ version: 'v1beta', auth: authClient as never });
}

/** Every translated path we shipped, as the locale-prefixed URL path GA4 sees. */
function translatedPaths(): Map<string, string> {
  const out = new Map<string, string>(); // '/ja/guide/x' -> 'ja'
  for (const locale of LOCALES) {
    const paths = [
      '/',
      ...getRegisteredGuidePaths(locale),
      ...getRegisteredFaqPaths(locale),
      ...getRegisteredRegionHubPaths(locale),
      ...getRegisteredPriceTierPaths(locale),
      ...getRegisteredCourseDetailPaths(locale),
    ];
    for (const p of paths) {
      out.set(`/${locale}${p === '/' ? '' : p}`, locale);
    }
  }
  return out;
}

async function listEvents(days: number) {
  const ga = await getClient();
  const res = await ga.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: daysAgo(days), endDate: 'yesterday' }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }, { name: 'sessions' }],
      limit: '200',
    },
  });
  console.log(`\nEvents collected in the last ${days} days:\n`);
  console.log('eventName'.padEnd(34), 'events'.padStart(10), 'sessions'.padStart(10));
  for (const r of res.data.rows ?? []) {
    console.log(
      String(r.dimensionValues?.[0].value).padEnd(34),
      String(r.metricValues?.[0].value).padStart(10),
      String(r.metricValues?.[1].value).padStart(10),
    );
  }
  console.log('\nSet CTA_EVENTS in this file from the list above, then re-run without --events.');
}

async function funnel(days: number) {
  const ga = await getClient();
  const dateRanges = [{ startDate: daysAgo(days), endDate: 'yesterday' }];
  const known = translatedPaths();

  // Denominator: sessions that ENTERED on each landing page.
  const entries = await ga.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: {
      dateRanges,
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }],
      limit: '5000',
    },
  });

  // Numerator: sessions that entered on each landing page AND fired a CTA
  // event anywhere in that session (any page).
  const converted = await ga.properties.runReport({
    property: `properties/${PROPERTY_ID}`,
    requestBody: {
      dateRanges,
      dimensions: [{ name: 'landingPage' }, { name: 'eventName' }],
      metrics: [{ name: 'sessions' }, { name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: CTA_EVENTS },
        },
      },
      limit: '25000',
    },
  });

  type Row = { sessions: number; users: number; cta: number; ctaEvents: number };
  const byPath = new Map<string, Row>();
  for (const r of entries.data.rows ?? []) {
    const p = (r.dimensionValues?.[0].value ?? '').replace(/\/$/, '') || '/';
    byPath.set(p, {
      sessions: Number(r.metricValues?.[0].value ?? 0),
      users: Number(r.metricValues?.[1].value ?? 0),
      cta: 0,
      ctaEvents: 0,
    });
  }
  for (const r of converted.data.rows ?? []) {
    const p = (r.dimensionValues?.[0].value ?? '').replace(/\/$/, '') || '/';
    const row = byPath.get(p);
    if (!row) continue;
    // NOTE: summing sessions across eventName double-counts a session that
    // fired two different CTA events. Treated as an upper bound and flagged.
    row.cta += Number(r.metricValues?.[0].value ?? 0);
    row.ctaEvents += Number(r.metricValues?.[1].value ?? 0);
  }

  console.log(`\nGA4 property ${PROPERTY_ID} — last ${days} days (to yesterday)`);
  console.log(`CTA events counted: ${CTA_EVENTS.join(', ')}\n`);

  // Per-locale rollup over pages we actually shipped translations for.
  console.log('locale   landing sessions   sessions w/ CTA   rate    pages w/ entries');
  const perLocale: Record<string, Row & { pages: number }> = {};
  for (const [p, locale] of known) {
    const row = byPath.get(p);
    if (!row) continue;
    const acc = (perLocale[locale] ||= { sessions: 0, users: 0, cta: 0, ctaEvents: 0, pages: 0 });
    acc.sessions += row.sessions;
    acc.users += row.users;
    acc.cta += row.cta;
    acc.ctaEvents += row.ctaEvents;
    acc.pages += 1;
  }
  for (const locale of LOCALES) {
    const a = perLocale[locale];
    if (!a) { console.log(`${locale.padEnd(8)} (no sessions)`); continue; }
    const rate = a.sessions ? ((100 * a.cta) / a.sessions).toFixed(1) : '0.0';
    console.log(
      `${locale.padEnd(8)} ${String(a.sessions).padStart(16)} ${String(a.cta).padStart(17)}   ${rate.padStart(5)}%  ${String(a.pages).padStart(6)}`,
    );
  }

  // Per-page detail, busiest first.
  const detail = [...known.keys()]
    .map((p) => ({ p, locale: known.get(p)!, ...(byPath.get(p) ?? { sessions: 0, users: 0, cta: 0, ctaEvents: 0 }) }))
    .filter((r) => r.sessions > 0)
    .sort((a, b) => b.sessions - a.sessions);

  console.log('\nlanding page'.padEnd(58), 'sessions'.padStart(9), 'w/ CTA'.padStart(8), 'rate'.padStart(7));
  for (const r of detail.slice(0, 60)) {
    const rate = r.sessions ? ((100 * r.cta) / r.sessions).toFixed(1) + '%' : '-';
    console.log(r.p.padEnd(58), String(r.sessions).padStart(9), String(r.cta).padStart(8), rate.padStart(7));
  }

  fs.writeFileSync(
    'ga4-landing-funnel.json',
    JSON.stringify({ days, ctaEvents: CTA_EVENTS, perLocale, detail }, null, 2),
  );
  console.log('\nWrote ga4-landing-funnel.json');
}

const args = process.argv.slice(2);
const days = Number(args.find((a) => /^\d+$/.test(a)) ?? 28);
(args.includes('--events') ? listEvents(days) : funnel(days)).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
