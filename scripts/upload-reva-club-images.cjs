// One-time script: upload Callaway REVA (ladies') club images to Supabase Storage.
// Both colour variants in one run — white (16 photos) and black (17 photos).
// Run from: C:\vs_code\lengolf-website
// Usage: node --env-file=.env.local scripts/upload-reva-club-images.cjs
// Mirrors upload-majesty-womens-images.cjs (same resize + upsert).
//
// NOTE the folders do NOT align by number past 12: black has a wedge shot at 13
// that white lacks, so black's putter sequence is shifted +1 (putter angled:
// white 13, black 14). The gallery arrays in rental_club_sets.variants encode
// that — this script just mirrors each folder verbatim.

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars. Run with: node --env-file=.env.local scripts/upload-reva-club-images.cjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const SRC_ROOT = 'G:\\My Drive\\02_Areas\\Business_LENGOLF\\40_Creatives\\09_Golf_Sets';
const BUCKET = 'website-assets';
const MAX_DIM = 1200;

const VARIANTS = [
  { srcDir: 'Premium Women - Callaway Reva White', destPrefix: 'clubs/premium-womens-reva-white', total: 16 },
  { srcDir: 'Premium Women - Callaway Reva Black', destPrefix: 'clubs/premium-womens-reva-black', total: 17 },
];

async function uploadVariant({ srcDir, destPrefix, total }) {
  console.log(`\nUploading ${total} images to ${BUCKET}/${destPrefix}/`);
  let failures = 0;

  for (let i = 1; i <= total; i++) {
    const srcPath = path.join(SRC_ROOT, srcDir, `${i}.png`);
    const destPath = `${destPrefix}/${i}.png`;

    const raw = fs.readFileSync(srcPath);
    const optimized = await sharp(raw)
      .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();

    const rawKB = Math.round(raw.length / 1024);
    const optKB = Math.round(optimized.length / 1024);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(destPath, optimized, { contentType: 'image/png', upsert: true });

    if (error) {
      failures++;
      console.error(`x ${destPath}: ${error.message}`);
    } else {
      console.log(`ok ${destPath}  ${rawKB}KB -> ${optKB}KB`);
    }
  }
  return failures;
}

async function main() {
  let failures = 0;
  for (const v of VARIANTS) failures += await uploadVariant(v);

  console.log('\nDone. Public URL base:');
  console.log(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/clubs/premium-womens-reva-white/2.png (example)`);
  if (failures > 0) {
    console.error(`\n${failures} upload(s) FAILED — re-run to retry (upsert makes it idempotent).`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
