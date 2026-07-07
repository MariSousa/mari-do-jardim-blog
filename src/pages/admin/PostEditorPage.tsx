import { useNavigate, useParams, Link } from 'react-router-dom'
import useArticlesStore from '@/stores/use-articles-store'
import { PostForm, type PostFormData } from '@/components/admin/PostForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Leaf } from 'lucide-react'
import { toast } from 'sonner'

export default function PostEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addArticle, updateArticle, getArticle } = useArticlesStore()
  const isEditing = !!id
  const existing = isEditing ? getArticle(id) : undefined

  if (isEditing && !existing) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <p className="text-xl mb-4">Artigo não encontrado.</p>
        <Button asChild>
          <Link to="/admin">Voltar ao painel</Link>
        </Button>
      </div>
    )
  }

  const handleSubmit = (data: PostFormData) => {
    const contentArray = data.content.split('\n\n').filter((p) => p.trim())
    const payload = {
      ...data,
      content: contentArray.length > 0 ? contentArray : [data.content],
      publishedAt: existing?.publishedAt ?? new Date().toISOString(),
    }

    if (isEditing && existing) {
      updateArticle(existing.id, payload)
      toast.success('Artigo atualizado com sucesso!')
    } else {
      addArticle(payload)
      toast.success('Artigo criado com sucesso!')
    }
    navigate('/admin')
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="w-5 h-5 text-primary" />
        <span className="text-primary font-semibold text-sm">Painel Administrativo</span>
      </div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-black">{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</h1>
        <Button variant="outline" asChild>
          <Link to="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 md:p-10">
        <PostForm
          initialData={
            existing
              ? {
                  title: existing.title,
                  excerpt: existing.excerpt,
                  image: existing.image,
                  category: existing.category,
                  difficulty: existing.difficulty,
                  light: existing.light,
                  scienceFact: existing.scienceFact,
                  practiceTip: existing.practiceTip,
                  content: existing.content.join('\n\n'),
                  status: existing.status,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin')}
        />
      </div>
    </div>
  )
}
