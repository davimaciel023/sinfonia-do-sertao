import { CoverflowCarousel } from "./CoverflowCarousel";
import "./MuralObservadores.css";

/* Observadores reais dos Profetas da Chuva (Ceará). Retratos extraídos de
   vídeos cedidos pelo grupo; os quadros de Silvio Ney e João Soares foram
   recortados para remover legenda e marca d'água do vídeo original. */
const OBSERVADORES = [
  {
    nome: "Seu Titico",
    subtitulo: "Francisco, 73 anos",
    papel: 'Observa a formiga-de-roça, atenta à limpeza do formigueiro, e as árvores da caatinga "chorando" para prever a chuva com até 90 dias de antecedência.',
    foto: "/images/observadores/seu-titico.jpg",
  },
  {
    nome: "Silvio Ney",
    subtitulo: "43 anos, o mais jovem do grupo",
    papel: "Observa as formigas de correição e de-asa. É quem mais leva a tradição dos Profetas da Chuva para as redes sociais.",
    foto: "/images/observadores/silvio-ney.jpg",
  },
  {
    nome: "João Soares",
    subtitulo: "Cocriador do Encontro dos Profetas",
    papel: "Um dos criadores do Encontro dos Profetas da Chuva no Ceará: já são 10 encontros no estado, 3 na Paraíba e 1 no Piauí.",
    foto: "/images/observadores/joao-soares.jpg",
  },
  {
    nome: "Erasmo Barreira",
    subtitulo: "Um dos profetas mais atuantes",
    papel: 'Observa árvores, aves, abelhas e o tatu, que só tem filhotes quando "sabe" que vai chover.',
    foto: "/images/observadores/erasmo-barreira.jpg",
  },
];

const SLIDES = OBSERVADORES.map((o) => ({
  src: o.foto,
  alt: `${o.nome}, observador da tradição Profetas da Chuva`,
  title: o.nome,
  subtitle: o.subtitulo,
  bio: o.papel,
}));

export default function MuralObservadores() {
  return (
    <section id="observadores">
      <div className="container">
        <div className="section-head is-center reveal">
          <span className="eyebrow">Mural dos Observadores</span>
          <h2>Guardiões do conhecimento ancestral do sertão</h2>
          <p>
            Homens e mulheres que dedicam suas vidas a interpretar os sinais da natureza e
            preservar tradições passadas através de gerações.
          </p>
        </div>

        <div className="mural-badge reveal card-surface">
          <strong>Regra da tradição:</strong> para ser reconhecido como profeta, é preciso
          ter um padrinho: alguém que já observa e que apadrinha a entrada de um novo
          observador na tradição.
        </div>

        <div className="mural-carousel reveal">
          <CoverflowCarousel slides={SLIDES} showCaption showNavigation showPagination />
        </div>
      </div>
    </section>
  );
}
