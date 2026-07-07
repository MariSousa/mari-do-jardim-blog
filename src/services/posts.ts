import { supabase } from '@/lib/supabase/client'
import type { Article, ArticleStatus, Category, Difficulty, LightLevel } from '@/types'

export type ManagedArticle = Article & { status: ArticleStatus; publishedAt: string }

export interface DbPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  category: string
  difficulty: string | null
  light: string | null
  science_fact: string | null
  practice_tip: string | null
  status: string | null
  author_id: string | null
  published_at: string | null
  created_at: string
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function dbToArticle(post: DbPost): ManagedArticle {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    image: post.image_url ?? '',
    category: post.category as Category,
    difficulty: (post.difficulty ?? 'Fácil') as Difficulty,
    light: (post.light ?? 'Luz Indireta') as LightLevel,
    scienceFact: post.science_fact ?? '',
    practiceTip: post.practice_tip ?? '',
    content: post.content ?? '',
    status: (post.status ?? 'Published') as ArticleStatus,
    publishedAt: post.published_at ?? post.created_at,
  }
}

function articleToDb(article: Partial<ManagedArticle>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (article.title !== undefined) {
    payload.title = article.title
    payload.slug = slugify(article.title)
  }
  if (article.content !== undefined) {
    payload.content = article.content
  }
  if (article.excerpt !== undefined) payload.excerpt = article.excerpt
  if (article.image !== undefined) payload.image_url = article.image
  if (article.category !== undefined) payload.category = article.category
  if (article.difficulty !== undefined) payload.difficulty = article.difficulty
  if (article.light !== undefined) payload.light = article.light
  if (article.scienceFact !== undefined) payload.science_fact = article.scienceFact
  if (article.practiceTip !== undefined) payload.practice_tip = article.practiceTip
  if (article.status !== undefined) payload.status = article.status
  if (article.publishedAt !== undefined) payload.published_at = article.publishedAt
  return payload
}

const db = supabase as unknown as {
  from: (table: string) => any
  auth: typeof supabase.auth
}

export const postsService = {
  async getAll(): Promise<{ data: ManagedArticle[]; error: unknown }> {
    const { data, error } = await db
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false })
    if (error) return { data: [], error }
    return { data: (data as DbPost[]).map(dbToArticle), error: null }
  },

  async create(
    article: Omit<ManagedArticle, 'id' | 'slug'>,
  ): Promise<{ data: ManagedArticle | null; error: unknown }> {
    const { data: userData } = await supabase.auth.getUser()
    const payload = {
      ...articleToDb(article),
      author_id: userData.user?.id ?? null,
    }
    const { data, error } = await db.from('posts').insert(payload).select().single()
    if (error) return { data: null, error }
    return { data: dbToArticle(data as DbPost), error: null }
  },

  async update(
    id: string,
    article: Partial<ManagedArticle>,
  ): Promise<{ data: ManagedArticle | null; error: unknown }> {
    const payload = articleToDb(article)
    const { data, error } = await db.from('posts').update(payload).eq('id', id).select().single()
    if (error) return { data: null, error }
    return { data: dbToArticle(data as DbPost), error: null }
  },

  async remove(id: string): Promise<{ error: unknown }> {
    const { error } = await db.from('posts').delete().eq('id', id)
    return { error }
  },
}
