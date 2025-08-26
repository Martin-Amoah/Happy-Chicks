import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  // Try to get cookieStore; guard for environments where it's not available.
  // use a loose type to avoid ReturnType<> mismatch across Next versions
  let cookieStore: any = null
  try {
    // cookies() is synchronous in the current runtime; do not await
    cookieStore = cookies()
  } catch (err) {
    // cookies() may throw during certain build/prerender steps — fall back to null.
    cookieStore = null
  }

  // Always provide a cookies object. Use cookieStore when available, otherwise use no-op implementations.
  const cookieMethods = {
    get(name: string): string | undefined {
      return cookieStore?.get(name)?.value
    },
    set(name: string, value: string, options?: Record<string, unknown>): void {
      if (!cookieStore) return
      try {
        // RequestCookies.set exists in runtime; cast options to any for compatibility
        ;(cookieStore as any).set?.(name, value, options as any)
      } catch (error) {
        // ignore if called in an environment that doesn't allow setting cookies
      }
    },
    remove(name: string, options?: Record<string, unknown>): void {
      if (!cookieStore) return
      try {
        // Prefer delete if available, otherwise set empty value
        if (typeof (cookieStore as any).delete === 'function') {
          ;(cookieStore as any).delete(name, options as any)
        } else {
          ;(cookieStore as any).set?.(name, '', options as any)
        }
      } catch (error) {
        // ignore if called in an environment that doesn't allow removing cookies
      }
    },
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // cast to any to satisfy the expected type while keeping runtime behavior safe
      cookies: cookieMethods as any,
    }
  )

  // Ensure auth helper functions exist to avoid "cannot read getUser" errors during prerender.
  try {
    // If auth is missing or getUser is not a function, provide safe fallbacks.
    if (!supabase.auth || typeof (supabase.auth as any).getUser !== 'function') {
      ;(supabase as any).auth = {
        // getUser should return shape { data: { user } }
        getUser: async () => ({ data: { user: null } }),
        // minimal stubs for common auth methods used in the app
        signInWithPassword: async () => ({ error: { message: 'Auth not available during prerender' } }),
        signOut: async () => ({ error: null }),
        // keep other properties if code expects them
        ...((supabase.auth as any) || {}),
      }
    }
  } catch (e) {
    // swallow — we already have a working client in normal server runtime
  }

  return supabase
}