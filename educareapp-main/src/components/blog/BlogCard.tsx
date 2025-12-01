
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        featured ? 'border-2 border-blue-200' : ''
      }`}
    >
      <Link to={`/blog/${post.slug}`}>
        <div className="relative">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-48 object-cover"
          />
          {featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Destaque
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-sm font-medium">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className={`font-bold mb-3 line-clamp-2 ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{post.readTime} de leitura</span>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Ler mais</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
