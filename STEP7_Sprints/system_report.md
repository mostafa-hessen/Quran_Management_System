# 📋 تقرير المعماري الشامل — نظام إدارة مكتب تحفيظ القرآن الكريم
### "علمه البيان"
**التاريخ:** أبريل 2026 | **المعدّ:** فريق الهندسة المعمارية

---

> [!NOTE]
> هذا التقرير مبني على تحليل مباشر للكود المصدري في `quran-office/` والـ Migrations وملف PRD ونموذج الواجهة الأولية. كل توصية هنا قابلة للتنفيذ الفوري.

---

## 📊 ملخص الحالة الراهنة

| المعيار | الحالة |
|---|---|
| هيكل المشروع | ✅ Feature-based Architecture جيد |
| قاعدة البيانات | ✅ Schema قوي مع Audit Log ومعظم الجداول |
| المصادقة | ⚠️ منقوصة — مشكلة Token وإعادة التحميل |
| الحضور | 🔴 `types.ts` فارغ تمامًا — لم يُبنَ بعد |
| المدفوعات | 🔴 `types.ts` فارغ تمامًا — لم تُبنَ بعد |
| المعلمون | 🔴 `types.ts` فارغ — الصفحة موجودة لكن بدون منطق |
| نظام الصلاحيات | ⚠️ موجود لكن ناقص ومسطّح (Flat) |
| التقارير | 🔴 مجلد موجود لكن فارغ |

---

## 1. 🏗️ إعادة تصميم معمارية النظام

### 1.1 المشكلة الأساسية في التصميم الحالي

النظام الحالي يعاني من **خلط مفاهيمي** بين ثلاثة كيانات مختلفة:

```
❌ الوضع الحالي:
   profiles (Supabase Auth) ←──── teachers (جدول مستقل)
                           ←──── students (جدول مستقل)
   (لا يوجد رابط واضح بين الثلاثة)
```

```
✅ الوضع المثالي:
   auth.users (Supabase Auth)
      │
      └──► profiles (بيانات المستخدم + role)
              │
              ├──► employees (موظفو المكتب بما فيهم المعلمون)
              │        │
              │        └──► teachers (خصائص إضافية للمعلم)
              │
              └──► students (كيان منفصل تمامًا — ليس مستخدمًا)
```

### 1.2 خريطة الكيانات المقترحة

```
┌─────────────────────────────────────────────┐
│              auth.users (Supabase)           │
│         (email, password, confirmed_at)      │
└──────────────────┬──────────────────────────┘
                   │ 1:1
┌──────────────────▼──────────────────────────┐
│                 profiles                     │
│  id · full_name · role · phone · status      │
│  avatar_url · joined_at · last_login         │
└──────────────────┬──────────────────────────┘
                   │ 1:1 (اختياري)
┌──────────────────▼──────────────────────────┐
│                employees                     │
│  employee_id · profile_id · department       │
│  salary · contract_type · hire_date          │
│  specialization · is_teacher                 │
└──────────────────┬──────────────────────────┘
                   │ 1:1 (إذا is_teacher = true)
┌──────────────────▼──────────────────────────┐
│               teacher_profiles               │
│  teacher_id · employee_id                    │
│  tajweed_level · max_students                │
│  current_load · certificates[]               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                 students                     │
│  student_id · full_name · birth_date         │
│  gender · address · status                   │
│  guardian_phones[]                           │
│  (مستقل تمامًا — ليس مستخدمًا في النظام)   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│               enrollments                    │
│  student_id · halaqa_id · teacher_id         │
│  join_date · leave_date · status             │
└─────────────────────────────────────────────┘
```

### 1.3 العلاقات بين الكيانات

| من | إلى | نوع العلاقة | الوصف |
|---|---|---|---|
| `profiles` | `employees` | One-to-One | كل موظف له حساب في النظام |
| `employees` | `teacher_profiles` | One-to-One | المعلم موظف + صفحة تفاصيل معلم |
| `halaqat` | `teacher_profiles` | Many-to-One | الحلقة لها معلم واحد أساسي |
| `students` | `enrollments` | One-to-Many | الطالب قد يكون في حلقة واحدة أو أكثر |
| `enrollments` | `subscriptions` | One-to-Many | كل تسجيل له اشتراكات |
| `sessions` | `attendance_records` | One-to-Many | كل جلسة يسجل فيها الحضور |

---

## 2. 👥 نظام الصلاحيات (RBAC)

### 2.1 المشكلة الحالية

