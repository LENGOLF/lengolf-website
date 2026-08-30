// One-time script: upload Callaway Premium club images to Supabase Storage
// Run from: C:\vs_code\lengolf-website
// Usage: node scripts/upload-premium-club-images.cjs

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars. Run with: node --env-file=.env.local scripts/upload-premium-club-images.cjs');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const SRC_DIR = 'G:\\My Drive\\00_Inbox\\Callaway Premium';
const BUCKET = 'website-assets';
const DEST_PREFIX = 'clubs/premium';
const MAX_DIM = 1200;
const TOTAL = 16;

async function main() {
  console.log(`Uploading ${TOTAL} images to ${BUCKET}/${DEST_PREFIX}/\n`);

  for (let i = 1; i <= TOTAL; i++) {
    const srcPath = path.join(SRC_DIR, `${i}.png`);
    const destPath = `${DEST_PREFIX}/${i}.png`;

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
      console.error(`✗ ${i}.png: ${error.message}`);
    } else {
      console.log(`✓ ${i}.png  ${rawKB}KB → ${optKB}KB`);
    }
  }

  console.log('\nDone. Public URL base:');
  console.log(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${DEST_PREFIX}/1.png (example)`);

}

main().catch(console.error);
