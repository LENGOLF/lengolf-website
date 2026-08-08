#!/usr/bin/env tsx
/**
 * Generic GSC query script for len.golf.
 * Usage examples:
 *   npx tsx scripts/gsc-query.ts sites
 *   npx tsx scripts/gsc-query.ts top-queries 28
 *   npx tsx scripts/gsc-query.ts top-pages 28
 *   npx tsx scripts/gsc-query.ts summary 28
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const CREDENTIALS_PATH =
  process.env.GSC_CREDENTIALS_PATH ??
  path.join(process.cwd(), 'search-console-access-487306-dbcd7b7eecec.json');
const SITE_URL = process.env.GSC_SITE_URL ?? 'sc-domain:len.golf';

function daysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().split('T')[0];
}

async function getClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const authClient = await auth.getClient();
  return google.searchconsole({ version: 'v1', auth: authClient as never });
}

async function listSites() {
  const sc = await getClient();
  const res = await sc.sites.list({});
  console.log('Available sites:');
  res.data.siteEntry?.forEach((s) =>
    console.log(`  - ${s.siteUrl}  [${s.permissionLevel}]`),
  );
}

async function query(dimension: 'query' | 'page', days: number, limit = 25) {
  const sc = await getClient();
  const endDate = daysAgo(1); // GSC data lags ~2 days; use yesterday
  const startDate = daysAgo(days + 1);
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions: [dimension],
      rowLimit: limit,
      type: 'web',
    },
  });
  console.log(`\nSite: ${SITE_URL}`);
  console.log(`Range: ${startDate} → ${endDate} (${days}d)\n`);
  const rows = (res.data.rows ?? []).sort(
    (a, b) => (b.clicks ?? 0) - (a.clicks ?? 0),
  );
  if (rows.length === 0) {
    console.log('No rows.');
    return;
  }
  console.log(
    `${'#'.padStart(3)}  ${'clicks'.padStart(6)}  ${'impr'.padStart(
      7,
    )}  ${'ctr'.padStart(6)}  ${'pos'.padStart(5)}  ${dimension}`,
  );
  rows.forEach((r, i) => {
    const c = r.clicks ?? 0;
    const imp = r.impressions ?? 0;
    const ctr = imp ? ((c / imp) * 100).toFixed(2) + '%' : '-';
    const pos = (r.position ?? 0).toFixed(1);
    console.log(
      `${String(i + 1).padStart(3)}  ${String(c).padStart(6)}  ${String(imp).padStart(
        7,
      )}  ${ctr.padStart(6)}  ${pos.padStart(5)}  ${r.keys?.[0] ?? ''}`,
    );
  });
}

async function summary(days: number) {
  const sc = await getClient();
  const endDate = daysAgo(1);
  const startDate = daysAgo(days + 1);
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: [], type: 'web' },
  });
  const r = res.data.rows?.[0];
  console.log(`\nSite: ${SITE_URL}`);
  console.log(`Range: ${startDate} → ${endDate} (${days}d)`);
  if (!r) {
    console.log('No data.');
    return;
  }
  console.log(`Clicks:      ${r.clicks}`);
  console.log(`Impressions: ${r.impressions}`);
  console.log(`CTR:         ${((r.ctr ?? 0) * 100).toFixed(2)}%`);
  console.log(`Position:    ${(r.position ?? 0).toFixed(2)}`);
}

async function main() {
  const cmd = process.argv[2] ?? 'summary';
  const days = Number(process.argv[3] ?? '28');
  const limit = Number(process.argv[4] ?? '25');
  try {
    if (cmd === 'sites') await listSites();
    else if (cmd === 'summary') await summary(days);
    else if (cmd === 'top-queries') await query('query', days, limit);
    else if (cmd === 'top-pages') await query('page', days, limit);
    else {
      console.error(`Unknown command: ${cmd}`);
      console.error(
        'Usage: gsc-query.ts <sites|summary|top-queries|top-pages> [days]',
      );
      process.exit(1);
    }
  } catch (e: unknown) {
    const err = e as { message?: string; errors?: unknown };
    console.error('Error:', err.message ?? e);
    if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
    process.exit(1);
  }
}

main();
