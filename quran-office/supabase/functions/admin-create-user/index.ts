// supabase/functions/admin-create-user/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get Auth Header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "No Auth Header" }), { status: 401, headers: corsHeaders });

    // Identify User from Token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authErr } = await adminClient.auth.getUser(token);
    
    if (authErr || !caller) {
      return new Response(JSON.stringify({ error: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى." }), { status: 401, headers: corsHeaders });
    }

    // Verify Admin Status
    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (!profile || !["admin", "supervisor"].includes(profile.role?.toLowerCase())) {
      return new Response(JSON.stringify({ error: "ليس لديك صلاحية لتنفيذ هذه العملية" }), { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const { action, userId, password, ...userData } = body;

    // Reset Password Action
    if (action === "reset_password") {
      const { error } = await adminClient.auth.admin.updateUserById(userId, { password });
      if (error) throw new Error("تعذر تحديث كلمة المرور");
      return new Response(JSON.stringify({ message: "تم تحديث كلمة المرور بنجاح" }), { headers: corsHeaders });
    }

    // Create Staff Action
    const { 
      email, full_name, role, phone, hire_date, notes, 
      specialization, tajweed_level, max_students 
    } = userData;
    if (!email || !password || !userData.first_name || !userData.family_name) {
      return new Response(JSON.stringify({ error: "البيانات المرسلة غير كاملة (الاسم والبريد وكلمة المرور مطلوبة)" }), { status: 400, headers: corsHeaders });
    }
    
    // Create Auth user
    const { data: authData, error: authErrCreate } = await adminClient.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: `${userData.first_name} ${userData.family_name}`, role }
    });
    
    if (authErrCreate) {
      console.error("Auth Create Error:", authErrCreate);
      let msg = "حدث خطأ أثناء إنشاء الحساب";
      const errMsg = authErrCreate.message.toLowerCase();
      if (errMsg.includes("already exists") || errMsg.includes("already registered") || errMsg.includes("already in use")) {
        msg = "البريد الإلكتروني مسجل مسبقاً لمستخدم آخر";
      } else {
        msg = `خطأ في إنشاء الحساب: ${authErrCreate.message}`;
      }
      return new Response(JSON.stringify({ error: msg }), { status: 400, headers: corsHeaders });
    }

    // Call RPC to setup tables with EXPLICIT parameter mapping p_
    const { error: rpcErr } = await adminClient.rpc("admin_setup_staff", {
      p_user_id: authData.user.id,
      p_first_name: userData.first_name,
      p_father_name: userData.father_name || '',
      p_grandfather_name: userData.grandfather_name || '',
      p_family_name: userData.family_name,
      p_email: email,
      p_role: role,
      p_phone: userData.phone || null,
      p_phones: userData.phones || [],
      p_hire_date: hire_date || null,
      p_notes: notes || null,
      p_specializations: userData.specializations || ['حفظ'],
      p_tajweed_level: userData.tajweed_level || 'متوسط',
      p_birth_date: userData.birth_date || null
    });

    if (rpcErr) {
      console.error("RPC Error:", rpcErr);
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return new Response(JSON.stringify({ error: `تعذر إعداد بيانات الموظف: ${rpcErr.message}` }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ staff: { id: authData.user.id, ...userData } }), { headers: corsHeaders });

  } catch (err: any) {
    console.error("Unexpected Error:", err);
    return new Response(JSON.stringify({ error: `حدث خطأ غير متوقع: ${err.message}` }), { status: 500, headers: corsHeaders });
  }
});
