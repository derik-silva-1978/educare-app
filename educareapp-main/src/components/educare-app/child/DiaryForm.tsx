
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { PlusCircle, Smile, Meh, Frown, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface DiaryFormProps {
  onSubmit: (post: {
    title: string;
    content: string;
    date: string;
    mood?: 'happy' | 'neutral' | 'sad';
    photos?: string[];
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const today = new Date();
  
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    mood: 'happy' as 'happy' | 'neutral' | 'sad',
    date: today,
    photos: [] as string[]
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...newPost, 
      date: format(newPost.date, 'yyyy-MM-dd')
    });
  };

  return (
    <Card className="mb-6 border-2 border-primary/10 bg-white dark:bg-slate-900">
      <CardContent className="p-5">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <Label 
                htmlFor="title" 
                className="text-gray-900 dark:text-gray-200 font-medium"
              >
                Título
              </Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Título do registro"
                required
                className="bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label 
                htmlFor="date" 
                className="text-gray-900 dark:text-gray-200 font-medium"
              >
                Data
              </Label>
              <DatePicker
                date={newPost.date}
                setDate={(date) => date && setNewPost({...newPost, date})}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2.5">
            <Label 
              htmlFor="content" 
              className="text-gray-900 dark:text-gray-200 font-medium"
            >
              Conteúdo
            </Label>
            <Textarea
              id="content"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="Detalhes do registro diário"
              rows={5}
              required
              className="min-h-[120px] bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <Label 
                htmlFor="mood"
                className="text-gray-900 dark:text-gray-200 font-medium"
              >
                Estado Emocional
              </Label>
              <Select
                value={newPost.mood}
                onValueChange={(value: 'happy' | 'neutral' | 'sad') => setNewPost({...newPost, mood: value})}
              >
                <SelectTrigger className="bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary">
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                  <SelectItem value="happy">
                    <div className="flex items-center">
                      <Smile className="h-4 w-4 text-green-500 mr-2" />
                      Feliz
                    </div>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <div className="flex items-center">
                      <Meh className="h-4 w-4 text-amber-500 mr-2" />
                      Neutro
                    </div>
                  </SelectItem>
                  <SelectItem value="sad">
                    <div className="flex items-center">
                      <Frown className="h-4 w-4 text-red-500 mr-2" />
                      Triste
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2.5">
              <Label 
                htmlFor="photo"
                className="text-gray-900 dark:text-gray-200 font-medium"
              >
                Foto (opcional)
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedImage(e.target.files[0]);
                  }
                }}
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-gray-800 focus:border-primary file:text-primary file:font-medium"
              />
              <p className="text-xs text-muted-foreground">
                Imagens serão implementadas em breve
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="order-1 sm:order-none border-2 border-gray-300 dark:border-gray-700 font-medium"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="gap-2 order-none sm:order-1 font-medium shadow-sm hover:shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Adicionar Registro
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiaryForm;
