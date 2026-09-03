import { SYSTEM_PROMPT } from "./_shared/systemPrompt.mjs";

// Função Netlify (Functions 2.0, streaming) que substitui o widget do
// Botpress: recebe o histórico da conversa, chama a API da Groq (gratuita,
// compatível com o formato da OpenAI) com stream:true e devolve para o
// navegador só o texto puro da resposta, em pedaços, conforme vai chegando.
// A chave da API nunca sai do servidor.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
const MAX_TOKENS = 600;
const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;

const FALLBACK_MESSAGE =
  "Desculpa, tive um problema para responder agora. Pode tentar de novo em instantes?";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[bot-lango] GROQ_API_KEY não configurada nas variáveis de ambiente.");
    return textStreamResponse(FALLBACK_MESSAGE);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  const incoming = Array.isArray(payload?.messages) ? payload.messages : [];
  const messages = incoming
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return new Response("Nenhuma mensagem do usuário", { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_completion_tokens: MAX_TOKENS,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });
  } catch (err) {
    console.error("[bot-lango] Falha de rede ao chamar a API da Groq:", err);
    return textStreamResponse(FALLBACK_MESSAGE);
  }

  if (!upstream.ok || !upstream.body) {
    const errBody = await safeText(upstream);
    console.error("[bot-lango] Resposta não-OK da API da Groq:", upstream.status, errBody);
    return textStreamResponse(FALLBACK_MESSAGE);
  }

  return new Response(upstream.body.pipeThrough(sseToTextStream()), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache",
    },
  });
};

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function textStreamResponse(text) {
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

// Converte o SSE da Groq (formato compatível com a OpenAI: blocos
// "data: {...}\n\n", terminando em "data: [DONE]") em um fluxo de texto
// puro — só o conteúdo de choices[0].delta.content — para o front-end não
// precisar entender o formato de eventos.
function sseToTextStream() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const text = extractText(part);
        if (text) controller.enqueue(encoder.encode(text));
      }
    },
    flush(controller) {
      if (buffer) {
        const text = extractText(buffer);
        if (text) controller.enqueue(encoder.encode(text));
      }
    },
  });
}

function extractText(eventBlock) {
  const dataLine = eventBlock.split("\n").find((line) => line.startsWith("data:"));
  if (!dataLine) return "";

  const raw = dataLine.slice(5).trim();
  if (!raw || raw === "[DONE]") return "";

  try {
    const data = JSON.parse(raw);
    return data.choices?.[0]?.delta?.content || "";
  } catch {
    // fragmento incompleto; ignora e segue
  }
  return "";
}
