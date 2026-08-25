CREATE TABLE IF NOT EXISTS public.ps_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    problem_statement VARCHAR NOT NULL,
    ps_title VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    domain VARCHAR NOT NULL,
    solution_title VARCHAR NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ps_drafts ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.ps_drafts TO service_role;

-- Create a test team
INSERT INTO public.teams (
    registration_request_id,
    team_id,
    team_name,
    payment_receipt_path,
    status
)
VALUES (
    gen_random_uuid(),
    'NAV-000000',
    'Admin Test Team',
    'none',
    'REGISTERED'
)
ON CONFLICT (team_id) DO NOTHING;

-- Create a leader for the test team
DO $$
DECLARE
    v_team_uuid UUID;
BEGIN
    SELECT id INTO v_team_uuid FROM public.teams WHERE team_id = 'NAV-000000';
    
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
        TRUE,
        '000000',
        'admin@test.com',
        'Admin Test',
        '0000000000',
        'O',
        'TEST',
        'TEST'
    ) ON CONFLICT (email) DO NOTHING;
END $$;
