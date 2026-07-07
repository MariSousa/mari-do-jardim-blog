import { supabase } from '@/lib/supabase/client'
import type { Article, ArticleStatus, Category, Difficulty, LightLevel } from '@/types'

export interface ApiPost {
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

export interface ApiPostPayload {
  title: string
  slug?: string
  content: string
  excerpt?: string
  image_url?: string
  category?: string
  difficulty?: string
  light?: string
  science_fact?: string
  practice_tip?: string
  status?: string
  published_at?: string
}

function getApiUrl(): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  return `${supabaseUrl}/functions/v1/blog-api`
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function apiPostToArticle(post: ApiPost): Article {
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
    content: post.content ? post.content.split('\n\n') : [],
    status: (post.status ?? 'Published') as ArticleStatus,
    publishedAt: post.published_at ?? post.created_at,
  }
}

export const blogApiService = {
  async getAll(): Promise<{ data: Article[]; error: string | null }> {
    try {
      const res = await fetch(getApiUrl(), { method: 'GET' })
      const json = await res.json()
      if (!res.ok) return { data: [], error: json.error ?? 'Failed to fetch posts' }
      return { data: (json.data as ApiPost[]).map(apiPostToArticle), error: null }
    } catch (err) {
      return { data: [], error: err instanceof Error ? err.message : 'Network error' }
    }
  },

  async getById(id: string): Promise<{ data: Article | null; error: string | null }> {
    try {
      const res = await fetch(`${getApiUrl()}?id=${encodeURIComponent(id)}`, { method: 'GET' })
      const json = await res.json()
      if (!res.ok) return { data: null, error: json.error ?? 'Failed to fetch post' }
      return { data: apiPostToArticle(json.data as ApiPost), error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Network error' }
    }
  },

  async getBySlug(slug: string): Promise<{ data: Article | null; error: string | null }> {
    try {
      const res = await fetch(`${getApiUrl()}?slug=${encodeURIComponent(slug)}`, { method: 'GET' })
      const json = await res.json()
      if (!res.ok) return { data: null, error: json.error ?? 'Failed to fetch post' }
      return { data: apiPostToArticle(json.data as ApiPost), error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Network error' }
    }
  },

  async create(payload: ApiPostPayload): Promise<{ data: Article | null; error: string | null }> {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(getApiUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) return { data: null, error: json.error ?? 'Failed to create post' }
      return { data: apiPostToArticle(json.data as ApiPost), error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Network error' }
    }
  },

  async update(
    id: string,
    payload: Partial<ApiPostPayload>,
  ): Promise<{ data: Article | null; error: string | null }> {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${getApiUrl()}?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) return { data: null, error: json.error ?? 'Failed to update post' }
      return { data: apiPostToArticle(json.data as ApiPost), error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Network error' }
    }
  },

  async remove(id: string): Promise<{ error: string | null }> {
    try {
      const headers = await getAuthHeaders()
      const res = await fetch(`${getApiUrl()}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers,
      })
      const json = await res.json()
      if (!res.ok) return { error: json.error ?? 'Failed to delete post' }
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Network error' }
    }
  },
}
