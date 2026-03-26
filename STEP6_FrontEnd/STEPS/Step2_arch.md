
src/
 ├── app/                     # إعدادات عامة (Providers, Context, Global config)
 │    └── providers.tsx
 ├── routes/                  # تعريف مسارات التطبيق
 │    └── index.tsx
 ├── pages/                   # الصفحات الرئيسية (Login, Dashboard, …)
 ├── shared/                  # موارد عامة مشتركة بين كل Features
 │    ├── ui/                 # Buttons, Inputs, Modals, Cards...
 │    ├── layout/             # Navbar, Sidebar, Layout Components
 │    ├── hooks/              # Hooks عامة reusable
 │    ├── utils/              # Helpers, Formatter functions
 │    ├── types/              # Types العامة
 │    └── lib/                # Configs, API setup, axios instances
 └── features/                # قلب المشروع
      ├── auth/
      │    ├── components/    # UI Components الخاصة بالـ Auth
      │    ├── hooks/         # Hooks الخاصة بالـ Auth
      │    ├── api/           # API calls
      │    ├── store.ts       # Zustand/Redux slice للـ Auth
      │    ├── types.ts       # Types خاصة بالـ Auth
      │    └── index.ts       # Export لكل حاجة جوه Feature
      ├── students/
      ├── teachers/
      ├── halaqat/
      ├── sessions/
      ├── attendance/
      ├── homework/
      ├── memorization/
      ├── payments/
      ├── reports/
      └── audit-log/