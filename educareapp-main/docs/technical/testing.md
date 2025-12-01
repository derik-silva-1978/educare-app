
# Testing Strategy

## Overview

This document outlines the testing strategy for the Educare application, providing guidelines for unit, integration, and end-to-end (E2E) testing to ensure the reliability and quality of the codebase.

## Testing Levels

### Unit Testing

Unit tests focus on testing individual components, functions, or classes in isolation.

#### Framework and Tools
- **Testing Library**: Jest
- **React Component Testing**: React Testing Library
- **Mocking**: Jest mock functions, MSW (Mock Service Worker)

#### Coverage Targets
- Business logic: 90%+
- Utility functions: 90%+
- React components: 80%+
- Hooks: 85%+

#### Example Unit Test

```typescript
// Testing a utility function
import { calculateDomainProgress } from '@/utils/assessment/domain-progress';

describe('calculateDomainProgress', () => {
  it('calculates correct progress percentage', () => {
    const items = [
      { id: '1', domain: 'motor', level: 3 },
      { id: '2', domain: 'motor', level: null },
      { id: '3', domain: 'cognitive', level: 2 }
    ];
    const domains = ['motor', 'cognitive'];
    
    const result = calculateDomainProgress(items, domains);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      domain: 'motor',
      total: 2,
      completed: 1,
      percentage: 50,
      progress: 0.5,
      score: 3
    });
    expect(result[1]).toEqual({
      domain: 'cognitive',
      total: 1,
      completed: 1,
      percentage: 100,
      progress: 1,
      score: 2
    });
  });
});
```

```typescript
// Testing a React component
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionCard from '@/components/quiz/QuestionCard';

describe('QuestionCard', () => {
  it('renders question text correctly', () => {
    render(<QuestionCard 
      question="Can the child sit unsupported?" 
      domain="motor"
      onAnswer={jest.fn()}
    />);
    
    expect(screen.getByText('Can the child sit unsupported?')).toBeInTheDocument();
    expect(screen.getByText('Motor Development')).toBeInTheDocument();
  });
  
  it('calls onAnswer with correct value when Yes is clicked', () => {
    const mockOnAnswer = jest.fn();
    render(<QuestionCard 
      question="Can the child sit unsupported?" 
      domain="motor"
      onAnswer={mockOnAnswer}
    />);
    
    fireEvent.click(screen.getByText('Yes'));
    
    expect(mockOnAnswer).toHaveBeenCalledWith(true);
  });
});
```

### Integration Testing

Integration tests verify that different parts of the application work together correctly.

#### Framework and Tools
- **Testing Library**: Jest
- **Component Integration**: React Testing Library
- **API Mocking**: MSW (Mock Service Worker)

#### Coverage Targets
- Component interactions: 75%+
- Form submissions: 80%+
- API integrations: 75%+
- User flows: 70%+

#### Example Integration Test

```typescript
// Testing form submission and API integration
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ChildForm } from '@/components/children/ChildForm';

// Mock server
const server = setupServer(
  rest.post('*/rest/v1/educare_children', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: '123', ...req.body }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ChildForm Integration', () => {
  it('submits form data and shows success message', async () => {
    const onSuccess = jest.fn();
    
    render(<ChildForm onSuccess={onSuccess} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: 'Test Child' } 
    });
    fireEvent.change(screen.getByLabelText(/birthdate/i), { 
      target: { value: '2022-01-01' } 
    });
    fireEvent.click(screen.getByLabelText(/male/i));
    
    // Submit form
    fireEvent.click(screen.getByText(/save/i));
    
    // Wait for submission and success
    await waitFor(() => {
      expect(screen.getByText(/child added successfully/i)).toBeInTheDocument();
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({
        id: '123',
        name: 'Test Child'
      }));
    });
  });
});
```

### End-to-End Testing

E2E tests verify the application works correctly from a user's perspective, testing complete user journeys.

#### Framework and Tools
- **Testing Framework**: Cypress
- **Visual Testing**: Percy

#### Coverage Targets
- Critical user journeys: 90%+
- Authentication flows: 90%+
- Form submissions: 80%+
- Quiz completion flows: 85%+

#### Example E2E Test

```javascript
// Cypress test for quiz completion flow
describe('Quiz Completion Flow', () => {
  beforeEach(() => {
    cy.login('testuser@example.com', 'password');
    cy.visit('/educare-app/quiz');
  });
  
  it('completes a quiz and shows results', () => {
    // Select age group
    cy.findByText('7-8 months').click();
    cy.findByText('Start Assessment').click();
    
    // Answer questions
    cy.findByText('Can your child sit unsupported?').should('be.visible');
    cy.findByText('Yes').click();
    cy.findByText('Next').click();
    
    // Continue answering questions
    cy.findByText('Does your child reach for objects?').should('be.visible');
    cy.findByText('Yes').click();
    cy.findByText('Next').click();
    
    // Complete the quiz
    cy.findByText('Quiz Complete').should('be.visible');
    cy.findByText('View Results').click();
    
    // Verify results page
    cy.url().should('include', '/results');
    cy.findByText('Development Summary').should('be.visible');
    cy.findByText('Motor Skills: 100%').should('be.visible');
  });
});
```

## Test Organization

Tests are organized to mirror the source code structure:

```
src/
└── components/
    └── quiz/
        ├── QuestionCard.tsx
        └── __tests__/
            ├── QuestionCard.test.tsx
            └── QuestionCard.integration.test.tsx
```

E2E tests are stored in a separate directory:

```
cypress/
└── e2e/
    ├── auth.cy.js
    ├── quiz.cy.js
    └── assessment.cy.js
```

## Testing Conventions

### Naming
- Unit tests: `ComponentName.test.tsx` or `functionName.test.ts`
- Integration tests: `ComponentName.integration.test.tsx`
- E2E tests: `featureName.cy.js`

### Mocking Strategy
- External services always mocked in unit and integration tests
- Database interactions mocked with MSW or test doubles
- Authentication mocked with test tokens

### Test Data
- Use factories for generating test data
- `src/tests/factories/` contains data generation utilities
- Example: `createTestAssessment()`, `createTestQuizQuestion()`

## CI/CD Integration

Tests are run at different stages of the CI/CD pipeline:

1. **Pre-commit**: Lightweight unit tests and linting
2. **Pull Request**: Full unit and integration test suite
3. **Merge to Main**: All tests including E2E

Test reports are generated in JUnit format and uploaded as artifacts.

## Performance Testing

Performance tests focus on:
- API response times
- Component render performance
- Database query optimization

Using:
- React DevTools Profiler
- Lighthouse CI
- Custom timing metrics

## Accessibility Testing

Accessibility testing ensures the application is usable by people with disabilities:

- Automated: axe-core integration with Jest and Cypress
- Manual: Screen reader testing, keyboard navigation checks

## Test-Driven Development

The team follows these TDD practices:
1. Write tests before implementing features
2. Red-Green-Refactor cycle
3. Test behavior, not implementation

## Troubleshooting Tests

Common issues and solutions:
1. **Flaky tests**: Use retry logic, stable selectors, and explicit waits
2. **Test isolation**: Reset application state between tests
3. **Slow tests**: Mock slow operations, use test sharding

## Continuous Improvement

The testing strategy evolves through:
- Regular test coverage reviews
- Performance metrics tracking
- Testing retrospectives
- Updating testing patterns as the application grows
