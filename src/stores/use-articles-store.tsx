import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { Article, ArticleStatus } from '@/types'
import { ARTICLES } from '@/data/mock'

export type ManagedArticle = Article & { status: ArticleStatus; publishedAt: string }

interface ArticlesContextValue {
  articles: ManagedArticle[]
  addArticle: (data: Omit<ManagedArticle, 'id' | 'slug'>) => ManagedArticle
  updateArticle: (id: string, data: Partial<ManagedArticle>) => void
  deleteArticle: (id: string) => void
  getArticle: (id: string | undefined) => ManagedArticle | undefined
}

const ArticlesContext = createContext<ArticlesContextValue | null>(null)
const STORAGE_KEY = 'mari-do-jardim-articles'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function initArticles(): ManagedArticle[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    /* noop */
  }
  return ARTICLES.map((a, i) => ({
    ...a,
    status: 'Published' as ArticleStatus,
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
  }))
}

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ManagedArticle[]>(initArticles)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    } catch {
      /* noop */
    }
  }, [articles])

  const addArticle = useCallback((data: Omit<ManagedArticle, 'id' | 'slug'>): ManagedArticle => {
    const newArticle: ManagedArticle = {
      ...data,
      id: crypto.randomUUID(),
      slug: slugify(data.title),
    }
    setArticles((prev) => [newArticle, ...prev])
    return newArticle
  }, [])

  const updateArticle = useCallback((id: string, data: Partial<ManagedArticle>) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const updated = { ...a, ...data }
        if (data.title) updated.slug = slugify(data.title)
        return updated
      }),
    )
  }, [])

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const getArticle = useCallback(
    (id: string | undefined) => (id ? articles.find((a) => a.id === id) : undefined),
    [articles],
  )

  return (
    <ArticlesContext.Provider
      value={{ articles, addArticle, updateArticle, deleteArticle, getArticle }}
    >
      {children}
    </ArticlesContext.Provider>
  )
}

export default function useArticlesStore() {
  const ctx = useContext(ArticlesContext)
  if (!ctx) throw new Error('useArticlesStore must be used within ArticlesProvider')
  return ctx
}
