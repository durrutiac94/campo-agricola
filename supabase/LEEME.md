# Configuración de Supabase

Proyecto: `https://aduisbgrzktmryynpmrw.supabase.co`

## 1. Crear las tablas

1. Entrar al panel del proyecto.
2. **SQL Editor → New query**.
3. Pegar el contenido completo de `supabase/esquema.sql` y pulsar **Run**.
4. Al final deben aparecer dos resultados con `0`.

## 2. Crear la cuenta de desarrollo

**Authentication → Users → Add user → Create new user**

- Email: `durrutiac94@gmail.com`
- Password: la que elijas (mínimo 6 caracteres).
- Marcar **Auto Confirm User** para no depender del correo.

Más adelante se repite para la segunda persona del campo.

## 3. Desactivar el registro público

**Authentication → Sign In / Providers → Email**

- Desactivar **Allow new users to sign up**.
- Dejar activado **Email + Password**.

Así solo existen las cuentas creadas a mano.

## 4. Comprobaciones

Con la clave pública (`sb_publishable_...`), sin iniciar sesión:

- `GET /rest/v1/registros?select=id` → `200` y `[]`.
- `POST /rest/v1/registros` → `401` (la escritura requiere cuenta).
- `GET /storage/v1/object/public/documentos/` → bucket público listo.

## Claves

- URL: `https://aduisbgrzktmryynpmrw.supabase.co`
- Clave publicable: `sb_publishable_Zhe1wGUw1F7iYA5wv91TFA_E7thqQvQ`

La clave publicable está pensada para ir en el navegador: no da permisos de
escritura por sí sola, la protección real son las políticas RLS del SQL.

Nunca pegar en el sitio la clave `service_role` ni la contraseña de la base.
