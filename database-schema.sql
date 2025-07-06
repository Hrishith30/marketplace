-- Drop tables if they exist
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS listings CASCADE;

-- Drop policies if they exist for storage
DROP POLICY IF EXISTS "Anyone can upload listing images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view listing images" ON storage.objects;

-- Drop bucket if needed (optional)
-- DELETE FROM storage.buckets WHERE id = 'listing-images';

-- ==============================
-- Create listings table
-- ==============================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  seller_email VARCHAR(255) NOT NULL,
  image_url TEXT,
  image_urls TEXT[], -- Array of image URLs for multiple images
  location VARCHAR(255) DEFAULT 'Palo Alto, CA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- Create messages table
-- ==============================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_email VARCHAR(255) NOT NULL,
  seller_email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- Supabase Storage Setup
-- ==============================
-- Create storage bucket (id and name should match)
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT DO NOTHING;

-- Create policies on the bucket
CREATE POLICY "Anyone can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-images');

CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

-- ==============================
-- Indexes
-- ==============================
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_messages_listing_id ON messages(listing_id);

-- ==============================
-- Row Level Security (RLS)
-- ==============================
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for listings
DROP POLICY IF EXISTS "Anyone can view listings" ON listings;
DROP POLICY IF EXISTS "Anyone can create listings" ON listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;

-- Drop existing policies for messages
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;

-- Listings policies
CREATE POLICY "Anyone can view listings"
  ON listings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create listings"
  ON listings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own listings"
  ON listings FOR UPDATE
  USING (
    seller_email = current_setting('request.jwt.claims')::json->>'email'
  );

-- Messages policies
CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- ==============================
-- Trigger to update updated_at
-- ==============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 