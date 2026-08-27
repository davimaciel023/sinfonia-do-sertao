import { IconGota, IconNuvem, IconFolha, IconPassaro, IconEstrela } from "./icons";
import "./Historia.css";

const PILARES = [
  {
    Icon: IconGota,
    titulo: "Tradição Ancestral",
    texto: "Conhecimentos passados de geração em geração, através da observação atenta e da palavra falada.",
  },
  {
    Icon: IconNuvem,
    titulo: "Previsão Natural",
    texto: "Métodos tradicionais de leitura dos sinais do céu, dos bichos e das plantas do sertão.",
  },
  {
    Icon: IconFolha,
    titulo: "Preservação Cultural",
    texto: "Valorização e registro dos saberes populares do sertão cearense antes que se percam.",
  },
  {
    Icon: IconPassaro,
    titulo: "Conexão com a Natureza",
    texto: "Interpretação dos sinais naturais a serviço da agricultura familiar e da vida no sertão.",
  },
];

/* TODO: substituir pelos números reais do projeto (documentados junto ao
   grupo de observadores) — os valores abaixo são ilustrativos. */
const NUMEROS = [
  { Icon: IconEstrela, valor: "150+", label: "Anos de Tradição" },
  { Icon: IconNuvem, valor: "30+", label: "Sinais Documentados" },
  { Icon: IconPassaro, valor: "12", label: "Observadores da Rede" },
  { Icon: IconFolha, valor: "8+", label: "Comunidades Envolvidas" },
];

export default function Historia() {
  return (
    <section id="historia">
      <div className="container">
        <div className="section-head is-center reveal">
          <span className="eyebrow">A História</span>
          <h2>Sobre os Observadores do Sertão</h2>
          <p>
            Os observadores da natureza são guardiões de um conhecimento ancestral único do
            sertão cearense. Através da leitura atenta dos sinais naturais (comportamento de
            animais, mudanças nas plantas, movimentos do céu e dos ventos), eles preveem com
            atenção a chegada das chuvas e orientam o plantio de famílias agricultoras.
          </p>
        </div>

        <div className="pilares-grid">
          {PILARES.map(({ Icon, titulo, texto }) => (
            <article className="pilar-card card-surface reveal" key={titulo}>
              <div className="pilar-card__icon">
                <Icon width="26" height="26" />
              </div>
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="importancia section-alt">
        <div className="container importancia-grid">
          <div className="importancia-copy reveal">
            <span className="eyebrow">Importância Cultural</span>
            <h2>Preservação de um saber que corre risco de se perder</h2>
            <p>
              Preservar esses saberes é fundamental para manter viva a identidade cultural
              nordestina e garantir que as próximas gerações tenham acesso a esse patrimônio
              imaterial.
            </p>
            <p>
              Este projeto documenta e valoriza o conhecimento tradicional de previsão climática
              do sertão. Cada observador carrega décadas de experiência, aprendizado oral e
              conexão profunda com o meio ambiente.
            </p>
          </div>

          <div className="numeros-grid reveal">
            {NUMEROS.map(({ Icon, valor, label }) => (
              <div className="numero-card" key={label}>
                <Icon width="22" height="22" />
                <strong>{valor}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
