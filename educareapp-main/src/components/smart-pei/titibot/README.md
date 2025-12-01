
# Titibot Component Documentation

## Overview
Titibot is a customizable chat assistant for the Smart PEI platform that helps users with quick answers and guidance related to educational concepts, PEI development, and inclusive education.

## Architecture

### Component Structure
- `TitibotProvider`: Context provider that manages the chatbot's state (open/closed)
- `Titibot`: Main component that renders the chat interface
- Supporting components:
  - `TitibotHeader`: Contains title and control buttons
  - `TitibotMessagesList`: Renders conversation messages
  - `TitibotMessage`: Individual message component
  - `TitibotInput`: Text input with send button
  - `TitibotSuggestions`: Clickable suggestion chips
  - `TitibotAvatar`: Displays the bot's avatar

### Service Layer
- `useTitibotService`: Hook for handling API communication and message processing

### Utilities
- `TitibotUtils.ts`: Helper functions for formatting, suggestions and input processing

## Usage

### Basic Implementation
```tsx
// In a page component
import { TitibotProvider } from './TitibotProvider';
import Titibot from './Titibot';

const MyPage = () => {
  return (
    <TitibotProvider>
      <div>
        {/* Page content */}
        <Titibot />
      </div>
    </TitibotProvider>
  );
};
```

### Environment Configuration
The Titibot component works in:
1. Development mode: Uses simulated responses from `useTitibotService.ts`
2. Production mode: Connects to an actual API endpoint by configuring the `apiUrl` parameter

To switch to a real API:
```tsx
// In your page component
const MyPage = () => {
  return (
    <TitibotProvider>
      <div>
        {/* Page content */}
        <Titibot apiEndpoint="https://your-api-endpoint.com/chat" />
      </div>
    </TitibotProvider>
  );
};
```

### Customization
The component's appearance can be customized through CSS variables and the modular CSS structure.
