Educare+ Product Requirements Document (PRD)
1. Purpose
Educare+ aims to revolutionise early childhood development and maternal health monitoring by delivering a digital platform that connects parents, caregivers, educators and healthcare professionals. The system provides evidence‑based guidance, real‑time insights and collaborative tools to ensure optimal outcomes for children from pregnancy through early years.
2. Scope
This PRD covers the initial release of the Educare+ platform, including web and WhatsApp interfaces, backend services, database schema and automation workflows. It outlines functional requirements, user roles, use cases, acceptance criteria and non‑functional requirements for a minimally viable product suitable for pilot testing.
3. Stakeholders
Parents/Caregivers – individuals responsible for children’s development and health.
Professionals – healthcare providers, therapists, educators and specialists who assess and support children.
Coordinators/Admins – administrators who manage content, users, permissions and analytics.
Developers – team members implementing the platform.
Regulators – compliance with privacy laws (e.g., LGPD, GDPR) and health regulations.
4. Assumptions
Users will access the platform via modern browsers or WhatsApp; mobile responsiveness is essential.
Supabase will host the primary database and authentication services.
WhatsApp Business API credentials are available for the organisation.
n8n (cloud or self‑hosted) is available for automation workflows.
The platform must comply with data protection regulations and medical device guidance where applicable.
5. User Roles & Permissions
Role	Description	Key Permissions
Super Admin	Highest privilege; manages platform settings	All CRUD operations on every resource
Admin	Manages users, content, subscription plans	Manage users, quizzes, health records, analytics
Coordinator	Oversees professional teams and assignments	Assign professionals to children, moderate groups
Professional	Healthcare/education professional	View assigned children, add observations, chat
Parent	Primary caregiver	Manage own children, take quizzes, view resources
Guest	Unregistered or trial user	View limited public content, upgrade plan
Roles are implemented in the database via roles, permissions, user_roles and role_permissions. Row‑level security policies restrict access to ensure users can only view or modify authorised data
supabase.com
.
6. Functional Requirements
6.1 Authentication & Account Management
FR‑1: Users can register with email and password; system returns JWT access and refresh tokens with an access token lifetime of up to 1 hour
supabase.com
.
FR‑2: Users can log in with valid credentials and receive session tokens; invalid credentials produce appropriate error messages.
FR‑3: Users can reset their password via an email link.
FR‑4: Supabase Auth must support OAuth providers (Google, Microsoft, Apple) for social login.
FR‑5: Admins can manage roles and permissions.
6.2 Child & Maternal Management
FR‑6: Parents can create, view and edit profiles for each child, including name, birthdate, gender and observations.
FR‑7: Parents can record maternal health metrics (weight, blood pressure, glucose, temperature, sleep hours, mood, symptoms) and add notes; records must be stored in maternal_health_records.
FR‑8: Parents can track pregnancy information (last period date, due date, medical conditions, medications, next appointment) with automatic calculation of pregnancy week via a database trigger.
FR‑9: Parents and assigned professionals can upload and view child health records (vaccinations, documents, reports).
FR‑10: Parents can create diary entries for children with text, mood and photo attachments.
FR‑11: Professionals can request assignment to a child; coordinators/admins approve or reject requests. The status is stored in educare_professional_children.
6.3 Quiz & Development Journey
FR‑12: The system must store age groups, development phases and quiz questions as defined in the database schema.
FR‑13: Parents can start a quiz for a selected child; the system presents questions sequentially by phase and records the user’s answers in user_quiz_progress.
FR‑14: After completing a phase, the system calculates progress and recommends relevant videos and activities.
FR‑15: Users can mark videos as favourites; favourites are stored in video_favorites.
FR‑16: Weekly milestones must be generated based on completed questions and stored in week_milestones and user_phase_progress.
6.4 Communication & Collaboration
FR‑17: The platform must integrate with the WhatsApp Business API. Users can interact with TitiNauta via WhatsApp to:
Complete quizzes and receive feedback.
Ask development questions and receive AI‑generated responses.
Receive reminders and notifications.
FR‑18: The system must support creating group chats for parents, professionals and thematic communities. Group metadata, participants and messages are stored in team_whatsapp_groups, team_group_participants and team_group_messages.
FR‑19: AI must generate summaries of group discussions and store them in team_ai_summaries.
FR‑20: Professionals can send and receive messages via the web dashboard; messages must be synchronised with WhatsApp.
6.5 Professional & Admin Tools
FR‑21: Professionals have dashboards showing assigned children, recent quiz results, health records and pending actions.
FR‑22: Professionals can record observations and recommendations; parents can view them.
FR‑23: Admins can create and edit quiz content, manage subscription plans and view usage analytics.
FR‑24: The system must provide metrics dashboards (e.g., number of active users, quiz completion rates, group participation).
6.6 Subscriptions & Licensing
FR‑25: Users can subscribe to different plans (Free Trial, Basic, Premium, Enterprise). Plans must control access to WhatsApp features, groups and professional support. Subscription information is stored in subscription_plans and subscriptions tables.
FR‑26: Payment processing must be integrated via a PCI‑compliant provider (e.g., Asaas API – see Asaas_API.postman_collection.json). Free trials automatically expire after 30 days.
FR‑27: Administrators can grant complimentary licences or adjust subscription status for users.
7. Non‑Functional Requirements
Performance: The system must handle concurrent access by at least 1,000 users with response times below 300 ms for common requests.
Scalability: Backend services must scale horizontally; Supabase supports auto‑scaling and Postgres replication.
Security: All communications must use HTTPS; JWT tokens must be stored securely; RLS policies must restrict data access
supabase.com
.
Privacy: The platform must comply with LGPD/GDPR, including consent for data collection, explicit privacy policies and the ability for users to delete their data.
Internationalisation: User interfaces and messages must support Portuguese (default) and be extensible to other languages.
Accessibility: The web interface must meet WCAG 2.1 AA guidelines.
8. User Stories & Acceptance Criteria
US‑1: Parent Registers and Adds a Child
As a parent,
I want to register on the platform and add my child’s profile,
So that I can start tracking their development.
Acceptance Criteria:
Parent can sign up with email and password and receives an activation email.
Upon first login, the system prompts the parent to create a child profile with name, birthdate and gender.
The new child appears in the parent’s dashboard and is only visible to the parent and assigned professionals.
US‑2: Parent Completes a Quiz via WhatsApp
As a parent,
I want to answer quiz questions for my child through WhatsApp,
So that I can conveniently track development without logging into the web app.
Acceptance Criteria:
The parent sends a “start quiz” message to the WhatsApp number.
The bot asks questions sequentially based on the child’s current phase.
Parent answers via text or voice; the system transcribes audio answers.
At the end of the quiz, the system saves responses, updates progress and sends a summary with recommendations.
US‑3: Professional Reviews Assigned Children
As a professional,
I want to view a list of children assigned to me with their latest quiz results and health records,
So that I can plan interventions.
Acceptance Criteria:
Professional logs in and sees a dashboard listing assigned children.
For each child, the dashboard shows basic info, last completed phase, recent health entries and pending observations.
Professional can click a child to view detailed records, add notes and schedule follow‑ups.
US‑4: Admin Manages Quiz Content
As an admin,
I want to create and edit quiz questions, phases and age groups,
So that the content remains up to date and evidence‑based.
Acceptance Criteria:
Admin can view existing age groups, phases and questions.
Admin can add, edit or archive content with appropriate validation.
Changes take effect immediately and are reflected in subsequent quizzes.
9. Constraints & Dependencies
Integration with WhatsApp Business API may require approval from Meta and is subject to rate limits.
Asaas or other payment provider must be configured for subscription billing.
AI services (e.g., OpenAI) require API keys and have usage limits.
The initial pilot is limited to Portuguese; translation to other languages depends on budget and localisation effort.
10. Future Enhancements
Mobile native applications for Android/iOS.
Integration with electronic health record (EHR) systems.
Advanced analytics dashboards for developmental trends.
Gamification features to increase engagement.
Offline mode with data synchronisation when connectivity is restored.
11. Release Plan
Alpha Prototype (Internal) – Web client with basic child management, quiz system and Supabase backend.
Beta Pilot (Invite‑only) – WhatsApp bot integration, maternal health tracking, professional dashboards and payment integration.
Public Beta – Group chats, AI summaries, subscription plans and admin features.
General Availability – Mobile apps, multilingual support and advanced analytics.