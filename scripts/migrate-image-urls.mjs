/**
 * migrate-image-urls.mjs
 *
 * Replaces all old DigitalOcean Spaces image URLs with the new Cloudflare R2
 * CDN URLs (cdn.conceptbuilders.co.ke) across every source, seed, and
 * database record.
 *
 * Old patterns:
 *   https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/<file>
 *   https://conceptbuilders.sfo3.cdn.digitaloceanspaces.com/designimages/<file>
 *
 * New pattern:
 *   https://cdn.conceptbuilders.co.ke/design_images/<subfolder>/<file>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Minimal .env parser — no external dep required
(function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
})(path.join(ROOT, ".env"));

const NEW_BASE = "https://cdn.conceptbuilders.co.ke/design_images";

// ---------------------------------------------------------------------------
// 1.  filename-in-URL  →  subfolder  mapping
//     Keys are exactly as they appear in the URL (percent-encoded where needed)
// ---------------------------------------------------------------------------
const SUBFOLDER_MAP = new Map([
  // ── Maisonette Contemporary Villa (DAVENS NJORO) ──────────────────────────
  ["Compound.jpg",                       "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa1.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa2.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa3.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa4.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa5.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa6.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa7.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa8.jpg", "DAVENS%20NJORO"],
  ["Maisonette_Contemporary_Villa9.jpg", "DAVENS%20NJORO"],
  ["The_Guest_Wing1.jpg",               "DAVENS%20NJORO"],
  ["The_Guest_Wing2.jpg",               "DAVENS%20NJORO"],
  ["The_Guest_Wing3.jpg",               "DAVENS%20NJORO"],
  ["Top-Down_Aerial_View.jpg",          "DAVENS%20NJORO"],

  // ── Modern 3-Bedroom Bungalow (DAVID 3BD) ────────────────────────────────
  ["modern_3-bedroombungalow1.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow2.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow3.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow4.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow5.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow6.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow7.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow8.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow9.jpg",           "DAVID%203BD"],
  ["modern_3-bedroombungalow10.jpg",          "DAVID%203BD"],
  ["modern_3-bedroombungalow11.jpg",          "DAVID%203BD"],
  ["modern_3-bedroombungalow12.jpg",          "DAVID%203BD"],
  ["modern_3-bedroombungalow13.jpg",          "DAVID%203BD"],
  ["modern_3-bedroombungalow14.jpg",          "DAVID%203BD"],
  ["modern_3-bedroombungalow15.jpg",          "DAVID%203BD"],
  ["modern_3-bedroombungalow16.jpg",          "DAVID%203BD"],
  ["modern_3-bedroombungalow_fenceview.jpg",  "DAVID%203BD"],
  ["modern_3-bedroombungalow_gateview.jpg",   "DAVID%203BD"],

  // ── 4-Bedroom L-Shaped Bungalow (DOUGLAS UK) ─────────────────────────────
  ["4-Bedroom_L-Shaped_Bungalow_Aerial1.jpg",          "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Aerial2.jpg",          "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Front_Elevation1.jpg", "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Front_Elevation2.jpg", "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Front_Elevation3.jpg", "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Side1.jpg",            "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Side2.jpg",            "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Side3.jpg",            "DOUGLAS%20UK"],
  ["4-Bedroom_L-Shaped_Bungalow_Side4.jpg",            "DOUGLAS%20UK"],

  // ── Modern 5-Storey Apartment Block (ELLY KUTWA) ─────────────────────────
  ["Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",   "ELLY%20KUTWA"],
  ["Modern_5-Storey_Apartment_Block_Front_Facade2.jpg",   "ELLY%20KUTWA"],
  ["Modern_5-Storey_Apartment_Block_Front_Facade3.jpg",   "ELLY%20KUTWA"],
  ["Modern_5-Storey_Apartment_Block_Rear_Elevation1.jpg", "ELLY%20KUTWA"],
  ["Modern_5-Storey_Apartment_Block_Rear_Elevation2.jpg", "ELLY%20KUTWA"],
  ["Modern_5-Storey_Apartment_Block_Rear_Elevation3.jpg", "ELLY%20KUTWA"],
  ["Modern_5-Storey_Apartment_Block_Side_Elevation1.jpg", "ELLY%20KUTWA"],
  ["Modern_5-Storey_Apartment_Block_Side_Elevation2.jpg", "ELLY%20KUTWA"],

  // ── Townhouse Community (GICHURU REAL ESTATE) ────────────────────────────
  ["Townhouse_Community_Aerial_Views1.jpg",                          "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Aerial_Views2.jpg",                          "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Aerial_Views3.jpg",                          "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Aerial_Views4.jpg",                          "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Aerial_Views5.jpg",                          "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Architectural_Detail1.jpg",                  "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Architectural_Detail2.jpg",                  "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Direct_Individual_Unit_Perspectives1.jpg",   "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Direct_Individual_Unit_Perspectives2.jpg",   "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Direct_Individual_Unit_Perspectives3.jpg",   "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Main_Gate1.jpg",                             "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Main_Gate2.jpg",                             "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Overcast.jpg",                               "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Side1.jpg",                                  "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Side2.jpg",                                  "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Streetscape1.jpg",                           "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Streetscape2.jpg",                           "GICHURU%20REAL%20ESTATE"],
  ["Townhouse_Community_Streetscape3.jpg",                           "GICHURU%20REAL%20ESTATE"],

  // ── Modern 3-Bedroom Flat-Roof (IRUNGU) ──────────────────────────────────
  ["Modern_3-Bedroom_Flat-Roof_Interior_Design_Living_Spaces1.jpeg",      "IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Interior_Design_Living_Spaces2.jpeg",      "IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Interior_Design_Living_Spaces3.jpeg",      "IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Layouts1.jpeg",                            "IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Layouts2.jpeg",                            "IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Rear_Elevations.jpeg",                     "IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives1.jpeg","IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives2.jpeg","IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives3.jpeg","IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives4.jpeg","IRUNGU"],
  ["Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives5.jpeg","IRUNGU"],

  // ── Modern 4-Bedroom Luxury Maisonette (JAMES MERCY NJERI/RENDERS 01) ────
  ["Modern%204-Bedroom%20Luxury%20Maisonette1.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette2.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette3.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette4.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette5.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette6.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette7.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette8.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette9.jpg",  "JAMES%20MERCY%20NJERI/RENDERS%2001"],
  ["Modern%204-Bedroom%20Luxury%20Maisonette10.jpg", "JAMES%20MERCY%20NJERI/RENDERS%2001"],

  // ── Modern Luxury English Country Cottage (JASON) ─────────────────────────
  ["Modern%20Luxury%20English%20Country%20Cottage1.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage2.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage3.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage4.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage5.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage6.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage7.jpg",  "JASON"], // may not be on R2 but map for safety
  ["Modern%20Luxury%20English%20Country%20Cottage8.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage9.jpg",  "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage10.jpg", "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage11.jpg", "JASON"],
  ["Modern%20Luxury%20English%20Country%20Cottage12.jpg", "JASON"],

  // ── The Oasis Infinity-Edge Vista Pool (POOL) ─────────────────────────────
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool2.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool3.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool4.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool5.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool6.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool7.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool8.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool9.jpg",  "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool10.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool11.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool12.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool13.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool14.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool15.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool16.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool17.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool18.jpg", "POOL"],
  ["The%20Oasis%20Infinity-Edge%20Vista%20Pool19.jpg", "POOL"],

  // ── Testimonials ──────────────────────────────────────────────────────────
  ["20240614_151126.jpg",              "testimonials"],
  ["photo_2022-05-13_06-26-18.jpg",   "testimonials"],
]);

// ---------------------------------------------------------------------------
// 2.  Regex – matches both direct and CDN DO Spaces URLs for designimages
// ---------------------------------------------------------------------------
const OLD_URL_RE =
  /https:\/\/conceptbuilders\.sfo3(?:\.cdn)?\.digitaloceanspaces\.com\/designimages\/([\w%.\-+()]+)/g;

function buildNewUrl(rawFilename) {
  const subfolder = SUBFOLDER_MAP.get(rawFilename);
  if (!subfolder) {
    // Try with decoded key too (fallback)
    const decoded = decodeURIComponent(rawFilename);
    const sub2 = SUBFOLDER_MAP.get(decoded);
    if (sub2) return `${NEW_BASE}/${sub2}/${rawFilename}`;
    return null; // unmapped – will warn
  }
  return `${NEW_BASE}/${subfolder}/${rawFilename}`;
}

// ---------------------------------------------------------------------------
// 3.  Source-file migration
// ---------------------------------------------------------------------------
const SOURCE_FILES = [
  "src/lib/dummydata/index.tsx",
  "src/components/landing/SocialProof.tsx",
  "src/components/landing/Featured.tsx",
  "src/components/landing/Explorer.tsx",
  "src/components/landing/hero.tsx",
  "src/components/landing/DesignIdeas.tsx",
  "src/components/Footer.tsx",
  "src/app/(public)/maintenance/page.tsx",
  "src/app/(public)/custom-design/page.tsx",
  "src/app/api/designs/[id]/route.ts",
  "prisma/seed-cloud-designs.ts",
  "prisma/seedCollections.ts",
  "prisma/seeddata.js",
  "docs/api/users.json",
];

function migrateFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    console.log(`  ⚠️  File not found, skipping: ${relPath}`);
    return 0;
  }

  const original = fs.readFileSync(abs, "utf8");
  let count = 0;
  const updated = original.replace(OLD_URL_RE, (match, filename) => {
    const newUrl = buildNewUrl(filename);
    if (!newUrl) {
      console.warn(`  ⚠️  No mapping for filename: "${filename}" in ${relPath}`);
      return match;
    }
    count++;
    return newUrl;
  });

  if (count > 0) {
    fs.writeFileSync(abs, updated, "utf8");
    console.log(`  ✅  ${relPath} — ${count} URL(s) replaced`);
  } else {
    console.log(`  ──  ${relPath} — no old URLs found`);
  }
  return count;
}

// ---------------------------------------------------------------------------
// 4.  next.config.ts – add new CDN hostname for Next.js Image
// ---------------------------------------------------------------------------
function migrateNextConfig() {
  const abs = path.join(ROOT, "next.config.ts");
  if (!fs.existsSync(abs)) return;

  let src = fs.readFileSync(abs, "utf8");
  if (src.includes("cdn.conceptbuilders.co.ke")) {
    console.log("  ──  next.config.ts — cdn.conceptbuilders.co.ke already present");
    return;
  }

  // Insert new hostname entry right before the existing DO entry
  const insertAfter = `hostname: "conceptbuilders.sfo3.digitaloceanspaces.com",`;
  const newEntry = `hostname: "cdn.conceptbuilders.co.ke",
        },
        {`;

  if (src.includes(insertAfter)) {
    // Add cdn.conceptbuilders.co.ke BEFORE the first DO entry block
    src = src.replace(
      /(\{\s*\n\s*hostname:\s*"conceptbuilders\.sfo3\.digitaloceanspaces\.com")/,
      `{
        hostname: "cdn.conceptbuilders.co.ke",
      },
      $1`
    );
    fs.writeFileSync(abs, src, "utf8");
    console.log("  ✅  next.config.ts — added cdn.conceptbuilders.co.ke hostname");
  } else {
    console.warn("  ⚠️  next.config.ts — could not find insertion point; please add cdn.conceptbuilders.co.ke manually");
  }
}

// ---------------------------------------------------------------------------
// 5.  Database migration via pg
// ---------------------------------------------------------------------------
async function migrateDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("  ❌  DATABASE_URL not set. Skipping database migration.");
    return;
  }

  const client = new pg.Client({ connectionString });
  await client.connect();
  console.log("  🔌  Connected to database");

  let totalUpdated = 0;

  // Build per-filename UPDATE statements
  for (const [filename, subfolder] of SUBFOLDER_MAP) {
    const newUrl = `${NEW_BASE}/${subfolder}/${filename}`;
    const likePat = `%/designimages/${filename}`;

    // ── File table (design images) ──────────────────────────────────────────
    const fileRes = await client.query(
      `UPDATE "File"
          SET url = $1
        WHERE url LIKE $2
          AND url ~ 'conceptbuilders\\.sfo3(\\.cdn)?\\.digitaloceanspaces\\.com/designimages'`,
      [newUrl, likePat]
    );
    if (fileRes.rowCount > 0) {
      console.log(`  ✅  File table: ${fileRes.rowCount} row(s) → ${filename}`);
      totalUpdated += fileRes.rowCount;
    }

    // ── DesignCollection table ────────────────────────────────────────────
    const colRes = await client.query(
      `UPDATE "DesignCollection"
          SET image = $1
        WHERE image LIKE $2
          AND image ~ 'conceptbuilders\\.sfo3(\\.cdn)?\\.digitaloceanspaces\\.com/designimages'`,
      [newUrl, likePat]
    );
    if (colRes.rowCount > 0) {
      console.log(`  ✅  DesignCollection: ${colRes.rowCount} row(s) → ${filename}`);
      totalUpdated += colRes.rowCount;
    }

    // ── Testimonial table ─────────────────────────────────────────────────
    const testRes = await client.query(
      `UPDATE "Testimonial"
          SET image = $1
        WHERE image LIKE $2
          AND image ~ 'conceptbuilders\\.sfo3(\\.cdn)?\\.digitaloceanspaces\\.com/designimages'`,
      [newUrl, likePat]
    );
    if (testRes.rowCount > 0) {
      console.log(`  ✅  Testimonial: ${testRes.rowCount} row(s) → ${filename}`);
      totalUpdated += testRes.rowCount;
    }

    // ── Design thumbnail / cover image ────────────────────────────────────
    try {
      const designRes = await client.query(
        `UPDATE "Design"
            SET "thumbnailUrl" = $1
          WHERE "thumbnailUrl" LIKE $2
            AND "thumbnailUrl" ~ 'conceptbuilders\\.sfo3(\\.cdn)?\\.digitaloceanspaces\\.com/designimages'`,
        [newUrl, likePat]
      );
      if (designRes.rowCount > 0) {
        console.log(`  ✅  Design.thumbnailUrl: ${designRes.rowCount} row(s) → ${filename}`);
        totalUpdated += designRes.rowCount;
      }
    } catch (_) {
      // column may not exist
    }
  }

  // Catch-all: any remaining DO designimages URLs we may have missed (bulk replace)
  const catchAll = await client.query(`
    UPDATE "File"
       SET url = REGEXP_REPLACE(
             url,
             'https://conceptbuilders\\.sfo3(\\.cdn)?\\.digitaloceanspaces\\.com/designimages/',
             'https://cdn.conceptbuilders.co.ke/design_images/__UNMAPPED__/',
             'g'
           )
     WHERE url ~ 'conceptbuilders\\.sfo3(\\.cdn)?\\.digitaloceanspaces\\.com/designimages/'
  `);
  if (catchAll.rowCount > 0) {
    console.warn(`  ⚠️  Catch-all replaced ${catchAll.rowCount} unmapped File row(s) — check __UNMAPPED__ URLs!`);
  }

  await client.end();
  console.log(`\n  📊  Database total rows updated: ${totalUpdated}`);
}

// ---------------------------------------------------------------------------
// 6.  Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("\n🚀  Starting image URL migration…\n");

  // — Source files —
  console.log("📂  Migrating source files…");
  let totalReplaced = 0;
  for (const f of SOURCE_FILES) {
    totalReplaced += migrateFile(f);
  }
  console.log(`\n  Source files total replacements: ${totalReplaced}\n`);

  // — next.config.ts —
  console.log("⚙️   Updating next.config.ts…");
  migrateNextConfig();
  console.log();

  // — Database —
  console.log("🗄️   Migrating database…");
  await migrateDatabase();

  console.log("\n🎉  Migration complete!\n");
}

main().catch((e) => {
  console.error("❌  Migration failed:", e);
  process.exit(1);
});
