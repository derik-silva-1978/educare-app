
# TitiNauta - A Comprehensive Application Guide

Welcome to TitiNauta, your expert companion and guide through the pivotal first months of your baby's life. This document serves as a complete manual, detailing every feature, screen, and learning module you will encounter in the application.

## 🎯 Purpose

The mission of TitiNauta is to transform the uncertainty and anxiety of the early neonatal period into confidence and knowledge. By presenting medically-backed information in a simple, interactive, and engaging format, we empower families to provide the best possible care for their newborn, without ever neglecting the health and well-being of the mother.

---

## 🚀 Getting Started: A Quick Tour

Embark on your journey by following these steps to make the most of the application.

### Step 1: Welcome! The Setup
When you first launch the app, you'll be greeted by the welcome screen. Here, we ask for three simple pieces of information:
- **Baby's Name:** To personalize all communication.
- **Date of Birth:** Essential for calculating the baby's age in days and tailoring content.
- **Baby's Sex:** To adjust pronouns and articles, making the experience feel more personal.

This initial setup creates an affectionate connection and ensures the content feels custom-made for you and your baby.

### Step 2: The Journey Map
After setup, you'll land on the main dashboard. This is your control center, featuring:
- **Two Progress Trails:** One for the **Baby 👶** and another for the **Mother 💜**, showing your learning advancement in each area.
- **Three Navigation Tabs:**
    - **Bebê 👶:** Follow learning themes focused on newborn care.
    - **Mãe 💜:** Explore content dedicated to your recovery and well-being.
    - **Checklist ✅:** Access the interactive anamnesis tool to track essential exams and tests.
- **"Continue Journey" Button:** Your starting point for each learning session on the Baby and Mother trails.

### Step 3: The Smart Check-in (Quiz)
Clicking "Continue Journey" initiates a quick quiz. **This is not a test!** It's a smart tool to understand your current concerns. Based on your answers, TitiNauta prioritizes and suggests the most relevant learning themes for you at that moment.

### Step 4: Choose Your Focus (Theme Selection)
The app will present three recommended themes. You have the freedom to choose which one to explore first. There's also an option to "Encerrar por hoje" if you need a break.

### Step 5: Learn and Act (Content Screen)
This is the core learning screen, divided into clear sections:
- **Microcard:** A quick summary with the key takeaways of the theme.
- **Main Content:** The detailed information, available in both **Text 📖** and **Audio 🎧** formats.
- **Extra Resources:** Curated links to videos, articles, and guides from trusted sources (like the Brazilian Society of Pediatrics) to deepen your knowledge.

Upon completing a theme, you unlock a **badge**!

### Step 6: Progress and Next Steps
After each completed theme, your progress bars are updated. You can then choose a new theme or return to the Journey Map. From the second month onwards, you will also be able to complete weekly educational quizzes directly from the journey map.

---

## ✅ The Interactive Care Checklist

Beyond the learning trails, TitiNauta features a powerful interactive tool: the **Care Checklist**. Accessible via the third tab on the Journey Map, it functions as a complete digital anamnesis, ensuring no critical prenatal or newborn exam is overlooked.

### Intuitive Phase-Based Navigation
The checklist is organized around an interactive progress bar that segments care into 5 clear phases:
- **1ª consulta:** Exams from the start of gestation.
- **2º tri:** Second-trimester follow-ups.
- **3º tri:** Exams in the final stretch of pregnancy.
- **RN:** Essential newborn screenings.
- **Pendentes:** A smart, consolidated view that groups **all** outstanding items from every phase, giving you a clear action list.

