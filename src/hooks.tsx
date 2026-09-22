import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
};

/** Scroll-reveal wrapper: fades + rises into view once, staggered via `delay` (ms). */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

type CounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

/** Counts up from 0 when scrolled into view. Jumps to final value under reduced motion. */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1900,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(() =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) =>
      v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    if (prefersReducedMotion()) {
      setDisplay(fmt(value));
      return;
    }
    setDisplay(fmt(0));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          setDisplay(fmt(value * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** True once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    // Coalesce scroll events into at most one read + state update per animation
    // frame. A raw `scroll` listener fires many times per frame on touch
    // devices, and every call touched `window.scrollY` (a layout read) from
    // inside a scroll handler — the classic way to drag a long page's INP down.
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);
  return scrolled;
}

/**
 * How far outside the viewport a deferred section starts loading. A full screen
 * of lead time is deliberate: the chunk has to have landed before the section is
 * painted, otherwise the section would appear under a scroll that is already
 * past it — the same placeholder-then-content swap that shows up as CLS.
 */
export const LAZY_ROOT_MARGIN = "1000px 0px";

/**
 * True once the observed element comes within `rootMargin` of the viewport.
 *
 * `Reveal` waits until an element is *visible*; this fires while it is still off
 * screen, because its job is to start work early rather than to hide it late.
 */
export function useNearViewport<T extends HTMLElement>(rootMargin: string = LAZY_ROOT_MARGIN) {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver means no way to wait — mount rather than never.
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, rootMargin]);

  return { ref, near };
}

type LazySectionProps = {
  children: ReactNode;
  /** Skip the proximity gate and render now. */
  eager?: boolean;
  rootMargin?: string;
  className?: string;
};

/**
 * Renders `children` when they are worth having, and not before.
 *
 * `React.lazy` on its own only *splits* a bundle, it does not defer it: a
 * dynamic import resolves on the component's first render, and every section is
 * part of that first render, so all of the `import()` calls would fire on mount
 * and race the entry bundle for bandwidth. The `near` flag below is the half that
 * actually takes those bytes off the load-critical path.
 *
 * The wrapper `<div>` is always rendered, so the document's scroll height is
 * stable and the layout that arrives with the chunk never lands under content
 * the user can already see.
 */
export function LazySection({
  children,
  eager = false,
  rootMargin = LAZY_ROOT_MARGIN,
  className = "",
}: LazySectionProps) {
  const { ref, near } = useNearViewport<HTMLDivElement>(rootMargin);

  return (
    <div ref={ref} className={className}>
      {eager || near ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}
