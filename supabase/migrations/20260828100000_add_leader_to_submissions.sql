-- 1. Add team leader columns to submissions
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS team_leader_name VARCHAR;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS team_leader_pid VARCHAR;

-- 2. Populate existing rows from participants where is_leader = true
UPDATE public.submissions s
SET
    team_leader_name = p.name,
    team_leader_pid  = p.pid
FROM public.participants p
WHERE p.team_id = s.team_id
  AND p.is_leader = true;

-- 3. Create trigger function to auto-populate leader info on insert/update
CREATE OR REPLACE FUNCTION public.set_team_leader_info()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    SELECT name, pid
    INTO NEW.team_leader_name, NEW.team_leader_pid
    FROM public.participants
    WHERE team_id = NEW.team_id
      AND is_leader = true
    LIMIT 1;
    RETURN NEW;
END;
$$;

-- 4. Attach trigger to submissions
DROP TRIGGER IF EXISTS trg_submissions_set_leader ON public.submissions;
CREATE TRIGGER trg_submissions_set_leader
    BEFORE INSERT OR UPDATE
    ON public.submissions
    FOR EACH ROW
    WHEN (NEW.team_leader_name IS NULL OR NEW.team_leader_name = '')
    EXECUTE FUNCTION public.set_team_leader_info();
