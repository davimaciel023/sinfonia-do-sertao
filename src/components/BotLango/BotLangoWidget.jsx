import { useEffect, useRef, useState } from "react";
import { STARTERS } from "./starters";
import { useBotLangoChat } from "./useBotLangoChat";
import { IconSparkle, IconClose, IconSend, IconSmile, IconMic } from "./icons";
import "./BotLangoWidget.css";

const AVATAR_SRC = "/images/bot-lango-avatar.png";

// Emojis rápidos pro campo de mensagem — mistura de expressões comuns com
// alguns temáticos (chuva/natureza), sem depender de nenhuma lib externa.
const QUICK_EMOJIS = [
  "😀", "😊", "🙂", "😅", "🤔", "👍", "🙏", "👏",
  "❤️", "🎉", "☀️", "⛅", "🌧️", "🌦️", "🌪️", "🌱",
  "🌾", "🦎", "🐦", "🌙", "💬", "❓", "✅", "🙌",
];

/**
 * Widget flutuante do Bot Lango — reconstrução em React do webchat que
 * antes rodava no Botpress, mantendo a mesma estética (cor #371F14, tema
 * claro, cabeçalho "vidro", tela de boas-vindas com card + starters em
 * grade) só que com um backend próprio (função Netlify + API da Groq)
 * respondendo em streaming de verdade — o indicador de "digitando" só some
 * quando o texto realmente começa a chegar.
 */
