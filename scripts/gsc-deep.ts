#!/usr/bin/env tsx
/**
 * Deep GSC cuts for the full-site growth audit.
 * Run from the repo root: npx tsx <this file> <cut>
 */
import { google, type searchconsole_v1 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const CREDENTIALS_PATH =
  process.env.GSC_CREDENTIALS_PATH ??
  path.join(process.cwd(), 'search-console-access-487306-dbcd7b7eecec.json');
const SITE_URL = 'sc-domain:len.golf';

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
  dimensions: string[],
  rowLimit = 5000,
  dimensionFilterGroups?: unknown[],
): Promise<Row[]> {
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: daysAgo(91),
      endDate: daysAgo(1),
      dimensions,
      rowLimit,
      type: 'web',
      ...(dimensionFilterGroups ? { dimensionFilterGroups } : {}),
    } as never,
  });
  return res.data.rows ?? [];
}

const pct = (n: number) => (n * 100).toFixed(2) + '%';
const num = (n: number) => n.toLocaleString();

function table(rows: Row[], keyCount: number, limit: number) {
  rows.slice(0, limit).forEach((r) => {
    const keys = (r.keys ?? []).slice(0, keyCount).join('  ‖  ');
    console.log(
      `  ${String(r.clicks ?? 0).padStart(5)} ${String(num(r.impressions ?? 0)).padStart(8)} ${pct(r.ctr ?? 0).padStart(7)} ${(r.position ?? 0).toFixed(1).padStart(6)}  ${keys}`,
    );
  });
}

