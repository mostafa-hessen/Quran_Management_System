'use strict';
// ═══════════════════════════════════════════════════════════════
//  QURAN OFFICE v2 — FULL REBUILD
//  Vanilla JS + Tailwind | All features from modification prompt
// ═══════════════════════════════════════════════════════════════

// ── SEED DATA ────────────────────────────────────────────────────
const DB = {
  teachers: [
    { id:'t1', first_name:'أحمد',      family_name:'الزهراني', specialty:'تجويد وحفظ',  phone:'0501234567', status:'active' },
    { id:'t2', first_name:'عبدالرحمن', family_name:'العتيبي',  specialty:'قراءات سبع',   phone:'0509876543', status:'active' },
    { id:'t3', first_name:'محمد',      family_name:'الغامدي',  specialty:'تجويد',         phone:'0507654321', status:'active' },
  ],

  students: [
    { id:'s1', first_name:'محمد',      father_name:'عبدالله',  grandfather_name:'سالم',  family_name:'السالم',   birth_date:'2012-03-15', gender:'ذكر', address:'حي النزهة، الرياض', circleId:'h1', status:'active',
      phones:[{number:'0551111111',relation:'أب',label:'أساسي'},{number:'0561111111',relation:'أم',label:'واتساب'}] },
    { id:'s2', first_name:'عمر',       father_name:'خالد',     grandfather_name:'فهد',   family_name:'المنصور',  birth_date:'2010-07-22', gender:'ذكر', address:'حي الملقا، الرياض',  circleId:'h1', status:'active',
      phones:[{number:'0552222222',relation:'أب',label:'أساسي'}] },
    { id:'s3', first_name:'يوسف',      father_name:'سعد',      grandfather_name:'ناصر',  family_name:'القحطاني', birth_date:'2013-01-10', gender:'ذكر', address:'حي العليا، الرياض',  circleId:'h1', status:'active',
      phones:[{number:'0553333333',relation:'أب',label:'أساسي'},{number:'0563333333',relation:'أب',label:'واتساب'}] },
    { id:'s4', first_name:'إبراهيم',   father_name:'فهد',      grandfather_name:'علي',   family_name:'الشهري',   birth_date:'2011-05-08', gender:'ذكر', address:'حي السليمانية',       circleId:'h1', status:'active',
      phones:[{number:'0554444444',relation:'أب',label:'أساسي'}] },
    { id:'s5', first_name:'عبدالعزيز', father_name:'ناصر',     grandfather_name:'حمد',   family_name:'الدوسري',  birth_date:'2009-09-30', gender:'ذكر', address:'حي الروضة',           circleId:'h2', status:'active',
      phones:[{number:'0555555555',relation:'أب',label:'أساسي'},{number:'0565555555',relation:'أم',label:'منزل'}] },
    { id:'s6', first_name:'سلطان',     father_name:'علي',      grandfather_name:'سلطان', family_name:'الغامدي',  birth_date:'2008-12-14', gender:'ذكر', address:'حي الورود',           circleId:'h2', status:'active',
      phones:[{number:'0556666666',relation:'أب',label:'أساسي'}] },
    { id:'s7', first_name:'فيصل',      father_name:'محمد',     grandfather_name:'أحمد',  family_name:'العسيري',  birth_date:'2010-04-25', gender:'ذكر', address:'حي الحمراء',          circleId:'h2', status:'active',
      phones:[{number:'0557777777',relation:'أب',label:'أساسي'}] },
  ],

  halaqat: [
    { id:'h1', name:'حلقة الفجر',   teacherId:'t1', level:'مبتدئ',  capacity:10, location:'قاعة ١ - الدور الأرضي',   description:'حلقة للطلاب المبتدئين من ٨-١٢ سنة', status:'active',
      schedules:[{day:'السبت',start_time:'16:00',end_time:'18:00'},{day:'الثلاثاء',start_time:'16:00',end_time:'18:00'}] },
    { id:'h2', name:'حلقة النور',   teacherId:'t2', level:'متوسط',  capacity:10, location:'قاعة ٢ - الدور الأول',    description:'حلقة للطلاب المتوسطين من ١٢-١٦ سنة', status:'active',
      schedules:[{day:'الأحد',start_time:'17:00',end_time:'19:00'},{day:'الأربعاء',start_time:'17:00',end_time:'19:00'}] },
    { id:'h3', name:'حلقة التقوى', teacherId:'t1', level:'متقدم',  capacity:8,  location:'قاعة ٣ - الدور الثاني',  description:'حلقة للطلاب المتقدمين والمتفوقين', status:'active',
      schedules:[{day:'الخميس',start_time:'16:00',end_time:'18:30'}] },
  ],

  sessions: [
    { id:'ss1', circleId:'h1', date:'2025-01-18', status:'completed', teacherAttendance:'حاضر', substitute_teacher_id:null },
    { id:'ss2', circleId:'h1', date:'2025-01-21', status:'completed', teacherAttendance:'غائب', substitute_teacher_id:'t3' },
    { id:'ss3', circleId:'h1', date:'2025-01-25', status:'scheduled', teacherAttendance:'حاضر', substitute_teacher_id:null },
    { id:'ss4', circleId:'h2', date:'2025-01-19', status:'completed', teacherAttendance:'حاضر', substitute_teacher_id:null },
    { id:'ss5', circleId:'h2', date:'2025-01-22', status:'cancelled', teacherAttendance:'غائب', substitute_teacher_id:null },
    { id:'ss6', circleId:'h2', date:'2025-01-26', status:'scheduled', teacherAttendance:'حاضر', substitute_teacher_id:null },
  ],

  attendance: [
    {id:'a1',sessionId:'ss1',studentId:'s1',status:'حاضر'},{id:'a2',sessionId:'ss1',studentId:'s2',status:'غائب'},
    {id:'a3',sessionId:'ss1',studentId:'s3',status:'حاضر'},{id:'a4',sessionId:'ss1',studentId:'s4',status:'حاضر'},
    {id:'a5',sessionId:'ss2',studentId:'s1',status:'حاضر'},{id:'a6',sessionId:'ss2',studentId:'s2',status:'متأخر'},
    {id:'a7',sessionId:'ss2',studentId:'s3',status:'حاضر'},{id:'a8',sessionId:'ss2',studentId:'s4',status:'بعذر'},
  ],

  // homework: scope = 'general' (للحلقة) | 'personal' (لطالب معين)
  homework: [
    { id:'hw1', sessionId:'ss1', dueSessionId:'ss2', title:'حفظ سورة الملك',   description:'من آية 1 إلى 15', type:'حفظ',    scope:'general', studentId:null },
    { id:'hw2', sessionId:'ss2', dueSessionId:'ss3', title:'مراجعة الجزء الأول', description:'تلاوة كاملة مع التجويد', type:'مراجعة', scope:'general', studentId:null },
    { id:'hw3', sessionId:'ss1', dueSessionId:'ss3', title:'تصحيح مخارج الحروف', description:'تمرين خاص على حروف الحلق', type:'تجويد', scope:'personal', studentId:'s2' },
  ],

  submissions: [
    {id:'sub1',homeworkId:'hw1',studentId:'s1',grade:90,evaluation:'ممتاز',   notes:'أداء رائع',          reassigned:false},
    {id:'sub2',homeworkId:'hw1',studentId:'s2',grade:70,evaluation:'جيد',      notes:'يحتاج مراجعة التجويد', reassigned:false},
    {id:'sub3',homeworkId:'hw1',studentId:'s3',grade:85,evaluation:'جيد جداً',notes:'',                    reassigned:false},
    {id:'sub4',homeworkId:'hw1',studentId:'s4',grade:60,evaluation:'مقبول',   notes:'الحفظ ضعيف',          reassigned:false},
    {id:'sub5',homeworkId:'hw2',studentId:'s1',grade:null,evaluation:null,notes:'',reassigned:false},
    {id:'sub6',homeworkId:'hw2',studentId:'s2',grade:null,evaluation:null,notes:'',reassigned:false},
    {id:'sub7',homeworkId:'hw2',studentId:'s3',grade:null,evaluation:null,notes:'',reassigned:false},
    {id:'sub8',homeworkId:'hw2',studentId:'s4',grade:null,evaluation:null,notes:'',reassigned:false},
    {id:'sub9',homeworkId:'hw3',studentId:'s2',grade:null,evaluation:null,notes:'',reassigned:false},
  ],

  memorization: [], // Removed as requested

  subscriptions: [
    {id:'sb1',studentId:'s1',type:'شهري',startDate:'2025-01-01',endDate:'2025-01-31',totalAmount:200,status:'active',isExempt:false,exemptReason:''},
    {id:'sb2',studentId:'s2',type:'شهري',startDate:'2025-01-01',endDate:'2025-01-31',totalAmount:200,status:'active',isExempt:false,exemptReason:''},
    {id:'sb3',studentId:'s3',type:'شهري',startDate:'2025-01-01',endDate:'2025-01-31',totalAmount:200,status:'active',isExempt:false,exemptReason:''},
    {id:'sb4',studentId:'s4',type:'شهري',startDate:'2025-01-01',endDate:'2025-01-31',totalAmount:200,status:'active',isExempt:false,exemptReason:''},
    {id:'sb5',studentId:'s5',type:'سنوي',startDate:'2025-01-01',endDate:'2025-12-31',totalAmount:2000,status:'active',isExempt:false,exemptReason:''},
    {id:'sb6',studentId:'s6',type:'شهري',startDate:'2025-01-01',endDate:'2025-01-31',totalAmount:200,status:'active',isExempt:true,exemptReason:'ظروف اجتماعية'},
    {id:'sb7',studentId:'s7',type:'شهري',startDate:'2025-01-01',endDate:'2025-01-31',totalAmount:200,status:'active',isExempt:false,exemptReason:''},
  ],

  payments: [
    {id:'p1',subscriptionId:'sb1',date:'2025-01-05',amount:200,method:'نقدي', status:'completed',receipt:'R-001'},
    {id:'p2',subscriptionId:'sb2',date:'2025-01-07',amount:100,method:'تحويل',status:'completed',receipt:'R-002'},
    {id:'p3',subscriptionId:'sb3',date:'2025-01-10',amount:200,method:'نقدي', status:'completed',receipt:'R-003'},
    {id:'p4',subscriptionId:'sb5',date:'2025-01-02',amount:2000,method:'تحويل',status:'completed',receipt:'R-004'},
  ],

  notifications: [
    {id:'n1',type:'homework_due',homeworkId:'hw2',message:'موعد تصحيح واجب: مراجعة الجزء الأول',dueDate:'2025-01-25',targetRole:'teacher',isRead:false,createdAt:'2025-01-21T10:00:00'},
    {id:'n2',type:'homework_due',homeworkId:'hw3',message:'موعد تصحيح واجب: تصحيح مخارج الحروف',dueDate:'2025-01-25',targetRole:'teacher',isRead:false,createdAt:'2025-01-21T10:05:00'},
  ],

  audit_log: [
    {id:'al1',timestamp:'2025-01-21T09:00:00',user_role:'admin',user_label:'المدير',action:'إضافة',entity:'طالب',entity_id:'s7',entity_name:'فيصل محمد العسيري',old_value:null,new_value:null,description:'إضافة طالب جديد للحلقة'},
    {id:'al2',timestamp:'2025-01-20T14:30:00',user_role:'teacher',user_label:'المعلم',action:'حضور',entity:'جلسة',entity_id:'ss2',entity_name:'حلقة الفجر - 21 يناير',old_value:null,new_value:'4/4 حاضر',description:'تسجيل حضور الجلسة'},
    {id:'al3',timestamp:'2025-01-19T11:00:00',user_role:'secretary',user_label:'السكرتيرة',action:'مالي',entity:'دفعة',entity_id:'p4',entity_name:'عبدالعزيز ناصر الدوسري',old_value:null,new_value:'2000 ج.م',description:'تسجيل دفعة اشتراك سنوي'},
    {id:'al4',timestamp:'2025-01-18T16:00:00',user_role:'admin',user_label:'المدير',action:'تعديل',entity:'حلقة',entity_id:'h1',entity_name:'حلقة الفجر',old_value:'السعة: 8',new_value:'السعة: 10',description:'تعديل سعة الحلقة'},
    {id:'al5',timestamp:'2025-01-17T10:00:00',user_role:'teacher',user_label:'المعلم',action:'إضافة',entity:'واجب',entity_id:'hw1',entity_name:'حفظ سورة الملك',old_value:null,new_value:null,description:'إضافة واجب جديد + 4 submissions تلقائية'},
  ],
};

// ── HELPERS ──────────────────────────────────────────────────────
const $  = id => document.getElementById(id);
const genId = () => '_' + Math.random().toString(36).slice(2,9);

function studentFullName(s) {
  return [s.first_name, s.father_name, s.grandfather_name, s.family_name].filter(Boolean).join(' ');
}

function teacherFullName(t) {
  return t ? [t.first_name, t.family_name].filter(Boolean).join(' ') : '—';
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ar-EG', {year:'numeric',month:'short',day:'numeric'});
}

function fmtTime(t) {
  if (!t) return '';
  const [h,m] = t.split(':');
  const hr = parseInt(h);
  const suffix = hr < 12 ? 'ص' : 'م';
  const h12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
  return `${h12}:${m}${suffix}`;
}

function today() { return new Date().toISOString().split('T')[0]; }

function badge(text, cls = 'bg-gray') {
  const map = {
    'حاضر':'bg-green','غائب':'bg-red','بعذر':'bg-amber','متأخر':'bg-blue',
    'ممتاز':'bg-green','جيد جداً':'bg-blue','جيد':'bg-blue','مقبول':'bg-amber','ضعيف':'bg-red',
    'مدفوع':'bg-green','غير مدفوع':'bg-red','جزئي':'bg-amber',
    'active':'bg-green','inactive':'bg-red','suspended':'bg-amber','معفي':'bg-purple',
    'مبتدئ':'bg-amber','متوسط':'bg-blue','متقدم':'bg-green',
    'حفظ':'bg-green','مراجعة':'bg-blue','تجويد':'bg-purple',
    'scheduled':'bg-blue','completed':'bg-green','cancelled':'bg-red',
    'شهري':'bg-blue','سنوي':'bg-purple',
    'إضافة':'bg-green','تعديل':'bg-amber','حذف':'bg-red','حضور':'bg-purple','مالي':'bg-blue',
  };
  return `<span class="badge ${map[text]||cls}">${text}</span>`;
}

function toast(msg, type = 'info') {
  const c = {success:'t-success',error:'t-error',info:'t-info',warn:'t-warn'};
  const ic = {success:'✓',error:'✕',info:'ℹ',warn:'⚠'};
  const el = document.createElement('div');
  el.className = `toast ${c[type]||'t-info'}`;
  el.innerHTML = `<span>${ic[type]||'ℹ'}</span><span>${msg}</span>`;
  $('toast-container').appendChild(el);
  setTimeout(()=>el.remove(), 3200);
}

function confirm2(msg) { return window.confirm(msg); }

// ── AUDIT LOG ─────────────────────────────────────────────────────
function logAction({action, entity, entity_id, entity_name, old_value=null, new_value=null, description}) {
  DB.audit_log.unshift({
    id: genId(),
    timestamp: new Date().toISOString(),
    user_role: App.currentRole,
    user_label: {admin:'المدير',teacher:'المعلم',secretary:'السكرتيرة'}[App.currentRole] || '—',
    action, entity, entity_id, entity_name, old_value, new_value, description
  });
}

