# 🔑 Quick Supabase Service Role Key Setup

## Step-by-Step Instructions

### 1. Access Your Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. You should see your project: **`tgmnzmmfjkwougqtgwif`**

### 2. Navigate to API Settings
1. Click on your project **`tgmnzmmfjkwougqtgwif`**
2. In the left sidebar, click **Settings** 
3. Click **API** in the settings menu

### 3. Copy the Service Role Key
1. You'll see two keys:
   - **anon/public** key (already configured ✅)
   - **service_role** key (⚠️ **this is what you need**)

2. Copy the **service_role** key (it starts with `eyJ...`)
3. **⚠️ IMPORTANT**: This key has admin privileges - keep it secure!

### 4. Update Your Environment
Replace this line in your `.env.local`:
```bash
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

With:
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ_your_actual_service_role_key_here
```

## Why Do You Need This Key?

The service role key allows your application to:
- Bypass Row Level Security (RLS) for admin operations
- Create and manage user accounts programmatically
- Perform database operations that require elevated privileges
- Send emails and notifications

## Security Notes
- ⚠️ **Never expose this key in client-side code**
- ✅ Only use it in server-side API routes
- ✅ Keep it in your `.env.local` file (not committed to git)
- ✅ Regenerate it if you suspect it's been compromised

---

**Next Step**: Run `npm run setup-interactive` to complete your environment setup!
