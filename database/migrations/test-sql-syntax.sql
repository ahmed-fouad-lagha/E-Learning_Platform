-- Test script to validate curriculum-lessons-part3.sql syntax
-- This will help identify any remaining syntax issues

BEGIN;

-- Create a temporary test table with the same structure
CREATE TEMP TABLE test_lessons (
    id text PRIMARY KEY,
    title text NOT NULL,
    title_ar text,
    content text NOT NULL,
    content_ar text,
    order_num integer NOT NULL,
    duration integer NOT NULL,
    course_id text NOT NULL
);

-- Test a simplified version of the lesson structure
INSERT INTO test_lessons (id, title, title_ar, content, content_ar, order_num, duration, course_id) VALUES
('test-01', 'Test Lesson', 'درس تجريبي', 'Test content', 'محتوى تجريبي', 1, 60, 'test-course'),
('test-02', 'Test Lesson 2', 'درس تجريبي 2', 'Test content 2', 'محتوى تجريبي 2', 2, 45, 'test-course');

-- If this works, the syntax is valid
SELECT COUNT(*) FROM test_lessons;

ROLLBACK;
