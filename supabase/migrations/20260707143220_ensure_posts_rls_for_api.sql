-- Ensure RLS policies exist for blog-api Edge Function
-- These allow public SELECT and authenticated INSERT/UPDATE/DELETE
-- Using DROP + CREATE for idempotency

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
