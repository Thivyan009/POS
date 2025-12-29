# How to Clear Favicon Cache

The v0 logo might be cached in your browser. To see the new favicon:

1. **Hard Refresh:**
   - Windows/Linux: Ctrl + Shift + R or Ctrl + F5
   - Mac: Cmd + Shift + R

2. **Clear Browser Cache:**
   - Chrome: Settings > Privacy > Clear browsing data > Cached images and files
   - Firefox: Settings > Privacy > Clear Data > Cached Web Content
   - Safari: Develop > Empty Caches

3. **Open in Incognito/Private Window:**
   - This bypasses cache completely

4. **Replace the Logo File:**
   - Replace `/public/restaurant-logo.png` with your actual restaurant logo
   - The file should be a PNG image

5. **Restart Dev Server:**
   - Stop the server (Ctrl+C) and run `npm run dev` again
