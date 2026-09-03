import { useRef, useState } from "react";

const ENDPOINT = "/api/chat";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Estado + streaming da conversa do Bot Lango.
 *
 * O texto vai chegando aos poucos direto da resposta HTTP (a função Netlify
 * já entrega só o texto puro, sem envelope de SSE) — por isso os "3
 * pontinhos" de digitação somem exatamente no instante em que o primeiro
 * pedaço de texto chega, nunca antes. Não há como o indicador sumir sem a
 * resposta aparecer, que era o bug do Botpress.
 */
export function useBotLangoChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const controllerRef = useRef(null);

  async function sendMessage(rawText) {
    const text = rawText.trim();
    if (!text || isStreaming) return;

    const history = messagesRef.current
      .filter((m) => !m.pending)
      .map((m) => ({ role: m.role, content: m.text }));

    const userMsg = { id: uid(), role: "user", text };
    const assistantId = uid();

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", text: "", pending: true },
    ]);
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    let gotAnyText = false;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: text }] }),
        signal: controller.signal,
      });

      if (!res.body) throw new Error("no_stream");
      if (!res.ok && res.status !== 200) throw new Error("bad_status");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        gotAnyText = true;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + chunk, pending: false } : m))
        );
      }

      if (!gotAnyText) throw new Error("empty_response");
    } catch (err) {
      if (err?.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                text: "Desculpa, tive um problema para responder agora. Pode tentar de novo em instantes?",
                pending: false,
                isError: true,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }

  function stop() {
    controllerRef.current?.abort();
  }

  return { messages, isStreaming, sendMessage, stop };
}
