import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageSearchProps {
  value: string
  onChange: (url: string) => void
}

export function ImageSearch({ value, onChange }: ImageSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSearch = () => {
    if (!query.trim()) return
    const q = encodeURIComponent(query.trim())
    setSuggestions(
      Array.from({ length: 6 }, (_, i) => `https://img.usecurling.com/p/400/300?q=${q}&dpr=2`),
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar imagens (ex: monstera, suculenta...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
          }}
          className="bg-background"
        />
        <Button type="button" variant="secondary" onClick={handleSearch} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <Input
        type="url"
        placeholder="Ou cole uma URL de imagem..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background"
      />

      {suggestions.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {suggestions.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(url)}
              className={cn(
                'relative rounded-lg overflow-hidden aspect-video border-2 transition-all',
                value === url
                  ? 'border-primary scale-95'
                  : 'border-transparent hover:border-primary/50',
              )}
            >
              <img src={url} alt={`Sugestão ${i + 1}`} className="w-full h-full object-cover" />
              {value === url && (
                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {value && (
        <div className="rounded-lg overflow-hidden border border-border">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
        </div>
      )}
    </div>
  )
}
