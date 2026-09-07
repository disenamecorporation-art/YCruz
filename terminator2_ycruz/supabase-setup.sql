-- SCRIPT DE CONFIGURACIÓN COMPLETO PARA SUPABASE
-- Ejecuta este script en el "SQL Editor" de tu panel de Supabase.

-- 1. Eliminar tablas existentes si ya existen para evitar conflictos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Crear tabla de Categorías
CREATE TABLE public.categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    image text,
    count integer DEFAULT 0
);

-- 3. Crear tabla de Productos
CREATE TABLE public.products (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name text NOT NULL,
    category text REFERENCES public.categories(id) ON DELETE SET NULL,
    price numeric(10,2) NOT NULL DEFAULT 0.00,
    image text,
    "isNew" boolean DEFAULT false,
    "isOffer" boolean DEFAULT false,
    "isTrending" boolean DEFAULT false,
    rating numeric(3,2) DEFAULT 5.00,
    colors jsonb DEFAULT '[]'::jsonb,
    sizes text[] DEFAULT '{}'::text[],
    stock integer DEFAULT 0
);

-- 4. Crear tabla de Perfiles de Usuario (Para guardar quién es Admin)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    email text,
    is_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. DESACTIVAR Y ASEGURAR RLS (Row Level Security) - Evita cualquier restricción al añadir, editar o eliminar
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Por si acaso tu proyecto de Supabase fuerza RLS a estar activado,
-- creamos políticas explícitas que permiten TODAS las operaciones (SELECT, INSERT, UPDATE, DELETE) a todos de forma pública:
DROP POLICY IF EXISTS "Permitir todo en categories" ON public.categories;
CREATE POLICY "Permitir todo en categories" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en products" ON public.products;
CREATE POLICY "Permitir todo en products" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todo en profiles" ON public.profiles;
CREATE POLICY "Permitir todo en profiles" ON public.profiles FOR ALL TO public USING (true) WITH CHECK (true);

-- 6. Trigger automático para enlazar registros de Auth a la tabla Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, is_admin)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'fullName', new.raw_user_meta_data->>'full_name', ''),
    new.email,
    -- Los correos específicos del admin del proyecto se marcarán como true automáticamente
    CASE WHEN new.email IN ('disenamecorporation@gmail.com', 'ycruzshop@gmail.com') THEN true ELSE false END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Insertar Datos de Categorías (Semilla)
INSERT INTO public.categories (id, name, image, count) VALUES
('pijamas-clasicas', 'Pijamas Clásicas', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600&h=600', 8),
('pijamas-satinadas', 'Pijamas Satinadas', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600&h=600', 10),
('pijamas-algodon', 'Pijamas De Algodón', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&h=600', 6),
('sets-complementos', 'Sets & Complementos', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600&h=600', 4)
ON CONFLICT (id) DO NOTHING;

-- 8. Insertar Datos de Productos (Semilla)
INSERT INTO public.products (id, name, category, price, image, "isNew", "isOffer", "isTrending", rating, colors, sizes, stock) VALUES
('prod-1', 'Pijama Satinada Beige', 'pijamas-satinadas', 49.99, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600&h=800', true, false, false, 5.00, '[{"name": "Beige", "hex": "#EADDC9"}, {"name": "Lila", "hex": "#D6C7E2"}, {"name": "Marfil", "hex": "#F5F2EB"}]'::jsonb, ARRAY['XS', 'S', 'M', 'L', 'XL'], 12),
('prod-2', 'Pijama Algodón Rosa', 'pijamas-algodon', 44.99, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&h=800', true, false, false, 4.80, '[{"name": "Rosa Pastel", "hex": "#F3D5D9"}, {"name": "Gris", "hex": "#CBD5E1"}]'::jsonb, ARRAY['S', 'M', 'L', 'XL'], 8),
('prod-3', 'Pijama Clásica Marfil', 'pijamas-clasicas', 46.99, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600&h=800', true, false, false, 4.90, '[{"name": "Marfil", "hex": "#F5F2EB"}, {"name": "Negro", "hex": "#1E1E1E"}]'::jsonb, ARRAY['XS', 'S', 'M', 'L'], 15),
('prod-4', 'Pijama Satinada Lila', 'pijamas-satinadas', 49.99, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800', true, false, false, 5.00, '[{"name": "Lila", "hex": "#D6C7E2"}, {"name": "Beige", "hex": "#EADDC9"}]'::jsonb, ARRAY['S', 'M', 'L'], 7),
('prod-5', 'Pijama de Seda Negra', 'pijamas-satinadas', 59.99, 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600&h=800', false, true, true, 5.00, '[{"name": "Negro", "hex": "#1E1E1E"}]'::jsonb, ARRAY['S', 'M', 'L', 'XL'], 5),
('prod-6', 'Set de Dormir Velvet', 'sets-complementos', 54.99, 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600&h=800', false, true, true, 4.70, '[{"name": "Verde Esmeralda", "hex": "#14532D"}, {"name": "Borgoña", "hex": "#7F1D1D"}]'::jsonb, ARRAY['S', 'M', 'L'], 6),
('prod-7', 'Pijama Algodón Gris', 'pijamas-algodon', 42.99, 'https://images.unsplash.com/photo-1581093458791-9f3c3200df34?auto=format&fit=crop&q=80&w=600&h=800', false, false, true, 4.60, '[{"name": "Gris", "hex": "#CBD5E1"}]'::jsonb, ARRAY['XS', 'S', 'M', 'L', 'XL'], 14),
('prod-8', 'Antifaz de Seda Premium', 'sets-complementos', 19.99, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600&h=800', false, false, false, 4.90, '[{"name": "Rosa Pastel", "hex": "#F3D5D9"}, {"name": "Beige", "hex": "#EADDC9"}, {"name": "Negro", "hex": "#1E1E1E"}]'::jsonb, ARRAY['Única'], 25),
('prod-9', 'Bata Corta Kimono Satinada', 'sets-complementos', 39.99, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600&h=800', false, true, false, 4.80, '[{"name": "Blanco Marfil", "hex": "#FBFBF9"}, {"name": "Rosa Pastel", "hex": "#F3D5D9"}]'::jsonb, ARRAY['XS', 'S', 'M', 'L', 'XL'], 10),
('prod-10', 'Pijama Larga Encaje Marfil', 'pijamas-clasicas', 52.99, 'https://images.unsplash.com/photo-1613987318222-392e7d30726d?auto=format&fit=crop&q=80&w=600&h=800', false, false, false, 5.00, '[{"name": "Marfil", "hex": "#F5F2EB"}]'::jsonb, ARRAY['S', 'M', 'L'], 4),
('prod-11', 'Pijama Corta de Algodón Verde', 'pijamas-algodon', 38.99, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&h=800', false, false, false, 4.50, '[{"name": "Verde Salvia", "hex": "#8DA399"}]'::jsonb, ARRAY['XS', 'S', 'M', 'L'], 11),
('prod-12', 'Pantuflas de Lana Soft', 'sets-complementos', 24.99, 'https://images.unsplash.com/photo-1562572159-4ebcd318f4dd?auto=format&fit=crop&q=80&w=600&h=800', false, false, false, 4.70, '[{"name": "Crema", "hex": "#F5EFE7"}, {"name": "Marrón", "hex": "#8A7263"}]'::jsonb, ARRAY['S (35-37)', 'M (38-40)', 'L (41-43)'], 18)
ON CONFLICT (id) DO NOTHING;
