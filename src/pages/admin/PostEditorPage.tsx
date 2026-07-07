import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PostForm, type PostFormData } from '@/components/admin/PostForm'
import useArticlesStore from '@/stores/use-articles-store'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PostEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { articles, loading, addArticle, updateArticle } = useArticlesStore()
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!id
  const article = isEditing ? articles.find((a) => a.id === id) : undefined

  useEffect(() => {
    if (isEditing && !loading && !article) {
      navigate('/admin')
    }
  }, [isEditing, loading, article, navigate])

  const handleSubmit = async (data: PostFormData) => {
    setSubmitting(true)
    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      image: data.image,
      category: data.category,
      difficulty: data.difficulty,
      light: data.light,
      scienceFact: data.scienceFact,
      practiceTip: data.practiceTip,
      content: data.content,
      status: data.status,
    }
    if (isEditing && id) {
      const success = await updateArticle(id, payload)
      if (success) navigate('/admin')
    } else {
      const result = await addArticle(payload)
      if (result) navigate('/admin')
    }
    setSubmitting(false)
  }

  if (loading && isEditing) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4">
        <Skeleton className="w-1/2 h-10 mb-8" />
        <Skeleton className="w-full h-96" />
      </div>
    )
  }

  return (
    <div className="pt-32 pb-24 container mx-auto px-4">
      <div className="mb-8">
        <Link to="/admin">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao painel
          </Button>
        </Link>
        <h1 className="text-3xl font-black mt-4">{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</h1>
      </div>
      <PostForm
        initialData={
          article
            ? {
                title: article.title,
                excerpt: article.excerpt,
                image: article.image,
                category: article.category,
                difficulty: article.difficulty,
                light: article.light,
                scienceFact: article.scienceFact,
                practiceTip: article.practiceTip,
                content: article.content,
                status: article.status,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin')}
      />
      {submitting && <p className="text-muted-foreground text-sm mt-4">Salvando...</p>}
    </div>
  )
}
