---
name: navkriti-csv-diff
description: Compare a provided CSV of team records against the live database and output only the missing records. Use this skill when asked to find which teams from a list haven't registered or submitted yet.
---

# NAVKRITI CSV Diff Skill

This skill allows you to quickly find the delta between a provided CSV file of teams/participants and the actual live database records.

## Execution Instructions
When the user asks you to diff a CSV:
1. Write a temporary Node.js script in the workspace scratch directory.
2. The script should use `fs` to read the provided CSV file and parse out the target identifiers (usually `team_id` or `pid`).
3. The script should use `@supabase/supabase-js` with the `SUPABASE_SERVICE_ROLE_KEY` to fetch the complete list of corresponding identifiers from the live database.
4. Compare the two lists to find which identifiers in the CSV do *not* exist in the database.
5. Write the missing records to a new file named `pending_insertions.csv` or similar, or just output them to the user if the list is small.
