import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = process.env.VITE_SITE_URL || 'https://www.coverghar.in';
const API_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000'; // Default to local backend

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/products', changefreq: 'daily', priority: '0.9' },
  { url: '/themes', changefreq: 'weekly', priority: '0.8' },
  { url: '/customizer', changefreq: 'monthly', priority: '0.7' },
  { url: '/custom-mobile', changefreq: 'monthly', priority: '0.7' },
  { url: '/login', changefreq: 'monthly', priority: '0.5' },
  { url: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
  { url: '/terms-conditions', changefreq: 'monthly', priority: '0.3' },
  { url: '/returns-refunds', changefreq: 'monthly', priority: '0.3' },
  { url: '/shipping-policy', changefreq: 'monthly', priority: '0.3' },
  { url: '/track-order', changefreq: 'monthly', priority: '0.4' },
];

async function fetchDynamicRoutes() {
  const dynamicRoutes = [];

  try {
    console.log(`Fetching data from ${API_URL}...`);

    // 1. Fetch Products
    // Using a large limit to get most products. In production, consider pagination loop.
    const productsRes = await axios.get(`${API_URL}/api/products?limit=2000`);
    if (productsRes.data?.success && Array.isArray(productsRes.data?.data?.products)) {
      const products = productsRes.data.data.products;
      console.log(`Found ${products.length} products.`);
      products.forEach(product => {
        dynamicRoutes.push({
          url: `/products/${product._id}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : undefined
        });
      });
    }

    // 2. Fetch Collections (Themes)
    const collectionsRes = await axios.get(`${API_URL}/api/collections`);
    if (collectionsRes.data?.success && Array.isArray(collectionsRes.data?.data?.collections)) {
      const collections = collectionsRes.data.data.collections;
      console.log(`Found ${collections.length} collections.`);
      collections.forEach(collection => {
        dynamicRoutes.push({
          url: `/collection/${collection.handle}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: collection.updatedAt ? new Date(collection.updatedAt).toISOString().split('T')[0] : undefined
        });
      });
    }

  } catch (error) {
    console.error('Error fetching dynamic routes:', error.message);
    console.warn('⚠️ Generating sitemap with static routes only due to API error.');
    console.warn('Ensure the backend server is running at', API_URL);
  }

  return dynamicRoutes;
}

async function generateSitemap() {
  console.log('Starting sitemap generation...');

  // Get dynamic routes
  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${SITE_URL}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  try {
    fs.writeFileSync(outputPath, sitemap);
    console.log(`✅ Sitemap successfully generated at ${outputPath}`);
    console.log(`Total URLs: ${allRoutes.length}`);
  } catch (err) {
    console.error('Failed to write sitemap file:', err);
  }
}

if (process.argv[2] === 'generate') {
  generateSitemap();
}

export default generateSitemap;
