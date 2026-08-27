/* Ícones de linha, desenhados à mão para o Memorial — não usar libs de
   ícone genéricas aqui, é parte da identidade visual do projeto. */
const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconNinho(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M8 26c0-8 6-14 12-14s12 6 12 14" />
      <ellipse cx="20" cy="27" rx="13" ry="4.5" />
      <circle cx="20" cy="14" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTatu(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M6 22c2-6 8-10 14-10s12 4 14 10" />
      <path d="M9 22h22M11 25h18M13 28h14" />
      <circle cx="8" cy="19" r="2.2" />
    </svg>
  );
}

export function IconRa(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <ellipse cx="20" cy="24" rx="11" ry="8" />
      <circle cx="14" cy="16" r="3" />
      <circle cx="26" cy="16" r="3" />
      <circle cx="14" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="26" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconLagarta(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M8 28c2-14 6-18 16-18" strokeDasharray="0" />
      <circle cx="10" cy="27" r="2.6" />
      <circle cx="16" cy="22" r="2.6" />
      <circle cx="21" cy="16" r="2.6" />
      <circle cx="25" cy="11" r="2.6" />
    </svg>
  );
}

export function IconArvore(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M20 34V18" />
      <path d="M20 20c-4-2-8-1-10 3M20 16c4-2 8-1 10 3M20 24c-3-1-6 0-8 3" />
    </svg>
  );
}

export function IconMilho(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <ellipse cx="20" cy="21" rx="7" ry="13" />
      <path d="M15 12v18M20 8v26M25 12v18" strokeWidth="1" />
    </svg>
  );
}

export function IconFogueira(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M20 8c3 6-2 8 0 12 2-2 4-1 4 2 0 5-4 9-9 9s-9-4-8-9c1 2 3 2 4 0-3-4 0-9 4-11-1 3 1 4 2 2 1-2 0-3.5-1-5Z" />
      <path d="M8 32h24" />
    </svg>
  );
}

export function IconLua(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M25 8a14 14 0 1 0 0 24 11 11 0 0 1 0-24Z" />
    </svg>
  );
}

export function IconVento(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M6 14h18a4 4 0 1 0-4-4" />
      <path d="M6 22h22a4 4 0 1 1-4 4" />
      <path d="M6 30h14a3 3 0 1 0-3-3" />
    </svg>
  );
}

export function IconLagoa(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <circle cx="20" cy="14" r="6" />
      <path d="M6 26c3-2 6-2 9 0s6 2 9 0 6-2 9 0" />
      <path d="M6 31c3-2 6-2 9 0s6 2 9 0 6-2 9 0" />
    </svg>
  );
}

export function IconSal(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M20 6 27 20 20 34 13 20Z" />
      <path d="M13 20h14" />
    </svg>
  );
}

export function IconGota(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M20 6c6 8 11 14.5 11 20a11 11 0 1 1-22 0c0-5.5 5-12 11-20Z" />
      <path d="M13 27c0 3 2.5 5.2 5.5 5.4" strokeWidth="1" />
    </svg>
  );
}

export function IconNuvem(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M12 27a6.5 6.5 0 0 1-1-12.9A8 8 0 0 1 26.3 12 6.5 6.5 0 0 1 27 27H12Z" />
    </svg>
  );
}

export function IconFolha(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M9 31C7 17 18 8 32 8c1 14-8 25-22 23Z" />
      <path d="M9 31c5-8 10-13 20-19" strokeWidth="1" />
    </svg>
  );
}

export function IconPassaro(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M7 22c4 1 7-.5 8.5-3.5C17 15 21 13 27 14c-1.5 1-2 2-2 3.5 3 .5 5.5 2 6.5 4.5-2-.5-3.5-.3-4.5.5.5 4-2 8-8 9-5 .8-9.5-1-11.5-4.5 2 .5 4 .3 5.5-1-3 0-5-1.5-6-4Z" />
    </svg>
  );
}

export function IconEstrela(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M20 6 23.5 16.5 34 20 23.5 23.5 20 34 16.5 23.5 6 20 16.5 16.5Z" />
    </svg>
  );
}

export function IconObservador(props) {
  return (
    <svg viewBox="0 0 40 40" {...common} {...props}>
      <path d="M11 17c-3 1-5 2.5-5 4.5h28c0-2-2-3.5-5-4.5" />
      <path d="M11 17c1-5 4-8 9-8s8 3 9 8" />
      <circle cx="20" cy="21" r="6" />
      <path d="M13 34c1-5 4-8 7-8s6 3 7 8" />
    </svg>
  );
}
