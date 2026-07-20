import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // لا تحذفها
  await supabase.auth.getClaims();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // الصفحات العامة
  const isPublicRoute =
    pathname.startsWith('/auth') || pathname.startsWith('/login');

  // المستخدم غير مسجل دخول
  if (!user) {
    if (!isPublicRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // جلب بيانات المستخدم
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    await supabase.auth.signOut();

    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // الحساب متوقف
  if (!profile.is_active) {
    await supabase.auth.signOut();

    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // ===========================
  // حماية صفحات Employee
  // ===========================
  if (pathname.startsWith('/employee') && profile.role !== 'employee') {
    const url = request.nextUrl.clone();

    if (profile.role === 'admin') {
      url.pathname = '/admin/dashboard';
    } else {
      url.pathname = '/dispatcher/newRequest';
    }

    return NextResponse.redirect(url);
  }

  // ===========================
  // حماية صفحات Admin
  // ===========================
  if (pathname.startsWith('/admin') && profile.role !== 'admin') {
    const url = request.nextUrl.clone();

    if (profile.role === 'employee') {
      url.pathname = '/employee/newRequest';
    } else {
      url.pathname = '/dispatcher/newRequest';
    }

    return NextResponse.redirect(url);
  }

  // ===========================
  // حماية صفحات Dispatcher
  // ===========================
  if (pathname.startsWith('/dispatcher') && profile.role !== 'dispatcher') {
    const url = request.nextUrl.clone();

    if (profile.role === 'admin') {
      url.pathname = '/admin/dashboard';
    } else {
      url.pathname = '/employee/dashboard';
    }

    return NextResponse.redirect(url);
  }

  // ===========================
  // لو المستخدم مسجل دخول وحاول يدخل صفحة اللوجين
  // ===========================
  if (isPublicRoute) {
    const url = request.nextUrl.clone();

    switch (profile.role) {
      case 'admin':
        url.pathname = '/admin/dashboard';
        break;

      case 'employee':
        url.pathname = '/employee/dashboard';
        break;

      case 'dispatcher':
        url.pathname = '/dispatcher/newRequest';
        break;

      default:
        url.pathname = '/auth/login';
    }

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
