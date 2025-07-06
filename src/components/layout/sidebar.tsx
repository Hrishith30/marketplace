"use client";

import { 
  Smartphone, 
  Home, 
  Shirt, 
  Gamepad2, 
  Car, 
  BookOpen, 
  Music,
  Camera,
  Bike,
  Baby,
  Dog,
  Palette,
  Sofa,
  Laptop,
  Watch,
  Briefcase,
  Scissors,
  Dumbbell,
  TreePine,
  Wrench,
  Heart,
  Gift,
  Carrot,
  Coffee,
  Wine,
  Flower2,
  Caravan,
  Tent,
  Plane,
  Ship,
  Train,
  Bus,
  Truck,
  GraduationCap,
  Guitar,
  Piano,
  Headphones,
  Tv,
  Monitor,
  Printer,
  Keyboard,
  Mouse,
  Trophy,
  Medal,
  Flag,
  MapPin,
  Globe,
  Calendar,
  Clock,
  Star,
  Crown,
  Gem,
  Diamond,
  Zap,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  Snowflake,
  Leaf,
  TreeDeciduous,
  Mountain,
  Waves,
  Fish,
  Bird,
  Cat,
  Rabbit,
  House,
  Beef,
  Sheet,
  Bug,
  Worm,
  Snail,
  Share,
  Turtle,
  Skull,
  Cross,
  Space,
  BookHeart,
  HeartHandshake,
  HeartPulse,
  HeartCrack,
  HeartOff,
  HeartPlus,
  HeartMinus
} from "lucide-react";


const categories = [
  { name: "All Items", icon: Globe, href: "/" },
  { name: "Electronics", icon: Smartphone },
  { name: "Home & Garden", icon: Home },
  { name: "Clothing", icon: Shirt },
  { name: "Toys & Games", icon: Gamepad2 },
  { name: "Vehicles", icon: Car },
  { name: "Books", icon: BookOpen },
  { name: "Musical Instruments", icon: Music },
  { name: "Cameras & Photo", icon: Camera },
  { name: "Sports & Outdoors", icon: Bike },
  { name: "Baby & Kids", icon: Baby },
  { name: "Pets", icon: Dog },
  { name: "Art & Collectibles", icon: Palette },
  { name: "Furniture", icon: Sofa },
  { name: "Computers", icon: Laptop },
  { name: "Jewelry & Watches", icon: Watch },
  { name: "Business & Industrial", icon: Briefcase },
  { name: "Health & Beauty", icon: Heart },
  { name: "Tools", icon: Wrench },
  { name: "Garden & Outdoor", icon: TreePine },
  { name: "Food & Beverages", icon: Coffee },
  { name: "Antiques", icon: Crown },
  { name: "Collectibles", icon: Star },
  { name: "Hobbies & Crafts", icon: Palette },
  { name: "Office Supplies", icon: Printer },
  { name: "Appliances", icon: Tv },
  { name: "Automotive Parts", icon: Car },
  { name: "Baby Gear", icon: Baby },
  { name: "Pet Supplies", icon: Dog },
  { name: "Musical Equipment", icon: Guitar },
  { name: "Video Games", icon: Gamepad2 },
  { name: "Movies & TV", icon: Tv },
  { name: "Books & Magazines", icon: BookOpen },
  { name: "Sports Equipment", icon: Trophy },
  { name: "Exercise & Fitness", icon: Dumbbell },
  { name: "Camping & Hiking", icon: Tent },
  { name: "Travel", icon: Plane },
  { name: "Real Estate", icon: House },
  { name: "Services", icon: Briefcase },
  { name: "Jobs", icon: GraduationCap },
  { name: "Community", icon: Heart },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto h-[calc(100vh-64px)]">
      <div className="p-6">
        {/* Categories Header */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 text-lg">Categories</h3>
          <p className="text-sm text-gray-500 mt-1">Browse by category</p>
        </div>

        {/* Categories List */}
        <nav className="space-y-1">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href || `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-[#1877F2] transition-colors duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <category.icon className="h-5 w-5 text-gray-400 group-hover:text-[#1877F2] transition-colors" />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
} 