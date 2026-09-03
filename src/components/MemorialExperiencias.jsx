import { useRef, useState } from "react";
import gsap from "gsap";
import {
  IconNinho,
  IconTatu,
  IconRa,
  IconLagarta,
  IconArvore,
  IconMilho,
  IconFogueira,
  IconLua,
  IconVento,
  IconLagoa,
  IconSal,
} from "./icons";
import "./MemorialExperiencias.css";

/* As frases entre aspas são ditados originais, escritos no estilo dos
   provérbios do sertão para ilustrar cada sinal — não são citações
   verificadas de uma pessoa real. Fotos: Wikimedia Commons (CC), escolhidas
   por referenciarem o tema de cada sinal — não são registros do grupo real
   de observadores. */
const LOCAL_IMG = "/images/observador-do-ceu.jpg";

const CATEGORIAS = [
  {
    id: "fauna",
    label: "Fauna",
    itens: [
      { Icon: IconNinho, img: LOCAL_IMG, titulo: "João-de-barro", texto: "A porta do ninho voltada para o nascente é lida como sinal de chuva a caminho.", frase: "Porta virada pro nascente, chuva não é mais segredo." },
      { Icon: IconTatu, img: LOCAL_IMG, titulo: "Gravidez do tatu", texto: "O estado da fêmea do tatu é observado como indicativo do que vem pela frente no ano agrícola.", frase: "Tatu prenhe no toco, ano de fartura no roço." },
      { Icon: IconRa, img: LOCAL_IMG, titulo: "Coaxar da rã", texto: "A intensidade e o momento do coaxar são acompanhados como parte da leitura da estação.", frase: "Rã cantando forte à noite, é sinal de água por perto." },
      { Icon: IconLagarta, img: LOCAL_IMG, titulo: "Lagarta na parede", texto: "O aparecimento da lagarta subindo pela parede entra no conjunto de sinais observados em casa.", frase: "Lagarta subindo a parede, inverno vem antes do esperado." },
    ],
  },
  {
    id: "flora",
    label: "Flora",
    itens: [
      { Icon: IconArvore, img: LOCAL_IMG, titulo: "Observação das árvores", texto: "Brotação, floração e queda de folhas em espécies do sertão são acompanhadas ano a ano.", frase: "Árvore que brota cedo, chuva não demora." },
      { Icon: IconMilho, img: LOCAL_IMG, titulo: 'Sinal do "Milho de Cobra"', texto: "Uma marca observada no roçado que os profetas associam a um aviso sobre a safra.", frase: "Marca no milho, aviso silencioso do roçado." },
    ],
  },
  {
    id: "fenomenos",
    label: "Fenômenos e Rituais",
    itens: [
      { Icon: IconFogueira, img: LOCAL_IMG, titulo: "Fogueira de Janeiro", texto: "A direção da fumaça ao amanhecer é um dos sinais mais tradicionais da leitura do ano.", frase: "Fumaça pro norte, sinal de inverno forte." },
      { Icon: IconLua, img: LOCAL_IMG, titulo: "Lua cheia", texto: "O comportamento do céu na lua cheia integra o conjunto de observações astronômicas.", frase: "Lua cheia limpa, tempo bom se anuncia." },
      { Icon: IconVento, img: LOCAL_IMG, titulo: "Vento do Aracati", texto: "A chegada e a intensidade do vento característico da região são acompanhadas de perto.", frase: "Vento do Aracati, o sertão sabe que ele já vem." },
      { Icon: IconLagoa, img: LOCAL_IMG, titulo: '"Lagoa do Sol"', texto: "Um fenômeno visual observado no céu, associado por tradição a mudanças no tempo.", frase: "Quando a lagoa aparece no céu, o tempo está mudando." },
      { Icon: IconSal, img: LOCAL_IMG, titulo: "Experiência de Santa Luzia", texto: "Em 13 de dezembro, pedras de sal são dispostas e observadas nos dias seguintes como previsão para o ano.", frase: "Pedra úmida em Santa Luzia, mês de chuva garantida." },
    ],
  },
];

const TODOS = { id: "todos", label: "Todos" };

export default function MemorialExperiencias() {
  const [active, setActive] = useState("todos");
  const [selectedItem, setSelectedItem] = useState(null);
  const gridRef = useRef(null);

  function changeTab(id) {
    if (id === active) return;
    const grid = gridRef.current;
    if (grid) {
      gsap.fromTo(grid, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    }
    setActive(id);
  }

  const itens =
    active === "todos"
      ? CATEGORIAS.flatMap((c) => c.itens.map((it) => ({ ...it, categoria: c.label })))
      : CATEGORIAS.find((c) => c.id === active).itens.map((it) => ({
          ...it,
          categoria: CATEGORIAS.find((c) => c.id === active).label,
        }));

  return (
    <section id="memorial">
      <div className="container">
        <div className="section-head is-center reveal">
          <span className="eyebrow">Memorial das Experiências</span>
          <h2>Técnicas de Observação</h2>
          <p>
            Métodos tradicionais de leitura dos sinais da natureza, transmitidos oralmente
            através de gerações no sertão nordestino, organizados por categoria, prontos
            para consulta e para alimentar o assistente virtual.
          </p>
        </div>

        <div className="memorial-tabs reveal">
          {[TODOS, ...CATEGORIAS].map((c) => (
            <button
              key={c.id}
              className={`memorial-tab ${active === c.id ? "is-active" : ""}`}
              onClick={() => changeTab(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="memorial-grid" ref={gridRef}>
          {itens.map(({ Icon, img, titulo, texto, frase, categoria }) => (
            <article
              className="memorial-card card-surface"
              key={titulo}
              role="button"
              tabIndex={0}
              aria-label={`Abrir detalhes sobre ${titulo}`}
              onClick={() => setSelectedItem({ titulo, texto, frase, categoria })}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedItem({ titulo, texto, frase, categoria });
                }
              }}
            >
              <div className="memorial-card__media media-frame">
                <span className="tag-chip">{categoria}</span>
                <img src={img} alt={titulo} loading="lazy" />
                <span className="memorial-card__icon-badge">
                  <Icon width="18" height="18" />
                </span>
              </div>
              <div className="memorial-card__body">
                <h3>{titulo}</h3>
                <p>{texto}</p>
                <p className="quote-line">"{frase}"</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      {selectedItem && (
        <div className="memorial-dialog-backdrop" role="presentation" onClick={() => setSelectedItem(null)}>
          <div className="memorial-dialog card-surface" role="dialog" aria-modal="true" aria-labelledby="memorial-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button className="memorial-dialog__close" type="button" aria-label="Fechar detalhes" onClick={() => setSelectedItem(null)}>×</button>
            <span className="eyebrow">{selectedItem.categoria}</span>
            <h3 id="memorial-dialog-title">{selectedItem.titulo}</h3>
            <p>{selectedItem.texto}</p>
            <p className="quote-line">"{selectedItem.frase}"</p>
          </div>
        </div>
      )}
    </section>
  );
}
