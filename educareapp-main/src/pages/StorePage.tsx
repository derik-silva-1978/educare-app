
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StoreHeader from '@/components/store/StoreHeader';
import StoreCategoryTabs from '@/components/store/StoreCategoryTabs';
import StoreProductGrid from '@/components/store/StoreProductGrid';
import StoreFeaturedCategories from '@/components/store/StoreFeaturedCategories';
import StoreCallToAction from '@/components/store/StoreCallToAction';
import { products, productCategories } from '@/data/products';
import { useLocation } from 'react-router-dom';

const StorePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const location = useLocation();
  
  // Extract product query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productParam = params.get('product');
    
    if (productParam === 'titibot-turbo') {
      setActiveCategory('subscription');
      setSearchQuery('Titibot Turbo');
    }
  }, [location.search]);
  
  // Filter products based on active category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") {
      return parseFloat(a.price.replace("R$ ", "").replace(".", "").replace(",", ".")) - 
             parseFloat(b.price.replace("R$ ", "").replace(".", "").replace(",", "."));
    } else if (sortOption === "price-desc") {
      return parseFloat(b.price.replace("R$ ", "").replace(".", "").replace(",", ".")) - 
             parseFloat(a.price.replace("R$ ", "").replace(".", "").replace(",", "."));
    } else if (sortOption === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    // Default: featured
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Loja Educare+ | Produtos e Assinaturas</title>
        <meta name="description" content="Adquira produtos, kits educacionais e assinaturas das soluções Educare+ para educação inclusiva e desenvolvimento infantil." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header Section */}
        <StoreHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Store Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Category Tabs and Sort */}
            <StoreCategoryTabs 
              categories={productCategories}
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory}
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            
            {/* Product Grid */}
            <StoreProductGrid products={sortedProducts} />
            
            {/* Featured Categories */}
            <StoreFeaturedCategories />
            
            {/* Call to Action Banner */}
            <StoreCallToAction />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StorePage;
