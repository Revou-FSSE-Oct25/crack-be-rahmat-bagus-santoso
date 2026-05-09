# Backend Work Plan - LittleStep
_Dibuat berdasarkan review menyeluruh codebase, brief project, dan keputusan arsitektur yang sudah disepakati._

---

## Aturan Status

- `AMAN` = 100% selesai, tidak ada catatan typo, mismatch logic, wiring, atau hal yang meragukan.
- `TIDAK AMAN` = masih ada kesalahan, gap implementasi, mismatch dengan brief, atau belum selesai.
- `PERLU MIGRASI` = membutuhkan perubahan schema Prisma dan migration baru sebelum bisa dikerjakan.

---

## Keputusan Arsitektur yang Sudah Disepakati

- Model: `1 parent : many children`
- Child tidak punya akun sendiri — child adalah "profile" milik parent (Netflix-style)
- Child tidak pakai JWT terpisah — semua aksi child dilakukan melalui parent JWT
- `childId` selalu diambil dari URL param, bukan dari request body
- PIN child bersifat opsional
- Admin dikerjakan setelah flow parent + child + learning stabil
- Badge terikat ke module (1 module = 1 badge) — **butuh migration**

---

## Phase 1: Dependency & Konfigurasi Environment

Status: `AMAN`

Yang sudah ada dan sudah benar:
- NestJS core, Prisma + PostgreSQL adapter, JWT + Passport
- bcrypt, class-validator, class-transformer, Swagger, ConfigModule global
- `prisma.config.ts` aktif dan valid
- `railway.json` untuk deployment

Tidak ada yang perlu diinstall atau diubah di phase ini.

---

## Phase 2: Prisma Schema & Migration

Status: `PERLU MIGRASI`

Yang sudah ada dan sudah benar:
- Model `User`, `Child`, `Module`, `Lesson`, `Quiz`, `QuizOption`
- Model `ChildQuizSubmission`, `ChildModuleProgress`, `Badge`, `ChildBadge`
- Enum `Role` (ADMIN, PARENT) dan `ProgressStatus`
- Relasi, index, dan `@@unique` sudah tepat
- 1 migration awal sudah sinkron dengan schema saat ini

Yang harus diubah sebelum lanjut:

**Tambahkan field `moduleId` di model `Badge`**

Alasan: Badge harus terikat ke module. Saat child menyelesaikan semua quiz
dalam satu module, backend tahu badge mana yang harus diberikan berdasarkan
`moduleId` dari module yang baru saja selesai.

Perubahan di `schema.prisma`:
```prisma
model Badge {
  id          String  @id @default(uuid())
  name        String
  description String?
  imageUrl    String?

  moduleId String  @unique @map("module_id")   // <-- tambahkan ini
  module   Module  @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  childBadges ChildBadge[]

  @@map("badges")
}

model Module {
  // ... field yang sudah ada ...
  badge Badge?   // <-- tambahkan relasi balik ini
}
```

Setelah edit schema, jalankan:
```bash
npx prisma migrate dev --name add_module_id_to_badge
npx prisma generate
```

---

## Phase 3: Auth Module

Status: `AMAN`

Yang sudah ada dan sudah benar:
- `POST /auth/register` — register parent
- `POST /auth/login` — login parent/admin, return JWT
- `POST /auth/logout` — stateless logout
- `JwtStrategy`, `JwtAuthGuard`, `RolesGuard`
- Decorator `@Public()` dan `@Roles()`
- Password di-hash dengan bcrypt
- JWT payload: `{ sub: userId, email, role }`
- `AuthenticatedRequest` type sudah benar

Tidak ada yang perlu diubah.

---

## Phase 4: Users Module

Status: `AMAN`

Yang sudah ada dan sudah benar:
- `GET /user/profile` — parent lihat profile sendiri
- `PATCH /user/profile` — parent update profile
- `DELETE /user/delete` — parent hapus akun
- `UsersRepository`, `UsersService`, `UsersController` sudah terhubung
- `SafeUser` (tanpa field password) sudah diterapkan
- Email conflict check saat update sudah ada
- `UsersModule` export `UsersService` ke `AuthModule`

Tidak ada yang perlu diubah.

---

## Phase 5: Children Module

Status: `AMAN`

Yang sudah ada dan sudah benar:
- `POST /children` — parent buat child
- `GET /children` — parent lihat semua child miliknya
- `GET /children/:childId` — parent lihat detail child
- `PATCH /children/:childId` — parent update child
- `DELETE /children/:childId` — parent hapus child
- `POST /children/:childId/access` — akses child (validasi PIN opsional)
- Ownership check: parent hanya bisa akses child miliknya sendiri
- `parentId` diambil dari JWT, bukan body
- `SafeChild` (tanpa field pin) sudah diterapkan

