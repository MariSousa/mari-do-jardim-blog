import { Link } from 'react-router-dom'
import { Article } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Beaker, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  index?: number
  featured?: boolean
}

export function ArticleCard({ article, index = 0, featured = false }: ArticleCardProps) {
  return (
    <Link to={`/artigo/${article.slug}`}>
      <Card
        className={cn(
          'group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 h-full flex flex-col cursor-pointer',
          'hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10',
          featured ? 'md:flex-row md:items-center' : '',
        )}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div
          className={cn(
            'relative overflow-hidden',
            featured ? 'md:w-1/2 h-64 md:h-full' : 'h-56 w-full',
          )}
        >
          <img
            src={article.image}
            alt={article.title}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur text-foreground border-none"
            >
              {article.category}
            </Badge>
          </div>
        </div>

        <CardContent className={cn('flex flex-col flex-1 p-6', featured ? 'md:w-1/2 md:p-8' : '')}>
          <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{article.excerpt}</p>

          <div className="mt-auto space-y-4">
            <div className="bg-background/50 rounded-lg p-3 text-xs border border-white/5 relative overflow-hidden group-hover:bg-background transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              <div className="flex items-start gap-2 mb-2">
                <Beaker className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span className="font-semibold text-foreground/80 line-clamp-1">
                  Ciência: {article.scienceFact}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Sprout className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="font-semibold text-foreground/80 line-clamp-1">
                  Prática: {article.practiceTip}
                </span>
              </div>
            </div>

            <div className="flex items-center text-primary text-sm font-semibold pt-2">
              Ler artigo completo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
