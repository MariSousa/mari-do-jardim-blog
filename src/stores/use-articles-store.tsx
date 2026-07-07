import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { toast } from 'sonner'
import { postsService, type ManagedArticle } from '@/services/posts'

interface ArticlesContextValue {
  articles: ManagedArticle[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addArticle: (data: Omit<ManagedArticle, 'id' | 'slug'>) => Promise<ManagedArticle | null>
  updateArticle: (id: string, data: Partial<ManagedArticle>) => Promise<boolean>
  deleteArticle: (id: string) => Promise<boolean>
  getArticle: (id: string | undefined) => ManagedArticle | undefined
}

const ArticlesContext = createContext<ArticlesContextValue | null>(null)

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ManagedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await postsService.getAll()
    if (error) {
      const err = error as { message?: string }
      setError(err.message ?? 'Erro ao carregar artigos')
      setArticles([])
    } else {
      setArticles(data)
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addArticle = useCallback(
    async (data: Omit<ManagedArticle, 'id' | 'slug'>): Promise<ManagedArticle | null> => {
      const { data: post, error } = await postsService.create(data)
      if (error) {
        const err = error as { message?: string }
        toast.error('Erro ao criar artigo: ' + (err.message ?? ''))
        return null
      }
      if (post) setArticles((prev) => [post, ...prev])
      return post
    },
    [],
  )

  const updateArticle = useCallback(
    async (id: string, data: Partial<ManagedArticle>): Promise<boolean> => {
      const { data: updated, error } = await postsService.update(id, data)
      if (error) {
        const err = error as { message?: string }
        toast.error('Erro ao atualizar artigo: ' + (err.message ?? ''))
        return false
      }
      if (updated) {
        setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)))
      }
      return true
    },
    [],
  )

  const deleteArticle = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await postsService.remove(id)
    if (error) {
      const err = error as { message?: string }
      toast.error('Erro ao excluir artigo: ' + (err.message ?? ''))
      return false
    }
    setArticles((prev) => prev.filter((a) => a.id !== id))
    return true
  }, [])

  const getArticle = useCallback(
    (id: string | undefined) => (id ? articles.find((a) => a.id === id) : undefined),
    [articles],
  )

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        loading,
        error,
        refresh,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticle,
      }}
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

export type { ManagedArticle }
