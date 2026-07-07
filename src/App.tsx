import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ArticlesProvider } from '@/stores/use-articles-store'
import { AdminGuard } from '@/components/admin/AdminGuard'
import Layout from './components/Layout'
import Index from './pages/Index'
import ArticlePage from './pages/ArticlePage'
import CategoriesPage from './pages/CategoriesPage'
import DashboardPage from './pages/admin/DashboardPage'
import PostEditorPage from './pages/admin/PostEditorPage'
import LoginPage from './pages/admin/LoginPage'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ArticlesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/artigo/:slug" element={<ArticlePage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <DashboardPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/novo"
                element={
                  <AdminGuard>
                    <PostEditorPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/editar/:id"
                element={
                  <AdminGuard>
                    <PostEditorPage />
                  </AdminGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </ArticlesProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
