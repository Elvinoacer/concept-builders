const categoriesData = [
  {
    name: "Bungalows",
    image:
      "https://www.estateagenttoday.co.uk/wp-content/uploads/shutterstock_593487752.jpg",
  },
  {
    name: "Duplexes",
    image:
      "https://res.akamaized.net/domain/image/upload/t_web/c_fill,w_720,h_480/v1564363376/2015392229_1_1_190621_050142-w1920-h1280_ihnkgz.jpg",
  },
  {
    name: "Apartments",
    image:
      "https://media.equityapartments.com/images/c_crop,x_0,y_0,w_1920,h_1080/c_fill,w_1920,h_1080/q_auto,f_auto/4295-228/lyle-apartments-exterior",
  },
  {
    name: "Modern",
    image:
      "https://illustrarch.com/wp-content/uploads/2025/02/Modern-Architecture-2.jpg",
  },
  {
    name: "Traditional",
    image:
      "https://st.hzcdn.com/fimgs/pictures/exteriors/sumner-residence-hartmanbaldwin-design-build-img~ecc18a5c0c17da94_4975-1-3d8e346-w600-h292-b0-p0.jpg",
  },
  {
    name: "Luxury",
    image:
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/8d568b41526151.57a9ca21012e8.jpg",
  },
  {
    name: "Mansion",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCBJ83WrdGfTDxWeV03467ZiZQvBDtP-Mfsw&s",
  },
  {
    name: "Tiny Homes",
    image:
      "https://www.travelandleisure.com/thmb/Ej2japEMViGRuqxnyPaRI0IEoE0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cabin-home-40ft-x-20ft-double-story-flat-pack-home-c8762cdc330c44dab2bbdcdf95454298.jpg",
  },
  {
    name: "Farmhouse",
    image:
      "https://lh3.googleusercontent.com/Lrj9hzs99HWrqnNTeB7T0p-PeiKjvwfE2j7tkNo7HN58kWNIXKPrp5wa4JZrk-SSy_fANqSQJ2uP9bl-GuIcA6TL2uKftT7pCus=w3840-h2160-c-rw-v3",
  },
];

const designsData = [
  {
    name: "Modern Minimalist Home",
    category: "Modern",
    description:
      "A beautiful and spacious modern home with a minimalist design.",
    basePrice: 999,
    priceRange: "$999 - $4999",
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    floors: 2,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    files: [
      {
        url: "https://preciseirondoors.com/wp-content/uploads/2021/12/modern-house-with-garage-and-car.jpg",
        type: "IMAGE",
      },
    ],
  },
  {
    name: "Cozy Cottage",
    category: "Traditional",
    description:
      "A charming cottage perfect for a small family or as a vacation home.",
    basePrice: 799,
    priceRange: "$799 - $3999",
    bedrooms: 2,
    bathrooms: 1,
    area: 1500,
    floors: 1,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    files: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWQgVyJ-XvETMQaBE0q0jJzpLkmOraZTfxsg&s",
        type: "IMAGE",
      },
    ],
  },
  {
    name: "Luxury Villa",
    category: "Luxury",
    description:
      "An expansive and luxurious villa with all the modern amenities.",
    basePrice: 1999,
    priceRange: "$1999 - $9999",
    bedrooms: 5,
    bathrooms: 4,
    area: 5000,
    floors: 2,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    files: [
      {
        url: "https://www.bargainandalucia.dk/wp-content/uploads/2017/08/eksklusiv-moderne-luksus-villa-liebhaveri-marbella-hus-til-salg-costa-del-sol-k%C3%B8b-bolig-malaga-dansk-ejendomsm%C3%A6gler-sydspanien-feriebolig-bargain-andalucia-1.jpg",
        type: "IMAGE",
      },
    ],
  },
  {
    name: "The Grandeur",
    category: "Mansion",
    description: "A magnificent mansion for those who demand the very best.",
    basePrice: 4999,
    priceRange: "$4999 - $19999",
    bedrooms: 8,
    bathrooms: 10,
    area: 12000,
    floors: 3,
    planDetails: [
      "Detailed Floor Plans",
      "3D Renderings",
      "Electrical Plans",
      "Smart Home Integration",
    ],
    files: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuUuo1dV2fVtx67LixvJexNRIytX36TVw1TQ&s",
        type: "IMAGE",
      },
    ],
  },
  {
    name: "The Homesteader",
    category: "Farmhouse",
    description: "A classic farmhouse with a modern twist.",
    basePrice: 1299,
    priceRange: "$1299 - $6999",
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    floors: 2,
    planDetails: [
      "Detailed Floor Plans",
      "3D Renderings",
      "Electrical Plans",
      "Barn and Stable Plans",
    ],
    files: [
      {
        url: "https://archivaldesigns.com/cdn/shop/products/MAIN-IMAGE-Homestead_1200x.jpg?v=1724433203",
        type: "IMAGE",
      },
    ],
  },
  {
    name: "The Urbanite",
    category: "Apartments",
    description: "A stylish and compact apartment for city living.",
    basePrice: 599,
    priceRange: "$599 - $2999",
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    floors: 1,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    files: [
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtVr94RpeAvF531XOmZCUSXcxPbEWnDUTOgWf_vgG4RHaGDVOe5qc2wQKJ7HeWQn4jRXo&usqp=CAU",
        type: "IMAGE",
      },
    ],
  },
  {
    name: "The Weekender",
    category: "Tiny Homes",
    description: "A small and efficient home for weekend getaways.",
    basePrice: 299,
    priceRange: "$299 - $1999",
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    floors: 1,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    files: [
      {
        url: "https://s1.cdn.autoevolution.com/images/news/the-weekender-is-a-modern-single-floor-tiny-home-with-a-multifaceted-design-scheme-220357_1.jpg",
        type: "IMAGE",
      },
    ],
  },
  {
    name: "The Gemini",
    category: "Duplexes",
    description:
      "A versatile duplex for multi-generational living or rental income.",
    basePrice: 1599,
    priceRange: "$1599 - $8999",
    bedrooms: 6,
    bathrooms: 4,
    area: 4000,
    floors: 2,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    files: [
      {
        url: "https://amazingarchitecture.com/storage/2030/gemini_house_gas_architectures_michigan_usa.jpg",
        type: "IMAGE",
      },
    ],
  },
];

module.exports = { categoriesData, designsData };
