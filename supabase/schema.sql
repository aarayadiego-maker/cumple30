-- =========================================================
-- Invitación de cumpleaños — esquema de Supabase
-- Copia y pega TODO este archivo en Supabase -> SQL Editor -> New query
-- y dale "Run". Es idempotente-ish: si algo ya existe, bórralo primero
-- o usa "create or replace" (ya está hecho donde corresponde).
-- =========================================================

create extension if not exists unaccent;
create extension if not exists pgcrypto; -- para gen_random_uuid()

-- ---------------------------------------------------------
-- Tabla: guests (lista de invitados — fuente única de verdad,
-- la usan tanto el frontend como la función de validación)
-- ---------------------------------------------------------

create table if not exists public.guests (
  name text primary key,
  companions text[] not null default '{}',
  dance_invited boolean not null default false
);

alter table public.guests enable row level security;

drop policy if exists guests_select_public on public.guests;
create policy guests_select_public
  on public.guests for select
  to anon, authenticated
  using (true);

drop policy if exists guests_write_admin on public.guests;
create policy guests_write_admin
  on public.guests for all
  to authenticated
  using (true)
  with check (true);

-- Limpiamos e insertamos la lista completa (así puedes volver a
-- correr este archivo sin duplicar invitados).
delete from public.guests;

insert into public.guests (name, companions, dance_invited) values
  ('Mauricio Araya', '{}', false),
  ('Lorena Antezana', '{}', false),
  ('Martín Araya', '{}', false),
  (U&'Sofita \2764\FE0F', '{}', true),
  ('Elisa Antezana', ARRAY['Vicente Arratia','Ignacio Arratia'], false),
  ('Mónica Barrios', ARRAY['Jose Miguel Antezana'], false),
  ('Tia Eli', '{}', false),
  ('Tio Luis', '{}', false),
  ('Natalia Martinez', '{}', false),
  ('Tomás Martinez', '{}', false),
  ('Jorge', ARRAY['Vale','Flo'], false),
  ('Chica', ARRAY['Vale','Flo'], false),
  ('Alexis Toro', ARRAY['Ruth','Agustina'], true),
  ('Sole', ARRAY['Claudito'], false),
  ('Rodrigo Cousiño', ARRAY['Clau','Ema'], true),
  ('Mauricio Caneleo', '{}', true),
  ('Nachito Alvarado', ARRAY['Isa'], true),
  ('Franco Gallardo', '{}', true),
  ('Terry', ARRAY['Cata','Magda'], true),
  ('Tia Lily', '{}', false),
  ('Tio Eduardo', '{}', false),
  ('Alejandra Arias', ARRAY['Dani'], true),
  ('Pancho Arias', ARRAY['Sofi','Maximo'], true),
  ('Yiyo', ARRAY['Tami'], true),
  ('Julia', '{}', true),
  ('Vane', ARRAY['Vichto','Pablo'], false);

-- ---------------------------------------------------------
-- Tabla: event_config (una sola fila, id=1 — editable desde el admin)
-- ---------------------------------------------------------

create table if not exists public.event_config (
  id int primary key default 1,
  titulo text not null default '30 y siempre',
  descripcion text not null default 'Te invito a celebrar mis 15... 18 años después.',
  fecha text not null default 'Sábado 14 de Noviembre',
  hora text not null default 'Desde las 11:00 hrs hasta las 19:00 hrs',
  fecha_inicio_iso timestamptz not null default '2026-11-14T11:00:00-03:00',
  fecha_fin_iso timestamptz not null default '2026-11-14T19:00:00-03:00',
  direccion text not null default 'Camino San Javier, Malloco, RM',
  maps_url text not null default 'https://www.google.com/maps/search/?api=1&query=Camino+San+Javier%2C+Malloco%2C+RM',
  indicaciones text not null default '',
  imagen_portada_url text not null default '',
  rsvp_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint event_config_single_row check (id = 1)
);

alter table public.event_config enable row level security;

drop policy if exists event_config_select_public on public.event_config;
create policy event_config_select_public
  on public.event_config for select
  to anon, authenticated
  using (true);