```typescript
// ❌ الوضع الحالي — مسطّح وغير قابل للتوسع
const isStaff = isAdmin || isSupervisor;
return { canManageTeachers: isStaff, canManagePayments: isStaff }
// ============================================
// كل الصلاحيات hard-coded في hook واحد
// إضافة role جديد = تغيير الكود في أماكن متعددة
```

### 2.2 التصميم المقترح — Permission Matrix

```typescript
// ✅ نظام Permissions مستقل عن الـ Roles
export const PERMISSIONS = {
  // إدارة المستخدمين
  USER_CREATE:          'user:create',
  USER_UPDATE:          'user:update',
  USER_DELETE:          'user:delete',
  USER_VIEW_ALL:        'user:view_all',

  // الطلاب
  STUDENT_CREATE:       'student:create',
  STUDENT_UPDATE:       'student:update',
  STUDENT_DELETE:       'student:delete',
  STUDENT_VIEW:         'student:view',
  STUDENT_SUSPEND:      'student:suspend',

  // الحلقات
  HALAQA_CREATE:        'halaqa:create',
  HALAQA_UPDATE:        'halaqa:update',
  HALAQA_VIEW_OWN:      'halaqa:view_own',
  HALAQA_VIEW_ALL:      'halaqa:view_all',

  // الحضور
  ATTENDANCE_MARK:      'attendance:mark',
  ATTENDANCE_EDIT:      'attendance:edit',
  ATTENDANCE_VIEW_ALL:  'attendance:view_all',

  // المالية
  PAYMENT_CREATE:       'payment:create',
  PAYMENT_UPDATE:       'payment:update',
  PAYMENT_VIEW:         'payment:view',
  PAYMENT_REPORT:       'payment:report',

  // التقارير
  REPORT_VIEW_ALL:      'report:view_all',
  REPORT_OWN_HALAQA:    'report:own_halaqa',

  // النظام
  SETTINGS_MANAGE:      'settings:manage',
  AUDIT_LOG_VIEW:       'audit:view',
} as const;

// ربط الصلاحيات بالأدوار
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(PERMISSIONS), // كل الصلاحيات

  [Role.SUPERVISOR]: [
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.STUDENT_UPDATE,
    PERMISSIONS.STUDENT_SUSPEND,
    PERMISSIONS.HALAQA_VIEW_ALL,
    PERMISSIONS.HALAQA_UPDATE,
    PERMISSIONS.ATTENDANCE_VIEW_ALL,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.REPORT_VIEW_ALL,
    PERMISSIONS.USER_VIEW_ALL,
  ],

  [Role.TEACHER]: [
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.HALAQA_VIEW_OWN,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.REPORT_OWN_HALAQA,
  ],
};
```

### 2.3 هيكل قاعدة البيانات للأدوار

```sql
-- جدول الأدوار (قابل للتوسع مستقبلاً)
CREATE TABLE roles (
  role_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT UNIQUE NOT NULL,  -- 'admin', 'supervisor', 'teacher'
  label_ar  TEXT NOT NULL,         -- 'مدير', 'مشرف', 'معلم'
  is_system BOOLEAN DEFAULT FALSE  -- الأدوار الافتراضية محمية
);

-- جدول الصلاحيات
CREATE TABLE permissions (
  key         TEXT PRIMARY KEY,    -- 'student:create'
  module      TEXT NOT NULL,       -- 'students'
  label_ar    TEXT NOT NULL        -- 'إضافة طالب'
);

-- ربط الأدوار بالصلاحيات
CREATE TABLE role_permissions (
  role_id       UUID REFERENCES roles(role_id),
  permission_key TEXT REFERENCES permissions(key),
  PRIMARY KEY (role_id, permission_key)
);
```

### 2.4 Hook محسّن للصلاحيات

```typescript
// usePermissions.ts — النسخة المحسّنة
export const usePermissions = () => {
  const { profile } = useAuthStore();
  const role = profile?.role ?? null;

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  }, [role]);

  const hasAnyPermission = useCallback((...perms: Permission[]) =>
    perms.some(hasPermission), [hasPermission]);

  return { role, hasPermission, hasAnyPermission };
};

// الاستخدام في Components:
// const { hasPermission } = usePermissions();
// if (!hasPermission(PERMISSIONS.STUDENT_CREATE)) return <Forbidden />;
```

---

## 3. 📚 تفصيل وحدات النظام

### 3.1 وحدة الطلاب (Students) — حالتها: ✅ متقدمة

**المسؤوليات:**
- تسجيل الطلاب الجدد مع أرقام أولياء الأمور
- إدارة حالة الطالب (نشط / موقوف / مغادر)
- عرض الملف الكامل للطالب (حضور، حفظ، مدفوعات)

**نقاط قوة حالية:** هيكل بيانات مدروس، Audit Log، Optimistic Updates.

