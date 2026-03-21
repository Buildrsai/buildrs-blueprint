-- Policy INSERT sur profiles (pour upsert côté client)
create policy "profiles: insertion propriétaire"
  on public.profiles for insert
  with check (id = auth.uid());
