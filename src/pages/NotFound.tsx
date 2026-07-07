import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-black text-primary mb-6">404</h1>
        <p className="text-2xl font-bold mb-4">Esta planta secou.</p>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida para outro vaso.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-primary font-bold w-full sm:w-auto">
            Voltar para o Início
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
