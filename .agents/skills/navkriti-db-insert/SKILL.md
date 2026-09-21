---
name: navkriti-db-insert
description: Manually insert a team registration into the NAVKRITI database. Use this skill when asked to manually add a team, inject a submission, or fix a missing team registration.
---

# NAVKRITI DB Insert Skill

This skill allows you to safely insert a complete team registration into the NAVKRITI Supabase database, bypassing Row Level Security.

## Execution Instructions
When the user asks you to manually insert a team registration:
1. Locate the existing `manual_insert.cjs` script in the workspace root.
2. Read the script to understand its expected inputs (usually Team ID, Team Name, Participants array, Payment PDF path).
3. Update the variables inside `manual_insert.cjs` (or a copy of it in the scratch directory) with the provided team details.
4. Execute the script using `node manual_insert.cjs`.
5. Verify the insertion was successful by checking the console output or querying the database.
6. Do not attempt to write raw SQL `INSERT` statements, as they will be blocked by RLS if you don't use the service key properly. The `manual_insert.cjs` script correctly handles the `SUPABASE_SERVICE_ROLE_KEY`.
