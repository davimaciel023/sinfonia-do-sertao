import { IconNuvem } from "./icons";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__blob" aria-hidden="true" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <IconNuvem className="footer__brand-mark" aria-hidden="true" />
          Sinfonia do Sertão
        </div>
        <p className="footer__tag">Onde a ancestralidade encontra a tecnologia.</p>

        <ul className="footer__links">
          <li><a href="#historia">História</a></li>
          <li><a href="#observadores">Observadores</a></li>
          <li><a href="#calendario">Calendário</a></li>
          <li><a href="#memorial">Memorial</a></li>
          <li><a href="#chatbot">Assistente</a></li>
        </ul>

        <span className="footer__credit">
          Portal Sinfonia do Sertão: feito para preservar e difundir a tradição dos Profetas da Chuva.
        </span>
      </div>
    </footer>
  );
}
