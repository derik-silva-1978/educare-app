
import { Link } from 'react-router-dom';

const BrandLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2"
      aria-label="Educare+ Logo"
    >
      <div className="w-10 h-10 relative">
        <img 
          src="/images/astronaut-logo.svg" 
          alt="Educare+ Astronaut Logo" 
          className="w-full h-full object-contain"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
        />
      </div>
      <span className="font-display font-bold text-xl md:text-2xl bg-gradient-to-r from-educare-600 to-educare-400 bg-clip-text text-transparent">
        Educare+
      </span>
    </Link>
  );
};

export default BrandLogo;