Yang sudah difix di sesi ini:
- Import path `src/prisma.service` → `../prisma.service` sudah benar
- `ChildrenModule` sudah export `ChildrenService`

Tidak ada yang perlu diubah lagi.

---

## Phase 6: Prisma Seed

Status: `TIDAK AMAN`

Yang sudah ada:
- Struktur seed sudah benar: clear data → seed users → seed children → seed modules → seed lessons → seed quizzes → seed progress → seed badges
- Data dummy sudah relevan dengan brief LittleStep

Yang harus difix:

**1. Hapus import `PasswordService` dari NestJS, ganti pakai bcrypt langsung**
```ts
// Hapus ini
import { PasswordService } from '../src/password/password.service';
const passwordService = new PasswordService();

// Ganti jadi ini
import bcrypt from 'bcrypt';
const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
```

**2. Fix field name yang salah**
```ts
// Salah
earnedPoint: redQuiz.points,

// Benar (sesuai schema)
earnedPoints: redQuiz.points,
```

**3. Fix password di console.log agar sesuai dengan yang di-seed**
```ts
// Sesuaikan dengan password yang benar-benar dipakai di atas
console.log('- Admin  : admin@littlestep.test / admin123');
console.log('- Parent : parent@littlestep.test / parent123');
```

**4. Sesuaikan seed Badge dengan schema baru setelah migration**

Setelah field `moduleId` ditambahkan ke `Badge`, seed harus menyertakan `moduleId`:
```ts
const colorBadge = await prisma.badge.create({
  data: {
    name: 'Warna Hebat',
    description: 'Badge untuk anak yang menyelesaikan semua quiz modul warna.',
    imageUrl: 'badge-color.png',
    moduleId: colorModule.id,  // <-- tambahkan ini
  },
});
```

**5. Aktifkan seed di `prisma.config.ts`**
```ts
migrations: {
  path: 'prisma/migrations',
  seed: 'tsx prisma/seed.ts',  // <-- uncomment baris ini
},
```

Setelah semua fix, jalankan:
```bash
npx prisma db seed
```

---

## Phase 7: Admin — Content Management

Status: `TIDAK AMAN`

Admin mengelola semua konten belajar. Semua endpoint di phase ini wajib
menggunakan `@Roles(Role.ADMIN)`.

Yang harus dikerjakan (dari nol, karena `AdminModule` masih boilerplate):

### 7a. Module CRUD
- `POST /admin/modules` — buat module baru
- `PATCH /admin/modules/:moduleId` — edit module
- `DELETE /admin/modules/:moduleId` — hapus module

### 7b. Lesson CRUD
- `POST /admin/modules/:moduleId/lessons` — buat lesson di module tertentu
- `PATCH /admin/lessons/:lessonId` — edit lesson
- `DELETE /admin/lessons/:lessonId` — hapus lesson

### 7c. Quiz CRUD
- `POST /admin/lessons/:lessonId/quizzes` — buat quiz di lesson tertentu
- `PATCH /admin/quizzes/:quizId` — edit quiz
- `DELETE /admin/quizzes/:quizId` — hapus quiz

### 7d. Quiz Option CRUD
- `POST /admin/quizzes/:quizId/options` — buat option untuk quiz
- `PATCH /admin/options/:optionId` — edit option
- `DELETE /admin/options/:optionId` — hapus option

Catatan penting:
- `CreateOptionDto` masih kosong — harus diisi dengan field `optionText` dan `isCorrect`
- `OptionsModule` masih boilerplate tanpa `PrismaService` dan repository
- `AdminModule` saat ini masih scaffold NestJS default, harus dikerjakan ulang
- Endpoint read (GET) untuk module dan lesson sudah ada di public controller,
  tidak perlu dibuat lagi di admin

### 7e. Badge CRUD
- `POST /admin/badges` — buat badge (terikat ke moduleId)
- `PATCH /admin/badges/:badgeId` — edit badge
- `DELETE /admin/badges/:badgeId` — hapus badge

---

## Phase 8: Learning Flow — Submission & Progress

Status: `TIDAK AMAN`

Ini adalah inti dari aplikasi LittleStep. Semua endpoint di phase ini
membutuhkan parent JWT dan `childId` dari URL.

### 8a. Submit Quiz
- `POST /children/:childId/quizzes/:quizId/submit`

Logic yang harus diimplementasikan:
1. Validasi child milik parent yang login
2. Validasi quiz ada dan `selectedOptionId` valid milik quiz tersebut
3. Cek apakah child sudah pernah submit quiz ini (1 submission per quiz — tolak jika sudah ada)
4. Tentukan `isCorrect` dari field `isCorrect` pada option yang dipilih
5. Hitung `earnedPoints`: jika benar → ambil dari `quiz.points`, jika salah → 0
6. Simpan `ChildQuizSubmission`
7. Panggil logic update progress (lihat 8b)
8. Return hasil submission

