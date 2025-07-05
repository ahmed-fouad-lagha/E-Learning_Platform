/**
 * E-Learning Platform Database Connection Instructions
 * 
 * This file provides instructions for setting up your database connection
 * to work with Prisma and Supabase together.
 */

// -----------------------
// SETUP INSTRUCTIONS
// -----------------------

/**
 * 1. Configure DATABASE_URL in your .env file:
 * 
 * Go to Supabase Dashboard > Project Settings > Database
 * Find the Connection String (URI format) section 
 * Copy that string and add your password in the .env file
 * 
 * Example:
 * DATABASE_URL="postgresql://postgres:your-actual-password@db.xyzproject.supabase.co:5432/postgres"
 * 
 * 2. Run the Prisma commands:
 * 
 * npx prisma generate
 *   - This will generate the Prisma client based on your schema
 * 
 * Do NOT run migrations directly against Supabase!
 * Instead, use Supabase's SQL Editor to execute the necessary DDL commands
 * 
 * 3. Check if your existing tables match the Prisma schema:
 * 
 * The schema.prisma file defines models that should correspond to tables
 * already created by the Supabase auth system, plus any additional tables
 * you need for your application.
 * 
 * 4. For new tables/models in the schema.prisma file:
 *    a. Generate the SQL with: npx prisma migrate dev --create-only
 *    b. Copy the generated SQL
 *    c. Run it in Supabase's SQL Editor
 * 
 * 5. For Supabase auth integration:
 * 
 * Ensure your User model in schema.prisma matches the structure of
 * the Supabase auth.users table, and any custom profile fields
 * are mapped to your "profiles" table.
 */

// Import these at the top of your application code files
// import { PrismaClient } from '@prisma/client'
// export const prisma = new PrismaClient()

/**
 * To test your connection after setting up:
 * 
 * 1. Update the DATABASE_URL in .env with your actual Supabase connection string
 * 2. Run: npx tsx lib/db-test.ts
 */
