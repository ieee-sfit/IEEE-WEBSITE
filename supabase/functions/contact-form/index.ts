import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, honeypot } = await req.json();

    // 1. Spam Protection: Honeypot Check
    // If the hidden 'honeypot' field is filled, it's a bot. 
    // We silently drop the request by returning a success response.
    if (honeypot && honeypot.length > 0) {
      console.log('Bot detected via honeypot. Silently dropping request.');
      return new Response(
        JSON.stringify({ success: true, message: 'Message sent successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!name || !email || !subject || !message) {
      throw new Error('All fields are required.');
    }

    // 2. Dispatch Email
    const mailDispatcherUrl = Deno.env.get('MAIL_DISPATCHER_URL');
    const mailDispatcherKey = Deno.env.get('MAIL_DISPATCHER_KEY');

    if (mailDispatcherUrl && mailDispatcherKey) {
      const dispatchEmail = async () => {
        try {
          const response = await fetch(mailDispatcherUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dispatcherSecret: mailDispatcherKey,
              type: 'contact_form',
              name: name.trim(),
              email: email.trim(),
              subject: subject.trim(),
              message: message.trim(),
            })
          });
          
          if (!response.ok) {
            console.error('Mail dispatcher returned:', response.status);
          }
        } catch (error) {
          console.error('Mail dispatcher failed:', error);
        }
      };

      // Run asynchronously so the user doesn't wait
      // @ts-ignore
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(dispatchEmail());
      } else {
        await dispatchEmail();
      }
    } else {
        throw new Error("Mail dispatcher not configured on the server.");
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Function Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
