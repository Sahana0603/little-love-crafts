-- supabase-schema.sql
-- Run this SQL in your Supabase Database SQL Editor to configure tables and seed data.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================================
-- 1. TABLES CREATION
-- ===================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    original_price NUMERIC CHECK (original_price >= 0),
    is_starts_from BOOLEAN NOT NULL DEFAULT false,
    image_url TEXT,
    available BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    customizable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'message')),
    discount_value NUMERIC NOT NULL DEFAULT 0 CHECK (discount_value >= 0),
    active BOOLEAN NOT NULL DEFAULT true,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 2. SECURITY FUNCTIONS & TRIGGERS
-- ===================================================

-- Security definer check to see if current user is an admin.
-- Runs with DEFINER rights to prevent RLS recursion on the profiles table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() 
      AND public.profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create a profile record when a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Valued Customer'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'customer' -- Defaults to normal customer
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Bind trigger to auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow users to read their own profile or admin reads all" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow users/admin to update profile details" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (
        public.is_admin() OR (
            auth.uid() = id AND 
            role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- Prevents altering role column
        )
    );

-- Products Policies
CREATE POLICY "Allow public select products" ON public.products
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow admin all products" ON public.products
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Reviews Policies
CREATE POLICY "Allow public select reviews" ON public.reviews
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow authenticated users to create reviews" ON public.reviews
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Offers Policies
CREATE POLICY "Allow public select active offers" ON public.offers
    FOR SELECT TO authenticated, anon
    USING (active = true);

CREATE POLICY "Allow admin all offers" ON public.offers
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ===================================================
-- 4. DEFAULT PRODUCT SEED DATA
-- ===================================================

INSERT INTO public.products (name, category, description, price, original_price, is_starts_from, image_url, available, featured, customizable)
VALUES 
-- Hampers Category
('Gift Hamper Premium Box', 'Hampers', 'Beautiful handmade curation containing Fruits, Dry Fruits, Sweet Box, Teddy Bear or Crochet Keychain, Happy Birthday Prop, Diary, Chocolates, Mini Perfume, Phone Cover, Hair Clips. Customisable in any budget or occasion.', 799, 1299, true, 'images/hamper/p5.jpeg', true, true, true),

-- Bouquets Category
('Crochet Lily & Tulip Bouquet', 'Bouquets', 'Elegant arrangement featuring 2 Crochet lilies, 2 tulips, 3 roses, 1 leaf stick. Can be customised according to the size and number of flowers.', 1499, null, false, 'images/flower/p13.jpeg', true, true, true),
('Crochet Heart & Rose Bouquet', 'Bouquets', 'Warm personalized design containing 1 Crochet heart with honey bee, 1 crochet tulip, 1 crochet rose. Custom creations for every occasion.', 999, null, false, 'images/flower/p14.jpeg', true, false, true),

-- Resin Arts Category
('Customized Resin Art Creations', 'Resin Arts', 'Fully customized resin art creations for every occasion. Whether you have a specific design, theme, or budget in mind, we can create unique pieces specially made for you. Final pricing depends on size and design details.', 1799, null, true, 'images/decor/p12.jpeg', true, true, true),
('Resin Keychains & Accessories', 'Resin Arts', 'Beautiful handmade resin keychains and small accessories, customized with your name, initials, or small foils. Starts from just 99.', 99, null, true, 'images/decor/p16.jpeg', true, false, true),

-- Photo Frames Category
('Personalized Photo Frames', 'Photo Frames', 'Available in various sizes and fully customizable to match your budget, style, and occasion. Final pricing depends on the size and customization selected.', 599, null, true, 'images/frames/p3.jpeg', true, true, true),

-- Photo Bouquets Category
('Personalized Photo Bouquets', 'Photo Bouquets', 'Unique combination of print photographs and floral design elements, custom-made for anniversaries and birthdays. Pricing depends on photo quantity.', 1149, null, true, 'images/frames/p8.jpeg', true, false, true),

-- Clock Category (From website)
('Customized Resin Clocks', 'Clocks', 'Beautiful handmade wall clocks customized with photos, colors, and designs of your choice. A timeless gift for weddings and home warming.', 1299, null, true, 'images/clock/p2.jpeg', true, false, true),

-- Decor Category (From website)
('Handmade Decor Items', 'Decor', 'Unique handcrafted home decor accessories and aesthetic display items to light up your space.', 499, null, true, 'images/decor/p11.jpeg', true, false, true)
ON CONFLICT DO NOTHING;

-- ===================================================
-- 5. REVIEWS SEED DATA
-- ===================================================
INSERT INTO public.reviews (customer_name, rating, review_text)
VALUES
('Aishwarya S.', 5, 'Absolutely loved the gift hamper! The crochet keychain was incredibly cute, and the premium packaging made it look so luxury. Highly recommend for custom gifts!'),
('Rahul Sharma', 5, 'Ordered a customized resin clock for my wedding anniversary. It came out beautiful and exactly as I imagined. Thank you Craftifyy!'),
('Sahana Rao', 5, 'The crochet lily bouquet looks so realistic and matches the Pinterest inspiration reference photo I sent. Pan-India shipping was fast and safe.')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 6. OFFERS SEED DATA
-- ===================================================
INSERT INTO public.offers (title, description, discount_type, discount_value, active, start_date, end_date, image_url)
VALUES
('20% OFF on Birthday Hampers', 'Celebrate birthdays in style with our curated premium gift hampers. Use code BDAY20 on WhatsApp inquiry.', 'percentage', 20, true, '2026-08-01', '2026-08-31', 'images/logo.jpeg'),
('₹100 OFF on orders above ₹999', 'Get flat ₹100 discount on any customizable craft order totaling more than ₹999.', 'fixed', 100, true, '2026-08-01', '2026-12-31', 'images/logo.jpeg'),
('Festive Special — Limited Time Offer', 'Handcrafted resin designs and photo frames personalized for the holiday season. Pan-India shipping available.', 'message', 0, false, '2026-08-05', '2026-08-15', 'images/logo.jpeg')
ON CONFLICT DO NOTHING;
