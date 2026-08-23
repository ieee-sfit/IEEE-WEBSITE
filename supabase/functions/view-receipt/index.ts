// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

serve(async (req) => {
  try {
    const url = new URL(req.url);
    let receiptPath = url.searchParams.get('path');
    
    if (!receiptPath) {
      return new Response("Missing path parameter", { status: 400 });
    }

    // VS Code link clicker often includes the trailing CSV comma and next column.
    // Strip everything after the comma, as receipt paths will never contain commas.
    receiptPath = receiptPath.split(',')[0];

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate a 10-year signed URL
    const { data, error } = await supabaseAdmin
      .storage
      .from('payment_receipts')
      .createSignedUrl(receiptPath, 60 * 60 * 24 * 365 * 10);

    if (error || !data) {
      console.error('Error generating signed URL:', error);
      return new Response(`Failed to generate signed URL: ${error?.message || 'Unknown error'} for path: ${receiptPath}`, { status: 500 });
    }

    // Redirect the browser to the signed URL
    return new Response(null, {
      status: 302,
      headers: {
        'Location': data.signedUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (err: any) {
    console.error('Catch block error:', err);
    return new Response(`Internal Server Error: ${err.message}`, { status: 500 });
  }
})
