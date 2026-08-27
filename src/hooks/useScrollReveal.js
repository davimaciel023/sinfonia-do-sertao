import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scans the whole document for `.reveal` elements once children have
 * mounted and wires each to a one-shot fade/rise on scroll-into-view.
 * Call once near the top of the tree (App.jsx), after the page's
 * sections have rendered.
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray(".reveal");
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: (i % 4) * 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
      ScrollTrigger.refresh();
    });

    // Web fonts (Fraunces/Sora) swap in after mount and reflow text, which
    // shifts every section below — refresh once metrics settle so later
    // triggers aren't pinned to stale positions.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener("load", refresh);
    const settleTimer = setTimeout(refresh, 800);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(settleTimer);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
