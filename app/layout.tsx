import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastContainer } from '@/components/Toast'
import TextToSpeech from '@/components/TextToSpeech'
import ErrorNotification from '@/components/ErrorNotification'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from '@/lib/googleAuth'

export const metadata: Metadata = {
  title: 'Carelytics — AI Smart Health & Wellness Assistant',
  description: 'Your AI-powered health companion with symptom checking, multilingual support, camera-based mood analysis, and comprehensive health tracking',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Carelytics',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Handle missing Google Client ID gracefully
  const googleClientId = GOOGLE_CLIENT_ID || ''
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          {googleClientId ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              {children}
              <ToastContainer />
              <TextToSpeech />
              <ErrorNotification />
            </GoogleOAuthProvider>
          ) : (
            <>
              {children}
              <ToastContainer />
              <TextToSpeech />
              <ErrorNotification />
            </>
          )}
        </ErrorBoundary>
      </body>
    </html>
  )
}

