
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AIAssistant from '@/components/AIAssistant';

const AIAssistantPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Assistant | Smart PEI</title>
        <meta name="description" content="Ask questions and get AI-powered assistance for education and child development" />
      </Helmet>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">AI Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions about education, learning strategies, and child development to get AI-powered assistance.
          </p>
        </div>
        
        <AIAssistant />
      </main>
    </>
  );
};

export default AIAssistantPage;
