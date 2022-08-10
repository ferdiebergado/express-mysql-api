export interface ResponsePayload {
  status: 'ok' | 'failed'
  message: string
  data?: Record<string, any>
  errors?: Record<string, any>
}
