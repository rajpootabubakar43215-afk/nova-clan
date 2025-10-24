import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reporterUsername, reportedPlayer, reason, description } = await req.json();
    
    console.log('Received report:', { reporterUsername, reportedPlayer, reason });

    const webhookUrl = 'https://discord.com/api/webhooks/1427338349592580167/jFmm795uotMFuMuo09HkD9S6SQlEF3bNBxhU0DrqIwfnVEk4DT_3GcctkjBJCEMFI_F8';
    
    const embed = {
      title: "🚨 New Player Report",
      color: 0xFF0000,
      fields: [
        {
          name: "Reporter",
          value: reporterUsername,
          inline: true
        },
        {
          name: "Reported Player",
          value: reportedPlayer,
          inline: true
        },
        {
          name: "Reason",
          value: reason,
          inline: false
        },
        {
          name: "Description",
          value: description,
          inline: false
        },
        {
          name: "Time",
          value: new Date().toLocaleString(),
          inline: false
        }
      ],
      footer: {
        text: "NovaX | Clan Report System"
      }
    };

    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!discordResponse.ok) {
      throw new Error('Failed to send Discord webhook');
    }

    console.log('Report sent to Discord successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Report submitted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});