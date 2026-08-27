-- Add team_name to ps_drafts
ALTER TABLE public.ps_drafts ADD COLUMN IF NOT EXISTS team_name VARCHAR;

-- Populate existing ps_drafts rows
UPDATE public.ps_drafts
SET team_name = public.teams.team_name
FROM public.teams
WHERE public.ps_drafts.team_id = public.teams.id;

-- Add team_name to submissions
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS team_name VARCHAR;

-- Populate existing submissions rows
UPDATE public.submissions
SET team_name = public.teams.team_name
FROM public.teams
WHERE public.submissions.team_id = public.teams.id;

-- Make them NOT NULL if preferred, but since they might be updated on the fly, it's safer to leave as optional or just leave it for now.
