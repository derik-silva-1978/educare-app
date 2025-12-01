
import { Product } from '@/types/product';
import { kitProducts } from './kits';
import { softwareProducts } from './software';
import { hardwareProducts } from './hardware';
import { subscriptionProducts } from './subscriptions';
import { souvenirProducts } from './souvenirs';

// Export all products as a single array
export const products: Product[] = [
  ...kitProducts,
  ...softwareProducts,
  ...hardwareProducts,
  ...subscriptionProducts,
  ...souvenirProducts
];

// Store categories
export const productCategories = [
  { id: "all", label: "Todos os Produtos" },
  { id: "kits", label: "Kits Educacionais" },
  { id: "software", label: "Software" },
  { id: "hardware", label: "Hardware" },
  { id: "subscription", label: "Assinaturas" },
  { id: "souvenirs", label: "Lembrancinhas" }
];
