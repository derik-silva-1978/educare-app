Educare+ Technical Architecture Overview
1. System Overview
Educare+ is a comprehensive digital platform designed to support early childhood development, maternal health, and professional collaboration. The system provides parents, caregivers, educators and healthcare professionals with tools to track developmental milestones, conduct age‑appropriate quizzes, record health metrics, share learning resources and collaborate through integrated communication channels such as WhatsApp.
2. Architectural Layers
2.1 Front‑end (Web Client)
The client application is implemented in React 18 with TypeScript using Vite as the build tool. The UI layer uses Tailwind CSS combined with shadcn/ui components for rapid development and consistent styling. State management follows a hybrid model: global context providers for user authentication, theme preferences and selected child context, TanStack Query for server data fetching and caching, React Hook Form with Zod for form validation, and local useState/useReducer for component state. Data visualisation components use Recharts, icons are provided by Lucide React, and animations use Framer Motion. Navigation is handled by React Router DOM. The front‑end communicates with the backend exclusively through the Supabase client SDK, which automatically includes the user’s JWT when making API calls.
2.2 Backend (Supabase)
The primary backend is built on Supabase, which exposes a PostgreSQL database with built‑in authentication and real‑time capabilities. Supabase’s API layer offers RESTful endpoints for each table and supports row‑level security (RLS) policies. The platform uses Supabase Authentication to manage users and generate JWT access/refresh tokens; access tokens are short‑lived (typically 5 minutes to 1 hour) while refresh tokens can be exchanged for new access tokens
supabase.com
. Row‑level security must be enabled on any public table; Supabase allows secure browser access to data when RLS is enabled
supabase.com
. The system defines granular policies to ensure that parents can only access their own children’s records and professionals can only access assigned children. Edge Functions written in TypeScript can be deployed to extend Supabase’s capabilities (for example importing quiz data or generating AI‑assisted responses).
2.3 Node/Express API
In addition to Supabase, the repository includes an Express server located in the educare‑backend folder. This service uses Sequelize to define models and migrations and exposes REST endpoints under /api. Routes include authentication (/api/auth), user and profile management (/api/users, /api/profiles), child management (/api/children), quizzes (/api/quizzes), journeys (/api/journeys and /api/journey‑v2), team management, chat, achievements, subscription plans, media resources and a modernised TitiNauta interface. The Express API also provides external endpoints (/api/external) to integrate with partner systems and includes scripts to seed quiz content and import journey data. While Supabase remains the primary data store, this Node server acts as an additional API layer, facilitating custom logic, file uploads, websockets and integration with legacy systems.
2.4 n8n Workflow (Automation)
The automation layer is defined in the n8n blueprint (IA MAvi Titinauta.json). This JSON file contains 77 nodes representing a complex workflow that processes incoming WhatsApp messages for the TitiNauta virtual assistant. Key components include:
HTTP Request nodes that interact with external services such as OpenAI for chat completions, audio transcription and image analysis.
If/Condition nodes that branch logic based on message type (text, audio, image) and sender identity (user or bot).
Code nodes that manipulate message payloads, manage chat history and format responses.
Chat Memory Manager to maintain conversation context across multiple messages.
Date & Time nodes to schedule actions (e.g., disabling the bot for an hour after certain messages).
Edit Fields and Convert to File nodes to transform incoming media for processing.
The workflow receives messages via webhooks from WhatsApp, transcribes audio messages, analyses images, generates responses using AI, stores conversation history and sends replies. It also supports group moderation, scheduling and session management.
2.5 WhatsApp Integration
Educare+ integrates with the WhatsApp Business API to provide conversational interfaces and group communication. The docs/whatsapp‑integration/README.md describes the design of this system. Key features include:
TitiNauta via WhatsApp – users can converse with an AI assistant, complete questionnaires, receive reminders and synchronise data with the web platform.
Specialised groups for parents, professionals, mentorship, crisis support and thematic topics (e.g., autism, Down syndrome). Groups are associated with children via team_whatsapp_groups tables and participants via team_group_participants. Messages and AI‑generated summaries are stored in team_group_messages and team_ai_summaries tables.
Webhook‑based integration – the system uses webhooks to receive messages in real time and message templates for proactive notifications. Media files (images, videos, documents) are supported. AI analyses generate sentiment scores, summaries and recommendations. End‑to‑end encryption, LGPD compliance and granular access control policies ensure privacy and security.
3. Database Schema
The Supabase/PostgreSQL database is organised into several domains:
3.1 User and Role Management
auth.users – Supabase’s built‑in user table storing email/password credentials and metadata.
educare_profiles – extends user information with name, email and role.
roles, permissions, user_roles and role_permissions – implement Role‑Based Access Control. Users may have multiple roles (e.g., parent, professional, admin), each with associated permissions. Helper functions such as has_role() and is_super_admin() simplify policy checks.
app_environments and role_environment_access – manage environment‑specific access levels (e.g., development, staging, production).
3.2 Children and Professional Relationships
educare_children – records each child’s personal information (name, birthdate, age, gender, contact details, journey progress) and links them to their parent (user_id). RLS policies ensure only parents and assigned professionals can view or modify child records.
educare_professional_children – junction table linking professionals to assigned children with a status field (pending/approved).
educare_professionals – additional professional profile information (not detailed here).
3.3 Quiz System
age_groups – defines ranges of months (e.g., 0–6 months) along with descriptive titles.
development_phases – subdivides age groups into weekly or monthly phases with ordering indices and metadata (icons, colours, badges).
quiz_questions – contains questions for each phase. Questions are categorised by domain (motor, cognitive, language, social, sensory, emotional) and include positive/negative feedback text and arrays of tips.
user_quiz_progress – stores user responses to each question, linking the user, child and question. RLS policies restrict access to parents and assigned professionals.
video_suggestions, video_favorites, week_milestones and user_phase_progress – provide multimedia suggestions, track favourite videos, summarise weekly milestones and record overall phase completion status.
3.4 Health and Pregnancy Tracking
maternal_health_records – records maternal health metrics (weight, blood pressure, glucose, temperature, sleep, mood, symptoms) and notes. Users can only access their own records via RLS.
pregnancy_tracking – stores due dates, last period dates, calculated pregnancy week (via a trigger), medical conditions and next appointment. Functions calculate pregnancy week automatically upon insert/update.
child_health_records – stores children’s health records such as vaccinations, medical reports and optional file attachments.
child_diary_entries – allows parents to record daily or weekly diary entries, including mood, photos and notes.
3.5 Communication Tables
The WhatsApp integration relies on tables such as team_whatsapp_groups, team_group_participants, team_group_messages and team_ai_summaries. These tables store group metadata, membership, messages and AI‑generated summaries along with sentiment analysis and recommendations.
4. Authentication & Security
Educare+ relies on Supabase Authentication. During registration, the user provides an email and password; upon successful signup the system returns a JWT access token and a refresh token. The access token is used for subsequent API requests and expires within an hour
supabase.com
. Row‑Level Security (RLS) policies are enabled on every public table and ensure only authorised users can access data; Supabase requires RLS to be enabled when exposing tables via the API
supabase.com
. Functions such as has_role() and get_user_roles() check user roles securely; RLS policies use auth.uid() to match the authenticated user’s ID.
5. Key Functional Modules
Authentication & RBAC – Handles user registration, login, password resets, email verification and role assignment. Roles include super_admin, admin, coordinator, professional, parent and guest.
Child Management – Allows parents to create and update child profiles and assign professionals. Professionals can view assigned children; admins can view all children.
Quiz & Journey – Provides age‑appropriate quizzes broken into phases and questions; tracks user answers and progress; recommends videos and activities; generates weekly milestones and feedback.
Maternal Health & Diary – Enables recording maternal and child health metrics, pregnancy tracking and diary entries.
Professional Tools – Offers professionals dashboards to assess progress, plan interventions and communicate with parents.
WhatsApp Communication – Integrates TitiNauta chat, group messaging and AI summarisation using WhatsApp Business API and n8n workflows.
Admin & Analytics – Provides administration of users, roles, content and subscription plans; includes dashboards and analytics.
6. Deployment & Integration
For production, the recommended architecture consists of:
Supabase for database, authentication, storage and edge functions.
Replit (or another Node hosting provider) for running the Express API and serving the front‑end build during development. In production, the web front‑end can be deployed on Vercel, Netlify or similar.
n8n Cloud (or self‑hosted) for workflow automation integrating WhatsApp, AI services and Supabase.
WhatsApp Business API provider (official WhatsApp Cloud API or third‑party provider) for messaging channels. Credentials and webhook URLs should be configured in environment variables.
GitHub for version control; CI/CD pipelines can deploy changes to the selected hosting providers.
This document provides a high‑level overview. For detailed API endpoints, database schema definitions and implementation examples, refer to the technical documentation within the repository.