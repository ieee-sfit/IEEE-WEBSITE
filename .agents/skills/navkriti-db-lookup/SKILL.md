---
name: navkriti-db-lookup
description: Lookup NAVKRITI team, participant, or submission data in Supabase. Use this skill when asked to find a team by ID, check a submission, or find a PID.
---

# NAVKRITI DB Lookup Skill

This skill provides context for querying the `teams`, `participants`, and `submissions` tables in the NAVKRITI Supabase database.

## Schema Context
- `teams`: `id` (UUID), `team_id` (e.g. NAV-123456), `team_name`, `payment_receipt_path`, `status`
- `participants`: `id` (UUID), `team_id` (fkey to teams), `is_leader` (boolean), `pid` (e.g. 241234), `name`, `email`
- `submissions`: `team_id` (fkey to teams), `problem_statement`, `ppt_file_path`, `team_leader_name`, `team_leader_pid`

## Execution Instructions
When the user asks you to look up data:
1. Do not use the Supabase dashboard.
2. Use the `run_command` tool to execute a quick Node.js script or `npx supabase db query "SELECT ..."` if the local CLI is configured. 
3. The preferred fast method is to write a temporary script in the artifact scratch directory using `@supabase/supabase-js` and the `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` or `supabase/functions/.env` to bypass Row Level Security.
4. Output the results cleanly to the user.
