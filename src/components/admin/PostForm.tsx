import { useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageSearch } from '@/components/admin/ImageSearch'
import type { Category, Difficulty, LightLevel, ArticleStatus } from '@/types'
import { Save, X } from 'lucide-react'

const CATEGORIES: Category[] = [
  'Plantas de Sombra',
  'Solo & Nutrientes',
  'Pragas & Soluções',
  'Jardim Interno',
]
const DIFFICULTIES: Difficulty[] = ['Fácil', 'Médio', 'Difícil']
const LIGHTS: LightLevel[] = ['Sombra', 'Meia Sombra', 'Luz Indireta', 'Sol Pleno']

export interface PostFormData {
  title: string
  excerpt: string
  image: string
  category: Category
  difficulty: Difficulty
  light: LightLevel
  scienceFact: string
  practiceTip: string
  content: string
  status: ArticleStatus
}

interface PostFormProps {
  initialData?: Partial<PostFormData>
  onSubmit: (data: PostFormData) => void
  onCancel: () => void
}

export function PostForm({ initialData, onSubmit, onCancel }: PostFormProps) {
  const [form, setForm] = useState<PostFormData>({
    title: initialData?.title ?? '',
    excerpt: initialData?.excerpt ?? '',
    image: initialData?.image ?? '',
    category: initialData?.category ?? 'Jardim Interno',
    difficulty: initialData?.difficulty ?? 'Fácil',
    light: initialData?.light ?? 'Luz Indireta',
    scienceFact: initialData?.scienceFact ?? '',
    practiceTip: initialData?.practiceTip ?? '',
    content: initialData?.content ?? '',
    status: initialData?.status ?? 'Published',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = <K extends keyof PostFormData>(key: K, val: PostFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'Título é obrigatório'
    if (!form.scienceFact.trim()) newErrors.scienceFact = 'Explicação científica é obrigatória'
    if (!form.practiceTip.trim()) newErrors.practiceTip = 'Dicas práticas são obrigatórias'
    if (!form.image.trim()) newErrors.image = 'Imagem de capa é obrigatória'
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          className="bg-background"
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumo</Label>
        <Textarea
          id="excerpt"
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          rows={2}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem de Capa *</Label>
        <ImageSearch value={form.image} onChange={(url) => set('image', url)} />
        {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={form.category} onValueChange={(v) => set('category', v as Category)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
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
        <div className="space-y-2">
          <Label>Dificuldade</Label>
          <Select value={form.difficulty} onValueChange={(v) => set('difficulty', v as Difficulty)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Luz</Label>
          <Select value={form.light} onValueChange={(v) => set('light', v as LightLevel)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIGHTS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scienceFact">A Ciência por Trás (Explicação Científica) *</Label>
        <Textarea
          id="scienceFact"
          value={form.scienceFact}
          onChange={(e) => set('scienceFact', e.target.value)}
          rows={4}
          className="bg-background"
        />
        {errors.scienceFact && <p className="text-destructive text-sm">{errors.scienceFact}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="practiceTip">Dicas Práticas *</Label>
        <Textarea
          id="practiceTip"
          value={form.practiceTip}
          onChange={(e) => set('practiceTip', e.target.value)}
          rows={4}
          className="bg-background"
        />
        {errors.practiceTip && <p className="text-destructive text-sm">{errors.practiceTip}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo do Artigo</Label>
        <Textarea
          id="content"
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          rows={8}
          placeholder="Escreva em Markdown: # Título, **negrito**, *itálico*, - listas, [link](url)..."
          className="bg-background"
        />
        <p className="text-sm text-muted-foreground">
          Dica: Use Markdown para formatar o conteúdo. Separe parágrafos com linha em branco.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={form.status} onValueChange={(v) => set('status', v as ArticleStatus)}>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Published">Publicado</SelectItem>
            <SelectItem value="Draft">Rascunho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" /> Salvar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" /> Cancelar
        </Button>
      </div>
    </form>
  )
}
