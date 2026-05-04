# Backend Work Plan - LittleStep

Dokumen ini adalah peta kerja backend LittleStep berdasarkan:

- brief project LittleStep,
- histori diskusi project,
- kondisi codebase backend saat ini,
- keputusan arsitektur sementara:
  `1 parent : many children`,
  child login tanpa email/password,
  PIN child opsional untuk sekarang,
  admin dikerjakan setelah flow parent + child stabil.

## Aturan Status

- `AMAN` = 100% selesai dan tidak ada catatan typo, mismatch logic, wiring, atau hal yang meragukan.
- `TIDAK AMAN` = masih ada kesalahan, gap implementasi, mismatch dengan brief, atau belum selesai.

## Checklist Phase Backend

### Phase 1: Instalasi dependency / library dan konfigurasi environment backend
Status: `AMAN`

Yang sudah ada:
- NestJS core packages
- Prisma + PostgreSQL adapter
- JWT + Passport
- bcrypt
- class-validator + class-transformer
- Swagger
- `ConfigModule.forRoot({ isGlobal: true })`
- file `.env.example` sebagai dokumentasi environment variable backend

Keputusan phase ini:
- Tidak perlu install package backend baru untuk mulai mengerjakan core MVP LittleStep.
- Dependency yang sudah ada sudah cukup untuk flow parent auth, child management, dan fondasi learning flow.
- Package tambahan seperti upload file, caching, queue, atau library admin khusus belum dibutuhkan pada tahap ini.

Catatan akhir:
- Phase ini dinyatakan `AMAN` karena dependency inti backend MVP sudah tersedia.
- Semua environment variable yang saat ini wajib untuk backend sudah terdokumentasi di `.env.example`.
- Nama variable environment sudah konsisten dengan yang dipakai di codebase.
- `PORT` tidak wajib ditulis di env karena sudah memiliki fallback `3000` di code.

### Phase 2: Prisma
Status: `AMAN`

Yang sudah ada:
- `PrismaService` dengan `PrismaClient`
- adapter PostgreSQL melalui `PrismaPg`
- `User`
- `Child`
- `Module`
- `Lesson`
- `Quiz`
- `QuizOption`
- `ChildQuizSubmission`
- `ChildModuleProgress`
- `Badge`
- `ChildBadge`
- 1 migration awal yang sudah sinkron dengan schema terbaru

Yang sudah sesuai arah brief:
- relasi `1 parent : many children`
- struktur dasar module -> lesson -> quiz
- progress, point, badge dasar

Catatan akhir:
- Konfigurasi Prisma aktif valid melalui `prisma.config.ts`.
- Schema Prisma sudah sesuai dengan arah MVP LittleStep saat ini.
- `User` dan `Child` tetap dipisah dan tidak memakai self-reference.
- Progress MVP tetap disimpan per module.
- Migration sudah dibersihkan dan disinkronkan ulang menjadi 1 migration awal yang sesuai dengan schema terbaru.


### Phase 3: Auth module, JWT, strategy, guards
Status: `AMAN`

Yang sudah ada:
- register parent/basic user
- login user dengan JWT
- `JwtStrategy`
- `JwtAuthGuard`
- `RolesGuard`
- decorator `@Public()` dan `@Roles()`
- hashing password user dengan bcrypt
- compare password untuk login parent/admin

Catatan:
- Fondasi auth sudah ada di [src/auth](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/src/auth).
- Service dasar password ada di [src/password/password.service.ts](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/src/password/password.service.ts:1).
- Tipe `sub` di [src/auth/jwt.strategy.ts](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/src/auth/jwt.strategy.ts:6) sudah mengikuti `User.id` bertipe `string`.
- Auth saat ini secara sengaja difokuskan untuk parent/admin, bukan untuk child.
- Boundary auth parent/admin dan child sudah jelas di level perencanaan: child tidak masuk ke jalur JWT yang sama.
- Logout untuk MVP memakai pendekatan JWT stateless: frontend menghapus access token setelah logout.
- Verifikasi dasar `npm run build` sudah lolos.

### Phase 4: Users module
Status: `AMAN`

Yang sudah ada:
- `UsersController`
- `UsersService`
- `UsersRepository`
- DTO create/update user

Catatan penting:
- Wiring module di [src/users/users.module.ts](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/src/users/users.module.ts:1) sudah dilengkapi untuk kebutuhan saat ini.
- `UsersRepository`, `PasswordModule`, dan `PrismaService` sudah terhubung untuk mendukung `UsersService`.
- `UsersService` sudah diexport dan bisa dipakai oleh `AuthModule`.
- Entity `User` saat ini sengaja dibuat minimal agar tidak bergantung ke module child yang belum dikerjakan.
- Verifikasi dasar `npm run build` sudah lolos.

### Phase 5: Parent dan child account management
Status: `AMAN`

Flow yang dimaksud:
- parent register
- parent login
- parent lihat profile
- parent update profile
- parent delete account bila memang dibutuhkan
- parent create child
- parent lihat daftar child miliknya
- parent lihat detail child
- parent update child
- parent delete child

