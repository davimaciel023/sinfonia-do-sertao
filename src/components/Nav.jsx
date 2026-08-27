import { useEffect, useState } from "react";
import { IconNuvem } from "./icons";
import "./Nav.css";

const LINKS = [
  { href: "#historia", label: "Início" },
  { href: "#observadores", label: "Observadores" },
  { href: "#memorial", label: "Observações" },
  { href: "#calendario", label: "Calendário" },
  { href: "#chatbot", label: "Assistente" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(LINKS[0].href);

  useEffect(() => {
    function onScroll() {
      setScrolled((window.scrollY || 0) > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Marca no menu em qual seção o usuário está durante o scroll — pedido
  // repetido nos testes de usabilidade (a navegação não indicava a posição
  // atual do visitante na página).
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive("#" + entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="nav">
      <div className={`nav__bar ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="nav__brand">
          <IconNuvem className="nav__brand-mark" aria-hidden="true" />
          <span className="nav__brand-text">
            <strong>Sinfonia do Sertão</strong>
            <span>Profetas da Chuva · Ceará</span>
          </span>
        </a>

        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={active === l.href ? "is-active" : ""}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#chatbot" className="btn btn--accent nav__cta">
          Fale com o Bot Calango
        </a>

        <button
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__mobile ${open ? "is-open" : ""}`}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={active === l.href ? "is-active" : ""}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <a href="#chatbot" className="btn btn--accent" onClick={() => setOpen(false)}>
          Fale com o Bot Calango
        </a>
      </div>
    </nav>
  );
}
