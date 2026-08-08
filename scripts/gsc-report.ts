#!/usr/bin/env tsx
/**
 * 90-day GSC analysis for len.golf.
 * Usage: npx tsx scripts/gsc-report.ts [days]
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
  startDate: string,
  endDate: string,
  dimensions: string[],
  rowLimit = 1000,
): Promise<Row[]> {
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions, rowLimit, type: 'web' },
  });
  return res.data.rows ?? [];
}

function fmt(n: number | undefined, digits = 0): string {
  return (n ?? 0).toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}
function pct(n: number | undefined): string {
  return `${((n ?? 0) * 100).toFixed(2)}%`;
}
function pad(s: string | number, w: number, right = false): string {
  const str = String(s);
  return right ? str.padEnd(w) : str.padStart(w);
}

function trunc(s: string, w: number): string {
  return s.length > w ? s.slice(0, w - 1) + '…' : s;
}

function stripHost(url: string): string {
  return url
    .replace(/^https?:\/\/(www\.)?len\.golf/, '')
    .replace(/^https?:\/\/booking\.len\.golf/, '[booking]');
}

function signed(n: number): string {
  return n > 0 ? `+${fmt(n)}` : fmt(n);
}
function signedPct(n: number): string {
  if (!isFinite(n)) return '—';
  const v = (n * 100).toFixed(1);
  return n > 0 ? `+${v}%` : `${v}%`;
}

async function main() {
  const days = Number(process.argv[2] ?? '90');
  const sc = await getClient();

  const endDate = daysAgo(2);
  const startDate = daysAgo(days + 1);
  const midDate = daysAgo(Math.floor(days / 2) + 1);
  const halfLen = Math.floor(days / 2);

  console.log('━'.repeat(80));
  console.log(`GSC REPORT — ${SITE_URL}`);
  console.log(`Range: ${startDate} → ${endDate}  (${days} days)`);
  console.log('━'.repeat(80));

  // 1. Overall totals
  const overall = await q(sc, startDate, endDate, []);
  const o = overall[0];
  console.log('\n■ OVERALL');
  console.log(`  Clicks:      ${fmt(o?.clicks)}`);
  console.log(`  Impressions: ${fmt(o?.impressions)}`);
  console.log(`  CTR:         ${pct(o?.ctr)}`);
  console.log(`  Avg pos:     ${(o?.position ?? 0).toFixed(2)}`);

  // 2. First half vs second half
  const firstHalf = await q(sc, startDate, midDate, []);
  const secondHalf = await q(sc, daysAgo(halfLen), endDate, []);
  const a = firstHalf[0];
  const b = secondHalf[0];
  if (a && b) {
    console.log(`\n■ TREND (first ${halfLen}d vs most recent ${halfLen}d)`);
    console.log(
      `  Clicks:      ${fmt(a.clicks)} → ${fmt(b.clicks)}  (${signedPct(
        ((b.clicks ?? 0) - (a.clicks ?? 0)) / Math.max(1, a.clicks ?? 1),
      )})`,
    );
    console.log(
      `  Impressions: ${fmt(a.impressions)} → ${fmt(
        b.impressions,
      )}  (${signedPct(
        ((b.impressions ?? 0) - (a.impressions ?? 0)) /
          Math.max(1, a.impressions ?? 1),
      )})`,
    );
    console.log(
      `  CTR:         ${pct(a.ctr)} → ${pct(b.ctr)}  (${signedPct(
        (b.ctr ?? 0) - (a.ctr ?? 0),
      )} abs)`,
    );
    console.log(
      `  Avg pos:     ${(a.position ?? 0).toFixed(2)} → ${(
        b.position ?? 0
      ).toFixed(2)}  (${((b.position ?? 0) - (a.position ?? 0)).toFixed(
        2,
      )}, lower=better)`,
    );
  }

  // 3. Weekly trend
  const daily = await q(sc, startDate, endDate, ['date'], 1000);
  daily.sort((x, y) => (x.keys?.[0] ?? '').localeCompare(y.keys?.[0] ?? ''));
  type WeekAgg = {
    wk: string;
    clicks: number;
    imps: number;
    ctrNum: number;
    posSum: number;
    posN: number;
  };
  const weeks = new Map<string, WeekAgg>();
  for (const r of daily) {
    const date = r.keys?.[0];
    if (!date) continue;
    const d = new Date(date + 'T00:00:00Z');
    const dow = d.getUTCDay();
    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() - ((dow + 6) % 7));
    const wk = monday.toISOString().split('T')[0];
    const agg = weeks.get(wk) ?? {
      wk,
      clicks: 0,
      imps: 0,
      ctrNum: 0,
      posSum: 0,
      posN: 0,
    };
    agg.clicks += r.clicks ?? 0;
    agg.imps += r.impressions ?? 0;
    agg.posSum += (r.position ?? 0) * (r.impressions ?? 0);
    agg.posN += r.impressions ?? 0;
    weeks.set(wk, agg);
  }
  const weekly = [...weeks.values()].sort((x, y) => x.wk.localeCompare(y.wk));
  if (weekly.length) {
    console.log('\n■ WEEKLY TREND (Mon-anchored)');
    console.log(
      `  ${pad('week', 10, true)}  ${pad('clicks', 7)}  ${pad(
        'impr',
        8,
      )}  ${pad('ctr', 6)}  ${pad('pos', 5)}`,
    );
    for (const w of weekly) {
      const ctr = w.imps ? w.clicks / w.imps : 0;
      const pos = w.posN ? w.posSum / w.posN : 0;
      console.log(
        `  ${pad(w.wk, 10, true)}  ${pad(fmt(w.clicks), 7)}  ${pad(
          fmt(w.imps),
          8,
        )}  ${pad(pct(ctr), 6)}  ${pad(pos.toFixed(2), 5)}`,
      );
    }
  }

  // 4. Devices
  const devs = await q(sc, startDate, endDate, ['device']);
  if (devs.length) {
    console.log('\n■ DEVICE SPLIT');
    console.log(
      `  ${pad('device', 8, true)}  ${pad('clicks', 7)}  ${pad(
        '% clicks',
        8,
      )}  ${pad('impr', 8)}  ${pad('ctr', 6)}  ${pad('pos', 5)}`,
    );
    const totalC = devs.reduce((s, r) => s + (r.clicks ?? 0), 0);
    devs
      .sort((x, y) => (y.clicks ?? 0) - (x.clicks ?? 0))
      .forEach((r) => {
        const share = (r.clicks ?? 0) / Math.max(1, totalC);
        console.log(
          `  ${pad((r.keys?.[0] ?? '').toLowerCase(), 8, true)}  ${pad(
            fmt(r.clicks),
            7,
          )}  ${pad(pct(share), 8)}  ${pad(fmt(r.impressions), 8)}  ${pad(
            pct(r.ctr),
            6,
          )}  ${pad((r.position ?? 0).toFixed(1), 5)}`,
        );
      });
  }

  // 5. Countries (top 10)
  const countries = await q(sc, startDate, endDate, ['country'], 200);
  if (countries.length) {
    console.log('\n■ TOP 10 COUNTRIES (by clicks)');
    console.log(
      `  ${pad('country', 7, true)}  ${pad('clicks', 7)}  ${pad(
        '% clicks',
        8,
      )}  ${pad('impr', 8)}  ${pad('ctr', 6)}`,
    );
    const totC = countries.reduce((s, r) => s + (r.clicks ?? 0), 0);
    countries
      .sort((x, y) => (y.clicks ?? 0) - (x.clicks ?? 0))
      .slice(0, 10)
      .forEach((r) => {
        const share = (r.clicks ?? 0) / Math.max(1, totC);
        console.log(
          `  ${pad((r.keys?.[0] ?? '').toUpperCase(), 7, true)}  ${pad(
            fmt(r.clicks),
            7,
          )}  ${pad(pct(share), 8)}  ${pad(fmt(r.impressions), 8)}  ${pad(
            pct(r.ctr),
            6,
          )}`,
        );
      });
  }

  // 6. Top pages
  const pages = await q(sc, startDate, endDate, ['page'], 500);
  pages.sort((x, y) => (y.clicks ?? 0) - (x.clicks ?? 0));
  console.log('\n■ TOP 15 PAGES (by clicks)');
  console.log(
    `  ${pad('#', 3)}  ${pad('clicks', 7)}  ${pad('impr', 8)}  ${pad(
      'ctr',
      6,
    )}  ${pad('pos', 5)}  page`,
  );
  pages.slice(0, 15).forEach((r, i) => {
    console.log(
      `  ${pad(i + 1, 3)}  ${pad(fmt(r.clicks), 7)}  ${pad(
        fmt(r.impressions),
        8,
      )}  ${pad(pct(r.ctr), 6)}  ${pad(
        (r.position ?? 0).toFixed(1),
        5,
      )}  ${trunc(stripHost(r.keys?.[0] ?? ''), 55)}`,
    );
  });

  // 7. Top queries
  const queries = await q(sc, startDate, endDate, ['query'], 1000);
  queries.sort((x, y) => (y.clicks ?? 0) - (x.clicks ?? 0));
  console.log('\n■ TOP 25 QUERIES (by clicks)');
  console.log(
    `  ${pad('#', 3)}  ${pad('clicks', 7)}  ${pad('impr', 8)}  ${pad(
      'ctr',
      6,
    )}  ${pad('pos', 5)}  query`,
  );
  queries.slice(0, 25).forEach((r, i) => {
    console.log(
      `  ${pad(i + 1, 3)}  ${pad(fmt(r.clicks), 7)}  ${pad(
        fmt(r.impressions),
        8,
      )}  ${pad(pct(r.ctr), 6)}  ${pad(
        (r.position ?? 0).toFixed(1),
        5,
      )}  ${r.keys?.[0] ?? ''}`,
    );
  });

  // 8. Movers: pages & queries — recent half vs prior half
  const halfBoundary = daysAgo(halfLen);
  const pagesA = await q(sc, startDate, midDate, ['page'], 1000);
  const pagesB = await q(sc, halfBoundary, endDate, ['page'], 1000);
  const queriesA = await q(sc, startDate, midDate, ['query'], 5000);
  const queriesB = await q(sc, halfBoundary, endDate, ['query'], 5000);

  const diffBy = (A: Row[], B: Row[]) => {
    const map = new Map<string, { a: number; b: number }>();
    for (const r of A) {
      const k = r.keys?.[0] ?? '';
      map.set(k, { a: r.clicks ?? 0, b: 0 });
    }
    for (const r of B) {
      const k = r.keys?.[0] ?? '';
      const cur = map.get(k) ?? { a: 0, b: 0 };
      cur.b = r.clicks ?? 0;
      map.set(k, cur);
    }
    return [...map.entries()].map(([k, v]) => ({
      key: k,
      a: v.a,
      b: v.b,
      delta: v.b - v.a,
    }));
  };

  const pageMovers = diffBy(pagesA, pagesB).filter((m) => m.a + m.b >= 5);
  const queryMovers = diffBy(queriesA, queriesB).filter((m) => m.a + m.b >= 5);

  console.log(`\n■ BIGGEST PAGE GAINERS (click Δ, recent ${halfLen}d vs prior ${halfLen}d)`);
  console.log(
    `  ${pad('Δ', 5)}  ${pad('prior', 6)}  ${pad(
      'recent',
      7,
    )}  page`,
  );
  pageMovers
    .sort((x, y) => y.delta - x.delta)
    .slice(0, 10)
    .forEach((m) => {
      console.log(
        `  ${pad(signed(m.delta), 5)}  ${pad(fmt(m.a), 6)}  ${pad(
          fmt(m.b),
          7,
        )}  ${trunc(stripHost(m.key), 55)}`,
      );
    });

  console.log(`\n■ BIGGEST PAGE LOSERS`);
  pageMovers
    .sort((x, y) => x.delta - y.delta)
    .slice(0, 10)
    .forEach((m) => {
      if (m.delta >= 0) return;
      console.log(
        `  ${pad(signed(m.delta), 5)}  ${pad(fmt(m.a), 6)}  ${pad(
          fmt(m.b),
          7,
        )}  ${trunc(stripHost(m.key), 55)}`,
      );
    });

  console.log(`\n■ BIGGEST QUERY GAINERS`);
  queryMovers
    .sort((x, y) => y.delta - x.delta)
    .slice(0, 15)
    .forEach((m) => {
      console.log(
        `  ${pad(signed(m.delta), 5)}  ${pad(fmt(m.a), 6)}  ${pad(
          fmt(m.b),
          7,
        )}  ${m.key}`,
      );
    });

  console.log(`\n■ BIGGEST QUERY LOSERS`);
  queryMovers
    .sort((x, y) => x.delta - y.delta)
    .slice(0, 15)
    .forEach((m) => {
      if (m.delta >= 0) return;
      console.log(
        `  ${pad(signed(m.delta), 5)}  ${pad(fmt(m.a), 6)}  ${pad(
          fmt(m.b),
          7,
        )}  ${m.key}`,
      );
    });

  // 9. CTR opportunities — pages ranked well-ish but not getting CTR
  console.log(
    `\n■ CTR OPPORTUNITIES (impressions ≥ 200, position ≤ 15, CTR < 2%)`,
  );
  console.log(
    `  ${pad('impr', 6)}  ${pad('clicks', 6)}  ${pad('ctr', 6)}  ${pad(
      'pos',
      5,
    )}  page`,
  );
  pages
    .filter(
      (r) =>
        (r.impressions ?? 0) >= 200 &&
        (r.position ?? 99) <= 15 &&
        (r.ctr ?? 0) < 0.02,
    )
    .sort((x, y) => (y.impressions ?? 0) - (x.impressions ?? 0))
    .slice(0, 12)
    .forEach((r) => {
      console.log(
        `  ${pad(fmt(r.impressions), 6)}  ${pad(fmt(r.clicks), 6)}  ${pad(
          pct(r.ctr),
          6,
        )}  ${pad((r.position ?? 0).toFixed(1), 5)}  ${trunc(
          stripHost(r.keys?.[0] ?? ''),
          55,
        )}`,
      );
    });

  // 10. Striking-distance queries — position 5-15, high impressions, low-ish clicks
  console.log(
    `\n■ STRIKING-DISTANCE QUERIES (pos 5-15, impr ≥ 50) — push these onto page 1`,
  );
  console.log(
    `  ${pad('impr', 6)}  ${pad('clicks', 6)}  ${pad('pos', 5)}  query`,
  );
  queries
    .filter(
      (r) =>
        (r.position ?? 99) >= 5 &&
        (r.position ?? 99) <= 15 &&
        (r.impressions ?? 0) >= 50,
    )
    .sort((x, y) => (y.impressions ?? 0) - (x.impressions ?? 0))
    .slice(0, 20)
    .forEach((r) => {
      console.log(
        `  ${pad(fmt(r.impressions), 6)}  ${pad(fmt(r.clicks), 6)}  ${pad(
          (r.position ?? 0).toFixed(1),
          5,
        )}  ${r.keys?.[0] ?? ''}`,
      );
    });

  console.log('\n' + '━'.repeat(80));
}

main().catch((e) => {
  console.error('Error:', e.message ?? e);
  if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
  process.exit(1);
});
