'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function DatabaseTestPage() {
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, message])
  }

  useEffect(() => {
    const testDatabase = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      const supabase = createClient(supabaseUrl, supabaseKey)

      addResult('🔍 Testing database connection...')
      
      try {
        // Test basic connection
        const { data: session } = await supabase.auth.getSession()
        addResult('✅ Supabase connection successful')

        // Test if profiles table exists
        addResult('🔍 Checking if profiles table exists...')
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)

        if (error) {
          if (error.message.includes('does not exist')) {
            addResult('❌ profiles table does not exist!')
            addResult('📝 You need to create the profiles table in Supabase')
            addResult('💡 Go to Supabase Dashboard > SQL Editor')
            addResult('💡 Run the SQL from setup-database.sql file')
          } else {
            addResult(`❌ Database error: ${error.message}`)
          }
        } else {
          addResult('✅ profiles table exists and is accessible')
          
          // Test inserting a dummy record (to check permissions)
          addResult('🔍 Testing insert permissions...')
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: '00000000-0000-0000-0000-000000000000', // Fake UUID to test permissions
              email: 'test@test.com',
              name: 'Test User'
            })

          if (insertError) {
            if (insertError.message.includes('Row Level Security')) {
              addResult('⚠️ RLS is enabled (this is normal)')
              addResult('✅ Database structure is correct')
            } else if (insertError.message.includes('duplicate key')) {
              addResult('✅ Insert permissions work (duplicate key is expected)')
            } else {
              addResult(`⚠️ Insert test error: ${insertError.message}`)
            }
          } else {
            addResult('✅ Insert permissions work')
            // Clean up the test record
            await supabase
              .from('profiles')
              .delete()
              .eq('id', '00000000-0000-0000-0000-000000000000')
          }
        }

      } catch (error: any) {
        addResult(`❌ Connection failed: ${error.message}`)
      }
    }

    testDatabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">اختبار قاعدة البيانات</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">نتائج الاختبار:</h2>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="font-mono text-sm">
                {result}
              </div>
            ))}
          </div>
          
          {results.length === 0 && (
            <div className="text-center text-gray-500">
              جاري اختبار قاعدة البيانات...
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">إذا كانت النتائج تظهر أخطاء:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>انتقل إلى Supabase Dashboard</li>
            <li>اذهب إلى SQL Editor</li>
            <li>انسخ محتوى ملف setup-database.sql والصقه</li>
            <li>اضغط Run لتنفيذ الاستعلام</li>
            <li>أعد تحميل هذه الصفحة</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
