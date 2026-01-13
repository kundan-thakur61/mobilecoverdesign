import React from 'react'

function CategoryPage() {
  return (
    <div>page</div>
  )
}

export default CategoryPage;


// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProducts } from '../redux/slices/productSlice';
// import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
// import ProductCard from '../components/ProductCard';
// import Loader, { CardSkeleton } from '../components/Loader';
// import SEO from '../components/SEO';

// const CategoryPage = () => {
//   const { category } = useParams();
//   const dispatch = useDispatch();
//   const { products, loading, error } = useSelector((state) => state.products);
//   const [categoryData, setCategoryData] = useState(null);

//   useEffect(() => {
//     dispatch(fetchProducts({ category, limit: 20 }));
//   }, [dispatch, category]);

//   useEffect(() => {
//     // Set category-specific data
//     const categoryInfo = getCategoryInfo(category);
//     setCategoryData(categoryInfo);
//   }, [category]);

//   const getCategoryInfo = (cat) => {
//     const categories = {
//       iphone: {
//         title: "iPhone Mobile Covers Online India | Custom iPhone Cases | CoverGhar.in",
//         description: "Buy premium iPhone mobile covers online in India. Custom iPhone cases for iPhone 15, 14, 13, SE. Perfect fit, premium protection with personalized designs.",
//         keywords: "iPhone mobile cover, iPhone cases online India, custom iPhone covers, iPhone 15 cover, iPhone 14 case",
//         h1: "Premium iPhone Mobile Covers Online India - Custom iPhone Cases",
//         intro: "Protect your iPhone with our extensive collection of custom iPhone covers. From iPhone 15 to older models, we offer perfect-fit cases that combine style, protection, and personalization.",
//         content: `
//           <h2>Why Choose Custom iPhone Covers from CoverGhar.in?</h2>
//           <p>Your iPhone deserves the best protection available. Our custom iPhone covers are designed specifically for Apple's premium devices, ensuring perfect compatibility and functionality. With precision-cut openings for all ports, cameras, and buttons, our cases maintain your iPhone's sleek design while adding personal style.</p>

//           <h3>iPhone 15 Series Covers</h3>
//           <p>The iPhone 15 series features the Dynamic Island and advanced camera systems. Our iPhone 15 covers are engineered to accommodate these new features perfectly. Choose from slim protection cases, rugged bumpers, or full-body covers that showcase your personality while keeping your device safe.</p>

//           <h3>iPhone 14 & iPhone 13 Covers</h3>
//           <p>Our iPhone 14 and iPhone 13 covers work seamlessly with the Ceramic Shield front glass and advanced camera systems. Whether you have the Pro models with their sophisticated camera arrays or the standard versions, we have covers that complement your device's premium build quality.</p>

//           <h3>iPhone SE & Classic Models</h3>
//           <p>For iPhone SE users and owners of classic iPhone models, we offer covers that maintain the compact design you love. Our cases for smaller iPhones provide the same level of protection and customization options as our larger model covers.</p>

//           <h2>iPhone Cover Materials & Protection</h2>
//           <p>We use premium materials specifically chosen for iPhone compatibility. Our polycarbonate cases with TPU liners provide shock absorption while maintaining the slim profile iPhone users expect. UV printing ensures your custom designs remain vibrant and scratch-resistant.</p>

//           <h3>Camera Protection</h3>
//           <p>iPhone cameras are precision instruments. Our cases feature raised bezels around camera lenses to prevent scratches when placed screen-down. The camera cutouts are precision-aligned to avoid interference with image quality or flash performance.</p>

//           <h3>Wireless Charging Compatibility</h3>
//           <p>All our iPhone covers are designed for wireless charging compatibility. Whether you use MagSafe or standard Qi wireless chargers, our cases won't interfere with charging speeds or magnetic alignment.</p>

//           <h2>Custom iPhone Cover Design Options</h2>
//           <p>Express yourself with unlimited customization options. Upload personal photos, choose from our template library, or create something completely unique. Our design tool works seamlessly across all iPhone models.</p>

//           <h3>Photo Covers</h3>
//           <p>Transform cherished memories into beautiful iPhone covers. Our high-resolution printing captures every detail of your photos, creating covers that are as unique as your experiences.</p>

//           <h3>Designer Patterns</h3>
//           <p>Choose from thousands of designer patterns, from minimalist designs to bold statements. Our collection includes geometric patterns, nature themes, and contemporary art that complements your iPhone's aesthetic.</p>

//           <h2>iPhone Cover Care & Maintenance</h2>
//           <p>Keep your iPhone cover looking new with proper care. Clean regularly with a soft cloth and mild soap. Avoid harsh chemicals that could damage the UV printing. With proper maintenance, your custom iPhone cover will maintain its beauty and protection for years.</p>

