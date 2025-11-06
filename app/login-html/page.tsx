import { redirect } from 'next/navigation'

// This route redirects to the HTML login page
export default function HTMLLoginPage() {
  redirect('/login.html')
}

