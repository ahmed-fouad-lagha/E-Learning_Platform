// Test basic Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Present' : 'Missing')

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error.message)
  } else {
    console.log('✅ Supabase connection successful!')
    console.log('Session:', data.session ? 'Active' : 'No session')
  }
})

export default function TestConnection() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing Supabase Connection</h1>
      <p>Check the browser console for connection results.</p>
    </div>
  )
}
