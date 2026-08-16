import api from './axios'
import type { ApiResponse, PaginatedResponse, Report, ReportListItem } from '@/types'

export interface StoreReportPayload {
  category_id: number
  title: string
  description: string
  incident_date: string
  location?: string
  priority?: string
}

export interface AnonymousReportPayload {
  category_id: number
  title: string
  description: string
  incident_date: string
  location?: string
}

export interface AnonymousReportCreated {
  reference_no: string
  tracking_token: string
  warning: string
}

export interface AnonymousTrackResult {
  reference_no: string
  status: string
  priority: string
  category: string
  created_at: string
}

export interface ReportFilters {
  page?: number
  per_page?: number
  status?: string
  priority?: string
  category_id?: number
  search?: string
}

const reportApi = {
  // Authenticated
  index: (params?: ReportFilters) =>
    api.get<PaginatedResponse<ReportListItem>>('/reports', { params }),

  show: (id: number) =>
    api.get<ApiResponse<Report>>(`/reports/${id}`),

  store: (payload: StoreReportPayload) =>
    api.post<ApiResponse<Report>>('/reports', payload),

  update: (id: number, payload: Partial<StoreReportPayload>) =>
    api.put<ApiResponse<Report>>(`/reports/${id}`, payload),

  destroy: (id: number) =>
    api.delete<ApiResponse<null>>(`/reports/${id}`),

  // Status
  updateStatus: (id: number, status: string, notes?: string) =>
    api.patch<ApiResponse<Report>>(`/reports/${id}/status`, { status, notes }),

  statusHistory: (id: number) =>
    api.get<ApiResponse<unknown[]>>(`/reports/${id}/history`),

  // Assignment
  assign: (id: number, officer_id: number, notes?: string) =>
    api.post<ApiResponse<unknown>>(`/reports/${id}/assign`, { officer_id, notes }),

  assignedReports: (params?: ReportFilters) =>
    api.get<PaginatedResponse<ReportListItem>>('/assigned-reports', { params }),

  // Anonymous
  submitAnonymous: (payload: AnonymousReportPayload) =>
    api.post<ApiResponse<AnonymousReportCreated>>('/anonymous-reports', payload),

  trackAnonymous: (token: string) =>
    api.get<ApiResponse<AnonymousTrackResult>>(`/track/${token}`),

  // Search
  search: (query: string, params?: ReportFilters) =>
    api.get<PaginatedResponse<ReportListItem>>('/search/reports', {
      params: { q: query, ...params },
    }),

  // Export
  exportPdf: () =>
    api.get('/reports/export/pdf', { responseType: 'blob' }),

  exportExcel: () =>
    api.get('/reports/export/excel', { responseType: 'blob' }),
}

export default reportApi
