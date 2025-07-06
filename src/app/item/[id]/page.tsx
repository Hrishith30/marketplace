import { notFound } from "next/navigation";
import ItemDetailClient from "@/components/marketplace/item-detail-client";

// Mock data for development - will be replaced with Supabase
const mockItems = [
  {
    id: "1",
    title: "iPhone 13 Pro - Excellent Condition",
    description: "Selling my iPhone 13 Pro in excellent condition. 256GB storage, Pacific Blue color. Includes original box, charger, and protective case. No scratches or damage. Battery health at 92%. Perfect for anyone looking for a high-quality iPhone at a great price.",
    price: 799,
    location: "Palo Alto, CA",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    category: "Electronics",
    sellerEmail: "john.doe@example.com",
    sellerPhone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    title: "MacBook Air M2 - 2023 Model",
    description: "MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Space Gray color. Purchased in March 2023, still under AppleCare warranty. Perfect condition, no scratches or dents. Comes with original charger and box.",
    price: 999,
    location: "Menlo Park, CA",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
    category: "Electronics",
    sellerEmail: "sarah.smith@example.com",
    sellerPhone: "+1 (555) 987-6543",
    createdAt: "2024-01-11T11:30:00Z"
  }
];

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  
  // In a real app, this would be fetched from Supabase
  const item = mockItems.find(item => item.id === id);

  if (!item) {
    notFound();
  }

  return <ItemDetailClient item={item} />;
} 