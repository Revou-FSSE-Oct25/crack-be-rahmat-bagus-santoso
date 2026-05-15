[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/rF-k97Bx)

# LittleStep — Backend API

> Micro-learning platform for children aged 4–10 with simple gamification.

---

## Project Description

LittleStep is a Learning Management System (LMS) designed for children aged 4–10 years old. The platform uses a **Theme Park concept** — each learning module is represented as a fun ride in a virtual theme park.

Children can browse learning modules, read lesson content, and answer multiple-choice quizzes to earn points and badges. Parents can register, manage their children's accounts, and monitor learning progress. Admins can create and manage all learning content.

---

## Features

### For Parents
- Register a parent account
- Create and manage child profiles (with optional PIN protection)
- Select a child to learn.
- View child's learning progress per module

### For Children (accessed via parent account)
- Browse available learning modules
- Read lesson content
- Answer multiple-choice quizzes
- Earn points for correct answers (+10 points per correct answer)
- Earn a badge upon completing all quizzes in a module

### For Admin (Content Creator)
- Create, update, and delete learning modules
- Create, update, and delete lessons per module
- Create, update, and delete quizzes with multiple-choice options per lesson
- Create, update, and delete badges per module

### General
- Public access to module and lesson content (no login required)
- Search and filter available modules
- JWT-based authentication
- Role-based access control (Admin, Parent)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | NestJS 11 |
| Language | TypeScript |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Authentication | JWT (Passport.js) |
| Validation | class-validator, class-transformer |
| Documentation | Swagger (@nestjs/swagger) |
| Password Hashing | bcrypt |
| Deployment | Railway |

---

## Deployment

