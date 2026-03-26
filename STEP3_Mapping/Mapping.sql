

CREATE TABLE public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role        TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'teacher')),
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.teachers (
    teacher_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id       UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    first_name       TEXT NOT NULL,
    father_name      TEXT,
    grandfather_name TEXT,
    family_name      TEXT NOT NULL,
    birth_date       DATE,
    hire_date        DATE,
    status           TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.students (
    student_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name       TEXT NOT NULL,
    father_name      TEXT,
    grandfather_name TEXT,
    family_name      TEXT NOT NULL,
    birth_date       DATE,
    gender           TEXT CHECK (gender IN ('ذكر', 'أنثى')),
    address          TEXT,
    status           TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.halaqat (
    halaqa_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id  UUID REFERENCES public.teachers(teacher_id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    level       TEXT CHECK (level IN ('مبتدئ', 'متوسط', 'متقدم')),
    capacity    INTEGER NOT NULL DEFAULT 15,
    location    TEXT,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sessions (
    session_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    halaqa_id    UUID NOT NULL REFERENCES public.halaqat(halaqa_id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    status       TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.homework (
    homework_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id   UUID NOT NULL REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    description  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK (type IN ('شهري', 'سنوي')),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    total_amount    NUMERIC(10, 2) NOT NULL,
    status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.memorization_progress (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id  UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    teacher_id  UUID REFERENCES public.teachers(teacher_id) ON DELETE SET NULL,
    surah       TEXT NOT NULL,
    ayah        INTEGER,
    pages_count NUMERIC(5, 1),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ✅ الخطوة 2: الكيانات الضعيفة (Weak Entities)
-- ============================================================

CREATE TABLE public.schedules (
    schedule_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    halaqa_id    UUID NOT NULL REFERENCES public.halaqat(halaqa_id) ON DELETE CASCADE,
    day_of_week  TEXT NOT NULL CHECK (day_of_week IN ('السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة')),
    start_time   TIME NOT NULL,
    end_time     TIME NOT NULL,
    CONSTRAINT check_times CHECK (end_time > start_time)
);

CREATE TABLE public.payments (
    payment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(subscription_id) ON DELETE CASCADE,
    payment_date    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount          NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    method          TEXT NOT NULL CHECK (method IN ('نقدي', 'تحويل', 'آخر')),
    status          TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    receipt_number  TEXT UNIQUE,
    notes           TEXT
);

-- ============================================================
-- ✅ الخطوة 7: تحويل العلاقات M:M → جداول وسيطة (Junction Tables)
-- ============================================================

-- 1. ربط الطالب بالحلقات (ENROLLMENT)
CREATE TABLE public.enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id    UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    halaqa_id     UUID NOT NULL REFERENCES public.halaqat(halaqa_id) ON DELETE CASCADE,
    join_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    subscription_status TEXT DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active', 'inactive')),
    UNIQUE (student_id, halaqa_id)
);

-- 2. حضور الطلاب (STUDENT ATTENDANCE)
CREATE TABLE public.student_attendance (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id    UUID NOT NULL REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    student_id    UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    status        TEXT NOT NULL CHECK (status IN ('حاضر', 'غائب', 'بعذر', 'متأخر')),
    notes         TEXT,
    UNIQUE (session_id, student_id)
);

-- 3. حضور المعلمين (TEACHER ATTENDANCE)
CREATE TABLE public.teacher_attendance (
    attendance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id    UUID NOT NULL REFERENCES public.sessions(session_id) ON DELETE CASCADE,
    teacher_id    UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    status        TEXT NOT NULL CHECK (status IN ('حاضر', 'غائب', 'بعذر')),
    notes         TEXT,
    UNIQUE (session_id, teacher_id)
);

-- 4. تسليمات الواجبات (HOMEWORK SUBMISSIONS)
CREATE TABLE public.homework_submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id   UUID NOT NULL REFERENCES public.homework(homework_id) ON DELETE CASCADE,
    student_id    UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    grade        INTEGER CHECK (grade >= 0 AND grade <= 100),
    evaluation   TEXT CHECK (evaluation IN ('ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف')),
    notes        TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (homework_id, student_id)
);

-- ============================================================
-- ✅ الخطوة 4: الصفات متعددة القيم (Multi-valued Attributes)
-- ============================================================

CREATE TYPE public.contact_label AS ENUM ('شخصي', 'عمل', 'واتساب', 'منزل', 'أساسي', 'أخرى');
CREATE TYPE public.specialization_type AS ENUM ('تجويد', 'حفظ', 'مراجعة', 'تلاوة', 'أخرى');
CREATE TYPE public.relation_type AS ENUM ('أب', 'أم', 'جد', 'جدة', 'أخ', 'أخت', 'ولي أمر', 'آخر');

CREATE TABLE public.teacher_phones (
    phone_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    phone      TEXT NOT NULL,
    label      public.contact_label DEFAULT 'شخصي'
);

CREATE TABLE public.teacher_emails (
    email_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    email      TEXT NOT NULL,
    label      public.contact_label DEFAULT 'شخصي'
);

CREATE TABLE public.teacher_specializations (
    spec_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    specialization public.specialization_type NOT NULL
);

CREATE TABLE public.teacher_qualifications (
    qual_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    qualification TEXT NOT NULL
);

CREATE TABLE public.student_guardian_phones (
    phone_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id        UUID NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    phone             TEXT NOT NULL,
    guardian_relation public.relation_type NOT NULL,
    label             public.contact_label DEFAULT 'أساسي'
);

