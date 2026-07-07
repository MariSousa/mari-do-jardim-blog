import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Leaf } from 'lucide-react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('mari.sousa.136@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-black">Área Administrativa</h1>
          <p className="text-muted-foreground mt-2">Faça login para gerenciar seus posts</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-card border border-border rounded-2xl p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background"
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Voltar ao blog
          </Link>
        </div>
      </div>
    </div>
  )
}