**ما ينقصه:**
```typescript
// ❌ مفقود في Student interface:
{
  national_id?: string,       // رقم الهوية
  school?: string,            // المدرسة
  academic_level?: string,    // الصف الدراسي
  special_needs?: string,     // احتياجات خاصة
  join_date: string,          // تاريخ الالتحاق بالمكتب
  leave_date?: string,        // تاريخ المغادرة
  leave_reason?: string,      // سبب المغادرة
}
```

---

### 3.2 وحدة الموظفين / المعلمين — حالتها: 🔴 لم تُبنَ

**المسؤوليات:**
- إدارة بيانات الموظفين (السكرتيرة، المشرف، المعلمون)
- ربط كل معلم بحلقاته
- تتبع حمل المعلم (عدد الطلاب)

**هيكل بيانات مقترح:**

```typescript
// Teacher Profile
export interface TeacherProfile {
  teacher_id: string;
  profile_id: string;       // → profiles.id (Supabase Auth)
  full_name: string;
  phone: string;
  email: string;
  specialization: string;   // 'حفظ' | 'تجويد' | 'كليهما'
  tajweed_level: string;    // 'مبتدئ' | 'متوسط' | 'متقدم' | 'مجاز'
  max_students: number;     // الحد الأقصى للطلاب
  current_load: number;     // الطلاب الحاليون (calculated)
  hire_date: string;
  status: 'active' | 'on_leave' | 'terminated';
  halaqat?: Halaqa[];       // الحلقات المسؤول عنها
}
```

**الإجراءات الرئيسية:**
- إضافة معلم → إنشاء حساب Supabase Auth + profile + teacher_profile
- تعديل بياناته → يؤثر فقط على teacher_profile
- تعطيل المعلم → `status = 'terminated'` + نقل حلقاته لمعلم آخر

---

### 3.3 وحدة الحضور (Attendance) — حالتها: 🔴 لم تُبنَ

**المسؤوليات:**
- تسجيل حضور/غياب كل طالب في كل جلسة
- دعم الغياب بعذر وبدون عذر
- احتساب نسب الحضور

**هيكل بيانات مقترح:**

```typescript
export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late';

export interface AttendanceRecord {
  record_id: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  notes?: string;
  marked_by: string;       // → profiles.id
  marked_at: string;       // timestamp
}

export interface Session {
  session_id: string;
  halaqa_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  substitute_teacher_id?: string;
  cancellation_reason?: string;
  attendance_locked: boolean;  // بعد قفل الجلسة لا يمكن التعديل
}
```

**تدفق العمل:**
1. يُنشئ النظام جلسات تلقائيًا بناءً على جدول الحلقة
2. يفتحها المعلم ويسجل الحضور
3. يحفظ ويقفل الجلسة → `attendance_locked = true`
4. المشرف/الأدمن فقط يستطيع فتحها للتعديل

---

### 3.4 وحدة الاشتراكات والمدفوعات — حالتها: 🔴 لم تُبنَ

**هيكل بيانات مقترح:**

```typescript
export type SubscriptionType = 'monthly' | 'quarterly' | 'annual';
export type SubscriptionStatus = 'active' | 'expired' | 'suspended' | 'pending';

export interface Subscription {
  subscription_id: string;
  enrollment_id: string;    // → enrollments
  student_id: string;       // للوصول السريع
  type: SubscriptionType;
  start_date: string;
  end_date: string;
  total_amount: number;
  discount_amount: number;  // الخصومات (إن وُجدت)
  net_amount: number;       // المبلغ الفعلي بعد الخصم
  status: SubscriptionStatus;
  auto_renew: boolean;
  created_by: string;
}

export type PaymentMethod = 'cash' | 'transfer' | 'check';
export type PaymentStatus = 'completed' | 'partial' | 'refunded';

export interface Payment {
  payment_id: string;
  subscription_id: string;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference_number?: string;  // رقم الحوالة أو الشيك
  notes?: string;
  received_by: string;        // → profiles.id (السكرتيرة)
  receipt_number: string;     // رقم وصل تسلسلي
}
```

---

### 3.5 وحدة التقارير — حالتها: 🔴 لم تُبنَ

**التقارير المطلوبة:**

| التقرير | من يراه | الحساب |
|---|---|---|
| ملف الطالب الكامل | Admin / Supervisor / Teacher (حلقاته) | حضور + حفظ + درجات + مدفوعات |
| تقرير غياب اليوم | Admin / Supervisor | عدد الغائبين لكل حلقة |
| المتأخرون في الدفع | Admin / Supervisor | `net_amount - paid_amount > 0` |
| أداء المعلمين | Admin | متوسط تقييم + نسبة حضور طلابهم |
| الإيرادات الشهرية | Admin | مجموع payments في الفترة |
| كشف نقطة الطالب | Admin / Teacher | درجات الواجبات + الحفظ |

