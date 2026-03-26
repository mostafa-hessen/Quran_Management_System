# 🗺️ خطوات تحويل ERD إلى جداول (Mapping to Relational Schema)

## نظام إدارة مكتب تحفيظ القرآن — Supabase (PostgreSQL)

---

## الخطوة 1: تحويل الكيانات القوية (Strong Entities) → جداول مستقلة

> **القاعدة:** كل كيان قوي (مستطيل بخط واحد) يتحول إلى جدول مستقل، والـ Primary Key بتاعه يبقى PK الجدول.

| الكيان في ERD         | اسم الجدول              | Primary Key            |
| --------------------- | ----------------------- | ---------------------- |
| USER                  | `users`                 | user_id (UUID)         |
| TEACHER               | `teachers`              | teacher_id (UUID)      |
| STUDENT               | `students`              | student_id (UUID)      |
| HALAQA                | `halaqat`               | halaqa_id (UUID)       |
| SESSION               | `sessions`              | session_id (UUID)      |
| HOMEWORK              | `homework`              | homework_id (UUID)     |
| SUBSCRIPTION          | `subscriptions`         | subscription_id (UUID) |
| MEMORIZATION PROGRESS | `memorization_progress` | id (UUID)              |

---

## الخطوة 2: تحويل الكيانات الضعيفة (Weak Entities) → جداول مع FK

> **القاعدة:** الكيان الضعيف يتحول لجدول، ويحتاج Foreign Key من الكيان المالك (Owner Entity). المفتاح الأساسي يكون مركب (Composite PK) أو يُستخدم UUID مستقل مع UNIQUE constraint.

| الكيان الضعيف       | اسم الجدول             | الكيان المالك      | FK                      |
| ------------------- | ---------------------- | ------------------ | ----------------------- |
| SCHEDULE            | `schedules`            | HALAQA             | halaqa_id               |
| ENROLLMENT          | `enrollments`          | STUDENT + HALAQA   | student_id, halaqa_id   |
| STUDENT ATTENDANCE  | `student_attendance`   | SESSION + STUDENT  | session_id, student_id  |
| TEACHER ATTENDANCE  | `teacher_attendance`   | SESSION + TEACHER  | session_id, teacher_id  |
| HOMEWORK SUBMISSION | `homework_submissions` | HOMEWORK + STUDENT | homework_id, student_id |
| PAYMENT             | `payments`             | SUBSCRIPTION       | subscription_id         |

---

## الخطوة 3: تحويل الصفات المركبة (Composite Attributes) → أعمدة منفصلة

> **القاعدة:** الصفة المركبة لا تُخزَّن كعمود واحد، بل تُفكَّك إلى أعمدة فرعية.

| الصفة المركبة  | في الكيان | الأعمدة الناتجة                                        |
| -------------- | --------- | ------------------------------------------------------ |
| name (Teacher) | TEACHER   | first_name, father_name, grandfather_name, family_name |
| name (Student) | STUDENT   | first_name, father_name, grandfather_name, family_name |

---

## الخطوة 4: تحويل الصفات متعددة القيم (Multi-valued Attributes) → جداول منفصلة أو Arrays

> **القاعدة:** كل صفة متعددة القيم (Double Ellipse) تتحول إلى جدول منفصل يحتوي FK من الكيان الأصلي + القيمة.
>
> **بديل في PostgreSQL:** ممكن نستخدم `TEXT[]` (Array) لو القيم بسيطة ومش محتاجين نعمل عليها queries معقدة.

| الصفة           | الكيان  | الحل المقترح                                                           |
| --------------- | ------- | ---------------------------------------------------------------------- |
| phones          | TEACHER | جدول `teacher_phones` (teacher_id FK, phone VARCHAR)                   |
| emails          | TEACHER | جدول `teacher_emails` (teacher_id FK, email VARCHAR)                   |
| specialization  | TEACHER | جدول `teacher_specializations` (teacher_id FK, specialization VARCHAR) |
| qualifications  | TEACHER | جدول `teacher_qualifications` (teacher_id FK, qualification VARCHAR)   |
| guardian_phones | STUDENT | جدول `student_guardian_phones` (student_id FK, phone VARCHAR)          |
| address         | STUDENT | عمود `address TEXT` (لو قيمة واحدة) أو جدول لو متعددة                  |

---

## الخطوة 5: التعامل مع الصفات المشتقة (Derived Attributes)

> **القاعدة:** الصفات المشتقة (Dashed Ellipse) لا تُخزَّن في قاعدة البيانات، بل تُحسب عند الحاجة.

| الصفة المشتقة | الكيان  | طريقة الحساب                                               |
| ------------- | ------- | ---------------------------------------------------------- |
| age           | STUDENT | `EXTRACT(YEAR FROM AGE(birth_date))` — يُحسب من birth_date |
| teacher_count | HALAQA  | `COUNT(*)` من جدول العلاقة teaches — يُحسب بـ Query        |

