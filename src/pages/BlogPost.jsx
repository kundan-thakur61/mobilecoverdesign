import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';

// Article Content Database
const articles = {
    'personalized-gift-ideas-under-500': {
        title: "5 Personalized Gift Ideas Under ₹500 for Your Best Friend",
        date: "2025-01-26",
        category: "Gift Guide",
        readTime: "4 min read",
        content: `
      <p class="lead">Finding a thoughtful gift doesn't have to break the bank. Customized gifts add a personal touch that shows you care, without costing a fortune. Here are 5 amazing personalized gift ideas under ₹500.</p>
      
      <h2>1. Custom Photo Mobile Cover (₹199 - ₹299)</h2>
      <p>A <strong>custom mobile cover</strong> is arguably the best budget-friendly personalized gift. You can print a memorable photo of you and your best friend directly onto a durable hard case.</p>
      <ul>
        <li><strong>Why it's great:</strong> They carry it everywhere, reminding them of your bond daily.</li>
        <li><strong>Where to buy:</strong> <a href="/customizer" class="text-primary-600 hover:underline">Design one here at CoverGhar</a>.</li>
      </ul>

      <h2>2. Personalized Keychain (₹149)</h2>
      <p>A simple yet effective gift. Get an acrylic or metal keychain printed with their name or a small photo. It's practical and keeps their keys organized with style.</p>

      <h2>3. Custom Pop Socket / Grip (₹99)</h2>
      <p>Mobile grips are trending and super useful. You can get a custom-printed pop holder with a quirky quote or their favorite anime character.</p>

      <h2>4. Spotify Plaque (Mini)</h2>
      <p>While larger glass plaques cost more, smaller acrylic versions or keychain-sized Spotify code scanners fit perfectly within the ₹500 budget. Pick "your song" and make it eternal.</p>

      <h2>5. Use Your Own Photos for a Theme Case</h2>
      <p>If they love a specific TV show or aesthetic, you don't need official merch. Use our <a href="/customizer" class="text-primary-600 hover:underline">Custom Design Tool</a> to upload a high-quality wallpaper of their favorite fandom and print it on a case.</p>

      <h3>Conclusion</h3>
      <p>You don't need to spend thousands to make someone feel special. A ₹199 custom printed cover often holds more value than a ₹2000 generic watch because of the memory attached to it.</p>
    `
    },
    'hard-case-vs-soft-case-iphone': {
        title: "Hard Case vs Soft Case: Which is Better for Your iPhone?",
        date: "2025-01-25",
        category: "Product Guide",
        readTime: "5 min read",
        content: `
      <p class="lead">Investing in an iPhone is no small feat, so protecting it is a priority. But when it comes to cases, should you go for a rigid Hard Case or a flexible Soft Silicone case? Let's break it down.</p>

      <h2>Hard Cases (Polycarbonate)</h2>
      <p>Hard cases are typically made from durable polycarbonate plastic. They snap onto your phone and provide a solid shell.</p>
      <ul>
        <li><strong>Pros:</strong> Excellent for printing high-resolution photos (like our <a href="/products?type=hard" class="text-primary-600 hover:underline">Hard Cases</a>). They don't turn yellow over time.</li>
        <li><strong>Cons:</strong> Can be slippery; might crack under extreme pressure (though rare).</li>
        <li><strong>Best For:</strong> Style lovers who want vibrant, permanent designs.</li>
      </ul>

      <h2>Soft Cases (Silicone / TPU)</h2>
      <p>Soft cases are rubbery and flexible. They absorb shock very well.</p>
      <ul>
        <li><strong>Pros:</strong> Great grip; excellent shock absorption if dropped. easy to put on and take off.</li>
        <li><strong>Cons:</strong> Clear silicone cases often turn yellow after a few months due to oxidation.</li>
        <li><strong>Best For:</strong> Clumsy users who drop their phones often.</li>
      </ul>

      <h2>The Verdict</h2>
      <p>If you prioritize <strong>looks and design longevity</strong>, go for a <strong>Hard Case</strong>. The print quality is superior and never fades.</p>
      <p>If you prioritize <strong>grip and drop protection</strong>, a <strong>Soft Silicone Case</strong> is your best bet.</p>
    `
    },
    'trending-anime-phone-case-designs-2026': {
        title: "Trending Anime Phone Case Designs for 2026",
        date: "2025-01-20",
        category: "Trends",
        readTime: "3 min read",
        content: `
      <p class="lead">Anime culture has exploded in India, and your phone case is the perfect canvas to show off your power level. Here are the top trends we are seeing for 2026.</p>

      <h2>1. Minimalist Manga Panels</h2>
      <p>Instead of full-color chaotic scenes, fans are opting for black-and-white manga panels. They look aesthetic, clean, and match any outfit. Popular choices: <em>Vagabond, Berserk, and Chainsaw Man</em>.</p>

      <h2>2. Subtle "Low-Key" References</h2>
      <p>Designs that only other fans would recognize. A small "Survey Corps" logo or a subtle "Cloud" pattern from Akatsuki. It's streetwear for your phone.</p>

      <h2>3. Character Eyes</h2>
      <p>A rectangular crop zooming in on the character's eyes. Gojo's blue eyes or Sharingan designs are top sellers in our <a href="/themes?category=anime" class="text-primary-600 hover:underline">Anime Collection</a>.</p>

      <h2>4. Retro 90s Aesthetic</h2>
      <p>Vintage anime styles like <em>Cowboy Bebop</em> or <em>Sailor Moon</em> with lo-fi filters are making a huge comeback.</p>

      <h3>Get Yours Today</h3>
      <p>Don't stick with a boring stock case. Browse our <a href="/themes" class="text-primary-600 hover:underline">Designer Themes</a> or upload your own favorite anime panel in our Customizer!</p>
    `
    }
};

