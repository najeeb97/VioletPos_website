import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  once?: boolean;
  blur?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export const Reveal = ({ children, delay = 0, className, y = 50, once = true, blur = false }: RevealProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-8% 0px -8% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: blur ? "blur(12px)" : "blur(0px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Clip-path line reveal — text slides up from behind a mask
export const RevealLine = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ y: "105%" }}
        animate={inView ? { y: 0 } : {}}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Word-by-word staggered text reveal (upgraded)
export const RevealText = ({
  text,
  className,
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline mr-[0.24em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", rotateX: 20 }}
            animate={inView ? { y: 0, rotateX: 0 } : {}}
            transition={{
              duration: 1.05,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Char-by-char scramble / stagger (for big hero numbers and labels)
export const RevealChars = ({
  text,
  delay = 0,
  className,
  stagger = 0.03,
}: {
  text: string;
  delay?: number;
  className?: string;
  stagger?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const chars = text.split("");
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className ?? ""}`}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: delay + i * stagger, ease: EASE }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
};
