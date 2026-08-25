-- supabase-storage-setup.sql
-- Run this SQL in your Supabase SQL Editor to configure the storage bucket and its policies.

-- Create product-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket 'product-images'
-- 1. Allow public select/read access to product-images bucket files
CREATE POLICY "Allow public read access to product-images" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'product-images');

-- 2. Allow authenticated admin users full access to product-images bucket files
CREATE POLICY "Allow admin write access to product-images" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
