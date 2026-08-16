import api from './axios'
import type { PaginatedResponse } from '@/types'

export interface ActivityLog {
  id: number
  user_id: number | null
  action: string
  description: string
  ip_address: string | null
  user_agent: string | null
  created_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

const activityLogApi = {
  index: (params?: { page?: number; per_page?: number }) =>
    api.get<PaginatedResponse<ActivityLog>>('/activity-logs', { params }),
}

export default activityLogApi