const BlogPost = () => {
    const { slug } = useParams();
    const article = articles[slug];

    if (!article) {
        return <Navigate to="/blog" replace />;
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": `Read about ${article.title}. ${article.category} regarding mobile covers and accessories.`,
        "datePublished": article.date,
        "dateModified": article.date,
        "author": { "@type": "Organization", "name": "CoverGhar", "url": "https://www.coverghar.in" },
        "publisher": {
            "@type": "Organization",
            "name": "CoverGhar",
            "logo": { "@type": "ImageObject", "url": "https://res.cloudinary.com/dwmytphop/image/upload/v1766473299/ChatGPT_Image_Dec_23_2025_12_30_26_PM_oyeb3g.jpg" }
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.coverghar.in/blog/${slug}` },
        "url": `https://www.coverghar.in/blog/${slug}`,
        "articleSection": article.category
    };

    return (
        <>
            <SEO
                title={`${article.title} | CoverGhar Blog`}
                description={`Read about ${article.title}. ${article.category} regarding mobile covers and accessories.`}
                url={`/blog/${slug}`}
                schema={articleSchema}
            />
            <div className="min-h-screen bg-gray-50 py-12">
                <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary-600 px-8 py-10 text-white">
                        <div className="flex items-center gap-4 text-sm font-medium opacity-90 mb-4">
                            <span className="bg-white/20 px-3 py-1 rounded-full">{article.category}</span>
                            <span>{article.readTime}</span>
                            <span>{article.date}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                            {article.title}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-10 prose prose-lg prose-primary max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>

                    {/* Footer CTA */}
                    <div className="bg-gray-50 px-8 py-8 border-t border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Liked this article?</h3>
                        <p className="text-gray-600 mb-4">Check out our latest collection of custom covers.</p>
                        <Link
                            to="/products"
                            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                        >
                            Browse Shop
                        </Link>
                    </div>
                </article>

                <div className="max-w-3xl mx-auto mt-8 text-center">
                    <Link to="/blog" className="text-gray-500 hover:text-primary-600 font-medium">
                        ← Back to All Articles
                    </Link>
                </div>
            </div>
        </>
    );
};

export default BlogPost;
