-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Everyone can view roles
CREATE POLICY "Roles are viewable by everyone"
ON public.user_roles
FOR SELECT
USING (true);

-- Update announcements policies
DROP POLICY IF EXISTS "Authenticated users can create announcements" ON public.announcements;

-- Only admins can create announcements
CREATE POLICY "Only admins can create announcements"
ON public.announcements
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create leaderboard table for player stats
CREATE TABLE public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name TEXT NOT NULL,
    kills INTEGER DEFAULT 0,
    deaths INTEGER DEFAULT 0,
    headshots INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (player_name)
);

-- Enable RLS on leaderboard
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view leaderboard
CREATE POLICY "Leaderboard is viewable by everyone"
ON public.leaderboard
FOR SELECT
USING (true);

-- Policy: Only admins can manage leaderboard
CREATE POLICY "Only admins can manage leaderboard"
ON public.leaderboard
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create clan_members table
CREATE TABLE public.clan_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name TEXT NOT NULL,
    rank TEXT NOT NULL,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    discord_tag TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on clan_members
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view clan members
CREATE POLICY "Clan members are viewable by everyone"
ON public.clan_members
FOR SELECT
USING (true);

-- Policy: Only admins can manage clan members
CREATE POLICY "Only admins can manage clan members"
ON public.clan_members
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));