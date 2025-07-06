import { notFound } from "next/navigation";
import { CategoryPageClient } from "./category-page-client";
import { supabase } from "@/lib/supabase";

// Category mapping
const categoryMap: { [key: string]: string } = {
  // All Items (homepage)
  'all-items': 'All Items',
  
  // Main categories with both URL variants
  'electronics': 'Electronics',
  'home-garden': 'Home & Garden',
  'home-&-garden': 'Home & Garden',
  'clothing': 'Clothing',
  'toys-games': 'Toys & Games',
  'toys-&-games': 'Toys & Games',
  'vehicles': 'Vehicles',
  'books': 'Books',
  'musical-instruments': 'Musical Instruments',
  'cameras-photo': 'Cameras & Photo',
  'cameras-&-photo': 'Cameras & Photo',
  'sports-outdoors': 'Sports & Outdoors',
  'sports-&-outdoors': 'Sports & Outdoors',
  'baby-kids': 'Baby & Kids',
  'baby-&-kids': 'Baby & Kids',
  'pets': 'Pets',
  'art-collectibles': 'Art & Collectibles',
  'art-&-collectibles': 'Art & Collectibles',
  'furniture': 'Furniture',
  'computers': 'Computers',
  'jewelry-watches': 'Jewelry & Watches',
  'jewelry-&-watches': 'Jewelry & Watches',
  'business-industrial': 'Business & Industrial',
  'business-&-industrial': 'Business & Industrial',
  'health-beauty': 'Health & Beauty',
  'health-&-beauty': 'Health & Beauty',
  'tools': 'Tools',
  'garden-outdoor': 'Garden & Outdoor',
  'garden-&-outdoor': 'Garden & Outdoor',
  'food-beverages': 'Food & Beverages',
  'food-&-beverages': 'Food & Beverages',
  'antiques': 'Antiques',
  'collectibles': 'Collectibles',
  'hobbies-crafts': 'Hobbies & Crafts',
  'hobbies-&-crafts': 'Hobbies & Crafts',
  'office-supplies': 'Office Supplies',
  'office-&-supplies': 'Office Supplies',
  'appliances': 'Appliances',
  'automotive-parts': 'Automotive Parts',
  'automotive-&-parts': 'Automotive Parts',
  'baby-gear': 'Baby Gear',
  'baby-&-gear': 'Baby Gear',
  'pet-supplies': 'Pet Supplies',
  'pet-&-supplies': 'Pet Supplies',
  'musical-equipment': 'Musical Equipment',
  'musical-&-equipment': 'Musical Equipment',
  'video-games': 'Video Games',
  'video-&-games': 'Video Games',
  'movies-tv': 'Movies & TV',
  'movies-&-tv': 'Movies & TV',
  'books-magazines': 'Books & Magazines',
  'books-&-magazines': 'Books & Magazines',
  'sports-equipment': 'Sports Equipment',
  'sports-&-equipment': 'Sports Equipment',
  'exercise-fitness': 'Exercise & Fitness',
  'exercise-&-fitness': 'Exercise & Fitness',
  'camping-hiking': 'Camping & Hiking',
  'camping-&-hiking': 'Camping & Hiking',
  'travel': 'Travel',
  'real-estate': 'Real Estate',
  'real-&-estate': 'Real Estate',
  'services': 'Services',
  'jobs': 'Jobs',
  'community': 'Community'
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const categoryName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

  return <CategoryPageClient categoryName={categoryName} />;
} 