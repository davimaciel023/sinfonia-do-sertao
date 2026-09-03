import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Historia from "./components/Historia";
import MuralObservadores from "./components/MuralObservadores";
import CalendarioEventos from "./components/CalendarioEventos";
import MemorialExperiencias from "./components/MemorialExperiencias";
import ChatbotDestaque from "./components/ChatbotDestaque";
import Footer from "./components/Footer";
import ClickSpark from "./components/ClickSpark";
import BotLangoWidget from "./components/BotLango/BotLangoWidget";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function App() {
  useScrollReveal();

  return (
    <>
      <ClickSpark />
      <Nav />
      <main>
        <Hero />
        <Historia />
        <MuralObservadores />
        <CalendarioEventos />
        <MemorialExperiencias />
        <ChatbotDestaque />
      </main>
      <Footer />
      <BotLangoWidget />
    </>
  );
}
