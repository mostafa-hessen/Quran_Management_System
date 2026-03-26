$dest = "تصاميم_الواجهات"
$basePath = "d:\Projects\مشروع تحفيظ القران\quran\STEP4_ui&ux"
Set-Location $basePath

if (!(Test-Path $dest)) { 
    New-Item -ItemType Directory -Path $dest 
    Write-Host "تم إنشاء المجلد: $dest" -ForegroundColor Cyan
}

$mapping = @{
    "admin_dashboard_overview_1\screen.png" = "نظرة_عامة_لوحة_المسؤول_1.png"
    "admin_dashboard_overview_2\screen.png" = "نظرة_عامة_لوحة_المسؤول_2.png"
    "admin_dashboard_overview_3\screen.png" = "نظرة_عامة_لوحة_المسؤول_3.png"
    "admin_dashboard_overview_alternative\screen.png" = "لوحة_المسؤول_تصميم_بديل.png"
    "arabic_login_screen\screen.png" = "شاشة_تسجيل_الدخول_بالعربية.png"
    "circles_management_table_view_1\screen.png" = "إدارة_الحلقات_عرض_الجدول_1.png"
    "circles_management_table_view_2\screen.png" = "إدارة_الحلقات_عرض_الجدول_2.png"
    "premium_arabic_landing_page\screen.png" = "الصفحة_الرئيسية_العربية_المميزة.png"
    "session_detailed_view_1\screen.png" = "عرض_تفصيلي_للجلسة_1.png"
    "session_detailed_view_2\screen.png" = "عرض_تفصيلي_للجلسة_2.png"
    "students_list_minimal_view\screen.png" = "عرض_مبسط_لقائمة_الطلاب.png"
    "students_management_list\screen.png" = "قائمة_إدارة_الطلاب.png"
    "teacher_attendance_list_view\screen.png" = "عرض_قائمة_حضور_المعلمين.png"
    "teachers_grid_view\screen.png" = "عرض_المعلمين_شبكة.png"
}

foreach ($item in $mapping.GetEnumerator()) {
    $src = Join-Path $basePath $item.Key
    $targetName = $item.Value
    $targetPath = Join-Path (Join-Path $basePath $dest) $targetName

    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $targetPath -Force
        Write-Host "تم نسخ: $($item.Key) -> $targetName" -ForegroundColor Green
    } else {
        Write-Host "خطأ: الملف غير موجود -> $($item.Key)" -ForegroundColor Red
    }
}

Write-Host "`nتمت المهمة بنجاح! الصور موجودة الآن في: $basePath\$dest" -ForegroundColor Yellow
