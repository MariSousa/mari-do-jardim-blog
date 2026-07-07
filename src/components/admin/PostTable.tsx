import { Link } from 'react-router-dom'
import type { ManagedArticle } from '@/stores/use-articles-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

interface PostTableProps {
  articles: ManagedArticle[]
  onEdit: (id: string) => void
  onDelete: (article: ManagedArticle) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function PostTable({ articles, onEdit, onDelete }: PostTableProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">Nenhum artigo encontrado.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="pb-3 pl-4 font-medium">Título</th>
            <th className="pb-3 font-medium hidden md:table-cell">Categoria</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium hidden sm:table-cell">Data</th>
            <th className="pb-3 pr-4 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr
              key={article.id}
              className="border-b border-border/50 hover:bg-primary/5 transition-colors"
            >
              <td className="py-4 pl-4">
                <div className="flex items-center gap-3">
                  <img
                    src={article.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <Link
                    to={`/artigo/${article.slug}`}
                    className="font-semibold hover:text-primary transition-colors line-clamp-1"
                  >
                    {article.title}
                  </Link>
                </div>
              </td>
              <td className="py-4 hidden md:table-cell text-sm text-muted-foreground">
                {article.category}
              </td>
              <td className="py-4">
                <Badge
                  variant={article.status === 'Published' ? 'default' : 'secondary'}
                  className={
                    article.status === 'Published'
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {article.status === 'Published' ? 'Publicado' : 'Rascunho'}
                </Badge>
              </td>
              <td className="py-4 hidden sm:table-cell text-sm text-muted-foreground">
                {formatDate(article.publishedAt)}
              </td>
              <td className="py-4 pr-4">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(article.id)}
                    className="hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(article)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