---

## 4. 🔄 تدفقات المستخدمين (User Flows)

### 4.1 تسجيل طالب جديد

```
السكرتيرة / الأدمن
    │
    ▼
[ملء بيانات الطالب الأساسية]
 الاسم كاملاً · الجنس · تاريخ الميلاد · العنوان
    │
    ▼
[إضافة أرقام أولياء الأمور]
 الرقم · صلة القرابة · نوع الرقم
    │
    ▼
[اختيار الحلقة المناسبة]
 ← النظام يتحقق: هل فيها مكان؟ (capacity check)
 ← النظام يتحقق: هل المعلم يقبل الجنس؟ (اختياري)
    │
    ▼
[إنشاء Enrollment]
 join_date = اليوم · status = 'pending'
    │
    ▼
[إنشاء أول اشتراك]
 type · start_date · total_amount
    │
    ▼
[تسجيل الدفعة الأولى] (إذا دفع فوراً)
    │
    ▼
[تفعيل الاشتراك]
 enrollment.status = 'active'
 subscription.status = 'active'
    │
    ▼
✅ الطالب نشط في الحلقة
```

### 4.2 تسجيل الحضور اليومي

```
المعلم (يفتح صفحة حلقته)
    │
    ▼
[يختار الحلقة والجلسة]
 ← النظام يعرض الجلسة المجدولة لهذا اليوم
 ← إذا لم تكن موجودة: "لا توجد جلسة اليوم"
    │
    ▼
[قائمة الطلاب النشطين في الحلقة]
 كل طالب: ◉ حاضر | ○ غائب | ○ غائب بعذر | ○ متأخر
    │
    ▼
[حفظ الحضور]
 ← تحقق: هل الجلسة لم تُقفل بعد؟
 ← إنشاء attendance_records لكل طالب
    │
    ▼
[قفل الجلسة] (اختياري — يمنع التعديل لاحقاً)
    │
    ▼
✅ الحضور مسجل + Audit Log محدّث
```

### 4.3 دورة اشتراك وسداد متأخر

```
[بداية الشهر / انتهاء الاشتراك]
    │
    ▼
النظام (أو يدوياً) يُنشئ اشتراكاً جديداً
subscription.status = 'pending'
    │
    ▼
السكرتيرة تبلّغ ولي الأمر (يدوياً حالياً)
    │
    ├──► [دفع كامل فوري]
    │         payment.amount = total
    │         subscription.status = 'active'
    │         ✅ انتهى
    │
    ├──► [دفع جزئي]
    │         payment.amount < total
    │         subscription.status = 'active'  ← الاشتراك يُفعّل
    │         يُسجَّل balance_due = total - paid
    │         ⚠️ يظهر في تقرير "متأخرو الدفع"
    │
    └──► [لا يدفع بعد 15 يوم]
              subscription.status = 'suspended'
              enrollment.subscription_status = 'inactive'
              ⚠️ تنبيه للمشرف أو الأدمن
```

### 4.4 انتقال طالب من حلقة لأخرى

```
[طلب التغيير]
    │
    ▼
[إغلاق التسجيل القديم]
 enrollment.leave_date = today
 enrollment.status = 'inactive'
    │
    ▼
[إنشاء تسجيل جديد في الحلقة الجديدة]
 enrollment.join_date = today
 enrollment.status = 'active'
    │
    ▼
[ضبط الاشتراك]
 هل الاشتراك الحالي مرتبط بالحلقة أم بالطالب؟
 ← إذا بالطالب: يستمر تلقائياً
 ← إذا بالحلقة: ينتهي وينشأ اشتراك جديد
    │
    ▼
✅ سجل الطالب يعكس الحلقتين (القديمة والجديدة)
```

### 4.5 إيقاف / إخراج طالب

```
الأدمن / السكرتيرة
    │
    ├──► [إيقاف مؤقت] (Suspend)
    │     student.status = 'suspended'
    │     enrollment.status = 'suspended'
    │     subscription.status = 'suspended'
    │     لا يُحسب في قوائم الحضور
    │     يظل الدين مسجلاً
    │
    └──► [إخراج نهائي] (Terminate)
              student.status = 'inactive'
              enrollment.leave_date = today
              enrollment.status = 'inactive'
              ← تسوية مالية: هل بقي مبلغ؟
              ← إذا نعم: رصيد معلق (pending_refund)
              ✅ الطالب في الأرشيف — البيانات محفوظة
```

