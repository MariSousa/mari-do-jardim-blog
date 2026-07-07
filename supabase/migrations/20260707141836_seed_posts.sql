DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'mari.sousa.136@gmail.com';

  IF admin_id IS NOT NULL THEN
    INSERT INTO public.posts (title, slug, content, excerpt, image_url, category, difficulty, light, science_fact, practice_tip, status, author_id, published_at)
    VALUES
      (
        'Os Segredos da Monstera Deliciosa: Rasgos e Fotossíntese',
        'segredos-da-monstera',
        E'A Monstera Deliciosa, carinhosamente chamada de Costela-de-Adão, é a rainha incontestável das selvas urbanas. Mas o que muitos não sabem é a ciência fascinante por trás de sua aparência exótica.\n\nNa natureza, essas plantas começam no chão da floresta escura e escalam árvores em direção à luz. À medida que sobem, as folhas maduras desenvolvem furos.\n\nPara replicar esse ambiente em casa, você não precisa de uma árvore, mas sim de um tutor (como um bastão de musgo) e a iluminação correta. Ao oferecer suporte vertical, você imita a árvore hospedeira, incentivando folhas maiores e mais fenestradas.',
        'Descubra por que a sua Costela-de-Adão cria buracos nas folhas e como usar isso a seu favor.',
        'https://img.usecurling.com/p/800/600?q=monstera%20leaf',
        'Jardim Interno', 'Fácil', 'Luz Indireta',
        E'Fenestração: As fendas nas folhas da Monstera evoluíram para permitir que a luz passe para as folhas inferiores no denso sub-bosque da selva e para resistir a ventos fortes sem rasgar.',
        E'Se sua Monstera não está desenvolvendo furos (fenestrações), ela precisa de mais luz! Mova-a para mais perto de uma janela, mas evite o sol direto do meio-dia que pode queimar as folhas.',
        'Published', admin_id, NOW() - INTERVAL '4 days'
      ),
      (
        'A Química da Terra: Entendendo o pH do Solo',
        'ph-do-solo',
        E'Você já adubou sua planta repetidas vezes e ela continua sem vida? O culpado silencioso pode ser o pH do solo.\n\nImagine o pH como a "fechadura" da despensa de nutrientes. Se a chave (o nível de pH) estiver errada, a planta simplesmente não consegue absorver a comida que está ali na terra.\n\nA maioria das plantas tropicais prefere um solo levemente ácido (entre 6.0 e 6.5). Um teste simples de solo pode poupar meses de frustração e dezenas de reais em fertilizantes desperdiçados.',
        'O pH não é só coisa de laboratório. Veja como ele afeta a nutrição das suas plantas e como corrigi-lo.',
        'https://img.usecurling.com/p/800/600?q=soil%20hands',
        'Solo & Nutrientes', 'Médio', 'Meia Sombra',
        E'Disponibilidade de Nutrientes: O pH do solo determina a solubilidade dos minerais. Em solos muito ácidos (pH < 5.5), macronutrientes como Fósforo ficam bloqueados quimicamente, enquanto a toxicidade por Alumínio aumenta.',
        E'Se suas plantas estão amareladas mesmo com adubo, o problema pode ser o pH! Adicione pó de casca de ovo (cálcio alcalino) para subir o pH, ou borra de café curtida para manter a acidez leve que samambaias amam.',
        'Published', admin_id, NOW() - INTERVAL '3 days'
      ),
      (
        'Guerra Biológica: Vencendo as Cochonilhas',
        'guerra-contra-cochonilhas',
        E'Aquele "algodãozinho" branco na sua planta não é inofensivo. As cochonilhas são como vampiros botânicos, sugando a energia vital da sua folhagem.\n\nO maior erro dos jardineiros iniciantes é tentar lavá-las apenas com água. Devido à sua biologia protetora, elas sobrevivem facilmente a um banho.\n\nA consistência é a chave. Como os ovos eclodem em ciclos, você precisa aplicar a solução de Neem a cada 7 dias por pelo menos um mês para erradicar completamente a infestação.',
        'Conheça o ciclo de vida dessas pragas terríveis e métodos naturais para eliminá-las de vez.',
        'https://img.usecurling.com/p/800/600?q=green%20leaf%20macro',
        'Pragas & Soluções', 'Fácil', 'Luz Indireta',
        E'Exoesqueleto Ceroso: Cochonilhas secretam uma camada de cera hidrofóbica que as protege de predadores e da maioria dos inseticidas líquidos à base de água. Elas se alimentam da seiva do floema, enfraquecendo a planta.',
        E'Pule o veneno forte! Use uma mistura de água, algumas gotas de detergente neutro e óleo de Neem. O detergente quebra a camada de cera do inseto, permitindo que o óleo atue interrompendo seu ciclo reprodutivo.',
        'Published', admin_id, NOW() - INTERVAL '2 days'
      ),
      (
        'O Superpoder das Suculentas: Metabolismo CAM',
        'fotossintese-em-suculentas',
        E'As suculentas são mestres da sobrevivência. Sua fisiologia foi moldada por alguns dos ambientes mais hostis da Terra.\n\nO segredo do seu sucesso é o metabolismo CAM, uma adaptação evolutiva brilhante que separa a absorção de carbono (feita à noite) da fotossíntese propriamente dita (feita de dia com a luz solar).\n\nQuando você rega uma suculenta todo dia um pouquinho, você confunde seu sistema radicular, que é projetado para absorver muita água rapidamente após uma tempestade no deserto, e depois suportar semanas de seca.',
        'Como essas plantas gordinhas sobrevivem em desertos e por que você está regando elas errado.',
        'https://img.usecurling.com/p/800/600?q=succulent',
        'Jardim Interno', 'Fácil', 'Sol Pleno',
        E'Metabolismo Ácido das Crassuláceas (CAM): Diferente da maioria das plantas, as suculentas abrem seus estômatos à noite para absorver CO2, minimizando a perda de água sob o sol quente do dia.',
        E'Regue abundantemente, mas raramente! O solo deve secar completamente entre as regas. Como elas respiram à noite, regar no final da tarde simula o orvalho noturno de seu habitat natural.',
        'Published', admin_id, NOW() - INTERVAL '1 day'
      ),
      (
        'Samambaias: Domando a Umidade Relativa',
        'samambaias-e-umidade',
        E'Muitos compram samambaias exuberantes apenas para vê-las crocantes semanas depois. O problema raramente é falta de água na terra, mas sim no ar.\n\nA umidade relativa dentro das nossas casas costuma ser muito baixa, especialmente com ar-condicionado.\n\nEntender a dinâmica da água no ar é vital. O agrupamento de plantas cria uma "bolha" de umidade por causa da transpiração coletiva, sendo o método mais eficiente e natural de manter suas frondes verdes e flexíveis.',
        'O guia definitivo para não ter pontas secas nas suas samambaias e entender a transpiração foliar.',
        'https://img.usecurling.com/p/800/600?q=fern%20leaf',
        'Plantas de Sombra', 'Médio', 'Sombra',
        E'Transpiração Foliar: Samambaias possuem folhas (frondes) com cutículas muito finas. Em ambientes com baixa umidade do ar, o gradiente de pressão de vapor força a água a sair da planta para o ar mais rápido do que as raízes conseguem repor.',
        E'Borrifar água nas folhas ajuda, mas evapora em 10 minutos. Para umidade real, crie um microclima agrupando plantas juntas ou coloque o vaso sobre uma bandeja com pedras e água (sem que o fundo do vaso toque na água).',
        'Published', admin_id, NOW()
      )
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;
