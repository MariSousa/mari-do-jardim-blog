import { useParams, Navigate, Link } from 'react-router-dom'
import useArticlesStore from '@/stores/use-articles-store'
import { Badge } from '@/components/ui/badge'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { useIsMobile } from '@/hooks/use-mobile'
import { ScienceBox } from '@/components/ScienceBox'
import { ArrowLeft, Clock, Sun, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import mascotImg from '@/assets/chatgptimage6demar.de2026091019-removebg-preview-f3520.png'

export default function ArticlePage() {
  const { slug } = useParams()
  const isMobile = useIsMobile()
  const progress = useScrollProgress()
  const { articles: ARTICLES } = useArticlesStore()

  const article = ARTICLES.find((a) => a.slug === slug)
  const relatedArticles = ARTICLES.filter((a) => a.id !== article?.id).slice(0, 3)

  if (!article) return <Navigate to="/404" />

  return (
    <div className="bg-background relative">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-[60] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Hero Header */}
      <div className="w-full h-[60vh] md:h-[70vh] relative">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 pb-12 pt-24 animate-fade-in-up">
            <Link to="/categorias">
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 text-white/70 hover:text-white hover:bg-white/10 -ml-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos artigos
              </Button>
            </Link>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none text-sm px-3 py-1">
                {article.category}
              </Badge>
              <Badge
                variant="outline"
                className="bg-black/40 backdrop-blur text-white border-white/20 text-sm px-3 py-1"
              >
                <Gauge className="w-3.5 h-3.5 mr-1" /> {article.difficulty}
              </Badge>
              <Badge
                variant="outline"
                className="bg-black/40 backdrop-blur text-white border-white/20 text-sm px-3 py-1"
              >
                <Sun className="w-3.5 h-3.5 mr-1" /> {article.light}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white max-w-4xl leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl font-medium">{article.excerpt}</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          {/* Main Article Content */}
          <article className="lg:w-2/3 prose prose-invert prose-lg md:prose-xl max-w-none">
            {isMobile && (
              <ScienceBox
                science={article.scienceFact}
                practice={article.practiceTip}
                isMobile={true}
              />
            )}

            {article.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed text-foreground/90 font-sans mb-8">
                {paragraph}
              </p>
            ))}

            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 mt-12 mb-16">
              <h3 className="font-heading font-bold text-xl flex items-center gap-2 mb-4 text-foreground mt-0">
                <img
                  src={mascotImg}
                  className="w-8 h-8 rounded-full border border-primary object-cover bg-white"
                  alt="Mari"
                />
                Dica Pro da Mari
              </h3>
              <p className="text-base text-muted-foreground m-0">
                A jardinagem não é uma ciência exata em casa. Observe a resposta da sua planta por
                uma semana antes de tentar uma nova intervenção. A paciência é o melhor
                fertilizante!
              </p>
            </div>
          </article>

          {/* Sticky Sidebar */}
          {!isMobile && (
            <aside className="lg:w-1/3">
              <ScienceBox science={article.scienceFact} practice={article.practiceTip} />
            </aside>
          )}
        </div>
      </div>

      {/* Related Posts */}
      <div className="bg-card border-t border-border py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-10">Continue Explorando</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((rel) => (
              <Link key={rel.id} to={`/artigo/${rel.slug}`} className="group cursor-pointer">
                <div className="rounded-xl overflow-hidden mb-4 relative aspect-video">
                  <img
                    src={rel.image}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={rel.title}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {rel.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