---

## 5. ⚠️ الحالات الحرجة (Edge Cases)

| الحالة | الوصف | الحل المقترح |
|---|---|---|
| **طالب غائب وعليه اشتراك** | الاشتراك لا يرتبط بالحضور | الاشتراك مستمر — يُسجَّل الغياب فقط بدون توقف المدفوعات |
| **دفع جزئي** | دفع 50% من الاشتراك | تفعيل الاشتراك + تسجيل `balance_due` + إظهار في تقرير الديون |
| **مغادرة المعلم** | معلم يترك المكتب في منتصف الشهر | status = 'terminated' + نقل حلقاته لمعلم آخر + حفظ سجله الكامل |
| **انتهاء الاشتراك والطالب يحضر** | طالب يحضر بعد انتهاء الاشتراك | تسجيل الحضور بشكل طبيعي + ظهور تحذير "الاشتراك منتهٍ" |
| **معلم بديل** | غياب معلم وحضور بديل | `session.substitute_teacher_id` موجود في الـ Schema — يجب تفعيله في الواجهة |
| **حلقة ممتلئة** | طالب جديد يريد الانضمام | النظام يمنع الاضافة عند الوصول لـ `capacity` + يعرض رسالة واضحة |
| **تعديل الحضور بعد القفل** | المعلم أخطأ وأراد التصحيح | فقط Admin يستطيع إعادة فتح الجلسة + يُسجَّل في Audit Log سبب الفتح |
| **طالب في حلقتين** | طالب يشترك في حلقتين مختلفتين | enrollments تدعم ذلك — لكن يجب اشتراكان منفصلان |
| **رسوم مختلفة بين الطلاب** | طالب يدفع أقل لأسباب اجتماعية | `discount_amount` في Subscription يعالج ذلك |
| **استرداد مبلغ** | طالب خرج في منتصف الشهر | `payment.status = 'refunded'` + إنشاء سجل استرداد في payment |

---

## 6. 🧾 تصميم النظام المالي

### 6.1 نموذج الدفتر المحاسبي المقترح

```
┌───────────────────────────────────────────────┐
│              FINANCIAL LEDGER                 │
│                                               │
│  subscriptions  ←── المطلوب (Debit)           │
│  payments       ←── المدفوع (Credit)          │
│  balance = subscription.net - sum(payments)   │
└───────────────────────────────────────────────┘
```

### 6.2 جدول المعاملات المالية

```sql
-- جدول لتتبع كل حركة مالية (Ledger System)
CREATE TABLE financial_transactions (
  transaction_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL CHECK (type IN (
                    'subscription_fee',  -- رسوم اشتراك
                    'payment_received',  -- دفعة مستلمة
                    'refund',            -- استرداد
                    'adjustment',        -- تعديل يدوي
                    'discount'           -- خصم
                  )),
  student_id      UUID NOT NULL REFERENCES students(student_id),
  subscription_id UUID REFERENCES subscriptions(subscription_id),
  payment_id      UUID REFERENCES payments(payment_id),
  amount          NUMERIC(10,2) NOT NULL,
  direction       TEXT NOT NULL CHECK (direction IN ('debit', 'credit')),
  balance_after   NUMERIC(10,2),           -- رصيد الطالب بعد المعاملة
  notes           TEXT,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.3 تقارير مالية مطلوبة

```
📊 التقارير المالية:
┌─────────────────────────────────────────────────┐
│ 1. إيرادات الشهر الحالي                         │
│    SUM(payments) WHERE payment_date THIS MONTH  │
├─────────────────────────────────────────────────┤
│ 2. إجمالي الديون المستحقة                       │
│    SUM(net_amount - paid) WHERE balance > 0     │
├─────────────────────────────────────────────────┤
│ 3. قائمة المتأخرين بالسداد                      │
│    Students WHERE balance_due > 0               │
├─────────────────────────────────────────────────┤
│ 4. متوسط الإيراد لكل حلقة                      │
│    GROUP BY halaqa_id                           │
├─────────────────────────────────────────────────┤
│ 5. مقارنة شهرية (الشهر الحالي vs السابق)       │
│    Time-series aggregation                      │
└─────────────────────────────────────────────────┘
```

### 6.4 الـ Function الحالية في قاعدة البيانات

```sql
-- ✅ موجودة بالفعل — جيدة
get_subscription_balance(p_subscription_id UUID)
-- تحسب: total_amount - SUM(completed payments)
```

**تحسينات مقترحة:**

```sql
-- دالة جديدة: رصيد الطالب الكلي
CREATE OR REPLACE FUNCTION get_student_total_balance(p_student_id UUID)
RETURNS TABLE(
  total_subscriptions NUMERIC,
  total_paid          NUMERIC,
  total_balance       NUMERIC
) AS $$
  SELECT
    COALESCE(SUM(s.net_amount), 0),
    COALESCE(SUM(p.amount)    FILTER (WHERE p.status = 'completed'), 0),
    COALESCE(SUM(s.net_amount), 0) -
    COALESCE(SUM(p.amount)    FILTER (WHERE p.status = 'completed'), 0)
  FROM subscriptions s
  LEFT JOIN payments p ON p.subscription_id = s.subscription_id
  WHERE s.student_id = p_student_id;
