import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Subscription } from '../types';

const formatEgyptDate = (dateStr: string, includeTime = false) => {
  if (!dateStr) return '---';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: includeTime ? '2-digit' : undefined,
      minute: includeTime ? '2-digit' : undefined,
      hour12: true,
      timeZone: 'Africa/Cairo'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

const formatDateOnly = (dateStr: string) => {
  if (!dateStr) return '---';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Africa/Cairo'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

export const printSubscriptionInvoice = (sub: Subscription) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const remaining = Number(sub.total_amount) - (sub.paid_amount || 0);
  const today = format(new Date(), 'dd/MM/yyyy', { locale: ar });

  const content = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة اشتراك - ${sub.student?.full_name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif; padding: 20px; color: #1e293b; line-height: 1.6; }
        .invoice-card { border: 2px solid #e2e8f0; border-radius: 15px; padding: 30px; max-width: 800px; margin: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: 900; color: #10b981; }
        .invoice-title { font-size: 20px; font-weight: 800; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-item { border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
        .info-label { color: #64748b; font-size: 14px; margin-bottom: 5px; }
        .info-value { font-weight: 700; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f8fafc; color: #64748b; text-align: right; padding: 12px; border-bottom: 2px solid #e2e8f0; }
        td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .total-box { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 10px; display: flex; justify-content: space-between; }
        .total-item { text-align: center; }
        .total-label { color: #64748b; font-size: 14px; }
        .total-value { font-size: 18px; font-weight: 900; color: #10b981; }
        .remaining { color: #ef4444; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
          .invoice-card { border: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div class="logo">مركز تحفيظ القرآن</div>
          <div class="invoice-title">فاتورة اشتراك رقم ${sub.subscription_id.split('-')[0].toUpperCase()}</div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">اسم الطالب</div>
            <div class="info-value">${sub.student?.full_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">تاريخ الإصدار</div>
            <div class="info-value">${today}</div>
          </div>
          <div class="info-item">
            <div class="info-label">نوع الاشتراك</div>
            <div class="info-value">${sub.type === 'yearly' ? 'سنوي' : sub.type === 'monthly' ? 'شهري' : sub.type}</div>
          </div>
          <div class="info-item">
            <div class="info-label">الفترة</div>
            <div class="info-value">من ${formatDateOnly(sub.start_date)} إلى ${formatDateOnly(sub.end_date)}</div>
          </div>
        </div>

        <h3>سجل المدفوعات</h3>
        <table>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>المبلغ</th>
              <th>الوسيلة</th>
              <th>رقم الإيصال</th>
            </tr>
          </thead>
          <tbody>
            ${(sub.payments || []).map(p => `
              <tr>
                <td>${formatEgyptDate(p.payment_date, true)}</td>
                <td>${p.amount} ج.م</td>
                <td>${p.method === 'cash' ? 'نقدي' : p.method === 'transfer' ? 'تحويل' : p.method}</td>
                <td>${p.receipt_number || '---'}</td>
              </tr>
            `).join('')}
            ${(sub.payments || []).length === 0 ? '<tr><td colspan="4" style="text-align:center">لا يوجد مدفوعات مسجلة</td></tr>' : ''}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-item">
            <div class="total-label">إجمالي المبلغ</div>
            <div class="total-value">${sub.total_amount} ج.م</div>
          </div>
          <div class="total-item">
            <div class="total-label">إجمالي المُسدد</div>
            <div class="total-value">${sub.paid_amount || 0} ج.م</div>
          </div>
          <div class="total-item">
            <div class="total-label">المبلغ المتبقي</div>
            <div class="total-value remaining">${remaining} ج.م</div>
          </div>
        </div>

        <div class="footer">
          شكراً لثقتكم بنا - تم إنشاء هذه الفاتورة آلياً
        </div>
      </div>
      <script>
        window.onload = () => {
          // window.print();
          // window.onafterprint = () => window.close();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  // Auto print in a bit to allow font loading
  setTimeout(() => {
    printWindow.print();
  }, 500);
};

export const printPaymentReceipt = (payment: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const today = formatEgyptDate(payment.payment_date);

  const content = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>إيصال استلام - ${payment.student_name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif; padding: 40px; }
        .receipt { border: 4px double #10b981; padding: 30px; border-radius: 20px; max-width: 500px; margin: auto; position: relative; }
        .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(16, 185, 129, 0.05); white-space: nowrap; pointer-events: none; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: 900; color: #10b981; }
        .amount-box { background: #f0fdf4; border: 2px solid #10b981; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .amount { font-size: 32px; font-weight: 900; color: #10b981; }
        .field { margin-bottom: 15px; font-size: 16px; }
        .label { color: #64748b; margin-left: 10px; }
        .value { font-weight: 700; border-bottom: 1px dotted #ccc; flex-grow: 1; }
        .row { display: flex; align-items: baseline; margin-bottom: 15px; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="watermark">مدفوع - PAID</div>
        <div class="header">
          <div class="title">إيصال استلام نقدية</div>
          <div style="color: #64748b; margin-top: 5px;">رقم: ${payment.receipt_number || '---'}</div>
        </div>

        <div class="row">
          <span class="label">وصلنا من السيد/</span>
          <span class="value">${payment.student_name}</span>
        </div>

        <div class="amount-box">
          <div style="font-size: 14px; color: #10b981;">مبلغ وقدره</div>
          <div class="amount">${payment.amount} ج.م</div>
        </div>

        <div class="row">
          <span class="label">وذلك مقابل/</span>
          <span class="value">اشتراك الدورة / الشهر الحالي</span>
        </div>

        <div class="row">
          <span class="label">طريقة السداد/</span>
          <span class="value">${payment.method === 'cash' ? 'نقدي' : payment.method === 'transfer' ? 'تحويل' : payment.method}</span>
        </div>

        <div class="row">
          <span class="label">تحريراً في/</span>
          <span class="value">${today}</span>
        </div>

        <div class="footer">
          <div>توقيع المحصل<br/><br/>...................</div>
          <div>ختم الإدارة<br/><br/>...................</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 500);
};
