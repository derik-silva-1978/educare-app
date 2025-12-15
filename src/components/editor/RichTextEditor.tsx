import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Heading2,
  Smile,
  Quote,
  Code,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EMOJIS = [
  '😊', '😂', '😍', '🎉', '🚀', '💪', '👍', '❤️',
  '🎓', '📚', '💡', '⭐', '✨', '🌟', '👶', '👧',
  '👦', '👨‍👩‍👧‍👦', '💼', '🏥', '❓', '💬', '📱', '💻',
  '🎨', '🎬', '🎵', '🌍', '🌱', '💚', '🔔', '📅',
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escreva seu conteúdo aqui...',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Sincronizar conteúdo HTML com prop value
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    if (linkUrl) {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        executeCommand('createLink', linkUrl);
      } else {
        // Se não houver seleção, inserir link como texto
        const link = document.createElement('a');
        link.href = linkUrl;
        link.textContent = linkUrl;
        if (editorRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            selection.getRangeAt(0).insertNode(link);
          }
        }
      }
      setLinkUrl('');
      setIsLinkDialogOpen(false);
      handleInput();
    }
  };

  const insertEmoji = (emoji: string) => {
    const selection = window.getSelection();
    if (editorRef.current) {
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(document.createTextNode(emoji));
      }
      handleInput();
    }
    setShowEmojiPicker(false);
  };

  const insertTable = () => {
    const rows = prompt('Quantas linhas?', '2');
    const cols = prompt('Quantas colunas?', '2');
    
    if (rows && cols) {
      let html = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>';
      for (let i = 0; i < parseInt(rows); i++) {
        html += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          html += '<td style="border: 1px solid #ddd; padding: 8px;">Célula</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      executeCommand('insertHTML', html);
    }
  };

  return (
    <div className="w-full border rounded-lg bg-white dark:bg-slate-950 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 dark:bg-slate-900 p-2 flex flex-wrap gap-1 items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('bold')}
          title="Negrito (Ctrl+B)"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('italic')}
          title="Itálico (Ctrl+I)"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('underline')}
          title="Sublinhado (Ctrl+U)"
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          title="Heading 2"
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('insertUnorderedList')}
          title="Lista com pontos"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('insertOrderedList')}
          title="Lista numerada"
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          title="Citação"
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('formatBlock', '<pre>')}
          title="Código"
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-1" />

        {/* Link Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              title="Inserir link"
              className="h-8 w-8 p-0"
            >
              <Link2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inserir Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>URL</Label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') insertLink();
                  }}
                />
              </div>
              <Button onClick={insertLink} className="w-full">
                Inserir Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Emoji Picker */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emojis"
            className="h-8 w-8 p-0"
          >
            <Smile className="h-4 w-4" />
          </Button>

          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-900 border rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1 z-50 max-h-64 overflow-y-auto">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl hover:bg-gray-100 dark:hover:bg-slate-800 rounded p-1 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertTable}
          title="Inserir tabela"
          className="text-xs"
        >
          Tabela
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-slate-700 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => executeCommand('removeFormat')}
          title="Limpar formatação"
          className="text-xs"
        >
          Limpar
        </Button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="w-full min-h-96 p-4 focus:outline-none text-base leading-relaxed
          prose prose-sm dark:prose-invert max-w-none
          prose-p:my-2 prose-headings:my-3 prose-li:my-1
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-300
          prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100
          dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-white prose-pre:p-4 prose-pre:rounded
          prose-table:border-collapse prose-td:border prose-td:border-gray-300
          dark:prose-td:border-slate-700 prose-td:p-2"
        style={{ outline: 'none' }}
      >
        {!value && (
          <span className="text-muted-foreground pointer-events-none">{placeholder}</span>
        )}
      </div>

      {/* Character Count */}
      <div className="border-t bg-gray-50 dark:bg-slate-900 px-4 py-2 text-xs text-muted-foreground flex justify-between">
        <span>
          {editorRef.current?.textContent?.length || 0} caracteres
        </span>
        <span>
          {editorRef.current?.textContent?.split(/\s+/).filter(Boolean).length || 0} palavras
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