export default function BotLangoWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micNotice, setMicNotice] = useState("");
  const { messages, isStreaming, sendMessage } = useBotLangoChat();
  const threadRef = useRef(null);
  const inputRef = useRef(null);
  const emojiWrapRef = useRef(null);
  const recognitionRef = useRef(null);
  const micNoticeTimerRef = useRef(null);

  const started = messages.length > 0;

  // Compatibilidade com o botão "Conversar com o Bot Calango" da landing
  // page (dispara um CustomEvent) e com qualquer outro trecho que queira
  // abrir o widget programaticamente, como antes era feito via
  // window.botpress.open().
  useEffect(() => {
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("botlango:open", onOpenEvent);
    window.botLango = {
      open: () => setOpen(true),
      close: () => setOpen(false),
      toggle: () => setOpen((v) => !v),
    };
    return () => window.removeEventListener("botlango:open", onOpenEvent);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 220);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Fecha o seletor de emojis ao clicar fora dele.
  useEffect(() => {
    if (!emojiOpen) return;
    function onDocClick(e) {
      if (emojiWrapRef.current && !emojiWrapRef.current.contains(e.target)) {
        setEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [emojiOpen]);

  // Para o reconhecimento de voz se o widget fechar no meio do ditado.
  useEffect(() => {
    if (!open && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [open]);

  function submitDraft() {
    if (!draft.trim() || isStreaming) return;
    sendMessage(draft);
    setDraft("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitDraft();
  }

  // Envio também pelo Enter (sem Shift) — Shift+Enter é reservado para
  // quebra de linha, caso o campo vire um textarea no futuro.
  function handleInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitDraft();
    }
  }

  function handleStarter(prompt) {
    if (isStreaming) return;
    sendMessage(prompt);
  }

  function handleEmojiPick(emoji) {
    setDraft((d) => d + emoji);
    inputRef.current?.focus();
  }

  function showMicNotice(text) {
    setMicNotice(text);
    clearTimeout(micNoticeTimerRef.current);
    micNoticeTimerRef.current = setTimeout(() => setMicNotice(""), 3200);
  }

  // Ditado por voz via Web Speech API (nativa do navegador, sem lib nem
  // servidor). Alguns navegadores (ex.: Brave, com proteções de privacidade
  // ligadas) não implementam ou bloqueiam isso — nesse caso avisamos em vez
  // de falhar silenciosamente.
  function toggleMic() {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showMicNotice("Ditado por voz não é suportado neste navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setDraft((d) => (d ? `${d} ${transcript}` : transcript));
      }
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        showMicNotice("Permita o microfone no navegador para ditar a mensagem.");
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        showMicNotice("Não deu pra entender o áudio. Tenta de novo?");
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  return (
    <div className="botlango">
      <button
        type="button"
        className={`botlango__toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar o chat do Bot Lango" : "Abrir o chat do Bot Lango"}
        aria-expanded={open}
      >
        <img src={AVATAR_SRC} alt="" />
      </button>

      <section
        className={`botlango__panel ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Bot Lango"
        aria-hidden={!open}
      >
        <header className="botlango__header">
          <img className="botlango__header-avatar" src={AVATAR_SRC} alt="" />
          <div className="botlango__header-text">
            <strong>Bot Lango</strong>
            <span>desenvolvido por estudantes do IFCE Boa Viagem – ADS 2025.1</span>
          </div>
          <button
            type="button"
            className="botlango__close"
            onClick={() => setOpen(false)}
            aria-label="Fechar o chat"
          >
            <IconClose width="18" height="18" />
          </button>
        </header>

        {!started ? (
          <div className="botlango__home">
            <h2>Faça uma pergunta</h2>
            <p className="botlango__subtitle">O Lango e nossa equipe estão por aqui</p>

            <button
              type="button"
              className="botlango__maincard"
              onClick={() => inputRef.current?.focus()}
            >
              <span className="botlango__maincard-text">
                <strong>Alguma dúvida?</strong>
                <em>Fale com o Lango</em>
              </span>
              <img className="botlango__maincard-icon" src={AVATAR_SRC} alt="" />
            </button>

            <div className="botlango__starters">
              {STARTERS.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className="botlango__starter"
                  onClick={() => handleStarter(s.prompt)}
                >
                  <span className="botlango__starter-icon">
                    <IconSparkle width="15" height="15" />
                  </span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="botlango__thread" ref={threadRef}>
            {messages.map((m, i) => {
              const next = messages[i + 1];
              const isGroupEnd = !next || next.role !== m.role;
              const isAssistant = m.role === "assistant";
              return (
                <div key={m.id} className={`botlango__row botlango__row--${m.role}`}>
                  {isAssistant && (
                    <img
                      className={`botlango__row-avatar ${isGroupEnd ? "" : "botlango__row-avatar--spacer"}`}
                      src={AVATAR_SRC}
                      alt=""
                    />
                  )}
                  <div className="botlango__bubble-col">
                    <div
                      className={`botlango__bubble botlango__bubble--${m.role} ${m.isError ? "is-error" : ""}`}
                    >
                      {m.pending ? (
                        <span className="botlango__typing" aria-label="Bot Lango está digitando">
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        m.text
                      )}
                    </div>
                    {!isAssistant && isGroupEnd && !m.pending && (
                      <span className="botlango__delivered">Entregue</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {micNotice && <div className="botlango__notice">{micNotice}</div>}

        <form className="botlango__composer" onSubmit={handleSubmit}>
          <div className="botlango__emoji-wrap" ref={emojiWrapRef}>
            <button
              type="button"
              className="botlango__composer-icon botlango__composer-icon--btn"
              onClick={() => setEmojiOpen((v) => !v)}
              aria-label="Inserir emoji"
              aria-expanded={emojiOpen}
            >
              <IconSmile width="18" height="18" />
            </button>
            {emojiOpen && (
              <div className="botlango__emoji-picker" role="menu">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    className="botlango__emoji-option"
                    onClick={() => handleEmojiPick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Digite sua mensagem..."
            aria-label="Digite sua mensagem"
          />

          {draft.trim() ? (
            <button
              type="submit"
              className="botlango__composer-send"
              disabled={isStreaming}
              aria-label="Enviar mensagem"
            >
              <IconSend width="16" height="16" />
            </button>
          ) : (
            <button
              type="button"
              className={`botlango__composer-icon botlango__composer-icon--btn ${isListening ? "is-listening" : ""}`}
              onClick={toggleMic}
              aria-label={isListening ? "Parar ditado por voz" : "Ditar mensagem por voz"}
              aria-pressed={isListening}
            >
              <IconMic width="18" height="18" />
            </button>
          )}
        </form>

        <div className="botlango__footer">⚡ Bot Lango · IFCE Boa Viagem</div>
      </section>
    </div>
  );
}
