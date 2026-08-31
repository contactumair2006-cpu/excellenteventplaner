-- ============================================================
-- Royal Marquee — full schema for YOUR own Supabase project
-- Run this once in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Inquiries (booking leads)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  event_type TEXT NOT NULL,
  event_date DATE,
  guest_count INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  selected_package TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries (created_at DESC);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Signed in staff can read inquiries" ON public.inquiries;
CREATE POLICY "Signed in staff can read inquiries" ON public.inquiries
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Signed in staff can update inquiries" ON public.inquiries;
CREATE POLICY "Signed in staff can update inquiries" ON public.inquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Signed in staff can delete inquiries" ON public.inquiries;
CREATE POLICY "Signed in staff can delete inquiries" ON public.inquiries
  FOR DELETE TO authenticated USING (true);

GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;

-- Site settings (CMS JSON)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Staff can manage site settings" ON public.site_settings;
CREATE POLICY "Staff can manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

-- FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read visible faqs" ON public.faqs;
CREATE POLICY "Public can read visible faqs" ON public.faqs
  FOR SELECT TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Staff can manage faqs" ON public.faqs;
CREATE POLICY "Staff can manage faqs" ON public.faqs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  event_label TEXT,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read approved testimonials" ON public.testimonials;
CREATE POLICY "Public can read approved testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (is_approved = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Staff can manage testimonials" ON public.testimonials;
CREATE POLICY "Staff can manage testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

-- Gallery
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Venue',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read visible gallery" ON public.gallery_images;
CREATE POLICY "Public can read visible gallery" ON public.gallery_images
  FOR SELECT TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Staff can manage gallery" ON public.gallery_images;
CREATE POLICY "Staff can manage gallery" ON public.gallery_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;

-- Events
CREATE TABLE IF NOT EXISTS public.event_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read visible events" ON public.event_categories;
CREATE POLICY "Public can read visible events" ON public.event_categories
  FOR SELECT TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Staff can manage events" ON public.event_categories;
CREATE POLICY "Staff can manage events" ON public.event_categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT ON public.event_categories TO anon, authenticated;
GRANT ALL ON public.event_categories TO authenticated;
GRANT ALL ON public.event_categories TO service_role;

-- Menu packages
CREATE TABLE IF NOT EXISTS public.menu_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  badge TEXT,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read enabled menus" ON public.menu_packages;
CREATE POLICY "Public can read enabled menus" ON public.menu_packages
  FOR SELECT TO anon, authenticated USING (is_enabled = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Staff can manage menus" ON public.menu_packages;
CREATE POLICY "Staff can manage menus" ON public.menu_packages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
GRANT SELECT ON public.menu_packages TO anon, authenticated;
GRANT ALL ON public.menu_packages TO authenticated;
GRANT ALL ON public.menu_packages TO service_role;
