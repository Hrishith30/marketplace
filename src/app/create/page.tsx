"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";

const categories = [
  "Electronics",
  "Home & Garden", 
  "Clothing",
  "Toys & Games",
  "Vehicles",
  "Books",
  "Musical Instruments",
  "Cameras & Photo",
  "Sports & Outdoors",
  "Baby & Kids",
  "Pets",
  "Art & Collectibles",
  "Furniture",
  "Computers",
  "Jewelry & Watches",
  "Business & Industrial",
  "Health & Beauty",
  "Tools",
  "Garden & Outdoor",
  "Food & Beverages",
  "Antiques",
  "Collectibles",
  "Hobbies & Crafts",
  "Office Supplies",
  "Appliances",
  "Automotive Parts",
  "Baby Gear",
  "Pet Supplies",
  "Musical Equipment",
  "Video Games",
  "Movies & TV",
  "Books & Magazines",
  "Sports Equipment",
  "Exercise & Fitness",
  "Camping & Hiking",
  "Travel",
  "Real Estate",
  "Services",
  "Jobs",
  "Community"
];

// Generate popular locations from ALL countries in the world
// Load ALL USA states, cities, and villages
const generatePopularLocations = () => {
  const locations: Location[] = [];
  
  try {
    const country = Country.getCountryByCode('US');
    if (!country) return locations;
    
            // Add USA as a country option
        locations.push({
          display: `USA`,
          full: `USA`,
          city: '',
          country: 'USA',
          state: '',
          code: 'US'
        });
    
    // Get ALL states in USA
    const states = State.getStatesOfCountry('US');
    console.log(`Loading ${states.length} states in USA`);
    
    states.forEach((state: { name: string; isoCode: string }) => {
                // Add state
          locations.push({
            display: `${state.name}, US`,
            full: `${state.name}, USA`,
            city: '',
            country: 'USA',
            state: state.name,
            code: 'US'
          });
      
      // Get ALL cities for this state
      const cities = City.getCitiesOfState('US', state.isoCode);
      console.log(`Loading ${cities.length} cities for ${state.name}`);
      
      cities.forEach((city: { name: string }) => {
        locations.push({
          display: `${city.name}, US`,
          full: `${city.name}, ${state.name}, USA`,
          city: city.name,
          country: 'USA',
          state: state.name,
          code: 'US'
        });
      });
    });
  } catch (error) {
    console.log('Error loading USA locations:', error);
  }
  
  console.log(`Generated ${locations.length} USA locations`);
  return locations.sort((a, b) => a.display.localeCompare(b.display));
};

// Search ONLY USA locations with caching
const locationCache = new Map<string, Location[]>();

const searchLocations = (searchTerm: string): Location[] => {
  const locations: Location[] = [];
  const term = searchTerm.toLowerCase();
  
  if (term.length < 4) return locations; // Only search for 4+ characters as requested
  
  // Check cache first
  if (locationCache.has(term)) {
    return locationCache.get(term) || [];
  }
  
  try {
    const country = Country.getCountryByCode('US');
    if (!country) return locations;
    
    // Check if USA matches
    if (country.name.toLowerCase().includes(term)) {
      locations.push({
        display: `USA`,
        full: `USA`,
        city: '',
        country: 'USA',
        state: '',
        code: 'US'
      });
    }
    
    // Get ALL states in USA
    const states = State.getStatesOfCountry('US');
    
    // Search through ALL states
    for (const state of states) {
      try {
        // Check if state name matches
        if (state.name.toLowerCase().includes(term)) {
          locations.push({
            display: `${state.name}, US`,
            full: `${state.name}, USA`,
            city: '',
            country: 'USA',
            state: state.name,
            code: 'US'
          });
        }
        
        // Get ALL cities for this state
        const cities = City.getCitiesOfState('US', state.isoCode);
        
        // Filter cities that match the search term
        const matchingCities = cities.filter((city: { name: string }) => 
          city.name.toLowerCase().includes(term)
        );
        
        // Add ALL matching cities
        matchingCities.forEach((city: { name: string }) => {
          locations.push({
            display: `${city.name}, US`,
            full: `${city.name}, ${state.name}, USA`,
            city: city.name,
            country: 'USA',
            state: state.name,
            code: 'US'
          });
        });
        
        if (locations.length >= 200) break; // Limit to 200 results
      } catch (error) {
        console.log(`Error searching cities in ${state.name}:`, error);
      }
    }
    
    // Cache the results
    locationCache.set(term, locations);
    
  } catch (error) {
    console.log('Error searching USA locations:', error);
  }
  
  console.log(`Found ${locations.length} USA locations matching: ${searchTerm}`);
  return locations.slice(0, 200); // Return up to 200 results
};

