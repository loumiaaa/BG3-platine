-- Grimoire de platine : à coller dans Supabase → SQL Editor → New query → Run.
-- Une seule table clé/valeur : chaque ligne = un trophée, la fiche de partie ou un jeu importé.

create table if not exists public.grimoire_entries (
  user_id    uuid   not null default auth.uid() references auth.users (id) on delete cascade,
  game       text   not null,          -- "bg3", "_library"…
  key        text   not null,          -- "t:<trophée>", "run", "game:<id>"
  value      jsonb  not null,
  updated_at bigint not null,          -- horodatage en millisecondes (la valeur la plus récente gagne)
  primary key (user_id, game, key)
);

alter table public.grimoire_entries enable row level security;

-- Chaque compte ne voit et ne modifie que ses propres lignes.
create policy "grimoire_entries_select" on public.grimoire_entries for select to authenticated using (auth.uid() = user_id);
create policy "grimoire_entries_insert" on public.grimoire_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "grimoire_entries_update" on public.grimoire_entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "grimoire_entries_delete" on public.grimoire_entries for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.grimoire_entries to authenticated;
