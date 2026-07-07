CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Jardim Interno',
  difficulty TEXT DEFAULT 'Fácil',
  light TEXT DEFAULT 'Luz Indireta',
  science_fact TEXT DEFAULT '',
  practice_tip TEXT DEFAULT '',
  status TEXT DEFAULT 'Published',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_idx ON public.posts (slug);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts (published_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_public" ON public.posts;
CREATE POLICY "posts_select_public" ON public.posts
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "posts_insert_authenticated" ON public.posts;
CREATE POLICY "posts_insert_authenticated" ON public.posts
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "posts_update_authenticated" ON public.posts;
CREATE POLICY "posts_update_authenticated" ON public.posts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "posts_delete_authenticated" ON public.posts;
CREATE POLICY "posts_delete_authenticated" ON public.posts
  FOR DELETE TO authenticated USING (true);

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mari.sousa.136@gmail.com') THEN
    admin_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'mari.sousa.136@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Mari Sousa"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  END IF;
END $$;
