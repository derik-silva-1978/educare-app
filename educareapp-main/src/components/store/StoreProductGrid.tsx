
import React from 'react';
import StoreProductCard from './StoreProductCard';
import { Product } from '@/types/product';

interface StoreProductGridProps {
  products: Product[];
}

const StoreProductGrid: React.FC<StoreProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <StoreProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default StoreProductGrid;
