type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export function isResendConfigured() {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(input: SendEmailInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: 'RESEND_API_KEY is not configured' };
  const from = process.env.EMAIL_FROM || 'AvidKiya <no-reply@example.com>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: input.to, subject: input.subject, html: input.html, text: input.text }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || data?.error || `Resend failed: ${res.status}`);
  return { sent: true, data };
}

export function orderEmailHtml(order: any) {
  const total = Number(order.total || 0).toLocaleString('en-US');
  const invoiceUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || ''}/api/shop/invoice?orderId=${encodeURIComponent(order.orderId)}`;
  const downloadsUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || ''}/api/shop/download?orderId=${encodeURIComponent(order.orderId)}`;
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:620px;margin:auto;color:#111827">
      <h1>Order confirmed</h1>
      <p>Thank you${order.customerName ? `, ${order.customerName}` : ''}. Your order <b>${order.orderId}</b> is ready.</p>
      <p><b>Total:</b> ${total} Toman</p>
      <p><a href="${invoiceUrl}" style="display:inline-block;background:#5d7ae6;color:white;padding:10px 14px;border-radius:10px;text-decoration:none">Download invoice</a></p>
      <p><a href="${downloadsUrl}" style="display:inline-block;background:#10b981;color:white;padding:10px 14px;border-radius:10px;text-decoration:none">Open downloads</a></p>
      <p style="color:#6b7280;font-size:12px">If a product file is not configured yet, contact support with your order ID.</p>
    </div>`;
}
