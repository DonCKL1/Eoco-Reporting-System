import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

/**
 * Format an ISO date string for display.
 * e.g. "24 Jun 2026"
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const date = parseISO(iso)
  if (!isValid(date)) return '—'
  return format(date, 'd MMM yyyy')
}

/**
 * Format an ISO date string with time.
 * e.g. "24 Jun 2026, 14:30"
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const date = parseISO(iso)
  if (!isValid(date)) return '—'
  return format(date, 'd MMM yyyy, HH:mm')
}

/**
 * Relative time from now.
 * e.g. "3 minutes ago"
 */
export function fromNow(iso: string | null | undefined): string {
  if (!iso) return '—'
  const date = parseISO(iso)
  if (!isValid(date)) return '—'
  return formatDistanceToNow(date, { addSuffix: true })
}

/**
 * Format file size in human-readable form.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

/**
 * Extract validation errors from Axios 422 response.
 */
export function extractErrors(err: unknown): Record<string, string> {
  const data = (err as { response?: { data?: { errors?: Record<string, string[]> } } })
    ?.response?.data
  if (!data?.errors) return {}
  return Object.fromEntries(
    Object.entries(data.errors).map(([k, msgs]) => [k, msgs[0]])
  )
}
