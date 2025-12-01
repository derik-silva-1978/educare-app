
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Smile, Meh, Frown, Calendar, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DiaryEntryProps {
  post: {
    id: string;
    title: string;
    content: string;
    date: string;
    mood?: 'happy' | 'neutral' | 'sad';
    photos?: string[];
  };
  onDelete: () => void;
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({ post, onDelete }) => {
  return (
    <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Header with date and mood */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary/80" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {format(new Date(post.date), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center">
            {post.mood && (
              <div className="mr-2">
                {post.mood === 'happy' && <Smile className="h-5 w-5 text-green-500" />}
                {post.mood === 'neutral' && <Meh className="h-5 w-5 text-amber-500" />}
                {post.mood === 'sad' && <Frown className="h-5 w-5 text-red-500" />}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 h-auto"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{post.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-4 leading-relaxed">{post.content}</p>
          
          {/* Photos */}
          {post.photos && post.photos.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Image className="h-4 w-4 mr-1" />
                <span>Anexos ({post.photos.length})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {post.photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden relative"
                  >
                    {photo && (
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiaryEntry;
