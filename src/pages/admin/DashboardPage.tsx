import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useArticlesStore, { type ManagedArticle } from '@/stores/use-articles-store'
import { PostTable } from '@/components/admin/PostTable'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, ArrowLeft, Leaf } from 'lucide-react'
import type { Category } from '@/types'

const CATEGORIES: (Category | 'Todas')[] = [
  'Todas',
  'Plantas de Sombra',
  'Solo & Nutrientes',
  'Pragas & Soluções',
  'Jardim Interno',
]

export default function DashboardPage() {
  const { articles, deleteArticle } = useArticlesStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [deleteTarget, setDeleteTarget] = useState<ManagedArticle | null>(null)

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || a.status === statusFilter
      const matchCategory = categoryFilter === 'Todas' || a.category === categoryFilter
      return matchSearch && matchStatus && matchCategory
    })
  }, [articles, search, statusFilter, categoryFilter])

  const handleDelete = () => {
    if (deleteTarget) {
      deleteArticle(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="w-5 h-5 text-primary" />
        <span className="text-primary font-semibold text-sm">Painel Administrativo</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-black">Gestão de Conteúdo</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Ver Blog
            </Link>
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate('/admin/novo')}
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Artigo
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Published">Publicados</SelectItem>
            <SelectItem value="Draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-card">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 md:p-6">
        <PostTable
          articles={filtered}
          onEdit={(id) => navigate(`/admin/editar/${id}`)}
          onDelete={setDeleteTarget}
        />
      </div>

      <DeleteDialog
        open={!!deleteTarget}
        postTitle={deleteTarget?.title ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
