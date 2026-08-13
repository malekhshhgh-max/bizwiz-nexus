create policy "media read all" on storage.objects for select using (bucket_id = 'media');
create policy "media insert staff" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.can_manage_content(auth.uid()));
create policy "media update staff" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.can_manage_content(auth.uid()));
create policy "media delete staff" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.can_manage_content(auth.uid()));