import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Droplets, Leaf } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-2xl font-heading font-black flex items-center gap-2 text-foreground">
              <Leaf className="w-6 h-6 text-primary" />
              Mari <span className="text-primary">do Jardim</span>
            </h3>
            <p className="text-muted-foreground max-w-md">
              Democratizando a botânica. Traduzimos conceitos complexos em passos simples para que
              seu jardim cresça forte e saudável.
            </p>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <h4 className="font-heading font-bold text-lg">
              Receba doses de ciência no seu e-mail
            </h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="seu.melhor@email.com"
                className="bg-background border-border"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Inscrever
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sem spam. Apenas dicas valiosas a cada quinzena.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mari do Jardim. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Pinterest
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
