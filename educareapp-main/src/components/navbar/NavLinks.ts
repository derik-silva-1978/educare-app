
// Define the NavLink interface that matches what is expected by components
export type NavLink = {
  label: string;
  href: string;
  badge?: string;
};

// Interface for main navigation links with additional properties
interface MainNavLink {
  to: string;
  text: string;
  icon: any;
  exact?: boolean;
}

// Interface for solutions navigation links
interface SolutionNavLink {
  to: string;
  text: string;
  description: string;
}

// Main navigation links used in the navbar
export const mainNavLinks: MainNavLink[] = [
  {
    to: "/",
    text: "Início",
    icon: null,
    exact: true
  },
  {
    to: "/solutions",
    text: "Soluções",
    icon: null
  },
  {
    to: "/courses",
    text: "Cursos",
    icon: null
  },
  {
    to: "/store",
    text: "Loja",
    icon: null
  },
  {
    to: "/#pricing",
    text: "Preços",
    icon: null
  },
  {
    to: "/#about",
    text: "Sobre",
    icon: null
  },
];

// Solutions navigation links used in the dropdown menu
export const solutionsNavLinks: SolutionNavLink[] = [
  {
    to: "/smart-pei",
    text: "Smart PEI",
    description: "Sistema inteligente para Planos de Ensino Individualizado"
  },
  {
    to: "/educare-app",
    text: "Educare App",
    description: "Aplicativo para acompanhamento do desenvolvimento infantil"
  },
  {
    to: "/educare-tech",
    text: "Educare+ Tech",
    description: "Soluções tecnológicas para educação inclusiva"
  },
  {
    to: "/courses",
    text: "Cursos",
    description: "Formação continuada para profissionais da educação"
  },
  {
    to: "/store",
    text: "Loja",
    description: "Produtos educacionais e recursos pedagógicos"
  },
];

// Helper function to convert MainNavLink to NavLink
export function convertMainNavLinksToNavLinks(links: MainNavLink[]): NavLink[] {
  return links.map(link => ({
    label: link.text,
    href: link.to,
  }));
}

// Helper function to convert SolutionNavLink to NavLink
export function convertSolutionNavLinksToNavLinks(links: SolutionNavLink[]): NavLink[] {
  return links.map(link => ({
    label: link.text,
    href: link.to,
  }));
}
