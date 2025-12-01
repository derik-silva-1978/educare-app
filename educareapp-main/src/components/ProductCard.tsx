
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  badge?: string;
  app: string;
  color: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <div className="h-48 overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
        
        <div className="absolute top-0 left-0 m-2">
          {product.badge && (
            <Badge variant="secondary" className="font-medium bg-background/90 backdrop-blur-sm">
              {product.badge}
            </Badge>
          )}
        </div>
        
        <div className={`absolute top-0 right-0 ${product.color} text-white text-xs font-medium px-3 py-1 m-2 rounded-full`}>
          {product.app}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{product.title}</CardTitle>
        <div className="text-primary font-semibold mt-1">
          {product.price}
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="line-clamp-3">
          {product.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button size="sm" variant="outline" className="w-full mr-2">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
        <Button asChild size="sm" className="w-full">
          <Link to="/auth?action=store">
            Comprar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
