// Optimized copies of CB3023's public gallery and the curated hero exteriors.
// Keep source URLs as the mapping keys so catalog ordering can change safely.
const optimizedMedia: Record<string, string> = {
  "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa2.jpg":
    "/images/landing/contemporary-villa.webp",
  "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow1.jpg":
    "/images/landing/modern-bungalow.webp",
  "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg":
    "/images/landing/urban-apartment.webp",
  "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Front_Elevation1.jpg":
    "/images/landing/courtyard-bungalow.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/f2462146-6c37-49c7-a29f-bdf6ae1a3e2a-A_2 - Photo.jpg":
    "/images/landing/cb3023-arrival.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/144e4341-2b3e-403e-86ae-84fd9b14e9e1-A_3 - Photo.jpg":
    "/images/landing/cb3023-view-02.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/2c13aca5-213b-4e49-8e5c-a3ef04ea5543-A_4 - Photo.jpg":
    "/images/landing/cb3023-view-03.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/dcbd0562-b1d5-4026-917e-cedf8799e44d-A_5 - Photo.jpg":
    "/images/landing/cb3023-view-04.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/84a181fb-7078-4a1e-aa03-88b944d4cb57-A_6 - Photo.jpg":
    "/images/landing/cb3023-view-05.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/500d6403-7608-4894-aea7-ec972385bfbb-A_7 - Photo.jpg":
    "/images/landing/cb3023-view-06.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/a52a2bde-0b37-4d90-80ef-4779b1e91b4d-A_8 - Photo.jpg":
    "/images/landing/cb3023-view-07.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/c30520b6-457e-4d80-acef-b3287381f6f1-A_9 - Photo.jpg":
    "/images/landing/cb3023-view-08.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/096f69d6-89be-4dfd-88a7-37623ea5d3f8-A_10 - Photo.jpg":
    "/images/landing/cb3023-view-09.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/04a91ad1-17d1-4d86-93cf-d2e782fff8c5-A_11 - Photo.jpg":
    "/images/landing/cb3023-view-10.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/e001c592-fbf5-4a9e-93a2-0eaa464420de-A_12 - Photo.jpg":
    "/images/landing/cb3023-view-11.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/1ab6d8a0-eb8e-4f40-bb9e-461373b5dc6b-A_13 - Photo.jpg":
    "/images/landing/cb3023-view-12.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/866536b1-eb90-42f0-b361-a1221a3d480e-A_14 - Photo.jpg":
    "/images/landing/cb3023-view-13.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/afa2407e-5636-4dd1-ab29-8a71ef8c2aa8-A_15 - Photo.jpg":
    "/images/landing/cb3023-view-14.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/e8e58cd6-8b3b-4730-90ed-7df08b6ad65b-A_16 - Photo.jpg":
    "/images/landing/cb3023-view-15.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/7a375478-ee30-4f87-a3a2-739f766ac57a-A_17 - Photo.jpg":
    "/images/landing/cb3023-view-16.webp",
  "https://cdn.conceptbuilders.co.ke/uploads/28c5cfdc-12f5-4d24-bea3-3650f27077c0-A_19 - Photo.jpg":
    "/images/landing/cb3023-view-17.webp",
};

export function landingImageUrl(source: string): string {
  return optimizedMedia[source] ?? source;
}
