
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface AppNavLinksProps {
  appType?: 'educare-app';
}

const AppNavLinks: React.FC<AppNavLinksProps> = ({ appType = 'educare-app' }) => {
  const location = useLocation();
  
  // Define new navigation structure
  const links = [
    { name: 'Início', href: '/' },
    { name: 'Meu App', href: '/educare-app/dashboard' },
    { name: 'Aprendizado', href: '/educare-app/aprendizado' },
    { name: 'Loja Educare+', href: '/educare-app/store' },
  ];
  
  return (
    <div className="hidden md:flex items-center space-x-8">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            location.pathname === link.href ? 'text-primary' : 'text-gray-700'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default AppNavLinks;
