import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./CoverflowCarousel.css";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 3D cover-flow carousel: cards fan out and recede from a centred, focused
 * card. Position is a single fractional index (`posRef`) painted straight to
 * the DOM every frame — 60 state updates/sec would re-render every card for
 * numbers React never needs to see.
 */
export function CoverflowCarousel({
  slides,
  rotate = 40,
  depth = 0.55,
  perspective = 3,
  falloff = 0.56,
  fade = 0.12,
  cardWidth = "clamp(140px, 20vw, 220px)",
  gap = 0.14,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = "Carrossel de observadores",
  className,
  cardClassName,
}) {
  const count = slides.length;

  const frameRef = useRef(null);
  const cardRefs = useRef([]);
  const posRef = useRef(0);
  // Where the current settle is headed — stepping off `pos` instead would
  // swallow a keypress/click that lands mid-flight, before it rounds off.
  const targetRef = useRef(0);
  const widthRef = useRef(0);
  const rafRef = useRef(null);
  const dragRef = useRef(null);

  const [selected, setSelected] = useState(0);

  const indexAt = useCallback(
    (pos) => ((Math.round(pos) % count) + count) % count,
    [count]
  );

  const paint = useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring — the whole
      // looping mechanism, no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Tilt and recession both ease off with distance — a linear ramp folds
      // the second card shut, this keeps it readable further out.
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint]
  );

  const clamp = useCallback(
    (pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop]
  );

  const goTo = useCallback(
    (index) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle]
  );

  const nudge = useCallback(
    (by) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle]
  );

  function onPointerDown(event) {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  }

  function endDrag(event) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  }

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const active = slides[selected];

  return (
    <div
      className={cx("cf", className)}
      style={{ "--cf-card": cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="cf__stage-wrap">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cf__frame"
          style={{ perspective: `calc(var(--cf-card) * ${perspective})` }}
        >
          <div className="cf__track">
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${count}`}
                className={cx("cf__card", cardClassName)}
              >
                {slide.content ? (
                  slide.content
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt || ""}
                    draggable={false}
                    className="cf__card-img"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Observador anterior"
              onClick={() => nudge(-1)}
              className="cf__nav cf__nav--prev"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Próximo observador"
              onClick={() => nudge(1)}
              className="cf__nav cf__nav--next"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div key={selected} className="cf__caption">
          <p className="cf__caption-title">{active.title}</p>
          {active.subtitle && <p className="cf__caption-subtitle">{active.subtitle}</p>}
          {active.bio && <p className="cf__caption-bio">{active.bio}</p>}
        </div>
      )}

      {showPagination && (
        <div className="cf__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir para ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cx("cf__dot", index === selected && "is-active")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
