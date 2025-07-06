"use client";

import { useState, useEffect } from "react";
import { ItemGrid } from "@/components/marketplace/item-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/lib/supabase";
import Link from "next/link";

// Mock data for development
const mockItems = [
  {
    id: "1",
    title: "iPhone 13 Pro - Excellent Condition",
    description: "Selling my iPhone 13 Pro in excellent condition. 256GB storage, Pacific Blue color. Includes original box, charger, and protective case. No scratches or damage. Battery health at 92%. Perfect for anyone looking for a high-quality iPhone at a great price.",
    price: 799,
    location: "Palo Alto, CA",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    category: "Electronics",
    sellerEmail: "john.doe@example.com",
    sellerPhone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Vintage Leather Jacket - Size M",
    description: "Beautiful vintage leather jacket in excellent condition. Size M, perfect fit. Made from high-quality leather with classic styling. No tears or damage, just some natural patina that adds character. Great for motorcycle riding or casual wear.",
    price: 85,
    location: "Mountain View, CA",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    category: "Clothing",
    sellerEmail: "mike.wilson@example.com",
    sellerPhone: "+1 (555) 234-5678",
    createdAt: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    title: "Nintendo Switch OLED - Like New",
    description: "Nintendo Switch OLED model in like-new condition. White version, barely used. Includes original box, dock, controllers, and all cables. No scratches or damage. Perfect for gaming on the go or at home.",
    price: 299,
    location: "San Jose, CA",
    imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop",
    category: "Electronics",
    sellerEmail: "sarah.garcia@example.com",
    sellerPhone: "+1 (555) 345-6789",
    createdAt: "2024-01-13T09:20:00Z"
  },
  {
    id: "4",
    title: "IKEA Desk Chair - Ergonomic",
    description: "High-quality ergonomic desk chair from IKEA. Excellent condition, very comfortable for long work sessions. Adjustable height and backrest. Perfect for home office or gaming setup. No stains or damage.",
    price: 120,
    location: "Redwood City, CA",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    category: "Home & Garden",
    sellerEmail: "david.chen@example.com",
    sellerPhone: "+1 (555) 456-7890",
    createdAt: "2024-01-12T14:15:00Z"
  },
  {
    id: "5",
    title: "MacBook Air M2 - 2023 Model",
    description: "MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Space Gray color. Purchased in March 2023, still under AppleCare warranty. Perfect condition, no scratches or dents. Comes with original charger and box.",
    price: 999,
    location: "Menlo Park, CA",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "Electronics",
    sellerEmail: "sarah.smith@example.com",
    sellerPhone: "+1 (555) 987-6543",
    createdAt: "2024-01-11T11:30:00Z"
  },
  {
    id: "6",
    title: "Road Bike - Trek Domane",
    description: "Trek Domane road bike in excellent condition. Carbon frame, Shimano 105 groupset. Perfect for road cycling and long-distance rides. Recently serviced, all components working perfectly. Includes bike computer and lights.",
    price: 450,
    location: "Sunnyvale, CA",
    imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop",
    category: "Sports",
    sellerEmail: "alex.rodriguez@example.com",
    sellerPhone: "+1 (555) 567-8901",
    createdAt: "2024-01-10T16:45:00Z"
  },
  {
    id: "7",
    title: "Guitar - Fender Stratocaster",
    description: "Fender Stratocaster electric guitar in great condition. Classic sunburst finish, maple neck. Includes hard case and strap. Perfect for beginners or experienced players. Recently set up and ready to play.",
    price: 650,
    location: "Cupertino, CA",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    category: "Musical Instruments",
    sellerEmail: "james.miller@example.com",
    sellerPhone: "+1 (555) 678-9012",
    createdAt: "2024-01-09T13:20:00Z"
  },
  {
    id: "8",
    title: "Coffee Table - Modern Design",
    description: "Modern coffee table with clean lines and elegant design. Made from solid wood with metal legs. Perfect condition, no scratches or damage. Great for living room or family room. Easy to assemble.",
    price: 75,
    location: "Los Altos, CA",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    category: "Home & Garden",
    sellerEmail: "emma.davis@example.com",
    sellerPhone: "+1 (555) 789-0123",
    createdAt: "2024-01-08T10:10:00Z"
  }
];

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

          {/* View Mode Toggle */}
          {/* Removed grid/list toggle icons */}
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "all" || searchQuery || selectedPriceRange !== "all") && (
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
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
