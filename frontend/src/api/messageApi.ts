import api from './axios'
import type { ApiResponse, PaginatedResponse, Message } from '@/types'

export interface StoreMessagePayload {
  report_id: number
  receiver_id: number
  body: string
}

const messageApi = {
  index: () =>
    api.get<PaginatedResponse<Message>>('/messages'),

  byReport: (reportId: number) =>
    api.get<ApiResponse<Message[]>>(`/messages/${reportId}`),

  store: (payload: StoreMessagePayload) =>
    api.post<ApiResponse<Message>>('/messages', payload),
}

export default messageApi
