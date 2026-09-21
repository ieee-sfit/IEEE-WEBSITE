---
name: navkriti-ppt-downloader
description: Batch download all submitted PPTs from the Supabase Storage bucket. Use this skill when asked to download all presentations for convenors or judges.
---

# NAVKRITI PPT Downloader Skill

This skill allows you to automatically fetch all uploaded PPTs from the `sih_presentations` bucket and save them to a local directory for Google Drive upload.

## Execution Instructions
When the user asks you to download the submitted presentations:
1. Locate and execute the helper script at `.agents/scripts/download_ppts.cjs`.
2. You can run it via `node .agents/scripts/download_ppts.cjs`.
3. The script will query the `submissions` table, generate download URLs for each `ppt_file_path`, and download them to a `downloads/navkriti_ppts` directory in the workspace root.
4. Notify the user once the download is complete and provide the path to the downloaded files.
