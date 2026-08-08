#!/usr/bin/env tsx
/**
 * Investigates the http:// vs https:// homepage split in GSC for len.golf.
 * Compares the two URL variants over time, by query, by country, and by device.
 */

import { google, type searchconsole_v1 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const CREDENTIALS_PATH =
  process.env.GSC_CREDENTIALS_PATH ??
  path.join(process.cwd(), 'search-console-access-487306-dbcd7b7eecec.json');
const SITE_URL = process.env.GSC_SITE_URL ?? 'sc-domain:len.golf';

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().split('T')[0];
}

const HTTP = 'http://www.len.golf/';
const HTTPS = 'https://www.len.golf/';

async function getClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const authClient = await auth.getClient();
  return google.searchconsole({ version: 'v1', auth: authClient as never });
}

type Row = searchconsole_v1.Schema$ApiDataRow;

async function q(
  sc: searchconsole_v1.Searchconsole,
  opts: searchconsole_v1.Schema$SearchAnalyticsQueryRequest,
): Promise<Row[]> {
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { type: 'web', ...opts },
  });
  return res.data.rows ?? [];
}

function pagesFilter(url: string): searchconsole_v1.Schema$ApiDimensionFilterGroup {
  return {
    filters: [{ dimension: 'page', operator: 'equals', expression: url }],
  };
}

function fmt(n: number | undefined): string {
  return (n ?? 0).toLocaleString('en-US');
}
function pct(n: number | undefined): string {
  return `${((n ?? 0) * 100).toFixed(2)}%`;
}
function pad(s: string | number, w: number, right = false): string {
  const str = String(s);
  return right ? str.padEnd(w) : str.padStart(w);
}

