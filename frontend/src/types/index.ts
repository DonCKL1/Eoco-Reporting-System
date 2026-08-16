// ─── User ─────────────────────────────────────────────────────────────────────

export type UserStatus = 'active' | 'suspended'

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  status: UserStatus
  email_verified_at: string | null
  roles: string[]
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  token?: string
}

// ─── Report ───────────────────────────────────────────────────────────────────

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'investigating'
  | 'awaiting_evidence'
  | 'resolved'
  | 'closed'

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Report {
  id: number
  reference_no: string
  title: string
  description: string
  incident_date: string
  location: string | null
  status: ReportStatus
  priority: ReportPriority
  is_anonymous: boolean
  category_id: number
  user_id: number | null
  category: Category
  user?: User | null
  created_at: string
  updated_at: string
}

export interface ReportListItem {
  id: number
  reference_no: string
  title: string
  status: ReportStatus
  priority: ReportPriority
  is_anonymous: boolean
  category: Pick<Category, 'id' | 'name'>
  created_at: string
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

// ─── Evidence ─────────────────────────────────────────────────────────────────

export interface EvidenceFile {
  id: number
  report_id: number
  path: string
  original_name: string
  file_type: string
  file_size: number
  uploaded_by: number | null
  created_at: string
}

// ─── Message ──────────────────────────────────────────────────────────────────

export interface Message {
  id: number
  report_id: number
  sender_id: number
  receiver_id: number
  body: string
  read_at: string | null
  sender: Pick<User, 'id' | 'name'>
  receiver: Pick<User, 'id' | 'name'>
  created_at: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type: string
  data: Record<string, unknown>
  read_at: string | null
  created_at: string
}

// ─── Case Assignment ──────────────────────────────────────────────────────────

export interface CaseAssignment {
  id: number
  report_id: number
  officer_id: number
  assigned_by: number
  notes: string | null
  report: ReportListItem
  officer: Pick<User, 'id' | 'name' | 'email'>
  assigner: Pick<User, 'id' | 'name'>
  created_at: string
}

// ─── Case Note ────────────────────────────────────────────────────────────────

export interface CaseNote {
  id: number
  report_id: number
  officer_id: number
  note: string
  officer: Pick<User, 'id' | 'name'>
  created_at: string
}

// ─── Status History ───────────────────────────────────────────────────────────

export interface StatusHistory {
  id: number
  report_id: number
  old_status: ReportStatus | null
  new_status: ReportStatus
  changed_by: number | null
  notes: string | null
  changer: Pick<User, 'id' | 'name'> | null
  created_at: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total_reports: number
  open_reports: number
  resolved_reports: number
  this_month: number
  pending_assignments: number
  active_officers: number
}

export interface ReportsByCategory {
  category: string
  count: number
}

export interface StatusSummary {
  status: ReportStatus
  count: number
}

// ─── Role & Permission ────────────────────────────────────────────────────────

export interface Role {
  id: number
  name: string
  guard_name: string
  permissions: Permission[]
  created_at: string
}

export interface Permission {
  id: number
  name: string
  guard_name: string
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityLog {
  id: number
  log_name: string
  description: string
  subject_type: string | null
  subject_id: number | null
  causer_type: string | null
  causer_id: number | null
  properties: Record<string, unknown>
  created_at: string
}

// ─── Anonymous Report ─────────────────────────────────────────────────────────

export interface AnonymousReportTrack {
  reference_no: string
  status: ReportStatus
  priority: ReportPriority
  category: string
  created_at: string
}

// ─── API Response Envelopes ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

export interface ValidationError {
  message: string
  errors: Record<string, string[]>
}
