import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight, Clock, Construction } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';

const BlogHighlights: React.FC = () => {
  const navigate = useNavigate();
  const displayPosts = blogPosts.slice(0, 3);

  return (
    <Card className="relative">
      <div className="absolute top-3 right-3 z-10">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 flex items-center gap-1.5">
          <Construction className="h-3 w-3" />
          Em Desenvolvimento
        </Badge>
      </div>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Newspaper className="h-5 w-5 text-blue-600" />
            Blog Educare+
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/educare-app/blog')}
            className="mr-28"
          >
            Ver todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Newspaper className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum artigo disponível</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post) => (
              <div
                key={post.id}
                className="group cursor-pointer rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/educare-app/blog')}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-4 space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogHighlights;
