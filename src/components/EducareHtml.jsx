import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Contrast,
  Type,
  TrendingUp,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Users,
  ListChecks,
  Smartphone,
  Bot,
  ArrowUp,
  MessageCircle,
  Mail,
  Monitor,
  BookOpen,
  Brain,
  Activity
} from 'lucide-react';

import { initAccessibilitySettings, toggleContrast, increaseFontSize, decreaseFontSize } from '../utils/accessibility.js';
import { initScrollAnimations, initBackToTop } from '../utils/animations.js';
import { initMobileMenu, initSmoothScrolling } from '../utils/navigation.js';

const EducareHtml = () => {
  useEffect(() => {
    initAccessibilitySettings();
    initScrollAnimations();
    initBackToTop();
    initMobileMenu();
    initSmoothScrolling();
    
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    return () => {
      if (backToTopButton) {
        backToTopButton.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <div className="educare-html-wrapper">
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>

      <header className="main-header" role="banner">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Educare+</span>
            </div>
            
            <nav className="main-nav" role="navigation" aria-label="Menu principal">
              <button className="menu-toggle" aria-expanded="false" aria-controls="main-menu">
                <span className="sr-only">Menu</span>
                <Menu size={24} />
              </button>
              
              <ul id="main-menu" className="nav-menu">
                <li><a href="#inicio">Início</a></li>
                <li><a href="#solucoes">Nossas Soluções</a></li>
                <li><a href="#educare-app">Educare+ App</a></li>
                <li><a href="#smart-pei">Educare+ Smart PEI</a></li>
                <li><a href="#robotica">Educare+ Robótica</a></li>
                <li><a href="#contato" className="btn-outline-sm">Contato</a></li>
              </ul>
            </nav>
            
            <div className="accessibility-controls">
              <button id="contrast-toggle" aria-label="Alternar alto contraste" title="Alternar alto contraste" onClick={toggleContrast}>
                <Contrast size={20} />
              </button>
              <button id="font-increase" aria-label="Aumentar fonte" title="Aumentar fonte" onClick={increaseFontSize}>
                <Type size={20} />
              </button>
              <button id="font-decrease" aria-label="Diminuir fonte" title="Diminuir fonte" onClick={decreaseFontSize}>
                <Type size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="hero-section" aria-labelledby="hero-heading" id="inicio">
        <div className="container">
          <div className="hero-content">
            <h1 id="hero-heading">Educare+</h1>
            <p className="lead">Soluções integradas para desenvolvimento infantil, educação inclusiva e preparação para o futuro. Transformando vidas desde a primeira infância.</p>
            <div className="cta-buttons">
              <a href="#solucoes" className="btn btn-primary">Descobrir Soluções</a>
              <a href="#contato" className="btn btn-secondary">Fale Conosco</a>
            </div>
          </div>
          <div className="hero-image">
            <div style={{ width: 500, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))', borderRadius: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(147,51,234,0.15))', top: 20, right: 40 }} />
              <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(147,51,234,0.1), rgba(59,130,246,0.1))', bottom: 30, left: 50 }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <Brain size={48} style={{ color: '#3b82f6' }} />
                  <BookOpen size={48} style={{ color: '#7c3aed' }} />
                  <Activity size={48} style={{ color: '#9333ea' }} />
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, background: 'linear-gradient(135deg, #3b82f6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Desenvolvimento & Educação</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main id="main-content">
        <section id="solucoes" className="section bg-light" aria-labelledby="solucoes-heading">
          <div className="container">
            <h2 id="solucoes-heading" className="section-heading">Nossas Soluções</h2>
            <p className="section-description">A Educare+ oferece três soluções integradas proporcionando uma experiência completa para o desenvolvimento infantil e educação inclusiva.</p>
            
            <div className="solutions-grid">
              <div className="solution-card" data-aos="fade-up">
                <div className="card-icon app-icon">
                  <Smartphone size={32} />
                </div>
                <h3>Educare+ App</h3>
                <p>Plataforma para rastreamento do desenvolvimento infantil desde a gestação até os cinco anos, com avaliações interativas e conteúdo personalizado.</p>
                <a href="#educare-app" className="btn-outline">Saiba mais</a>
              </div>
              
              <div className="solution-card" data-aos="fade-up" data-aos-delay="100">
                <div className="card-icon pei-icon">
                  <FileText size={32} />
                </div>
                <h3>Educare+ Smart PEI</h3>
                <p>Ferramenta para a criação e gestão de Planos Educacionais Individualizados, com foco na educação inclusiva e no acompanhamento personalizado.</p>
                <a href="#smart-pei" className="btn-outline">Saiba mais</a>
              </div>
              
              <div className="solution-card" data-aos="fade-up" data-aos-delay="200">
                <div className="card-icon robotics-icon">
                  <Bot size={32} />
                </div>
                <h3>Educare+ Robótica</h3>
                <p>Programa de robótica e automação para crianças e adolescentes, incluindo metodologia adaptada para alunos com TEA e outras condições.</p>
                <a href="#robotica" className="btn-outline">Saiba mais</a>
              </div>
            </div>
          </div>
        </section>

        <section id="educare-app" className="section" aria-labelledby="app-heading">
          <div className="container">
            <div className="section-content reverse">
              <div className="text-content" data-aos="fade-right">
                <h2 id="app-heading" className="section-heading text-left">Educare+ App</h2>
                <p>O Educare+ App é uma plataforma inovadora de saúde e educação infantil, que oferece um guia completo para acompanhar e registrar os marcos do desenvolvimento, desde a gestação até os cinco anos.</p>
                
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <TrendingUp size={24} />
                    </div>
                    <div className="feature-text">
                      <h4>Rastreio Eficiente</h4>
                      <p>Identificação precoce de possíveis atrasos no desenvolvimento.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <GraduationCap size={24} />
                    </div>
                    <div className="feature-text">
                      <h4>Conteúdo Especializado</h4>
                      <p>Material educativo e orientações personalizadas.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <ClipboardCheck size={24} />
                    </div>
                    <div className="feature-text">
                      <h4>Avaliações Interativas</h4>
                      <p>Quizzes e questionários para acompanhamento contínuo.</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/educare-app/auth?action=register" className="btn btn-primary mt-lg">Começar Agora</Link>
              </div>
              
              <div className="image-content" data-aos="fade-left">
                <div style={{ width: 500, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(147,51,234,0.08))', borderRadius: '1.5rem', border: '1px solid rgba(59,130,246,0.15)' }} className="rounded-image">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: 120, height: 200, borderRadius: '1rem', background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 20px 40px rgba(59,130,246,0.2)' }}>
                      <Smartphone size={36} style={{ color: 'white' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%' }}>
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.4)', width: '100%' }} />
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', width: '75%' }} />
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', width: '50%' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>Interface do Educare+ App</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="smart-pei" className="section bg-light" aria-labelledby="pei-heading">
          <div className="container">
            <div className="section-content">
              <div className="image-content" data-aos="fade-right">
                <div style={{ width: 500, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(147,51,234,0.08), rgba(59,130,246,0.08))', borderRadius: '1.5rem', border: '1px solid rgba(147,51,234,0.15)' }} className="rounded-image">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: 280, height: 180, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 20px 40px rgba(147,51,234,0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Monitor size={20} style={{ color: 'white' }} />
                        <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>Smart PEI</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.3)', width: '100%' }} />
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.25)', width: '85%' }} />
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.2)', width: '70%' }} />
                        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)', width: '60%' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <div style={{ flex: 1, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
                        <div style={{ flex: 1, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>Interface do Smart PEI</span>
                  </div>
                </div>
              </div>
              
              <div className="text-content" data-aos="fade-left">
                <h2 id="pei-heading" className="section-heading text-left">Educare+ Smart PEI</h2>
                <p>Ferramenta completa para a criação e gestão de Planos Educacionais Individualizados (PEI), auxiliando educadores e famílias no desenvolvimento de estratégias personalizadas para cada aluno.</p>
                
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FileText size={24} />
                    </div>
                    <div className="feature-text">
                      <h4>Geração Automatizada</h4>
                      <p>Criação de planos educacionais baseados em avaliações detalhadas.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <Users size={24} />
                    </div>
                    <div className="feature-text">
                      <h4>Abordagem Colaborativa</h4>
                      <p>Integração entre professores, especialistas e familiares.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <ListChecks size={24} />
                    </div>
                    <div className="feature-text">
                      <h4>Acompanhamento Contínuo</h4>
                      <p>Monitoramento de progresso e ajustes das estratégias em tempo real.</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/smart-pei/app/dashboard" className="btn btn-primary mt-lg">Acessar Smart PEI</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="section cta-section" aria-labelledby="contato-heading">
          <div className="container">
            <h2 id="contato-heading" className="section-heading light-text">Entre em Contato</h2>
            <p className="section-description light-text">Estamos prontos para responder suas dúvidas e ajudar você a iniciar essa jornada educacional.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '2rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                <a href="https://wa.me/5598991628206" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.15)', borderRadius: '0.75rem', color: 'white', textDecoration: 'none', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.3s' }}>
                  <MessageCircle size={24} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Fale pelo WhatsApp</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.15)', borderRadius: '0.75rem', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Mail size={24} />
                  <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>contato@educareapp.com.br</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="main-footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Educare+</span>
              <p>Transformando educação e desenvolvimento infantil.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h3>Plataformas</h3>
                <ul>
                  <li><a href="#educare-app">Educare+ App</a></li>
                  <li><a href="#smart-pei">Educare+ Smart PEI</a></li>
                  <li><a href="#robotica">Educare+ Robótica</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h3>Suporte</h3>
                <ul>
                  <li><a href="#contato">FAQ</a></li>
                  <li><a href="#contato">Contato</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Educare+ | Todos os direitos reservados</p>
            <div className="accessibility-statement">
              <span>Declaração de Acessibilidade</span>
            </div>
          </div>
        </div>
      </footer>

      <button id="back-to-top" className="back-to-top" aria-label="Voltar ao topo">
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default EducareHtml;
