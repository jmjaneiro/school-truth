import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // ── MVP MODE ──────────────────────────────────────────────
  // Se não houver Supabase configurado, permite navegação livre.
  // O controlo Give-to-Get é feito via localStorage no cliente.
  // Quando o Supabase estiver configurado, a lógica server-side ativa-se.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse
  }

  // ── PRODUCTION MODE ───────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rotas Protegidas
  const isSchoolRoute = request.nextUrl.pathname.startsWith('/escola/')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding')
  const isResultadosRoute = request.nextUrl.pathname.startsWith('/resultados')

  if ((isSchoolRoute || isDashboardRoute || isOnboardingRoute || isResultadosRoute) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Give-to-Get Logic
  if (isSchoolRoute && user) {
    const { data: profile } = await supabase
      .from('users')
      .select('has_reviewed')
      .eq('id', user.id)
      .single()

    if (!profile?.has_reviewed) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
