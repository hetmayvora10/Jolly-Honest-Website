// Demo catalogue. Every product here is illustrative: the real shop is a
// bespoke gents tailor, and the store pages say so in a banner. Prices are
// authoritative here — the checkout API reprices every order from this file
// and never trusts a price sent by the browser.
//
// To swap in real photography later, set `image` to a path under
// /public/images/products and ProductArt will render it instead.

export const CATEGORIES = {
  men: {
    label: "Men",
    title: "Menswear",
    blurb: "Tailored suiting, crisp shirting and easy weekend layers, cut on the same principles as our bespoke work.",
  },
  women: {
    label: "Women",
    title: "Womenswear",
    blurb: "Fluid silks, structured tailoring and everyday linen, made to be worn for years rather than seasons.",
  },
  kids: {
    label: "Kids",
    title: "Kidswear",
    blurb: "Occasion pieces and everyday cottons for children, sized with room to grow.",
  },
  traditional: {
    label: "Indian Traditional",
    title: "Indian Traditional",
    blurb: "Sherwanis, bandhgalas, kurtas and lehengas — the heart of Ahmedabad's wedding season, in heritage fabrics.",
  },
} as const;

export type CategoryId = keyof typeof CATEGORIES;
export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export type Pattern = "plain" | "pinstripe" | "check" | "herringbone" | "brocade" | "linen";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  type: string;
  price: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  fabric: string;
  pattern: Pattern;
  description: string;
  image?: string;
};

const MEN_SIZES = ["S", "M", "L", "XL", "XXL"];
const SUIT_SIZES = ["36", "38", "40", "42", "44", "46"];
const WAIST_SIZES = ["30", "32", "34", "36", "38"];
const WOMEN_SIZES = ["XS", "S", "M", "L", "XL"];
const KIDS_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"];

