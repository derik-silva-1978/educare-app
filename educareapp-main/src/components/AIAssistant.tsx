
import React, { useState } from 'react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export interface AIAssistantProps {
  systemMessage?: string;
  defaultModel?: 'gpt-4o-mini' | 'gpt-4o';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  systemMessage = 'You are a helpful assistant in a specialized education application. Provide clear, concise answers about educational approaches, learning strategies, and child development.',
  defaultModel = 'gpt-4o-mini'
}) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<Record<string, number> | null>(null);
  const { sendPrompt, isLoading, error } = useAIAssistant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const result = await sendPrompt(prompt, {
      systemMessage,
      model: defaultModel,
      temperature: 0.7
    });

    if (result) {
      setResponse(result.response);
      setTokenUsage(result.usage || null);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>
          Ask any question about education, learning strategies, or child development
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Type your question here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              'Ask AI Assistant'
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-900 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{response}</p>
              </div>
            </div>
            {tokenUsage && (
              <div className="text-xs text-muted-foreground">
                Tokens used: {tokenUsage.total_tokens} (Prompt: {tokenUsage.prompt_tokens}, Completion: {tokenUsage.completion_tokens})
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by OpenAI
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
