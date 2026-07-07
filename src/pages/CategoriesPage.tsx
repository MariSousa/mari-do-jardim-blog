import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useArticlesStore from '@/stores/use-articles-store'
import { ArticleCard } from '@/components/ArticleCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, SlidersHorizontal } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Badge } from '@/components/ui/badge'

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { articles, loading } = useArticlesStore()
  const initialFilter = searchParams.get('filter') || ''

  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesUrlFilter = initialFilter
        ? initialFilter === 'science'
          ? true
          : article.category === initialFilter
        : true

      const matchesDifficulty =
        difficultyFilter === 'all' ? true : article.difficulty === difficultyFilter

      return matchesSearch && matchesUrlFilter && matchesDifficulty
    })
  }, [articles, searchQuery, initialFilter, difficultyFilter])

  return (
    <div className="pt-32 pb-24 container mx-auto px-4 min-h-screen">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Explorador Botânico</h1>
        <p className="text-lg text-muted-foreground">
          Encontre o conhecimento exato para a sua planta.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Ex: Monstera, Ph do solo..."
              className="pl-10 py-6 bg-card border-border text-lg rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <span className="text-sm font-semibold flex items-center text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Dificuldade:
          </span>
          <ToggleGroup
            type="single"
            value={difficultyFilter}
            onValueChange={(v) => {
              if (v) setDifficultyFilter(v)
            }}
          >
            <ToggleGroupItem value="all" className="rounded-full">
              Todos
            </ToggleGroupItem>
            <ToggleGroupItem value="Fácil" className="rounded-full">
              Fácil
            </ToggleGroupItem>
            <ToggleGroupItem value="Médio" className="rounded-full">
              Médio
            </ToggleGroupItem>
            <ToggleGroupItem value="Difícil" className="rounded-full">
              Difícil
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {initialFilter && initialFilter !== 'science' && (
        <div className="mb-8 flex items-center gap-2">
          <span className="text-muted-foreground">Filtrando por categoria:</span>
          <Badge className="bg-primary/20 text-primary text-sm px-3 py-1">
            {initialFilter}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-0"
              onClick={() => setSearchParams({})}
            >
              ×
            </Button>
          </Badge>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-full h-96 rounded-2xl" />
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, i) => (
            <div
              key={article.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-2xl border border-border">
          <p className="text-xl text-muted-foreground">
            Nenhum artigo encontrado com esses filtros.
          </p>
          <Button
            variant="link"
            className="mt-4 text-primary"
            onClick={() => {
              setSearchQuery('')
              setDifficultyFilter('all')
              setSearchParams({})
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
