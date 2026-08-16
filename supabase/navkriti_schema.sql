-- Run this in your Supabase SQL Editor

-- 1. Create Teams Table
CREATE TABLE public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_request_id UUID UNIQUE NOT NULL, -- Idempotency key from Edge Function
    team_id VARCHAR NOT NULL UNIQUE,
    team_name VARCHAR NOT NULL UNIQUE,
    event_id VARCHAR DEFAULT 'NAVKRITI_26',
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
    email VARCHAR NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL CHECK (phone ~ '^[0-9]{10}$'),
    gender VARCHAR NOT NULL,
    branch VARCHAR NOT NULL,
    year VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Submissions Table
CREATE TABLE public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    problem_statement VARCHAR,
    domain VARCHAR,
    solution_title VARCHAR,
    summary TEXT,
    ppt_file_path VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Storage Buckets (if running locally or as a migration)
INSERT INTO storage.buckets (id, name, public) VALUES ('payment_receipts', 'payment_receipts', false) ON CONFLICT (id) DO UPDATE SET public = false;
INSERT INTO storage.buckets (id, name, public) VALUES ('sih_presentations', 'sih_presentations', false) ON CONFLICT (id) DO UPDATE SET public = false;

-- 5. Set up Row Level Security (RLS) for the database tables
-- We deny all access to `anon` by default. 
-- Only the `service_role` (used by Edge Functions) will have access, which bypasses RLS.
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 6. Grant Permissions to Service Role
-- This ensures the Edge Functions (using service_role key) can read/write data
GRANT ALL ON TABLE public.teams TO service_role;
GRANT ALL ON TABLE public.participants TO service_role;
GRANT ALL ON TABLE public.submissions TO service_role;

-- 7. Create RPC for atomic team registration
CREATE OR REPLACE FUNCTION register_team(
    p_registration_request_id UUID,
    p_team_id VARCHAR,
    p_team_name VARCHAR,
    p_payment_receipt_path VARCHAR,
    p_participants JSONB -- Array of participant objects
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_team_uuid UUID;
    v_existing_team_id VARCHAR;
    v_participant JSONB;
BEGIN
    -- Idempotency check: see if registration_request_id already exists
    SELECT id, team_id INTO v_team_uuid, v_existing_team_id
    FROM public.teams
    WHERE registration_request_id = p_registration_request_id;
    
    IF v_team_uuid IS NOT NULL THEN
        -- Already registered, return success with existing IDs
        RETURN jsonb_build_object('success', true, 'team_uuid', v_team_uuid, 'team_id', v_existing_team_id, 'is_duplicate', true);
    END IF;

    -- Insert Team
    INSERT INTO public.teams (
        registration_request_id,
        team_id,
        team_name,
        payment_receipt_path
    ) VALUES (
        p_registration_request_id,
        p_team_id,
        p_team_name,
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

    RETURN jsonb_build_object('success', true, 'team_uuid', v_team_uuid, 'team_id', p_team_id, 'is_duplicate', false);
EXCEPTION WHEN OTHERS THEN
    -- If any error occurs, the transaction will automatically be rolled back
    RAISE;
END;
$$;

-- 8. Create RPC for atomic team updates
CREATE OR REPLACE FUNCTION update_team(
    p_team_uuid UUID,
    p_participants JSONB -- Array of participant objects
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_participant JSONB;
    v_female_count INTEGER := 0;
    v_participant_count INTEGER := 0;
BEGIN
    -- Validate participants count
    v_participant_count := jsonb_array_length(p_participants);
    IF v_participant_count != 6 THEN
        RAISE EXCEPTION 'Team must have exactly 6 participants.';
    END IF;

    -- Validate female count
    FOR v_participant IN SELECT * FROM jsonb_array_elements(p_participants)
    LOOP
        IF (v_participant->>'gender') = 'Female' THEN
            v_female_count := v_female_count + 1;
        END IF;
    END LOOP;

    IF v_female_count < 1 THEN
        RAISE EXCEPTION 'Team must have at least one female participant according to SIH rules.';
    END IF;

    -- Delete old participants (cascade guarantees clean slate for this team)
    DELETE FROM public.participants WHERE team_id = p_team_uuid;

    -- Insert new participants
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
            p_team_uuid,
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

    RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    -- Transaction rolls back on any error (including UNIQUE constraint violations)
    RAISE;
END;
$$;
