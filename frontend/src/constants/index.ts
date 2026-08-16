// ─── Route query keys (TanStack Query) ───────────────────────────────────────
export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  reports: {
    all: ['reports'] as const,
    list: (filters?: object) => ['reports', 'list', filters] as const,
    detail: (id: number) => ['reports', id] as const,
    history: (id: number) => ['reports', id, 'history'] as const,
    notes: (id: number) => ['reports', id, 'notes'] as const,
    evidence: (id: number) => ['reports', id, 'evidence'] as const,
    assigned: ['reports', 'assigned'] as const,
    search: (q: string, filters?: object) => ['reports', 'search', q, filters] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  messages: {
    all: ['messages'] as const,
    byReport: (reportId: number) => ['messages', reportId] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params?: object) => ['users', 'list', params] as const,
  },
  roles: {
    all: ['roles'] as const,
    permissions: ['permissions'] as const,
  },
  analytics: {
    stats: ['analytics', 'stats'] as const,
    byCategory: ['analytics', 'by-category'] as const,
    statusSummary: ['analytics', 'status-summary'] as const,
    dashboard: ['analytics', 'dashboard'] as const,
  },
  activityLogs: {
    list: (params?: object) => ['activity-logs', params] as const,
  },
} as const

// ─── Report status labels & colours ──────────────────────────────────────────
export const REPORT_STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  assigned: { label: 'Assigned', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  investigating: { label: 'Investigating', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  awaiting_evidence: { label: 'Awaiting Evidence', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  closed: { label: 'Closed', color: 'bg-muted text-muted-foreground dark:bg-secondary/30 dark:text-muted-foreground' },
} as const

// ─── Priority labels & colours ────────────────────────────────────────────────
export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground dark:bg-secondary/30 dark:text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
} as const

// ─── Accepted file types for evidence upload ──────────────────────────────────
export const ACCEPTED_EVIDENCE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'video/mp4': ['.mp4'],
}

export const MAX_EVIDENCE_SIZE_MB = 50
export const MAX_EVIDENCE_SIZE_BYTES = MAX_EVIDENCE_SIZE_MB * 1024 * 1024

// ─── Pagination defaults ──────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 15
