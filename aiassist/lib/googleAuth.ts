import { GoogleLogin, CredentialResponse } from '@react-oauth/google'

export interface GoogleUser {
  email: string
  name: string
  picture: string
  sub: string
}

export const decodeJWT = (token: string): GoogleUser | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '862611167571-l7fevev7mq9v53n3isbohghp3emlkjng.apps.googleusercontent.com'

