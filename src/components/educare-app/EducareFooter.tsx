
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MessageSquare, Heart } from 'lucide-react';

const EducareFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-6 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 relative mr-2">
                <img 
                  src="/images/astronaut-logo.svg" 
                  alt="Educare Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/80/91D8F7/ffffff?text=E%2B";
                  }}
                />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-pink-400 bg-clip-text text-transparent">
                Educare
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              Plataforma inteligente para acompanhamento do desenvolvimento infantil, conectando pais e profissionais.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors" aria-label="WhatsApp">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links sections */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li><Link to="/educare-app" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Início</Link></li>
              <li><Link to="/educare-app/features" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Funcionalidades</Link></li>
              <li><Link to="/educare-app/pricing" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Planos</Link></li>
              <li><Link to="/educare-app/studies" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Estudos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><Link to="/educare-app/support" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/educare-app/contact" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Contato</Link></li>
              <li><Link to="/educare-app/faq" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/educare-app/professionals" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Para Profissionais</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/educare-app/privacy" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/educare-app/terms" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Termos de Uso</Link></li>
              <li><Link to="/educare-app/cookies" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter subscription */}
        <div className="border-t border-gray-200 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Educare. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex items-center">
                Feito com <Heart className="h-3 w-3 mx-1 text-red-400" /> para famílias e educadores
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EducareFooter;
