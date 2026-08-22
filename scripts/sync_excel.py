import os
import json
import urllib.request
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone, timedelta

# Setup paths
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / '.env.local'
EXCEL_PATH = BASE_DIR / "navkriti'26-registrations_2026.xlsx"

# Load Env Vars
env_vars = {}
if ENV_PATH.exists():
    with open(ENV_PATH, 'r') as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                k, v = line.strip().split('=', 1)
                env_vars[k] = v

SUPABASE_URL = env_vars.get('VITE_SUPABASE_URL')
SERVICE_ROLE_KEY = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    print("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local")
    exit(1)

def fetch_supabase(table):
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/{table}?select=*")
    req.add_header('apikey', SERVICE_ROLE_KEY)
    req.add_header('Authorization', f"Bearer {SERVICE_ROLE_KEY}")
    
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

def parse_date(date_str):
    if not date_str: return ''
    try:
        dt = datetime.fromisoformat(date_str)
        ist_tz = timezone(timedelta(hours=5, minutes=30))
        return dt.astimezone(ist_tz).strftime('%Y-%m-%d %H:%M:%S')
    except Exception:
        return date_str

def format_pid(pid):
    if not pid: return ''
    try:
        return int(float(pid))
    except ValueError:
        return pid

def format_gender(gender):
    if not gender: return ''
    return str(gender).strip().upper()[0]

print("Fetching data from Supabase...")
teams = fetch_supabase('teams')
participants = fetch_supabase('participants')

parts_by_team = {}
for p in participants:
    tid = p['team_id']
    if tid not in parts_by_team:
        parts_by_team[tid] = []
    parts_by_team[tid].append(p)

print("Reading Master Excel Sheet...")
df = pd.read_excel(EXCEL_PATH)
existing_team_names = set(df['Team Name'].dropna().astype(str).str.strip().str.lower())

new_rows = []
for t in teams:
    team_name = t.get('team_name', '')
    if team_name.lower().strip() in existing_team_names:
        continue
    
    members = parts_by_team.get(t['id'], [])
    leader = next((m for m in members if m.get('is_leader')), members[0] if members else None)
    others = [m for m in members if not m.get('is_leader')]
    
    if not leader: continue
    
    row = {
        'Sr. No.': len(df) + len(new_rows) + 1,
        'Submitted At': parse_date(t.get('created_at')),
        'Team Name': team_name,
        'Leader Name': leader.get('name'),
        'PID': format_pid(leader.get('pid')),
        'Gender': format_gender(leader.get('gender')),
        'Email ID': leader.get('email'),
        'Phone Number': leader.get('phone'),
        'Department': leader.get('branch'),
        'Year': leader.get('year'),
        'Payment Proof': t.get('payment_receipt_path'),
        "Payee's Upi ID": t.get('payee_upi_id')
    }
    
    for i, member in enumerate(others[:5]):
        suffix = f".{i+1}"
        idx_str = f" (Member {i+2})"
        row[f'Name{idx_str}'] = member.get('name')
        row[f'PID{suffix}'] = format_pid(member.get('pid'))
        row[f'Gender{suffix}'] = format_gender(member.get('gender'))
        row[f'Email ID{suffix}'] = member.get('email')
        row[f'Phone Number{suffix}'] = member.get('phone')
        row[f'Department{suffix}'] = member.get('branch')
        row[f'Year{suffix}'] = member.get('year')

    new_rows.append(row)

if new_rows:
    print(f"Found {len(new_rows)} new teams to add!")
    new_df = pd.DataFrame(new_rows)
    new_df = new_df.reindex(columns=df.columns) 
    
    combined_df = pd.concat([df, new_df], ignore_index=True)
    combined_df.to_excel(EXCEL_PATH, index=False)
    print(f"Successfully updated {EXCEL_PATH} with new teams!")
else:
    print("No new teams found. Excel sheet is already up to date.")
