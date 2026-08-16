import api from './axios'
import type { ApiResponse, Notification } from '@/types'

interface NotificationsResponse {
  unread_count: number
  notifications: Notification[]
}

const notificationApi = {
  index: () =>
    api.get<ApiResponse<NotificationsResponse>>('/notifications'),

  markRead: (id: string) =>
    api.patch<ApiResponse<null>>(`/notifications/${id}/read`),
}

export default notificationApi
