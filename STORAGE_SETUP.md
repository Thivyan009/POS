# Supabase Storage Setup for Menu Images

## Overview
The menu image upload functionality requires a Supabase Storage bucket to store uploaded images.

## Setup Steps

### 1. Create Storage Bucket

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click **Storage** in the left sidebar
   - Click **New bucket**

3. **Create Bucket**
   - **Name**: `Menu Images` (or `menu-images` - the code supports both)
   - **Public bucket**: ✅ **Enable** (check this box)
   - Click **Create bucket**
   
   **Note**: The current code is configured for bucket name `Menu Images`. If you use a different name, update the bucket name in `/app/api/upload/image/route.ts`

### 2. Configure Bucket Policies

After creating the bucket, you need to set up policies to allow public read access:

1. **Go to Storage Policies**
   - Click on your bucket (e.g., `Menu Images` or `menu-images`)
   - Click on **Policies** tab

2. **Create Public Read Policy**
   - Click **New Policy**
   - Select **For full customization**
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**:
   ```sql
   (bucket_id = 'Menu Images'::text)
   ```
   
   **Note**: Replace `'Menu Images'` with your actual bucket name if different
   - Click **Review** and then **Save policy**

3. **Create Upload Policy (for service role)**
   - Click **New Policy**
   - Select **For full customization**
   - **Policy name**: `Service role upload access`
   - **Allowed operation**: `INSERT`
   - **Policy definition**:
   ```sql
   (bucket_id = 'Menu Images'::text)
   ```
   
   **Note**: Replace `'Menu Images'` with your actual bucket name if different
   - Click **Review** and then **Save policy**

4. **Create Delete Policy (for service role)**
   - Click **New Policy**
   - Select **For full customization**
   - **Policy name**: `Service role delete access`
   - **Allowed operation**: `DELETE`
   - **Policy definition**:
   ```sql
   (bucket_id = 'Menu Images'::text)
   ```
   
   **Note**: Replace `'Menu Images'` with your actual bucket name if different
   - Click **Review** and then **Save policy**

### 3. Alternative: Quick Setup via SQL

You can also run this SQL in the Supabase SQL Editor to set up the bucket and policies:

```sql
-- Create the bucket (if it doesn't exist)
-- Replace 'Menu Images' with your bucket name if different
INSERT INTO storage.buckets (id, name, public)
VALUES ('Menu Images', 'Menu Images', true)
ON CONFLICT (id) DO NOTHING;

-- Create public read policy
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'Menu Images'::text);

-- Create insert policy (for service role)
CREATE POLICY "Service role insert access"
ON storage.objects FOR INnSERT
WITH CHECK (bucket_id = 'Menu Images'::text);

-- Create delete policy (for service role)
CREATE POLICY "Service role delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'Menu Images'::text);
```

### 4. Verify Setup

1. **Test Upload**
   - Go to Admin Panel → Menu Management
   - Try uploading an image for a menu item
   - The image should upload and display correctly

2. **Check Storage**
   - Go back to Supabase Dashboard → Storage → menu-images
   - You should see uploaded images in the `menu-items/` folder

## File Structure

Images are stored in the following structure:
```
Menu Images/  (or your bucket name)
  └── menu-items/
      ├── 1234567890-abc123.jpg
      ├── 1234567891-def456.png
      └── ...
```

## Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key is required for the upload API route to work.

## Troubleshooting

### Error: "Bucket not found"
- Make sure the bucket name matches exactly (case-sensitive): `Menu Images`
- Check that the bucket exists in Supabase Dashboard → Storage
- Verify the bucket name in `/app/api/upload/image/route.ts` matches your bucket name

### Error: "Permission denied"
- Verify that the bucket is set to **Public**
- Check that the policies are correctly set up
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your `.env.local`

### Images not displaying
- Check that the bucket is public
- Verify the public read policy is enabled
- Check browser console for CORS or network errors

### Upload fails silently
- Check browser console for errors
- Verify the API route is accessible at `/api/upload/image`
- Check server logs for detailed error messages

