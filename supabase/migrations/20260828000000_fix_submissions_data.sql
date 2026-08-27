-- 1. Create a trigger function to auto-populate team_name
CREATE OR REPLACE FUNCTION public.set_team_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    SELECT team_name INTO NEW.team_name
    FROM public.teams
    WHERE id = NEW.team_id;
    RETURN NEW;
END;
$$;

-- 2. Attach trigger to submissions
DROP TRIGGER IF EXISTS trg_submissions_set_team_name ON public.submissions;
CREATE TRIGGER trg_submissions_set_team_name
    BEFORE INSERT OR UPDATE
    ON public.submissions
    FOR EACH ROW
    WHEN (NEW.team_name IS NULL OR NEW.team_name = '')
    EXECUTE FUNCTION public.set_team_name();

-- 3. Attach trigger to ps_drafts
DROP TRIGGER IF EXISTS trg_ps_drafts_set_team_name ON public.ps_drafts;
CREATE TRIGGER trg_ps_drafts_set_team_name
    BEFORE INSERT OR UPDATE
    ON public.ps_drafts
    FOR EACH ROW
    WHEN (NEW.team_name IS NULL OR NEW.team_name = '')
    EXECUTE FUNCTION public.set_team_name();

-- 4. Fix existing null team_names
UPDATE public.submissions
SET team_name = t.team_name
FROM public.teams t
WHERE public.submissions.team_id = t.id
  AND public.submissions.team_name IS NULL;

-- 5. Fix empty organizations by pulling from ps_drafts
UPDATE public.submissions s
SET organization = p.organization
FROM public.ps_drafts p
WHERE s.team_id = p.team_id
  AND (s.organization = '' OR s.organization IS NULL);
