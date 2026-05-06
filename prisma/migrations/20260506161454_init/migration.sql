-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARENT');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PARENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "age" INTEGER NOT NULL,
    "pin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "explanation" TEXT,
    "orderNumber" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "lesson_id" TEXT NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "quiz_id" TEXT NOT NULL,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_quiz_submissions" (
    "id" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "earnedPoints" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "child_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "selected_option_id" TEXT NOT NULL,

    CONSTRAINT "child_quiz_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_module_progress" (
    "id" TEXT NOT NULL,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "completedQuizzes" INTEGER NOT NULL DEFAULT 0,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "child_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "child_module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "child_badges" (
    "id" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "child_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,

    CONSTRAINT "child_badges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "children_parent_id_idx" ON "children"("parent_id");

-- CreateIndex
CREATE INDEX "lessons_module_id_idx" ON "lessons"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_module_id_orderNumber_key" ON "lessons"("module_id", "orderNumber");

-- CreateIndex
CREATE INDEX "quizzes_lesson_id_idx" ON "quizzes"("lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_lesson_id_orderNumber_key" ON "quizzes"("lesson_id", "orderNumber");

-- CreateIndex
CREATE INDEX "quiz_options_quiz_id_idx" ON "quiz_options"("quiz_id");

-- CreateIndex
CREATE INDEX "child_quiz_submissions_child_id_idx" ON "child_quiz_submissions"("child_id");

-- CreateIndex
CREATE INDEX "child_quiz_submissions_quiz_id_idx" ON "child_quiz_submissions"("quiz_id");

-- CreateIndex
CREATE INDEX "child_quiz_submissions_selected_option_id_idx" ON "child_quiz_submissions"("selected_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "child_quiz_submissions_child_id_quiz_id_key" ON "child_quiz_submissions"("child_id", "quiz_id");

-- CreateIndex
CREATE INDEX "child_module_progress_child_id_idx" ON "child_module_progress"("child_id");

-- CreateIndex
CREATE INDEX "child_module_progress_module_id_idx" ON "child_module_progress"("module_id");

-- CreateIndex
CREATE INDEX "child_module_progress_module_id_status_idx" ON "child_module_progress"("module_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "child_module_progress_child_id_module_id_key" ON "child_module_progress"("child_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "badges_module_id_key" ON "badges"("module_id");

-- CreateIndex
CREATE INDEX "child_badges_child_id_idx" ON "child_badges"("child_id");

-- CreateIndex
CREATE INDEX "child_badges_badge_id_idx" ON "child_badges"("badge_id");

-- CreateIndex
CREATE UNIQUE INDEX "child_badges_child_id_badge_id_key" ON "child_badges"("child_id", "badge_id");

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_quiz_submissions" ADD CONSTRAINT "child_quiz_submissions_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_quiz_submissions" ADD CONSTRAINT "child_quiz_submissions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_quiz_submissions" ADD CONSTRAINT "child_quiz_submissions_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "quiz_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_module_progress" ADD CONSTRAINT "child_module_progress_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_module_progress" ADD CONSTRAINT "child_module_progress_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_badges" ADD CONSTRAINT "child_badges_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "children"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "child_badges" ADD CONSTRAINT "child_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
