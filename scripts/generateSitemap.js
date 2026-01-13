import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.VITE_SITE_URL || 'https://www.coverghar.in';

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/products', changefreq: 'daily', priority: '0.9' },
  { url: '/themes', changefreq: 'weekly', priority: '0.8' },
  { url: '/customizer', changefreq: 'monthly', priority: '0.7' },
  { url: '/custom-mobile', changefreq: 'monthly', priority: '0.7' },
];

function generateSitemap(dynamicRoutes = []) {
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
  fs.writeFileSync(outputPath, sitemap);
  console.log(`✅ Sitemap generated at ${outputPath}`);
}

if (process.argv[2] === 'generate') {
  generateSitemap();
}

export default generateSitemap;
