import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────
   REVEAL
   Generic fade + slide + optional blur reveal.
   Works in both scroll-based and fixed-section
   contexts via the optional `isActive` prop.
───────────────────────────────────────────── */
interface RevealProps {
  children:  ReactNode;
  delay?:    number;
  duration?: number;
  className?: string;
  y?:        number;
  once?:     boolean;
  blur?:     boolean;
  isActive?: boolean;
}

export const Reveal = ({
  children,
  delay    = 0,
  duration = 1.1,
  className,
  y        = 50,
  once     = true,
  blur     = false,
  isActive,
}: RevealProps) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once, margin: "-8% 0px -8% 0px" });

  // If isActive is provided (fixed full-page section), use it.
  // Otherwise fall back to scroll-based inView.
  const show = isActive !== undefined ? isActive : inView;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: blur ? "blur(12px)" : "blur(0px)" }}
      animate={
        show
          ? { opacity: 1, y: 0,  filter: "blur(0px)" }
          : { opacity: 0, y,     filter: blur ? "blur(12px)" : "blur(0px)" }
      }
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   REVEAL LINE
   Clip-path slide-up from behind a mask.
   Classic editorial text reveal.
───────────────────────────────────────────── */
export const RevealLine = ({
  children,
  delay    = 0,
  duration = 1.1,
  once     = true,       // now configurable — was hardcoded true
  className,
}: {
  children:  ReactNode;
  delay?:    number;
  duration?: number;
  once?:     boolean;
  className?: string;
}) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ y: "105%" }}
        animate={inView ? { y: 0 } : { y: "105%" }}
        transition={{ duration, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   REVEAL TEXT
   Word-by-word staggered reveal with a 3-D
   rotateX lift for premium editorial feel.
   Accepts `isActive` for fixed-section use
   (e.g. full-page scroll hero) so words animate
   on section entry rather than scroll position.
───────────────────────────────────────────── */
export const RevealText = ({
  text,
  className,
  delay    = 0,
  duration = 1.05,
  stagger  = 0.055,
  isActive,
}: {
  text:       string;
  className?: string;
  delay?:     number;
  duration?:  number;
  stagger?:   number;
  isActive?:  boolean;   // pass from parent for fixed sections
}) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const show  = isActive !== undefined ? isActive : inView;
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline mr-[0.24em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", rotateX: 20 }}
            animate={
              show
                ? { y: 0,      rotateX: 0  }
                : { y: "110%", rotateX: 20 }
            }
            transition={{
              duration,
              delay: delay + i * stagger,
              ease:  EASE,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────
   REVEAL CHARS
   Character-by-character stagger.
   Good for large hero numbers and short labels.
   Accepts `isActive` for fixed-section use.
───────────────────────────────────────────── */
export const RevealChars = ({
  text,
  delay    = 0,
  duration = 0.7,
  className,
  stagger  = 0.03,
  isActive,
}: {
  text:       string;
  delay?:     number;
  duration?:  number;
  className?: string;
  stagger?:   number;
  isActive?:  boolean;
}) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const show  = isActive !== undefined ? isActive : inView;
  const chars = text.split("");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className ?? ""}`}>
      {chars.map((char, i) => (
        // overflow-hidden applied per-char, not on wrapper,
        // so spaces don't collapse inside a clipping container
        <span key={i} className="inline-block overflow-hidden leading-none">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", opacity: 0 }}
            animate={
              show
                ? { y: 0,      opacity: 1 }
                : { y: "110%", opacity: 0 }
            }
            transition={{
              duration,
              delay: delay + i * stagger,
              ease:  EASE,
            }}
          >
            {char === " " ? (
              // Render space as a measured inline-block so it
              // never collapses inside overflow-hidden
              <span className="inline-block w-[0.28em]" />
            ) : (
              char
            )}
          </motion.span>
        </span>
      ))}
    </span>
  );
};