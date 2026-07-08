import { NextRequest, NextResponse } from 'next/server';
import { generateTrackingCode } from '@/lib/format';

// In production, replace this with a real database (Neon, D1, etc.)
// For now, orders are stored in memory (resets on deploy)
const orders: Map<string, any> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      categorySlug, serviceSlug, fullName, phone, email,
      description, quantity, urgent, attachment
    } = body;

    // Validation
    if (!fullName || fullName.trim().length < 3) {
      return NextResponse.json({ ok: false, error: 'نام و نام‌خانوادگی الزامی است.' }, { status: 400 });
    }
    if (!phone || !/^0?9\d{9}$/.test(phone.trim())) {
      return NextResponse.json({ ok: false, error: 'شماره موبایل معتبر نیست.' }, { status: 400 });
    }
    if (!description || description.trim().length < 10) {
      return NextResponse.json({ ok: false, error: 'توضیحات سفارش خیلی کوتاه است.' }, { status: 400 });
    }
    if (!categorySlug || !serviceSlug) {
      return NextResponse.json({ ok: false, error: 'خدمت انتخاب نشده.' }, { status: 400 });
    }

    // Import service data to calculate price
    const { serviceCategories } = await import('@/lib/cafe-services');
    const category = serviceCategories.find(c => c.slug === categorySlug);
    const service = category?.items.find(i => i.slug === serviceSlug);

    if (!category || !service) {
      return NextResponse.json({ ok: false, error: 'خدمت یافت نشد.' }, { status: 404 });
    }

    const qty = Math.max(1, Math.min(500, Number(quantity) || 1));
    const estimatedPrice = Math.round(service.price * qty * (urgent ? 1.3 : 1));
    const trackingCode = generateTrackingCode();

    const order = {
      id: crypto.randomUUID(),
      trackingCode,
      categorySlug,
      serviceSlug,
      serviceTitle: service.title,
      categoryTitle: category.title,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      description: description.trim(),
      quantity: qty,
      urgent: !!urgent,
      estimatedPrice,
      status: 'pending',
      paymentStatus: 'unpaid',
      attachment: attachment ? { name: attachment.name, mime: attachment.mime, size: attachment.data.length } : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store order (in production: save to database)
    orders.set(trackingCode, { ...order, attachment });

    console.log(`[ORDER] New order: ${trackingCode} — ${service.title} — ${estimatedPrice} Toman`);

    return NextResponse.json({
      ok: true,
      order: {
        trackingCode: order.trackingCode,
        estimatedPrice: order.estimatedPrice,
        serviceTitle: order.serviceTitle,
        status: order.status,
      },
    });
  } catch (err: any) {
    console.error('[ORDER ERROR]', err);
    return NextResponse.json({ ok: false, error: 'خطای داخلی سرور.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ ok: false, error: 'کد رهگیری الزامی است.' }, { status: 400 });
  }

  const order = orders.get(code);
  if (!order) {
    return NextResponse.json({ ok: false, error: 'سفارش یافت نشد.' }, { status: 404 });
  }

  // Don't expose sensitive data
  const { attachment, ...publicOrder } = order;
  return NextResponse.json({ ok: true, order: publicOrder });
}
