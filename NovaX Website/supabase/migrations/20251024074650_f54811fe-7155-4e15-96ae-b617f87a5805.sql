-- Create storage bucket for profile wallpapers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-wallpapers', 'profile-wallpapers', true);

-- Add wallpaper_url column to profiles
ALTER TABLE public.profiles 
ADD COLUMN wallpaper_url text;

-- Storage policies for profile wallpapers
CREATE POLICY "Wallpapers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-wallpapers');

CREATE POLICY "Users can upload their own wallpaper"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-wallpapers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own wallpaper"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-wallpapers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own wallpaper"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-wallpapers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update announcements RLS policy to check username instead of admin role
DROP POLICY IF EXISTS "Only admins can create announcements" ON public.announcements;

CREATE POLICY "Only Abubakar can create announcements"
ON public.announcements FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.username = 'Abubakar'
  )
);