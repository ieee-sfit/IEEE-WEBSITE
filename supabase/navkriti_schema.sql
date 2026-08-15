-- Run this in your Supabase SQL Editor

-- 1. Create Teams Table
CREATE TABLE public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_request_id UUID UNIQUE NOT NULL, -- Idempotency key from Edge Function
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

-- 3. Create Submissions Table
CREATE TABLE public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    ppt_file_path VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Storage Buckets
-- Note: You should do this via the Supabase Dashboard UI -> Storage -> New Bucket
-- Name 1: 'payment_receipts' (Public)
-- Name 2: 'sih_presentations' (Private)

-- 4. Set up Row Level Security (RLS) for the database tables
-- We deny all access to `anon` by default. 
-- Only the `service_role` (used by Edge Functions) will have access, which bypasses RLS.
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 6. Create RPC for atomic team registration
CREATE OR REPLACE FUNCTION register_team(
    p_registration_request_id UUID,
    p_team_id VARCHAR,
    p_team_name VARCHAR,
    p_submission_secret_hash VARCHAR,
    p_payment_receipt_path VARCHAR,
    p_participants JSONB -- Array of participant objects
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_team_uuid UUID;
    v_participant JSONB;
BEGIN
    -- Insert Team
    INSERT INTO public.teams (
        registration_request_id,
        team_id,
        team_name,
        submission_secret_hash,
        payment_receipt_path
    ) VALUES (
        p_registration_request_id,
        p_team_id,
        p_team_name,
        p_submission_secret_hash,
        p_payment_receipt_path
    ) RETURNING id INTO v_team_uuid;

    -- Loop through participants and insert
    FOR v_participant IN SELECT * FROM jsonb_array_elements(p_participants)
    LOOP
        INSERT INTO public.participants (
            team_id,
            is_leader,
            pid,
            email,
            name,
            phone,
            gender,
            branch,
            year
        ) VALUES (
            v_team_uuid,
            (v_participant->>'is_leader')::BOOLEAN,
            v_participant->>'pid',
            v_participant->>'email',
            v_participant->>'name',
            v_participant->>'phone',
            v_participant->>'gender',
            v_participant->>'branch',
            v_participant->>'year'
        );
    END LOOP;

    RETURN jsonb_build_object('success', true, 'team_uuid', v_team_uuid);
EXCEPTION WHEN OTHERS THEN
    -- If any error occurs, the transaction will automatically be rolled back
    -- We raise the error to be caught by the Edge Function
    RAISE;
END;
$$;
