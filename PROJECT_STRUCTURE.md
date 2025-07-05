# E-Learning Platform - Project Structure

This document outlines the organized project structure for better development workflow.

## 📁 Project Organization

### `/app` - Next.js Application
- Main application code
- Pages, layouts, and route handlers
- API endpoints

### `/components` - React Components
- Reusable UI components organized by feature
- `auth/` - Authentication components
- `courses/` - Course-related components
- `payment/` - Payment components
- `ui/` - General UI components

### `/database` - Database Management
- `schema/` - Database schema files
  - `supabase-schema.sql` - Main database schema
- `migrations/` - Database migration and fix files
  - Migration scripts for schema changes
  - Fix scripts for data integrity
- `seed/` - Database seed data
  - `supabase-data.sql` - Initial data
  - `curriculum-*.sql` - Course curriculum data

### `/docs` - Documentation
- Project documentation and guides
- Implementation roadmaps
- Business strategy documents

### `/hooks` - Custom React Hooks
- Reusable React hooks for state management and side effects

### `/lib` - Utility Libraries
- Shared utility functions and configurations

### `/prisma` - Prisma ORM
- Database schema and migrations for Prisma

### `/public` - Static Assets
- Images, icons, and other static files

### `/scripts` - Utility Scripts
- `database/` - Database setup and management scripts
- General utility scripts for development

### `/supabase` - Supabase Configuration
- Supabase-specific configurations and migrations

### `/tests` - Test Files
- `auth/` - Authentication tests
- `database/` - Database and API tests

## 🚀 Getting Started with Authentication

To work on the authentication system:

1. **Database Setup**: Use scripts in `/scripts/database/`
2. **Schema**: Check `/database/schema/supabase-schema.sql`
3. **Components**: Work in `/components/auth/`
4. **API Routes**: Develop in `/app/api/auth/`
5. **Tests**: Run tests from `/tests/auth/`

## 📋 Development Workflow

1. Start with database setup using scripts in `/scripts/database/`
2. Review schema files in `/database/schema/`
3. Implement components in `/components/`
4. Create API routes in `/app/api/`
5. Write tests in `/tests/`
6. Update documentation in `/docs/`

## 🔧 Key Configuration Files

- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template
