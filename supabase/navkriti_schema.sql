-- Run this in your Supabase SQL Editor

-- 1. Create Teams Table
CREATE TABLE public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id VARCHAR NOT NULL UNIQUE,
    team_name VARCHAR NOT NULL UNIQUE,
    submission_secret_hash VARCHAR NOT NULL,
    payment_receipt_path VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'REGISTERED',
    submission_file_path VARCHAR,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Participants Table
CREATE TABLE public.participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    is_leader BOOLEAN DEFAULT FALSE,
    pid VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    branch VARCHAR NOT NULL,
    year VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Storage Buckets
-- Note: You should do this via the Supabase Dashboard UI -> Storage -> New Bucket
-- Name 1: 'payment_receipts' (Public)
-- Name 2: 'sih_presentations' (Private)

-- 4. Set up Row Level Security (RLS) for the database tables
-- We want the API to be able to insert rows anonymously (since we use anon key from the frontend for now)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts to teams" ON public.teams FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts to participants" ON public.participants FOR INSERT TO anon WITH CHECK (true);

-- (If using Edge Functions later with a service role key, you can disable anon inserts for strict security)
