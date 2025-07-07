"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ItemGrid } from "@/components/marketplace/item-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/supabase";

interface CategoryPageClientProps {
  categoryName: string;
}

export function CategoryPageClient({ categoryName }: CategoryPageClientProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch listings for this category
  useEffect(() => {
    async function fetchCategoryListings() {
      try {
        console.log('Fetching listings for category:', categoryName);
        
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('category', categoryName)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        console.log(`Found ${data?.length || 0} listings for category: ${categoryName}`);
        console.log('Listings data:', data);
        
        setListings(data || []);
      } catch (error) {
        console.error('Exception:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryListings();
  }, [categoryName]);

  // Transform Supabase data to match the expected format
  const transformedItems = listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description || "No description available",
    price: listing.price,
    location: listing.location,
    imageUrl: listing.image_url,
    imageUrls: listing.image_urls || [],
    category: listing.category,
    sellerEmail: listing.seller_email,
    createdAt: listing.created_at
  }));

  // Filter items based on search and price range
  const filteredItems = transformedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price range filtering
    let matchesPrice = true;
    if (selectedPriceRange !== "all") {
      const price = item.price;
      switch (selectedPriceRange) {
        case "0-50":
          matchesPrice = price >= 0 && price <= 50;
          break;
        case "50-100":
          matchesPrice = price > 50 && price <= 100;
          break;
        case "100-500":
          matchesPrice = price > 100 && price <= 500;
          break;
        case "500-1000":
          matchesPrice = price > 500 && price <= 1000;
          break;
        case "1000-2000":
          matchesPrice = price > 1000 && price <= 2000;
          break;
        case "2000-5000":
          matchesPrice = price > 2000 && price <= 5000;
          break;
        case "5000+":
          matchesPrice = price > 5000;
          break;
      }
    }
    
    return matchesSearch && matchesPrice;
  });

  if (!categoryName) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search in this category..."
              className="pl-10 h-9 focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] focus:ring-opacity-50 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Price Filter */}
          <div className="flex justify-end">
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="h-12 text-base px-4 w-full focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] focus:ring-opacity-50 focus:outline-none">
                <SelectValue placeholder="Filter by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-50">$0 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                <SelectItem value="5000+">$5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877F2] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading listings...</p>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        /* Create first listing message */
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 bg-[#1877F2]/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-[#1877F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Be the First to List in {categoryName}!</h3>
          <p className="text-gray-600 mb-8 max-w-md text-lg">
            This category is empty. Start the marketplace by creating the first listing in {categoryName}.
          </p>
          <Link href="/create" className="inline-block">
            <Button className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold transform hover:scale-105 transition-all duration-200">
              Create First Listing
            </Button>
          </Link>
        </div>
      ) : (
        /* Items Grid */
        <ItemGrid items={filteredItems} />
      )}
    </div>
  );
} 