drop policy if exists event_config_write_admin on public.event_config;
create policy event_config_write_admin
  on public.event_config for all
  to authenticated
  using (true)
  with check (true);

insert into public.event_config (id)
values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------
-- Tabla: rsvps (confirmaciones — privada, solo admin autenticado
-- puede leerla directamente; los invitados escriben SOLO a través
-- de la función submit_rsvp() de más abajo)
-- ---------------------------------------------------------

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null unique references public.guests(name),
  companions text[] not null default '{}',
  side_dish text not null default '',
  needs_transport text not null default '',
  comuna text not null default '',
  comuna_other text not null default '',
  dance text not null default '',
  submitted_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- Los invitados NO pueden leer ni escribir esta tabla directamente
-- (privacidad: nadie más debe ver quién más confirmó, ni editar
-- respuestas ajenas). Solo el admin autenticado puede leer.
drop policy if exists rsvps_select_admin on public.rsvps;
create policy rsvps_select_admin
  on public.rsvps for select
  to authenticated
  using (true);

-- ---------------------------------------------------------
-- Función: submit_rsvp — único camino de escritura para invitados.
-- SECURITY DEFINER = corre con los permisos del dueño de la función
-- (puede escribir en rsvps aunque RLS se lo niegue a "anon"), pero
-- ella misma valida todo contra la tabla guests antes de guardar.
-- Esto evita que cualquiera invente nombres o acompañantes falsos.
-- ---------------------------------------------------------

create or replace function public.submit_rsvp(
  p_guest_name text,
  p_companions text[],
  p_side_dish text,
  p_needs_transport text,
  p_comuna text,
  p_comuna_other text,
  p_dance text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_canonical text;
  v_valid_companions text[];
  v_dance_invited boolean;
  v_filtered_companions text[];
  v_final_comuna text := coalesce(p_comuna, '');
  v_final_comuna_other text := coalesce(trim(p_comuna_other), '');
  v_final_dance text := coalesce(p_dance, '');
begin
  select name, companions, dance_invited
    into v_canonical, v_valid_companions, v_dance_invited
  from public.guests
  where lower(unaccent(name)) = lower(unaccent(p_guest_name))
  limit 1;

  if v_canonical is null then
    raise exception 'No encontramos ese nombre en la lista de invitados.';
  end if;

  if coalesce(trim(p_side_dish), '') = '' then
    raise exception 'Cuéntanos qué vas a traer para compartir.';
  end if;

  if p_needs_transport not in ('Sí', 'No') then
    raise exception 'Respuesta de movilización inválida.';
  end if;

  if p_needs_transport = 'No' then
    v_final_comuna := '';
    v_final_comuna_other := '';
  elsif v_final_comuna = 'Otra comuna' and v_final_comuna_other = '' then
    raise exception 'Falta indicar la comuna.';
  end if;

  if not v_dance_invited then
    v_final_dance := '';
  elsif v_final_dance not in ('Sí o sí', 'No') then
    raise exception 'Respuesta de baile inválida.';
  end if;

  select coalesce(array_agg(c), '{}')
    into v_filtered_companions
  from unnest(p_companions) as c
  where c = any(v_valid_companions);

  insert into public.rsvps (
    guest_name, companions, side_dish, needs_transport,
    comuna, comuna_other, dance, submitted_at
  ) values (
    v_canonical, v_filtered_companions, trim(p_side_dish), p_needs_transport,
    v_final_comuna, v_final_comuna_other, v_final_dance, now()
  )
  on conflict (guest_name) do update set
    companions = excluded.companions,
    side_dish = excluded.side_dish,
    needs_transport = excluded.needs_transport,
    comuna = excluded.comuna,
    comuna_other = excluded.comuna_other,
    dance = excluded.dance,
    submitted_at = excluded.submitted_at;

  return jsonb_build_object('ok', true);
end;
$$;

-- Los invitados (anon) pueden EJECUTAR la función, pero no tocar
-- la tabla rsvps directamente (no hay policy de insert/update para
-- anon en rsvps, a propósito).
grant execute on function public.submit_rsvp(text, text[], text, text, text, text, text)
  to anon, authenticated;
