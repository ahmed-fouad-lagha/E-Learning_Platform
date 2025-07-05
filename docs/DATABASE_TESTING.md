# Testing the Database Connection

To test your database connection with Supabase:

1. Make sure your `.env` file is updated with the correct Supabase connection string:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

2. Run the test script:
   ```bash
   npx tsx lib/db-test.ts
   ```

3. If the connection is successful, you'll see:
   ```
   ✅ Database connection successful!
   ```

4. If you encounter errors:
   - Check that your connection string is correct
   - Ensure your IP address is allowed in Supabase's database settings
   - Verify that your database password is correct

5. After creating tables in Supabase's SQL Editor, you can run the test again to verify the tables exist

Remember: You need to use the direct PostgreSQL connection string from Supabase, not the API URL.
