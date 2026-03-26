// supabase/functions/generate-daily-sessions/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // service role — صلاحيات كاملة
  );

  // يوم النهارده بالعربي
  const days = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const todayName = days[new Date().getDay()];
  const todayDate = new Date().toISOString().split("T")[0];

  // جيب الحلقات اللي عندها جدول النهارده
  const { data: schedules, error: schedErr } = await supabase
    .from("schedules")
    .select("halaqa_id, halaqat!inner(status)")
    .eq("day_of_week", todayName)
    .eq("halaqat.status", "active");

  if (schedErr) {
    return new Response(JSON.stringify({ error: schedErr.message }), {
      status: 500,
    });
  }

  if (!schedules?.length) {
    return new Response(
      JSON.stringify({ message: `لا توجد حلقات يوم ${todayName}` }),
      { status: 200 },
    );
  }

  // أنشئ جلسة لكل حلقة
  const sessions = schedules.map((s) => ({
    halaqa_id: s.halaqa_id,
    session_date: todayDate,
    status: "scheduled",
  }));

  const { data, error } = await supabase
    .from("sessions")
    .insert(sessions)
    .select();

  if (error) {
    // لو الجلسة موجودة بالفعل — مش خطأ
    if (error.code === "23505") {
      return new Response(
        JSON.stringify({ message: "الجلسات موجودة بالفعل" }),
        { status: 200 },
      );
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // الـ Trigger trg_auto_teacher_attendance هيشتغل تلقائياً
  // وينشئ حضور المعلم لكل جلسة جديدة

  return new Response(
    JSON.stringify({
      success: true,
      day: todayName,
      date: todayDate,
      created: data?.length ?? 0,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});
