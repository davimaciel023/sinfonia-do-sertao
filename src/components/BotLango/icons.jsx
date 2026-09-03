// Ícones do widget do Bot Lango — desenhados à mão em SVG para reproduzir
// exatamente o visual do webchat original (mesmo espírito dos ícones do
// Memorial: nada de libs genéricas aqui, é identidade visual do widget).

export function IconSparkle(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      {...props}
    >
      <path d="M12 2c.4 3.6 1 5.3 2.1 6.6 1.2 1.4 3.1 2.1 6.9 2.4-3.8.3-5.7 1-6.9 2.4C13 14.7 12.4 16.4 12 20c-.4-3.6-1-5.3-2.1-6.6-1.2-1.4-3.1-2.1-6.9-2.4 3.8-.3 5.7-1 6.9-2.4C11 7.3 11.6 5.6 12 2Z" />
      <path d="M19 2c.15 1.3.4 2 .9 2.6.5.6 1.2.9 2.6 1-1.3.15-2 .4-2.6.9-.5.5-.75 1.2-.9 2.5-.15-1.3-.4-2-.9-2.5-.5-.5-1.2-.75-2.5-.9 1.3-.1 2-.4 2.5-1 .45-.6.7-1.3.9-2.6Z" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconSend(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

export function IconSmile(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M8.5 10.2h.01M15.5 10.2h.01" />
      <path d="M8 14.5c1 1.1 2.4 1.7 4 1.7s3-.6 4-1.7" />
    </svg>
  );
}

export function IconMic(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3.5M9 21.5h6" />
    </svg>
  );
}
