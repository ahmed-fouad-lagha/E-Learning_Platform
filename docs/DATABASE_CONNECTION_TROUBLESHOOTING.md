# 🔧 Database Connection Troubleshooting Guide

## 🚨 **Current Issue: Can't reach database server**

**Error**: `P1001: Can't reach database server at db.tgmnzmmfjkwougqtgwif.supabase.co:5432`

## 🔍 **Troubleshooting Steps**

### **Step 1: Verify Supabase Project Status**

1. **Check if your Supabase project is active:**
   - Go to: https://supabase.com/dashboard/project/tgmnzmmfjkwougqtgwif
   - Verify the project status is "Active" (green)
   - If paused, click "Resume" to reactivate

2. **Check project health:**
   - Look for any maintenance or outage notifications
   - Verify all services are running

### **Step 2: Get the Correct Connection String**

The database connection might need a different format. Try these alternatives:

#### **Option A: Connection Pooling (Recommended)**
```env
DATABASE_URL="postgresql://postgres.tgmnzmmfjkwougqtgwif:UTBqUHsyaIh1sBIk@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

#### **Option B: Direct Connection with SSL**
```env
DATABASE_URL="postgresql://postgres:UTBqUHsyaIh1sBIk@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres?sslmode=require"
```

#### **Option C: IPv6 Alternative**
```env
DATABASE_URL="postgresql://postgres:UTBqUHsyaIh1sBIk@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres?sslmode=require&connect_timeout=60"
```

### **Step 3: Check Network/Firewall Issues**

#### **Test Basic Connectivity**
```bash
# Test if you can reach the Supabase host
ping db.tgmnzmmfjkwougqtgwif.supabase.co

# Test if the port is accessible (requires telnet)
telnet db.tgmnzmmfjkwougqtgwif.supabase.co 5432
```

#### **Common Network Issues:**
- **Corporate Firewall**: May block port 5432
- **VPN**: Some VPNs block database connections
- **ISP Restrictions**: Some ISPs block database ports
- **Windows Firewall**: May need to allow Node.js

### **Step 4: Verify Credentials**

1. **Double-check password**: `UTBqUHsyaIh1sBIk`
2. **Verify project ID**: `tgmnzmmfjkwougqtgwif`
3. **Check if password was reset recently**

### **Step 5: Alternative Connection Methods**

#### **Use Supabase REST API Instead**
If direct PostgreSQL connection fails, we can use Supabase's REST API:

```typescript
// Alternative: Use Supabase client instead of Prisma for testing
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tgmnzmmfjkwougqtgwif.supabase.co',
  'your-anon-key'
)

// Test connection
const { data, error } = await supabase.from('courses').select('*')
```

## 🛠️ **Immediate Solutions to Try**

### **Solution 1: Update DATABASE_URL with Connection Pooling**
```bash
# Replace your current DATABASE_URL in .env.local with:
DATABASE_URL="postgresql://postgres.tgmnzmmfjkwougqtgwif:UTBqUHsyaIh1sBIk@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

### **Solution 2: Add SSL and Timeout Parameters**
```bash
DATABASE_URL="postgresql://postgres:UTBqUHsyaIh1sBIk@db.tgmnzmmfjkwougqtgwif.supabase.co:5432/postgres?sslmode=require&connect_timeout=60&pool_timeout=60"
```

### **Solution 3: Use Different Port (Connection Pooling)**
```bash
DATABASE_URL="postgresql://postgres.tgmnzmmfjkwougqtgwif:UTBqUHsyaIh1sBIk@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## 🔄 **Test Connection After Each Change**

After updating the DATABASE_URL, test with:
```bash
# Test the connection
npx prisma db push --preview-feature

# Or try a simple query
npx prisma studio
```

## 🌐 **Alternative: Use Supabase Web Interface**

If Prisma connection fails, you can:

1. **Use Supabase SQL Editor:**
   - Go to your Supabase dashboard
   - Navigate to "SQL Editor"
   - Run the schema creation SQL manually

2. **Use Supabase Table Editor:**
   - Create tables manually through the web interface
   - Import/export data as needed

## 📞 **Get Help from Supabase**

If none of these solutions work:

1. **Check Supabase Status**: https://status.supabase.com/
2. **Contact Supabase Support** through your dashboard
3. **Check Supabase Discord** for community help

## 🎯 **Most Likely Solutions**

Based on the error, try these in order:

1. **✅ Check Supabase project status** (most common issue)
2. **✅ Use connection pooling URL** (recommended for production)
3. **✅ Add SSL parameters** (required for secure connections)
4. **✅ Check network/firewall settings**
5. **✅ Verify password hasn't changed**

Let me know which solution works, and we can proceed with the database setup!
