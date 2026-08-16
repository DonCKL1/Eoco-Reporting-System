import api from './axios'
import type { ApiResponse, Category } from '@/types'

export interface StoreCategoryPayload {
  name: string
  description?: string
}

const categoryApi = {
  index: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  store: (payload: StoreCategoryPayload) =>
    api.post<ApiResponse<Category>>('/categories', payload),

  update: (id: number, payload: Partial<StoreCategoryPayload>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, payload),

  destroy: (id: number) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),
}

export default categoryApi
