"use client";

import { useState, useEffect } from "react";
import { ItemGrid } from "@/components/marketplace/item-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/supabase";

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // Fetch listings from Supabase
  useEffect(() => {
    async function fetchListings() {
      try {
        // Debug: Log the Supabase configuration
        console.log('Homepage - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('Homepage - Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error details:', error);
          return;
        }

        console.log('Fetched listings:', data);
        setListings(data || []);
      } catch (error) {
        console.error('Exception details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  // Transform Supabase data to match the expected format
  const transformedItems = listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description || "No description available",
    price: listing.price,
    location: listing.location,
    imageUrl: listing.image_url,
    imageUrls: listing.image_urls || [], // Add support for multiple images
    category: listing.category,
    sellerEmail: listing.seller_email,
    createdAt: listing.created_at
  }));

  const filteredItems = transformedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
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
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Marketplace</h1>
          <p className="text-gray-600 mt-1">Find great deals on items near you</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-2">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 hover:border-[#1877F2] hover:ring-opacity-10"
            />
          </div>

          {/* Price Range Filter */}
          <div className="md:col-span-2">
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="h-9 text-base px-4 w-full hover:border-[#1877F2] hover:ring-opacity-10">
                <SelectValue placeholder="Price Range" />
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

          {/* Category Filter - rightmost */}
          <div className="md:col-span-2 flex md:justify-end">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9 text-base px-4 w-full hover:border-[#1877F2] hover:ring-opacity-10">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Musical Instruments">Musical Instruments</SelectItem>
                <SelectItem value="Toys & Games">Toys & Games</SelectItem>
                <SelectItem value="Vehicles">Vehicles</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Cameras & Photo">Cameras & Photo</SelectItem>
                <SelectItem value="Sports & Outdoors">Sports & Outdoors</SelectItem>
                <SelectItem value="Baby & Kids">Baby & Kids</SelectItem>
                <SelectItem value="Pets">Pets</SelectItem>
                <SelectItem value="Art & Collectibles">Art & Collectibles</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Computers">Computers</SelectItem>
                <SelectItem value="Jewelry & Watches">Jewelry & Watches</SelectItem>
                <SelectItem value="Business & Industrial">Business & Industrial</SelectItem>
                <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                <SelectItem value="Tools">Tools</SelectItem>
                <SelectItem value="Garden & Outdoor">Garden & Outdoor</SelectItem>
                <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                <SelectItem value="Antiques">Antiques</SelectItem>
                <SelectItem value="Collectibles">Collectibles</SelectItem>
                <SelectItem value="Hobbies & Crafts">Hobbies & Crafts</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                <SelectItem value="Appliances">Appliances</SelectItem>
                <SelectItem value="Automotive Parts">Automotive Parts</SelectItem>
                <SelectItem value="Baby Gear">Baby Gear</SelectItem>
                <SelectItem value="Pet Supplies">Pet Supplies</SelectItem>
                <SelectItem value="Musical Equipment">Musical Equipment</SelectItem>
                <SelectItem value="Video Games">Video Games</SelectItem>
                <SelectItem value="Movies & TV">Movies & TV</SelectItem>
                <SelectItem value="Books & Magazines">Books & Magazines</SelectItem>
                <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
                <SelectItem value="Exercise & Fitness">Exercise & Fitness</SelectItem>
                <SelectItem value="Camping & Hiking">Camping & Hiking</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Services">Services</SelectItem>
                <SelectItem value="Jobs">Jobs</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "all" || searchQuery || selectedPriceRange !== "all") && (
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Category: {selectedCategory}
              </span>
            )}
            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Price: {selectedPriceRange === "0-50" ? "$0 - $50" : 
                        selectedPriceRange === "50-100" ? "$50 - $100" :
                        selectedPriceRange === "100-500" ? "$100 - $500" :
                        selectedPriceRange === "500-1000" ? "$500 - $1,000" :
                        selectedPriceRange === "1000-2000" ? "$1,000 - $2,000" :
                        selectedPriceRange === "2000-5000" ? "$2,000 - $5,000" :
                        selectedPriceRange === "5000+" ? "$5,000+" : selectedPriceRange}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedPriceRange("all");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          </div>
        )}
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
      ) : (
        /* Items Grid */
        <ItemGrid items={filteredItems} />
      )}
    </div>
  );
}
