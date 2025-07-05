import { prisma } from './prisma';

async function testConnection() {
  try {
    // Try to connect to the database
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Database connection successful!', result);
    
    // Check if we're connected to Supabase by checking for auth schema
    const authSchemaExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth'
      ) as exists`;
    
    console.log('🔑 Supabase auth schema exists:', authSchemaExists);
    
    // List all models/tables in public schema
    const tableInfo = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'`;
    
    console.log('📋 Available tables in public schema:', tableInfo);
    
    // Check for profiles table specifically (created by Supabase)
    const profilesTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
      ) as exists`;
    
    console.log('👤 Profiles table exists:', profilesTableExists);
    
    console.log('\n📝 Next Steps:');
    console.log('1. Verify that your DATABASE_URL in .env points to your Supabase PostgreSQL database');
    console.log('2. Run `npx prisma generate` to update the Prisma client');
    console.log('3. Check if the existing Supabase tables match your Prisma schema');
    console.log('4. For new tables, use Supabase SQL Editor instead of Prisma migrations');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if your DATABASE_URL in .env is correct');
    console.log('2. Make sure you have network access to your Supabase database');
    console.log('3. Verify that your IP is allowed in Supabase database settings');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
