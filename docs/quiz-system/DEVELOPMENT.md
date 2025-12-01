
# Quiz System Development Guide

## Overview

This guide provides technical guidance for developers working on the Educare Quiz System. It covers the development environment setup, coding standards, component architecture, and integration details.

## Development Environment

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git
- Supabase CLI (for local database development)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in Supabase credentials and other required variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

The Quiz System follows a modular architecture consisting of several key components:

### Core Components

1. **Question Bank**: Manages the database of developmental questions
2. **Assessment Engine**: Handles the evaluation and progress tracking
3. **Feedback System**: Provides personalized feedback based on responses
4. **Video Integration**: Links relevant educational video content

### Data Flow

```
User Input → Assessment Engine → Database Operations → Feedback Generation → UI Rendering
```

## Coding Standards

### File Structure

```
src/
├── components/
│   └── quiz/
│       ├── QuestionCard.tsx
│       ├── ProgressIndicator.tsx
│       └── FeedbackPanel.tsx
├── hooks/
│   └── useQuizData.ts
├── utils/
│   └── quiz-import/
│       ├── index.ts
│       ├── json-normalizer.ts
│       └── types.ts
└── services/
    └── QuizService.ts
```

### Naming Conventions

- React components: PascalCase (e.g., `QuestionCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useQuizProgress.ts`)
- Utility functions: camelCase (e.g., `formatQuizData.ts`)
- Database tables: snake_case (e.g., `quiz_questions`)

### Type Safety

- Use TypeScript interfaces and types for all quiz-related data structures
- Define domain-specific types in `src/types/quiz.ts`
- Use proper type exports/imports as shown in `src/utils/quiz-import/index.ts`

## Import/Export Functionality

The Quiz System supports importing and exporting quiz data in JSON and CSV formats.

### JSON Format

The expected JSON structure for importing:

```json
{
  "meta": {
    "title": "7-8 months",
    "min_months": 7,
    "max_months": 8,
    "description": "Explorando e Descobrindo"
  },
  "questions": [
    {
      "domain": "motor",
      "question_text": "Can sit unsupported",
      "importance_note": "Important milestone for physical development",
      "positive_feedback": {
        "title": "Great progress!",
        "tips": ["Continue with floor time", "Try supported standing"]
      },
      "negative_feedback": {
        "title": "Let's work on this",
        "tips": ["Practice supported sitting", "Core strengthening activities"]
      },
      "video_suggestions": [
        {
          "title": "Helping Your Baby Sit Independently",
          "duration_seconds": 240
        }
      ]
    }
  ]
}
```

### CSV Format

For CSV imports, follow this structure:

```
age_group_title,min_months,max_months,phase,domain,question_text,importance_note,positive_title,positive_tips,negative_title,negative_tips,video_title,video_duration
"7-8 months",7,8,"Week 1","motor","Can sit unsupported","Important milestone","Great progress!","Continue with floor time|Try supported standing","Let's work on this","Practice supported sitting|Core strengthening activities","Helping Your Baby Sit Independently",240
```

## Building New Features

When adding features to the Quiz System:

1. Start with interface definitions in `types/`
2. Implement database queries and data processing functions
3. Build UI components with responsive design
4. Write tests for critical functionality
5. Document the feature in the appropriate README

## Integration with Other Modules

The Quiz System integrates with:

1. **User Management**: To track individual progress
2. **Media Library**: For video suggestions and content
3. **Notifications**: To remind users about incomplete assessments
4. **Analytics**: To provide insights into developmental progress

When making changes that affect these integrations, ensure you coordinate with the responsible teams.

## Troubleshooting Development Issues

### Common Issues

1. **TypeScript Errors with Quiz Domain Types**:
   - Ensure you're using the correct import method: `import type { QuizDomain } from './types'`
   - Verify the domain type matches the enum values

2. **Quiz Data Import Failures**:
   - Check JSON structure against the expected format
   - Verify that the domain values match allowed enum values
   - Ensure all required fields are present

3. **Database Constraint Errors**:
   - Review the database schema in `docs/quiz-system/DATA_MODEL.md`
   - Ensure foreign key references are valid

## Deployment

When deploying quiz system updates:

1. Ensure all database migrations are included
2. Verify that new enum values are added to existing RLS policies
3. Test the import functionality with sample data
4. Update the admin guide if new features affect admin workflows
