
# Quiz System Data Model

## Overview

The Quiz System uses a relational database model with the following key entities. This document provides a comprehensive reference to the database schema supporting the quiz functionality.

## Tables

### age_groups
```sql
CREATE TABLE public.age_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  min_months INTEGER NOT NULL,
  max_months INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### development_phases
```sql
CREATE TABLE public.development_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_group_id UUID REFERENCES public.age_groups(id),
  title VARCHAR NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  icon_class TEXT,
  bg_color TEXT DEFAULT '#0c1445',
  border_color TEXT DEFAULT '#4c5eaf',
  color_class TEXT DEFAULT 'text-blue-400',
  badge_name TEXT DEFAULT 'Phase',
  min_months INTEGER,
  max_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### quiz_questions
```sql
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES public.development_phases(id),
  question_text TEXT NOT NULL,
  domain quiz_domain NOT NULL,
  importance_note TEXT,
  positive_feedback_title TEXT NOT NULL,
  positive_feedback_tips TEXT[] NOT NULL,
  negative_feedback_title TEXT NOT NULL,
  negative_feedback_tips TEXT[] NOT NULL,
  order_index INTEGER NOT NULL,
  week_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### user_quiz_progress
```sql
CREATE TABLE public.user_quiz_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  question_id UUID REFERENCES public.quiz_questions(id),
  answer BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### video_suggestions
```sql
CREATE TABLE public.video_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.quiz_questions(id),
  title VARCHAR NOT NULL,
  video_url TEXT,
  description TEXT,
  duration_seconds INTEGER NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### video_favorites
```sql
CREATE TABLE public.video_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  video_id UUID REFERENCES public.video_suggestions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### week_milestones
```sql
CREATE TABLE public.week_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES public.development_phases(id),
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  theme_color TEXT NOT NULL,
  status TEXT DEFAULT 'locked',
  total_questions INTEGER DEFAULT 0,
  completed_questions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### user_phase_progress
```sql
CREATE TABLE public.user_phase_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  child_id UUID REFERENCES public.educare_children(id) NOT NULL,
  phase_id UUID REFERENCES public.development_phases(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Custom Types

### quiz_domain
```sql
CREATE TYPE public.quiz_domain AS ENUM (
  'motor',
  'cognitive',
  'language',
  'social',
  'sensory',
  'emotional'
);
```

## Relationships

1. age_groups → development_phases (1:N)
   - Each age group has multiple development phases

2. development_phases → quiz_questions (1:N)
   - Each phase contains multiple quiz questions

3. development_phases → week_milestones (1:N)
   - Each phase has multiple weekly milestones

4. quiz_questions → video_suggestions (1:N)
   - Each quiz question can have multiple video suggestions

5. quiz_questions → user_quiz_progress (1:N)
   - Each quiz question can have multiple user progress records

6. video_suggestions → video_favorites (1:N)
   - Each video suggestion can be favorited by multiple users

7. development_phases → user_phase_progress (1:N)
   - Each development phase can have progress records for multiple users

## Import/Export Data Structure

### JSON Import Format

```json
{
  "meta": {
    "title": "7-8 months",
    "min_months": 7,
    "max_months": 8,
    "description": "Explorando e Descobrindo"
  },
  "phases": [
    {
      "title": "Week 1",
      "description": "First milestone week",
      "order_index": 0,
      "icon_class": "baby",
      "questions": [
        {
          "domain": "motor",
          "question_text": "Can sit unsupported",
          "importance_note": "Important milestone for physical development",
          "positive_feedback_title": "Great progress!",
          "positive_feedback_tips": ["Continue with floor time", "Try supported standing"],
          "negative_feedback_title": "Let's work on this",
          "negative_feedback_tips": ["Practice supported sitting", "Core strengthening activities"],
          "order_index": 0,
          "video_suggestions": [
            {
              "title": "Helping Your Baby Sit Independently",
              "duration_seconds": 240,
              "video_url": "https://example.com/videos/baby-sitting"
            }
          ]
        }
      ]
    }
  ]
}
```

### CSV Import Format
CSV imports use a flattened structure with these columns:
```
age_group_title,min_months,max_months,phase_title,phase_description,phase_order,domain,question_text,importance_note,positive_title,positive_tips,negative_title,negative_tips,video_title,video_duration,video_url
```

Example:
```
"7-8 months",7,8,"Week 1","First milestone",0,"motor","Can sit unsupported","Important milestone","Great progress!","Continue with floor time|Try supported standing","Let's work on this","Practice supported sitting|Core strengthening activities","Helping Your Baby Sit Independently",240,"https://example.com/videos/baby-sitting"
```

## Indexes and Constraints

### Primary Key Constraints
- All tables have UUID primary keys

### Foreign Key Constraints
- Defined on all relationships to maintain referential integrity

### Unique Constraints
- user_quiz_progress: Prevents duplicate answers for the same question/child/user
- video_favorites: Prevents duplicate favorites for the same video/user

### Indexes
```sql
-- Improve quiz question lookup by phase
CREATE INDEX idx_quiz_questions_phase_id ON public.quiz_questions(phase_id);

-- Improve progress lookup by user and child
CREATE INDEX idx_user_quiz_progress_user_child ON public.user_quiz_progress(user_id, child_id);

-- Improve video suggestion lookup by question
CREATE INDEX idx_video_suggestions_question_id ON public.video_suggestions(question_id);

-- Improve phase progress lookup
CREATE INDEX idx_user_phase_progress_user_child ON public.user_phase_progress(user_id, child_id);
```

## Row-Level Security Policies

```sql
-- Allow users to view all age groups and phases
ALTER TABLE public.age_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Age groups are viewable by all authenticated users" 
  ON public.age_groups FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow users to view all development phases
ALTER TABLE public.development_phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Development phases are viewable by all authenticated users" 
  ON public.development_phases FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow users to view all questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by all authenticated users" 
  ON public.quiz_questions FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow users to manage their own quiz progress
ALTER TABLE public.user_quiz_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own quiz progress" 
  ON public.user_quiz_progress FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz progress" 
  ON public.user_quiz_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to manage their own video favorites
ALTER TABLE public.video_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own video favorites" 
  ON public.video_favorites FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own video favorites" 
  ON public.video_favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own video favorites" 
  ON public.video_favorites FOR DELETE 
  USING (auth.uid() = user_id);
```