Catatan:
- Fondasi parent account sudah ada melalui auth dan profile user yang sudah berjalan.
- Child management sudah memiliki module, DTO, repository, service, dan controller.
- Ownership check child sudah diterapkan: parent hanya bisa mengakses child miliknya sendiri.
- `parentId` diambil dari JWT user yang login, bukan dari request body.
- Verifikasi dasar `npm run build` sudah lolos.

### Phase 6: Child login / access flow
Status: `AMAN`

Flow yang dimaksud:
- child pilih profile
- child masuk ke session belajar
- PIN opsional jika diaktifkan

Catatan:
- Brief sudah jelas: child tidak login dengan email/password.
- Flow access child untuk MVP sudah diputuskan sebagai child selection melalui parent yang sedang login.
- Ownership child tetap divalidasi melalui parent JWT.
- PIN child bersifat opsional: jika child tidak memiliki PIN maka akses langsung berhasil, jika child memiliki PIN maka PIN wajib cocok.
- Belum memakai session table atau token child terpisah, sesuai scope MVP saat ini.
- Verifikasi dasar `npm run build` sudah lolos.

### Phase 7: Learning content domain
Status: `AMAN`

Yang dimaksud:
- list module
- detail module
- struktur module untuk child browsing
- list lesson per module
- detail lesson
- quiz per lesson
- quiz options
- jawaban child

Catatan:
- Model `Module`, `Lesson`, `Quiz`, dan `QuizOption` sudah ada.
- Layer NestJS untuk module, lesson, dan quiz read-side sudah tersedia.
- `Module` dan `Lesson` saat ini dibuka sebagai endpoint public untuk kebutuhan browse/preview content.
- `Quiz` diakses melalui lesson dan tetap protected agar sesuai flow mulai belajar.
- Query lesson dan quiz sudah mengikuti urutan `orderNumber ASC`.
- Query quiz sudah menyertakan `options`.
- Phase ini masih fokus read-side content, belum mencakup submit jawaban dan progress.
- Verifikasi dasar `npm run build` sudah lolos.

### Phase 8: Child progress, point, badge
Status: `TIDAK AMAN`

Yang dimaksud:
- simpan jawaban child
- hitung point
- update progress module
- berikan badge saat syarat terpenuhi

Catatan:
- Model `ChildQuizSubmission`, `ChildModuleProgress`, dan `Badge` sudah ada.
- Belum ada service logic untuk progress calculation.
- Belum ada keputusan final apakah badge diberikan per module, global, atau aturan lain.

### Phase 9: Parent dashboard data
Status: `TIDAK AMAN`

Yang dimaksud:
- parent melihat progress child
- parent melihat point dan badge dasar

Catatan:
- Ini bagian penting brief, tetapi belum ada endpoint agregasi/dashboard khusus parent.

### Phase 10: Role-based authorization
Status: `TIDAK AMAN`

Yang dimaksud:
- pembatasan akses parent
- pembatasan akses admin
- boundary child flow

Catatan:
- `RolesGuard` sudah ada.
- Namun pemakaian role restriction di controller belum matang.
- Child actor belum punya boundary auth sendiri.

### Phase 11: Admin module dan content management
Status: `TIDAK AMAN`

Yang dimaksud:
- admin CRUD module
- admin CRUD lesson
- admin CRUD quiz
- admin CRUD badge bila diperlukan

Catatan:
- [src/admin](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/src/admin) masih scaffold dasar.
- Untuk sekarang dianggap belum dikerjakan, bukan target aktif phase inti.

### Phase 12: API documentation
Status: `TIDAK AMAN`

Yang sudah ada:
- Swagger setup di [src/main.ts](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/src/main.ts:20)

Catatan:
- Fondasi dokumentasi ada.
- Belum aman karena banyak endpoint domain LittleStep belum ada.
- Deskripsi request/response juga belum lengkap.

### Phase 13: Seeding dan mock data
Status: `TIDAK AMAN`

Yang dimaksud:
- seed parent
- seed child
- seed module
- seed lesson
- seed quiz

Catatan:
- Script seed sudah mulai ada di [prisma/seed.ts](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/prisma/seed.ts:1), tetapi belum rapi dan belum sinkron sepenuhnya dengan schema terbaru.
- Phase ini tetap `TIDAK AMAN` sampai seed benar-benar bisa dipakai dengan yakin.

### Phase 14: Testing backend
Status: `TIDAK AMAN`

Catatan:
- Sesuai keputusan saat ini, testing formal boleh ditunda sampai fondasi backend lebih stabil.
- Tetapi kondisi test sekarang memang belum aman.
- Import path file spec masih salah, sehingga `npm test` gagal.

### Phase 15: Deployment readiness backend
Status: `TIDAK AMAN`

Yang sudah ada:
- [railway.json](/home/cinnamon/Desktop/revou/CRACK/crack-be-rahmat-bagus-santoso/railway.json:1)

Catatan:
- Deploy config mulai ada.
- Belum aman karena fitur inti backend belum stabil dan environment documentation belum rapi.

## Yang Dipertahankan

