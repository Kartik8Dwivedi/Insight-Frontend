## Setting up analytics data

The analytics dataset is not committed to this repo.

1. Ask the project lead for the real MONGODB_URI
2. Run: `cd backend && node scripts/export-analytics.js`  
3. Upload: `npx vercel blob upload analytics.json --name analytics-data`
4. Copy the returned URL into Vercel project settings as `ANALYTICS_BLOB_URL`

For local dev, set `ANALYTICS_BLOB_URL` in `frontend/.env.local` pointing to the uploaded blob.
Other team members with the dummy MONGODB_URI can still run the export script — it'll 
produce a dummy JSON that works for UI development.