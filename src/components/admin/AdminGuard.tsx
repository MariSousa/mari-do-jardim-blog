import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Leaf } from 'lucide-react'
import type { ReactNode } from 'react'

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="w-8 h-8 text-primary animate-pulse" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
