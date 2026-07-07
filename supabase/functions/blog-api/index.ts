import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic }: { topic: string } = await req.json()

    const capitalized = topic.charAt(0).toUpperCase() + topic.slice(1)
    const slug = topic
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const result = {
      title: `Guia Completo sobre ${capitalized}`,
      slug,
      content: `# Guia Completo sobre ${capitalized}\n\nNeste artigo, vamos explorar detalhadamente tudo sobre **${topic}** e como aplicar esse conhecimento na pratica.\n\n## Introducao\n\nO tema "${topic}" tem ganhado cada vez mais relevancia nos ultimos anos. Seja para iniciantes ou entusiastas, entender os fundamentos e essencial para obter resultados positivos.\n\n## Pontos Principais\n\n1. **Fundamentos**: Compreender os principios basicos e o primeiro passo para o sucesso com ${topic}.\n2. **Pratica Constante**: A aplicacao regular dos conceitos acelera o aprendizado e os resultados.\n3. **Adaptacao**: Cada ambiente e unico, entao ajuste as recomendacoes a sua realidade.\n\n## Dicas Avancadas\n\n- Documente seu progresso com fotos e anotacoes\n- Conecte-se com comunidades de praticantes de ${topic}\n- Nao tenha medo de experimentar novas abordagens\n\n## Conclusao\n\nDominar ${topic} exige paciencia e dedicacao, mas os resultados valem cada esforco. Comece pequeno, seja consistente e logo voce colhera frutos incriveis!`,
      excerpt: `Descubra tudo sobre ${topic}: desde os fundamentos ate dicas avancadas para aplicar na pratica e obter resultados excepcionais.`,
      category: 'Jardim Interno',
      difficulty: 'Facil',
      light: 'Luz Indireta',
      science_fact: `Estudos recentes demonstram que a pratica regular relacionada a ${topic} pode melhorar o bem-estar em ate 40%.`,
      practice_tip: `Comece dedicando 15 minutos por dia a ${topic}. A consistencia e mais importante que a intensidade no inicio.`,
    }

    await new Promise((res) => setTimeout(res, 1500))

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', Connection: 'keep-alive', ...corsHeaders },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to generate content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})
