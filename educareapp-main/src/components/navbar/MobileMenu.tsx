
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavLink } from './NavLinks';

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  solutionsLinks: NavLink[];
  isActive: (path: string) => boolean;
  loginUrl: string;
  registerUrl: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  solutionsLinks,
  isActive,
  loginUrl,
  registerUrl
}) => {
  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        when: 'beforeChildren'
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        when: 'afterChildren',
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  // Render the mobile menu
  return (
    <motion.div
      key="mobile-menu"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
      className="md:hidden overflow-hidden"
    >
      <div className="px-4 pb-4 pt-2 space-y-1 border-t bg-white shadow-lg">
        {/* Main navigation links */}
        {navLinks.map((link) => 
          link.href === '/solutions' ? (
            <Fragment key="solutions">
              <motion.div variants={itemVariants}>
                <p className="px-3 py-2 text-gray-500 font-medium text-sm">
                  Soluções
                </p>
              </motion.div>
              
              {/* Solutions submenu */}
              <div className="pl-4 border-l-2 border-gray-100 space-y-1 mb-2">
                {solutionsLinks.map((solution) => (
                  <motion.div key={solution.href} variants={itemVariants}>
                    <Link
                      to={solution.href}
                      className={`block px-3 py-2 text-sm rounded-md ${
                        isActive(solution.href)
                          ? 'bg-educare-50 text-educare-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {solution.label}
                      {solution.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-educare-100 text-educare-800">
                          {solution.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Fragment>
          ) : (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                to={link.href}
                className={`block px-3 py-2 text-sm rounded-md ${
                  isActive(link.href)
                    ? 'bg-educare-50 text-educare-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-educare-100 text-educare-800">
                    {link.badge}
                  </span>
                )}
              </Link>
            </motion.div>
          )
        )}
        
        {/* Authentication links */}
        <div className="pt-2 border-t border-gray-100">
          <motion.div variants={itemVariants}>
            <Link
              to={loginUrl}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Entrar
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              to={registerUrl}
              className="block px-3 py-2 text-sm bg-educare-600 text-white hover:bg-educare-700 rounded-md mt-2"
            >
              Cadastrar
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
