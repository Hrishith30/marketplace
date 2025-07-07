import { CategoryPageClient } from "./category-page-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  // Fix category name mapping for special characters
  const categoryNameMap: { [key: string]: string } = {
    'home-&-garden': 'Home & Garden',
    'garden-&-outdoor': 'Garden & Outdoor',
    'baby-&-kids': 'Baby & Kids',
    'toys-&-games': 'Toys & Games',
    'sports-&-outdoors': 'Sports & Outdoors',
    'art-&-collectibles': 'Art & Collectibles',
    'jewelry-&-watches': 'Jewelry & Watches',
    'business-&-industrial': 'Business & Industrial',
    'health-&-beauty': 'Health & Beauty',
    'books-&-magazines': 'Books & Magazines',
    'movies-&-tv': 'Movies & TV',
    'exercise-&-fitness': 'Exercise & Fitness',
    'camping-&-hiking': 'Camping & Hiking',
    'food-&-beverages': 'Food & Beverages',
    'hobbies-&-crafts': 'Hobbies & Crafts',
    'office-supplies': 'Office Supplies',
    'automotive-parts': 'Automotive Parts',
    'baby-gear': 'Baby Gear',
    'pet-supplies': 'Pet Supplies',
    'musical-equipment': 'Musical Equipment',
    'video-games': 'Video Games',
    'sports-equipment': 'Sports Equipment',
    'real-estate': 'Real Estate'
  };

  // Use mapped name if available, otherwise use decoded slug
  const categoryName = categoryNameMap[decodedSlug] || decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

  return <CategoryPageClient categoryName={categoryName} />;
} 