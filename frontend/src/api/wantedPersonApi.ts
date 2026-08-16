import api from './axios'
import type { ApiResponse } from '@/types'

export interface WantedPerson {
  id: number
  full_name: string
  alias: string | null
  image_path: string
  case_reference: string | null
  wanted_since: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StoreWantedPersonPayload {
  full_name: string
  alias?: string
  image_path: string
  case_reference?: string
  wanted_since?: string
  is_active?: boolean
}

const wantedPersonApi = {
  // Public
  index: () =>
    api.get<ApiResponse<WantedPerson[]>>('/wanted-persons'),

  // Admin
  adminIndex: () =>
    api.get<ApiResponse<WantedPerson[]>>('/admin/wanted-persons'),

  store: (payload: StoreWantedPersonPayload) =>
    api.post<ApiResponse<WantedPerson>>('/admin/wanted-persons', payload),

  update: (id: number, payload: Partial<StoreWantedPersonPayload>) =>
    api.put<ApiResponse<WantedPerson>>(`/admin/wanted-persons/${id}`, payload),

  destroy: (id: number) =>
    api.delete<ApiResponse<null>>(`/admin/wanted-persons/${id}`),
}

export default wantedPersonApi
