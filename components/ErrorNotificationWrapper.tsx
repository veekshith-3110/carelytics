'use client'

import dynamic from 'next/dynamic'

// Client component wrapper for ErrorNotification to use dynamic import with ssr: false
const ErrorNotification = dynamic(() => import('@/components/ErrorNotification'), {
  ssr: false,
})

export default function ErrorNotificationWrapper() {
  return <ErrorNotification />
}

