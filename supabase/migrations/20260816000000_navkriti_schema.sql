-- Run this in your Supabase SQL Editor

-- 1. Create Teams Table
CREATE TABLE public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_request_id UUID UNIQUE NOT NULL, -- Idempotency key from Edge Function
    team_id VARCHAR NOT NULL UNIQUE,
    team_name VARCHAR NOT NULL UNIQUE,
    event_id VARCHAR DEFAULT 'NAVKRITI_26',
    payment_receipt_path VARCHAR NOT NULL,
    payee_upi_id VARCHAR,
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
CREATE OR REPLACE FUNCTION public.register_team(
    p_registration_request_id UUID,
    p_team_id VARCHAR,
    p_team_name VARCHAR,
    p_payment_receipt_path VARCHAR,
    p_payee_upi_id VARCHAR,
    p_participants JSONB -- Array of participant objects
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
        RETURN pg_catalog.jsonb_build_object('success', true, 'team_uuid', v_team_uuid, 'team_id', v_existing_team_id, 'is_duplicate', true);
    END IF;

    INSERT INTO public.teams (
        registration_request_id,
        team_id,
        team_name,
        payment_receipt_path,
        payee_upi_id
    ) VALUES (
        p_registration_request_id,
        p_team_id,
        p_team_name,
        p_payment_receipt_path,
        p_payee_upi_id
    ) RETURNING id INTO v_team_uuid;

    -- Insert Participants
    FOR v_participant IN SELECT * FROM pg_catalog.jsonb_array_elements(p_participants)
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
            (v_participant->>'is_leader')::boolean,
            v_participant->>'pid',
            v_participant->>'email',
            v_participant->>'name',
            v_participant->>'phone',
            v_participant->>'gender',
            v_participant->>'branch',
            v_participant->>'year'
        );
    END LOOP;

    RETURN pg_catalog.jsonb_build_object('success', true, 'team_uuid', v_team_uuid, 'team_id', p_team_id, 'is_duplicate', false);
END;
$$;

-- 8. Create RPC for team updates
CREATE OR REPLACE FUNCTION public.update_team(
    p_team_uuid UUID,
    p_participants JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_participant JSONB;
    v_deleted_count INTEGER;
    v_inserted_count INTEGER := 0;
BEGIN
    -- Delete existing participants for this team
    DELETE FROM public.participants
    WHERE team_id = p_team_uuid;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

    -- Insert new participants
    FOR v_participant IN SELECT * FROM pg_catalog.jsonb_array_elements(p_participants)
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
            (v_participant->>'is_leader')::boolean,
            v_participant->>'pid',
            v_participant->>'email',
            v_participant->>'name',
            v_participant->>'phone',
            v_participant->>'gender',
            v_participant->>'branch',
            v_participant->>'year'
        );
        v_inserted_count := v_inserted_count + 1;
    END LOOP;

    RETURN pg_catalog.jsonb_build_object(
        'success', true,
        'deleted', v_deleted_count,
        'inserted', v_inserted_count
    );
EXCEPTION WHEN OTHERS THEN
    RETURN pg_catalog.jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;


-- 9. Revoke EXECUTE from default roles to secure the RPCs
REVOKE EXECUTE ON FUNCTION public.register_team(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_team(UUID, JSONB) FROM PUBLIC, anon, authenticated;

-- 10. Grant EXECUTE to service_role ONLY (Edge Functions)
GRANT EXECUTE ON FUNCTION public.register_team(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_team(UUID, JSONB) TO service_role;
