import { Link } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useScrollState } from '@/hooks/use-scroll-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MASCOT_URL =
  'https://api.usecurling.com/v1/attachments/download/2893858d-d157-4300-8851-4d3baeb6380d/b19a31ed-2f22-4a00-ba53-611099fbcfe9.jpg'

export function Header() {
  const isScrolled = useScrollState(20)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Categorias', path: '/categorias' },
    { name: 'Ciência vs. Prática', path: '/categorias?filter=science' },
    { name: 'Painel Admin', path: '/admin' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'glass-header py-3' : 'bg-transparent py-5',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary group-hover:scale-105 transition-transform duration-300">
            <img
              src={MASCOT_URL}
              alt="Mari do Jardim Mascot"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight hidden sm:block">
            Mari <span className="text-primary">do Jardim</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <Input
                  autoFocus
                  type="text"
                  placeholder="Buscar artigo..."
                  className="w-48 bg-background/50 border-white/10 focus-visible:ring-primary"
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="hover:bg-primary/20 hover:text-primary rounded-full"
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 animate-slide-down shadow-xl">
          <nav className="flex flex-col gap-4">
            <Input type="text" placeholder="Buscar..." className="bg-card" />
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-medium p-2 hover:bg-card rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
