
> [!TIP]
> **انسخ هذا الموجه (Prompt) وأرسله لي في رسالتك القادمة لنبدأ فوراً بالتنفيذ الفعلي وكتابة الكود للمرحلة الأولى:**

```text
لقد قرأت الخطة وأوافق عليها. دعنا نبدأ فوراً بتنفيذ "المرحلة الأولى (Quick Wins)".

أريدك أن تبدأ بالآتي كخطوات برمجية فعلية:
1. قم ببناء `src/shared/components/ui` وإنشاء مكونات (Card, Searchable Select, Button, Input) بناءً على تصميم الـ Prototype (استخدم ألوان Emerald و Stone).
خذ الالوان من هنا
بشرط ان يكون كل compnent 
لا تعكي لون مباشر تاخذه من ال theme
2- الاعتماد علي  الثيم src\app\provider\theme_provider.tsx
بدلا من اعطاء الوان لكل قسم

2. قم بإعادة كتابة وتصميم `إضافة حلقة جديدة` ليكون مقسماً إلى أقسام وافحة وسهلاً لاستخدام.+ دمج اضافه المواعيد في نفس المودال
وتطبيق ذلك غلي مودال التعديل مثال
لكن بشكل افضل وليكن tabs 

<h3 class="font-bold text-stone-800 text-base" id="modal-title">إنشاء حلقة جديدة</h3> 

3. قم ببناء هيكل شاشة `HalaqaDetails` بحيث تعرض بيانات الحلقة، المعلم، وجدول أنيق للطلاب المسجلين مع أزرار الإجراءات السريعة.
4- شكل صفحه الحلقات يكون مشابه ل
<main class="flex-1 overflow-y-auto bg-stone-50 p-4 md:p-6" id="page-content"><div class="space-y-4">
      <div class="sh"><span class="st">الحلقات القرآنية</span>
        <button class="btn btn-primary" onclick="Circles.openAdd()">+ إنشاء حلقة</button></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
              <div><div class="font-bold text-stone-800 text-base">حلقة الفجر</div>
                <div class="text-xs text-stone-400 mt-0.5">قاعة ١ - الدور الأرضي</div></div>
              <span class="badge bg-amber">مبتدئ</span>
            </div>
            <div class="text-sm text-stone-500 mb-3">المعلم: <strong class="text-stone-700">أحمد الزهراني</strong></div>
            <div class="text-xs text-stone-400 mb-3 italic">حلقة للطلاب المبتدئين من ٨-١٢ سنة</div>
            <div class="mb-3">
            <div class="flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-1.5 mb-1">
              <span class="font-bold text-emerald-800">السبت</span>
              <span class="text-emerald-600">4:00م – 6:00م</span>
            </div>
            <div class="flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-1.5 mb-1">
              <span class="font-bold text-emerald-800">الثلاثاء</span>
              <span class="text-emerald-600">4:00م – 6:00م</span>
            </div></div>
            <div class="prog-bar mb-1"><div class="prog-fill bg-emerald-500" style="width:40%"></div></div>
            <div class="flex justify-between text-xs text-stone-400 mb-4">
              <span>4 طالب مسجل</span><span>السعة 10</span>
            </div>
            <div class="flex gap-2 border-t border-stone-50 pt-3 flex-wrap">
              <button class="btn-sm bg-emerald-600 text-white flex-1" onclick="Homework.openAdd('h1')">📝 واجب جديد</button>
              <button class="btn-sm bg-stone-100 text-stone-600 flex-1" onclick="Circles.viewStudents('h1')">الطلاب</button>
              <button class="btn-sm bg-blue-100 text-blue-700" onclick="Circles.openEdit('h1')">تعديل</button>
              <button class="btn-sm bg-red-100 text-red-700" onclick="Circles.delete('h1')">✕</button>
            </div>
          </div><div class="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
              <div><div class="font-bold text-stone-800 text-base">حلقة النور</div>
                <div class="text-xs text-stone-400 mt-0.5">قاعة ٢ - الدور الأول</div></div>
              <span class="badge bg-blue">متوسط</span>
            </div>
            <div class="text-sm text-stone-500 mb-3">المعلم: <strong class="text-stone-700">عبدالرحمن العتيبي</strong></div>
            <div class="text-xs text-stone-400 mb-3 italic">حلقة للطلاب المتوسطين من ١٢-١٦ سنة</div>
            <div class="mb-3">
            <div class="flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-1.5 mb-1">
              <span class="font-bold text-emerald-800">الأحد</span>
              <span class="text-emerald-600">5:00م – 7:00م</span>
            </div>
            <div class="flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-1.5 mb-1">
              <span class="font-bold text-emerald-800">الأربعاء</span>
              <span class="text-emerald-600">5:00م – 7:00م</span>
            </div></div>
            <div class="prog-bar mb-1"><div class="prog-fill bg-emerald-500" style="width:30%"></div></div>
            <div class="flex justify-between text-xs text-stone-400 mb-4">
              <span>3 طالب مسجل</span><span>السعة 10</span>
            </div>
            <div class="flex gap-2 border-t border-stone-50 pt-3 flex-wrap">
              <button class="btn-sm bg-emerald-600 text-white flex-1" onclick="Homework.openAdd('h2')">📝 واجب جديد</button>
              <button class="btn-sm bg-stone-100 text-stone-600 flex-1" onclick="Circles.viewStudents('h2')">الطلاب</button>
              <button class="btn-sm bg-blue-100 text-blue-700" onclick="Circles.openEdit('h2')">تعديل</button>
              <button class="btn-sm bg-red-100 text-red-700" onclick="Circles.delete('h2')">✕</button>
            </div>
          </div><div class="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
              <div><div class="font-bold text-stone-800 text-base">حلقة التقوى</div>
                <div class="text-xs text-stone-400 mt-0.5">قاعة ٣ - الدور الثاني</div></div>
              <span class="badge bg-green">متقدم</span>
            </div>
            <div class="text-sm text-stone-500 mb-3">المعلم: <strong class="text-stone-700">أحمد الزهراني</strong></div>
            <div class="text-xs text-stone-400 mb-3 italic">حلقة للطلاب المتقدمين والمتفوقين</div>
            <div class="mb-3">
            <div class="flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-1.5 mb-1">
              <span class="font-bold text-emerald-800">الخميس</span>
              <span class="text-emerald-600">4:00م – 6:30م</span>
            </div></div>
            <div class="prog-bar mb-1"><div class="prog-fill bg-emerald-500" style="width:0%"></div></div>
            <div class="flex justify-between text-xs text-stone-400 mb-4">
              <span>0 طالب مسجل</span><span>السعة 8</span>
            </div>
            <div class="flex gap-2 border-t border-stone-50 pt-3 flex-wrap">
              <button class="btn-sm bg-stone-100 text-stone-600 flex-1" onclick="Circles.viewStudents('h3')">الطلاب</button>
              <button class="btn-sm bg-blue-100 text-blue-700" onclick="Circles.openEdit('h3')">تعديل</button>
              <button class="btn-sm bg-red-100 text-red-700" onclick="Circles.delete('h3')">✕</button>
              عرض 
            </div>
          </div>
      </div>
    </div></main>


5-  - الاعتماد على مكونات إدخال (Inputs/Selects) بدائية تقلل من جودة تجربة المستخدم.

## 3. 🧩 HALAQAT UX REDESIGN (إعادة تصميم تجربة مستخدم الحلقات)

> [!TIP]
> **الهدف:** جعل إدارة الحلقة تتم من شاشة واحدة (Single Source of Truth).

**التصميم المقترح:**
- **صفحة تفاصيل الحلقة (Halaqa Details Dashboard):**
  - **رأس الصفحة (Header):** اسم الحلقة، مستوى الحلقة، نسبة الإشغال (مثال: 15/20)، وزر سريع "تغيير المعلم".
  - **منطقة الطلاب (Students Grid/Table):** قائمة بطلاب الحلقة الحاليين، مع عرض صورة رمزية، اسم الطالب، مؤشر مالي (نقطة خضراء/حمراء)، وإجراءات (نقل لحلقة أخرى، إيقاف).
  - **إضافة طالب (Add Student):** زر يفتح Drawer جانبي يحتوي على (Searchable Select) للطلاب غير المسجلين لإضافتهم فوراً، بدلاً من الذهاب لشاشة أخرى.


---
```
