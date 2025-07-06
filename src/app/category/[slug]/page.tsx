import { CategoryPageClient } from "./category-page-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const categoryName = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

  return <CategoryPageClient categoryName={categoryName} />;
} 