$$ LANGUAGE sql STABLE;
```

---

## 7. 🧠 تحليل مشكلة المصادقة والإعادة اللانهائية

### 7.1 الكود الحالي — تحليل مفصل

```typescript
// store.ts — الكود الحالي
// ✅ جيد: استخدام onAuthStateChange بدل getSession
// ✅ جيد: Promise singleton يمنع التهيئة الازدواجية
// ✅ جيد: subscription.unsubscribe() بعد INITIAL_SESSION

// ⚠️ مشكلة محتملة — رقم 1:
// هناك مستمعان لـ onAuthStateChange:
//   1. داخل initialize() — للتهيئة الأولى فقط
//   2. خارج الـ store (السطر 69) — للتغييرات اللاحقة
// إذا تأخر تنفيذ initialize() قد يتلقى المستمع الخارجي INITIAL_SESSION
// ويحاول جلب profile مرتين في نفس الوقت

// ⚠️ مشكلة محتملة — رقم 2:
// initializationPromise لا يُعاد ضبطه بشكل صحيح عند SIGNED_OUT
// في signOut: initializationPromise = null ✅ صحيح
// لكن عند تسجيل دخول مرة ثانية: initializationPromise محجوز مسبقاً
// وسيُعيد تعيين undefined بسسبب: if (get().initialized) return;
```

### 7.2 السبب المحتمل للإعادة اللانهائية

```
المشكلة الأرجح: في مكان ما يُستخدم React Query مع useQuery
لجلب profile أو session، وعند:

فشل الطلب (Network Error أو RLS Error)
    ↓
React Query يعيد المحاولة تلقائياً (retry: 3 بشكل افتراضي)
    ↓
كل محاولة تُعيد تحديث الـ state
    ↓
المكون يُعاد رسمه
    ↓
إعادة تشغيل useQuery
    ↓
حلقة لانهائية 🔄
```

### 7.3 الحل الكامل (خطوة بخطوة)

**الخطوة 1 — إصلاح store.ts:**

```typescript
// store.ts — النسخة المصلحة
let initializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  // ... نفس الحالات ...

  initialize: async () => {
    // ✅ منع التهيئة المتكررة
    if (initializationPromise) return initializationPromise;
    if (get().initialized) return Promise.resolve();

    initializationPromise = (async () => {
      set({ loading: true });
      try {
        // ✅ استخدام getSession مباشرة للتهيئة بدل onAuthStateChange
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          set({ user: session.user });
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) set({ profile: profile as UserProfile });
        }
      } catch (error) {
        console.error('Auth Init Error:', error);
      } finally {
        set({ loading: false, initialized: true });
      }
    })();

    return initializationPromise;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    initializationPromise = null;  // ✅ تنظيف Promise
    set({ user: null, profile: null, loading: false, initialized: false });
  },
}));

// ✅ مستمع واحد فقط خارج الـ store للتغييرات اللاحقة
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  if (!store.initialized) return; // ⬅️ لا تتدخل قبل اكتمال التهيئة

  if (event === 'SIGNED_IN' && session?.user) {
    const { data: profile } = await supabase
      .from('profiles').select('*')
      .eq('id', session.user.id).single();
    store.setUser(session.user);
    if (profile) store.setProfile(profile as UserProfile);

  } else if (event === 'SIGNED_OUT') {
    store.setUser(null);
    store.setProfile(null);
  }
});
```

**الخطوة 2 — ضبط React Query (إذا كان يُستخدم للمصادقة):**

```typescript
// ❌ لا تستخدم React Query لجلب session أو profile
// React Query مناسب للبيانات التي تجلبها بصورة متكررة
// المصادقة = State ثابتة تُدار بـ Zustand

// إذا كان لديك hook كهذا — احذفه:
// const useProfile = () => useQuery({
//   queryKey: ['profile'],
//   queryFn: fetchProfile,  ← هذا يسبب المشكلة
// });

