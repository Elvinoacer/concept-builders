import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
const BASE_URL = "https://conceptbuilders.co.ke";

async function generateSitemap() {
  const pages = fs.readFileSync(path.resolve("docs/routes/PAGES.md"), "utf-8");
  const pagePaths = pages
    .split("\n")
    .filter((line) => line.startsWith("- /"))
    .map((line) => line.substring(2).trim());

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pagePaths
    .map((pagePath) => {
      if (pagePath.includes("[")) {
        return "";
      }
      return `
  <url>
    <loc>${BASE_URL}${pagePath}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("")}
  ${await generateDynamicUrls()}
</urlset>`;

  fs.writeFileSync(path.resolve("public/sitemap.xml"), sitemap);
}

async function generateDynamicUrls() {
  const designs = await prisma.design.findMany({
    select: { id: true },
  });

  const designUrls = designs
    .map(
      (design) => `
  <url>
    <loc>${BASE_URL}/designs/${design.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("");

  // Add other dynamic routes here, e.g., for blog posts, categories, etc.

  return designUrls;
}

generateSitemap()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