- Backend API: [LittleStep API](https://enchanting-harmony-production-0f83.up.railway.app/)
- Frontend App:[Frontend](https://crack-fe-rahmat-bagus-santoso.vercel.app/)
- API Documentation: [Swagger](https://enchanting-harmony-production-0f83.up.railway.app/api/docs)

---

## Entity Relationship Diagram (ERD)

> See ERD diagram at: [dbdiagram.io](https://dbdocs.io/bagussantoso4146/LittleStep)

### Database Entities & Relationships

```
User (PARENT / ADMIN)
  └── has many → Child

Child
  └── belongs to → User (parent)
  └── has many → ChildQuizSubmission
  └── has many → ChildModuleProgress
  └── has many → ChildBadge

Module
  └── has many → Lesson
  └── has one  → Badge
  └── has many → ChildModuleProgress

Lesson
  └── belongs to → Module
  └── has many   → Quiz

Quiz
  └── belongs to → Lesson
  └── has many   → QuizOption
  └── has many   → ChildQuizSubmission

QuizOption
  └── belongs to → Quiz

ChildQuizSubmission
  └── belongs to → Child
  └── belongs to → Quiz
  └── belongs to → QuizOption (selected answer)

ChildModuleProgress
  └── belongs to → Child
  └── belongs to → Module

Badge
  └── belongs to → Module
  └── has many   → ChildBadge

ChildBadge
  └── belongs to → Child
  └── belongs to → Badge
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Register parent account |
| POST | `/api/v1/auth/login` | Public | Login (parent or admin) |
| POST | `/api/v1/auth/logout` | Authenticated | Logout |

### User
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/user/profile` | Authenticated | Get current user profile |
| PATCH | `/api/v1/user/profile` | Authenticated | Update current user profile |
| DELETE | `/api/v1/user/delete` | Authenticated | Delete current user account |

### Children
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/children` | Parent | Create child profile |
| GET | `/api/v1/children` | Parent | Get all children of current parent |
| GET | `/api/v1/children/:childId` | Parent | Get child detail |
| PATCH | `/api/v1/children/:childId` | Parent | Update child profile |
| DELETE | `/api/v1/children/:childId` | Parent | Delete child profile |
| POST | `/api/v1/children/:childId/access` | Parent | Select child to learn (with optional PIN) |
| GET | `/api/v1/children/:childId/lessons/:lessonId/quizzes` | Parent | Get quizzes for a lesson |

### Modules
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/modules` | Public | Get all modules (supports `?search=`) |
| GET | `/api/v1/modules/:moduleId` | Public | Get module detail |
| GET | `/api/v1/modules/:moduleId/lessons` | Public | Get lessons in a module |

### Lessons
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/lessons/:lessonId` | Public | Get lesson detail |

### Submissions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/children/:childId/lessons/:lessonId/quizzes/:quizId/submit` | Parent | Submit a quiz answer |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/admin/modules` | Admin | Create a module |
| PATCH | `/api/v1/admin/modules/:moduleId` | Admin | Update a module |
| DELETE | `/api/v1/admin/modules/:moduleId` | Admin | Delete a module |
| POST | `/api/v1/admin/modules/:moduleId/lessons` | Admin | Create a lesson |
| PATCH | `/api/v1/admin/lessons/:lessonId` | Admin | Update a lesson |
| DELETE | `/api/v1/admin/lessons/:lessonId` | Admin | Delete a lesson |
| POST | `/api/v1/admin/lessons/:lessonId/quizzes` | Admin | Create a quiz with options |
| PATCH | `/api/v1/admin/quizzes/:quizId` | Admin | Update a quiz |
| DELETE | `/api/v1/admin/quizzes/:quizId` | Admin | Delete a quiz |
| POST | `/api/v1/admin/modules/:moduleId/badge` | Admin | Create a badge for a module |
| PATCH | `/api/v1/admin/badges/:badgeId` | Admin | Update a badge |
| DELETE | `/api/v1/admin/badges/:badgeId` | Admin | Delete a badge |

---

## Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/your-username/littlestep-backend.git
cd littlestep-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1h"
BCRYPT_SALT_ROUND=10
```

### 4. Run database migrations

```bash
npx prisma migrate deploy
```

### 5. Seed the database

```bash
npx prisma db seed
```

This will create the following demo accounts:

| Role | Email | Password |
|---|---|---|
| Admin | admin@littlestep.test | admin123 |
| Parent | parent@littlestep.test | parent123 |

And a demo child profile: **Nana** (age 6, no PIN) under the parent account.

### 6. Run the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`

Swagger documentation: `http://localhost:3000/api/docs`

### 7. Build for production

```bash
npm run build
npm run start:prod
```

---

## Deployment

| Service | URL |
|---|---|
| Backend API | `https://enchanting-harmony-production-0f83.up.railway.app/` |
| Frontend App | `https://crack-fe-rahmat-bagus-santoso.vercel.app/` |
| API Documentation (Swagger) | `https://enchanting-harmony-production-0f83.up.railway.app/api/docs` |

---


## Project Structure

```
src/
├── admin/          # Admin CRUD controller (modules, lessons, quizzes, badges)
├── auth/           # Authentication — register, login, JWT strategy, guards
├── badges/         # Badge service — award badge when module is completed
├── children/       # Children CRUD + avatar access flow
├── lessons/        # Lesson read endpoints (public)
├── modules/        # Module read endpoints (public) + search
├── options/        # Quiz options (managed via quizzes, no public endpoints)
├── password/       # Password hashing utility service
├── progress/       # Progress tracking service (internal, called by submissions)
├── quizzes/        # Quiz read endpoints + admin CRUD
├── submissions/    # Quiz submission flow — core gamification logic
├── users/          # User profile management
├── utils/          # Shared types (AuthenticatedRequest)
├── app.module.ts   # Root module — global guards registered here
├── main.ts         # App bootstrap, Swagger setup, global pipes
└── prisma.service.ts
prisma/
├── schema.prisma   # Database schema
├── seed.ts         # Demo data seeder
└── migrations/     # Migration history
```

---

## Key Design Decisions

**Child authentication (Netflix-style):** Children do not have their own JWT token. Parents log in, then select a child avatar via `POST /children/:childId/access`. The parent's JWT is used throughout the child's learning session. An optional PIN can be set per child for additional security.

**Quiz submission flow:** Each child can only submit each quiz once (`unique: childId + quizId`). Re-submission returns a `409 Conflict`. Points are awarded based on `quiz.points` value (default: 10). `completedQuizzes` increments on every submission regardless of correctness — a badge is awarded when all quizzes in a module are answered, not necessarily all answered correctly.

**Admin module architecture:** All admin routes are centralized in `AdminController` under the `/admin` prefix, protected with `@Roles(Role.ADMIN)`. The controller injects services from other modules (ModulesService, LessonsService, QuizzesService, BadgesService) rather than having its own repository.

**Public content access:** Module and lesson content is publicly accessible without authentication. Authentication is only required to submit quiz answers, maintaining a low barrier to entry for new visitors.
