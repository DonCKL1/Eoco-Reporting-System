import api from './axios'
import wantedPersonApi from './wantedPersonApi'
import userApi from './userApi'
import notificationApi from './notificationApi'
import messageApi from './messageApi'
import activityLogApi from './activityLogApi'
import type {
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  ReportsByCategory,
  StatusSummary,
  ActivityLog,
  Role,
  Permission,
  EvidenceFile,
  CaseNote,
} from '@/types'

const analyticsApi = {
  stats: () =>
    api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),

  reportsByCategory: () =>
    api.get<ApiResponse<ReportsByCategory[]>>('/dashboard/reports-by-category'),

  statusSummary: () =>
    api.get<ApiResponse<StatusSummary[]>>('/dashboard/status-summary'),

  dashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/dashboard'),

  activityLogs: (params?: { page?: number; per_page?: number }) =>
    api.get<PaginatedResponse<ActivityLog>>('/activity-logs', { params }),
}

const rolesApi = {
  index: () =>
    api.get<ApiResponse<Role[]>>('/roles'),

  store: (payload: { name: string }) =>
    api.post<ApiResponse<Role>>('/roles', payload),

  permissions: () =>
    api.get<ApiResponse<Permission[]>>('/permissions'),
}

const evidenceApi = {
  upload: (reportId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<ApiResponse<EvidenceFile>>(
      `/reports/${reportId}/evidence`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
  },

  index: (reportId: number) =>
    api.get<ApiResponse<EvidenceFile[]>>(`/reports/${reportId}/evidence`),

  destroy: (id: number) =>
    api.delete<ApiResponse<null>>(`/evidence/${id}`),

  downloadUrl: (id: number) =>
    api.get<ApiResponse<{ download_url: string }>>(`/evidence/${id}/download-url`),
}

const caseNotesApi = {
  index: (reportId: number) =>
    api.get<ApiResponse<CaseNote[]>>(`/reports/${reportId}/notes`),

  store: (reportId: number, note: string) =>
    api.post<ApiResponse<CaseNote>>(`/reports/${reportId}/notes`, { note }),

  destroy: (id: number) =>
    api.delete<ApiResponse<null>>(`/notes/${id}`),
}

export { analyticsApi, rolesApi, evidenceApi, caseNotesApi, wantedPersonApi, userApi, notificationApi, messageApi, activityLogApi }
