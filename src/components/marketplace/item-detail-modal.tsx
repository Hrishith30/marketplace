"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  ArrowLeft,
  ArrowRight
} from "lucide-react";

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

interface ItemDetailModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const [message, setMessage] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const images = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : [item.imageUrl];

  // Auto-slideshow effect
  useEffect(() => {
    if (!isOpen || images.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isOpen, images.length, isAutoPlaying, currentImage]);

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

      setShowSuccessPopup(true);
      setMessage("");
      setBuyerEmail("");
      
      // Close success popup after 2 seconds and then close modal
      setTimeout(() => {
        setShowSuccessPopup(false);
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setBuyerEmail("");
    setShowSuccessPopup(false);
    setCurrentImage(0);
    setIsAutoPlaying(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-lg w-full max-h-[90vh] overflow-y-auto" style={{ maxWidth: '1500px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image Gallery and Actions */}
            <div className="space-y-6">
                                  {/* Image Gallery */}
          <div 
            className="relative h-[695px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
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
                  <ArrowRight className="h-5 w-5 text-gray-700" />
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
            </div>

            {/* Right Column - Info and Contact */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <div className="text-2xl font-bold text-[#1877F2] mb-4">${item.price.toLocaleString()}</div>
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
                <div className="overflow-hidden">
                  <p className="text-gray-700 leading-relaxed break-words">{item.description}</p>
                </div>
              </div>

              <Separator />

              {/* Message Seller */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Message Seller
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Contact: {item.sellerEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {item.location}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    rows={6}
                    className="resize-none min-h-[110px]"
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
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-600">Your message has been sent to the seller successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
} 