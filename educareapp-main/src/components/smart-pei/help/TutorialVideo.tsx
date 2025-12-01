
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoTutorial } from '@/types/tutorial';

interface TutorialVideoProps {
  tutorial: VideoTutorial;
}

export const TutorialVideo: React.FC<TutorialVideoProps> = ({ tutorial }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{tutorial.title}</CardTitle>
          <Badge variant={tutorial.level === 'beginner' ? 'default' : tutorial.level === 'intermediate' ? 'secondary' : 'outline'}>
            {tutorial.level === 'beginner' ? 'Iniciante' : tutorial.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
      </CardHeader>
      <CardContent className="relative pb-0 flex-grow">
        <Link to={`/smart-pei/help/tutorials/${tutorial.id}`} className="block">
          <div 
            className="aspect-video bg-muted rounded-md overflow-hidden relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img 
              src={tutorial.thumbnail || `https://placehold.co/600x400/eee/ccc?text=Tutorial:+${tutorial.title}`} 
              alt={tutorial.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${isHovering ? 'bg-black/40' : ''}`}>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/90 hover:bg-white">
                <Play className="h-6 w-6 text-primary" />
              </Button>
            </div>
          </div>
        </Link>
        
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>{tutorial.duration}</span>
          </div>
          
          {tutorial.topics && tutorial.topics.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-1">Tópicos abordados:</p>
              <ul className="list-disc pl-5 space-y-1">
                {tutorial.topics.slice(0, 3).map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
                {tutorial.topics.length > 3 && (
                  <li>+{tutorial.topics.length - 3} outros tópicos</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/smart-pei/help/manual/${tutorial.relatedManualSection}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Manual</span>
          </Link>
        </Button>
        
        <Button size="sm" asChild>
          <Link to={`/smart-pei/help/tutorials/${tutorial.id}`}>
            <span>Ver Tutorial</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