interface ImageFile {
  file: File;
  preview: string;
  uploadedUrl?: string;
}

interface Location {
  display: string;
  full: string;
  city: string;
  country: string;
  state?: string;
  code: string;
}

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    seller_email: "",
  });
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [currentPreviewImage, setCurrentPreviewImage] = useState(0);
  const [locationSearch, setLocationSearch] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Initialize locations from country-state-city
  useEffect(() => {
    const initializeLocations = () => {
      setIsLoadingLocations(true);
      try {
        const locations = generatePopularLocations();
        setFilteredLocations(locations);
        console.log(`Successfully loaded ${locations.length} popular locations`);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    
    initializeLocations();
  }, []);

  // Store popular locations in state to avoid regenerating
  const [popularLocations, setPopularLocations] = useState<Location[]>([]);

  // Initialize locations from country-state-city
  useEffect(() => {
    const initializeLocations = () => {
      setIsLoadingLocations(true);
      try {
        const locations = generatePopularLocations();
        setPopularLocations(locations);
        setFilteredLocations(locations);
        console.log(`Successfully loaded ${locations.length} popular locations`);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    
    initializeLocations();
  }, []);

  // Filter locations based on search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!locationSearch.trim()) {
        // Show all loaded locations when search is empty
        setFilteredLocations(popularLocations);
      } else {
        const searchTerm = locationSearch.toLowerCase();
        
        // First try to filter from existing popular locations
        let filtered = popularLocations.filter((location: Location) =>
          location.city.toLowerCase().includes(searchTerm) ||
          location.country.toLowerCase().includes(searchTerm) ||
          location.display.toLowerCase().includes(searchTerm) ||
          (location.state && location.state.toLowerCase().includes(searchTerm))
        );
        
        // If no results or few results, use dynamic search (only for 4+ characters as requested)
        if (filtered.length < 3 && searchTerm.length >= 4) {
          try {
            const searchResults = searchLocations(searchTerm);
            if (searchResults.length > 0) {
              // Combine and deduplicate results
              const combined = [...filtered, ...searchResults];
              const unique = combined.filter((location, index, self) => 
                index === self.findIndex(l => l.display === location.display)
              );
              filtered = unique.slice(0, 100); // Show up to 100 results
            }
          } catch (error) {
            console.log('Error in dynamic search:', error);
          }
        }
        
        setFilteredLocations(filtered);
      }
    }, 300); // Reduced debounce to 300ms for faster response

    return () => clearTimeout(timeoutId);
  }, [locationSearch, popularLocations]);

  // Auto-slideshow for preview images
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPreviewImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ImageFile[] = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setImages(prev => {
        const combined = [...prev, ...newImages];
        return combined.slice(0, 5); // Max 5 images
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index].preview);
      return newImages;
    });
  };

  const uploadImageToStorage = async (file: File, index: number): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    setUploadProgress(prev => ({ ...prev, [index]: 0 }));

    // Simulate progress for better UX since Supabase doesn't provide real-time progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[index] || 0;
        if (current < 90) {
          return { ...prev, [index]: current + Math.random() * 10 };
        }
        return prev;
      });
    }, 100);

    try {
      const { error } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('Upload error:', error);
        setUploadProgress(prev => ({ ...prev, [index]: 0 }));
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      setUploadProgress(prev => ({ ...prev, [index]: 100 }));
      
      // Clear progress after a short delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[index];
          return newProgress;
        });
      }, 1000);

      return publicUrl;
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [index]: 0 }));
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      // Upload all images to Supabase Storage simultaneously
      const uploadPromises = images.map((image, index) => 
        uploadImageToStorage(image.file, index)
      );
      
      const uploadedUrls = await Promise.all(uploadPromises);

      // Use the first uploaded image as the main image, or a placeholder
      const imageUrl = uploadedUrls.length > 0 
        ? uploadedUrls[0] 
        : "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop";

      console.log('Attempting to insert listing with data:', {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        location: formData.location,
        seller_email: formData.seller_email,
        image_url: imageUrl,
        image_urls: uploadedUrls
      });

      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            location: formData.location,
            seller_email: formData.seller_email,
            image_url: imageUrl,
            image_urls: uploadedUrls
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        alert(`Failed to create listing: ${error.message}`);
        return;
      }

      console.log('Listing created successfully:', data);
      
      // Clean up object URLs
      images.forEach(img => URL.revokeObjectURL(img.preview));
      
      router.push('/');
      
    } catch (error) {
      console.error('Exception details:', error);
      alert(`Failed to create listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  const isFormValid = formData.title && formData.price && formData.category && formData.location && formData.seller_email;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create a Listing</h1>
          <p className="text-gray-600">Sell your items to people in your community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Form Section */}
        <div className="h-full">
          <form onSubmit={handleSubmit} className="space-y-6 h-full">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell people what you are selling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What are you selling?"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="pl-8"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller_email">Your Email *</Label>
                <Input
                  id="seller_email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.seller_email}
                  onChange={(e) => handleInputChange("seller_email", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Location */}
        <Card>
          <CardHeader>
            <CardTitle>Category & Location</CardTitle>
            <CardDescription>
              Help buyers find your item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent 
                    className="select-content-wide"
                    style={{ 
                      minWidth: '500px !important', 
                      width: '500px !important',
                      maxWidth: 'none !important'
                    }}
                  >
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <Input
                    placeholder={isLoadingLocations ? "Loading USA locations..." : "Location"}
                    value={formData.location}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange("location", value);
                      setLocationSearch(value);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    className="w-full"
                    disabled={isLoadingLocations}
                  />
                  {isLoadingLocations && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    </div>
                  )}
                  {showLocationDropdown && filteredLocations.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                      {filteredLocations.slice(0, 100).map((location, index) => (
                        <button
                          key={`${location.city}-${location.code}-${index}`}
                          type="button"
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                          onClick={() => {
                            handleInputChange("location", location.full);
                            setLocationSearch("");
                            setShowLocationDropdown(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium">{location.display}</div>
                              <div className="text-sm text-gray-500">{location.full}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Add up to 5 photos. The first photo will be the cover image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="images" className="cursor-pointer">
                    <span className="text-[#1877F2] hover:text-[#166FE5] font-medium">
                      Click to upload
                    </span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="bg-[#1877F2] hover:bg-[#166FE5] text-white min-w-[120px]"
          >
            {isSubmitting ? "Creating..." : "Create Listing"}
          </Button>
        </div>
          </form>
        </div>

        {/* Preview Section */}
        <div>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-base text-gray-800">Live Preview</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                How your listing will appear to buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {/* Image Preview */}
              <div 
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative"
              >
                {images.length > 0 ? (
                  <img
                    src={images[currentPreviewImage].preview}
                    alt="Preview"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-xs">No image</p>
                    </div>
                  </div>
                )}
                
                {/* Thumbnails for multiple images */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                    {images.map((img, idx) => (
                      <button
                        key={img.preview}
                        className={`w-2 h-2 rounded-full border border-white ${
                          idx === currentPreviewImage ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentPreviewImage(idx)}
                        aria-label={`Show image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <h3 className="font-semibold text-sm text-gray-900 truncate">
                  {formData.title || "Your listing title will appear here"}
                </h3>
              </div>

              {/* Price and Location Row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#1877F2]">
                    {formData.price ? `$${parseFloat(formData.price).toLocaleString()}` : "$0.00"}
                  </p>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span>📍 {formData.location || "Location"}</span>
                </div>
              </div>

              {/* Description */}
              {formData.description && (
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-600 leading-relaxed break-words">
                    {formData.description}
                  </p>
                </div>
              )}

              {/* Category */}
              {formData.category && (
                <div>
                  <span className="inline-block bg-[#1877F2]/10 text-[#1877F2] px-2 py-1 rounded-full text-xs font-medium">
                    {formData.category}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 