export const PRODUCTS: Product[] = [
  // ── Men ────────────────────────────────────────────────────────────────
  {
    id: "m-navy-pinstripe-suit",
    slug: "navy-pinstripe-suit",
    name: "Navy Pinstripe Two-Piece Suit",
    category: "men",
    type: "Suits",
    price: 24900,
    colors: [{ name: "Navy", hex: "#1f2a44" }, { name: "Charcoal", hex: "#33363b" }],
    sizes: SUIT_SIZES,
    fabric: "Super 120s wool",
    pattern: "pinstripe",
    description: "A half-canvassed two-piece with soft natural shoulders, a two-button front and flat-front trousers. Built for boardrooms and wedding receptions alike.",
  },
  {
    id: "m-charcoal-herringbone-blazer",
    slug: "charcoal-herringbone-blazer",
    name: "Charcoal Herringbone Blazer",
    category: "men",
    type: "Blazers",
    price: 14900,
    colors: [{ name: "Charcoal", hex: "#3a3a3c" }, { name: "Tobacco", hex: "#6b4a2f" }],
    sizes: SUIT_SIZES,
    fabric: "Wool–cashmere blend",
    pattern: "herringbone",
    description: "An unstructured single-breasted blazer in a fine herringbone. Patch pockets and a lightly rolled lapel keep it relaxed.",
  },
  {
    id: "m-white-oxford-shirt",
    slug: "white-oxford-shirt",
    name: "Classic Oxford Shirt",
    category: "men",
    type: "Shirts",
    price: 3490,
    colors: [{ name: "White", hex: "#f4f1ea" }, { name: "Sky", hex: "#b9cde3" }],
    sizes: MEN_SIZES,
    fabric: "Two-ply Oxford cotton",
    pattern: "plain",
    description: "A button-down collar, a single chest pocket and mother-of-pearl buttons. Softens beautifully with every wash.",
  },
  {
    id: "m-ivory-linen-shirt",
    slug: "ivory-linen-shirt",
    name: "Ivory Linen Camp Shirt",
    category: "men",
    type: "Shirts",
    price: 3990,
    colors: [{ name: "Ivory", hex: "#efe6d2" }, { name: "Sage", hex: "#a3ae94" }],
    sizes: MEN_SIZES,
    fabric: "European linen",
    pattern: "linen",
    description: "A relaxed camp collar and straight hem, made for Ahmedabad summers.",
  },
  {
    id: "m-tattersall-shirt",
    slug: "tattersall-check-shirt",
    name: "Tattersall Check Shirt",
    category: "men",
    type: "Shirts",
    price: 3690,
    colors: [{ name: "Cream & Burgundy", hex: "#eadfcb" }],
    sizes: MEN_SIZES,
    fabric: "Brushed cotton",
    pattern: "check",
    description: "A country classic with a spread collar and barrel cuffs.",
  },
  {
    id: "m-pleated-trousers",
    slug: "pleated-wool-trousers",
    name: "Pleated Wool Trousers",
    category: "men",
    type: "Trousers",
    price: 5990,
    colors: [{ name: "Grey", hex: "#7d7f82" }, { name: "Navy", hex: "#232e47" }],
    sizes: WAIST_SIZES,
    fabric: "Tropical wool",
    pattern: "plain",
    description: "Single forward pleats, side adjusters and a tapered leg finished with a turn-up.",
  },
  {
    id: "m-chinos",
    slug: "stone-chinos",
    name: "Stone Cotton Chinos",
    category: "men",
    type: "Trousers",
    price: 3290,
    colors: [{ name: "Stone", hex: "#cbbfa6" }, { name: "Olive", hex: "#5d6147" }],
    sizes: WAIST_SIZES,
    fabric: "Garment-dyed cotton twill",
    pattern: "plain",
    description: "Everyday chinos with a mid rise and a clean, slim leg.",
  },
  {
    id: "m-merino-knit",
    slug: "merino-polo-knit",
    name: "Merino Polo Knit",
    category: "men",
    type: "Knitwear",
    price: 4890,
    colors: [{ name: "Burgundy", hex: "#6e1d1d" }, { name: "Camel", hex: "#b08a5b" }],
    sizes: MEN_SIZES,
    fabric: "Extra-fine merino",
    pattern: "plain",
    description: "A three-button knitted polo that layers neatly under a blazer.",
  },

  // ── Women ──────────────────────────────────────────────────────────────
  {
    id: "w-silk-wrap-blouse",
    slug: "silk-wrap-blouse",
    name: "Silk Wrap Blouse",
    category: "women",
    type: "Tops",
    price: 6490,
    colors: [{ name: "Champagne", hex: "#e6d3b3" }, { name: "Garnet", hex: "#7a1f2b" }],
    sizes: WOMEN_SIZES,
    fabric: "Mulberry silk crêpe",
    pattern: "plain",
    description: "A softly draped wrap with a tie waist and bishop sleeves.",
  },
  {
    id: "w-linen-shirt",
    slug: "oversized-linen-shirt",
    name: "Oversized Linen Shirt",
    category: "women",
    type: "Tops",
    price: 3790,
    colors: [{ name: "White", hex: "#f3efe6" }, { name: "Terracotta", hex: "#b56a4b" }],
    sizes: WOMEN_SIZES,
    fabric: "Washed linen",
    pattern: "linen",
    description: "A generous, boyfriend-cut shirt with a curved hem.",
  },
  {
    id: "w-tailored-blazer",
    slug: "tailored-wool-blazer",
    name: "Tailored Wool Blazer",
    category: "women",
    type: "Blazers",
    price: 15900,
    colors: [{ name: "Black", hex: "#1d1b1a" }, { name: "Camel", hex: "#b48a5a" }],
    sizes: WOMEN_SIZES,
    fabric: "Wool gabardine",
    pattern: "plain",
    description: "A sharp-shouldered single-breasted blazer with a nipped waist.",
  },
  {
    id: "w-houndstooth-coat",
    slug: "check-wool-coat",
    name: "Check Wool Overcoat",
    category: "women",
    type: "Outerwear",
    price: 21900,
    colors: [{ name: "Oatmeal Check", hex: "#cdbfa8" }],
    sizes: WOMEN_SIZES,
    fabric: "Brushed wool",
    pattern: "check",
    description: "A long, double-breasted coat with dropped shoulders and a half belt at the back.",
  },
  {
    id: "w-wide-trousers",
    slug: "wide-leg-trousers",
    name: "High-Rise Wide-Leg Trousers",
    category: "women",
    type: "Trousers",
    price: 5490,
    colors: [{ name: "Ivory", hex: "#ece3d0" }, { name: "Navy", hex: "#1f2a44" }],
    sizes: WOMEN_SIZES,
    fabric: "Viscose–linen",
    pattern: "plain",
    description: "Front pleats and a fluid wide leg that falls cleanly to the floor.",
  },
  {
    id: "w-slip-dress",
    slug: "satin-slip-dress",
    name: "Satin Slip Dress",
    category: "women",
    type: "Dresses",
    price: 7990,
    colors: [{ name: "Emerald", hex: "#1f4d3c" }, { name: "Garnet", hex: "#6f1a26" }],
    sizes: WOMEN_SIZES,
    fabric: "Bias-cut satin",
    pattern: "plain",
    description: "A bias-cut midi with adjustable straps that moves with you.",
  },
  {
    id: "w-shirt-dress",
    slug: "pinstripe-shirt-dress",
    name: "Pinstripe Shirt Dress",
    category: "women",
    type: "Dresses",
    price: 6290,
    colors: [{ name: "Blue Stripe", hex: "#c9d5e4" }],
    sizes: WOMEN_SIZES,
    fabric: "Cotton poplin",
    pattern: "pinstripe",
    description: "A belted shirt dress cut from classic menswear shirting.",
  },
  {
    id: "w-cashmere-knit",
    slug: "cashmere-crewneck",
    name: "Cashmere Crewneck",
    category: "women",
    type: "Knitwear",
    price: 9490,
    colors: [{ name: "Oat", hex: "#d8c9b0" }, { name: "Rose", hex: "#c99a95" }],
    sizes: WOMEN_SIZES,
    fabric: "Pure cashmere",
    pattern: "plain",
    description: "A relaxed crewneck in a featherweight knit.",
  },

  // ── Kids ───────────────────────────────────────────────────────────────
  {
    id: "k-bandhgala-set",
    slug: "boys-bandhgala-set",
    name: "Boys' Bandhgala Set",
    category: "kids",
    type: "Occasion",
    price: 4990,
    colors: [{ name: "Ivory", hex: "#efe5cf" }, { name: "Maroon", hex: "#6b1a1a" }],
    sizes: KIDS_SIZES,
    fabric: "Cotton–silk",
    pattern: "brocade",
    description: "A miniature bandhgala jacket and trousers for weddings and family functions.",
  },
  {
    id: "k-lehenga",
    slug: "girls-lehenga-choli",
    name: "Girls' Lehenga Choli",
    category: "kids",
    type: "Occasion",
    price: 5490,
    colors: [{ name: "Rani Pink", hex: "#b8336a" }, { name: "Marigold", hex: "#d89a2b" }],
    sizes: KIDS_SIZES,
    fabric: "Art silk with zari",
    pattern: "brocade",
    description: "A twirling flared lehenga with a matching choli and soft net dupatta.",
  },
  {
    id: "k-oxford-shirt",
    slug: "kids-oxford-shirt",
    name: "Kids' Oxford Shirt",
    category: "kids",
    type: "Everyday",
    price: 1490,
    colors: [{ name: "White", hex: "#f4f1ea" }, { name: "Sky", hex: "#b9cde3" }],
    sizes: KIDS_SIZES,
    fabric: "Soft Oxford cotton",
    pattern: "plain",
    description: "A smaller version of our classic Oxford, ready for school days.",
  },
  {
    id: "k-check-dress",
    slug: "gingham-cotton-dress",
    name: "Gingham Cotton Dress",
    category: "kids",
    type: "Everyday",
    price: 1890,
    colors: [{ name: "Red Gingham", hex: "#e7c9c4" }],
    sizes: KIDS_SIZES,
    fabric: "Cotton gingham",
    pattern: "check",
    description: "A smocked sundress with pockets — the important part.",
  },
  {
    id: "k-waistcoat-set",
    slug: "boys-waistcoat-set",
    name: "Boys' Waistcoat Set",
    category: "kids",
    type: "Occasion",
    price: 3990,
    colors: [{ name: "Grey", hex: "#7d7f82" }, { name: "Navy", hex: "#232e47" }],
    sizes: KIDS_SIZES,
    fabric: "Poly-wool",
    pattern: "herringbone",
    description: "Waistcoat, shirt and trousers — a proper three-piece for small guests.",
  },
  {
    id: "k-linen-shorts",
    slug: "kids-linen-shorts",
    name: "Kids' Linen Shorts",
    category: "kids",
    type: "Everyday",
    price: 1290,
    colors: [{ name: "Sand", hex: "#d9c8a6" }],
    sizes: KIDS_SIZES,
    fabric: "Linen–cotton",
    pattern: "linen",
    description: "Elasticated-waist shorts made for play.",
  },

  // ── Indian Traditional ────────────────────────────────────────────────
  {
    id: "t-ivory-sherwani",
    slug: "ivory-silk-sherwani",
    name: "Ivory Silk Sherwani",
    category: "traditional",
    type: "Sherwanis",
    price: 38900,
    colors: [{ name: "Ivory", hex: "#eee3c8" }, { name: "Gold", hex: "#c9a35a" }],
    sizes: SUIT_SIZES,
    fabric: "Raw silk with zardozi",
    pattern: "brocade",
    description: "A knee-length sherwani with hand-finished zardozi at the collar and placket. Comes with churidar.",
  },
  {
    id: "t-maroon-sherwani",
    slug: "maroon-velvet-sherwani",
    name: "Maroon Velvet Sherwani",
    category: "traditional",
    type: "Sherwanis",
    price: 42900,
    colors: [{ name: "Maroon", hex: "#5e1414" }],
    sizes: SUIT_SIZES,
    fabric: "Silk velvet",
    pattern: "brocade",
    description: "Deep maroon velvet with antique-gold buttons, for the evening reception.",
  },
  {
    id: "t-bandhgala",
    slug: "navy-jodhpuri-bandhgala",
    name: "Navy Jodhpuri Bandhgala",
    category: "traditional",
    type: "Bandhgalas",
    price: 19900,
    colors: [{ name: "Navy", hex: "#1f2a44" }, { name: "Black", hex: "#1c1b1b" }],
    sizes: SUIT_SIZES,
    fabric: "Wool–silk",
    pattern: "plain",
    description: "A sharp closed-neck jacket with a jodhpuri cut, worn with trousers or churidar.",
  },
  {
    id: "t-nehru-jacket",
    slug: "brocade-nehru-jacket",
    name: "Brocade Nehru Jacket",
    category: "traditional",
    type: "Nehru Jackets",
    price: 6990,
    colors: [{ name: "Gold", hex: "#bf9b54" }, { name: "Bottle Green", hex: "#234536" }],
    sizes: MEN_SIZES,
    fabric: "Banarasi brocade",
    pattern: "brocade",
    description: "Layer it over a kurta for sangeet and mehendi evenings.",
  },
  {
    id: "t-kurta-set",
    slug: "cotton-kurta-pyjama-set",
    name: "Chikankari Kurta Set",
    category: "traditional",
    type: "Kurtas",
    price: 4590,
    colors: [{ name: "White", hex: "#f2efe8" }, { name: "Powder Blue", hex: "#bccbdb" }],
    sizes: MEN_SIZES,
    fabric: "Cotton with chikankari",
    pattern: "linen",
    description: "A hand-embroidered kurta with matching pyjama — light, breathable and timeless.",
  },
  {
    id: "t-lehenga",
    slug: "bridal-red-lehenga",
    name: "Red Silk Lehenga",
    category: "traditional",
    type: "Lehengas",
    price: 54900,
    colors: [{ name: "Bridal Red", hex: "#8f1a1f" }],
    sizes: WOMEN_SIZES,
    fabric: "Silk with zari work",
    pattern: "brocade",
    description: "A flared silk lehenga with a heavily worked hem, blouse and organza dupatta.",
  },
  {
    id: "t-anarkali",
    slug: "emerald-anarkali",
    name: "Emerald Anarkali Suit",
    category: "traditional",
    type: "Anarkalis",
    price: 12900,
    colors: [{ name: "Emerald", hex: "#1f4d3c" }, { name: "Midnight", hex: "#1c2340" }],
    sizes: WOMEN_SIZES,
    fabric: "Georgette",
    pattern: "plain",
    description: "A floor-length anarkali with a fitted bodice and gold-thread borders.",
  },
  {
    id: "t-saree-blouse",
    slug: "silk-saree-blouse",
    name: "Brocade Saree Blouse",
    category: "traditional",
    type: "Blouses",
    price: 3990,
    colors: [{ name: "Gold", hex: "#c39a52" }, { name: "Wine", hex: "#5d1a2a" }],
    sizes: WOMEN_SIZES,
    fabric: "Brocade silk",
    pattern: "brocade",
    description: "A ready-to-wear blouse with elbow sleeves and a back tie.",
  },
];

export function productsIn(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function isCategory(value: string): value is CategoryId {
  return value in CATEGORIES;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
