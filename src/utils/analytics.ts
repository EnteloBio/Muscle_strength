import { getSupabase } from './supabase'

export type AnalyticsEvent =
  | 'session_start'
  | 'profile_completed'
  | 'grip_recorded'
  | 'results_viewed'
  | 'leaderboard_viewed'
  | 'play_again'
  | 'qr_scanned'
  | 'session_timeout'

type EventPayload = Record<string, string | number | boolean | null>

const STORAGE_KEY = 'decode-strength-analytics'
const SESSION_KEY = 'decode-strength-session-id'

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function resetSessionId(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

function bufferLocally(event: AnalyticsEvent, payload: EventPayload): void {
  try {
    const buffer = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[]
    buffer.push({
      session_id: getSessionId(),
      event,
      payload,
      timestamp: new Date().toISOString(),
    })
    // Keep max 200 buffered events
    if (buffer.length > 200) buffer.splice(0, buffer.length - 200)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer))
  } catch {
    // Storage full or unavailable — silently drop
  }
}

async function flushBuffer(): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  const buffer = JSON.parse(raw) as Record<string, unknown>[]
  if (buffer.length === 0) return

  const { error } = await supabase.from('analytics').insert(buffer)
  if (!error) {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function trackEvent(event: AnalyticsEvent, payload: EventPayload = {}): void {
  const supabase = getSupabase()
  const row = {
    session_id: getSessionId(),
    event,
    payload,
    timestamp: new Date().toISOString(),
  }

  if (!supabase) {
    bufferLocally(event, payload)
    return
  }

  supabase
    .from('analytics')
    .insert(row)
    .then(({ error }) => {
      if (error) {
        console.warn('ANALYTICS_INSERT_ERROR', error)
        bufferLocally(event, payload)
      }
    })
}

// Flush buffered events when connectivity returns
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushBuffer()
  })
  // Also try flushing on page load
  flushBuffer()
}
