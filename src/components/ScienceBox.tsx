import { Beaker, Sprout } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface ScienceBoxProps {
  science: string
  practice: string
  isMobile?: boolean
}

export function ScienceBox({ science, practice, isMobile = false }: ScienceBoxProps) {
  if (isMobile) {
    return (
      <Accordion
        type="single"
        collapsible
        className="w-full mb-8 bg-card border border-primary/30 rounded-xl overflow-hidden"
      >
        <AccordionItem value="science-practice" className="border-none">
          <AccordionTrigger className="px-4 py-4 hover:bg-primary/5 hover:no-underline">
            <span className="font-heading font-bold text-lg flex items-center gap-2">
              <Beaker className="w-5 h-5 text-primary" />
              Da Ciência para a Prática
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4 pt-2">
              <div>
                <h4 className="font-bold text-primary flex items-center gap-2 mb-1">A Ciência</h4>
                <p className="text-foreground/90 text-sm leading-relaxed">{science}</p>
              </div>
              <div className="border-t border-white/5 pt-4">
                <h4 className="font-bold text-emerald-400 flex items-center gap-2 mb-1">
                  <Sprout className="w-4 h-4" /> A Prática
                </h4>
                <p className="text-foreground/90 text-sm leading-relaxed font-medium">{practice}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  return (
    <Card className="bg-card border border-primary/30 shadow-2xl shadow-primary/5 sticky top-32">
      <CardHeader className="bg-primary/10 border-b border-primary/20 pb-4">
        <CardTitle className="font-heading font-bold flex items-center gap-2">
          <Beaker className="w-6 h-6 text-primary" />
          Teoria vs. Prática
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h4 className="font-bold text-primary mb-2 uppercase text-sm tracking-wider">
            A Ciência
          </h4>
          <p className="text-foreground/90 leading-relaxed text-sm">{science}</p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500 rounded-full" />
          <div className="pl-4">
            <h4 className="font-bold text-emerald-400 mb-2 uppercase text-sm tracking-wider flex items-center gap-2">
              <Sprout className="w-4 h-4" /> Como Fazer
            </h4>
            <p className="text-foreground font-medium leading-relaxed">{practice}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