// ✅ بدلاً من ذلك:
const useProfile = () => {
  const { profile } = useAuthStore(); // Zustand فقط
  return profile;
};
```

**الخطوة 3 — تحقق من RLS في Supabase:**

```sql
-- تأكد أن policy قراءة profiles صحيحة:
-- إذا فشل SELECT على profiles بسبب RLS ← loop!
SELECT * FROM pg_policies
WHERE tablename = 'profiles';

-- يجب أن تكون هناك policy تسمح للمستخدم بقراءة profile-هـ:
CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT USING (id = auth.uid());
```

**الخطوة 4 — إضافة Route Guard صحيح:**

```typescript
// ✅ AuthGuard صحيح يمنع Flash of Unauthenticated Content
const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { initialized, loading, user } = useAuthStore();

  // انتظر اكتمال التهيئة
  if (!initialized || loading) return <LoadingScreen />;

  // إذا لا يوجد مستخدم → صفحة تسجيل الدخول
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
```

---

## 8. 🧩 الميزات المفقودة الحرجة

### الفئة الأولى — مفقودة بالكامل:

| الميزة | الأثر | الأولوية |
|---|---|---|
| **نظام الحضور كاملاً** | المعلم لا يستطيع تسجيل حضور | 🔴 حرج |
| **نظام المدفوعات** | لا تتبع مالي | 🔴 حرج |
| **صفحة المعلمين** | موجودة لكن فارغة منطقياً | 🔴 حرج |
| **الحلقات (Halaqat)** | تابعة للـ Migrations لكن واجهة مبتورة | 🔴 حرج |
| **لوحة التحكم (Dashboard)** | موجودة لكن بدون بيانات حقيقية | 🟠 عالي |
| **التقارير** | المجلد فارغ | 🟠 عالي |
| **تتبع الحفظ للمعلم** | Schema موجود لكن واجهة معدومة | 🟠 عالي |

### الفئة الثانية — يجب إضافتها:

| الميزة | الوصف |
|---|---|
| **وصل استلام مدفوعات** | طباعة / PDF لكل عملية دفع |
| **إشعارات النظام** | جدول notifications موجود — يجب ربطه بـ Realtime |
| **بحث عالمي** | البحث في الطلاب والمعلمين والحلقات بشريط واحد |
| **استيراد/تصدير Excel** | لأولياء الأمور الذين يريدون كشوفات |
| **تقييم أداء المعلمين** | تقرير دوري + ربط بـ report_cards |
| **إدارة الجداول (Schedule)** | إنشاء وتعديل مواعيد الحلقات |
| **كشف نقطة الطالب** | Card أو PDF لكل طالب — للوالدين |
| **إدارة الإجازات** | إجازات رسمية لا تحتسب كغياب |
| **تنبيهات التجديد التلقائي** | تنبيه قبل انتهاء الاشتراك بـ 7 أيام |
| **سجل نشاط المستخدمين** | واجهة لعرض audit_log بشكل مفيد |

---

## 9. ✅ قائمة المهام التنفيذية

### 🔴 الأولوية العالية (الأسبوعان القادمان)

**Sprint 1 — أساسيات النظام:**

```
[ ] FIX-001: إصلاح مشكلة المصادقة en store.ts
    - تغيير initialize() لاستخدام getSession() مباشرة
    - إصلاح التدخل بين المستمعين
    - اختبار: تسجيل دخول → تحديث الصفحة → لا يحدث Loop
    الوقت المتوقع: 2-3 ساعات

[ ] FIX-002: إضافة RLS Policy صحيحة لجدول profiles
    - تحقق من السياسات الموجودة
    - إضافة: SELECT لكل مستخدم على profile-هـ
    الوقت المتوقع: 30 دقيقة

[ ] FEAT-001: بناء نظام الأدوار والصلاحيات الجديد
    - إنشاء ملف permissions.ts مع الـ Matrix الكاملة
    - تحديث usePermissions.ts
    - إضافة <PermissionGate> component
    الوقت المتوقع: 1 يوم

[ ] FEAT-002: بناء وحدة المعلمين
    - types.ts كامل
    - teachersApi.ts (CRUD)
    - useTeachers hooks
    - TeachersList + AddTeacherModal + TeacherProfile
    الوقت المتوقع: 2-3 أيام
```

**Sprint 2 — الحضور:**

```
[ ] FEAT-003: بناء نظام الحلقات (Halaqat)
    - types.ts كامل
    - CRUD كامل للحلقات
    - ربط المعلم بالحلقة
    - Capacity Validation
    الوقت المتوقع: 2 أيام

[ ] FEAT-004: بناء نظام الحضور كاملاً
    - types.ts: AttendanceRecord + Session types
    - sessionsApi.ts: جلب جلسات اليوم
    - attendanceApi.ts: تسجيل الحضور
    - صفحة تسجيل الحضور (list + checkboxes)
    - قفل الجلسة بعد التسجيل
    الوقت المتوقع: 3 أيام