- Arah domain schema Prisma saat ini, karena sudah dekat dengan brief LittleStep.
- Relasi `1 parent : many children`.
- Pemisahan konsep `User` dan `Child`.
- Auth parent berbasis email/password + JWT.
- Gagasan child access terpisah dari parent auth.
- Penggunaan `ValidationPipe`, Swagger, JWT guard, dan roles guard sebagai fondasi NestJS.

## Yang Perlu Direvisi

- Wiring `UsersModule` agar dependency injection benar.
- Kontrak `UsersModule` dan `AuthModule`, termasuk export provider yang memang dipakai lintas module.
- Tipe JWT payload agar selaras dengan `User.id` string UUID.
- Pemisahan tegas antara flow parent auth dan child access flow.
- Desain register parent vs create child agar tidak ambigu.
- Rencana endpoint agar mengikuti urutan MVP parent-child, bukan generic CRUD dulu.
- Dokumentasi environment pada `.env.example`.
- Posisi admin: tetap diparkir setelah flow parent-child, cukup disiapkan boundary-nya dulu.

## Urutan Endpoint yang Dikerjakan

Urutan ini disusun untuk menyelesaikan core flow parent + child lebih dulu.

### Batch 1: Parent auth foundation
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /user/profile`
- `PATCH /user/profile`

### Batch 2: Parent manages children
- `POST /children`
- `GET /children`
- `GET /children/:childId`
- `PATCH /children/:childId`
- `DELETE /children/:childId`

### Batch 3: Child access flow
- `GET /children/:childId/access`
- `POST /children/:childId/login`
- `POST /children/:childId/logout`

Catatan:
- Nama endpoint child access masih bisa disesuaikan.
- Yang penting, child flow jangan dipaksa masuk ke auth parent JWT yang sama.

### Batch 4: Learning read flow
- `GET /modules`
- `GET /modules/:moduleId`
- `GET /modules/:moduleId/lessons`
- `GET /lessons/:lessonId`
- `GET /lessons/:lessonId/quizzes`

### Batch 5: Learning action flow
- `POST /quizzes/:quizId/submissions`
- `GET /children/:childId/progress`
- `GET /children/:childId/badges`

### Batch 6: Parent dashboard
- `GET /parent/dashboard`
- `GET /parent/children/:childId/progress`

### Batch 7: Admin later
- `POST /admin/modules`
- `PATCH /admin/modules/:moduleId`
- `DELETE /admin/modules/:moduleId`
- dan seterusnya untuk lesson, quiz, badge

## Urutan Schema dan Service yang Disentuh

Urutan ini dibuat agar perubahan tidak meloncat-loncat.

### Langkah 1: Fondasi yang disentuh lebih dulu
- `User`
- auth DTO
- `JwtStrategy`
- `UsersModule`
- `AuthModule`
- `PasswordModule`

Tujuan:
- membereskan wiring dasar,
- membereskan auth parent,
- memastikan dependency injection benar.

### Langkah 2: Domain child
- `Child`
- child DTO
- child repository
- child service
- child controller

Tujuan:
- parent bisa mengelola child,
- child entity mulai aktif dipakai oleh application layer.

### Langkah 3: Child access/session
- desain session child
- endpoint child login/logout
- optional PIN logic

Tujuan:
- child bisa masuk ke area belajar tanpa mencampur auth parent.

### Langkah 4: Learning content read side
- `Module`
- `Lesson`
- `Quiz`
- `QuizOption`
- service read-side untuk child

Tujuan:
- child bisa browse module, buka lesson, dan melihat quiz.

### Langkah 5: Learning progress write side
- `ChildQuizSubmission`
- `ChildModuleProgress`
- `Badge`
- `ChildBadge`

Tujuan:
- jawaban child tersimpan,
- point terhitung,
- progress terupdate,
- badge bisa diberikan.

### Langkah 6: Parent dashboard aggregation
- service khusus parent dashboard
- query agregasi progress child

Tujuan:
- parent bisa melihat hasil belajar child dengan data yang sudah bermakna.

### Langkah 7: Admin
- admin module
- module management
- lesson management
- quiz management
- badge management

Tujuan:
- setelah core flow stabil, baru masuk content management penuh.

## Rekomendasi Fokus Pengerjaan Sekarang

Fokus backend berikutnya sebaiknya:

1. bereskan fondasi yang sudah ada tapi masih mismatch,
2. pastikan auth parent stabil,
3. lanjut ke child management,
4. lanjut ke child access flow,
5. lanjut ke learning flow,
6. admin belakangan.

## Kesimpulan Status Backend Saat Ini

Secara umum backend LittleStep saat ini masih berada pada tahap:

- fondasi domain sudah mulai terbentuk,
- fondasi auth sudah mulai ada,
- tetapi wiring module, boundary actor, dan flow parent-child belum selesai.

Kesimpulan akhir:
- schema domain: cukup menjanjikan
- application layer: belum stabil
- urutan kerja terbaik: selesaikan `parent + child core flow` dulu
- status keseluruhan backend saat ini: `TIDAK AMAN`
