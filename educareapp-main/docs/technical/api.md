
# API Documentation

## Overview

This document outlines the API endpoints available in the Educare application. The Educare API is built on Supabase, providing secure and scalable data access through RESTful endpoints and real-time subscriptions.

## Authentication Endpoints

### Sign Up

```
POST /auth/v1/signup
```

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "name": "User Name",
    "role": "parent"
  }
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "yCWcrfaoty9ZvnUOtGHRzw",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  }
}
```

### Sign In

```
POST /auth/v1/token?grant_type=password
```

Authenticates a user and returns session tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** Same as Sign Up

### Sign Out

```
POST /auth/v1/logout
```

Ends the current user session.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "error": null,
  "data": {}
}
```

## Quiz System API

### Age Groups

```
GET /rest/v1/age_groups
```

Retrieves all age groups.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "7-8 months",
    "min_months": 7,
    "max_months": 8,
    "description": "Explorando e Descobrindo"
  }
]
```

### Development Phases

```
GET /rest/v1/development_phases?age_group_id=eq.<age_group_id>
```

Retrieves phases for a specific age group.

**Response:**
```json
[
  {
    "id": "uuid",
    "age_group_id": "uuid",
    "title": "Week 1",
    "description": "Initial development phase",
    "order_index": 0
  }
]
```

### Quiz Questions

```
GET /rest/v1/quiz_questions?phase_id=eq.<phase_id>
```

Retrieves questions for a specific development phase.

**Response:**
```json
[
  {
    "id": "uuid",
    "phase_id": "uuid",
    "domain": "motor",
    "question_text": "Can sit unsupported",
    "importance_note": "Important milestone",
    "positive_feedback_title": "Great progress!",
    "positive_feedback_tips": ["Continue with floor time", "Try supported standing"],
    "negative_feedback_title": "Let's work on this",
    "negative_feedback_tips": ["Practice supported sitting", "Core strengthening activities"],
    "order_index": 0
  }
]
```

### Quiz Progress

```
POST /rest/v1/user_quiz_progress
```

Records a user's answer to a quiz question.

**Request Body:**
```json
{
  "user_id": "uuid",
  "child_id": "uuid",
  "question_id": "uuid",
  "answer": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "child_id": "uuid",
  "question_id": "uuid",
  "answer": true,
  "created_at": "2023-05-15T14:30:00Z"
}
```

### Video Suggestions

```
GET /rest/v1/video_suggestions?question_id=eq.<question_id>
```

Retrieves video suggestions for a specific question.

**Response:**
```json
[
  {
    "id": "uuid",
    "question_id": "uuid",
    "title": "Helping Your Baby Sit Independently",
    "duration_seconds": 240,
    "video_url": "https://example.com/videos/baby-sitting"
  }
]
```

## Child Management API

### Create Child

```
POST /rest/v1/educare_children
```

Creates a new child record.

**Request Body:**
```json
{
  "user_id": "uuid",
  "name": "Child Name",
  "birthdate": "2022-01-01",
  "age": 12,
  "gender": "male"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Child Name",
  "birthdate": "2022-01-01",
  "age": 12,
  "gender": "male",
  "created_at": "2023-05-15T14:30:00Z"
}
```

### Child Health Records

```
POST /rest/v1/child_health_records
```

Creates a health record for a child.

**Request Body:**
```json
{
  "child_id": "uuid",
  "user_id": "uuid",
  "date": "2023-05-15",
  "record_type": "vaccination",
  "name": "MMR Vaccine",
  "description": "Measles, Mumps, Rubella vaccination"
}
```

**Response:**
```json
{
  "id": "uuid",
  "child_id": "uuid",
  "user_id": "uuid",
  "date": "2023-05-15",
  "record_type": "vaccination",
  "name": "MMR Vaccine",
  "description": "Measles, Mumps, Rubella vaccination",
  "created_at": "2023-05-15T14:30:00Z"
}
```

## Edge Functions

### Quiz Import

```
POST /functions/v1/import-quiz
```

Imports quiz data from JSON or CSV.

**Request Body:**
```json
{
  "format": "json",
  "data": "{ ... }"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz imported successfully",
  "ageGroupId": "uuid"
}
```

### Quiz Assistant

```
POST /functions/v1/quiz-assistant
```

Generates assistance for quiz questions.

**Request Body:**
```json
{
  "domain": "motor",
  "prompt": "Suggest activities for motor development"
}
```

**Response:**
```json
{
  "answer": "Here's what you can do to help with motor development...",
  "suggestions": ["Daily tummy time", "Supported sitting practice"],
  "resources": [
    {
      "title": "Motor Development Guide",
      "url": "https://example.com/guides/motor"
    }
  ]
}
```

## Error Handling

All API endpoints follow a consistent error format:

```json
{
  "error": {
    "code": "authentication_error",
    "message": "Invalid credentials"
  }
}
```

Common error codes:
- `authentication_error`: Invalid or missing authentication
- `validation_error`: Invalid request data
- `permission_error`: Insufficient permissions
- `not_found`: Requested resource not found
- `server_error`: Internal server error

## Rate Limits

- Authentication endpoints: 10 requests per minute
- Data endpoints: 60 requests per minute
- Edge functions: 30 requests per minute

## Versioning

The API uses URL versioning (v1). When breaking changes are introduced, a new version (v2) will be created while maintaining the previous version for backward compatibility.

## Security Considerations

- All API endpoints are protected by Row Level Security (RLS)
- JWT tokens expire after 1 hour
- Refresh tokens are required for extended sessions
- API keys should never be exposed in client-side code
