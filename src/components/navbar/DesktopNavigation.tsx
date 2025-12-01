
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { NavLink } from './NavLinks';

interface DesktopNavigationProps {
  mainNavLinks: NavLink[];
  solutionsNavLinks: NavLink[];
  isActive: (path: string) => boolean;
}

const DesktopNavigation = ({
  mainNavLinks,
  solutionsNavLinks,
  isActive,
}: DesktopNavigationProps) => {
  const [hoveredSolution, setHoveredSolution] = useState(false);

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {mainNavLinks.map((link) =>
        link.href === '/solutions' ? (
          <div
            key={link.href}
            className="relative"
            onMouseEnter={() => setHoveredSolution(true)}
            onMouseLeave={() => setHoveredSolution(false)}
          >
            <button
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive('/solutions')
                  ? 'text-educare-700 font-medium'
                  : 'text-gray-700 hover:text-educare-600'
              }`}
            >
              Soluções
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                hoveredSolution ? 'rotate-180' : ''
              }`} />
            </button>

            <AnimatePresence>
              {hoveredSolution && (
                <motion.div
                  className="absolute left-0 mt-1 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-1">
                    {solutionsNavLinks.map((solution) => (
                      <Link
                        key={solution.href}
                        to={solution.href}
                        className={`flex items-center justify-between px-4 py-2 text-sm ${
                          isActive(solution.href)
                            ? 'bg-educare-50 text-educare-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-educare-600'
                        }`}
                      >
                        {solution.label}
                        {solution.badge && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-educare-100 text-educare-800">
                            {solution.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive(link.href)
                ? 'text-educare-700 font-medium'
                : 'text-gray-700 hover:text-educare-600'
            }`}
          >
            <span>{link.label}</span>
            {link.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-educare-100 text-educare-800">
                {link.badge}
              </span>
            )}
          </Link>
        )
      )}
    </nav>
  );
};

export default DesktopNavigation;