//           <h2>Why CoverGhar.in for iPhone Covers?</h2>
//           <ul>
//             <li>Perfect fit for all iPhone models</li>
//             <li>Premium materials with UV printing</li>
//             <li>Wireless charging compatible</li>
//             <li>Camera protection guaranteed</li>
//             <li>Fast shipping across India</li>
//             <li>6-month warranty on all covers</li>
//           </ul>
//         `,
//         schema: {
//           "@context": "https://schema.org",
//           "@type": "CollectionPage",
//           "name": "iPhone Mobile Covers",
//           "description": "Premium iPhone mobile covers online India with custom designs and perfect fit"
//         }
//       },
//       samsung: {
//         title: "Samsung Mobile Covers Online India | Galaxy Phone Cases | CoverGhar.in",
//         description: "Premium Samsung mobile covers online India. Custom Galaxy S, A, Note series cases. Designer covers for Samsung smartphones with perfect fit.",
//         keywords: "Samsung mobile cover, Galaxy phone cases, Samsung covers online India, custom Samsung cases, Galaxy S24 cover",
//         h1: "Premium Samsung Mobile Covers Online India - Galaxy Phone Cases",
//         intro: "Discover our comprehensive collection of Samsung mobile covers designed for Galaxy S, A, Note, and Z series. Custom cases that protect and personalize your Samsung device.",
//         content: `
//           <h2>Samsung Galaxy Series Covers</h2>
//           <p>Samsung's Galaxy series represents the pinnacle of Android innovation. Our Galaxy covers are engineered to complement the sleek design and advanced features of Samsung's flagship devices. From the Galaxy S24 with its AI-powered cameras to the versatile Galaxy Z Fold, we have covers that enhance your Samsung experience.</p>

//           <h3>Galaxy S Series Covers</h3>
//           <p>The Galaxy S series is Samsung's most popular lineup. Our Galaxy S covers for S24, S23, S22, and earlier models feature precision cutouts for the camera systems and S Pen (where applicable). Choose from slim protection, rugged cases, or premium leather options that match Samsung's premium aesthetic.</p>

//           <h3>Galaxy A Series Covers</h3>
//           <p>For Galaxy A series users seeking affordability without compromising style, our covers provide excellent protection at competitive prices. Available for Galaxy A54, A34, A24, and other A series models, these covers maintain the vibrant personality of Samsung's mid-range devices.</p>

//           <h3>Galaxy Note & Ultra Covers</h3>
//           <p>Galaxy Note and Ultra models come with S Pen functionality. Our covers for these devices include S Pen slots and reinforced areas to protect the stylus. The larger screens and premium builds of these devices are perfectly complemented by our custom cover designs.</p>

//           <h3>Galaxy Z Fold & Flip Covers</h3>
//           <p>Foldable Samsung devices require specialized protection. Our Galaxy Z covers are designed for the unique hinge mechanisms and flexible screens. These covers provide protection when folded while allowing full functionality when opened.</p>

//           <h2>Samsung Cover Materials & Technology</h2>
//           <p>We use materials specifically chosen for Samsung devices. Our cases feature antimicrobial properties, wireless charging compatibility, and designs that work with Samsung's ecosystem features like DeX and Smart View.</p>

//           <h3>Camera System Protection</h3>
//           <p>Samsung's advanced camera systems deserve specialized protection. Our covers feature raised camera housings and precision-cut openings that prevent scratches while maintaining camera performance. Whether you have ultra-wide lenses or telephoto systems, our covers keep them safe.</p>

//           <h3>S Pen Compatibility</h3>
//           <p>For Note series users, S Pen functionality is crucial. Our covers include dedicated S Pen slots and magnetic areas for secure storage. The covers are designed to allow easy access to the S Pen while providing full protection for your device.</p>

//           <h2>Custom Samsung Cover Designs</h2>
//           <p>Personalize your Samsung device with custom covers that reflect your style. Our design platform supports all Samsung models, ensuring perfect alignment and functionality.</p>

//           <h3>Galaxy Ecosystem Integration</h3>
//           <p>Our Samsung covers are designed to work seamlessly with Samsung's ecosystem. They support wireless charging, Samsung Pay, and other Samsung-specific features without interference.</p>

//           <h2>Samsung Cover Care & Warranty</h2>
//           <p>All Samsung covers come with comprehensive protection. Our 6-month warranty covers manufacturing defects, and we provide care instructions to maintain your cover's appearance and functionality.</p>

//           <h2>Why Choose CoverGhar.in for Samsung Covers?</h2>
//           <ul>
//             <li>Perfect compatibility with all Galaxy models</li>
//             <li>S Pen support for Note series</li>
//             <li>Wireless charging compatible</li>
//             <li>Camera protection guaranteed</li>
//             <li>Ecosystem integration</li>
//             <li>Premium quality materials</li>
//           </ul>
//         `,
//         schema: {
