"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 transition-all duration-300 cursor-pointer group">
              <div className="w-8 h-8 bg-[#1877F2] rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-[#1877F2] hidden sm:block transition-transform duration-300 group-hover:scale-105">
                Marketplace
              </span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Create Listing Button - Desktop */}
            <div className="hidden sm:block">
              <Link href="/create">
                <Button 
                  className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-2 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="-ml-2 -mt-0.5">Create listing</span>
                </Button>
              </Link>
            </div>
            {/* Create Listing Button - Mobile */}
            <div className="sm:hidden">
              <Link href="/create">
                <Button 
                  className="bg-[#1877F2] hover:bg-[#166FE5] text-white p-2.5 rounded-full shadow-md hover:shadow-lg transform hover:scale-105"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 