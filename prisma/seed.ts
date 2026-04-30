import 'dotenv/config';
import { PrismaClient, Role, ProgressStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PasswordService } from '../src/password/password.service';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg( pool );
const prisma = new PrismaClient({ adapter });
const passwordService = new PasswordService();

async function main() {
  console.log('Start seeding LittleStep data...');

  // Clear data from tables that depend on other tables first.
  // This seed file is intended for development only.
  await prisma.childBadge.deleteMany();
  await prisma.childModuleProgress.deleteMany();
  await prisma.childQuizSubmission.deleteMany();
  await prisma.quizOption.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.module.deleteMany();
  await prisma.child.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Admin LittleStep',
      email: 'admin@littlestep.test',
      password: await passwordService.hashPassword('admin123'),
      role: Role.ADMIN,
    },
  });

  const parent = await prisma.user.create({
    data: {
      name: 'Parent Demo',
      email: 'parent@littlestep.test',
      password: await passwordService.hashPassword('parent123'),
      role: Role.PARENT,
    },
  });

  const child = await prisma.child.create({
    data: {
      name: 'Nana',
      age: 6,
      avatar: 'avatar-cat.png',
      pin: null,
      parentId: parent.id,
    },
  });

  const colorModule = await prisma.module.create({
    data: {
      title: 'Warna',
      description: 'Belajar mengenal warna dasar dengan cara menyenangkan.',
      icon: 'color-wheel.png',
    },
  });

  const numberModule = await prisma.module.create({
    data: {
      title: 'Angka',
      description: 'Belajar mengenal angka dasar dari 1 sampai 10.',
      icon: 'numbers.png',
    },
  });

  const colorLesson1 = await prisma.lesson.create({
    data: {
      title: 'Mengenal Warna Merah',
      content: 'Warna merah adalah warna yang sering kita lihat pada apel, tomat, dan bunga mawar.',
      orderNumber: 1,
      moduleId: colorModule.id,
    },
  });

  const colorLesson2 = await prisma.lesson.create({
    data: {
      title: 'Mengenal Warna Biru',
      content: 'Warna biru adalah warna yang sering kita lihat pada langit dan laut.',
      orderNumber: 2,
      moduleId: colorModule.id,
    },
  });

  await prisma.lesson.create({
    data: {
      title: 'Mengenal Angka 1 sampai 5',
      content: 'Angka membantu kita menghitung benda di sekitar kita.',
      orderNumber: 1,
      moduleId: numberModule.id,
    },
  });

  const redQuiz = await prisma.quiz.create({
    data: {
      question: 'Mana benda yang biasanya berwarna merah?',
      explanation: 'Apel sering memiliki warna merah.',
      orderNumber: 1,
      points: 10,
      lessonId: colorLesson1.id,
      options: {
        create: [
          { optionText: 'Apel', isCorrect: true },
          { optionText: 'Langit', isCorrect: false },
          { optionText: 'Daun', isCorrect: false },
        ],
      },
    },
    include: {
      options: true,
    },
  });

  const blueQuiz = await prisma.quiz.create({
    data: {
      question: 'Apa warna langit saat cuaca cerah?',
      explanation: 'Saat cuaca cerah, langit biasanya terlihat biru.',
      orderNumber: 1,
      points: 10,
      lessonId: colorLesson2.id,
      options: {
        create: [
          { optionText: 'Merah', isCorrect: false },
          { optionText: 'Biru', isCorrect: true },
          { optionText: 'Kuning', isCorrect: false },
        ],
      },
    },
    include: {
      options: true,
    },
  });

  const colorBadge = await prisma.badge.create({
    data: {
      name: 'Warna Hebat',
      description: 'Badge untuk anak yang menyelesaikan latihan warna.',
      imageUrl: 'badge-color.png',
    },
  });

  const selectedRedOption = redQuiz.options.find((option) => option.isCorrect);

  if (!selectedRedOption) {
    throw new Error('Seed failed: correct option for red quiz was not found.');
  }

  await prisma.childQuizSubmission.create({
    data: {
      childId: child.id,
      quizId: redQuiz.id,
      selectedOptionId: selectedRedOption.id,
      isCorrect: true,
      // Field name follows your current schema: earnedPoint, not earnedPoints.
      earnedPoint: redQuiz.points,
    },
  });

  await prisma.childModuleProgress.create({
    data: {
      childId: child.id,
      moduleId: colorModule.id,
      completedLessons: 1,
      completedQuizzes: 1,
      totalPoints: redQuiz.points,
      status: ProgressStatus.IN_PROGRESS,
    },
  });

  await prisma.childBadge.create({
    data: {
      childId: child.id,
      badgeId: colorBadge.id,
    },
  });

  console.log('Seeding completed.');
  console.log('Demo accounts:');
  console.log('- Admin  : admin@littlestep.test / password123');
  console.log('- Parent : parent@littlestep.test / password123');
  console.log(`- Child  : ${child.name} / no PIN`);
  console.log(`Seeded quiz count: ${[redQuiz, blueQuiz].length}`);
}

main()
  .catch((error) => {
    console.error('Seeding failed.');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
