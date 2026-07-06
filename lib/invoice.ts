// Invoice PDF generator using plain HTML/CSS for Cloudflare Workers

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

export function generateInvoiceHtml(data: InvoiceData): string {
  const itemsRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">${item.currency} ${item.price.toFixed(2)}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${item.currency} ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${data.orderId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; padding: 40px; color: #111827; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 32px; }
    .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
    .header p { opacity: 0.85; font-size: 14px; }
    .content { padding: 32px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 32px; }
    .meta div { font-size: 13px; color: #6b7280; }
    .meta strong { color: #111827; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 600; }
    .totals { text-align: right; }
    .totals div { display: flex; justify-content: flex-end; gap: 16px; padding: 8px 0; font-size: 14px; }
    .totals .total-row { font-size: 18px; font-weight: 800; color: #6366f1; border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 8px; }
    .footer { background: #f9fafb; padding: 24px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <h1>INVOICE</h1>
      <p>AvidKiya Platform — avidkiya.com</p>
    </div>
    <div class="content">
      <div class="meta">
        <div>
          <strong>Order ID:</strong> ${data.orderId}<br>
          <strong>Date:</strong> ${data.date}
        </div>
        <div style="text-align:right;">
          <strong>Customer:</strong> ${data.customerName}<br>
          <strong>Email:</strong> ${data.customerEmail}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price</th>
            <th style="text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      <div class="totals">
        <div><span>Subtotal:</span><span>${data.currency} ${data.subtotal.toFixed(2)}</span></div>
        ${data.discount ? `<div style="color:#10b981;"><span>Discount${data.couponCode ? ` (${data.couponCode})` : ''}:</span><span>-${data.currency} ${data.discount.toFixed(2)}</span></div>` : ''}
        <div class="total-row"><span>Total:</span><span>${data.currency} ${data.total.toFixed(2)}</span></div>
      </div>
    </div>
    <div class="footer">
      <p>Thank you for your purchase! — AvidKiya Platform</p>
      <p>support@avidkiya.com</p>
    </div>
  </div>
</body>
</html>`;
}