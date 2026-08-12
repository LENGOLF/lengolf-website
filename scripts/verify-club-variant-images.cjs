// Read-only gate: verify every image path referenced by rental_club_sets.gallery
// and rental_club_sets.variants resolves to a live object in the public
// website-assets bucket. DB-authored paths have no compile-time safety — this
// script is the only thing standing between a typo and a broken image in prod.
//
// Run from: C:\vs_code\lengolf-website
// Usage: node --env-file=.env.local scripts/verify-club-variant-images.cjs
// Exit 0 = every path 200. Exit 1 = any missing/failed path (listed).

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Service role required: anon has NO grant on rental_club_sets (anon lockdown) —
// the website itself reads it server-side with the service key.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars. Run with: node --env-file=.env.local scripts/verify-club-variant-images.cjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = 'website-assets';

function collectPaths(row) {
  const paths = new Map(); // path -> where it came from
  const add = (p, where) => {
    if (typeof p === 'string' && p.length > 0) paths.set(p, where);
  };

  const gallery = Array.isArray(row.gallery) ? row.gallery : [];
  gallery.forEach((img, i) => add(img?.path, `${row.slug} gallery[${i}]`));

  const variants = Array.isArray(row.variants) ? row.variants : [];
  variants.forEach((v) => {
    add(v?.thumb, `${row.slug} variants[${v?.key}].thumb`);
    const images = Array.isArray(v?.images) ? v.images : [];
    images.forEach((img, i) => add(img?.path, `${row.slug} variants[${v?.key}].images[${i}]`));
  });

  return paths;
}

async function head(path) {
  const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  const { data, error } = await supabase
    .from('rental_club_sets')
    .select('slug, gallery, variants')
    .eq('is_active', true);

  if (error) {
    console.error(`DB read failed: ${error.message}`);
    process.exit(1);
  }

  const failures = [];
  let checked = 0;

  for (const row of data) {
    const paths = collectPaths(row);
    for (const [p, where] of paths) {
      checked++;
      const ok = await head(p);
      if (ok) {
        console.log(`ok ${p}`);
      } else {
        failures.push({ path: p, where });
        console.error(`x  ${p}  (${where})`);
      }
    }
  }

  console.log(`\nChecked ${checked} path(s) across ${data.length} active set(s).`);
  if (failures.length > 0) {
    console.error(`${failures.length} MISSING — fix the DB rows or upload the objects before shipping.`);
    process.exit(1);
  }
  console.log('All paths live.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