async function main() {
  const cut = process.argv[2];
  const sc = await getClient();

  if (cut === 'rental') {
    console.log('\n=== ALL QUERIES CONTAINING "rental"/"rent"/"hire"/"เช่า" ===');
    const rows = await q(sc, ['query', 'page']);
    const hits = rows.filter((r) => {
      const s = (r.keys?.[0] ?? '').toLowerCase();
      return /rent|hire|เช่า|レンタル|렌탈|대여|租/.test(s);
    });
    const tc = hits.reduce((a, r) => a + (r.clicks ?? 0), 0);
    const ti = hits.reduce((a, r) => a + (r.impressions ?? 0), 0);
    console.log(`  TOTAL rental-intent: ${tc} clicks / ${num(ti)} impressions across ${hits.length} query-page pairs\n`);
    hits.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    table(hits, 2, 70);
  }

  if (cut === 'thai') {
    console.log('\n=== QUERIES WITH THAI CHARACTERS (all pages) ===');
    const rows = await q(sc, ['query', 'page']);
    const hits = rows.filter((r) => /[฀-๿]/.test(r.keys?.[0] ?? ''));
    const tc = hits.reduce((a, r) => a + (r.clicks ?? 0), 0);
    const ti = hits.reduce((a, r) => a + (r.impressions ?? 0), 0);
    console.log(`  TOTAL Thai-script: ${tc} clicks / ${num(ti)} impressions across ${hits.length} pairs\n`);
    hits.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    table(hits, 2, 80);

    console.log('\n=== THAILAND-COUNTRY QUERIES IN LATIN SCRIPT (top 40 by impr) ===');
    const thRows = await q(sc, ['query'], 5000, [
      { filters: [{ dimension: 'country', operator: 'equals', expression: 'tha' }] },
    ]);
    const latin = thRows.filter((r) => !/[฀-๿]/.test(r.keys?.[0] ?? ''));
    latin.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    table(latin, 1, 40);
  }

  if (cut === 'locale') {
    console.log('\n=== PERFORMANCE BY LOCALE PREFIX ===');
    const rows = await q(sc, ['page']);
    const agg: Record<string, { c: number; i: number }> = {};
    for (const r of rows) {
      const u = r.keys?.[0] ?? '';
      let m = 'en';
      const path = u.replace(/^https?:\/\/[^/]+/, '');
      const host = u.replace(/^https?:\/\//, '').split('/')[0];
      if (host.startsWith('booking')) m = '[booking subdomain]';
      else {
        const seg = path.split('/')[1];
        if (['th', 'ja', 'ko', 'zh'].includes(seg)) m = seg;
      }
      agg[m] ??= { c: 0, i: 0 };
      agg[m].c += r.clicks ?? 0;
      agg[m].i += r.impressions ?? 0;
    }
    Object.entries(agg)
      .sort((a, b) => b[1].c - a[1].c)
      .forEach(([k, v]) =>
        console.log(`  ${k.padEnd(22)} ${String(v.c).padStart(6)} clicks  ${num(v.i).padStart(9)} impr  ${pct(v.c / v.i)}`),
      );
  }

  if (cut === 'sections') {
    console.log('\n=== PERFORMANCE BY SITE SECTION (EN paths, locale-stripped) ===');
    const rows = await q(sc, ['page']);
    const agg: Record<string, { c: number; i: number; n: number; pos: number }> = {};
    for (const r of rows) {
      const u = r.keys?.[0] ?? '';
      const host = u.replace(/^https?:\/\//, '').split('/')[0];
      let p = u.replace(/^https?:\/\/[^/]+/, '');
      if (host.startsWith('booking')) { agg['[booking subdomain]'] ??= { c: 0, i: 0, n: 0, pos: 0 }; const a = agg['[booking subdomain]']; a.c += r.clicks ?? 0; a.i += r.impressions ?? 0; a.n++; a.pos += (r.position ?? 0) * (r.impressions ?? 0); continue; }
      p = p.replace(/^\/(th|ja|ko|zh)(?=\/|$)/, '');
      const seg = p.split('/')[1] || '[homepage]';
      agg[seg] ??= { c: 0, i: 0, n: 0, pos: 0 };
      agg[seg].c += r.clicks ?? 0;
      agg[seg].i += r.impressions ?? 0;
      agg[seg].n++;
      agg[seg].pos += (r.position ?? 0) * (r.impressions ?? 0);
    }
    Object.entries(agg)
      .sort((a, b) => b[1].i - a[1].i)
      .forEach(([k, v]) =>
        console.log(
          `  ${k.padEnd(34)} ${String(v.c).padStart(5)} clicks ${num(v.i).padStart(9)} impr ${pct(v.i ? v.c / v.i : 0).padStart(7)} avgpos ${(v.pos / (v.i || 1)).toFixed(1).padStart(5)}  (${v.n} urls)`,
        ),
      );
  }

  if (cut === 'coursepages') {
    console.log('\n=== /golf-courses/* and /guide/* — QUERY DETAIL ===');
    const rows = await q(sc, ['page', 'query']);
    const hits = rows.filter((r) => /\/(golf-courses|guide)\//.test(r.keys?.[0] ?? ''));
    const tc = hits.reduce((a, r) => a + (r.clicks ?? 0), 0);
    const ti = hits.reduce((a, r) => a + (r.impressions ?? 0), 0);
    console.log(`  TOTAL: ${tc} clicks / ${num(ti)} impr\n`);
    hits.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    table(hits, 2, 60);
  }

  if (cut === 'zeroclick') {
    console.log('\n=== ZERO-CLICK PAGES WITH >=300 IMPRESSIONS ===');
    const rows = await q(sc, ['page']);
    const hits = rows.filter((r) => (r.clicks ?? 0) === 0 && (r.impressions ?? 0) >= 300);
    hits.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    table(hits, 1, 50);
    console.log(`\n  ${hits.length} zero-click pages, ${num(hits.reduce((a, r) => a + (r.impressions ?? 0), 0))} wasted impressions`);
  }

  if (cut === 'ja' || cut === 'ko' || cut === 'zh') {
    const classes: Record<string, RegExp> = {
      ja: /[ぁ-んァ-ヶ一-龠]/,
      ko: /[가-힣]/,
      zh: /[一-龥]/,
    };
    const re = classes[cut];
    console.log(`\n=== ${cut.toUpperCase()}-SCRIPT QUERIES (imp >= 3, with landing page) ===`);
    const rows = await q(sc, ['query', 'page']);
    const hits = rows.filter(
      (r) => re.test(r.keys?.[0] ?? '') && (r.impressions ?? 0) >= 3,
    );
    // ja class includes CJK ideographs; exclude rows that are actually zh (no kana) for ja cut
    const filtered =
      cut === 'ja'
        ? hits.filter((r) => /[ぁ-んァ-ヶー]/.test(r.keys?.[0] ?? ''))
        : hits;
    filtered.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    const tc = filtered.reduce((a, r) => a + (r.clicks ?? 0), 0);
    const ti = filtered.reduce((a, r) => a + (r.impressions ?? 0), 0);
    console.log(`  TOTAL: ${tc} clicks / ${num(ti)} impressions / ${filtered.length} pairs\n`);
    table(filtered, 2, 80);
  }

  if (cut === 'geo') {
    const country = process.argv[3] ?? 'jpn';
    console.log(`\n=== QUERIES FROM country=${country} (imp >= 2) ===`);
    const rows = await q(sc, ['query', 'page'], 5000, [
      { filters: [{ dimension: 'country', operator: 'equals', expression: country }] },
    ]);
    const hits = rows.filter((r) => (r.impressions ?? 0) >= 2);
    hits.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    const tc = hits.reduce((a, r) => a + (r.clicks ?? 0), 0);
    const ti = hits.reduce((a, r) => a + (r.impressions ?? 0), 0);
    console.log(`  TOTAL: ${tc} clicks / ${num(ti)} impressions / ${hits.length} pairs\n`);
    table(hits, 2, 60);
  }

  if (cut === 'nonbrand') {
    console.log('\n=== BRAND vs NON-BRAND SPLIT ===');
    const rows = await q(sc, ['query']);
    let bc = 0, bi = 0, nc = 0, ni = 0;
    const nb: Row[] = [];
    for (const r of rows) {
      const s = (r.keys?.[0] ?? '').toLowerCase().replace(/\s+/g, '');
      if (s.includes('lengolf') || s.includes('เลนกอล์ฟ')) { bc += r.clicks ?? 0; bi += r.impressions ?? 0; }
      else { nc += r.clicks ?? 0; ni += r.impressions ?? 0; nb.push(r); }
    }
    console.log(`  BRAND:     ${bc} clicks / ${num(bi)} impr / ${pct(bc / bi)}`);
    console.log(`  NON-BRAND: ${nc} clicks / ${num(ni)} impr / ${pct(nc / ni)}`);
    console.log('\n  TOP 60 NON-BRAND QUERIES BY IMPRESSIONS:');
    nb.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    table(nb, 1, 60);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