```

### 🟠 الأولوية المتوسطة (الشهر القادم)

```
[ ] FEAT-005: نظام الاشتراكات والمدفوعات
    - types.ts: Subscription + Payment
    - API كامل
    - واجهة: إنشاء اشتراك + تسجيل دفعة
    - وصل استلام بسيط (طباعة)
    الوقت المتوقع: 3-4 أيام

[ ] FEAT-006: تقارير أساسية
    - تقرير غياب اليوم
    - قائمة المتأخرين بالسداد
    - ملف الطالب الكامل
    - تقرير إيرادات الشهر
    الوقت المتوقع: 3 أيام

[ ] FEAT-007: لوحة التحكم بإحصائيات حقيقية
    - عدد الطلاب النشطين
    - إيرادات الشهر الحالي
    - نسبة الحضور اليوم
    - المتأخرون بالسداد
    الوقت المتوقع: 2 أيام

[ ] FEAT-008: ربط الإشعارات بـ Realtime
    - جدول notifications موجود ✅
    - إضافة Realtime subscription في React
    - عرض في الـ Notification Bell الموجودة في الـ Prototype
    الوقت المتوقع: 1-2 يوم
```

### 🟡 الأولوية المنخفضة (المرحلة الثانية)

```
[ ] FEAT-009: تقييم الأداء والدرجات
    - واجهة إدخال الواجبات والدرجات
    - كشف نقطة الطالب (report_cards موجود في DB)
    الوقت المتوقع: 3 أيام

[ ] FEAT-010: سجل تتبع الحفظ من واجهة المعلم
    - إضافة سجل الحفظ لكل طالب
    - memorization_history موجود في DB ✅
    الوقت المتوقع: 2 أيام

[ ] FEAT-011: تصدير التقارير PDF / Excel
    الوقت المتوقع: 2 أيام

[ ] FEAT-012: واجهة عرض Audit Log للأدمن
    - عرض سجل كل العمليات
    - فلترة بالمستخدم / التاريخ / الجدول
    الوقت المتوقع: 1 يوم

[ ] FEAT-013: بحث عالمي في النظام
    الوقت المتوقع: 1 يوم

[ ] FEAT-014: إدارة إجازات وعطل النظام
    الوقت المتوقع: 1 يوم
```

---

## 🗺️ خريطة الطريق المقترحة (Roadmap)

```
شهر أبريل 2026:
  ├── أسبوع 1-2: إصلاح Auth + نظام الصلاحيات + المعلمون
  └── أسبوع 3-4: الحلقات + الحضور

شهر مايو 2026:
  ├── أسبوع 1-2: الاشتراكات + المدفوعات
  └── أسبوع 3-4: التقارير الأساسية + لوحة التحكم

شهر يونيو 2026:
  ├── أسبوع 1-2: الإشعارات + تتبع الحفظ
  └── أسبوع 3-4: اختبار + تدريب + إطلاق

--- الإصدار 1.0 جاهز للاستخدام الإنتاجي ---
```

---

## 📌 توصيات ختامية

### ما يجب الحفاظ عليه (نقاط قوة):
1. ✅ **Feature-based Architecture** — هيكل ممتاز قابل للتوسع
2. ✅ **Audit Log** — قرار صحيح لنظام مالي
3. ✅ **Optimistic Updates** في الطلاب — تجربة مستخدم ممتازة
4. ✅ **Zustand للـ UI State + React Query للـ Server State** — الفصل الصحيح
5. ✅ **Supabase RLS** — أمان على مستوى السطر من قاعدة البيانات

### ما يجب تغييره:
1. 🔄 **إصلاح Auth Store** بأسلوب getSession المباشر
2. 🔄 **نقل صلاحيات المعلمين** من جدول `teachers` المستقل إلى نظام موحد
3. 🔄 **نظام الصلاحيات** من Hard-coded إلى Permission Matrix
4. 🔄 **الاشتراكات** ربطها بـ enrollment لا بالطالب مباشرة

### الكلمة الأخيرة:
> البنية التحتية (Supabase Schema + Feature Architecture) قوية جداً. 90% من العمل المتبقي هو **بناء الواجهات والـ Hooks لما هو موجود بالفعل في قاعدة البيانات**. المشروع في وضع ممتاز للوصول إلى الإنتاج خلال 6-8 أسابيع بعمل منظم ومتسق.

---
*آخر تحديث: أبريل 2026 | المعدّ: Antigravity AI Architecture Analysis*