### Richly Interactive Features
Each item on the checklist is a dynamic component:
- **Status Toggling:** Mark exams as "Realizado" (Done) or "Pendente" (Pending) with an accessible toggle switch.
- **Inline Details:** Tap an exam's title to smoothly expand an accordion, revealing crucial details about **when** it should be done and **why** it's important—without leaving the screen.
- **Audio Accessibility:** An audio icon (🔊) next to each item's details allows you to listen to the information, making the content more accessible.
- **Result Logging:** When an exam is marked as "Realizado", a form appears, allowing you to record the result ("Normal/Neg." or "Alterado/Pos.") and add notes.
- **At-a-Glance Status:** Once a result is logged, a color-coded badge appears on the card, providing a quick visual summary of the outcome.
- **Easy Corrections:** A small "clear" button (×) appears next to a selected result, allowing you to easily deselect it if you made a mistake.
- **Utility Functions:** Buttons at the bottom allow you to **Print** the checklist (or save as PDF) and **Reset** all entries.

This tool is designed to be your personal health assistant, transforming a complex list of requirements into a simple, organized, and interactive guide.

---

## 🏗️ Code Architecture and Structure

This application is built as a **Vanilla JavaScript Single-Page Application (SPA)**. It uses no external frameworks, prioritizing performance, simplicity, and maintainability.

### State Management (`AppState`)
The core of the application's data is managed by the `AppState` class in `index.js`. This class is responsible for:
- Centralizing all dynamic user data: user profile, learning progress, and checklist status.
- Loading the application state from `localStorage` on startup.
- Saving the state to `localStorage` whenever data changes, ensuring persistence across sessions.

### Main Controller (`TitiNautaApp`)
The `TitiNautaApp` class acts as the main controller. It orchestrates the entire application by:
- Managing screen transitions and rendering the correct UI for the current state.
- Handling all user interactions through efficient event delegation.
- Interacting with the `AppState` to read data and trigger updates.
- Initializing all event listeners upon application load.

### Data Structure (`/data`)
All static content is decoupled from the application logic and organized within the `/data` directory. This includes:
- **Themes:** Individual `.js` files for each learning topic.
- **Quizzes, Journeys, Badges:** Centralized data for the application's structure.
- **Anamnesis Model:** The complete data structure for the interactive checklist.
This modular approach makes it easy to update or add new content without altering the core application code.

### Dynamic Rendering
The UI is built dynamically using JavaScript template literals. The `index.html` file serves as a single entry point with placeholder elements. The `TitiNautaApp` class injects the appropriate HTML content into these placeholders based on the user's progress and actions, creating a fluid and responsive user experience without page reloads.

### Accessibility
The application was developed with a strong focus on accessibility (a11y):
- **Semantic HTML:** Using appropriate tags for structure.
- **ARIA Attributes:** Roles and states (e.g., `role="tab"`, `aria-selected`, `aria-expanded`) are used to provide context to screen readers.
- **Keyboard Navigation:** All interactive elements, including tabs and checklist items, are navigable and operable using the keyboard (`Tab`, `Enter`, `Space`).
- **Focus Management:** Focus is trapped within modals to prevent it from escaping to the background content, and it is returned to the triggering element upon closing.
- **Text-to-Speech:** An integrated audio feature provides narration for educational content, benefiting users with visual impairments or reading difficulties.

---

## 🗺️ The 12-Week Journey: Content Overview

The application is structured into two parallel learning trails, each containing twelve weeks of focused content. In the second month, weekly quizzes are introduced to reinforce learning.

### 👶 Baby Trail

