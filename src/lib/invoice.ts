// Invoice generator using plain HTML/CSS. It works on Edge/Cloudflare because it
// returns a printable HTML invoice; the browser can save/print it as PDF.

export interface InvoiceData {
  orderId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    currency: string;
  }>;
  subtotal: number;
  discount?: number;
  total: number;
  currency: string;
  couponCode?: string;
}

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function money(amount: number, currency = 'TMN') {
  const n = Number(amount || 0);
  const label = currency === 'TMN' || currency === 'IRR' ? 'Toman' : currency;
  return `${Math.round(n).toLocaleString('en-US')} ${label}`;
}

export function generateInvoiceHtml(data: InvoiceData): string {
  const itemsRows = data.items.map((item) => `
      <tr>
        <td>${esc(item.name)}</td>
        <td class="center">${Number(item.quantity || 1)}</td>
        <td class="right">${money(item.price, item.currency || data.currency)}</td>
        <td class="right bold">${money(item.price * item.quantity, item.currency || data.currency)}</td>
      </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Invoice ${esc(data.orderId)}</title>
  <style>
    *{box-sizing:border-box} body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f7f8fb;color:#111827;padding:32px}.invoice{max-width:840px;margin:0 auto;background:white;border-radius:18px;box-shadow:0 12px 40px rgba(15,23,42,.08);overflow:hidden}.header{background:linear-gradient(135deg,#5d7ae6,#34d399);color:white;padding:34px}.header h1{font-size:30px;margin:0 0 6px;font-weight:900}.header p{margin:0;opacity:.9}.content{padding:34px}.meta{display:flex;justify-content:space-between;gap:24px;margin-bottom:28px;color:#6b7280;font-size:14px}.meta strong{color:#111827}table{width:100%;border-collapse:collapse;margin-bottom:26px}th{background:#f3f4f6;color:#6b7280;text-align:left;text-transform:uppercase;font-size:12px;letter-spacing:.04em}th,td{padding:13px;border-bottom:1px solid #e5e7eb}.center{text-align:center}.right{text-align:right}.bold{font-weight:700}.totals{margin-left:auto;max-width:340px}.totals div{display:flex;justify-content:space-between;gap:18px;padding:8px 0;color:#374151}.totals .discount{color:#059669}.totals .total-row{font-size:19px;font-weight:900;color:#5d7ae6;border-top:2px solid #e5e7eb;padding-top:14px;margin-top:8px}.footer{background:#f9fafb;padding:22px 34px;text-align:center;font-size:12px;color:#6b7280}@media print{body{background:white;padding:0}.invoice{box-shadow:none;border-radius:0}}
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header"><h1>INVOICE</h1><p>Digital purchase receipt</p></div>
    <div class="content">
      <div class="meta"><div><strong>Order ID:</strong> ${esc(data.orderId)}<br><strong>Date:</strong> ${esc(data.date)}</div><div class="right"><strong>Customer:</strong> ${esc(data.customerName)}<br><strong>Email:</strong> ${esc(data.customerEmail || '-')}</div></div>
      <table><thead><tr><th>Item</th><th class="center">Qty</th><th class="right">Price</th><th class="right">Total</th></tr></thead><tbody>${itemsRows}</tbody></table>
      <div class="totals"><div><span>Subtotal:</span><span>${money(data.subtotal, data.currency)}</span></div>${data.discount ? `<div class="discount"><span>Discount${data.couponCode ? ` (${esc(data.couponCode)})` : ''}:</span><span>-${money(data.discount, data.currency)}</span></div>` : ''}<div class="total-row"><span>Total:</span><span>${money(data.total, data.currency)}</span></div></div>
    </div>
    <div class="footer"><p>Thank you for your purchase. You can print this invoice or save it as PDF from your browser.</p></div>
  </div>
</body>
</html>`;
}
