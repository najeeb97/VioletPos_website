import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [isHover, setIsHover] = useState(false);
  const [isClick, setIsClick] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.5 });

  const dotX = useSpring(mouseX, { stiffness: 600, damping: 30, mass: 0.2 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 30, mass: 0.2 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const down = () => setIsClick(true);
    const up = () => setIsClick(false);

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magnetic = target.closest("[data-cursor]");
      if (magnetic) {
        setIsHover(true);
        setLabel((magnetic as HTMLElement).dataset.cursor || "");
      } else {
        setIsHover(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          width: isHover ? 80 : isClick ? 24 : 40,
          height: isHover ? 80 : isClick ? 24 : 40,
          opacity: 1,
          borderColor: isHover ? "hsl(265 100% 70%)" : "hsl(40 20% 97%)",
        }}
        initial={{ width: 40, height: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: "50%",
          border: "1.5px solid",
          borderColor: "hsl(40 20% 97%)",
        }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="absolute inset-0 flex items-center justify-center text-[0.5rem] tracking-widest uppercase font-sans text-white leading-none text-center px-1"
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "hsl(265 100% 70%)",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
};
