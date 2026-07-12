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

  // منع الأدمن من صفحات الموظف
  if (pathname.startsWith('/employee') && profile.role !== 'employee') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  // منع الموظف من صفحات الأدمن
  if (pathname.startsWith('/admin') && profile.role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/employee/dashboard';
    return NextResponse.redirect(url);
  }

  // لو المستخدم مسجل دخول وحاول يدخل صفحة اللوجين
  if (isPublicRoute) {
    const url = request.nextUrl.clone();

    url.pathname =
      profile.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
