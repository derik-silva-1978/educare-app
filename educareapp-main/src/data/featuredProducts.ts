
import { Product } from '@/components/ProductCard';
import { products } from './products';

// Select specific featured products by ID
const productIds = [1, 8, 13]; // IDs of the products we want to feature
export const featuredProducts: Product[] = products
  .filter(product => productIds.includes(product.id))
  .map(({ id, title, description, price, imageUrl, badge, app, color }) => ({
    id,
    title, 
    description,
    price,
    imageUrl,
    badge,
    app,
    color
  }));
