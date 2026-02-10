'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    const ownerUser = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'owner@educareapp.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const createdBy = ownerUser.length ? ownerUser[0].id : null;

    const items = [
      {
        type: 'news',
        title: 'Entenda a Seletividade Alimentar: Como Ajudar Seu Filho a Comer Melhor',
        description: '<h2>O que é Seletividade Alimentar?</h2> <p>A seletividade alimentar é um comportamento que muitos pais e cuidadores enfrentam durante a fase de desenvolvimento das crianças, especialmente entre os 1 e 6 anos. Esse fenômeno se refere à preferência das crianças por certos alimentos, muitas vezes rejeitando novos sabores e texturas. É importante compreender que essa fase é normal e geralmente passageira, mas pode causar preocupação nos adultos.</p> <h3>Por que as Crianças Seletivas?</h3> <p>Vários fatores podem contribuir para a seletividade alimentar, incluindo:</p> <ul> <li><strong>Desenvolvimento Sensorial:</strong> As crianças estão descobrindo novos sabores e texturas, o que pode levar a rejeições temporárias.</li> <li><strong>Autonomia:</strong> A fase de desenvolvimento em que as crianças buscam afirmar sua independência pode resultar em comportamentos alimentares seletivos.</li> <li><strong>Experiências Passadas:</strong> Se uma criança teve uma experiência negativa com um alimento, pode ser menos inclinada a experimentá-lo novamente.</li> </ul> <h3>Como Lidar com a Seletividade Alimentar?</h3> <p>Embora seja normal, a seletividade alimentar não deve ser ignorada. Aqui estão algumas dicas para ajudar seu filho a ter uma alimentação mais diversificada:</p> <ul> <li><strong>Introduza Novos Alimentos Gradualmente:</strong> Apresente novos alimentos de forma gradual e em diferentes preparações.</li> <li><strong>Seja um Exemplo:</strong> Demonstre hábitos alimentares saudáveis e curiosidade em experimentar novos sabores.</li> <li><strong>Crie um Ambiente Positivo:</strong> Evite pressões durante as refeições e transforme o momento da alimentação em uma experiência agradável e relaxante.</li> </ul> <p>Com paciência e consistência, é possível ajudar seu filho a expandir seu paladar e desenvolver hábitos alimentares saudáveis que perdurarão por toda a vida.</p>',
        summary: 'A seletividade alimentar é comum entre crianças pequenas. Descubra como lidar com esse desafio e promover uma alimentação saudável.',
        image_url: '',
        category: 'Nutrição',
        duration: '3 min',
        level: 'iniciante',
        cta_url: '',
        cta_text: 'Descubra mais dicas',
        target_audience: 'parents',
        status: 'published',
        sort_order: 0,
        view_count: 0
      },
      {
        type: 'course',
        title: 'Primeiros Passos: Desenvolvimento Motor do Bebê',
        description: 'Curso completo sobre como acompanhar e estimular o desenvolvimento motor do seu bebê desde o nascimento até os primeiros passos. Inclui vídeos práticos, exercícios guiados e material de apoio.',
        summary: 'Aprenda a estimular o desenvolvimento motor do bebê com exercícios práticos e seguros.',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        category: 'Desenvolvimento Infantil',
        duration: '4 horas',
        level: 'iniciante',
        cta_url: '/educare-app/academia',
        cta_text: 'Acessar Curso',
        target_audience: 'parents',
        status: 'published',
        sort_order: 1,
        view_count: 0
      },
      {
        type: 'course',
        title: 'Nutrição Inteligente para Mães e Bebês',
        description: 'Descubra como montar um plano alimentar completo para a mãe no pós-parto e introdução alimentar do bebê. Receitas práticas, orientações nutricionais e dicas de especialistas.',
        summary: 'Plano alimentar completo para mãe e bebê com receitas e orientações de especialistas.',
        image_url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400',
        category: 'Nutrição',
        duration: '3 horas',
        level: 'iniciante',
        cta_url: '/educare-app/academia',
        cta_text: 'Acessar Curso',
        target_audience: 'all',
        status: 'published',
        sort_order: 2,
        view_count: 0
      },
      {
        type: 'course',
        title: 'Sono Seguro: Guia Completo para Pais',
        description: 'Tudo sobre o sono do bebê: rotinas saudáveis, ambiente seguro, técnicas de auto-regulação e como lidar com as regressões de sono. Baseado em evidências científicas.',
        summary: 'Guia completo sobre sono do bebê com técnicas baseadas em evidências.',
        image_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
        category: 'Saúde e Bem-estar',
        duration: '2.5 horas',
        level: 'iniciante',
        cta_url: '/educare-app/academia',
        cta_text: 'Acessar Curso',
        target_audience: 'parents',
        status: 'published',
        sort_order: 3,
        view_count: 0
      },
      {
        type: 'course',
        title: 'Avaliação do Desenvolvimento Infantil para Profissionais',
        description: 'Capacitação profissional em instrumentos de triagem e avaliação do desenvolvimento infantil. Inclui Denver II, Bayley, M-CHAT e curvas de crescimento OMS.',
        summary: 'Capacitação em instrumentos de triagem e avaliação do desenvolvimento infantil.',
        image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
        category: 'Formação Profissional',
        duration: '8 horas',
        level: 'avançado',
        cta_url: '/educare-app/academia',
        cta_text: 'Acessar Curso',
        target_audience: 'professionals',
        status: 'published',
        sort_order: 4,
        view_count: 0
      },
      {
        type: 'training',
        title: 'Workshop: Amamentação sem Mitos',
        description: 'Workshop prático sobre amamentação baseado em evidências científicas. Desmistifica crenças populares e ensina técnicas corretas de pega, posição e manejo de dificuldades comuns.',
        summary: 'Desmistifique a amamentação com técnicas práticas baseadas em ciência.',
        image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400',
        category: 'Amamentação',
        duration: '1.5 horas',
        level: 'iniciante',
        cta_url: '/educare-app/academia',
        cta_text: 'Assistir',
        target_audience: 'all',
        status: 'published',
        sort_order: 5,
        view_count: 0
      },
      {
        type: 'training',
        title: 'Primeiros Socorros Pediátricos',
        description: 'Treinamento essencial sobre como agir em emergências com bebês e crianças. Engasgo, quedas, febre alta, convulsões e quando procurar ajuda médica.',
        summary: 'Saiba como agir em emergências com bebês e crianças pequenas.',
        image_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400',
        category: 'Saúde e Segurança',
        duration: '2 horas',
        level: 'iniciante',
        cta_url: '/educare-app/academia',
        cta_text: 'Assistir',
        target_audience: 'all',
        status: 'published',
        sort_order: 6,
        view_count: 0
      },
      {
        type: 'training',
        title: 'Estimulação Sensorial na Primeira Infância',
        description: 'Aprenda atividades de estimulação sensorial adequadas para cada fase do desenvolvimento. Material prático com lista de materiais acessíveis e instruções passo a passo.',
        summary: 'Atividades de estimulação sensorial para cada fase do desenvolvimento.',
        image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400',
        category: 'Estimulação',
        duration: '1 hora',
        level: 'iniciante',
        cta_url: '/educare-app/academia',
        cta_text: 'Assistir',
        target_audience: 'parents',
        status: 'published',
        sort_order: 7,
        view_count: 0
      },
      {
        type: 'training',
        title: 'Triagem Neonatal: Protocolos Atualizados',
        description: 'Treinamento para profissionais sobre os protocolos atualizados de triagem neonatal, incluindo teste do pezinho ampliado, orelhinha, olhinho e coraçãozinho.',
        summary: 'Protocolos atualizados de triagem neonatal para profissionais de saúde.',
        image_url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400',
        category: 'Protocolos Clínicos',
        duration: '3 horas',
        level: 'intermediário',
        cta_url: '/educare-app/academia',
        cta_text: 'Assistir',
        target_audience: 'professionals',
        status: 'published',
        sort_order: 8,
        view_count: 0
      },
      {
        type: 'news',
        title: 'Nova Diretriz da SBP sobre Tempo de Tela para Crianças',
        description: 'A Sociedade Brasileira de Pediatria atualizou suas recomendações sobre o uso de telas por crianças de 0 a 6 anos. Confira as principais mudanças e como aplicar no dia a dia.',
        summary: 'SBP atualiza recomendações sobre tempo de tela para crianças de 0 a 6 anos.',
        image_url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400',
        category: 'Saúde Digital',
        duration: null,
        level: null,
        cta_url: '/educare-app/blog',
        cta_text: 'Ler mais',
        target_audience: 'all',
        status: 'published',
        sort_order: 9,
        view_count: 0
      },
      {
        type: 'news',
        title: 'Estudo Revela Importância da Leitura desde o Nascimento',
        description: 'Pesquisa publicada na revista Pediatrics demonstra que ler para bebês desde os primeiros dias de vida impacta significativamente o desenvolvimento cognitivo e da linguagem.',
        summary: 'Pesquisa mostra impacto da leitura precoce no desenvolvimento do bebê.',
        image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        category: 'Pesquisa Científica',
        duration: null,
        level: null,
        cta_url: '/educare-app/blog',
        cta_text: 'Ler mais',
        target_audience: 'all',
        status: 'published',
        sort_order: 10,
        view_count: 0
      },
      {
        type: 'news',
        title: 'Calendário Vacinal 2025: Novas Vacinas Incluídas',
        description: 'O Ministério da Saúde anunciou a inclusão de novas vacinas no calendário nacional de imunização infantil para 2025. Saiba quais são e quando levar seu filho.',
        summary: 'Novas vacinas foram incluídas no calendário nacional de imunização infantil.',
        image_url: 'https://images.unsplash.com/photo-1632053002928-1919605ee6f7?w=400',
        category: 'Vacinação',
        duration: null,
        level: null,
        cta_url: '/educare-app/blog',
        cta_text: 'Ler mais',
        target_audience: 'all',
        status: 'published',
        sort_order: 11,
        view_count: 0
      },
      {
        type: 'news',
        title: 'Educare+ Lança Módulo de Saúde Materna',
        description: 'A plataforma Educare+ agora conta com um módulo completo dedicado à saúde materna, incluindo acompanhamento de humor, diário de saúde e orientações personalizadas via IA.',
        summary: 'Novo módulo de saúde materna com acompanhamento personalizado via IA.',
        image_url: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=400',
        category: 'Plataforma',
        duration: null,
        level: null,
        cta_url: '/educare-app/blog',
        cta_text: 'Ler mais',
        target_audience: 'all',
        status: 'published',
        sort_order: 12,
        view_count: 0
      },
      {
        type: 'course',
        title: 'Mindfulness para Mães: Saúde Mental no Puerpério',
        description: 'Técnicas de mindfulness e meditação adaptadas para mães no período pós-parto. Reduza o estresse, melhore o sono e fortaleça o vínculo com seu bebê.',
        summary: 'Técnicas de mindfulness adaptadas para o puerpério.',
        image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
        category: 'Saúde Mental',
        duration: '2 horas',
        level: 'iniciante',
        cta_url: '/educare-app/academia',
        cta_text: 'Acessar Curso',
        target_audience: 'parents',
        status: 'draft',
        sort_order: 13,
        view_count: 0
      },
      {
        type: 'training',
        title: 'Manejo de Dificuldades Alimentares na Infância',
        description: 'Treinamento para profissionais sobre identificação e manejo de seletividade alimentar, recusa alimentar e dificuldades na transição de texturas.',
        summary: 'Identificação e manejo de dificuldades alimentares em crianças.',
        image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
        category: 'Nutrição Clínica',
        duration: '2.5 horas',
        level: 'intermediário',
        cta_url: '/educare-app/academia',
        cta_text: 'Assistir',
        target_audience: 'professionals',
        status: 'draft',
        sort_order: 14,
        view_count: 0
      }
    ];

    return queryInterface.bulkInsert('content_items', items.map(item => ({
      id: uuidv4(),
      ...item,
      metadata: JSON.stringify({}),
      created_by: createdBy,
      updated_by: null,
      publish_date: item.status === 'published' ? now : null,
      expire_date: null,
      created_at: now,
      updated_at: now
    })));
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('content_items', null, {});
  }
};
