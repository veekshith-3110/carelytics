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
    const errorInfo: ErrorInfo = {
      message: error.message,
      code: (error as any).code,
      timestamp: new Date().toISOString(),
      correlationId: this.generateCorrelationId(),
      context,
    }

    this.errors.push(errorInfo)
    
    // Store in localStorage (in production, send to error tracking service)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('errorLogs')
      const logs = stored ? JSON.parse(stored) : []
      logs.push(errorInfo)
      // Keep only last 50 errors
      if (logs.length > 50) logs.shift()
      localStorage.setItem('errorLogs', JSON.stringify(logs))
    }

    console.error('Error logged:', errorInfo)
    return errorInfo.correlationId
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

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  try {
    window.addEventListener('unhandledrejection', (event) => {
      errorHandler.logError(
        new Error(event.reason?.message || 'Unhandled promise rejection'),
        { reason: event.reason }
      )
    })

    window.addEventListener('error', (event) => {
      errorHandler.logError(
        new Error(event.message || 'Unknown error'),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      )
    })
  } catch (e) {
    // Silently fail if error handlers can't be set up
    console.warn('Could not set up global error handlers:', e)
  }
}

