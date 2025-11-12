// Privacy-respecting analytics
export interface AnalyticsEvent {
  type: string
  category: string
  action: string
  label?: string
  value?: number
  timestamp: string
}

class Analytics {
  private events: AnalyticsEvent[] = []

  track(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    this.events.push(fullEvent)

    // Store in localStorage (in production, send to analytics service)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('analyticsEvents')
      const events = stored ? JSON.parse(stored) : []
      events.push(fullEvent)
      // Keep only last 100 events
      if (events.length > 100) events.shift()
      localStorage.setItem('analyticsEvents', JSON.stringify(events))
    }

    // No PII - only anonymized events
    console.log('Analytics:', fullEvent)
  }

  trackFeatureUsage(feature: string, language?: string) {
    this.track({
      type: 'feature_usage',
      category: 'feature',
      action: 'used',
      label: feature,
      value: language ? 1 : undefined,
    })
  }

  trackLanguageChange(from: string, to: string) {
    this.track({
      type: 'language_change',
      category: 'ui',
      action: 'language_switched',
      label: `${from}_to_${to}`,
    })
  }

  trackAuth(method: string, success: boolean) {
    this.track({
      type: 'auth',
      category: 'authentication',
      action: success ? 'login_success' : 'login_failed',
      label: method,
    })
  }

  trackFoodRecognition(confidence: number, confirmed: boolean) {
    this.track({
      type: 'food_recognition',
      category: 'ml',
      action: confirmed ? 'confirmed' : 'low_confidence',
      value: Math.round(confidence * 100),
    })
  }

  trackCameraPermission(granted: boolean) {
    this.track({
      type: 'permission',
      category: 'privacy',
      action: granted ? 'granted' : 'denied',
      label: 'camera',
    })
  }

  getEvents(): AnalyticsEvent[] {
    return this.events
  }

  clearEvents() {
    this.events = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analyticsEvents')
    }
  }
}

export const analytics = new Analytics()

