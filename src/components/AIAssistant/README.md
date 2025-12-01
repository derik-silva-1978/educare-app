
# AI Assistant Components

## Overview

The AI Assistant components provide intelligent support for users throughout the Educare platform. These components leverage advanced language models to offer personalized guidance, answer questions, and assist with various tasks related to child development and education.

## Table of Contents
- [Core Components](#core-components)
- [Supporting Components](#supporting-components)
- [Technical Implementation](#technical-implementation)
- [Integration with Other Modules](#integration-with-other-modules)
- [Customization](#customization)
- [Best Practices](#best-practices)
- [Future Enhancements](#future-enhancements)
- [Related Documentation](#related-documentation)

## Core Components

### Titibot

Titibot is an AI assistant designed to help parents and caregivers with child development questions and guidance.

#### Key Features
- **Chat Interface**: Conversational UI for natural interaction
- **Development Guidance**: Advice on developmental milestones and activities
- **Question Answering**: Responses to common parenting and development questions
- **Resource Recommendations**: Suggestions for relevant educational content
- **Premium Features**: Enhanced capabilities for premium users

#### Usage

```tsx
import { TitibotProvider } from '@/components/smart-pei/titibot/TitibotProvider';
import TitibotFloatingButton from '@/components/smart-pei/titibot/components/TitibotFloatingButton';

function MyApp() {
  return (
    <TitibotProvider>
      <AppContent />
      <TitibotFloatingButton />
    </TitibotProvider>
  );
}
```

#### Configuration Options

The Titibot component can be configured with these options:

```tsx
<TitibotProvider 
  initialOpen={false} 
  position="bottom-right"
  isPremium={user?.hasPremiumAccess}
>
  {children}
</TitibotProvider>
```

### QuizAssistant

The QuizAssistant provides domain-specific guidance during quiz assessments.

#### Key Features
- **Domain Expertise**: Specialized knowledge for each developmental domain
- **Suggestion Generation**: Activity and intervention recommendations
- **Resource Linking**: Connections to educational resources and videos
- **Context-Aware Help**: Guidance based on assessment responses

#### Usage

```tsx
import { useQuizAssistant } from '@/hooks/useQuizAssistant';

function QuizComponent() {
  const { getAssistance, data, isLoading, error } = useQuizAssistant();
  
  const handleGetHelp = async () => {
    const assistance = await getAssistance('motor', questions);
    // Use assistance data
  };
  
  return (
    // Component implementation
  );
}
```

### AlcibotAssistant

Alcibot is a specialized AI assistant designed for professionals, providing clinical support and evidence-based recommendations.

#### Key Features
- **Clinical Knowledge Base**: Research-backed developmental information
- **Professional Guidance**: Support for assessment interpretation
- **Intervention Planning**: Assistance with strategy development
- **Resource References**: Links to professional literature and tools
- **Documentation Support**: Help with professional documentation

#### Usage

```tsx
import { AlcibotAssistant } from '@/components/educare-app/ai-assistants/AlcibotAssistant';

function ProfessionalDashboard() {
  return (
    <div className="dashboard-content">
      <MainContent />
      <AlcibotAssistant context="assessment" />
    </div>
  );
}
```

## Supporting Components

### AIChat

Generic AI chat interface component used by both Titibot and Alcibot.

#### Key Features
- **Message Display**: Renders conversation history
- **Input Controls**: Text input with submission handling
- **Loading States**: Visual indicators during response generation
- **Error Handling**: Graceful error presentation
- **Suggestion Chips**: Quick response options

### ProactiveInsights

Component that offers context-aware suggestions without explicit user prompting.

#### Key Features
- **Context Analysis**: Understands current user activity
- **Timely Suggestions**: Offers help at appropriate moments
- **Dismissible Interface**: Non-intrusive design
- **Personalization**: Adapts to user preferences over time

## Technical Implementation

### Architecture

```
┌───────────────────┐     ┌───────────────────┐
│  AI Components    │     │  Edge Functions   │
│  (React Frontend) │────▶│  (Backend Logic)  │
└───────────────────┘     └─────────┬─────────┘
                                    │
                                    ▼
                          ┌───────────────────┐
                          │   OpenAI API      │
                          └───────────────────┘
```

### Dependencies
- OpenAI API for natural language processing
- Supabase Edge Functions for backend processing
- React context for state management
- Framer Motion for animations

### Performance Considerations
- Response caching for common queries
- Optimistic UI updates for improved perceived performance
- Efficient prompt engineering for faster responses
- Progressive loading indicators for better user experience

## Integration with Other Modules

### Quiz System Integration
- Provides contextual help based on quiz questions
- Offers domain-specific guidance for developmental areas
- Recommends relevant activities based on assessment results

### Assessment Integration
- Assists with interpreting assessment results
- Provides professional guidance for interventions
- Offers explanation of developmental milestones

### Educational Resources
- Recommends videos and activities based on user needs
- Links to appropriate learning resources
- Provides explanations for educational content

## Customization

The AI assistants can be customized in several ways:

### Appearance
- Position on screen
- Color themes
- Animation settings

### Behavior
- Initial open state
- Premium feature access
- Response style and tone

### Content
- Knowledge base focus areas
- Prompt engineering
- Resource connections

## Best Practices

1. **Ethical AI Use**
   - Transparent AI identification
   - Clear limitations communication
   - Privacy-preserving interaction design

2. **Accessibility**
   - Screen reader compatibility
   - Keyboard navigation
   - Multiple interaction methods

3. **Performance**
   - Efficient API usage
   - Response caching
   - Progressive enhancement

4. **User Experience**
   - Clear loading states
   - Fallback content
   - Error handling
   - Conversation management

## Future Enhancements

Planned improvements include:
1. Voice interaction capabilities
2. Multi-language support
3. Enhanced personalization
4. Expanded knowledge base
5. Improved context awareness

## Related Documentation

- [Quiz Components](../quiz/README.md)
- [Assessment Components](../assessment/README.md)
- [Parent User Guide](../../../docs/user-guides/parent-guide.md)
- [Professional User Guide](../../../docs/user-guides/professional-guide.md)
- [Technical Documentation](../../../docs/technical/README.md)
