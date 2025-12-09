require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const ContentItem = require('../models/ContentItem');

async function createContentTable() {
  try {
    console.log('Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('Conexão estabelecida.');
    
    console.log('Criando tabela content_items...');
    await ContentItem.sync({ force: false });
    console.log('Tabela content_items criada com sucesso!');
    
    console.log('Inserindo dados de exemplo...');
    const sampleContent = [
      {
        type: 'news',
        title: 'Novo Guia de Desenvolvimento Infantil',
        description: 'Lançamos um guia completo sobre os marcos do desenvolvimento do seu filho de 0 a 6 anos.',
        summary: 'Guia completo para acompanhar o desenvolvimento infantil',
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=500&fit=crop',
        category: 'Guias',
        status: 'published',
        publish_date: new Date(),
        sort_order: 1,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'news',
        title: 'Workshop de Estimulação Cognitiva',
        description: 'Inscreva-se no nosso workshop online sobre técnicas de estimulação cognitiva para a primeira infância.',
        summary: 'Workshop online sobre estimulação cognitiva',
        image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=500&fit=crop',
        category: 'Eventos',
        status: 'published',
        publish_date: new Date(),
        sort_order: 2,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'news',
        title: 'Pesquisa de Satisfação 2024',
        description: 'Sua opinião é importante! Participe da nossa pesquisa anual e ajude-nos a melhorar.',
        summary: 'Participe e ajude-nos a melhorar',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop',
        category: 'Pesquisas',
        status: 'published',
        publish_date: new Date(),
        sort_order: 3,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'training',
        title: 'Introdução ao Desenvolvimento Infantil',
        description: 'Aprenda os fundamentos do desenvolvimento nas primeiras idades.',
        summary: 'Fundamentos do desenvolvimento infantil',
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
        category: 'Básico',
        duration: '1h 30min',
        level: 'iniciante',
        status: 'published',
        publish_date: new Date(),
        sort_order: 1,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'training',
        title: 'Técnicas Práticas de Estimulação',
        description: 'Domine técnicas comprovadas para estimular o desenvolvimento cognitivo.',
        summary: 'Técnicas de estimulação cognitiva',
        image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=250&fit=crop',
        category: 'Prático',
        duration: '2h 15min',
        level: 'intermediário',
        status: 'published',
        publish_date: new Date(),
        sort_order: 2,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'training',
        title: 'Comunicação com a Criança',
        description: 'Estratégias eficazes para melhorar a comunicação com seu filho.',
        summary: 'Melhore a comunicação com seu filho',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
        category: 'Comunicação',
        duration: '1h 45min',
        level: 'iniciante',
        status: 'published',
        publish_date: new Date(),
        sort_order: 3,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'course',
        title: 'Primeiros Passos no Desenvolvimento Infantil',
        description: 'Entenda as principais fases do desenvolvimento nos primeiros anos de vida.',
        summary: 'Fases do desenvolvimento infantil',
        image_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=250&fit=crop',
        category: 'Desenvolvimento',
        duration: '2h 30min',
        level: 'iniciante',
        status: 'published',
        publish_date: new Date(),
        sort_order: 1,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'course',
        title: 'Estimulação Cognitiva na Primeira Infância',
        description: 'Aprenda técnicas práticas para estimular o desenvolvimento cognitivo.',
        summary: 'Estimulação do desenvolvimento cognitivo',
        image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=250&fit=crop',
        category: 'Estimulação',
        duration: '3h 15min',
        level: 'intermediário',
        status: 'published',
        publish_date: new Date(),
        sort_order: 2,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      },
      {
        type: 'course',
        title: 'Comunicação e Linguagem: 0-3 anos',
        description: 'Como ajudar seu filho a desenvolver habilidades de comunicação.',
        summary: 'Desenvolvimento de habilidades de comunicação',
        image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
        category: 'Linguagem',
        duration: '1h 45min',
        level: 'iniciante',
        status: 'published',
        publish_date: new Date(),
        sort_order: 3,
        created_by: '04a89b72-e698-49b8-94e3-dfee2133bb7a'
      }
    ];

    for (const content of sampleContent) {
      await ContentItem.create(content);
    }
    
    console.log('Dados de exemplo inseridos com sucesso!');
    console.log('Total de registros:', await ContentItem.count());
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

createContentTable();
