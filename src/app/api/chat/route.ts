import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages, language } = await req.json();
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GROQ_API_KEY or OPENAI_API_KEY" }, { status: 500 });
  }

  const isGroq = apiKey.startsWith("gsk_");
  const apiUrl = isGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = isGroq ? "openai/gpt-oss-120b" : "gpt-4o-mini";

  let systemPrompt = 
    "You are Tenadam AI, a comprehensive, warm, supportive, and empathetic health and Tenadam assistant. " +
    "You must answer all health-related questions accurately and thoroughly, including general health, physical health, common illnesses, medical symptoms, Tenadam, stress management, burnout, nutrition, and fitness. " +
    "Be supportive, non-judgmental, and culturally sensitive. Keep responses concise but highly informative and actionable. " +
    "If someone is in crisis, always recommend professional help and provide emergency resources.";

  if (language === "am") {
    systemPrompt += " Respond in Amharic. Incorporate references to traditional Ethiopian Tenadam practices, such as the social support and mindfulness of the coffee ceremony ('Bunna Pirogram'), community-based support groups like 'Debo' or 'Equb', and traditional soothing elements like the Tenadam herb (Ruta chalepensis) for headache and stress relief.";
  } else if (language === "om") {
    systemPrompt += " Respond in Afaan Oromoo. Incorporate references to Oromo and Ethiopian traditional Tenadam practices, including community networks, coffee ceremonies, and traditional calming remedies like Tenadam.";
  } else if (language === "ti") {
    systemPrompt += " Respond in Tigrigna. Incorporate references to Tigrayan and Ethiopian traditional Tenadam practices, community support circles, coffee gathering mindfulness, and soothing herbs like Tenadam.";
  } else {
    systemPrompt += " Respond in English. Incorporate references to Ethiopian and African traditional Tenadam practices (e.g., the mindfulness and bonding of the traditional Coffee Ceremony, community support mechanisms like Equb or Debo, and the historical use of Tenadam as a calming herbal remedy for stress and tension relief).";
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
        temperature: 0.95,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API error:", response.status, errorData);

      // Try Gemini fallback if configured
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          console.log("OpenAI API error occurred. Attempting fallback to Gemini...");
          const geminiMessages = messages.map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          }));

          const geminiBody = {
            contents: geminiMessages,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            }
          };

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
          const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiBody)
          });

          if (geminiResponse.ok) {
            const result = await geminiResponse.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
            
            const encoder = new TextEncoder();
            const customStream = new ReadableStream({
              start(controller) {
                const sseChunk = `data: ${JSON.stringify({
                  choices: [{ delta: { content: text } }]
                })}\n\n`;
                controller.enqueue(encoder.encode(sseChunk));
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
              }
            });

            return new NextResponse(customStream, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
              }
            });
          } else {
            console.error("Gemini fallback response failed with status:", geminiResponse.status);
          }
        } catch (geminiErr) {
          console.error("Gemini fallback exception occurred:", geminiErr);
        }
      }

      return NextResponse.json(
        { error: `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}` },
        { status: response.status }
      );
    }

    // Stream directly back to client since client parses standard OpenAI SSE stream format
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("OpenAI request failed:", err);
    return NextResponse.json(
      { error: `Request failed: ${err}` },
      { status: 500 }
    );
  }
}