// ── MODAL ────────────────────────────────────────────────────────
const Modal = {
  open(title, bodyHtml, wide=false) {
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = bodyHtml;
    $('modal-box').style.maxWidth = wide ? '720px' : '560px';
    $('modal-overlay').classList.remove('hidden');
  },
  close() { $('modal-overlay').classList.add('hidden'); },
  closeOnBg(e) { if (e.target===$('modal-overlay')) this.close(); }
};

// ── NOTIFICATIONS ────────────────────────────────────────────────
const Notifications = {
  updateBadge() {
    const role = App.currentRole;
    const unread = DB.notifications.filter(n => !n.isRead && n.targetRole === role).length;
    const badge = $('notif-badge');
    if (unread > 0) {
      badge.textContent = unread;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  },
  toggle() {
    const dd = $('notif-dropdown');
    if (dd.classList.contains('hidden')) {
      this.render(); dd.classList.remove('hidden');
    } else {
      dd.classList.add('hidden');
    }
    document.addEventListener('click', e => {
      if (!$('notif-wrap')?.contains(e.target)) dd.classList.add('hidden');
    }, { once: true });
  },
  render() {
    const role = App.currentRole;
    const items = DB.notifications.filter(n => n.targetRole === role)
      .sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0,10);
    const dd = $('notif-dropdown');
    if (!items.length) {
      dd.innerHTML = `<div class="p-5 text-center text-sm text-stone-400">لا توجد إشعارات</div>`;
      return;
    }
    dd.innerHTML = `
      <div class="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
        <span class="font-bold text-stone-700 text-sm">الإشعارات</span>
        <button onclick="Notifications.markAllRead()" class="text-xs text-emerald-600 hover:underline">تعليم الكل كمقروء</button>
      </div>
      ${items.map(n => `
        <div class="notif-item ${n.isRead?'':'unread'}" onclick="Notifications.click('${n.id}')">
          <div class="text-sm font-bold text-stone-700">${n.message}</div>
          <div class="text-xs text-stone-400 mt-1">موعد التسليم: ${fmtDate(n.dueDate)}</div>
        </div>`).join('')}`;
  },
  click(id) {
    const n = DB.notifications.find(x=>x.id===id);
    if (!n) return;
    n.isRead = true;
    $('notif-dropdown').classList.add('hidden');
    this.updateBadge();
    App.navigate('homework');
  },
  markAllRead() {
    DB.notifications.filter(n=>n.targetRole===App.currentRole).forEach(n=>n.isRead=true);
    this.updateBadge();
    this.render();
  },
  add(hwId, hwTitle, dueDate) {
    DB.notifications.push({
      id: genId(), type:'homework_due', homeworkId: hwId,
      message:`موعد تصحيح واجب: ${hwTitle}`,
      dueDate, targetRole:'teacher', isRead:false,
      createdAt: new Date().toISOString()
    });
    this.updateBadge();
  }
};

// ── CONFLICT CHECKER ─────────────────────────────────────────────
function checkTeacherConflicts(teacherId, schedules, excludeCircleId = null) {
  if (!teacherId || !schedules?.length) return [];
  const conflicts = [];
  DB.halaqat.forEach(h => {
    if (h.teacherId !== teacherId) return;
    if (h.id === excludeCircleId) return;
    h.schedules?.forEach(hs => {
      schedules.forEach(ns => {
        if (hs.day !== ns.day) return;
        const [hs1,hs2] = [hs.start_time, hs.end_time];
        const [ns1,ns2] = [ns.start_time, ns.end_time];
        if (ns1 < hs2 && ns2 > hs1) {
          conflicts.push(`تعارض مع "${h.name}" يوم ${hs.day} (${fmtTime(hs1)}–${fmtTime(hs2)})`);
        }
      });
    });
  });
  return conflicts;
}

// ── APP CONTROLLER ────────────────────────────────────────────────
const App = {
  currentRole: null,
  currentPage: 'dashboard',

  login(role) {
    this.currentRole = role;
    $('screen-login').style.display = 'none';
    $('screen-app').classList.remove('hidden');
    const labels = {admin:'👑 مدير النظام',teacher:'📖 معلم',secretary:'📋 سكرتيرة'};
    $('role-display').textContent = labels[role];
    $('user-chip').textContent = {admin:'م',teacher:'أ',secretary:'س'}[role];
    this.buildNav();
    this.navigate('dashboard');
    $('current-date').textContent = new Date().toLocaleDateString('ar-EG',{weekday:'short',year:'numeric',month:'long',day:'numeric'});
    Notifications.updateBadge();
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') Modal.close(); });
  },

  logout() {
    if (!confirm2('تأكيد تسجيل الخروج؟')) return;
    $('screen-login').style.display = 'block';
    $('screen-app').classList.add('hidden');
    this.currentRole = null;
  },

  toggleSidebar() { $('sidebar').classList.toggle('open'); },

  navItems: {
    admin: [
      {id:'dashboard',icon:'◈',label:'لوحة التحكم'},
      {id:'students',icon:'👤',label:'الطلاب'},
      {id:'teachers',icon:'📖',label:'المعلمون'},
      {id:'circles',icon:'⬡',label:'الحلقات'},
      {id:'sessions',icon:'📅',label:'الجلسات'},
      {id:'attendance',icon:'✓',label:'الحضور'},
      {id:'homework',icon:'📝',label:'الواجبات'},
      {id:'subscriptions',icon:'💳',label:'الاشتراكات'},
      {id:'payments',icon:'💰',label:'المدفوعات'},
      {id:'reports',icon:'📊',label:'التقارير'},
      {id:'auditlog',icon:'📋',label:'سجل العمليات'},
    ],
    teacher: [
      {id:'dashboard',icon:'◈',label:'لوحة التحكم'},
      {id:'sessions',icon:'📅',label:'جلساتي'},
      {id:'attendance',icon:'✓',label:'الحضور'},
      {id:'homework',icon:'📝',label:'الواجبات'},
    ],
    secretary: [
      {id:'dashboard',icon:'◈',label:'لوحة التحكم'},
      {id:'students',icon:'👤',label:'الطلاب'},
      {id:'sessions',icon:'📅',label:'الجلسات'},
      {id:'subscriptions',icon:'💳',label:'الاشتراكات'},
      {id:'payments',icon:'💰',label:'المدفوعات'},
      {id:'reports',icon:'📊',label:'التقارير'},
    ],
  },

  buildNav() {
    const items = this.navItems[this.currentRole]||[];
    $('sidebar-nav').innerHTML = items.map(i=>`
      <a class="nav-item" data-page="${i.id}" onclick="App.navigate('${i.id}')">
        <span class="nav-icon">${i.icon}</span><span>${i.label}</span>
      </a>`).join('');
  },

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
    const titles = {
      dashboard:'لوحة التحكم',students:'الطلاب',teachers:'المعلمون',
      circles:'الحلقات',sessions:'الجلسات',attendance:'الحضور',
      homework:'الواجبات',subscriptions:'الاشتراكات',
      payments:'المدفوعات',reports:'التقارير',auditlog:'سجل العمليات',
    };
    $('page-title').textContent = titles[page]||page;
    const map = {
      dashboard:Pages.dashboard, students:Pages.students, teachers:Pages.teachers,
      circles:Pages.circles,     sessions:Pages.sessions, attendance:Pages.attendance,
      homework:Pages.homework,   subscriptions:Pages.subscriptions,
      payments:Pages.payments,   reports:Pages.reports,   auditlog:Pages.auditlog,
    };
    $('page-content').innerHTML = (map[page]||(() => '<p class="text-stone-400">قريباً</p>'))();
    $('sidebar').classList.remove('open');
  },
};

