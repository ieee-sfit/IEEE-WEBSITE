-- Insert 'Born To Conquer' team manually
INSERT INTO public.teams (id, registration_request_id, team_id, team_name, payment_receipt_path)
VALUES ('12345678-1234-1234-1234-123456789abc', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'NAV-BTC001', 'Born To Conquer', 'N/A')
ON CONFLICT DO NOTHING;

-- Insert their submission
INSERT INTO public.submissions (team_id, team_no, problem_statement, ps_title, category, domain, solution_title, organization, ppt_file_path)
VALUES (
    '12345678-1234-1234-1234-123456789abc',
    '04',
    'SIH26045',
    'IP-SAKTI Sahayak a multilingual, RAG-based (source-cited) AI assistant for Intellectual Property and regulatory guidance in Ayurveda, across national and international regimes.',
    'Software',
    'MedTech / BioTech / HealthTech',
    'IP-SAKTI Sahayak',
    'Ministry of Ayush',
    'presentations/12345678-1234-1234-1234-123456789abc/241086_BornToConquer.pdf'
)
ON CONFLICT (team_id) DO UPDATE SET
    team_no = EXCLUDED.team_no,
    problem_statement = EXCLUDED.problem_statement,
    ps_title = EXCLUDED.ps_title,
    category = EXCLUDED.category,
    domain = EXCLUDED.domain,
    solution_title = EXCLUDED.solution_title,
    organization = EXCLUDED.organization,
    ppt_file_path = EXCLUDED.ppt_file_path;
