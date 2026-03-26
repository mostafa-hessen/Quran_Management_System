# دليل إعداد مشروع مكتب التحفيظ
# React + Vite + MUI + Zustand + React Query + Zod + React Hook Form + Supabase

## ─────────────────────────────────────────
## الخطوة ١ — إنشاء المشروع
## ─────────────────────────────────────────

npm create vite@latest quran-office -- --template react-ts
cd quran-office

## ─────────────────────────────────────────
## الخطوة ٢ — تثبيت كل الحزم
## ─────────────────────────────────────────

# الـ UI
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# الـ Routing
npm install react-router-dom

# الـ Data Fetching
npm install @tanstack/react-query @tanstack/react-query-devtools

# الـ State Management
npm install zustand

# الـ Forms + Validation
npm install react-hook-form @hookform/resolvers zod

# الـ Database
npm install @supabase/supabase-js

# Utilities
npm install date-fns
npm install -D @types/node

## ─────────────────────────────────────────
## الخطوة ٣ — ملف .env
## ─────────────────────────────────────────

# أنشئ ملف .env في root المشروع:
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

## ─────────────────────────────────────────
## الخطوة ٤ — توليد TypeScript Types
## ─────────────────────────────────────────

npm install supabase --save-dev
npx supabase login
npx supabase gen types typescript \
  --project-id YOUR_PROJECT_ID \
  > src/types/database.types.ts

## ─────────────────────────────────────────
## الخطوة ٥ — تشغيل المشروع
## ─────────────────────────────────────────

npm run dev
