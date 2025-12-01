
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';

interface StoreProductCardProps {
  product: Product;
}

const StoreProductCard: React.FC<StoreProductCardProps> = ({ product }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
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
        <div className="flex items-center justify-between mt-1">
          <div className="text-primary font-semibold">
            {product.price}
          </div>
          {product.rating && (
            <div className="flex items-center text-yellow-500">
              <Star className="fill-yellow-500 h-4 w-4 mr-1" />
              <span className="text-sm">{product.rating}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">
          {product.description}
        </CardDescription>
        
        {product.stock && (
          <div className="mt-4 flex items-center text-sm">
            <Package className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-700 font-medium">{product.stock}</span>
          </div>
        )}
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

export default StoreProductCard;
