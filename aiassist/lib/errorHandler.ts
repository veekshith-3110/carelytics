export interface ErrorInfo {
  message: string
  code?: string
  timestamp: string
  correlationId: string
  context?: Record<string, any>
}

class ErrorHandler {
  private errors: ErrorInfo[] = []

  logError(error: Error, context?: Record<string, any>) {
    // Completely disable error logging - don't log any errors
    return ''
  }

  generateCorrelationId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getErrors(): ErrorInfo[] {
    return this.errors
  }

  clearErrors() {
    this.errors = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('errorLogs')
    }
  }
}

export const errorHandler = new ErrorHandler()

// Global error handlers disabled - no error logging
// Errors are completely suppressed to prevent any error notifications

