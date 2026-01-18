/* src/data/fallbackCollections.js */

// Cloudinary Image Constants
const ONE    ="https://res.cloudinary.com/dwmytphop/image/upload/v1768711385/krishna_click_pxhyip.png  "
const TWO    ="https://res.cloudinary.com/dwmytphop/image/upload/v1768711388/anima_click_js3jqo.png  "
const THREE  ="https://res.cloudinary.com/dwmytphop/image/upload/v1768711386/marbal_click_kgcidi.png  "
const FOUR   ="https://res.cloudinary.com/dwmytphop/image/upload/v1768711373/cricketer_click_oejwbo.png  "
const FIVE   ="https://res.cloudinary.com/dwmytphop/image/upload/v1768711371/cute_click_x7zdpj.png  "
const SIX    ="https://res.cloudinary.com/dwmytphop/image/upload/v1768711387/aesthetic_click_iv0268.png  "
const SEVEN  ="https://res.cloudinary.com/dwmytphop/image/upload/v1768711386/flower_click_efvhzs.png  "
const EIGHT  ="https://res.cloudinary.com/dwmytphop/image/upload/v1768710304/Football_click_xgcnsy.png  "


const slugify = (value = '') => value
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9_-]+/g, '-')
  .replace(/^-+|-+$/g, '');
  // .replace(/^-+jjjjjj|-+$/g, '');

const RAW_FALLBACK_COLLECTIONS = [
  {

    handle: 'Krishna Theme',
    aliases: ['1'],
    title:'GOD  Krishna ',
    tagline: 'Soft gradients with a glassy sheen.',
    accentColor: '#f472b6',
    heroImage: ONE,
    description: 'A soothing drop featuring hazy gradients, prism flares and airy lettering. Ideal for dreamy lock-screens.',
    images: [
      { url: ONE, caption: 'Sunset fizz' },
      { url: FOUR, caption: 'Petal glass' }
    ]
  },
  {
    handle: 'Anime Theme',
    aliases: ['2'],
    title:'Anime Theme',
       tagline: 'Upload-ready canvases with guide layers.',
    accentColor: '#22d3ee',
    heroImage: TWO,
    description: 'A flexible canvas pack with high-contrast grids and masking overlays for quick mockups.',
    images: [
      { url: TWO, caption: 'Blueprint neon' },
      { url: SIX, caption: 'Guide overlay' }
    ]
  },
  {
    handle: 'Marble Theme',
    aliases: ['3'],
    title:'Marble Theme',
       tagline: 'Luxe streaks dipped in gold foil.',
    accentColor: '#fbbf24',
    heroImage: THREE,
    description: 'Deep charcoal slabs with molten gold veins and cloudy lilac smoke drifting over the edges.',
    images: [
      { url: THREE, caption: 'Molten river' },
      { url: FIVE, caption: 'Lavender quartz' }
    ]
  },
  {
    handle: 'Cricketer Theme',
    aliases: ['4'],
  title:'Cricketer Theme',
   tagline: 'Statement typography for bold covers.',
    accentColor: '#fb7185',
    heroImage: FOUR,
    description: 'Punchy serif phrases with halftone shadows and grainy spray textures for maximum impact.',
    images: [
      { url: FOUR, caption: 'Italic punch' },
      { url: TWO, caption: 'Neon mantra' }
    ]
  },
  {
    handle: 'Cute Theme',
    aliases: ['5'],
    title:'Cute Theme',
        tagline: 'Inky botanicals with electric outlines.',
    accentColor: '#38bdf8',
    heroImage: FIVE,
    description: 'Botanical sketches glowing against a cobalt gradient with scattered star dust.',
    images: [
      { url: FIVE, caption: 'Luminous petals' },
      { url: ONE, caption: 'Starlit stems' }
    ]
  },
  // add new
  {
    handle: 'Aesthetic Theme',
    aliases: ['6'],
  title:'Aesthetic Theme',
    tagline: 'Northern lights reimagined as waveforms.',
    accentColor: '#34d399',
    heroImage: SIX,
    description: 'Layered ribbons of mint and violet with subtle scanlines for that retro-future mood.',
    images: [
      { url: SIX, caption: 'Spectrum trail' },
      { url: THREE, caption: 'Nightfall fade' }
    ]
  },
  {
    handle: 'Flower Theme',
    aliases: ['7'],
    title:'Flower Theme',
        tagline: 'Playful scribbles floating in zero-g.',
    accentColor: '#c084fc',
    heroImage: SEVEN,
    description: 'Marker-style doodles orbiting pastel planets, perfect for custom case freestyles.',
    images: [
      { url: SEVEN, caption: 'Orbit loops' },
      { url: FIVE, caption: 'Daydream rings' }
    ]
  },
  {
    handle: 'Footballer Theme',
    aliases: ['8'],
    title:'Footballer Theme',

    tagline: 'Soccer-inspired designs with dynamic patterns.',
    accentColor: '#22c55e',
    heroImage: EIGHT,
    description: 'Vibrant football-themed designs with soccer ball patterns, goal nets, and stadium motifs for sports enthusiasts.',
    images: [
      { url: EIGHT, caption: 'Soccer field' },
      { url: FIVE, caption: 'Goal celebration' }
    ]
  }
];

export const FALLBACK_COLLECTIONS = RAW_FALLBACK_COLLECTIONS.map((collection, index) => {
  const handle = slugify(collection.handle || collection.title || `fallback-${index}`);
  const normalizedImages = (collection.images || []).map((image, imageIndex) => ({
    _id: image._id || `fallback-${handle}-img-${imageIndex}`,
    url: image.url || image,
    caption: image.caption || collection.title,
    sortOrder: imageIndex
  }));

  return {
    ...collection,
    _id: collection._id || `fallback-${handle}`,
    handle,
    isFallback: true,
    images: normalizedImages.length ? normalizedImages : [{
      _id: `fallback-${handle}-img-0`,
      url: collection.heroImage,
      caption: collection.title,
      sortOrder: 0
    }]
  };
});

export const FALLBACK_COLLECTION_MAP = FALLBACK_COLLECTIONS.reduce((acc, collection) => {
  const keys = [collection.handle, ...(collection.aliases || [])]
    .map((value) => slugify(value))
    .filter(Boolean);

  keys.forEach((key) => {
    if (!acc[key]) {
      acc[key] = collection;
    }
  });

  return acc;
}, {});

export default FALLBACK_COLLECTIONS;