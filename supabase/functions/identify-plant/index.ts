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
    const { image, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!image) {
      throw new Error("Image is required");
    }

    console.log("Plant identification request, mode:", mode);

    const modePrompts: Record<string, string> = {
      plant: `Ikaw ay isang plant identification expert. Suriin ang larawan at i-identify ang halaman.
      
Ibigay ang sumusunod na impormasyon sa JSON format:
{
  "name": "Common name ng halaman",
  "scientificName": "Scientific name",
  "commonNames": ["Iba pang pangalan", "Tagalog name kung meron"],
  "confidence": 0.95,
  "description": "Maikling paglalarawan ng halaman sa Tagalog (2-3 sentences)",
  "careGuide": {
    "water": "Pag-aalaga sa tubig",
    "sunlight": "Pangangailangan ng araw",
    "soil": "Uri ng lupa",
    "temperature": "Temperature range",
    "tips": ["Tip 1 sa Tagalog", "Tip 2 sa Tagalog"]
  },
  "poisonous": false,
  "edible": true,
  "category": "plant"
}

Kung hindi halaman ang nasa larawan, ibalik:
{
  "name": "Hindi Halaman",
  "scientificName": "N/A",
  "commonNames": [],
  "confidence": 0,
  "description": "Hindi ko makita ang halaman sa larawan. Subukan ulit ng malinaw na picture ng halaman.",
  "careGuide": null,
  "poisonous": false,
  "edible": false,
  "category": "unknown"
}`,

      mushroom: `Ikaw ay isang mushroom identification expert. Suriin ang larawan at i-identify ang kabute.

MAHALAGA: Palaging mag-ingat pagdating sa mga kabute dahil marami ang may lason!

Ibigay ang sumusunod na impormasyon sa JSON format:
{
  "name": "Common name ng kabute",
  "scientificName": "Scientific name",
  "commonNames": ["Iba pang pangalan"],
  "confidence": 0.85,
  "description": "Paglalarawan ng kabute sa Tagalog",
  "careGuide": null,
  "poisonous": true/false,
  "edible": true/false,
  "toxicityLevel": "none/mild/moderate/severe/deadly",
  "warningMessage": "Kung may lason - warning message sa Tagalog",
  "category": "mushroom"
}`,

      weed: `Ikaw ay isang weed identification expert. Suriin ang larawan at i-identify ang damo/weed.

Ibigay ang sumusunod na impormasyon sa JSON format:
{
  "name": "Common name ng damo",
  "scientificName": "Scientific name",
  "commonNames": ["Iba pang pangalan sa Tagalog"],
  "confidence": 0.85,
  "description": "Paglalarawan ng damo sa Tagalog",
  "careGuide": {
    "removal": "Paano tanggalin",
    "prevention": "Paano maiwasan",
    "tips": ["Tip 1", "Tip 2"]
  },
  "poisonous": false,
  "edible": false,
  "invasive": true/false,
  "category": "weed"
}`,

      disease: `Ikaw ay isang plant disease identification expert. Suriin ang larawan at i-identify ang sakit ng halaman.

Ibigay ang sumusunod na impormasyon sa JSON format:
{
  "name": "Pangalan ng sakit",
  "scientificName": "Scientific name kung meron",
  "commonNames": ["Iba pang pangalan"],
  "confidence": 0.80,
  "description": "Paglalarawan ng sakit sa Tagalog",
  "careGuide": {
    "symptoms": ["Sintomas 1", "Sintomas 2"],
    "causes": "Sanhi ng sakit",
    "treatment": "Paano gamutin",
    "prevention": "Paano maiwasan",
    "tips": ["Tip 1", "Tip 2"]
  },
  "poisonous": false,
  "severity": "mild/moderate/severe",
  "category": "disease"
}`
    };

    const systemPrompt = modePrompts[mode] || modePrompts.plant;

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
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "I-identify ang halaman o object sa larawang ito. Ibalik ang sagot sa JSON format lang, walang iba."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response:", content);

    // Parse JSON from response (handle markdown code blocks)
    let jsonContent = content;
    if (content.includes("```json")) {
      jsonContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (content.includes("```")) {
      jsonContent = content.replace(/```\n?/g, "");
    }
    
    const result = JSON.parse(jsonContent.trim());

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Plant identification error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      name: "Error sa Identification",
      scientificName: "N/A",
      commonNames: [],
      confidence: 0,
      description: "May problema sa identification. Subukan ulit.",
      careGuide: null,
      poisonous: false,
      category: "unknown"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
