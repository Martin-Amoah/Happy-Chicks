import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Try to get cookieStore; guard for environments where it's not available.
  let cookieStore = null
  try {
    cookieStore = await cookies()
  } catch (err) {
    // cookies() may throw during certain build/prerender steps — fall back to null.
    cookieStore = null
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieStore
        ? {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options) {
              try {
                cookieStore.set(name, value, options)
              } catch (error) {
                // ignore if called in an environment that doesn't allow setting cookies
              }
            },
            remove(name: string, options) {
              try {
                cookieStore.set(name, '', options)
              } catch (error) {
                // ignore if called in an environment that doesn't allow removing cookies
              }
            },
          }
        : undefined,
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