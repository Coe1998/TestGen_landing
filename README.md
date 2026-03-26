# TestGen Landing Page

## Setup

### 1 — Installa dipendenze
```bash
cd landing
npm install
```

### 2 — Configura Supabase
1. Vai su [supabase.com](https://supabase.com) → apri il tuo progetto
2. **SQL Editor** → esegui:
```sql
create table early_access (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

-- Permetti insert anonimo (solo insert, no select/delete)
alter table early_access enable row level security;

create policy "allow_insert" on early_access
  for insert with check (true);
```
3. **Settings → API** → copia `Project URL` e `anon/public key`
4. Crea `.env.local` a partire da `.env.local.example` e incolla i valori

### 3 — Avvio locale
```bash
npm run dev
# → http://localhost:3000
```

### 4 — Deploy su Vercel
```bash
# Collega il repo a Vercel (una volta sola)
npx vercel

# Deploy successivi
npx vercel --prod
```

In Vercel → Settings → Environment Variables aggiungi:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5 — Visualizzare le email raccolte
In Supabase → **Table Editor** → `early_access`

Oppure esporta in CSV: **Table Editor → early_access → Export**.
