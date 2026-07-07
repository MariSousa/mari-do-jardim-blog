import { Link } from 'react-router-dom'
import useArticlesStore from '@/stores/use-articles-store'
import { ArticleCard } from '@/components/ArticleCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Droplets, Leaf, Sun, Bug, ChevronRight } from 'lucide-react'

const CATEGORIES = [
  { name: 'Plantas de Sombra', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Solo & Nutrientes', icon: Droplets, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Pragas & Soluções', icon: Bug, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { name: 'Luz & Ambiente', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
]

export default function Index() {
  const { articles, loading } = useArticlesStore()
  const featuredArticle = articles[0]
  const recentArticles = articles.slice(1, 4)

  return (
    <div className="pb-24">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pb-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.usecurling.com/p/1600/900?q=lush%20indoor%20garden"
            alt="Lush indoor garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background via-background/70 to-background/40" />
          <div className="absolute inset-0 bg-background/30" />
        </div>

        <div className="container relative z-30 mx-auto px-4 text-center animate-fade-in-up">
          <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 text-sm px-4 py-1.5 font-medium">
            <Leaf className="w-4 h-4 mr-2" /> O Blog de Jardinagem Científica
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight max-w-4xl mx-auto text-foreground drop-shadow-2xl">
            Ciência na terra, <br />
            <span className="text-primary text-glow">beleza no vaso.</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto font-medium">
            Traduzindo a botânica complexa em cuidados práticos e diretos para o seu jardim caseiro.
          </p>
          <Link to="/categorias">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full animate-pulse-soft font-bold shadow-xl shadow-primary/25"
            >
              Comece por aqui
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.name} to={`/categorias?filter=${cat.name}`}>
              <div
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1 shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center mb-4`}
                >
                  <cat.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-center text-sm md:text-base">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 mt-32">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-black">Em Destaque</h2>
          <Link
            to="/categorias"
            className="text-primary font-semibold flex items-center hover:underline"
          >
            Ver todos <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-8">
            <Skeleton className="w-full h-64 md:h-80 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="w-full h-80 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Leaf className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Nenhum artigo publicado ainda</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              O blog está sendo preparado. Em breve, novos conteúdos sobre jardinagem científica
              aparecerão aqui.
            </p>
            <Link to="/categorias">
              <Button variant="outline" className="rounded-full">
                Explorar categorias
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <div className="mb-12 animate-fade-in-up">
                <ArticleCard article={featuredArticle} featured />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map((article, i) => (
                <div key={article.id} className="animate-fade-in-up">
                  <ArticleCard article={article} index={i} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
