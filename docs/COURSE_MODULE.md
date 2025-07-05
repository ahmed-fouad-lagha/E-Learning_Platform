# Course Module Implementation

This document explains the implementation of the Course Module for the E-Learning Platform.

## Overview

We've implemented the following components for the course system:

1. **Database Schema** - Prisma schema for courses and enrollments
2. **Database Utilities** - Helper functions in `lib/db.ts` and `lib/courses.ts`
3. **API Endpoints** - REST APIs for course listing, details, and enrollments

## API Endpoints

### Course Listing
- `GET /api/courses` - List all courses with optional filtering
  - Query parameters:
    - `subject` - Filter by subject
    - `grade` - Filter by grade level
    - `isFree` - Filter by free courses
    - `page` - Pagination page number
    - `limit` - Number of items per page

### Course Details
- `GET /api/courses/[courseId]` - Get detailed information about a course
  - Returns lesson list and enrollment status if user is authenticated

### Course Enrollment
- `POST /api/courses/[courseId]/enroll` - Enroll a user in a course
  - Requires authentication
  - Authorization header with Bearer token

### User Enrollments
- `GET /api/user/enrollments` - Get all courses a user is enrolled in
  - Requires authentication
  - Authorization header with Bearer token

## Database Setup

Before using these endpoints, you need to:

1. Configure your Supabase database connection
2. Run the SQL in `prisma/course-tables.sql` in the Supabase SQL Editor
3. Generate the Prisma client with `npx prisma generate`

See the [Database Setup Guide](../DATABASE_SETUP.md) for detailed instructions.

## Next Steps

To complete the course module implementation:

1. **Frontend Components**
   - Course listing page with filters
   - Course detail page with lesson listing
   - Enrollment button and progress tracking
   - "My Courses" section in the user dashboard

2. **Authentication Integration**
   - Connect Supabase auth with the course API endpoints
   - Add middleware to protect routes

3. **Content Creation**
   - Create sample courses with lessons
   - Add ONEC-aligned curriculum content
   - Create BAC exam simulations

## Testing

To test the API endpoints:

1. Use a tool like Postman or Thunder Client
2. Make sure to include the Authorization header with a valid Supabase token
3. Test the course creation, listing, and enrollment flows
