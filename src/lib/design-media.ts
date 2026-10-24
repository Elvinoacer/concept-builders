import { landingImageUrl } from "./landing-media";

// Optimized copies of catalog exteriors. Exact source URLs keep each preview
// tied to its original design when the live collection changes order.
const catalogPreviews: Record<string, string> = {
  "https://cdn.conceptbuilders.co.ke/uploads/69b35243-0146-4179-b450-f5f619e995cb-A_Side B.jpg":
    "/images/designs/cb3008-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/a7526fbc-7861-42eb-8e50-cfc470544e7c-IMG_20250703_165533_212.jpg":
    "/images/designs/cb3001-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/dc25f165-dd65-41d8-820f-c922bf2eab6a-A_6 - Photo.jpg":
    "/images/designs/cb3006-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/3c31b59c-7bfa-4711-bebb-03ff33b85c11-THREE BEDROOM BUNGALOW (CB3003)_.png":
    "/images/designs/cb3003-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/9bedad9a-b278-4f65-92cb-652d67b1a1ef-B_11 - Photo.jpg":
    "/images/designs/cb3010-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/fcdf6836-c1a5-4485-80d8-3673df3bb28a-A_2 - Photo (2).jpg":
    "/images/designs/cb3009-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/6a20b7a3-5a22-4ac0-9303-c7b8989d011a-A_11 - Photo.jpg":
    "/images/designs/cb3005-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/38f05039-8303-4fa5-a68a-cf484326cb24-A_5 - Photo.jpg":
    "/images/designs/cb3014-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/37b09b20-e3ba-4dc9-a003-db024d1578cc-A_1 - Photo.jpg":
    "/images/designs/cb3013-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/58ea062a-e664-4175-bd44-717078f6bd28-5888732013920373810_121.jpg":
    "/images/designs/cb3002-exterior.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/b0b11da2-ad8e-4b13-a695-2704ac529bb1-D_9 - Photo.jpg":
    "/images/designs/cb3015-exterior.webp",
};

export function designImageUrl(source: string): string {
  return catalogPreviews[source] ?? landingImageUrl(source);
}
