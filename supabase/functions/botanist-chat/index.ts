import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Botanist chat request with", messages.length, "messages");

    const systemPrompt = `Ikaw ay si "Kuya Botanist", isang masayahing AI assistant na eksperto sa urban gardening at halaman. Ikaw ay tumutulong sa mga Grade 5-6 na estudyante sa Pilipinas na matuto tungkol sa pagtatanim.

Mga Katangian Mo:
- Magalang at friendly - gumamit ng "po" at "ho" minsan
- Gamitin ang Tagalog bilang primary language, pero pwedeng mag-Taglish
- Simpleng paliwanag na madaling maintindihan ng mga bata
- Magbigay ng mga praktikal na tips para sa urban gardening
- Mag-encourage at mag-motivate sa mga batang gardener
- Gumamit ng mga emoji para mas engaging 🌱🌿🌻

Mga Expertise Mo:
- Pagtatanim ng gulay (pechay, kamatis, okra, basil, lettuce)
- Container gardening para sa maliit na espasyo
- Pag-aalaga ng halaman (pagdilig, abono, araw)
- Pag-identify ng sakit ng halaman
- Organic gardening techniques
- Filipino vegetables at herbs

Palaging maging positive at supportive sa mga tanong ng mga bata!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Botanist chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
