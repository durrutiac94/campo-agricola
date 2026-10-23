-- Esquema del sitio Campo El Avellano (Supabase)
-- Ejecutar completo en: Dashboard -> SQL Editor -> New query -> Run
-- Es idempotente: se puede volver a ejecutar sin perder datos.

-- ---------------------------------------------------------------------------
-- 1. Tablas
-- ---------------------------------------------------------------------------

create table if not exists public.registros (
  id            uuid primary key,
  seccion       text not null check (length(trim(seccion)) > 0),
  lista         text not null check (length(trim(lista)) > 0),
  datos         jsonb not null default '{}'::jsonb check (jsonb_typeof(datos) = 'object'),
  orden         integer not null default 0,
  actualizado_en timestamptz not null default now()
);

create index if not exists registros_seccion_lista_orden_idx
  on public.registros (seccion, lista, orden);

create table if not exists public.ajustes (
  seccion       text primary key check (length(trim(seccion)) > 0),
  datos         jsonb not null default '{}'::jsonb check (jsonb_typeof(datos) = 'object'),
  actualizado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Fecha de actualización automática
-- ---------------------------------------------------------------------------

create or replace function public.marcar_actualizado()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists trg_registros_actualizado on public.registros;
create trigger trg_registros_actualizado
  before update on public.registros
  for each row execute function public.marcar_actualizado();

drop trigger if exists trg_ajustes_actualizado on public.ajustes;
create trigger trg_ajustes_actualizado
  before update on public.ajustes
  for each row execute function public.marcar_actualizado();

-- ---------------------------------------------------------------------------
-- 3. Permisos y seguridad por fila (RLS)
--    Lectura: cualquiera (sitio público).
--    Escritura: solo cuentas autenticadas (las 2 personas del campo).
-- ---------------------------------------------------------------------------

alter table public.registros enable row level security;
alter table public.ajustes  enable row level security;

grant select on public.registros, public.ajustes to anon, authenticated;
grant insert, update, delete on public.registros to authenticated;
grant insert, update, delete on public.ajustes  to authenticated;

drop policy if exists "registros_lectura_publica" on public.registros;
create policy "registros_lectura_publica"
  on public.registros for select
  to anon, authenticated
  using (true);

drop policy if exists "registros_escritura_miembros" on public.registros;
create policy "registros_escritura_miembros"
  on public.registros for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "ajustes_lectura_publica" on public.ajustes;
create policy "ajustes_lectura_publica"
  on public.ajustes for select
  to anon, authenticated
  using (true);

drop policy if exists "ajustes_escritura_miembros" on public.ajustes;
create policy "ajustes_escritura_miembros"
  on public.ajustes for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- 4. Almacenamiento de PDFs (bucket "documentos")
--    Lectura pública, subida y borrado solo con cuenta.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documentos', 'documentos', true, 20971520, array['application/pdf'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "documentos_lectura_publica" on storage.objects;
create policy "documentos_lectura_publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'documentos');

drop policy if exists "documentos_subida_miembros" on storage.objects;
create policy "documentos_subida_miembros"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documentos');

drop policy if exists "documentos_cambio_miembros" on storage.objects;
create policy "documentos_cambio_miembros"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'documentos')
  with check (bucket_id = 'documentos');

drop policy if exists "documentos_borrado_miembros" on storage.objects;
create policy "documentos_borrado_miembros"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'documentos');

-- ---------------------------------------------------------------------------
-- 5. Comprobación rápida (debe devolver 0 filas, sin error)
-- ---------------------------------------------------------------------------

select count(*) as registros from public.registros;
select count(*) as ajustes from public.ajustes;
