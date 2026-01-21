# Troubleshooting Guide

## Login 401 Error

If you're seeing a `401 Unauthorized` error when trying to login, it's likely because:

### Issue: Database Migration Not Run

The email column is missing from the `users` table. This is required for the new email-based authentication.

### Solution

1. **Run the Migration SQL**:
   - Open Supabase Dashboard: https://supabase.com/dashboard
   - Go to **SQL Editor**
   - Click **New query**
   - Copy contents from `supabase/migrations/001_add_email_column.sql`
   - Paste and click **Run**

2. **Or use the Setup Page**:
   - Visit: `http://localhost:3000/admin/setup`
   - Click "Copy Migration SQL"
   - Paste in Supabase SQL Editor and run

### Verify Migration

After running the migration, verify it worked:

```bash
npm run db:check
```

You should see:
- ✅ Email column exists
- ✅ Default admin user exists

### Test Login

After migration, try logging in with:
- **Email**: `paruthimunaitech@gmail.com`
- **Password**: `Paruthi10000`

## Common Errors

### "Email column missing"
**Solution**: Run migration SQL (see above)

### "Invalid email or password"
**Possible causes**:
1. Migration not run (email column missing)
2. Admin user doesn't exist
3. Wrong credentials

**Solution**: 
1. Run `npm run db:check` to verify database state
2. Run migration if needed
3. Verify credentials are correct

### "Database connection failed"
**Solution**:
1. Check `.env.local` has correct Supabase credentials
2. Verify Supabase project is active
3. Restart dev server after updating `.env.local`

## Debug Endpoints

- **Database Status**: `GET /api/db/migrate`
- **Connection Test**: `GET /api/db/test-connection`
- **Setup Page**: `http://localhost:3000/admin/setup`

## Getting Help

1. Check database status: `npm run db:check`
2. Visit setup page: `/admin/setup`
3. Check browser console for detailed error messages
4. Check server logs in terminal












