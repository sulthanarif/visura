// src/pages/api/cron/keep-alive.js
import supabase from '@/utils/supabaseClient';

export default async function handler(req, res) {
  // Verify this is a cron request from Vercel
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid cron secret' 
    });
  }  try {
    console.log('[CRON] Keep-alive job started at:', new Date().toISOString());

    // Perform a lightweight database operation to prevent pause
    // Using projects table which exists in the database
    const { data, error, count } = await supabase
      .from('projects')
      .select('projectId', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      console.error('[CRON] Database query error:', error);
      
      // Fallback: try ocr_results table
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('ocr_results')
          .select('result_id', { head: true })
          .limit(1);
          
        if (fallbackError) {
          return res.status(500).json({ 
            error: 'Database error',
            details: fallbackError.message,
            timestamp: new Date().toISOString()
          });
        }
        
        console.log('[CRON] Keep-alive successful with fallback method (ocr_results).');
        
      } catch (fallbackErr) {
        return res.status(500).json({ 
          error: 'Database error',
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log('[CRON] Keep-alive successful. Database responsive.');
    console.log('[CRON] Database query completed at:', new Date().toISOString());

    // Log the activity for monitoring
    const response = {
      success: true,
      message: 'Database keep-alive successful',
      executionTime: Date.now()
    };

    console.log('[CRON] Response:', response);

    return res.status(200).json(response);

  } catch (error) {
    console.error('[CRON] Keep-alive job failed:', error);
    
    return res.status(500).json({
      error: 'Keep-alive job failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
