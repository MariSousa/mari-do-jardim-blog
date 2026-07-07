import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ArticlesProvider } from '@/stores/use-articles-store'
import Layout from './components/Layout'
import Index from './pages/Index'
import ArticlePage from './pages/ArticlePage'
import CategoriesPage from './pages/CategoriesPage'
import DashboardPage from './pages/admin/DashboardPage'
import PostEditorPage from './pages/admin/PostEditorPage'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <ArticlesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/artigo/:slug" element={<ArticlePage />} />
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/novo" element={<PostEditorPage />} />
            <Route path="/admin/editar/:id" element={<PostEditorPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </ArticlesProvider>
  </BrowserRouter>
)

export default App