Catatan:
- `SubmissionsService` masih boilerplate kosong — harus dikerjakan dari nol
- `SubmissionsModule` belum punya `PrismaService` dan repository
- `SubmissionsRepository` sudah ada tapi masih kosong

### 8b. Update Module Progress (dipanggil otomatis setelah submit)

Logic:
1. Cari atau buat record `ChildModuleProgress` untuk kombinasi `childId + moduleId`
2. Hitung ulang total quiz yang sudah dijawab child di module ini
3. Update `completedQuizzes` dan `totalPoints`
4. Bandingkan dengan total quiz yang ada di module
5. Jika semua quiz selesai → set `status = COMPLETED`, panggil logic badge (8c)
6. Jika belum → set `status = IN_PROGRESS`

### 8c. Berikan Badge (dipanggil otomatis saat module COMPLETED)

Logic:
1. Cari badge yang `moduleId`-nya sesuai dengan module yang baru saja selesai
2. Jika badge ada dan child belum punya badge itu → buat record `ChildBadge`
3. Jika tidak ada badge untuk module itu → skip, tidak error

---

## Phase 9: Parent Dashboard

Status: `TIDAK AMAN`

Parent perlu melihat perkembangan belajar child-nya.

### 9a. Progress child per module
- `GET /children/:childId/progress`

Response yang diharapkan:
```json
[
  {
    "moduleId": "...",
    "moduleTitle": "Warna",
    "completedQuizzes": 2,
    "totalPoints": 20,
    "status": "COMPLETED"
  }
]
```

### 9b. Badge yang dimiliki child
- `GET /children/:childId/badges`

Response yang diharapkan:
```json
[
  {
    "badgeId": "...",
    "badgeName": "Warna Hebat",
    "earnedAt": "2026-05-01T..."
  }
]
```

Catatan:
- Kedua endpoint ini harus memvalidasi ownership child (parent hanya bisa lihat child miliknya)
- Bisa diletakkan di `ChildrenController` karena konteksnya adalah "parent melihat data child"

---

## Phase 10: Swagger Documentation

Status: `TIDAK AMAN`

Yang sudah ada:
- Setup Swagger di `main.ts` sudah benar
- Beberapa endpoint sudah pakai `@ApiOperation` dan `@ApiTags`

Yang harus dilengkapi setelah semua endpoint selesai:
- Semua endpoint yang belum punya `@ApiOperation` harus ditambahkan
- Semua DTO yang belum punya `@ApiProperty` description yang jelas harus dilengkapi
- `CreateOptionDto` yang masih kosong harus diisi dan diberi `@ApiProperty`
- Pastikan semua endpoint protected sudah pakai `@ApiBearerAuth('authBearer')`

---

## Phase 11: Deployment

Status: `TIDAK AMAN`

Yang sudah ada:
- `railway.json` dengan start command yang benar:
  `npx prisma migrate deploy && node dist/src/main`
- Script `start:prod` di `package.json` sudah benar

Yang harus dipastikan sebelum deploy:
- Semua environment variable di Railway sudah diset: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- `npm run build` lolos tanpa error
- Seed tidak dijalankan otomatis saat deploy (seed hanya untuk development)
- Health check path `/` di `railway.json` perlu diuji — pastikan app merespons di root path

---

## Urutan Pengerjaan yang Direkomendasikan

```
Phase 2  → Tambah moduleId ke Badge, buat migration
Phase 6  → Fix seed.ts, jalankan seed untuk punya data dummy
Phase 7  → Admin CRUD (module, lesson, quiz, option, badge)
Phase 8  → Submission, progress, badge otomatis
Phase 9  → Parent dashboard (progress & badge child)
Phase 10 → Lengkapi Swagger
Phase 11 → Deploy
```

Phase 1, 3, 4, 5 tidak perlu disentuh lagi.

---

## Ringkasan Status

| Phase | Deskripsi | Status |
|-------|-----------|--------|
| 1 | Dependency & Environment | `AMAN` |
| 2 | Prisma Schema & Migration | `PERLU MIGRASI` |
| 3 | Auth Module | `AMAN` |
| 4 | Users Module | `AMAN` |
| 5 | Children Module | `AMAN` |
| 6 | Seed | `TIDAK AMAN` |
| 7 | Admin Content Management | `TIDAK AMAN` |
| 8 | Submission & Progress | `TIDAK AMAN` |
| 9 | Parent Dashboard | `TIDAK AMAN` |
| 10 | Swagger Documentation | `TIDAK AMAN` |
| 11 | Deployment | `TIDAK AMAN` |
