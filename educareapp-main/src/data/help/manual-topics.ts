
import { Book, Landmark, FileText, Users, Settings, BrainCircuit, BookOpen, HelpCircle, AlertTriangle, Clipboard } from 'lucide-react';

export const manualTopics = [
  {
    id: 'introduction',
    title: 'Introdução',
    icon: Book,
    content: `
      <h2>Bem-vindo ao Smart PEI</h2>
      <p>O Smart PEI é uma plataforma abrangente projetada para facilitar a criação e gestão de Planos de Ensino Individualizados (PEI) para estudantes com necessidades educacionais especiais.</p>
      
      <h3>O que é um PEI?</h3>
      <p>Um Plano de Ensino Individualizado (PEI) é um documento que descreve o programa educacional personalizado para atender às necessidades específicas de um estudante com deficiência ou necessidades especiais.</p>
      
      <h3>Como o Smart PEI pode ajudar?</h3>
      <p>Nossa plataforma oferece ferramentas para:</p>
      <ul>
        <li>Criar e gerenciar PEIs de forma colaborativa</li>
        <li>Realizar avaliações abrangentes do desenvolvimento</li>
        <li>Monitorar o progresso do aluno em tempo real</li>
        <li>Gerar relatórios personalizados</li>
        <li>Facilitar a comunicação entre educadores, especialistas e responsáveis</li>
      </ul>
    `,
    relatedVideos: ['getting-started']
  },
  {
    id: 'quick-start',
    title: 'Guia Rápido',
    icon: Landmark,
    content: `
      <h2>Guia de Início Rápido</h2>
      <p>Este guia o ajudará a começar a usar o Smart PEI rapidamente.</p>
      
      <h3>Passo 1: Crie sua conta</h3>
      <p>Registre-se na plataforma usando seu e-mail profissional. Após o registro, você receberá um e-mail de confirmação para ativar sua conta.</p>
      
      <h3>Passo 2: Complete seu perfil</h3>
      <p>Adicione suas informações profissionais e áreas de especialização para facilitar a colaboração.</p>
      
      <h3>Passo 3: Cadastre um aluno</h3>
      <p>Na seção "Alunos", clique em "Adicionar Novo Aluno" e preencha as informações básicas.</p>
      
      <h3>Passo 4: Inicie uma avaliação</h3>
      <p>Selecione o aluno cadastrado e clique em "Nova Avaliação" para iniciar o processo de avaliação.</p>
      
      <h3>Passo 5: Crie um PEI</h3>
      <p>Após a avaliação, você pode criar um PEI baseado nos resultados obtidos.</p>
    `,
    relatedVideos: ['getting-started', 'assessments']
  },
  {
    id: 'assessments',
    title: 'Avaliações',
    icon: Clipboard,
    content: `
      <h2>Sistema de Avaliações</h2>
      <p>O Smart PEI oferece um sistema abrangente de avaliação para identificar necessidades e monitorar o progresso dos alunos.</p>
      
      <h3>Tipos de Avaliação</h3>
      <p>O sistema inclui diferentes tipos de avaliação:</p>
      <ul>
        <li>Avaliação Inicial: Para estabelecer a linha de base</li>
        <li>Avaliação de Progresso: Para monitorar o desenvolvimento ao longo do tempo</li>
        <li>Avaliação Específica: Focada em áreas particulares de desenvolvimento</li>
      </ul>
      
      <h3>Realizando uma Avaliação</h3>
      <p>Para realizar uma avaliação:</p>
      <ol>
        <li>Acesse a seção "Avaliações"</li>
        <li>Selecione "Nova Avaliação"</li>
        <li>Escolha o aluno e o tipo de avaliação</li>
        <li>Preencha os diferentes domínios de desenvolvimento</li>
        <li>Finalize e salve a avaliação</li>
      </ol>
      
      <h3>Interpretando os Resultados</h3>
      <p>Os resultados são apresentados em formato visual com gráficos e tabelas, facilitando a identificação de áreas fortes e que necessitam desenvolvimento.</p>
    `,
    relatedVideos: ['assessments']
  },
  {
    id: 'reports',
    title: 'Relatórios',
    icon: FileText,
    content: `
      <h2>Geração de Relatórios</h2>
      <p>O Smart PEI permite a criação de diversos tipos de relatórios para acompanhar o desenvolvimento do aluno e comunicar seu progresso.</p>
      
      <h3>Tipos de Relatórios</h3>
      <ul>
        <li>Relatório de Progresso: Mostra o desenvolvimento ao longo do tempo</li>
        <li>Relatório de Avaliação: Detalha os resultados de uma avaliação específica</li>
        <li>Relatório do PEI: Resume os objetivos e estratégias do plano</li>
        <li>Relatório Completo: Integra todas as informações em um documento abrangente</li>
      </ul>
      
      <h3>Gerando um Relatório</h3>
      <ol>
        <li>Acesse a seção "Relatórios"</li>
        <li>Clique em "Novo Relatório"</li>
        <li>Selecione o tipo de relatório e o aluno</li>
        <li>Configure as opções de conteúdo</li>
        <li>Gere e visualize o relatório</li>
      </ol>
      
      <h3>Compartilhando Relatórios</h3>
      <p>Os relatórios podem ser compartilhados via email, exportados como PDF ou impressos diretamente do sistema.</p>
    `,
    relatedVideos: ['reports']
  },
  {
    id: 'team-management',
    title: 'Equipes',
    icon: Users,
    content: `
      <h2>Gerenciamento de Equipes</h2>
      <p>O Smart PEI permite criar equipes multidisciplinares para colaborar no desenvolvimento e implementação dos PEIs.</p>
      
      <h3>Estrutura da Equipe</h3>
      <p>Uma equipe típica pode incluir:</p>
      <ul>
        <li>Coordenador: Responsável por supervisionar o processo</li>
        <li>Professores: Educadores que trabalham diretamente com o aluno</li>
        <li>Especialistas: Profissionais como psicólogos, terapeutas e outros</li>
        <li>Responsáveis: Pais ou tutores do aluno</li>
      </ul>
      
      <h3>Criando uma Equipe</h3>
      <ol>
        <li>Acesse "Gerenciamento de Equipes"</li>
        <li>Clique em "Nova Equipe"</li>
        <li>Adicione o coordenador e os membros</li>
        <li>Defina os papéis e permissões</li>
        <li>Vincule a equipe ao aluno correspondente</li>
      </ol>
      
      <h3>Comunicação</h3>
      <p>O sistema inclui ferramentas de comunicação para facilitar a troca de informações entre os membros da equipe.</p>
    `,
    relatedVideos: []
  },
  {
    id: 'settings',
    title: 'Configurações',
    icon: Settings,
    content: `
      <h2>Configurações do Sistema</h2>
      <p>O Smart PEI oferece várias opções de configuração para personalizar sua experiência.</p>
      
      <h3>Configurações de Conta</h3>
      <p>Gerencie suas informações pessoais, credenciais de acesso e preferências de notificação.</p>
      
      <h3>Configurações de Exibição</h3>
      <p>Personalize a aparência do sistema, incluindo tema, tamanho de fonte e layout.</p>
      
      <h3>Configurações de Acessibilidade</h3>
      <p>Ajuste as opções de acessibilidade para atender às suas necessidades específicas, como contraste alto, leitor de tela etc.</p>
      
      <h3>Configurações de Notificação</h3>
      <p>Defina quais notificações você deseja receber e como (email, sistema, etc.).</p>
    `,
    relatedVideos: []
  },
  {
    id: 'ai-features',
    title: 'Recursos de IA',
    icon: BrainCircuit,
    content: `
      <h2>Recursos de Inteligência Artificial</h2>
      <p>O Smart PEI incorpora tecnologias avançadas de IA para aprimorar as funcionalidades do sistema.</p>
      
      <h3>Sugestões de Objetivos</h3>
      <p>A IA analisa os resultados das avaliações e sugere objetivos educacionais adequados.</p>
      
      <h3>Análise de Progresso</h3>
      <p>Algoritmos inteligentes identificam padrões e tendências no progresso do aluno ao longo do tempo.</p>
      
      <h3>Geração de Estratégias</h3>
      <p>Com base nos objetivos definidos, a IA sugere estratégias pedagógicas baseadas em evidências.</p>
      
      <h3>Personalização de Relatórios</h3>
      <p>Os relatórios são personalizados automaticamente com base no perfil do aluno e nas preferências do usuário.</p>
    `,
    relatedVideos: []
  },
  {
    id: 'glossary',
    title: 'Glossário',
    icon: BookOpen,
    content: `
      <h2>Glossário de Termos</h2>
      <p>Este glossário fornece definições dos principais termos usados no Smart PEI.</p>
      
      <h3>PEI (Plano de Ensino Individualizado)</h3>
      <p>Documento que descreve o programa educacional personalizado para atender às necessidades específicas de um estudante.</p>
      
      <h3>Domínios de Desenvolvimento</h3>
      <p>Áreas específicas do desenvolvimento humano avaliadas no sistema, como cognitivo, motor, social etc.</p>
      
      <h3>Objetivos SMART</h3>
      <p>Objetivos Específicos, Mensuráveis, Alcançáveis, Relevantes e com Tempo determinado.</p>
      
      <h3>Adaptação Curricular</h3>
      <p>Modificações feitas no currículo regular para atender às necessidades específicas do aluno.</p>
      
      <h3>Intervenção Precoce</h3>
      <p>Conjunto de serviços para crianças pequenas com atrasos ou riscos de desenvolvimento.</p>
    `,
    relatedVideos: []
  },
  {
    id: 'faq',
    title: 'Perguntas Frequentes',
    icon: HelpCircle,
    content: `
      <h2>Perguntas Frequentes</h2>
      
      <h3>Como criar um novo PEI?</h3>
      <p>Para criar um novo PEI, acesse a página do aluno e clique no botão "Novo PEI". Siga as etapas do assistente para definir objetivos, estratégias e recursos.</p>
      
      <h3>Como compartilhar um relatório?</h3>
      <p>Após gerar um relatório, você pode compartilhá-lo através do botão "Compartilhar" disponível na visualização do relatório. É possível compartilhar via email ou gerar um link de acesso.</p>
      
      <h3>Como adicionar membros à equipe?</h3>
      <p>Na seção de "Equipes", selecione a equipe desejada e clique em "Adicionar Membro". Preencha as informações de contato e defina o papel do novo membro.</p>
      
      <h3>Como interpretar os gráficos de progresso?</h3>
      <p>Os gráficos mostram a evolução do aluno ao longo do tempo em diferentes domínios. As barras ou linhas ascendentes indicam melhora, enquanto linhas estáveis ou descendentes podem indicar áreas que necessitam atenção.</p>
    `,
    relatedVideos: []
  },
  {
    id: 'troubleshooting',
    title: 'Solução de Problemas',
    icon: AlertTriangle,
    content: `
      <h2>Solução de Problemas</h2>
      <p>Esta seção ajuda a resolver problemas comuns que você pode encontrar ao usar o Smart PEI.</p>
      
      <h3>Problemas de Acesso</h3>
      <p>Se você não conseguir fazer login:</p>
      <ul>
        <li>Verifique se suas credenciais estão corretas</li>
        <li>Use a opção "Esqueci minha senha" para redefinir sua senha</li>
        <li>Certifique-se de que sua conta foi ativada</li>
        <li>Verifique sua conexão com a internet</li>
      </ul>
      
      <h3>Problemas ao Gerar Relatórios</h3>
      <p>Se você encontrar problemas ao gerar relatórios:</p>
      <ul>
        <li>Verifique se todas as informações necessárias foram preenchidas</li>
        <li>Tente limpar o cache do navegador e tentar novamente</li>
        <li>Reduza a quantidade de dados selecionados se o relatório for muito grande</li>
      </ul>
      
      <h3>Dados Não Salvos</h3>
      <p>Se suas informações não estiverem sendo salvas:</p>
      <ul>
        <li>Verifique sua conexão com a internet</li>
        <li>Certifique-se de clicar no botão "Salvar" após fazer alterações</li>
        <li>Confira se você tem permissões para editar o conteúdo específico</li>
      </ul>
      
      <h3>Como Obter Ajuda Adicional</h3>
      <p>Se você não conseguir resolver seu problema, entre em contato com nosso suporte técnico através da seção "Suporte" ou pelo email suporte@smartpei.com.br.</p>
    `,
    relatedVideos: []
  }
];
