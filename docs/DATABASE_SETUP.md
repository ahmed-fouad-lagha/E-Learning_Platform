# Database Setup Guide for E-Learning Platform

This guide explains how to set up the database for the E-Learning Platform project using Supabase.

## Overview

The E-Learning Platform uses Supabase for both authentication and data storage. We use:

1. **Supabase Auth** for user authentication
2. **Supabase PostgreSQL** for storing application data
3. **Prisma ORM** to interact with the database from our Next.js application

## Setup Steps

### 1. Configure Supabase

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Once your project is created, go to **Settings > API** to find your:
   - Project URL
   - `anon` public API key

3. Add these values to your `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Configure Database Connection

1. Go to **Settings > Database** in your Supabase dashboard
2. Find the **Connection String** section and copy the URI format
3. Update your `.env` file with the database URL:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```
   (Replace `[YOUR-PASSWORD]` with your database password and `[YOUR-PROJECT-REF]` with your project reference)

### 3. Create Database Tables

1. Go to the **SQL Editor** in your Supabase dashboard
2. Copy the SQL from `prisma/course-tables.sql` file
3. Paste it into the SQL Editor and run the query
4. This will create all the necessary tables for courses, lessons, enrollments, etc.

### 4. Generate Prisma Client

Run the following command to generate the Prisma client based on your schema:

```bash
npx prisma generate
```

### 5. Test Database Connection

Run the test script to verify your database connection is working:

```bash
npx tsx lib/db-test.ts
```

If successful, you should see information about your database tables.

## Using Prisma with Supabase

When using Prisma with Supabase, keep in mind:

1. **Don't run migrations directly** - Use the SQL Editor in Supabase for schema changes
2. **Auth tables are managed by Supabase** - Don't modify these through Prisma
3. **RLS policies matter** - Make sure your Row Level Security policies are correctly configured

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Prisma Guide](https://www.prisma.io/nextjs)
