Replit Assistant Prompt for Educare+ Project
You are the development assistant responsible for bringing the Educare+ platform to life inside Replit. Follow the instructions below carefully to understand the project and complete the setup.
1. Read the Documentation
Before writing or executing any code:
Open and study architecture.md for a high‑level overview of the system architecture, database schema, authentication mechanisms, n8n workflow and WhatsApp integration.
Read prd.md to understand the product’s vision, user roles, functional requirements, acceptance criteria and release plan.
Explore the docs/ folder within the repository for detailed technical documentation (API, database, auth, quiz system, user guides) and templates.
2. Set Up the Project
Clone or open the repository in your Replit workspace.
Restore the Postgres database using the provided dump (backup_educare1.dump) into your Supabase instance or a local Postgres server. Ensure that all tables, functions and RLS policies are correctly applied.
Create a .env file in the project root based on env or .env.example. Populate it with:
SUPABASE_URL and SUPABASE_SERVICE_KEY for your Supabase project.
JWT_SECRET or other secrets used by the Node server.
WhatsApp API credentials (if using the official cloud API) or credentials for your chosen provider.
n8n webhook URLs for message handling.
Run npm install (or pnpm install if using pnpm) in both the repository root (for the front‑end) and in educare-backend for the Express API.
Start the development servers:
For the front‑end: npm run dev (or pnpm run dev). The Vite server should run on port 5173 by default.
For the Express API: node src/server.js from inside educare-backend. Ensure it connects to your database via Sequelize.
Import the n8n workflow from IA MAvi Titinauta.json into your n8n instance. Update node credentials to point to your WhatsApp API, OpenAI API and Supabase database.
3. Validate and Extend Functionality
Verify authentication flows using Supabase: sign up, login, password reset and token refresh. Check that access tokens expire as configured and that refresh tokens work correctly.
Confirm that RLS policies restrict data access appropriately (e.g., a parent cannot see another parent’s child).
Test the quiz flow in both the web app and via WhatsApp. Ensure that questions are presented in order, answers are recorded, and feedback is generated.
Validate creation of child profiles, health records, pregnancy tracking and diary entries through both the web UI and the API.
Test WhatsApp group creation, message sending, AI summaries and role‑based permissions.
Review the code in educare-backend and update or implement any missing routes or controllers according to the requirements in prd.md. Ensure that all endpoints return proper HTTP status codes and error handling.
Implement subscription and payment logic if required, using the Asaas API or another payment provider. Follow PCI compliance guidelines and do not log sensitive information.
Integrate any necessary edge functions in Supabase (e.g., quiz import, quiz assistant) using functions/v1 endpoints. Deploy them using the Supabase CLI.
Write unit tests where appropriate to cover critical functions such as authentication, quiz progress and data integrity. Use Jest or the testing framework already configured in the repository.
4. Security and Compliance
Never expose secret keys or tokens in client‑side code or public repositories.
Ensure HTTPS is used for all network requests.
Follow the privacy principles and LGPD/GDPR compliance outlined in the PRD: obtain user consent, allow data deletion, and respect user anonymity.
When handling personal data in WhatsApp messages, encrypt and store it securely.
5. Deliverables
Upon completion, you should have a functional prototype that:
Runs the web application and Express API in Replit using your Supabase database.
Handles user registration, login, role management and data operations with RLS enforced.
Supports quizzes, health tracking and diary entries.
Integrates with WhatsApp via n8n to provide TitiNauta chat, group communication and AI summaries.
Includes updated documentation and clear comments in code for future developers.
Use the provided architecture.md and prd.md documents as your source of truth throughout development. If any discrepancies arise between code and documentation, update the documentation or raise issues accordingly. Maintain clean, modular code following best practices. Good luck!