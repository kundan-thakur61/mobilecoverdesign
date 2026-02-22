import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 Personalized Gift Ideas Under ₹500 for Your Best Friend",
      excerpt: "Finding a thoughtful gift doesn't have to break the bank. Customized gifts add a personal touch that shows you care.",
      date: "2025-01-26",
      readTime: "4 min read",
      category: "Gift Guide",
      slug: "personalized-gift-ideas-under-500"
    },
    {
      id: 2,
      title: "Hard Case vs Soft Case: Which is Better for Your iPhone?",
      excerpt: "Should you go for a rigid Hard Case or a flexible Soft Silicone case? Let's break down the pros and cons.",
      date: "2025-01-25",
      readTime: "5 min read",
      category: "Product Guide",
      slug: "hard-case-vs-soft-case-iphone"
    },
    {
      id: 3,
      title: "Trending Anime Phone Case Designs for 2026",
      excerpt: "Anime culture has exploded in India. Here are the top trends in manga panels and character designs we are seeing for 2026.",
      date: "2025-01-20",
      readTime: "3 min read",
      category: "Trends",
      slug: "trending-anime-phone-case-designs-2026"
    },
    {
      id: 4,
      title: "iPhone 15 Mobile Covers: Best Protection for Your Premium Device",
      excerpt: "Explore the best mobile covers for iPhone 15 with premium protection and stylish designs.",
      date: "2025-02-01",
      readTime: "8 min read",
      category: "iPhone",
      slug: "iphone-15-mobile-covers"
    },
    {
      id: 5,
      title: "Samsung Galaxy S24 Cases: Style Meets Functionality",
      excerpt: "Find the perfect mobile covers for Samsung Galaxy S24 series with cutting-edge design and protection.",
      date: "2025-02-05",
      readTime: "6 min read",
      category: "Samsung",
      slug: "samsung-galaxy-s24-cases"
    },
    {
      id: 6,
      title: "Anime Mobile Covers: Show Your Fandom with Style",
      excerpt: "Discover anime-inspired mobile covers featuring your favorite characters and series.",
      date: "2025-02-10",
      readTime: "5 min read",
      category: "Anime",
      slug: "anime-mobile-covers"
    },
    {
      id: 7,
      title: "Mobile Cover Care: How to Keep Your Phone Case Looking New",
      excerpt: "Essential tips and tricks to maintain your mobile cover and extend its lifespan.",
      date: "2025-02-15",
      readTime: "4 min read",
      category: "Care",
      slug: "mobile-cover-care-guide"
    }
  ];

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CoverGhar Blog",
    "description": "Latest trends, guides, and tips about mobile covers and phone cases in India",
    "url": "https://www.coverghar.in/blog"
  };

  return (
    <>
      <SEO
        title="Mobile Cover Blog | Trends, Guides & Tips | CoverGhar.in"
        description="Read the latest blog posts about mobile covers, phone cases, customization tips, and smartphone accessory trends in India."
        keywords="mobile cover blog, phone case guide, mobile accessory tips, smartphone trends India"
        url="/blog"
        schema={blogSchema}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">CoverGhar Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your ultimate guide to mobile covers, phone cases, and smartphone accessories in India.
              Stay updated with the latest trends, tips, and expert advice.
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('en-IN')}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-primary-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Stay Updated with Mobile Cover Trends</h2>
            <p className="text-lg mb-6 opacity-90">
              Subscribe to our newsletter for the latest trends, exclusive offers, and expert tips on mobile covers.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
