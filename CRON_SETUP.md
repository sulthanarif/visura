# Vercel Cron Job Setup for Supabase Keep-Alive

## Overview
This setup prevents Supabase free tier databases from pausing due to inactivity by running a scheduled keep-alive job every 4 hours.

## Files Created

### 1. `vercel.json` - Cron Configuration
```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

### 2. `/api/cron/keep-alive.js` - Keep-Alive Endpoint
- Performs lightweight database query every 4 hours
- Prevents Supabase database from pausing
- Includes error handling and logging
- Protected with CRON_SECRET for security

### 3. `/api/cron/status.js` - Health Check Endpoint
- Manual database connectivity check
- Response time monitoring
- Status verification for troubleshooting

## Environment Variables Required

Add this to your Vercel environment variables:

```bash
CRON_SECRET=your-secure-random-string-here
```

**How to set:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `CRON_SECRET` with a secure random value
3. Redeploy your application

## Cron Schedule Explanation

`"0 */4 * * *"` means:
- `0` - At minute 0
- `*/4` - Every 4 hours  
- `*` - Every day of month
- `*` - Every month
- `*` - Every day of week

**Execution times:** 12:00 AM, 4:00 AM, 8:00 AM, 12:00 PM, 4:00 PM, 8:00 PM (UTC)

## How It Works

1. **Vercel Cron** triggers the `/api/cron/keep-alive` endpoint every 4 hours
2. **Authentication** checks the CRON_SECRET to ensure legitimate requests
3. **Database Query** performs a lightweight operation (count users table)
4. **Logging** records success/failure for monitoring
5. **Response** returns status and timestamp

## Manual Testing

### Test Keep-Alive Endpoint:
```bash
curl -X GET "https://your-app.vercel.app/api/cron/keep-alive" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Test Status Endpoint:
```bash
curl -X GET "https://your-app.vercel.app/api/cron/status"
```

## Monitoring

### Vercel Functions Tab
- Check execution logs in Vercel Dashboard → Functions
- Monitor success/failure rates
- View execution times and errors

### Console Logs
The keep-alive job logs:
- Start time
- Database query results  
- Success/error status
- Execution completion

### Example Success Log:
```
[CRON] Keep-alive job started at: 2025-06-23T12:00:00.000Z
[CRON] Keep-alive successful. Database responsive.
[CRON] User count check completed at: 2025-06-23T12:00:01.234Z
```

## Security Features

1. **CRON_SECRET Protection** - Only requests with valid secret are processed
2. **Error Handling** - Graceful failure handling with detailed logging
3. **Minimal Database Impact** - Lightweight queries that don't affect performance
4. **Request Method Validation** - Only allows appropriate HTTP methods

## Customization Options

### Change Schedule Frequency:
```json
// Every 2 hours
"schedule": "0 */2 * * *"

// Every 6 hours  
"schedule": "0 */6 * * *"

// Daily at 6 AM UTC
"schedule": "0 6 * * *"
```

### Alternative Database Queries:
```javascript
// Count rows in specific table
const { count } = await supabase
  .from('your_table')
  .select('*', { count: 'exact', head: true });

// Simple connection test
const { data } = await supabase
  .from('information_schema.tables')
  .select('table_name')
  .limit(1);
```

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check CRON_SECRET is set correctly in Vercel
   - Ensure environment variable is deployed

2. **Database Connection Errors**
   - Verify Supabase URL and keys are correct
   - Check Supabase project status

3. **Cron Not Triggering**
   - Ensure vercel.json is in project root
   - Check Vercel Dashboard → Functions for logs
   - Verify deployment included vercel.json

### Debug Steps:
1. Test status endpoint manually
2. Check Vercel function logs
3. Verify environment variables
4. Test keep-alive endpoint with curl

## Benefits

- ✅ **Prevents Database Pause** - Keeps Supabase active 24/7
- ✅ **Cost Effective** - Minimal resource usage
- ✅ **Automated** - No manual intervention required  
- ✅ **Monitored** - Comprehensive logging and status checking
- ✅ **Secure** - Protected with authentication
- ✅ **Reliable** - Error handling and recovery

## Next Steps

1. Deploy to Vercel with vercel.json
2. Set CRON_SECRET environment variable
3. Monitor first few executions
4. Adjust schedule if needed
5. Set up alerts for failures (optional)

---

**Created**: June 23, 2025  
**Schedule**: Every 4 hours  
**Purpose**: Prevent Supabase database pausing
