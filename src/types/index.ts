export type Difficulty = 'Fácil' | 'Médio' | 'Difícil'
export type LightLevel = 'Sombra' | 'Meia Sombra' | 'Luz Indireta' | 'Sol Pleno'
export type Category =
  | 'Plantas de Sombra'
  | 'Solo & Nutrientes'
  | 'Pragas & Soluções'
  | 'Jardim Interno'

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  category: Category
  difficulty: Difficulty
  light: LightLevel
  scienceFact: string
  practiceTip: string
  content: string[]
}
