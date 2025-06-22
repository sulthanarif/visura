// src/pages/api/cron/status.js
import supabase from '@/utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {    // Check database connectivity
    const startTime = Date.now();
    
    // Use projects table which exists in the database
    const { data, error } = await supabase
      .from('projects')
      .select('projectId')
      .limit(1);

    const responseTime = Date.now() - startTime;    if (error) {
      // Fallback test with ocr_results table
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('ocr_results')
          .select('result_id')
          .limit(1);
          
        if (fallbackError) {
          return res.status(500).json({
            status: 'error',
            database: 'disconnected',
            error: fallbackError.message,
            timestamp: new Date().toISOString()
          });
        }

        return res.status(200).json({
          status: 'healthy',
          database: 'connected',
          responseTime: `${Date.now() - startTime}ms`,
          timestamp: new Date().toISOString(),
          message: 'Database is responsive (fallback method)',
        });
        
      } catch (fallbackErr) {
        return res.status(500).json({
          status: 'error',
          database: 'disconnected',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      message: 'Database is responsive',
      recordsFound: data ? data.length : 0,

    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
