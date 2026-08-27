import MagneticButton from "./MagneticButton";
import "./CalendarioEventos.css";

const AGENDA = [
  { data: "2º sábado de janeiro", titulo: "Encontro Anual dos Profetas", local: "Quixadá, CE" },
  { data: "Dezembro", titulo: "Experiência de Santa Luzia (sal)", local: "Comunidades do sertão" },
  { data: "Ao longo do ano", titulo: "Jardim dos Profetas: rodas de observação", local: "Definido a cada edição" },
  { data: "Ao longo do ano", titulo: "Palestras e vivências abertas ao público", local: "Definido a cada edição" },
];

const NOTICIAS = [
  { titulo: "Como foi o Encontro deste ano", resumo: "Relatos, fotos e os principais sinais observados na última edição." },
  { titulo: "Depoimentos do Jardim dos Profetas", resumo: "Observadores contam como começaram e o que aprenderam com seus padrinhos." },
  { titulo: "Registro fotográfico da fogueira de janeiro", resumo: "A leitura da fumaça ao amanhecer, edição a edição." },
];

export default function CalendarioEventos() {
  return (
    <section id="calendario">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Calendário e Eventos</span>
          <h2>O ano dos Profetas da Chuva</h2>
          <p>
            Do Encontro Anual às rodas de observação, aqui fica registrado quando e onde a
            tradição se reúne, e o que já aconteceu em cada edição.
          </p>
        </div>

        <div className="calendario-hero reveal card-surface">
          <span className="eyebrow">Encontro Anual</span>
          <h3>Segundo sábado de janeiro</h3>
          <p>Quixadá, Ceará: o principal ponto de encontro da tradição dos Profetas da Chuva.</p>
          <MagneticButton as="a" href="#chatbot" variant="accent">
            Perguntar sobre o próximo encontro
          </MagneticButton>
        </div>

        <div className="calendario-grid">
          <div className="calendario-agenda reveal">
            <h3 className="calendario-subtitle">Agenda</h3>
            <ul>
              {AGENDA.map((a) => (
                <li key={a.titulo}>
                  <span className="calendario-agenda__data">{a.data}</span>
                  <div>
                    <strong>{a.titulo}</strong>
                    <span>{a.local}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="calendario-noticias">
            <h3 className="calendario-subtitle reveal">Feed de notícias</h3>
            <div className="calendario-noticias__grid">
              {NOTICIAS.map((n) => (
                <article className="noticia-card card-surface reveal" key={n.titulo}>
                  <h4>{n.titulo}</h4>
                  <p>{n.resumo}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