async function main() {
  const sc = await getClient();
  const days = 90;
  const endDate = daysAgo(2);
  const startDate = daysAgo(days + 1);

  console.log('━'.repeat(80));
  console.log(`HOMEPAGE SPLIT INVESTIGATION`);
  console.log(`Range: ${startDate} → ${endDate}  (${days} days)`);
  console.log('━'.repeat(80));

  // 1. Overall totals for each URL
  const httpTotals = await q(sc, {
    startDate,
    endDate,
    dimensions: [],
    dimensionFilterGroups: [pagesFilter(HTTP)],
  });
  const httpsTotals = await q(sc, {
    startDate,
    endDate,
    dimensions: [],
    dimensionFilterGroups: [pagesFilter(HTTPS)],
  });

  console.log('\n■ 90-DAY TOTALS');
  console.log(
    `  ${pad('variant', 6, true)}  ${pad('clicks', 7)}  ${pad(
      'impr',
      8,
    )}  ${pad('ctr', 6)}  ${pad('pos', 5)}`,
  );
  const h = httpTotals[0];
  const s = httpsTotals[0];
  console.log(
    `  ${pad('http', 6, true)}  ${pad(fmt(h?.clicks), 7)}  ${pad(
      fmt(h?.impressions),
      8,
    )}  ${pad(pct(h?.ctr), 6)}  ${pad((h?.position ?? 0).toFixed(2), 5)}`,
  );
  console.log(
    `  ${pad('https', 6, true)}  ${pad(fmt(s?.clicks), 7)}  ${pad(
      fmt(s?.impressions),
      8,
    )}  ${pad(pct(s?.ctr), 6)}  ${pad((s?.position ?? 0).toFixed(2), 5)}`,
  );

  // 2. Weekly trend for each
  const httpDaily = await q(sc, {
    startDate,
    endDate,
    dimensions: ['date'],
    dimensionFilterGroups: [pagesFilter(HTTP)],
    rowLimit: 1000,
  });
  const httpsDaily = await q(sc, {
    startDate,
    endDate,
    dimensions: ['date'],
    dimensionFilterGroups: [pagesFilter(HTTPS)],
    rowLimit: 1000,
  });

  type WeekAgg = {
    wk: string;
    httpClicks: number;
    httpImps: number;
    httpsClicks: number;
    httpsImps: number;
  };
  const weeks = new Map<string, WeekAgg>();
  const mondayOf = (date: string): string => {
    const d = new Date(date + 'T00:00:00Z');
    const dow = d.getUTCDay();
    const m = new Date(d);
    m.setUTCDate(d.getUTCDate() - ((dow + 6) % 7));
    return m.toISOString().split('T')[0];
  };
  for (const r of httpDaily) {
    const wk = mondayOf(r.keys?.[0] ?? '');
    const a = weeks.get(wk) ?? {
      wk,
      httpClicks: 0,
      httpImps: 0,
      httpsClicks: 0,
      httpsImps: 0,
    };
    a.httpClicks += r.clicks ?? 0;
    a.httpImps += r.impressions ?? 0;
    weeks.set(wk, a);
  }
  for (const r of httpsDaily) {
    const wk = mondayOf(r.keys?.[0] ?? '');
    const a = weeks.get(wk) ?? {
      wk,
      httpClicks: 0,
      httpImps: 0,
      httpsClicks: 0,
      httpsImps: 0,
    };
    a.httpsClicks += r.clicks ?? 0;
    a.httpsImps += r.impressions ?? 0;
    weeks.set(wk, a);
  }
  const weekly = [...weeks.values()].sort((a, b) => a.wk.localeCompare(b.wk));

  console.log('\n■ WEEKLY TREND (http vs https)');
  console.log(
    `  ${pad('week', 10, true)}  ${pad('http clk', 8)}  ${pad(
      'http imp',
      9,
    )}  ${pad('https clk', 9)}  ${pad('https imp', 10)}  ${pad('http %', 7)}`,
  );
  for (const w of weekly) {
    const total = w.httpImps + w.httpsImps;
    const share = total ? w.httpImps / total : 0;
    console.log(
      `  ${pad(w.wk, 10, true)}  ${pad(fmt(w.httpClicks), 8)}  ${pad(
        fmt(w.httpImps),
        9,
      )}  ${pad(fmt(w.httpsClicks), 9)}  ${pad(fmt(w.httpsImps), 10)}  ${pad(
        pct(share),
        7,
      )}`,
    );
  }

  // 3. Which queries drive http impressions
  const httpQueries = await q(sc, {
    startDate,
    endDate,
    dimensions: ['query'],
    dimensionFilterGroups: [pagesFilter(HTTP)],
    rowLimit: 25,
  });
  console.log('\n■ TOP QUERIES FOR http:// VARIANT');
  console.log(
    `  ${pad('clicks', 7)}  ${pad('impr', 8)}  ${pad('ctr', 6)}  ${pad(
      'pos',
      5,
    )}  query`,
  );
  httpQueries
    .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
    .forEach((r) => {
      console.log(
        `  ${pad(fmt(r.clicks), 7)}  ${pad(fmt(r.impressions), 8)}  ${pad(
          pct(r.ctr),
          6,
        )}  ${pad((r.position ?? 0).toFixed(1), 5)}  ${r.keys?.[0]}`,
      );
    });

  // 4. Country breakdown for http
  const httpCountries = await q(sc, {
    startDate,
    endDate,
    dimensions: ['country'],
    dimensionFilterGroups: [pagesFilter(HTTP)],
    rowLimit: 10,
  });
  console.log('\n■ COUNTRIES SEEING http:// VARIANT (top 10)');
  console.log(
    `  ${pad('country', 7, true)}  ${pad('clicks', 7)}  ${pad('impr', 8)}`,
  );
  httpCountries
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .forEach((r) => {
      console.log(
        `  ${pad((r.keys?.[0] ?? '').toUpperCase(), 7, true)}  ${pad(
          fmt(r.clicks),
          7,
        )}  ${pad(fmt(r.impressions), 8)}`,
      );
    });

  // 5. Device
  const httpDevices = await q(sc, {
    startDate,
    endDate,
    dimensions: ['device'],
    dimensionFilterGroups: [pagesFilter(HTTP)],
  });
  console.log('\n■ DEVICE SPLIT FOR http:// VARIANT');
  console.log(
    `  ${pad('device', 8, true)}  ${pad('clicks', 7)}  ${pad('impr', 8)}`,
  );
  httpDevices
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .forEach((r) => {
      console.log(
        `  ${pad((r.keys?.[0] ?? '').toLowerCase(), 8, true)}  ${pad(
          fmt(r.clicks),
          7,
        )}  ${pad(fmt(r.impressions), 8)}`,
      );
    });

  console.log('\n' + '━'.repeat(80));
}

main().catch((e) => {
  console.error('Error:', e.message ?? e);
  if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
  process.exit(1);
});
