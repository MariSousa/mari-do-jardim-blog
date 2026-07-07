DO $$
DECLARE
  mari_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mari.sousa.136@gmail.com') THEN
    mari_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      mari_id,
      '00000000-0000-0000-0000-000000000000',
      'mari.sousa.136@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Mari Sousa"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );
  ELSE
    SELECT id INTO mari_id FROM auth.users WHERE email = 'mari.sousa.136@gmail.com' LIMIT 1;
  END IF;

  INSERT INTO public.posts (title, slug, content, excerpt, image_url, category, difficulty, light, science_fact, practice_tip, status, author_id, published_at)
  VALUES
  (
    'Fotossintese: A Engenharia das Plantas',
    'fotossintese-a-engenharia-das-plantas',
    '## A Ciencia da Fotossintese

A fotossintese e o processo pelo qual as plantas convertem **luz solar** em energia quimica. E fundamental entender esse processo para cuidar melhor das suas plantas.

### Como Funciona

1. A planta absorve luz atraves da *clorofila* nas folhas
2. O dioxido de carbono e absorvido pelos estomatos
3. A agua e absorvida pelas raizes
4. A energia solar quebra as moleculas de agua

> A fotossintese e responsavel por praticamente todo o oxigenio que respiramos!

### Fatores que Afetam a Fotossintese

- **Intensidade luminosa**: cada planta tem um ideal
- **Temperatura**: muito calor ou frio podem parar o processo
- **Disponibilidade de agua**: essencial para a reacao
- **Concentracao de CO2**: importante para o crescimento',
    'Descubra como a luz se transforma em alimento e como usar isso a favor do seu jardim.',
    'https://img.usecurling.com/p/800/600?q=photosynthesis%20leaves',
    'Jardim Interno',
    'Facil',
    'Luz Indireta',
    'A clorofila absorve luz vermelha e azul, refletindo o verde que vemos.',
    'Gire suas plantas a cada 2 semanas para que todos os lados recebam luz igual.',
    'Published',
    mari_id,
    NOW()
  ),
  (
    'Solo Vivo: O Universo Microscopico das Raizes',
    'solo-vivo-o-universo-microscopico-das-raizes',
    '## O Solo Nao e So Terra

O solo e um ecossistema vivo com bilhoes de micro-organismos. Cada colher de terra contem mais microbios do que pessoas na Terra!

### Componentes Essenciais

1. **Materia organica**: restos de plantas e animais em decomposicao
2. **Minerais**: areia, silte e argila
3. **Ar**: sim, as raizes precisam respirar!
4. **Agua**: transporta os nutrientes

### Como Melhorar Seu Solo

- Adicione **composto organico** mensalmente
- Use *cobertura morta* para reter umidade
- Evite compactar a terra ao redor das plantas
- Faca rotacao de culturas em canteiros

> Um solo saudavel tem cheiro de terra molhada apos a chuva - e a actinobacteria trabalhando!

Para mais informacoes sobre [compostagem caseira](https://exemplo.com), confira nosso guia.',
    'Entenda o ecossistema debaixo dos seus pes e como alimenta-lo naturalmente.',
    'https://img.usecurling.com/p/800/600?q=garden%20soil',
    'Solo & Nutrientes',
    'Medio',
    'Sol Pleno',
    'Bacterias do genero Rhizobium fixam nitrogenio atmosferico em nodulos nas raizes.',
    'Misture cascas de ovos secas no solo para fornecer calcio naturalmente.',
    'Published',
    mari_id,
    NOW() - INTERVAL '3 days'
  ),
  (
    'Pragas Comuns: Identificacao e Controle Natural',
    'pragas-comuns-identificacao-e-controle-natural',
    '## Identificando Invasores

Cada praga deixa sinais diferentes. Aprender a identifica-las cedo e **metade da batalha**.

### Principais Pragas

1. **Pulgoes**: pequenos insetos verdes ou pretos nos brotos
2. **Cochonilhas**: manchas brancas algodoadas nos caules
3. **Acaros**: teias finas sob as folhas
4. **Lesmas**: rastros de baba e folhas comidas

### Solucoes Naturais

- *Calda de fumo*: misture fumo de corda em agua
- *Oleo de neem*: dilua em agua e borrife
- *Sabao de potassio*: eficaz contra cochonilhas
- **Armadilhas cromaticas**: placas amarelas pegajosas

> A prevencao e o melhor remedio: plantas saudaveis resistem melhor a pragas!

### Cronograma de Prevencao

- **Semanal**: inspecione o verso das folhas
- **Mensal**: limpe folhas mortas e restos
- **Trimestral**: troque a camada superficial do solo',
    'Aprenda a identificar e combater pragas com solucoes naturais e eficazes.',
    'https://img.usecurling.com/p/800/600?q=garden%20pests',
    'Pragas & Solucoes',
    'Dificil',
    'Meia Sombra',
    'Pulgoes se reproduzem assexuadamente, com femeas gerando clones de si mesmas.',
    'Plante calendulas e capuchinhas proximas as suas plantas - elas atraem pragas para longe.',
    'Published',
    mari_id,
    NOW() - INTERVAL '7 days'
  )
  ON CONFLICT (slug) DO NOTHING;
END $$;
