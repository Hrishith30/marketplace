"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  "Jewelry & Watches"
];

export default function CreateItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    alert(`Submitted!\n${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Item Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={formData.title} onChange={e => handleInputChange("title", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={e => handleInputChange("description", e.target.value)} rows={3} />
            </div>
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" value={formData.price} onChange={e => handleInputChange("price", e.target.value)} required min="0" step="0.01" />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" value={formData.location} onChange={e => handleInputChange("location", e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Your Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-[#1877F2] text-white mt-4">Submit</Button>
          </form>
        </CardContent>
      </Card>
      {submitted && <p className="mt-4 text-green-600">Thank you! Your item details have been submitted.</p>}
    </div>
  );
} 