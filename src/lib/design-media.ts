import { landingImageUrl } from "./landing-media";

// Optimized copies of public catalog views and floor plans. Exact URLs keep each preview
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
  "https://cdn.conceptbuilders.co.ke/uploads/aa98b086-211f-4b16-b73b-f2818f6b99cf-G.jpg":
    "/images/designs/cb3023-floor-01.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/f7fd4727-afee-4039-b3c7-436130ba921c-F.jpg":
    "/images/designs/cb3023-floor-02.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/60ac68aa-1c2d-4ab8-8565-11c100245c7e-A_Aerial 1.jpg":
    "/images/designs/cb3008-view-01.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/028ab720-d62a-4c10-8bee-64107d52642d-A_Front side A angle close.jpg":
    "/images/designs/cb3008-view-02.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/77d42808-e8f1-4b18-be80-2cfdbfc654f4-A_Front side A angle.jpg":
    "/images/designs/cb3008-view-03.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/8f768edb-b21e-4350-ac7e-33969eaae376-A_Front side B angle 1.jpg":
    "/images/designs/cb3008-view-04.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/38478a63-1b9c-4575-a19d-7b9b85da3e84-A_Front View 1.jpg":
    "/images/designs/cb3008-view-05.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/d1072fb7-cb9b-4596-a225-c5e27fa94723-A_Front View 2.jpg":
    "/images/designs/cb3008-view-06.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/045b03fb-e457-444d-8d3b-112a597b4306-A_Front View 3.jpg":
    "/images/designs/cb3008-view-07.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/581febde-e71a-4377-aefc-c960ab3ba3c4-A_Side A.jpg":
    "/images/designs/cb3008-view-08.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/425a42f7-d31d-4be2-9862-ee126ec56478-A_Back view 1.jpg":
    "/images/designs/cb3008-view-10.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/5a3fd365-a507-45ed-9628-9b5f309419cd-Four Bedroom Maisonette (CB3008) -FINAL DRAFT-01.jpg":
    "/images/designs/cb3008-floor-01.webp",
};

export function designImageUrl(source: string): string {
  return catalogPreviews[source] ?? landingImageUrl(source);
}