| Week | Title | Topics Covered | What You'll Learn |
| :---: | :--- | :--- | :--- |
| **1** | **The Arrival** | Safe Sleep, Breastfeeding (Latch & Position), Choking Prevention. | The most critical care to ensure the baby's safety and well-being in the first days. |
| **2** | **Hygiene & Health** | Umbilical Stump, Bathing & Hygiene, Infection Prevention. | How to establish essential care routines to protect the baby from illness. |
| **3** | **Safety & Alerts** | Warning Signs (Baby), Safe Environment. | How to identify signs that something is wrong and how to make your home accident-proof. |
| **4** | **Follow-up**| Baby's Checkups and Tests. | The vital importance of newborn screening tests and the first pediatric visit. |
| **5** | **Exploring with Senses** | Social Smile, Sleep Routine, Tummy Time 2.0. | How to interpret and stimulate the baby's first social interactions and strengthen motor skills. |
| **6** | **Senses in Action** | Visual & Auditory Stimuli, Crying & Comfort, Bathing & Skin. | Ways to engage the baby's developing senses and understand their communication beyond crying. |
| **7** | **Health on Schedule** | 2nd Month Vaccines, Safe Environment Updates, Head & Trunk Control. | Key health updates for the second month, including vaccinations and motor development checks. |
| **8** | **Check-ups & Milestones**| Growth Tracking, 2nd Month Milestones, Doctor's Visit Prep. | How to track growth and prepare for the pediatrician by recognizing key developmental milestones. |
| **9** | **Voices, Gazes & Rhythms** | Baby Dialogue (Cooing), Tummy Time 3.0, Gentle Sleep Routine. | Deepening interaction through vocalizations and establishing gentle, predictable daily rhythms. |
| **10** | **Hands in Action** | Hands to Center & Mouth, Following Gaze (180°), Sound & Voice Games. | Understanding and stimulating the crucial eye-hand coordination and visual tracking. |
| **11** | **The World Outside** | Outings & Sun Protection, Car Seat & Transport, Colds & Warning Signs. | How to safely introduce the baby to the outside world, ensuring safety in transit and health awareness. |
| **12** | **Closing & Milestones** | Growth Tracking, 3rd Month Milestones, Trimester Check-up & Vaccines. | Consolidating the quarter's learning, tracking growth, and preparing for the next health check-up. |


### 💜 Mother Trail

| Week | Title | Topics Covered | What You'll Learn |
| :---: | :--- | :--- | :--- |
| **1** | **Physical Recovery** | Warning Signs (Mother), C-Section/Perineal Care, Breast Care. | How to care for your body postpartum, identify serious complications, and manage breastfeeding challenges. |
| **2** | **Mental Health & Support** | Maternal Mental Health, Support Network. | The importance of emotional well-being and how to effectively activate your support system. |
| **3** | **Energy & Wellness** | Mother's Sleep & Rest, Nutrition & Physical Activity. | Practical strategies to maximize rest, nourish your body, and safely resume physical activity. |
| **4** | **Looking Forward**| Sexual Health & Contraception, Postpartum Checkups. | Essential information on resuming intimacy, family planning, and preparing for your postpartum review. |
| **5** | **Energy & Rhythm** | 2nd Month Breastfeeding, Mental Health & Support, Sustainable Energy. | How to manage breastfeeding changes, check in on your mental health, and find a sustainable daily rhythm. |
| **6** | **Comfort & Well-being** | Breast Discomforts, Mother's Sleep, Nutrition & Hydration. | Advanced tips for managing breastfeeding challenges and prioritizing your own sleep and nutrition. |
| **7** | **Contraception & Movement** | Postpartum Contraception, Light Physical Activity, Resuming Intimacy. | How to make informed decisions about family planning and safely reintroduce movement and intimacy. |
| **8** | **Preparing for the Next Phase** | Doctor's Visit Checklist, Support Network & Alerts. | How to prepare for your check-up and ensure your support system is ready for the months ahead. |
| **9** | **Body in Rehabilitation** | Pelvic Floor, Core, Daily Posture. | Consolidating recovery with a focus on strengthening the pelvic floor, core, and adopting protective daily postures. |
| **10**| **Breastfeeding & Routine** | On-demand Feeding, Pumping & Storage, Support Network. | Fine-tuning the breastfeeding routine, mastering pumping and storage, and effectively using your support network. |
| **11**| **Mind & Relationships** | Mental Health, Couple's Bond, Personal Boundaries. | Caring for your mental health, nurturing the couple's bond, and establishing healthy personal boundaries. |
| **12**| **Preparing Next Steps** | Follow-up Consultation, Circle Vaccination, Practical Planning. | Preparing for the next health check-up, ensuring the vaccination of close contacts, and practical life planning. |
