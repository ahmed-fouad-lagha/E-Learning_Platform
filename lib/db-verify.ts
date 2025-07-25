import { createClient } from '@supabase/supabase-js';

// Database setup verification script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyDatabaseSetup() {
  console.log('🔍 Verifying database setup...');
  
  try {
    // Test 1: Check if profiles table exists
    console.log('1. Testing profiles table...');
    const { data: profilesTest, error: profilesError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Profiles table error:', {
        code: profilesError.code,
        message: profilesError.message,
        details: profilesError.details,
        hint: profilesError.hint
      });
    } else {
      console.log('✅ Profiles table accessible');
    }

    // Test 2: Check if courses table exists
    console.log('2. Testing courses table...');
    const { data: coursesTest, error: coursesError } = await supabase
      .from('courses')
      .select('count(*)')
      .limit(1);
    
    if (coursesError) {
      console.error('❌ Courses table error:', {
        code: coursesError.code,
        message: coursesError.message,
        details: coursesError.details,
        hint: coursesError.hint
      });
    } else {
      console.log('✅ Courses table accessible');
    }

    // Test 3: Check if course_enrollments table exists
    console.log('3. Testing course_enrollments table...');
    const { data: enrollmentsTest, error: enrollmentsError } = await supabase
      .from('course_enrollments')
      .select('count(*)')
      .limit(1);
    
    if (enrollmentsError) {
      console.error('❌ Course_enrollments table error:', {
        code: enrollmentsError.code,
        message: enrollmentsError.message,
        details: enrollmentsError.details,
        hint: enrollmentsError.hint
      });
    } else {
      console.log('✅ Course_enrollments table accessible');
    }

    // Test 4: Check current user session
    console.log('4. Testing current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
    } else if (session) {
      console.log('✅ User session found:', session.user.email);
      
      // Test 5: Try to fetch current user's profile
      console.log('5. Testing profile fetch for current user...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile fetch error:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        
        // Try to create profile if it doesn't exist
        if (profileError.code === 'PGRST116') {
          console.log('🔧 Profile not found, attempting to create...');
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.full_name || 'User',
              role: 'STUDENT',
              is_verified: true,
              subscription: 'FREE',
              total_points: 0,
              streak: 0,
            });
          
          if (createError) {
            console.error('❌ Profile creation failed:', {
              code: createError.code,
              message: createError.message,
              details: createError.details,
              hint: createError.hint
            });
          } else {
            console.log('✅ Profile created successfully');
          }
        }
      } else {
        console.log('✅ Profile found:', profile.email);
      }
    } else {
      console.log('ℹ️ No user session - this is normal for logged out users');
    }

  } catch (error) {
    console.error('❌ Database verification failed:', error);
  }
}

// Export for use in API routes
export { verifyDatabaseSetup };
