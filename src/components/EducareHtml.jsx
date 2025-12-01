
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import our utilities
import { initAccessibilitySettings, toggleContrast, increaseFontSize, decreaseFontSize } from '../utils/accessibility.js';
import { initScrollAnimations, initBackToTop } from '../utils/animations.js';
import { initMobileMenu, initSmoothScrolling } from '../utils/navigation.js';

const EducareHtml = () => {
  useEffect(() => {
    // Initialize all the JavaScript functionality
    initAccessibilitySettings();
    initScrollAnimations();
    initBackToTop();
    initMobileMenu();
    initSmoothScrolling();
    
    // Add event listener for back to top button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    // Cleanup function
    return () => {
      if (backToTopButton) {
        backToTopButton.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <div className="educare-html-wrapper">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>

      {/* Header */}
      <header className="main-header" role="banner">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/images/educare-logo.svg" alt="Educare+ Logo" width="180" height="60" />
            </div>
            
            <nav className="main-nav" role="navigation" aria-label="Menu principal">
              <button className="menu-toggle" aria-expanded="false" aria-controls="main-menu">
                <span className="sr-only">Menu</span>
                <i className="fas fa-bars" aria-hidden="true"></i>
              </button>
              
              <ul id="main-menu" className="nav-menu">
                <li><a href="#inicio">Início</a></li>
                <li><a href="#solucoes">Nossas Soluções</a></li>
                <li><a href="#educare-app">Educare+ App</a></li>
                <li><a href="#smart-pei">Educare+ Smart PEI</a></li>
                <li><a href="#robotica">Educare+ Robótica</a></li>
                <li><a href="#cursos">Cursos</a></li>
                <li><a href="#loja">Loja</a></li>
                <li><a href="#contato" className="btn-outline-sm">Contato</a></li>
              </ul>
            </nav>
            
            <div className="accessibility-controls">
              <button id="contrast-toggle" aria-label="Alternar alto contraste" title="Alternar alto contraste" onClick={toggleContrast}>
                <i className="fas fa-adjust" aria-hidden="true"></i>
              </button>
              <button id="font-increase" aria-label="Aumentar fonte" title="Aumentar fonte" onClick={increaseFontSize}>
                <i className="fas fa-text-height" aria-hidden="true"></i>
              </button>
              <button id="font-decrease" aria-label="Diminuir fonte" title="Diminuir fonte" onClick={decreaseFontSize}>
                <i className="fas fa-text-height fa-rotate-180" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
            <img src="/images/hero-astronaut.svg" alt="Astronauta Educare+" width="500" height="350" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content">
        {/* Solutions Overview Section */}
        <section id="solucoes" className="section bg-light" aria-labelledby="solucoes-heading">
          <div className="container">
            <h2 id="solucoes-heading" className="section-heading">Nossas Soluções</h2>
            <p className="section-description">A Educare+ oferece três soluções integradas proporcionando uma experiência completa para o desenvolvimento infantil e educação inclusiva.</p>
            
            <div className="solutions-grid">
              <div className="solution-card" data-aos="fade-up">
                <div className="card-icon app-icon">
                  <i className="fas fa-mobile-alt" aria-hidden="true"></i>
                </div>
                <h3>Educare+ App</h3>
                <p>Plataforma para rastreamento do desenvolvimento infantil desde a gestação até os cinco anos, com avaliações interativas e conteúdo personalizado.</p>
                <a href="#educare-app" className="btn-outline">Saiba mais</a>
              </div>
              
              <div className="solution-card" data-aos="fade-up" data-aos-delay="100">
                <div className="card-icon pei-icon">
                  <i className="fas fa-file-alt" aria-hidden="true"></i>
                </div>
                <h3>Educare+ Smart PEI</h3>
                <p>Ferramenta para a criação e gestão de Planos Educacionais Individualizados, com foco na educação inclusiva e no acompanhamento personalizado.</p>
                <a href="#smart-pei" className="btn-outline">Saiba mais</a>
              </div>
              
              <div className="solution-card" data-aos="fade-up" data-aos-delay="200">
                <div className="card-icon robotics-icon">
                  <i className="fas fa-robot" aria-hidden="true"></i>
                </div>
                <h3>Educare+ Robótica</h3>
                <p>Programa de robótica e automação para crianças e adolescentes, incluindo metodologia adaptada para alunos com TEA e outras condições.</p>
                <a href="#robotica" className="btn-outline">Saiba mais</a>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Section - Educare App */}
        <section id="educare-app" className="section" aria-labelledby="app-heading">
          <div className="container">
            <div className="section-content reverse">
              <div className="text-content" data-aos="fade-right">
                <h2 id="app-heading" className="section-heading text-left">Educare+ App</h2>
                <p>O Educare+ App é uma plataforma inovadora de saúde e educação infantil, que oferece um guia completo para acompanhar e registrar os marcos do desenvolvimento, desde a gestação até os cinco anos.</p>
                
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-chart-line" aria-hidden="true"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Rastreio Eficiente</h4>
                      <p>Identificação precoce de possíveis atrasos no desenvolvimento.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-user-graduate" aria-hidden="true"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Conteúdo Especializado</h4>
                      <p>Material educativo e orientações personalizadas.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-clipboard-check" aria-hidden="true"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Avaliações Interativas</h4>
                      <p>Quizzes e questionários para acompanhamento contínuo.</p>
                    </div>
                  </div>
                </div>
                
                <a href="#" className="btn btn-primary mt-lg">Conhecer a Jornada Educare+</a>
              </div>
              
              <div className="image-content" data-aos="fade-left">
                <img src="/images/app-device.webp" alt="Interface do Educare App em um smartphone" className="rounded-image" width="500" height="400" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Smart PEI Section */}
        <section id="smart-pei" className="section bg-light" aria-labelledby="pei-heading">
          <div className="container">
            <div className="section-content">
              <div className="image-content" data-aos="fade-right">
                <img src="/images/smart-pei-interface.webp" alt="Interface do sistema Smart PEI mostrando um plano educacional" className="rounded-image" width="500" height="400" loading="lazy" />
              </div>
              
              <div className="text-content" data-aos="fade-left">
                <h2 id="pei-heading" className="section-heading text-left">Educare+ Smart PEI</h2>
                <p>Ferramenta completa para a criação e gestão de Planos Educacionais Individualizados (PEI), auxiliando educadores e famílias no desenvolvimento de estratégias personalizadas para cada aluno.</p>
                
                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-file-signature" aria-hidden="true"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Geração Automatizada</h4>
                      <p>Criação de planos educacionais baseados em avaliações detalhadas.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-users" aria-hidden="true"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Abordagem Colaborativa</h4>
                      <p>Integração entre professores, especialistas e familiares.</p>
                    </div>
                  </div>
                  
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-tasks" aria-hidden="true"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Acompanhamento Contínuo</h4>
                      <p>Monitoramento de progresso e ajustes das estratégias em tempo real.</p>
                    </div>
                  </div>
                </div>
                
                <a href="#" className="btn btn-primary mt-lg">Explorar Smart PEI</a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer section will be partially shown for brevity */}
        <section id="contato" className="section cta-section" aria-labelledby="contato-heading">
          <div className="container">
            <h2 id="contato-heading" className="section-heading light-text">Entre em Contato</h2>
            <p className="section-description light-text">Estamos prontos para responder suas dúvidas e ajudar você a iniciar essa jornada educacional.</p>
            
            {/* Form would go here in the complete implementation */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="main-footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/images/educare-logo.svg" alt="Educare+ Logo" width="150" height="50" />
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
                  <li><a href="#">FAQ</a></li>
                  <li><a href="#contato">Contato</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Educare+ | Todos os direitos reservados</p>
            <div className="accessibility-statement">
              <a href="#">Declaração de Acessibilidade</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button id="back-to-top" className="back-to-top" aria-label="Voltar ao topo">
        <i className="fas fa-arrow-up" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default EducareHtml;
