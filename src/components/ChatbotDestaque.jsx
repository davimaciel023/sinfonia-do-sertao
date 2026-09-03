import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import "./ChatbotDestaque.css";

gsap.registerPlugin(ScrollTrigger);

const CONVERSA = [
  { autor: "usuario", texto: "O que significa se o cupim não tiver asas em dezembro?" },
  { autor: "bot", texto: "Esse é um dos sinais observados pelos profetas para o começo do período chuvoso. Quer que eu explique como essa leitura costuma ser feita?" },
  { autor: "usuario", texto: "Quero. E como faço a experiência do sal de Santa Luzia?" },
  { autor: "bot", texto: "No dia 13 de dezembro, dispõe-se pedrinhas de sal identificadas por mês. Nos dias seguintes, observa-se qual delas umedeceu mais, e isso guia a leitura do ano." },
];

function openBotLango(fallback) {
  if (typeof window !== "undefined" && typeof window.botpress?.open === "function") {
    window.botpress.open();
    return;
  }
  fallback?.focus();
}

export default function ChatbotDestaque() {
  const bubblesRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState(CONVERSA);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const container = bubblesRef.current;
    if (!container) return;
    const bubbles = container.querySelectorAll(".chat-bubble");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bubbles,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.35,
          ease: "power2.out",
          scrollTrigger: { trigger: container, start: "top 70%" },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  function askCalango(event) {
    event.preventDefault();
    const text = question.trim();
    if (!text || loading) return;
    setQuestion("");
    setMessages((current) => [...current, { autor: "usuario", texto: text }]);
    setLoading(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { autor: "bot", texto: "O Calango está consultando o memorial. Observe os sinais com atenção e compare diferentes indícios antes de tirar uma conclusão." }]);
      setLoading(false);
    }, 650);
  }

  return (
    <section id="chatbot">
      <div className="container chatbot-layout">
        <div className="chatbot-copy reveal">
          <span className="eyebrow">Assistente Virtual</span>
          <h2>Converse com o Bot Calango</h2>
          <p>
            O Bot Calango é treinado com a base de conhecimento dos Profetas da Chuva:
            documentos, falas transcritas e todo o conteúdo deste portal. Ele responde
            dúvidas rápidas, orienta como fazer as experiências tradicionais e indica o que
            observar em cada época do ano.
          </p>

          <ul className="chatbot-features">
            <li>Dúvidas rápidas sobre sinais e experiências</li>
            <li>Guia de previsão mês a mês</li>
            <li>Tom acolhedor, como o de um mestre da tradição</li>
          </ul>

          <MagneticButton as="button" variant="accent" size="lg" onClick={() => openBotLango(inputRef.current)}>
            Conversar com o Bot Calango
          </MagneticButton>
        </div>

        <div className="chatbot-mock card-surface reveal">
          <div className="chatbot-mock__header">
            <span className="chatbot-mock__dot" />
            Bot Calango
          </div>
          <div className="chatbot-mock__body" ref={bubblesRef}>
            {messages.map((m, i) => (
              <div className={`chat-bubble chat-bubble--${m.autor}`} key={i}>
                {m.texto}
              </div>
            ))}
            {loading && <div className="chat-bubble chat-bubble--bot chat-bubble--loading" role="status">Calango está pensando...</div>}
          </div>
          <form className="chatbot-compose" onSubmit={askCalango}>
            <input ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Pergunte sobre um sinal..." aria-label="Pergunta para o Bot Calango" />
            <button type="submit" aria-label="Enviar pergunta">Enviar</button>
          </form>
        </div>
      </div>
    </section>
  );
}
