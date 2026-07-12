-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_title TEXT DEFAULT 'Metal Art & Product Design',
  admin_email TEXT NOT NULL,
  admin_phone TEXT NOT NULL,
  logo_url TEXT,
  hero_subtitle TEXT DEFAULT 'Bespoke Metal Craft',
  hero_title TEXT DEFAULT 'Where Metal Meets Mastery',
  hero_button TEXT DEFAULT 'Explore Collection',
  website_description TEXT DEFAULT 'Crafting innovative agricultural machinery and smart farming solutions with uncompromising durability and precision engineering.',
  atelier_address TEXT DEFAULT 'Kanniyakumari\nTamil Nadu\nIndia',
  instagram_username TEXT DEFAULT '@vallery_studio.lab',
  formspree_key TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
