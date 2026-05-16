import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);

  const [label,   setLabel]   = useState("");
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [visible, setVisible] = useState(false); // hidden until first mouse move
  const [isTouch, setIsTouch] = useState(false); // unmount entirely on touch devices

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Outer ring — slower, springy
  const springX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.5 });

  // Inner dot — snappy
  const dotX = useSpring(mouseX, { stiffness: 600, damping: 30, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 30, mass: 0.2 });

  useEffect(() => {
    // Detect touch-primary devices and bail — no cursor needed
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onDown = () => setIsClick(true);
    const onUp   = () => setIsClick(false);

    const onOver = (e: MouseEvent) => {
      const target  = e.target as HTMLElement;
      const el      = target.closest("[data-cursor]") as HTMLElement | null;
      if (el) {
        setIsHover(true);
        setLabel(el.dataset.cursor ?? "");
      } else {
        setIsHover(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    window.addEventListener("mouseover",  onOver);

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("mouseover",  onOver);
    };
  }, [mouseX, mouseY, visible]);

  // Don't render anything on touch screens
  if (isTouch) return null;

  return (
    <>
      {/* ── Outer ring ── */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        initial={{ opacity: 0, width: 40, height: 40 }}
        animate={{
          opacity: visible ? 1 : 0,
          width:  isHover ? 80 : isClick ? 24 : 40,
          height: isHover ? 80 : isClick ? 24 : 40,
          // borderColor lives only here — not duplicated in style prop
          borderColor: isHover
            ? "hsl(265 100% 70%)"
            : "hsl(40 20% 97%)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          border: "1.5px solid",
        }}
      >
        {/* Contextual label with proper exit animation */}
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center
                text-[0.5rem] tracking-widest uppercase font-sans
                text-white leading-none text-center px-1"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Inner dot ── */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{ opacity: visible ? 1 : 0 }}
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "hsl(265 100% 70%)",
          // No mixBlendMode here — it made the dot invisible on light backgrounds
        }}
      />
    </>
  );
};