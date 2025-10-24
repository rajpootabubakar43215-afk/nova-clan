-- Add DELETE policy for announcements (only Abubakar can delete)
CREATE POLICY "Only Abubakar can delete announcements"
ON public.announcements
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.username = 'Abubakar'
  )
);

-- Add SELECT policy for user_roles (needed for admins page)
CREATE POLICY "Anyone can view roles"
ON public.user_roles
FOR SELECT
USING (true);

-- Add INSERT policy for user_roles (only Abubakar can add admins)
CREATE POLICY "Only Abubakar can add admins"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.username = 'Abubakar'
  )
);

-- Add DELETE policy for user_roles (only Abubakar can remove admins)
CREATE POLICY "Only Abubakar can remove admins"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.username = 'Abubakar'
  )
);