-- Grimoire de platine : à coller dans Supabase → SQL Editor → New query → Run.
-- Une seule table clé/valeur : chaque ligne = un trophée, la fiche de partie ou un jeu importé.

create table if not exists public.entries (
  user_id    uuid   not null default auth.uid() references auth.users (id) on delete cascade,
  game       text   not null,          -- "bg3", "_library"…
  key        text   not null,          -- "t:<trophée>", "run", "game:<id>"
  value      jsonb  not null,
  updated_at bigint not null,          -- horodatage en millisecondes (la valeur la plus récente gagne)
  primary key (user_id, game, key)
);

alter table public.entries enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres lignes.
drop policy if exists "entries_select" on public.entries;
drop policy if exists "entries_insert" on public.entries;
drop policy if exists "entries_update" on public.entries;
drop policy if exists "entries_delete" on public.entries;
create policy "entries_select" on public.entries for select to authenticated using (auth.uid() = user_id);
create policy "entries_insert" on public.entries for insert to authenticated with check (auth.uid() = user_id);
create policy "entries_update" on public.entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "entries_delete" on public.entries for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.entries to authenticated;
