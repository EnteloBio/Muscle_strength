import { getSupabase } from './supabase'

type QueuedWrite = {
  id: string
  table: string
  operation: 'insert' | 'delete'
  payload: Record<string, unknown>
  createdAt: number
}

const STORAGE_KEY = 'decode-strength-offline-queue'

function readQueue(): QueuedWrite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as QueuedWrite[]) : []
  } catch {
    return []
  }
}

function writeQueue(queue: QueuedWrite[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export function enqueue(entry: Omit<QueuedWrite, 'id' | 'createdAt'>): void {
  const queue = readQueue()
  queue.push({ ...entry, id: crypto.randomUUID(), createdAt: Date.now() })
  writeQueue(queue)
}

export async function flushQueue(): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const queue = readQueue()
  if (queue.length === 0) return

  const remaining: QueuedWrite[] = []

  for (const item of queue) {
    try {
      let error: unknown = null

      if (item.operation === 'insert') {
        const res = await supabase.from(item.table).insert(item.payload)
        error = res.error
      } else if (item.operation === 'delete') {
        const deleteId = item.payload.id
        if (deleteId != null) {
          const res = await supabase.from(item.table).delete().eq('id', deleteId)
          error = res.error
        }
      }

      if (error) {
        console.warn('OFFLINE_QUEUE_FLUSH_ERROR', error)
        remaining.push(item)
      }
    } catch {
      remaining.push(item)
    }
  }

  writeQueue(remaining)
}

// Flush when connectivity returns
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushQueue()
  })
}
