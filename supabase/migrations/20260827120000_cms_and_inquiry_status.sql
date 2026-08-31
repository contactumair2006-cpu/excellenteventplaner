-- Extend inquiries for lead management
ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS selected_package TEXT,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries (created_at DESC);

DROP POLICY IF EXISTS "Signed in staff can read inquiries" ON public.inquiries;
CREATE POLICY "Signed in staff can read inquiries" ON public.inquiries
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Signed in staff can update inquiries" ON public.inquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Signed in staff can delete inquiries" ON public.inquiries
  FOR DELETE TO authenticated USING (true);

-- Site-wide CMS settings (JSON blobs by key)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff can manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible faqs" ON public.faqs
  FOR SELECT TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');
CREATE POLICY "Staff can manage faqs" ON public.faqs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

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
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (is_approved = true OR auth.role() = 'authenticated');
CREATE POLICY "Staff can manage testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Gallery images
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
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT ALL ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible gallery" ON public.gallery_images
  FOR SELECT TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');
CREATE POLICY "Staff can manage gallery" ON public.gallery_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

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
GRANT SELECT ON public.event_categories TO anon, authenticated;
GRANT ALL ON public.event_categories TO authenticated;
GRANT ALL ON public.event_categories TO service_role;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible events" ON public.event_categories
  FOR SELECT TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');
CREATE POLICY "Staff can manage events" ON public.event_categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

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
GRANT SELECT ON public.menu_packages TO anon, authenticated;
GRANT ALL ON public.menu_packages TO authenticated;
GRANT ALL ON public.menu_packages TO service_role;
ALTER TABLE public.menu_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read enabled menus" ON public.menu_packages
  FOR SELECT TO anon, authenticated USING (is_enabled = true OR auth.role() = 'authenticated');
CREATE POLICY "Staff can manage menus" ON public.menu_packages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