// ═══════════════════════════════════════════════════════════════
//  PAGES
// ═══════════════════════════════════════════════════════════════
const Pages = {

  // ── DASHBOARD ──────────────────────────────────────────────────
  dashboard() {
    const totalStudents = DB.students.filter(s=>s.status==='active').length;
    const totalTeachers = DB.teachers.length;
    const totalCircles  = DB.halaqat.filter(h=>h.status==='active').length;
    const paidSet = new Set(DB.payments.map(p=>p.subscriptionId));
    const unpaid  = DB.subscriptions.filter(s=>!paidSet.has(s.id) && !s.isExempt).length;
    const allAtt  = DB.attendance.length;
    const present = DB.attendance.filter(a=>a.status==='حاضر'||a.status==='متأخر').length;
    const attRate = allAtt ? Math.round(present/allAtt*100) : 0;
    const pendingHW = DB.submissions.filter(s=>!s.evaluation).length;
    const todaySess = DB.sessions.filter(s=>s.status==='scheduled').length;

    return `<div class="space-y-5">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${[
          {label:'الطلاب',val:totalStudents,icon:'👤',c:'text-emerald-700',page:'students'},
          {label:'المعلمون',val:totalTeachers,icon:'📖',c:'text-blue-700',page:'teachers'},
          {label:'الحلقات',val:totalCircles,icon:'⬡',c:'text-amber-700',page:'circles'},
          {label:'غير مدفوع',val:unpaid,icon:'💰',c:'text-red-700',page:'payments'},
        ].map(s=>`
          <div class="stat-card" onclick="App.navigate('${s.page}')">
            <div class="text-2xl mb-2">${s.icon}</div>
            <div class="text-3xl font-black ${s.c}">${s.val}</div>
            <div class="text-xs text-stone-400 mt-1">${s.label}</div>
          </div>`).join('')}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-stone-100 p-5">
          <div class="font-bold text-stone-600 text-sm mb-3">نسبة الحضور الكلية</div>
          <div class="text-4xl font-black text-emerald-700 mb-3">${attRate}%</div>
          <div class="prog-bar"><div class="prog-fill bg-emerald-500" style="width:${attRate}%"></div></div>
          <div class="text-xs text-stone-400 mt-2">${present} حاضر من ${allAtt}</div>
        </div>
        <div class="bg-white rounded-2xl border border-stone-100 p-5">
          <div class="font-bold text-stone-600 text-sm mb-3">جلسات مجدولة</div>
          <div class="text-4xl font-black text-blue-700 mb-2">${todaySess}</div>
          <button class="mt-2 btn btn-primary text-xs py-2 px-4" onclick="App.navigate('sessions')">عرض الجلسات</button>
        </div>
        <div class="bg-white rounded-2xl border border-stone-100 p-5">
          <div class="font-bold text-stone-600 text-sm mb-3">واجبات تنتظر تصحيح</div>
          <div class="text-4xl font-black text-amber-700 mb-2">${pendingHW}</div>
          <button class="mt-2 btn btn-gold text-xs py-2 px-4" onclick="App.navigate('homework')">تصحيح الواجبات</button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-stone-100 p-5">
        <div class="font-bold text-stone-700 mb-3">تنبيهات</div>
        <div class="space-y-2">
          ${unpaid>0?`<div class="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            <span>⚠</span><span>${unpaid} طلاب لم يدفعوا اشتراك هذا الشهر</span>
            <button class="btn-sm bg-red-100 text-red-700 mr-auto" onclick="App.navigate('payments')">عرض</button></div>`:''}
          ${pendingHW>0?`<div class="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-700">
            <span>📝</span><span>${pendingHW} واجب لم يُصحَّح بعد</span>
            <button class="btn-sm bg-amber-100 text-amber-700 mr-auto" onclick="App.navigate('homework')">تصحيح</button></div>`:''}
          <div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
            <span>✓</span><span>النظام يعمل بشكل طبيعي</span></div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-stone-100 p-5">
        <div class="font-bold text-stone-700 mb-4">الحلقات النشطة</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${DB.halaqat.map(c=>{
            const t = DB.teachers.find(x=>x.id===c.teacherId);
            const enrolled = DB.students.filter(s=>s.circleId===c.id).length;
            const pct = Math.round(enrolled/c.capacity*100);
            const fill = pct>=90?'bg-red-500':pct>=70?'bg-amber-500':'bg-emerald-500';
            const schedText = c.schedules?.map(s=>`${s.day} ${fmtTime(s.start_time)}–${fmtTime(s.end_time)}`).join(' | ')||'—';
            return `<div class="border border-stone-100 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-stone-800">${c.name}</span>${badge(c.level)}
              </div>
              <div class="text-xs text-stone-400 mb-1">${teacherFullName(t)}</div>
              <div class="text-xs text-stone-400 mb-3">${schedText}</div>
              <div class="prog-bar mb-1"><div class="prog-fill ${fill}" style="width:${pct}%"></div></div>
              <div class="flex justify-between text-xs text-stone-400"><span>${enrolled} طالب</span><span>السعة ${c.capacity}</span></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  },

  // ── STUDENTS ────────────────────────────────────────────────────
  students() {
    return `<div class="space-y-4">
      <div class="sh"><span class="st text-2xl">سجل الطلاب</span>
        <button class="btn btn-primary" onclick="Students.openAdd()">+ إضافة طالب جديد</button></div>
      <div class="bg-white p-4 rounded-2xl border border-stone-100 flex gap-3 flex-wrap items-end shadow-sm">
        <div class="fg flex-1 min-w-[200px]"><label class="fl">بحث بالاسم</label><input type="text" id="stu-search" placeholder="ابحث..." class="fi" oninput="Students.filter()"/></div>
        <div class="fg"><label class="fl">الحلقة</label>
          <select id="stu-circle" class="fi" style="min-width:180px" onchange="Students.filter()">
            <option value="">كل الحلقات</option>
            ${DB.halaqat.map(h=>`<option value="${h.id}">${h.name}</option>`).join('')}
          </select>
        </div>
        <div class="fg"><label class="fl">الحالة</label>
          <select id="stu-status" class="fi" style="min-width:120px" onchange="Students.filter()">
            <option value="">الكل</option>
            <option value="active">نشط</option><option value="inactive">غير نشط</option>
          </select>
        </div>
      </div>
      <div class="tbl-wrap">
        <table class="tbl"><thead><tr>
          <th>#</th><th>الاسم الكامل</th><th>الحلقة</th><th>الهاتف</th><th>الحفظ الحالي</th><th>الحالة</th><th>إجراءات</th>
        </tr></thead>
        <tbody id="stu-tbody">${Students.rows(DB.students)}</tbody></table>
      </div>
    </div>`;
  },

  // ── TEACHERS ────────────────────────────────────────────────────
  teachers() {
    return `<div class="space-y-4">
      <div class="sh"><span class="st">المعلمون</span>
        <button class="btn btn-primary" onclick="Teachers.openAdd()">+ إضافة معلم</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr>
        <th>#</th><th>الاسم</th><th>التخصص</th><th>الهاتف</th><th>الحلقات</th><th>التعارضات</th><th>إجراء</th>
      </tr></thead><tbody>
        ${DB.teachers.map((t,i)=>{
          const circles = DB.halaqat.filter(c=>c.teacherId===t.id);
          const conflicts = circles.reduce((acc,c)=>{
            const cf = checkTeacherConflicts(t.id, c.schedules, c.id);
            return acc + cf.length;
          },0);
          return `<tr>
            <td>${i+1}</td>
            <td class="font-bold">${teacherFullName(t)}</td>
            <td>${badge(t.specialty,'bg-blue')}</td>
            <td dir="ltr">${t.phone}</td>
            <td>${circles.map(c=>`<span class="badge bg-gray ml-1">${c.name}</span>`).join('')||'—'}</td>
            <td>${conflicts>0?`<span class="badge bg-red">⚠ ${conflicts} تعارض</span>`:'<span class="text-emerald-600 text-xs">✓ لا تعارض</span>'}</td>
            <td class="flex gap-1">
              <button class="btn-sm bg-blue-100 text-blue-700" onclick="Teachers.openEdit('${t.id}')">تعديل</button>
              <button class="btn-sm bg-red-100 text-red-700" onclick="Teachers.delete('${t.id}')">حذف</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody></table></div>
    </div>`;
  },

  // ── CIRCLES ─────────────────────────────────────────────────────
  circles() {
    return `<div class="space-y-4">
      <div class="sh"><span class="st">الحلقات القرآنية</span>
        <button class="btn btn-primary" onclick="Circles.openAdd()">+ إنشاء حلقة</button></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${DB.halaqat.map(c=>{
          const t = DB.teachers.find(x=>x.id===c.teacherId);
          const students = DB.students.filter(s=>s.circleId===c.id);
          const pct = Math.round(students.length/c.capacity*100);
          const fill = pct>=90?'bg-red-500':pct>=70?'bg-amber-500':'bg-emerald-500';
          const schedHTML = c.schedules?.map(s=>`
            <div class="flex items-center justify-between text-xs bg-emerald-50 rounded-lg px-3 py-1.5 mb-1">
              <span class="font-bold text-emerald-800">${s.day}</span>
              <span class="text-emerald-600">${fmtTime(s.start_time)} – ${fmtTime(s.end_time)}</span>
            </div>`).join('')||'<span class="text-xs text-stone-400">لا يوجد جدول</span>';
          return `<div class="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
              <div><div class="font-bold text-stone-800 text-base">${c.name}</div>
                <div class="text-xs text-stone-400 mt-0.5">${c.location||'—'}</div></div>
              ${badge(c.level)}
            </div>
            <div class="text-sm text-stone-500 mb-3">المعلم: <strong class="text-stone-700">${teacherFullName(t)}</strong></div>
            ${c.description?`<div class="text-xs text-stone-400 mb-3 italic">${c.description}</div>`:''}
            <div class="mb-3">${schedHTML}</div>
            <div class="prog-bar mb-1"><div class="prog-fill ${fill}" style="width:${pct}%"></div></div>
            <div class="flex justify-between text-xs text-stone-400 mb-4">
              <span>${students.length} طالب مسجل</span><span>السعة ${c.capacity}</span>
            </div>
            <div class="flex gap-2 border-t border-stone-50 pt-3 flex-wrap">
              <button class="btn-sm bg-emerald-600 text-white flex-1" onclick="Homework.openAdd('${c.id}')">📝 واجب جديد</button>
              <button class="btn-sm bg-stone-100 text-stone-600 flex-1" onclick="Circles.viewStudents('${c.id}')">الطلاب</button>
              <button class="btn-sm bg-blue-100 text-blue-700" onclick="Circles.openEdit('${c.id}')">تعديل</button>
              <button class="btn-sm bg-red-100 text-red-700" onclick="Circles.delete('${c.id}')">✕</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  },


  // ── SESSIONS ────────────────────────────────────────────────────
  sessions() {
    const role = App.currentRole;
    const sessions = DB.sessions.slice().sort((a,b)=>b.date.localeCompare(a.date));
    return `<div class="space-y-4">
      <div class="sh"><span class="st">الجلسات</span>
        <div class="flex gap-2">
          ${role==='admin'?`<button class="btn btn-ghost text-sm" onclick="Sessions.simulateWeek()">⚡ توليد جلسات الأسبوع</button>`:''}
          <button class="btn btn-primary" onclick="Sessions.openAdd()">+ جلسة يدوية</button>
        </div>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
        ℹ الجلسات تُنشأ تلقائياً بـ pg_cron — "توليد الأسبوع" يحاكي هذا السلوك
      </div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr>
        <th>التاريخ</th><th>الحلقة</th><th>المعلم</th><th>حضور المعلم</th><th>الحالة</th><th>إجراءات</th>
      </tr></thead><tbody>
        ${sessions.map(s=>{
          const circle  = DB.halaqat.find(h=>h.id===s.circleId);
          const teacher = DB.teachers.find(t=>t.id===circle?.teacherId);
          const sub     = s.substitute_teacher_id ? DB.teachers.find(t=>t.id===s.substitute_teacher_id) : null;
          const attCnt  = DB.attendance.filter(a=>a.sessionId===s.id).length;
          const presCnt = DB.attendance.filter(a=>a.sessionId===s.id&&(a.status==='حاضر'||a.status==='متأخر')).length;
          return `<tr>
            <td class="font-bold">${fmtDate(s.date)}</td>
            <td>${circle?.name||'—'}</td>
            <td>${s.substitute_teacher_id
              ? `<span class="text-red-500 line-through text-xs">${teacherFullName(teacher)}</span><br><span class="text-emerald-700 text-xs font-bold">البديل: ${teacherFullName(sub)}</span>`
              : teacherFullName(teacher)}</td>
            <td>${badge(s.teacherAttendance||'—')}</td>
            <td>${badge(s.status==='scheduled'?'مجدول':s.status==='completed'?'completed':'cancelled')}
              ${attCnt?`<span class="text-xs text-stone-400 mr-1">${presCnt}/${attCnt}</span>`:''}
              ${s.status==='cancelled'?'<span class="badge bg-red text-xs mr-1">ملغاة</span>':''}</td>
            <td class="flex gap-1 flex-wrap">
              <button class="btn-sm bg-emerald-100 text-emerald-700" onclick="Sessions.openAtt('${s.id}')">الحضور</button>
              ${(role==='admin'||role==='secretary')?`<button class="btn-sm bg-amber-100 text-amber-700" onclick="Sessions.handleTeacherAtt('${s.id}')">حضور المعلم</button>`:''}
              ${s.status==='scheduled'&&role==='admin'?`<button class="btn-sm bg-red-100 text-red-700" onclick="Sessions.cancel('${s.id}')">إلغاء</button>`:''}
            </td>
          </tr>`;
        }).join('')}
      </tbody></table></div>
    </div>`;
  },

  // ── ATTENDANCE ──────────────────────────────────────────────────
  attendance() {
    const sessions = DB.sessions.filter(s=>s.status!=='cancelled')
      .sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6);
    return `<div class="space-y-4">
      <div class="sh"><span class="st">تسجيل الحضور</span></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        ${sessions.map(s=>{
          const circle = DB.halaqat.find(h=>h.id===s.circleId);
          const attCnt = DB.attendance.filter(a=>a.sessionId===s.id).length;
          const presCnt= DB.attendance.filter(a=>a.sessionId===s.id&&(a.status==='حاضر'||a.status==='متأخر')).length;
          return `<div class="bg-white border border-stone-100 rounded-xl p-4 hover:shadow-md transition cursor-pointer" onclick="Sessions.openAtt('${s.id}')">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-stone-800">${circle?.name||'—'}</span>
              ${badge(s.status==='scheduled'?'مجدول':'completed')}
            </div>
            <div class="text-sm text-stone-400 mb-3">${fmtDate(s.date)}</div>
            ${attCnt?`<div class="prog-bar mb-1"><div class="prog-fill bg-emerald-500" style="width:${Math.round(presCnt/attCnt*100)}%"></div></div>
              <div class="text-xs text-stone-400">${presCnt}/${attCnt} حاضر</div>`
              :`<div class="text-xs text-amber-500">لم يُسجَّل الحضور بعد</div>`}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  },

  // ── HOMEWORK ────────────────────────────────────────────────────
  homework() {
    return `<div class="space-y-6">
      <div class="sh">
        <span class="st text-2xl">الواجبات والتقييم</span>
        <button class="btn btn-primary" onclick="Homework.openAdd()">+ إسناد واجب جديد</button>
      </div>

      <!-- Quick Search & Filters -->
      <div class="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-wrap gap-4 items-end">
        <div class="fg flex-1 min-w-[200px]">
          <label class="fl">تصفية حسب الحلقة</label>
          <select id="hw-filter-circle" class="fi" onchange="Homework.filter()">
            <option value="">كل الحلقات</option>
            ${DB.halaqat.map(h => `<option value="${h.id}">${h.name}</option>`).join('')}
          </select>
        </div>
        <div class="fg flex-[2] min-w-[300px]">
          <label class="fl">بحث سريع</label>
          <input type="text" id="hw-filter-search" class="fi" placeholder="ابحث بالعنوان أو الوصف..." oninput="Homework.filter()"/>
        </div>
        <div class="fg">
          <label class="fl">الحالة</label>
          <select id="hw-filter-status" class="fi" onchange="Homework.filter()">
            <option value="all">الكل</option>
            <option value="pending">بانتظار التصحيح</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="hw-list-container">
        ${Homework.renderList(DB.homework)}
      </div>
    </div>`;
  },

  // ── SUBSCRIPTIONS ────────────────────────────────────────────────
  subscriptions() {
    return `<div class="space-y-4">
      <div class="sh"><span class="st font-black">إدارة الاشتراكات</span>
        <button class="btn btn-primary" onclick="Subscriptions.openAdd()">+ اشتراك جديد</button></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr>
        <th>الطالب</th><th>النوع</th><th>الإجمالي</th><th>الحالة</th><th>إعفاء</th><th>إجراء</th>
      </tr></thead><tbody>
        ${DB.subscriptions.map(sub=>{
          const student = DB.students.find(s=>s.id===sub.studentId);
          return `<tr>
            <td class="font-bold">${student?studentFullName(student):'—'}</td>
            <td>${badge(sub.type)}</td>
            <td class="font-bold">${sub.totalAmount} ج.م</td>
            <td>${badge(sub.status)}</td>
            <td>${sub.isExempt ? `<span class="badge bg-purple">معفي: ${sub.exemptReason||'غير محدد'}</span>` : '<span class="text-stone-400 text-xs">—</span>'}</td>
            <td class="flex gap-1">
              <button class="btn-sm bg-blue-100 text-blue-700" onclick="Subscriptions.openEdit('${sub.id}')">تعديل</button>
              <button class="btn-sm bg-purple-100 text-purple-700" onclick="Subscriptions.toggleExempt('${sub.id}')">${sub.isExempt?'إلغاء الإعفاء':'إعفاء'}</button>
            </div>
          </tr>`;
        }).join('')}
      </tbody></table></div>
    </div>`;
  },


   // memorization section removed

  // ── PAYMENTS ────────────────────────────────────────────────────
  payments() {
    const totalPaidSum = DB.payments.reduce((a,p)=>a+p.amount,0);
    const totalSubscriptions = DB.subscriptions.filter(s=>!s.isExempt).reduce((acc,sub)=>acc+sub.totalAmount,0);
    const totalDelayedSum = DB.subscriptions.filter(s=>!s.isExempt).reduce((acc,sub) => {
      const paid = DB.payments.filter(p=>p.subscriptionId===sub.id).reduce((sum,p)=>sum+p.amount,0);
      return acc + Math.max(0, sub.totalAmount - paid);
    }, 0);

    return `<div class="space-y-4">
      <div class="sh flex flex-wrap justify-between items-center gap-4">
        <span class="st text-2xl">المدفوعات والاشتراكات</span>
        <button class="btn btn-primary whitespace-nowrap" onclick="Payments.openAdd()">+ تسجيل دفعة</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
        <div class="bg-white p-5 rounded-2xl border border-blue-100 flex justify-between items-center shadow-sm relative overflow-hidden">
          <div class="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <div><div class="text-sm font-bold text-blue-600 mb-1">إجمالي الاشتراكات</div><div class="text-3xl font-black text-stone-800">${totalSubscriptions} <span class="text-lg text-stone-400">ج.م</span></div></div>
          <div class="text-5xl opacity-20">💳</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-emerald-100 flex justify-between items-center shadow-sm relative overflow-hidden">
          <div class="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
          <div><div class="text-sm font-bold text-emerald-600 mb-1">الإجمالي المُسدد</div><div class="text-3xl font-black text-stone-800">${totalPaidSum} <span class="text-lg text-stone-400">ج.م</span></div></div>
          <div class="text-5xl opacity-20">💰</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-red-100 flex justify-between items-center shadow-sm relative overflow-hidden">
          <div class="absolute right-0 top-0 bottom-0 w-1 bg-red-500"></div>
          <div><div class="text-sm font-bold text-red-600 mb-1">الإجمالي المتأخر</div><div class="text-3xl font-black text-stone-800">${totalDelayedSum} <span class="text-lg text-stone-400">ج.م</span></div></div>
          <div class="text-5xl opacity-20">⚠</div>
        </div>
      </div>

      <div class="tbl-wrap mt-2"><table class="tbl"><thead><tr>
        <th>الطالب</th><th>النوع</th><th>الإجمالي</th><th>المدفوع</th><th>المتبقي</th><th>الحالة</th><th>إجراء</th>
      </tr></thead><tbody>
        ${DB.subscriptions.map(sub=>{
          const student = DB.students.find(s=>s.id===sub.studentId);
          const payments= DB.payments.filter(p=>p.subscriptionId===sub.id);
          const paid    = payments.reduce((a,p)=>a+p.amount,0);
          const rem     = sub.totalAmount-paid;
          let st      = rem===0?'مدفوع':paid>0?'جزئي':'غير مدفوع';
          if (sub.isExempt) st = 'معفي';

          return `<tr>
            <td class="font-bold">${student?studentFullName(student):'—'}</td>
            <td>${badge(sub.type)}</td>
            <td class="text-stone-500">${sub.totalAmount} ج.م</td>
            <td class="text-emerald-700 font-bold">${paid} ج.م</td>
            <td class="text-red-500 font-bold">${st==='معفي'?'—':(rem>0?rem+' ج.م':'—')}</td>
            <td>${badge(st)}</td>
            <td class="flex gap-1 flex-wrap">
              <button class="btn-sm bg-stone-100 text-stone-600" onclick="Payments.openHistory('${sub.id}')">سجل</button>
              ${rem>0 && !sub.isExempt ? `<button class="btn-sm bg-emerald-100 text-emerald-600 font-bold" onclick="Payments.openAdd('${sub.id}')">دفع</button>` : ''}
            </td>
          </tr>`;
        }).join('')}
      </tbody></table></div>
    </div>`;
  },

  // ── REPORTS ─────────────────────────────────────────────────────
  reports() {
    setTimeout(() => Reports.filter(), 0);
    return `<div class="space-y-6">
      <div class="sh flex justify-between items-center pr-2 border-r-4 border-r-emerald-500">
        <span class="st text-2xl font-black">التقارير التفصيلية المتقدمة</span>
        <button class="btn btn-ghost border border-stone-200" onclick="Reports.exportCSV()">⬇ تصدير Excel / CSV</button>
      </div>
      
      <!-- أدوات الفلترة المتقدمة -->
      <div class="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm flex flex-wrap gap-4 items-end relative overflow-hidden">
        <div class="fg flex-1 min-w-[200px] font-bold">
          <label class="fl text-blue-800">الشهر (للإيرادات)</label>
          <input type="month" id="rep-month" class="fi" value="${new Date().toISOString().slice(0, 7)}" onchange="Reports.filter()"/>
        </div>
        <div class="fg">
          <button class="btn bg-stone-100 text-stone-600 hover:bg-stone-200 whitespace-nowrap" onclick="Reports.resetFilters()">↺ إعادة ضبط</button>
        </div>
      </div>

      <div id="report-content" class="space-y-6">
        <!-- Content gets rendered here via Reports.filter() -->
      </div>
    </div>`;
  },

  // ── AUDIT LOG ───────────────────────────────────────────────────
  auditlog() {
    const now   = new Date();
    const today = now.toISOString().split('T')[0];
    const wkAgo = new Date(now-7*864e5).toISOString().split('T')[0];
    const moAgo = new Date(now-30*864e5).toISOString().split('T')[0];
    const todayCount = DB.audit_log.filter(l=>l.timestamp.startsWith(today)).length;
    const wkCount    = DB.audit_log.filter(l=>l.timestamp>=wkAgo).length;
    const moCount    = DB.audit_log.filter(l=>l.timestamp>=moAgo).length;

    return `<div class="space-y-5">
      <div class="sh"><span class="st">سجل العمليات</span></div>
      <div class="grid grid-cols-3 gap-3">
        ${[{label:'اليوم',val:todayCount},{label:'هذا الأسبوع',val:wkCount},{label:'هذا الشهر',val:moCount}]
          .map(x=>`<div class="bg-white rounded-2xl border border-stone-100 p-4 text-center">
            <div class="text-3xl font-black text-stone-800">${x.val}</div>
            <div class="text-xs text-stone-400 mt-1">${x.label}</div>
          </div>`).join('')}
      </div>

      <div class="bg-white rounded-2xl border border-stone-100 p-4">
        <div class="flex gap-3 flex-wrap items-end">
          <div><label class="fl">نوع العملية</label>
            <select id="log-type" class="fi" style="max-width:150px" onchange="AuditLog.filter()">
              <option value="">الكل</option>
              <option value="إضافة">إضافة</option><option value="تعديل">تعديل</option>
              <option value="حذف">حذف</option><option value="حضور">حضور</option><option value="مالي">مالي</option>
            </select>
          </div>
          <div><label class="fl">المستخدم</label>
            <select id="log-user" class="fi" style="max-width:150px" onchange="AuditLog.filter()">
              <option value="">الكل</option>
              <option value="admin">المدير</option><option value="teacher">المعلم</option><option value="secretary">السكرتيرة</option>
            </select>
          </div>
          <div><label class="fl">من تاريخ</label><input id="log-from" type="date" class="fi" style="max-width:150px" onchange="AuditLog.filter()"/></div>
          <div><label class="fl">إلى تاريخ</label><input id="log-to" type="date" class="fi" style="max-width:150px" onchange="AuditLog.filter()"/></div>
          <button class="btn btn-ghost" onclick="AuditLog.reset()">إعادة تعيين</button>
        </div>
      </div>

      <div class="tbl-wrap" id="log-table-wrap">
        ${AuditLog.renderTable(DB.audit_log)}
      </div>
    </div>`;
  },
};

// ═══════════════════════════════════════════════════════════════
//  MODULES
// ═══════════════════════════════════════════════════════════════

// ── SCHEDULE BUILDER helper ──────────────────────────────────────
function scheduleBuilderHTML(existing=[]) {
  const days=['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
  return `<div class="space-y-2" id="sched-builder">
    ${days.map(day=>{
      const ex = existing.find(s=>s.day===day);
      return `<div class="day-row ${ex?'active':''}" id="dayrow-${day}">
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" class="day-cb" data-day="${day}" ${ex?'checked':''}
            onchange="toggleDayRow(this)" style="width:16px;height:16px;accent-color:#059669"/>
          <span class="font-bold text-stone-700 text-sm">${day}</span>
        </label>
        <div class="time-inputs ${ex?'':'hidden'}" id="times-${day}">
          <div class="fg"><label class="fl">وقت البداية</label>
            <input type="time" class="fi start-time" data-day="${day}" value="${ex?.start_time||'16:00'}"/></div>
          <div class="fg"><label class="fl">وقت النهاية</label>
            <input type="time" class="fi end-time" data-day="${day}" value="${ex?.end_time||'18:00'}"/></div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function toggleDayRow(cb) {
  const row   = document.getElementById(`dayrow-${cb.dataset.day}`);
  const times = document.getElementById(`times-${cb.dataset.day}`);
  row.classList.toggle('active', cb.checked);
  times.classList.toggle('hidden', !cb.checked);
}

function collectSchedules() {
  const schedules = [];
  document.querySelectorAll('.day-cb:checked').forEach(cb=>{
    const day   = cb.dataset.day;
    const start = document.querySelector(`.start-time[data-day="${day}"]`)?.value;
    const end   = document.querySelector(`.end-time[data-day="${day}"]`)?.value;
    if (!start||!end) return;
    if (end <= start) { toast(`وقت النهاية يجب أن يكون بعد البداية (${day})`, 'error'); return; }
    schedules.push({day, start_time:start, end_time:end});
  });
  return schedules;
}

// ── STUDENTS ─────────────────────────────────────────────────────
const Students = {
  rows(list) {
    if (!list.length) return `<tr><td colspan="8" class="text-center py-8 text-stone-400">لا يوجد طلاب</td></tr>`;
    return list.map((s,i)=>{
      const c = DB.halaqat.find(h=>h.id===s.circleId);
      const m = DB.memorization.find(x=>x.studentId===s.id);
      const ph= s.phones?.find(p=>p.label==='أساسي') || s.phones?.[0];
      const statusLabel = {active:'نشط',inactive:'غير نشط',suspended:'موقوف'}[s.status]||s.status;
      return `<tr>
        <td>${i+1}</td>
        <td><button class="font-bold text-emerald-700 hover:underline" onclick="Students.viewProfile('${s.id}')">${studentFullName(s)}</button></td>
        <td>${c?`<span class="badge bg-green text-[10px]">${c.name}</span>`:'<span class="text-stone-400">—</span>'}</td>
        <td class="text-xs">${ph?.number||'—'}</td>
        <td>${badge(statusLabel)}</td>
        <td class="flex gap-1">
          <button class="btn-sm bg-emerald-600 text-white" onclick="Homework.openAdd('${s.circleId}','${s.id}')" title="إسناد واجب جديد">📝</button>
          <button class="btn-sm bg-stone-100 text-stone-600" onclick="Students.viewProfile('${s.id}')" title="عرض الملف">👤</button>
          <button class="btn-sm bg-blue-100 text-blue-700" onclick="Students.openEdit('${s.id}')">✏</button>
        </td>
      </tr>`;
    }).join('');
  },

  filter() {
    const q   = ($('stu-search')?.value||'').toLowerCase();
    const cid = $('stu-circle')?.value||'';
    const st  = $('stu-status')?.value||'';
    const res = DB.students.filter(s=>
      (!q  || studentFullName(s).toLowerCase().includes(q)) &&
      (!cid|| s.circleId===cid) &&
      (!st || s.status===st)
    );
    $('stu-tbody').innerHTML = this.rows(res);
  },

  viewProfile(studentId) {
    const s = DB.students.find(x=>x.id===studentId);
    if (!s) return;
    const c = DB.halaqat.find(h=>h.id===s.circleId);
    const m = DB.memorization.find(x=>x.studentId===s.id);
    const hw = DB.submissions.filter(x=>x.studentId===s.id);
    const att = DB.attendance.filter(a=>a.studentId===s.id);
    const pres = att.filter(a=>a.status==='حاضر'||a.status==='متأخر').length;
    const attPct = att.length ? Math.round(pres/att.length*100) : 0;

    Modal.open(`ملف الطالب: ${studentFullName(s)}`, `
      <div class="space-y-6">
        <div class="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <div class="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            ${s.first_name[0]}
          </div>
          <div>
            <div class="text-lg font-black text-emerald-900">${studentFullName(s)}</div>
            <div class="text-sm text-emerald-700">${c?.name||'غير مسجل بحلقة'}</div>
          </div>
          <button class="mr-auto btn-sm bg-emerald-600 text-white" onclick="Homework.openAdd('${s.circleId}','${s.id}')">+ إسناد واجب</button>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="bg-stone-50 p-3 rounded-xl text-center">
            <div class="text-xl font-bold text-stone-800">${attPct}%</div>
            <div class="text-[10px] text-stone-400">نسبة الحضور</div>
          </div>
          <div class="bg-stone-50 p-3 rounded-xl text-center">
            <div class="text-xl font-bold text-stone-800">${hw.length}</div>
            <div class="text-[10px] text-stone-400">واجبات مسندة</div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="font-bold text-sm text-stone-700 border-b pb-2">سجل الواجبات الأخير</div>
          <div class="space-y-2">
            ${hw.slice(-3).reverse().map(sub => {
              const h = DB.homework.find(x=>x.id===sub.homeworkId);
              return `
                <div class="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl text-sm">
                  <div>
                    <div class="font-bold">${h?.title||'واجب'}</div>
                    <div class="text-[10px] text-stone-400">${fmtDate(h?.sessionId ? DB.sessions.find(sx=>sx.id===h.sessionId)?.date : null)}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    ${sub.evaluation ? badge(sub.evaluation) : '<span class="text-amber-500 font-bold text-xs">بانتظار التقييم</span>'}
                    <button class="text-emerald-600 text-xs hover:underline" onclick="Modal.close(); App.navigate('homework')">تفاصيل</button>
                  </div>
                </div>`;
            }).join('') || '<p class="text-center text-xs text-stone-400 py-4">لا يوجد واجبات مسجلة</p>'}
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-primary flex-1 py-3" onclick="Students.openEdit('${s.id}')">تعديل البيانات</button>
        </div>
      </div>
    `, true);
  },

  phoneFields(phones=[]) {
    const relations=['أب','أم','جد','جدة','ولي أمر','أخرى'];
    const labels=['أساسي','واتساب','منزل','أخرى'];
    const rows = phones.length ? phones : [{number:'',relation:'أب',label:'أساسي'}];
    return `<div id="phones-wrap" class="space-y-2">
      ${rows.map((p,i)=>this._phoneRow(i,p)).join('')}
    </div>
    <button type="button" class="btn-sm bg-emerald-100 text-emerald-700 mt-2" onclick="Students.addPhone()">+ إضافة هاتف</button>`;
  },

  _phoneRow(i, p={}) {
    return `<div class="flex gap-2 items-center" id="ph-row-${i}">
      <input type="tel" class="fi phone-num flex-1" placeholder="05XXXXXXXX" value="${p.number||''}" dir="ltr"/>
      <select class="fi phone-rel" style="max-width:100px">
        ${['أب','أم','جد','جدة','ولي أمر','أخرى'].map(r=>`<option ${r===p.relation?'selected':''}>${r}</option>`).join('')}
      </select>
      <select class="fi phone-lbl" style="max-width:100px">
        ${['أساسي','واتساب','منزل','أخرى'].map(l=>`<option ${l===p.label?'selected':''}>${l}</option>`).join('')}
      </select>
      <button type="button" class="btn-sm bg-red-100 text-red-700 flex-shrink-0" onclick="Students.removePhone(${i})">✕</button>
    </div>`;
  },

  addPhone() {
    const wrap = $('phones-wrap');
    const i = wrap.children.length;
    const div = document.createElement('div');
    div.innerHTML = this._phoneRow(i);
    wrap.appendChild(div.firstElementChild);
  },

  removePhone(i) {
    const el = $(`ph-row-${i}`);
    if (el && $('phones-wrap').children.length > 1) el.remove();
    else toast('يجب أن يكون هناك رقم واحد على الأقل','warn');
  },

  collectPhones() {
    const phones = [];
    document.querySelectorAll('#phones-wrap > div').forEach(row=>{
      const num = row.querySelector('.phone-num')?.value.trim();
      if (!num) return;
      phones.push({
        number: num,
        relation: row.querySelector('.phone-rel')?.value||'أب',
        label: row.querySelector('.phone-lbl')?.value||'أساسي',
      });
    });
    return phones;
  },

  _modalBody(s=null) {
    const circles = DB.halaqat;
    return `<div class="space-y-4">
      ${s?`<input type="hidden" id="s-id" value="${s.id}"/>`:''}
      <div class="grid grid-cols-2 gap-3">
        <div class="fg"><label class="fl">الاسم الأول *</label><input id="s-fn" class="fi" value="${s?.first_name||''}"/></div>
        <div class="fg"><label class="fl">اسم الأب</label><input id="s-fa" class="fi" value="${s?.father_name||''}"/></div>
        <div class="fg"><label class="fl">اسم الجد</label><input id="s-ga" class="fi" value="${s?.grandfather_name||''}"/></div>
        <div class="fg"><label class="fl">اسم العائلة *</label><input id="s-ln" class="fi" value="${s?.family_name||''}"/></div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="fg"><label class="fl">تاريخ الميلاد</label><input id="s-bd" type="date" class="fi" value="${s?.birth_date||''}"/></div>
        <div class="fg"><label class="fl">الجنس</label>
          <select id="s-gen" class="fi"><option value="ذكر" ${s?.gender==='ذكر'?'selected':''}>ذكر</option><option value="أنثى" ${s?.gender==='أنثى'?'selected':''}>أنثى</option></select>
        </div>
      </div>
      <div class="fg"><label class="fl">العنوان</label><textarea id="s-addr" class="fi" rows="2">${s?.address||''}</textarea></div>
      <div class="fg"><label class="fl">الحلقة</label>
        <select id="s-circle" class="fi">
          <option value="">بدون حلقة</option>
          ${circles.map(h=>`<option value="${h.id}" ${s?.circleId===h.id?'selected':''}>${h.name}</option>`).join('')}
        </select>
      </div>
      <div class="fg"><label class="fl">أرقام الهواتف</label>${this.phoneFields(s?.phones)}</div>
      <div class="flex gap-3 pt-2">
        <button class="btn btn-primary flex-1" onclick="Students.${s?'update':'save'}()">حفظ</button>
        <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
      </div>
    </div>`;
  },

  openAdd() { Modal.open('إضافة طالب', this._modalBody(), true); },
  openEdit(id) { Modal.open('تعديل بيانات الطالب', this._modalBody(DB.students.find(s=>s.id===id)), true); },

  viewProfile(id) {
    const s = DB.students.find(x=>x.id===id);
    if (!s) return;
    const c = DB.halaqat.find(h=>h.id===s.circleId);
    const m = DB.memorization.find(x=>x.studentId===id);
    Modal.open(`ملف الطالب — ${studentFullName(s)}`, `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="bg-stone-50 rounded-xl p-3"><span class="text-stone-400">الحلقة</span><br><strong>${c?.name||'—'}</strong></div>
          <div class="bg-stone-50 rounded-xl p-3"><span class="text-stone-400">الجنس</span><br><strong>${s.gender||'—'}</strong></div>
          <div class="bg-stone-50 rounded-xl p-3"><span class="text-stone-400">تاريخ الميلاد</span><br><strong>${fmtDate(s.birth_date)}</strong></div>
          <div class="bg-stone-50 rounded-xl p-3"><span class="text-stone-400">العنوان</span><br><strong>${s.address||'—'}</strong></div>
        </div>
        <div><div class="fl mb-2">أرقام الهواتف</div>
          ${s.phones?.map(p=>`<div class="flex items-center gap-3 p-2 bg-stone-50 rounded-lg mb-1">
            <span class="badge bg-gray">${p.relation}</span>
            <span class="badge bg-blue">${p.label}</span>
            <span dir="ltr" class="font-bold text-sm">${p.number}</span>
          </div>`).join('')||'—'}
        </div>
        </div>
      </div>`);
  },

  _validate() {
    const fn = $('s-fn')?.value.trim();
    const ln = $('s-ln')?.value.trim();
    const bd = $('s-bd')?.value;
    if (!fn) { toast('الاسم الأول مطلوب','error'); return false; }
    if (!ln) { toast('اسم العائلة مطلوب','error'); return false; }
    if (bd && new Date(bd) > new Date()) { toast('تاريخ الميلاد لا يكون في المستقبل','error'); return false; }
    const phones = this.collectPhones();
    if (!phones.length) { toast('يجب إضافة رقم هاتف واحد على الأقل','error'); return false; }
    for (const p of phones) {
      if (!/^05\d{8}$/.test(p.number)) { toast(`رقم الهاتف ${p.number} غير صحيح (يجب أن يبدأ بـ 05 ويكون 10 أرقام)`,'error'); return false; }
    }
    return true;
  },

  save() {
    if (!this._validate()) return;
    const circleId = $('s-circle')?.value;
    if (circleId) {
      const enrolled = DB.students.filter(s=>s.circleId===circleId).length;
      const cap = DB.halaqat.find(h=>h.id===circleId)?.capacity||999;
      if (enrolled>=cap) { toast('الحلقة ممتلئة','error'); return; }
    }
    const s = { id:genId(), first_name:$('s-fn').value.trim(), father_name:$('s-fa').value.trim(),
      grandfather_name:$('s-ga').value.trim(), family_name:$('s-ln').value.trim(),
      birth_date:$('s-bd').value, gender:$('s-gen').value, address:$('s-addr').value,
      circleId, status:'active', phones:this.collectPhones() };
    DB.students.push(s);
    logAction({action:'إضافة',entity:'طالب',entity_id:s.id,entity_name:studentFullName(s),description:'إضافة طالب جديد'});
    toast('تمت إضافة الطالب','success');
    Modal.close(); App.navigate('students');
  },

  update() {
    if (!this._validate()) return;
    const id = $('s-id')?.value;
    const idx = DB.students.findIndex(s=>s.id===id);
    if (idx<0) return;
    const old = {...DB.students[idx]};
    DB.students[idx] = { ...old, first_name:$('s-fn').value.trim(), father_name:$('s-fa').value.trim(),
      grandfather_name:$('s-ga').value.trim(), family_name:$('s-ln').value.trim(),
      birth_date:$('s-bd').value, gender:$('s-gen').value, address:$('s-addr').value,
      circleId:$('s-circle').value, phones:this.collectPhones() };
    logAction({action:'تعديل',entity:'طالب',entity_id:id,entity_name:studentFullName(DB.students[idx]),
      old_value:studentFullName(old),description:'تعديل بيانات طالب'});
    toast('تم التحديث','success');
    Modal.close(); App.navigate('students');
  },

  delete(id) {
    const s = DB.students.find(x=>x.id===id);
    if (!confirm2(`حذف الطالب "${studentFullName(s)}"؟`)) return;
    DB.students = DB.students.filter(x=>x.id!==id);
    logAction({action:'حذف',entity:'طالب',entity_id:id,entity_name:studentFullName(s),old_value:studentFullName(s),description:'حذف طالب'});
    toast('تم الحذف','info');
    App.navigate('students');
  },
};

// ── TEACHERS ─────────────────────────────────────────────────────
const Teachers = {
  openAdd() {
    Modal.open('إضافة معلم', `<div class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="fg"><label class="fl">الاسم الأول *</label><input id="t-fn" class="fi"/></div>
        <div class="fg"><label class="fl">اسم العائلة *</label><input id="t-ln" class="fi"/></div>
      </div>
      <div class="fg"><label class="fl">التخصص</label><input id="t-spec" class="fi" placeholder="تجويد وحفظ..."/></div>
      <div class="fg"><label class="fl">الهاتف</label><input id="t-ph" class="fi" dir="ltr" placeholder="05XXXXXXXX"/></div>
      <div class="flex gap-3 pt-2">
        <button class="btn btn-primary flex-1" onclick="Teachers.save()">حفظ</button>
        <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
      </div>
    </div>`);
  },

  save() {
    const fn = $('t-fn')?.value.trim(); const ln = $('t-ln')?.value.trim();
    if (!fn||!ln) { toast('الاسم مطلوب','error'); return; }
    const t = {id:genId(),first_name:fn,family_name:ln,specialty:$('t-spec')?.value,phone:$('t-ph')?.value,status:'active'};
    DB.teachers.push(t);
    logAction({action:'إضافة',entity:'معلم',entity_id:t.id,entity_name:teacherFullName(t),description:'إضافة معلم جديد'});
    toast('تمت الإضافة','success'); Modal.close(); App.navigate('teachers');
  },

  openEdit(id) {
    const t = DB.teachers.find(x=>x.id===id);
    if (!t) return;
    Modal.open('تعديل معلم', `<input type="hidden" id="t-id" value="${id}"/>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="fg"><label class="fl">الاسم الأول</label><input id="t-fn" class="fi" value="${t.first_name}"/></div>
          <div class="fg"><label class="fl">العائلة</label><input id="t-ln" class="fi" value="${t.family_name}"/></div>
        </div>
        <div class="fg"><label class="fl">التخصص</label><input id="t-spec" class="fi" value="${t.specialty||''}"/></div>
        <div class="fg"><label class="fl">الهاتف</label><input id="t-ph" class="fi" value="${t.phone||''}" dir="ltr"/></div>
        <div class="flex gap-3 pt-2">
          <button class="btn btn-primary flex-1" onclick="Teachers.update()">تحديث</button>
          <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
        </div>
      </div>`);
  },

  update() {
    const id=($('t-id')?.value); const idx=DB.teachers.findIndex(t=>t.id===id);
    if (idx<0) return;
    DB.teachers[idx]={...DB.teachers[idx],first_name:$('t-fn').value,family_name:$('t-ln').value,specialty:$('t-spec').value,phone:$('t-ph').value};
    logAction({action:'تعديل',entity:'معلم',entity_id:id,entity_name:teacherFullName(DB.teachers[idx]),description:'تعديل بيانات معلم'});
    toast('تم التحديث','success'); Modal.close(); App.navigate('teachers');
  },

  delete(id) {
    const t=DB.teachers.find(x=>x.id===id);
    if (!confirm2(`حذف المعلم "${teacherFullName(t)}"؟`)) return;
    DB.teachers=DB.teachers.filter(x=>x.id!==id);
    logAction({action:'حذف',entity:'معلم',entity_id:id,entity_name:teacherFullName(t),old_value:teacherFullName(t),description:'حذف معلم'});
    toast('تم الحذف','info'); App.navigate('teachers');
  },
};

// ── CIRCLES ──────────────────────────────────────────────────────
const Circles = {
  _body(c=null) {
    return `<div class="space-y-4">
      ${c?`<input type="hidden" id="c-id" value="${c.id}"/>`:''}
      <div class="fg"><label class="fl">اسم الحلقة *</label><input id="c-name" class="fi" value="${c?.name||''}"/></div>
      <div class="grid grid-cols-2 gap-3">
        <div class="fg"><label class="fl">المستوى</label>
          <select id="c-lvl" class="fi">
            ${['مبتدئ','متوسط','متقدم'].map(l=>`<option ${c?.level===l?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>
        <div class="fg"><label class="fl">السعة</label><input id="c-cap" type="number" class="fi" value="${c?.capacity||10}" min="1" max="50"/></div>
      </div>
      <div class="fg"><label class="fl">المعلم المسؤول</label>
        <select id="c-teacher" class="fi">
          <option value="">اختر معلماً</option>
          ${DB.teachers.map(t=>`<option value="${t.id}" ${c?.teacherId===t.id?'selected':''}>${teacherFullName(t)}</option>`).join('')}
        </select>
      </div>
      <div class="fg"><label class="fl">الموقع</label><input id="c-loc" class="fi" value="${c?.location||''}" placeholder="قاعة ١ - الدور الأرضي"/></div>
      <div class="fg"><label class="fl">الوصف</label><textarea id="c-desc" class="fi" rows="2">${c?.description||''}</textarea></div>
      <div class="fg"><label class="fl">الجدول الزمني</label>${scheduleBuilderHTML(c?.schedules||[])}</div>
      <div id="conflict-wrap"></div>
      <div class="flex gap-3 pt-2">
        <button class="btn btn-primary flex-1" onclick="Circles.${c?'update':'save'}()">حفظ</button>
        <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
      </div>
    </div>`;
  },

  openAdd()    { Modal.open('إنشاء حلقة جديدة', this._body(), true); },
  openEdit(id) { Modal.open('تعديل الحلقة', this._body(DB.halaqat.find(c=>c.id===id)), true); },

  _checkAndWarn(teacherId, schedules, excludeId=null) {
    const cw = $('conflict-wrap'); if (!cw) return true;
    if (!teacherId||!schedules.length) { cw.innerHTML=''; return true; }
    const conflicts = checkTeacherConflicts(teacherId, schedules, excludeId);
    if (conflicts.length) {
      cw.innerHTML = `<div class="conflict-banner error"><span>🚫</span><div>
        <strong>تعارض في مواعيد المعلم!</strong><br>
        ${conflicts.map(c=>`<div class="text-xs mt-1">• ${c}</div>`).join('')}
      </div></div>`;
      return false;
    }
    cw.innerHTML = `<div class="conflict-banner"><span>✓</span><span class="text-emerald-800">لا يوجد تعارض في مواعيد المعلم</span></div>`;
    return true;
  },

  save() {
    const name = $('c-name')?.value.trim();
    if (!name) { toast('اسم الحلقة مطلوب','error'); return; }
    const schedules  = collectSchedules();
    const teacherId  = $('c-teacher')?.value;
    if (!this._checkAndWarn(teacherId, schedules)) { toast('يوجد تعارض في مواعيد المعلم — لا يمكن الحفظ','error'); return; }
    const c = {id:genId(),name,level:$('c-lvl').value,capacity:parseInt($('c-cap').value)||10,
      teacherId,location:$('c-loc').value,description:$('c-desc').value,status:'active',schedules};
    DB.halaqat.push(c);
    logAction({action:'إضافة',entity:'حلقة',entity_id:c.id,entity_name:name,description:'إضافة حلقة جديدة'});
    toast('تمت إضافة الحلقة','success'); Modal.close(); App.navigate('circles');
  },

  update() {
    const id=($('c-id')?.value); const idx=DB.halaqat.findIndex(c=>c.id===id);
    if (idx<0) return;
    const name=($('c-name').value.trim());
    const schedules=collectSchedules();
    const teacherId=($('c-teacher').value);
    if (!this._checkAndWarn(teacherId,schedules,id)) { toast('يوجد تعارض — لا يمكن الحفظ','error'); return; }
    const old=DB.halaqat[idx];
    DB.halaqat[idx]={...old,name,level:$('c-lvl').value,capacity:parseInt($('c-cap').value)||10,
      teacherId,location:$('c-loc').value,description:$('c-desc').value,schedules};
    logAction({action:'تعديل',entity:'حلقة',entity_id:id,entity_name:name,old_value:`السعة: ${old.capacity}`,new_value:`السعة: ${DB.halaqat[idx].capacity}`,description:'تعديل بيانات حلقة'});
    toast('تم التحديث','success'); Modal.close(); App.navigate('circles');
  },

  delete(id) {
    const c=DB.halaqat.find(x=>x.id===id);
    const enrolled=DB.students.filter(s=>s.circleId===id).length;
    if (enrolled&&!confirm2(`الحلقة تحتوي ${enrolled} طالب. تأكيد الحذف؟`)) return;
    if (!enrolled&&!confirm2(`حذف "${c?.name}"؟`)) return;
    DB.halaqat=DB.halaqat.filter(x=>x.id!==id);
    DB.students=DB.students.map(s=>s.circleId===id?{...s,circleId:''}:s);
    logAction({action:'حذف',entity:'حلقة',entity_id:id,entity_name:c?.name||'',old_value:c?.name,description:'حذف حلقة'});
    toast('تم الحذف','info'); App.navigate('circles');
  },

  viewStudents(id) {
    const c=DB.halaqat.find(h=>h.id===id);
    const students=DB.students.filter(s=>s.circleId===id);
    Modal.open(`طلاب ${c?.name}`,`<div class="space-y-2">
      ${students.map((s,i)=>`<div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
        <span class="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">${i+1}</span>
        <span class="font-bold text-stone-800 flex-1">${studentFullName(s)}</span>
        <span class="text-xs text-stone-400 dir-ltr">${s.phones?.[0]?.number||'—'}</span>
      </div>`).join('')||'<p class="text-center text-stone-400 py-6">لا يوجد طلاب</p>'}
      <div class="text-sm text-stone-400 text-center pt-2">${students.length}/${c?.capacity} طالب</div>
    </div>`);
  },
};

// ── SESSIONS ─────────────────────────────────────────────────────
const Sessions = {
  openAdd() {
    Modal.open('إضافة جلسة يدوية', `
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
        ℹ في الإنتاج تُنشأ الجلسات تلقائياً — هذا للطوارئ فقط
      </div>
      <div class="space-y-4">
        <div class="fg"><label class="fl">الحلقة *</label>
          <select id="ss-circle" class="fi">
            ${DB.halaqat.map(h=>`<option value="${h.id}">${h.name}</option>`).join('')}
          </select>
        </div>
        <div class="fg"><label class="fl">التاريخ *</label><input id="ss-date" type="date" class="fi" value="${today()}"/></div>
        <div class="flex gap-3 pt-2">
          <button class="btn btn-primary flex-1" onclick="Sessions.save()">حفظ</button>
          <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
        </div>
      </div>`);
  },

  save() {
    const cid=($('ss-circle')?.value); const date=($('ss-date')?.value);
    if (!cid||!date) { toast('البيانات ناقصة','error'); return; }
    const s={id:genId(),circleId:cid,date,status:'scheduled',teacherAttendance:'حاضر',substitute_teacher_id:null};
    DB.sessions.push(s);
    const c=DB.halaqat.find(h=>h.id===cid);
    logAction({action:'إضافة',entity:'جلسة',entity_id:s.id,entity_name:`${c?.name||''} - ${fmtDate(date)}`,description:'إضافة جلسة يدوية + حضور المعلم تلقائياً'});
    toast('تم إنشاء الجلسة + Trigger حضور المعلم','success');
    Modal.close(); App.navigate('sessions');
  },

  simulateWeek() {
    const now  = new Date();
    const days = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    let created = 0;
    for (let i=0; i<7; i++) {
      const d   = new Date(now); d.setDate(now.getDate()+i);
      const day = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];
      DB.halaqat.forEach(h=>{
        if (!h.schedules?.find(s=>s.day===day)) return;
        const exists=DB.sessions.find(s=>s.circleId===h.id&&s.date===dateStr);
        if (exists) return;
        DB.sessions.push({id:genId(),circleId:h.id,date:dateStr,status:'scheduled',teacherAttendance:'حاضر',substitute_teacher_id:null});
        created++;
      });
    }
    toast(`تم توليد ${created} جلسة للأسبوع الجاري`,'success');
    App.navigate('sessions');
  },

  cancel(id) {
    const s=DB.sessions.find(x=>x.id===id);
    if (!confirm2('إلغاء هذه الجلسة؟')) return;
    s.status='cancelled';
    // flag homework due on this session
    const hwList=DB.homework.filter(hw=>hw.dueSessionId===id);
    if (hwList.length) toast(`تنبيه: ${hwList.length} واجب كان موعد تسليمه هذه الجلسة — يمكنك تأجيله من شاشة الواجبات`,'warn');
    logAction({action:'تعديل',entity:'جلسة',entity_id:id,entity_name:fmtDate(s.date),old_value:'مجدول',new_value:'ملغاة',description:'إلغاء جلسة'});
    toast('تم إلغاء الجلسة','info'); App.navigate('sessions');
  },

  handleTeacherAtt(id) {
    const s=DB.sessions.find(x=>x.id===id);
    const opts=['حاضر','غائب','بعذر'];
    const next=opts[(opts.indexOf(s.teacherAttendance||'حاضر')+1)%opts.length];
    const old=s.teacherAttendance;
    s.teacherAttendance=next;
    logAction({action:'تعديل',entity:'حضور معلم',entity_id:id,entity_name:fmtDate(s.date),old_value:old,new_value:next,description:'تغيير حضور المعلم'});
    if (next==='غائب') this.openSubstitute(id);
    else { toast(`حضور المعلم: ${next}`,'info'); App.navigate('sessions'); }
  },

  openSubstitute(id) {
    const s=DB.sessions.find(x=>x.id===id);
    const circle=DB.halaqat.find(h=>h.id===s.circleId);
    const origTeacher=DB.teachers.find(t=>t.id===circle?.teacherId);
    Modal.open('تعيين معلم بديل',`
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
        المعلم الأصلي <strong>${teacherFullName(origTeacher)}</strong> غائب عن جلسة ${fmtDate(s.date)}
      </div>
      <div class="fg mb-4"><label class="fl">المعلم البديل</label>
        <select id="sub-teacher" class="fi">
          <option value="">بدون بديل</option>
          ${DB.teachers.filter(t=>t.id!==circle?.teacherId).map(t=>`
            <option value="${t.id}" ${s.substitute_teacher_id===t.id?'selected':''}>${teacherFullName(t)}</option>`).join('')}
        </select>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-primary flex-1" onclick="Sessions.saveSubstitute('${id}')">حفظ</button>
        <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
      </div>`);
  },

  saveSubstitute(id) {
    const s=DB.sessions.find(x=>x.id===id);
    const subId=($('sub-teacher')?.value)||null;
    s.substitute_teacher_id=subId;
    const sub=subId?DB.teachers.find(t=>t.id===subId):null;
    logAction({action:'تعديل',entity:'معلم بديل',entity_id:id,entity_name:fmtDate(s.date),new_value:sub?teacherFullName(sub):'بدون بديل',description:'تعيين معلم بديل'});
    toast(sub?`تم تعيين ${teacherFullName(sub)} كبديل`:'تم الحفظ بدون بديل','success');
    Modal.close(); App.navigate('sessions');
  },

  openAtt(sessionId) {
    const session=DB.sessions.find(s=>s.id===sessionId);
    const circle=DB.halaqat.find(h=>h.id===session?.circleId);
    const students=DB.students.filter(s=>s.circleId===session?.circleId);
    const saved={};
    DB.attendance.filter(a=>a.sessionId===sessionId).forEach(a=>{saved[a.studentId]=a.status;});
    const colors={'حاضر':'bg-emerald-500 text-white','غائب':'bg-red-500 text-white','بعذر':'bg-amber-500 text-white','متأخر':'bg-blue-500 text-white'};
    const sub=session?.substitute_teacher_id?DB.teachers.find(t=>t.id===session.substitute_teacher_id):null;
    const orig=DB.teachers.find(t=>t.id===circle?.teacherId);

    Modal.open(`حضور — ${circle?.name||''} | ${fmtDate(session?.date)}`,`
      ${sub?`<div class="conflict-banner mb-4"><span>⚠</span>هذه الجلسة يقودها <strong>${teacherFullName(sub)}</strong> نيابةً عن ${teacherFullName(orig)}</div>`:''}
      <div class="space-y-2 mb-4" id="att-form">
        ${students.map(s=>`
          <div class="att-card ${saved[s.id]==='حاضر'?'present':saved[s.id]==='غائب'?'absent':saved[s.id]==='بعذر'?'excused':saved[s.id]==='متأخر'?'late':''}" id="attcard-${s.id}">
            <span class="font-bold text-stone-800 text-sm">${studentFullName(s)}</span>
            <div class="flex gap-1">
              ${['حاضر','غائب','بعذر','متأخر'].map(st=>`
                <button class="btn-sm ${saved[s.id]===st?colors[st]:'bg-stone-100 text-stone-500'}"
                  onclick="Sessions.markAtt('${sessionId}','${s.id}','${st}',this)">${st}</button>
              `).join('')}
            </div>
          </div>`).join('')}
      </div>
      <div class="flex gap-3 border-t border-stone-100 pt-4">
        <button class="btn btn-primary flex-1" onclick="Sessions.saveAtt('${sessionId}')">حفظ الحضور</button>
        <button class="btn btn-ghost" onclick="Modal.close()">إغلاق</button>
      </div>`,true);
  },

  markAtt(sessionId,studentId,status,btn) {
    const card=document.getElementById(`attcard-${studentId}`);
    if (card) {
      card.className=`att-card ${status==='حاضر'?'present':status==='غائب'?'absent':status==='بعذر'?'excused':'late'}`;
      const colors={'حاضر':'bg-emerald-500 text-white','غائب':'bg-red-500 text-white','بعذر':'bg-amber-500 text-white','متأخر':'bg-blue-500 text-white'};
      card.querySelectorAll('.btn-sm').forEach(b=>{
        const txt=b.textContent.trim();
        b.className=`btn-sm ${b===btn?(colors[txt]||'bg-stone-100 text-stone-500'):'bg-stone-100 text-stone-500'}`;
      });
    }
    const ex=DB.attendance.find(a=>a.sessionId===sessionId&&a.studentId===studentId);
    if (ex) ex.status=status;
    else DB.attendance.push({id:genId(),sessionId,studentId,status});
  },

  saveAtt(sessionId) {
    const s=DB.sessions.find(x=>x.id===sessionId);
    if (s) s.status='completed';
    const total=DB.attendance.filter(a=>a.sessionId===sessionId).length;
    const present=DB.attendance.filter(a=>a.sessionId===sessionId&&(a.status==='حاضر'||a.status==='متأخر')).length;
    logAction({action:'حضور',entity:'جلسة',entity_id:sessionId,entity_name:fmtDate(s?.date),new_value:`${present}/${total} حاضر`,description:'تسجيل حضور جلسة'});
    toast(`تم حفظ الحضور: ${present}/${total} حاضر`,'success');
    Modal.close(); App.navigate('sessions');
  },
};

// ── HOMEWORK ─────────────────────────────────────────────────────
const Homework = {
  openAdd(preCircleId = null, preStudentId = null) {
    const sessions = DB.sessions.filter(s => s.status !== 'cancelled').sort((a, b) => b.date.localeCompare(a.date));
    const halaqat = DB.halaqat.filter(h => h.status === 'active');
    
    Modal.open('إسناد واجب جديد', `
      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="fg"><label class="fl">العنوان *</label><input id="hw-title" class="fi" placeholder="مثلاً: حفظ سورة الملك"/></div>
          <div class="fg"><label class="fl">النوع</label>
            <select id="hw-type" class="fi"><option>حفظ</option><option>مراجعة</option><option>تجويد</option><option>تفسير</option></select>
          </div>
        </div>
        
        <div class="fg"><label class="fl">الوصف تفصيلياً</label><textarea id="hw-desc" class="fi" rows="2" placeholder="اكتب تعليمات الواجب هنا..."></textarea></div>

        <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 space-y-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-emerald-600">🎯</span>
            <span class="font-bold text-sm text-stone-700">تحديد المستهدفين</span>
          </div>
          
          <div class="fg">
            <label class="fl">نطاق الواجب</label>
            <div class="flex flex-wrap gap-2">
              <button onclick="Homework.setTargetMode('circle', this)" class="mode-tab active" id="mode-circle">حلقة كاملة</button>
              <button onclick="Homework.setTargetMode('group', this)" class="mode-tab" id="mode-group">مجموعة طلاب</button>
              <button onclick="Homework.setTargetMode('single', this)" class="mode-tab" id="mode-single">طالب واحد</button>
            </div>
          </div>

          <!-- Circle Selector -->
          <div id="target-circle-wrap" class="fg">
            <label class="fl">اختر النطاق (حلقة أو الجميع)</label>
            <select id="hw-circle-id" class="fi" onchange="Homework.refreshStudentList(this.value)">
              <option value="">-- اختر النطاق --</option>
              <option value="all_global">🌍 جميع الطلاب في المركز</option>
              ${halaqat.map(h => `<option value="${h.id}" ${h.id === preCircleId ? 'selected' : ''}>${h.name}</option>`).join('')}
            </select>
          </div>

          <!-- Student List (for Group/Single) -->
          <div id="target-students-wrap" class="fg hidden">
            <label class="fl" id="stu-list-label">اختر الطلاب</label>
            <div id="stu-selector-list" class="max-h-40 overflow-y-auto border border-stone-200 rounded-xl p-2 bg-white space-y-1">
              <p class="text-center text-xs text-stone-400 py-4">اختر حلقة أولاً ليظهر الطلاب</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="fg"><label class="fl">جلسة الإسناد *</label>
            <select id="hw-session" class="fi">
              ${sessions.map(s => { const c = DB.halaqat.find(h => h.id === s.circleId); return `<option value="${s.id}">${c?.name || '—'} — ${fmtDate(s.date)}</option>` }).join('')}
            </select>
          </div>
          <div class="fg"><label class="fl">جلسة المراجعة/التصحيح</label>
            <select id="hw-due" class="fi">
              <option value="">غير محدد</option>
              ${sessions.map(s => { const c = DB.halaqat.find(h => h.id === s.circleId); return `<option value="${s.id}">${c?.name || '—'} — ${fmtDate(s.date)}</option>` }).join('')}
            </select>
          </div>
        </div>

        <div class="flex gap-3 pt-4 border-t border-stone-100">
          <button class="btn btn-primary flex-1 py-3" onclick="Homework.save()">✅ حفظ وإسناد الواجب</button>
          <button class="btn btn-ghost py-3" onclick="Modal.close()">إلغاء</button>
        </div>
      </div>`, true);

    if (preCircleId) {
      this._targetMode = 'circle';
      setTimeout(() => {
        this.refreshStudentList(preCircleId, preStudentId);
        if (preStudentId) {
          this.setTargetMode('single', $('mode-single'));
        }
      }, 10);
    }
  },

  _targetMode: 'circle',
  setTargetMode(mode, btn) {
    this._targetMode = mode;
    btn.closest('.flex').querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const studentsWrap = $('target-students-wrap');
    const label = $('stu-list-label');
    
    if (mode === 'circle') {
      studentsWrap.classList.add('hidden');
    } else {
      studentsWrap.classList.remove('hidden');
      label.textContent = mode === 'single' ? 'اختر الطالب المستهدف' : 'اختر مجموعة الطلاب';
      this.refreshStudentList($('hw-circle-id').value);
    }
  },

  refreshStudentList(circleId, preSelectedId = null) {
    const list = $('stu-selector-list');
    if (!circleId) {
      list.innerHTML = `<p class="text-center text-xs text-stone-400 py-4">اختر حلقة أولاً ليظهر الطلاب</p>`;
      return;
    }
    const students = DB.students.filter(s => s.circleId === circleId);
    if (!students.length) {
      list.innerHTML = `<p class="text-center text-xs text-stone-400 py-4">لا يوجد طلاب في هذه الحلقة</p>`;
      return;
    }

    if (this._targetMode === 'single') {
      list.innerHTML = students.map(s => `
        <label class="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors">
          <input type="radio" name="target-student" value="${s.id}" ${s.id === preSelectedId ? 'checked' : ''}>
          <span class="text-sm font-medium text-stone-700">${studentFullName(s)}</span>
        </label>
      `).join('');
    } else {
      list.innerHTML = students.map(s => `
        <label class="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors">
          <input type="checkbox" name="target-students" value="${s.id}">
          <span class="text-sm font-medium text-stone-700">${studentFullName(s)}</span>
        </label>
      `).join('');
    }
  },

  save() {
    const title = $('hw-title')?.value.trim();
    const sessionId = $('hw-session')?.value;
    const circleId = $('hw-circle-id')?.value;
    
    if (!title) { toast('العنوان مطلوب', 'error'); return; }
    if (!circleId) { toast('يجب اختيار النطاق', 'error'); return; }
    if (!sessionId) { toast('اختر جلسة الإسناد', 'error'); return; }

    let targetStudentIds = [];
    if (this._targetMode === 'circle') {
      if (circleId === 'all_global') {
        targetStudentIds = DB.students.filter(s => s.status === 'active').map(s => s.id);
      } else {
        targetStudentIds = DB.students.filter(s => s.circleId === circleId).map(s => s.id);
      }
    } else if (this._targetMode === 'single') {
      const selected = document.querySelector('input[name="target-student"]:checked');
      if (!selected) { toast('يجب اختيار طالب', 'error'); return; }
      targetStudentIds = [selected.value];
    } else {
      const selected = document.querySelectorAll('input[name="target-students"]:checked');
      if (selected.length === 0) { toast('يجب اختيار طالب واحد على الأقل', 'error'); return; }
      targetStudentIds = Array.from(selected).map(i => i.value);
    }

    const hwId = genId();
    const dueSessionId = $('hw-due')?.value || null;
    const scope = targetStudentIds.length === 1 ? 'personal' : 'general';
    
    DB.homework.push({
      id: hwId,
      sessionId,
      dueSessionId,
      title,
      description: $('hw-desc')?.value,
      type: $('hw-type')?.value,
      scope,
      studentId: targetStudentIds.length === 1 ? targetStudentIds[0] : null,
      circleId
    });

    targetStudentIds.forEach(sid => {
      DB.submissions.push({
        id: genId(),
        homeworkId: hwId,
        studentId: sid,
        grade: null,
        evaluation: null,
        notes: '',
        reassigned: false
      });
    });

    if (dueSessionId) {
      const dueSession = DB.sessions.find(s => s.id === dueSessionId);
      Notifications.add(hwId, title, dueSession?.date);
    }

    logAction({
      action: 'إضافة',
      entity: 'واجب',
      entity_id: hwId,
      entity_name: title,
      description: `إسناد واجب لـ ${targetStudentIds.length} طالب`
    });

    toast(`تم إسناد الواجب لـ ${targetStudentIds.length} طالب بنجاح`, 'success');
    Modal.close();
    App.navigate('homework');
  },

  filter() {
    const circleId = $('hw-filter-circle')?.value;
    const search = $('hw-filter-search')?.value.toLowerCase();
    const status = $('hw-filter-status')?.value;
    
    let filtered = DB.homework;
    if (circleId) filtered = filtered.filter(h => h.circleId === circleId);
    if (search) filtered = filtered.filter(h => h.title.toLowerCase().includes(search) || h.description.toLowerCase().includes(search));
    
    if (status === 'pending') {
      filtered = filtered.filter(h => {
        const subs = DB.submissions.filter(s => s.homeworkId === h.id);
        return subs.some(s => !s.evaluation);
      });
    } else if (status === 'completed') {
      filtered = filtered.filter(h => {
        const subs = DB.submissions.filter(s => s.homeworkId === h.id);
        return subs.every(s => s.evaluation);
      });
    }
    
    const container = $('hw-list-container');
    if (container) container.innerHTML = this.renderList(filtered);
  },

  renderList(homeworks) {
    if (!homeworks.length) return `<div class="col-span-full py-12 text-center text-stone-400">لا توجد واجبات مطابقة لهذا البحث</div>`;
    
    return homeworks.map(hw => {
      const session = DB.sessions.find(s => s.id === hw.sessionId);
      const circle = DB.halaqat.find(h => h.id === hw.circleId) || (session ? DB.halaqat.find(h => h.id === session.circleId) : null);
      const dueSession = DB.sessions.find(s => s.id === hw.dueSessionId);
      const subs = DB.submissions.filter(s => s.homeworkId === hw.id);
      const graded = subs.filter(s => s.evaluation).length;
      const pct = subs.length ? Math.round(graded / subs.length * 100) : 0;
      const isCancelled = dueSession?.status === 'cancelled';
      const student = hw.scope === 'personal' ? DB.students.find(s => s.id === hw.studentId) : null;

      return `
        <div class="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3 flex-wrap gap-2">
            <div>
              <div class="font-bold text-stone-800 text-base">${hw.title}</div>
              <div class="text-xs text-stone-400 mt-1 line-clamp-2">${hw.description}</div>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              ${badge(hw.type)}
              ${hw.scope === 'personal' && student ? `<span class="badge bg-purple">${studentFullName(student)}</span>` : `<span class="badge bg-blue">حلقة: ${circle?.name || '—'}</span>`}
            </div>
          </div>
          ${isCancelled ? `<div class="conflict-banner mb-3"><span>⚠</span><div><strong>جلسة التسليم ألغيت!</strong></div></div>` : ''}
          <div class="grid grid-cols-2 gap-y-2 text-xs text-stone-500 mb-4 bg-stone-50 p-3 rounded-xl">
            <div>📅 البداية: <strong>${fmtDate(session?.date)}</strong></div>
            <div>⏰ التسليم: <strong>${fmtDate(dueSession?.date) || '—'}</strong></div>
            <div class="col-span-2">📊 التصحيح: <strong>${graded} من أصل ${subs.length} طلاب</strong></div>
          </div>
          <div class="prog-bar mb-1"><div class="prog-fill ${pct === 100 ? 'bg-emerald-500' : 'bg-amber-400'}" style="width:${pct}%"></div></div>
          <div class="flex items-center justify-between text-[10px] text-stone-400 mb-3">
             <span>إنجاز: ${pct}%</span>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary text-xs py-2 flex-1" onclick="Homework.openGrade('${hw.id}')">
              ${graded < subs.length ? '✏ تصحيح المسندين' : '👁 مراجعة التقييمات'}
            </button>
            <button class="btn btn-ghost text-xs py-2" onclick="Homework.openRenew('${hw.id}')" title="تجديد">🔄</button>
          </div>
        </div>`;
    }).join('');
  },


  openRenew(hwId) {
    const hw=DB.homework.find(h=>h.id===hwId);
    const session=DB.sessions.find(s=>s.id===hw?.sessionId);
    const futureSessions=DB.sessions.filter(s=>s.status==='scheduled'&&s.circleId===session?.circleId);
    Modal.open(`تجديد واجب: ${hw?.title}`,`
      <div class="space-y-4">
        <div class="fg"><label class="fl">النطاق</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="renew-scope" value="unsubmitted" checked/> لم يسلموا فقط</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="renew-scope" value="all"/> جميع الطلاب</label>
          </div>
        </div>
        <div class="fg"><label class="fl">جلسة التسليم الجديدة</label>
          <select id="renew-due" class="fi">
            <option value="">غير محدد</option>
            ${futureSessions.map(s=>`<option value="${s.id}">${fmtDate(s.date)}</option>`).join('')}
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn btn-primary flex-1" onclick="Homework.saveRenew('${hwId}')">تجديد</button>
          <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
        </div>
      </div>`);
  },

  saveRenew(hwId) {
    const scope=document.querySelector('input[name="renew-scope"]:checked')?.value||'unsubmitted';
    const dueId=($('renew-due')?.value)||null;
    const hw=DB.homework.find(h=>h.id===hwId);
    const session=DB.sessions.find(s=>s.id===hw?.sessionId);
    let targets;
    if (scope==='unsubmitted') {
      const unsub=DB.submissions.filter(s=>s.homeworkId===hwId&&!s.evaluation).map(s=>s.studentId);
      targets=DB.students.filter(s=>unsub.includes(s.id));
    } else {
      targets=DB.students.filter(s=>s.circleId===session?.circleId);
    }
    targets.forEach(s=>DB.submissions.push({id:genId(),homeworkId:hwId,studentId:s.id,grade:null,evaluation:null,notes:'',reassigned:true}));
    if (dueId) {
      const ds=DB.sessions.find(s=>s.id===dueId);
      Notifications.add(hwId,hw?.title||'',ds?.date);
      hw.dueSessionId=dueId;
    }
    logAction({action:'تعديل',entity:'واجب',entity_id:hwId,entity_name:hw?.title||'',description:`تجديد الواجب لـ ${targets.length} طالب`});
    toast(`تم تجديد الواجب لـ ${targets.length} طالب`,'success');
    Modal.close(); App.navigate('homework');
  },

  postpone(hwId) {
    const hw=DB.homework.find(h=>h.id===hwId);
    const session=DB.sessions.find(s=>s.id===hw?.sessionId);
    const future=DB.sessions.filter(s=>s.status==='scheduled'&&s.circleId===session?.circleId);
    Modal.open(`تأجيل واجب: ${hw?.title}`,`
      <div class="space-y-4">
        <div class="fg"><label class="fl">الجلسة الجديدة للتسليم</label>
          <select id="postpone-due" class="fi">
            ${future.map(s=>`<option value="${s.id}">${fmtDate(s.date)}</option>`).join('')}
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn btn-gold flex-1" onclick="Homework.savePostpone('${hwId}')">تأجيل</button>
          <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
        </div>
      </div>`);
  },

  savePostpone(hwId) {
    const hw=DB.homework.find(h=>h.id===hwId);
    const newDueId=($('postpone-due')?.value);
    if (!newDueId) { toast('اختر جلسة','error'); return; }
    const old=hw.dueSessionId;
    hw.dueSessionId=newDueId;
    const ds=DB.sessions.find(s=>s.id===newDueId);
    Notifications.add(hwId,hw.title||'',ds?.date);
    logAction({action:'تعديل',entity:'واجب',entity_id:hwId,entity_name:hw.title||'',old_value:`موعد: ${fmtDate(old)}`,new_value:`مؤجل إلى: ${fmtDate(ds?.date)}`,description:'تأجيل موعد تسليم الواجب'});
    toast(`تم تأجيل الواجب إلى ${fmtDate(ds?.date)}`,'success');
    Modal.close(); App.navigate('homework');
  },

  openGrade(hwId) {
    const hw=DB.homework.find(h=>h.id===hwId);
    const subs=DB.submissions.filter(s=>s.homeworkId===hwId);
    const uniqueStudents=[...new Set(subs.map(s=>s.studentId))];
    // show latest submission per student
    const latestSubs=uniqueStudents.map(sid=>{
      const st=subs.filter(s=>s.studentId===sid);
      return st[st.length-1];
    });

    Modal.open(`تصحيح: ${hw?.title}`,`
      <div class="space-y-4">
        ${latestSubs.map(sub=>{
          const student=DB.students.find(s=>s.id===sub.studentId);
          return `<div class="border border-stone-100 rounded-xl p-4 bg-stone-50">
            <div class="font-bold text-stone-800 mb-1">${student?studentFullName(student):'—'}
              ${sub.reassigned?`<span class="badge bg-amber text-xs mr-2">مُعاد إسناده</span>`:''}
            </div>
            <div class="fg mb-3"><label class="fl">الدرجة (0-100)</label>
              <input id="grade-${sub.id}" type="number" min="0" max="100" class="fi" value="${sub.grade??''}"/></div>
            <div class="fg mb-3"><label class="fl">التقييم</label>
              <div class="flex gap-2">
                ${['ممتاز','جيد جداً','جيد','مقبول','ضعيف'].map((g,_)=>{
                  const cls={'ممتاز':'gb-ex','جيد جداً':'gb-gd','جيد':'gb-gd','مقبول':'gb-ok','ضعيف':'gb-wk'}[g]||'gb-gd';
                  return `<button class="grade-btn ${cls} ${sub.evaluation===g?'on':''}" onclick="Homework.pickGrade(this,'${sub.id}','${g}')">${g}</button>`;
                }).join('')}
              </div>
            </div>
            <div class="fg"><label class="fl">ملاحظات</label>
              <input id="notes-${sub.id}" class="fi text-sm" value="${sub.notes||''}" placeholder="ملاحظات المعلم..."/></div>
            <div class="mt-2">
              <button class="btn-sm bg-purple-100 text-purple-700" onclick="Homework.reassignOne('${hwId}','${sub.studentId}')">🔄 إعادة الإسناد لهذا الطالب</button>
            </div>
          </div>`;
        }).join('')}
        <div class="flex gap-3 pt-2">
          <button class="btn btn-primary flex-1" onclick="Homework.saveGrades('${hwId}')">حفظ كل التصحيحات</button>
          <button class="btn btn-ghost" onclick="Modal.close()">إغلاق</button>
        </div>
      </div>`,true);
  },

  pickGrade(btn,subId,grade) {
    const sub=DB.submissions.find(s=>s.id===subId);
    if (sub) { const old=sub.evaluation; sub.evaluation=grade; }
    btn.closest('.flex').querySelectorAll('.grade-btn').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
  },

  saveGrades(hwId) {
    const subs=DB.submissions.filter(s=>s.homeworkId===hwId);
    subs.forEach(sub=>{
      const g=$(`grade-${sub.id}`)?.value;
      const n=$(`notes-${sub.id}`)?.value;
      const old={grade:sub.grade,evaluation:sub.evaluation};
      if (g!==undefined) sub.grade=parseInt(g)||null;
      if (n!==undefined) sub.notes=n;
      if (!sub.evaluation) sub.evaluation='جيد';
      if (old.grade!==sub.grade||old.evaluation!==sub.evaluation) {
        const st=DB.students.find(x=>x.id===sub.studentId);
        logAction({action:'تعديل',entity:'تصحيح واجب',entity_id:sub.id,entity_name:st?studentFullName(st):'',
          old_value:`${old.grade}/${old.evaluation}`,new_value:`${sub.grade}/${sub.evaluation}`,description:'تعديل تصحيح واجب'});
      }
    });
    toast('تم حفظ جميع التصحيحات','success');
    Modal.close(); App.navigate('homework');
  },

  reassignOne(hwId,studentId) {
    const hw=DB.homework.find(h=>h.id===hwId);
    const student=DB.students.find(s=>s.id===studentId);
    DB.submissions.push({id:genId(),homeworkId:hwId,studentId,grade:null,evaluation:null,notes:'',reassigned:true});
    logAction({action:'تعديل',entity:'واجب',entity_id:hwId,entity_name:hw?.title||'',description:`إعادة إسناد الواجب للطالب ${student?studentFullName(student):''}`});
    toast(`تم إعادة إسناد الواجب لـ ${student?studentFullName(student):''}`,'success');
    Modal.close(); App.navigate('homework');
  },
};

// Memorization module removed

// ── PAYMENTS ─────────────────────────────────────────────────────
const Payments = {
  openAdd(preSubId=null) {
    const subs=DB.subscriptions.filter(sub=>{
      const paid=DB.payments.filter(p=>p.subscriptionId===sub.id).reduce((a,p)=>a+p.amount,0);
      return sub.totalAmount-paid>0;
    });
    Modal.open('تسجيل دفعة',`
      <div class="space-y-4">
        <div class="fg"><label class="fl">الاشتراك *</label>
          <select id="pay-sub" class="fi">
            ${subs.map(s=>{
              const st=DB.students.find(x=>x.id===s.studentId);
              const paid=DB.payments.filter(p=>p.subscriptionId===s.id).reduce((a,p)=>a+p.amount,0);
              return`<option value="${s.id}" ${s.id===preSubId?'selected':''}>${st?studentFullName(st):'—'} (متبقي ${s.totalAmount-paid} ج.م)</option>`;
            }).join('')}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="fg"><label class="fl">المبلغ *</label><input id="pay-amt" type="number" class="fi" min="1"/></div>
          <div class="fg"><label class="fl">طريقة الدفع</label>
            <select id="pay-method" class="fi"><option>نقدي</option><option>تحويل</option><option>آخر</option></select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="fg"><label class="fl">التاريخ</label><input id="pay-date" type="date" class="fi" value="${today()}"/></div>
          <div class="fg"><label class="fl">رقم الإيصال</label><input id="pay-receipt" class="fi" placeholder="R-XXX"/></div>
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn btn-primary flex-1" onclick="Payments.save()">تسجيل الدفعة</button>
          <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
        </div>
      </div>`);
  },

  save() {
    const subId=($('pay-sub')?.value); const amount=parseFloat($('pay-amt')?.value);
    if (!subId) { toast('اختر الاشتراك','error'); return; }
    if (!amount||amount<=0) { toast('أدخل مبلغاً صحيحاً','error'); return; }
    const sub=DB.subscriptions.find(s=>s.id===subId);
    const paid=DB.payments.filter(p=>p.subscriptionId===subId).reduce((a,p)=>a+p.amount,0);
    const rem=sub.totalAmount-paid;
    if (amount>rem) { toast(`المبلغ أكبر من المتبقي (${rem} ج.م)`,'warn'); return; }
    const p={id:genId(),subscriptionId:subId,date:$('pay-date')?.value,amount,method:$('pay-method')?.value,status:'completed',receipt:$('pay-receipt')?.value||`R-${Date.now().toString().slice(-4)}`};
    DB.payments.push(p);
    const st=DB.students.find(s=>s.id===sub.studentId);
    logAction({action:'مالي',entity:'دفعة',entity_id:p.id,entity_name:st?studentFullName(st):'',new_value:`${amount} ج.م`,description:`تسجيل دفعة - ${p.method}`});
    toast(amount>=rem?'تم التسجيل — الاشتراك مكتمل ✓':`تم تسجيل ${amount} ج.م — متبقي ${rem-amount} ج.م`,'success');
    Modal.close(); App.navigate('payments');
  },

  openHistory(subId) {
    const sub=DB.subscriptions.find(s=>s.id===subId);
    const st=DB.students.find(s=>s.id===sub?.studentId);
    const pays=DB.payments.filter(p=>p.subscriptionId===subId);
    const total=pays.reduce((a,p)=>a+p.amount,0);
    Modal.open(`سجل مدفوعات — ${st?studentFullName(st):''}`,`
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-3 text-center bg-stone-50 rounded-xl p-4 text-sm">
          <div><div class="text-2xl font-black text-stone-800">${sub?.totalAmount}</div><div class="text-stone-400">الإجمالي</div></div>
          <div><div class="text-2xl font-black text-emerald-700">${total}</div><div class="text-stone-400">المدفوع</div></div>
          <div><div class="text-2xl font-black text-red-600">${(sub?.totalAmount||0)-total}</div><div class="text-stone-400">المتبقي</div></div>
        </div>
        ${pays.map(p=>`<div class="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-xl">
          <span class="badge bg-green">${p.amount} ج.م</span>
          <span class="text-sm text-stone-600">${fmtDate(p.date)}</span>
          <span class="text-xs text-stone-400">${p.method}</span>
          <span class="text-xs text-stone-400 mr-auto">${p.receipt||'—'}</span>
        </div>`).join('')||'<p class="text-center text-stone-400 py-6">لا توجد مدفوعات</p>'}
      </div>`);
  },
};

// ── AUDIT LOG ────────────────────────────────────────────────────
const AuditLog = {
  renderTable(logs) {
    const page=this._page||1; const per=20;
    const total=Math.ceil(logs.length/per);
    const slice=logs.slice((page-1)*per, page*per);
    const rowBg={إضافة:'log-add',تعديل:'log-edit',حذف:'log-delete',مالي:'log-financial',حضور:'log-attendance'};
    return `<table class="tbl"><thead><tr>
      <th>الوقت</th><th>المستخدم</th><th>العملية</th><th>الكيان</th><th>التفاصيل</th><th>القيمة السابقة</th>
    </tr></thead><tbody>
      ${slice.map(l=>`<tr class="${rowBg[l.action]||''}">
        <td class="text-xs text-stone-500">${new Date(l.timestamp).toLocaleString('ar-EG')}</td>
        <td>${badge(l.action)}</td>
        <td>${l.user_label}</td>
        <td><strong>${l.entity}</strong><br><span class="text-xs text-stone-400">${l.entity_name}</span></td>
        <td class="text-sm">${l.description}</td>
        <td class="text-xs text-stone-400">${(l.action==='تعديل'||l.action==='حذف')&&l.old_value?`<del>${l.old_value}</del> → ${l.new_value||'—'}`:'—'}</td>
      </tr>`).join('')}
    </tbody></table>
    ${total>1?`<div class="flex items-center justify-between p-4 border-t border-stone-100">
      <span class="text-sm text-stone-400">${logs.length} سجل — صفحة ${page} من ${total}</span>
      <div class="flex gap-2">
        ${page>1?`<button class="btn-sm bg-stone-100 text-stone-600" onclick="AuditLog.goPage(${page-1})">السابق</button>`:''}
        ${page<total?`<button class="btn-sm bg-stone-100 text-stone-600" onclick="AuditLog.goPage(${page+1})">التالي</button>`:''}
      </div>
    </div>`:''}`;
  },

  _page: 1,
  goPage(p) { this._page=p; this.filter(); },

  filter() {
    const type=($('log-type')?.value)||'';
    const user=($('log-user')?.value)||'';
    const from=($('log-from')?.value)||'';
    const to=($('log-to')?.value)||'';
    let logs=DB.audit_log;
    if (type) logs=logs.filter(l=>l.action===type);
    if (user) logs=logs.filter(l=>l.user_role===user);
    if (from) logs=logs.filter(l=>l.timestamp>=from);
    if (to)   logs=logs.filter(l=>l.timestamp<=to+'T23:59:59');
    const wrap=$('log-table-wrap');
    if (wrap) wrap.innerHTML=this.renderTable(logs);
  },

  reset() {
    ['log-type','log-user','log-from','log-to'].forEach(id=>{const el=$(id);if(el)el.value='';});
    this._page=1; this.filter();
  },
};

// ── REPORTS ──────────────────────────────────────────────────────
const Reports = {
  resetFilters() {

    if($('rep-month')) $('rep-month').value = new Date().toISOString().slice(0, 7);
    this.filter();
  },
  
  filter() {
    const circleId = '';
    const month = $('rep-month')?.value || new Date().toISOString().slice(0, 7);
    
    // Filter students
    let filteredStudents = DB.students;
    if (circleId) filteredStudents = filteredStudents.filter(s => s.circleId === circleId);
    const sIds = new Set(filteredStudents.map(s => s.id));
    
    // Financial calculations
    const filteredSubs = DB.subscriptions.filter(s => sIds.has(s.studentId));
    const finalSubIds = new Set(filteredSubs.map(s => s.id));
    
    let totalPaid = 0;
    let monthlyRev = 0;
    
    DB.payments.forEach(p => {
      if (finalSubIds.has(p.subscriptionId)) {
        totalPaid += p.amount;
        if (p.date.startsWith(month)) {
          monthlyRev += p.amount;
        }
      }
    });
    
    // Academic calculations
    const allAtt = DB.attendance.filter(a => sIds.has(a.studentId));
    const present = allAtt.filter(a => a.status === 'حاضر' || a.status === 'متأخر').length;
    const attRate = allAtt.length ? Math.round(present / allAtt.length * 100) : 0;
    
    const gradedSubs = DB.submissions.filter(s => s.evaluation && sIds.has(s.studentId));
    const avgGrade = gradedSubs.length ? Math.round(gradedSubs.reduce((a, s) => a + (s.grade || 0), 0) / gradedSubs.length) : 0;
    
    // Detailed delayed calculated per subscription
    const delayedSubs = filteredSubs.filter(s => !s.isExempt).map(s => {
      const paid = DB.payments.filter(p => p.subscriptionId === s.id).reduce((a, p) => a + p.amount, 0);
      return {...s, paid, rem: s.totalAmount - paid, student: DB.students.find(st => st.id === s.studentId)};
    }).filter(x => x.rem > 0 && x.student);
    
    const totalDelayed = delayedSubs.reduce((a, x) => a + x.rem, 0);
    
    // Render content
    const content = $('report-content');
    if (!content) return;
    
    const d = new Date(month + '-01');
    const monthName = d.toLocaleString('ar-EG', {month: 'long', year: 'numeric'});
    
    content.innerHTML = `
      <!-- القسم المالي -->
      <div class="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div class="bg-emerald-50 px-5 py-3 border-b border-emerald-100 text-emerald-800 font-bold flex items-center gap-2">
          <span>💰</span> الملخص المالي العام (شامل كل الحلقات)
        </div>
        <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 rounded-xl border border-stone-100 hover:shadow-md transition">
            <div class="text-stone-500 text-sm font-bold mb-2">الإجمالي المُحصل (تراكمي للنطاق)</div>
            <div class="text-4xl font-black text-emerald-600">${totalPaid} <span class="text-sm font-normal text-stone-400">ج.م</span></div>
          </div>
          <div class="text-center p-4 rounded-xl border border-stone-100 hover:shadow-md transition relative overflow-hidden">
            <div class="absolute inset-0 bg-blue-50 opacity-10"></div>
            <div class="text-stone-500 text-sm font-bold mb-2">إيراد الشهر المحدد (${monthName})</div>
            <div class="text-4xl font-black text-blue-600 relative">${monthlyRev} <span class="text-sm font-normal text-stone-400">ج.م</span></div>
          </div>
          <div class="text-center p-4 rounded-xl border border-stone-100 hover:shadow-md transition">
            <div class="text-stone-500 text-sm font-bold mb-2">المتأخرات والمديونيات</div>
            <div class="text-4xl font-black text-red-500">${totalDelayed} <span class="text-sm font-normal text-stone-400">ج.م</span></div>
          </div>
        </div>
      </div>
      
      <!-- القسم الأكاديمي -->
      <div class="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <div class="bg-blue-50 px-5 py-3 border-b border-blue-100 text-blue-800 font-bold flex items-center gap-2">
          <span>📖</span> الملخص الأكاديمي العام (شامل كل الحلقات)
        </div>
        <div class="p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          ${[
            {label: 'إجمالي الطلاب بالنطاق', val: filteredStudents.length, c: 'text-stone-700', bg: 'bg-stone-50 border border-stone-100'},
            {label: 'طلاب نشطين', val: filteredStudents.filter(s => s.status === 'active').length, c: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-100'},
            {label: 'نسبة الحضور', val: attRate + '%', c: 'text-blue-700', bg: 'bg-blue-50 border border-blue-100'},
            {label: 'متوسط الواجبات', val: avgGrade + '%', c: 'text-amber-700', bg: 'bg-amber-50 border border-amber-100'},
          ].map(r => `<div class="rounded-xl p-4 text-center ${r.bg}">
            <div class="text-3xl font-black ${r.c}">${r.val}</div>
            <div class="text-xs font-bold text-stone-500 mt-2">${r.label}</div>
          </div>`).join('')}
        </div>
      </div>

      <!-- تقرير المتأخرين -->
      <div class="bg-white rounded-3xl border border-stone-100 p-5 shadow-sm relative">
        <div class="absolute right-0 top-0 bottom-0 w-2 bg-red-500 rounded-r-3xl"></div>
        <div class="font-black text-stone-800 mb-5 ml-4 flex items-center justify-between border-b pb-3 border-stone-100">
          <div class="flex items-center gap-2 pr-4"><span class="text-red-500 text-xl font-bold">⚠</span> مديونيات الطلاب ومتأخرات الاشتراكات</div>
          <div class="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold flex items-center gap-2"><span>عدد المتأخرين:</span> <span class="text-lg">${delayedSubs.length}</span></div>
        </div>
        
        ${delayedSubs.length ? `<div class="tbl-wrap pr-2 rounded-xl border border-stone-100"><table class="tbl mb-0"><thead><tr class="bg-stone-50">
            <th>الطالب</th><th>الحلقة</th><th>الهاتف</th><th>الاشتراك</th><th class="text-center">المدفوع</th><th class="text-red-700 text-center">المتأخر</th>
          </tr></thead><tbody>
          ${delayedSubs.sort((a, b) => b.rem - a.rem).map((x, i) => {
            const c = DB.halaqat.find(h => h.id === x.student.circleId);
             return `<tr class="${i % 2 === 0 ? 'bg-white' : 'bg-stone-50'} hover:bg-stone-100 transition">
              <td class="font-bold text-stone-800">${studentFullName(x.student)}</td>
              <td class="text-sm text-stone-600">${c?.name || '—'}</td>
              <td dir="ltr" class="text-sm text-stone-500">${x.student.phones?.[0]?.number || '—'}</td>
              <td class="text-sm">${x.totalAmount} ج.م</td>
              <td class="text-emerald-600 text-sm text-center font-bold">${x.paid} ج.م</td>
              <td class="text-red-600 font-black text-center text-lg bg-red-50 border-r border-red-100">${x.rem} ج.م</td>
            </tr>`
          }).join('')}
        </tbody></table></div>` : '<div class="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 mt-2"><div class="text-3xl mb-2">🎉</div><div class="font-bold text-lg">لا توجد أي بيانات تأخيرات مالية حسب اختيارك.</div></div>'}
      </div>
    `;
  },

  exportCSV() {
    const rows=[
      ['الاسم الرباعي','الحلقة','نسبة الحضور','حالة الدفع','الهاتف'],
      ...DB.students.map(s=>{
        const c=DB.halaqat.find(h=>h.id===s.circleId);
        const att=DB.attendance.filter(a=>a.studentId===s.id);
        const pres=att.filter(a=>a.status==='حاضر'||a.status==='متأخر').length;
        const sub=DB.subscriptions.find(x=>x.studentId===s.id);
        const paid=DB.payments.filter(p=>p.subscriptionId===sub?.id).reduce((a,p)=>a+p.amount,0);
        let ps=!sub?'—':paid>=sub.totalAmount?'مدفوع':paid>0?'جزئي':'غير مدفوع';
        if (sub?.isExempt) ps = 'معفي';
        return[studentFullName(s),c?.name||'—',att.length?Math.round(pres/att.length*100)+'%':'—',ps,s.phones?.[0]?.number||'—'];
      })
    ];
    const csv='\uFEFF'+rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const link=document.createElement('a');
    link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
    link.download=`تقرير_علمه_البيان_${today()}.csv`; link.click();
    toast('تم تصدير CSV','success');
  },
};

// ── SUBSCRIPTIONS ────────────────────────────────────────────────
const Subscriptions = {
  openAdd() {
    Modal.open('إسناد اشتراك جديد', `
      <div class="space-y-4">
        <div class="fg"><label class="fl">الطالب *</label>
          <select id="sub-st" class="fi">
            <option value="">-- اختر الطالب --</option>
            ${DB.students.map(s=>`<option value="${s.id}">${studentFullName(s)}</option>`).join('')}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="fg"><label class="fl">النوع</label>
            <select id="sub-type" class="fi"><option>شهري</option><option>فصلي</option><option>سنوي</option></select>
          </div>
          <div class="fg"><label class="fl">المبلغ الإجمالي</label><input id="sub-amt" type="number" class="fi" value="200"/></div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="fg"><label class="fl">تاريخ البداية</label><input id="sub-start" type="date" class="fi" value="${today()}"/></div>
          <div class="fg"><label class="fl">تاريخ النهاية</label><input id="sub-end" type="date" class="fi"/></div>
        </div>
        <div class="flex gap-3 pt-2">
          <button class="btn btn-primary flex-1" onclick="Subscriptions.save()">حفظ</button>
          <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
        </div>
      </div>`);
  },

  save() {
    const sid = $('sub-st').value;
    if(!sid) { toast('اختر الطالب','error'); return; }
    const sub = {
      id: genId(),
      studentId: sid,
      type: $('sub-type').value,
      totalAmount: parseFloat($('sub-amt').value)||0,
      startDate: $('sub-start').value,
      endDate: $('sub-end').value,
      status: 'active',
      isExempt: false,
      exemptReason: ''
    };
    DB.subscriptions.push(sub);
    logAction({action:'إضافة',entity:'اشتراك',entity_id:sub.id,entity_name:studentFullName(DB.students.find(x=>x.id===sid)),description:'إسناد اشتراك جديد'});
    toast('تمت الإضافة','success'); Modal.close(); App.navigate('subscriptions');
  },

  toggleExempt(id) {
    const sub = DB.subscriptions.find(s=>s.id===id);
    if(!sub) return;
    if (sub.isExempt) {
      sub.isExempt = false;
      sub.exemptReason = '';
      toast('تم إلغاء الإعفاء','info');
      App.navigate('subscriptions');
    } else {
      const reason = prompt('سبب الإعفاء (اختياري):');
      sub.isExempt = true;
      sub.exemptReason = reason || 'معفى لأسباب';
      toast('تم تسجيل الإعفاء','success');
      App.navigate('subscriptions');
    }
  },

  openEdit(id) {
     const sub = DB.subscriptions.find(s=>s.id===id);
     if(!sub) return;
     // simple edit for amount and type
     Modal.open('تعديل اشتراك', `
       <div class="space-y-4">
         <div class="grid grid-cols-2 gap-3">
           <div class="fg"><label class="fl">النوع</label>
             <select id="sub-edit-type" class="fi">
               ${['شهري','فصلي','سنوي'].map(t=>`<option ${t===sub.type?'selected':''}>${t}</option>`).join('')}
             </select>
           </div>
           <div class="fg"><label class="fl">المبلغ</label><input id="sub-edit-amt" type="number" class="fi" value="${sub.totalAmount}"/></div>
         </div>
         <div class="flex gap-3 pt-2">
           <button class="btn btn-primary flex-1" onclick="Subscriptions.update('${id}')">تحديث</button>
           <button class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
         </div>
       </div>`);
  },

  update(id) {
    const sub = DB.subscriptions.find(s=>s.id===id);
    if(!sub) return;
    sub.type = $('sub-edit-type').value;
    sub.totalAmount = parseFloat($('sub-edit-amt').value)||0;
    toast('تم التحديث','success'); Modal.close(); App.navigate('subscriptions');
  }
};

// ── INIT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', ()=>{
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') Modal.close(); });
  document.addEventListener('click', e=>{
    const dd=$('notif-dropdown');
    if (dd&&!dd.classList.contains('hidden')&&!$('notif-wrap')?.contains(e.target)) dd.classList.add('hidden');
  });
});
