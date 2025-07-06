"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Share2, 
  Flag
} from "lucide-react";
import Link from "next/link";

interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  imageUrls?: string[];
  category: string;
  sellerEmail: string;
  createdAt: string;
}

interface ItemDetailClientProps {
  item: Item;
}

export default function ItemDetailClient({ item }: ItemDetailClientProps) {
  const [message, setMessage] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const images = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [item.imageUrl];

  const handleSendMessage = async () => {
    if (!message.trim() || !buyerEmail.trim()) return;
    setIsSending(true);
    
    try {
      const messageData = {
        listing_id: item.id,
        buyer_email: buyerEmail.trim(),
        seller_email: item.sellerEmail,
        message: message.trim()
      };
      
      console.log('Sending message data:', messageData);
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to send message: ${errorData.error || 'Unknown error'}`);
      }

      setMessageSent(true);
      setMessage("");
      setBuyerEmail("");
      setTimeout(() => setMessageSent(false), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Gallery and Actions */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            <img
              src={images[currentImage]}
              alt={item.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {images.length > 1 && (
              <>
                {/* Prev Button */}
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                  onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
                {/* Next Button */}
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                  onClick={() => setCurrentImage((currentImage + 1) % images.length)}
                  aria-label="Next image"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700 rotate-180" />
                </button>
                {/* Thumbnails */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={img}
                      className={`w-4 h-4 rounded-full border-2 ${idx === currentImage ? 'border-[#1877F2]' : 'border-white'} overflow-hidden focus:outline-none`}
                      onClick={() => setCurrentImage(idx)}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Column - Info and Contact */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
            <div className="text-3xl font-bold text-[#1877F2] mb-4">${item.price.toLocaleString()}</div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {item.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          <Separator />

          {/* Message Seller */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Message Seller
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {messageSent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">Message sent successfully!</p>
                </div>
              )}
              <div>
                <Label htmlFor="buyer-email" className="text-sm font-medium text-gray-700">
                  Your Email *
                </Label>
                <Input
                  id="buyer-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Textarea
                placeholder="Hi! I am interested in this item. Could you tell me more about it?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || !buyerEmail.trim() || isSending}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Your message will be sent to the seller email address
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 