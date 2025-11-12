import { showToast } from '@/components/Toast'
import { errorHandler } from './errorHandler'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  retries?: number
}

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, retries = 3 } = options
    const correlationId = errorHandler.generateCorrelationId()

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        ...headers,
      },
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        lastError = error as Error
        
        if (attempt < retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        // Log error
        errorHandler.logError(lastError, {
          endpoint,
          method,
          correlationId,
          attempt: attempt + 1,
        })

        // Show user-friendly error
        showToast(
          `Request failed: ${lastError.message}. Please try again.`,
          'error',
          5000
        )

        throw lastError
      }
    }

    throw lastError || new Error('Request failed')
  }

  get<T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  put<T>(endpoint: string, body: any, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  delete<T>(endpoint: string, options?: Omit<ApiOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()

// Note: generateCorrelationId is already defined in errorHandler