> **في Supabase:** ممكن نعملهم كـ Database Function أو View أو نحسبهم في الـ Frontend.

---

## الخطوة 6: تحويل العلاقات 1:M → وضع FK في جانب الـ Many

> **القاعدة:** في علاقة 
One-to-Many، 
نضع Foreign Key في الجدول اللي على جانب الـ M (الكتير).

| العلاقة      | من (1)       | إلى (M)               | FK يُضاف في                                                |
| ------------ | ------------ | --------------------- | ---------------------------------------------------------- |
| has_account  | USER         | TEACHER               | `teachers.user_id → users.user_id`                         |
| teaches      | TEACHER      | HALAQA                | `halaqat.teacher_id → teachers.teacher_id`                 |
| has_schedule | HALAQA       | SCHEDULE              | `schedules.halaqa_id → halaqat.halaqa_id`                  |
| conducts     | HALAQA       | SESSION               | `sessions.halaqa_id → halaqat.halaqa_id`                   |
| assigns      | SESSION      | HOMEWORK              | `homework.session_id → sessions.session_id`                |
| subscribes   | STUDENT      | SUBSCRIPTION          | `subscriptions.student_id → students.student_id`           |
| has_payment  | SUBSCRIPTION | PAYMENT               | `payments.subscription_id → subscriptions.subscription_id` |
| tracks       | STUDENT      | MEMORIZATION PROGRESS | `memorization_progress.student_id → students.student_id`   |
| evaluates    | TEACHER      | MEMORIZATION PROGRESS | `memorization_progress.teacher_id → teachers.teacher_id`   |

---

## الخطوة 7: تحويل العلاقات M:M → جدول وسيط (Junction Table)

> **القاعدة:** علاقة Many-to-Many تتحول لجدول وسيط يحتوي FK من الجدولين + أي صفات خاصة بالعلاقة.

| العلاقة                             | بين                | الجدول الوسيط          | أعمدته                                                                |
| ----------------------------------- | ------------------ | ---------------------- | --------------------------------------------------------------------- |
| Student Enrolls + Enrolled In       | STUDENT ↔ HALAQA   | `enrollments`          | student_id FK, halaqa_id FK, join_date, subscription_status           |
| Session Stud_Att + Student Attends  | SESSION ↔ STUDENT  | `student_attendance`   | session_id FK, student_id FK, attendance_status, notes                |
| Session Teach_Att + Teacher Attends | SESSION ↔ TEACHER  | `teacher_attendance`   | session_id FK, teacher_id FK, attendance_status, notes                |
| HW Submission + Student Submits     | HOMEWORK ↔ STUDENT | `homework_submissions` | homework_id FK, student_id FK, grade, evaluation, submitted_at, notes |

---

## ✅ ملخص الجداول النهائية (بالترتيب الصحيح للإنشاء)

```
الترتيب مهم! — لأن كل جدول بيعتمد على اللي قبله (Foreign Keys)

1.  users                      ← لا يعتمد على أي جدول
2.  teachers                   ← يعتمد على users
3.  students                   ← مستقل
4.  halaqat                    ← يعتمد على teachers
5.  schedules                  ← يعتمد على halaqat
6.  sessions                   ← يعتمد على halaqat
7.  enrollments                ← يعتمد على students + halaqat
8.  student_attendance         ← يعتمد على sessions + students
9.  teacher_attendance         ← يعتمد على sessions + teachers
10. homework                   ← يعتمد على sessions
11. homework_submissions       ← يعتمد على homework + students
12. subscriptions              ← يعتمد على students
13. payments                   ← يعتمد على subscriptions
14. memorization_progress      ← يعتمد على students + teachers
15. teacher_phones             ← يعتمد على teachers
16. teacher_emails             ← يعتمد على teachers
17. teacher_specializations    ← يعتمد على teachers
18. teacher_qualifications     ← يعتمد على teachers
19. student_guardian_phones    ← يعتمد على students
```

---

## 🎯 ملاحظات خاصة بـ Supabase

1. **استخدم `UUID` كـ Primary Key** — Supabase يدعمه بشكل افتراضي عبر `gen_random_uuid()`
2. **أضف `created_at TIMESTAMPTZ DEFAULT NOW()`** لكل جدول
3. **فعّل RLS (Row Level Security)** من البداية
4. **استخدم Supabase Auth** بدلاً من تخزين passwords يدوياً — جدول `users` يُربط بـ `auth.users`
5. **الصفات المتعددة القيم:** ممكن تستخدم `TEXT[]` بدل جداول منفصلة لو بسيطة
