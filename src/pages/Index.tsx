import {
  motion,
  useMotionValue,
  useSpring,
  animate,
  AnimatePresence,
} from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Reveal, RevealText } from "@/components/Reveal";
import { Cursor } from "@/components/Cursor";
import heroDevice from "@/assets/hero-device.jpg";
import uiDashboard from "@/assets/ui-dashboard.jpg";
import uiBilling from "@/assets/ui-billing.jpg";
import uiInventory from "@/assets/ui-inventory.jpg";
import uiReports from "@/assets/ui-reports.jpg";
import { Play, ArrowUpRight, X, MessageCircle, Instagram, Youtube } from "lucide-react";


/* ─────────────────────────────────────────────
   FULL-PAGE SCROLL CONTEXT
───────────────────────────────────────────── */
const ScrollCtx = createContext<{
  active: number;
  total: number;
  goTo: (i: number) => void;
}>({ active: 0, total: 0, goTo: () => {} });

/* ─────────────────────────────────────────────
   EASING
───────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────
   SECTION TRANSITION VARIANTS
   Each section gets a unique personality
───────────────────────────────────────────── */
import type { TargetAndTransition } from "framer-motion";

const variants: Record<string, { enter: TargetAndTransition; exit: TargetAndTransition }> = {
  fadeScale: {
    enter: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    exit:  { opacity: 0, scale: 1.04, filter: "blur(8px)" },
  },
  slideUp: {
    enter: { opacity: 0, y: "6vh" },
    exit:  { opacity: 0, y: "-6vh" },
  },
  slideRight: {
    enter: { opacity: 0, x: "5vw" },
    exit:  { opacity: 0, x: "-5vw" },
  },
  clipUp: {
    enter: { opacity: 0, y: "8vh", scale: 0.98 },
    exit:  { opacity: 0, y: "-4vh", scale: 1.01 },
  },
  invert: {
    enter: { opacity: 0, y: "5vh" },
    exit:  { opacity: 0, y: "-5vh" },
  },
  zoomReveal: {
    enter: { opacity: 0, scale: 1.06 },
    exit:  { opacity: 0, scale: 0.95 },
  },
};

const sectionVariants = [
  "fadeScale",   // 0 Opening
  "slideUp",     // 1 RealityBreak
  "slideRight",  // 2 Narrative
  "clipUp",      // 3 ProductReveal
  "invert",      // 4 Capability
  "slideUp",     // 5 Marquee
  "fadeScale",   // 6 Gallery
  "zoomReveal",  // 7 Video
  "slideRight",  // 8 Flexibility
  "clipUp",      // 9 Trust
  "fadeScale",   // 10 FinalCTA
];

/* ─────────────────────────────────────────────
   NAV DOTS
───────────────────────────────────────────── */
const sectionLabels = [
  "Opening", "Reality", "Story", "Product",
  "Capability", "Flow", "Experience", "Motion",
  "Flexibility", "Terms", "Begin",
];

const NavDots = () => {
  const { active, total, goTo } = useContext(ScrollCtx);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[900] flex flex-col gap-3 items-end">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="group flex items-center gap-2 focus:outline-none"
          data-cursor="Nav"
        >
          <AnimatePresence>
            {hovered === i && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="micro-label text-muted-foreground text-[0.6rem] tracking-widest"
              >
                {sectionLabels[i]}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div
            animate={{
              width:  active === i ? 20 : 6,
              height: active === i ? 4  : 4,
              backgroundColor: active === i
                ? "hsl(265 100% 70%)"
                : hovered === i
                  ? "hsl(265 100% 70% / 0.6)"
                  : "hsl(240 10% 8% / 0.3)",
              borderRadius: active === i ? 2 : 999,
            }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        </button>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION PROGRESS BAR
───────────────────────────────────────────── */
const SectionProgress = () => {
  const { active, total } = useContext(ScrollCtx);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9998] bg-border/30">
      <motion.div
        className="h-full bg-[hsl(var(--accent))] origin-left"
        animate={{ scaleX: (active + 1) / total }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
const Magnetic = ({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }, [x, y, strength]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
const Counter = ({ target, suffix = "", active }: { target: number; suffix?: string; active: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const el = ref.current;
    if (!el) return;
    const ctrl = animate(0, target, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { if (el) el.textContent = Math.round(v) + suffix; },
    });
    return () => ctrl.stop();
  }, [active, target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
const Nav = () => {
  const { goTo } = useContext(ScrollCtx);
  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-background/60 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between px-6 md:px-12 py-3 text-foreground">
        <button onClick={() => goTo(0)} className="font-serif text-xl tracking-tight">
          <span className="font-serif tracking-tight">
            Violet<span className="font-light opacity-70">POS</span>
          </span>
        </button>
        <nav className="hidden md:flex items-center gap-10 text-sm">
          <button onClick={() => goTo(2)} className="hover:opacity-60">Story</button>
          <button onClick={() => goTo(3)} className="hover:opacity-60">Product</button>
          <button onClick={() => goTo(6)} className="hover:opacity-60">Experience</button>
          <button onClick={() => goTo(10)} className="hover:opacity-60">Begin</button>
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://wa.me/917736082117" target="_blank" rel="noopener noreferrer"
            className="group relative w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-green-500">
            <span className="absolute inset-0 rounded-full bg-green-500/10 opacity-0 group-hover:opacity-100 transition duration-300"></span>
            <MessageCircle className="w-4 h-4 text-green-500 relative z-10" />
          </a>
          <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer"
            className="group relative w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-pink-500">
            <span className="absolute inset-0 rounded-full bg-pink-500/10 opacity-0 group-hover:opacity-100 transition duration-300"></span>
            <Instagram className="w-4 h-4 text-pink-500 relative z-10" />
          </a>
          <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer"
            className="group relative w-9 h-9 flex items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-500">
            <span className="absolute inset-0 rounded-full bg-red-500/10 opacity-0 group-hover:opacity-100 transition duration-300"></span>
            <Youtube className="w-4 h-4 text-red-500 relative z-10" />
          </a>
          <button onClick={() => goTo(10)}
            className="group relative px-4 py-2 text-sm rounded-full border border-border text-foreground overflow-hidden transition-all duration-300 hover:scale-105">
            <span className="relative z-10">Start Free Trial</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[hsl(var(--accent))]/10"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

/* ─────────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────────── */
const Section = ({
  children,
  index,
  className = "",
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) => {
  const { active } = useContext(ScrollCtx);
  const isActive = active === index;
  const varKey = sectionVariants[index] ?? "fadeScale";
  const v = variants[varKey];
  const wasActive = useRef(false);

  // Track if this section has been seen (for one-time animations)
  useEffect(() => {
    if (isActive) wasActive.current = true;
  }, [isActive]);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={`section-${index}`}
          className={`absolute inset-0 w-full h-full ${className}`}
          initial={v.enter}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
          exit={v.exit}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────── */

// 0 — Opening
const Opening = ({ isActive }: { isActive: boolean }) => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const glowY = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });

  const onMouse = useCallback((e: React.MouseEvent) => {
    mx.set(e.clientX / window.innerWidth);
    my.set(e.clientY / window.innerHeight);
  }, [mx, my]);

  return (
    <div
      className="relative h-full flex flex-col justify-between px-6 md:px-12 py-28 overflow-hidden"
      onMouseMove={onMouse}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] violet-glow animate-glow-pulse pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 flex justify-between items-start micro-label opacity-60 text-muted-foreground"
      >
        <span>(01) — Manifesto</span>
        <span className="hidden md:block">Est. 2026 / Edition Nº1</span>
      </motion.div>

      <div className="relative z-10 max-w-[1400px]">
        <h1 className="editorial-display text-[14vw] leading-[0.9] tracking-tight md:text-[10vw] text-balance">
          {isActive && <RevealText text="Not Just Another POS System." />}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 1.4, ease: EASE }}
          className="mt-12 md:mt-20 editorial-display text-[8vw] md:text-[5vw] text-[hsl(var(--accent))]"
        >
          It's a better way to sell.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative z-10 flex justify-between items-end micro-label text-muted-foreground"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2"
        >
          Scroll to begin <span>↓</span>
        </motion.span>
        <span className="hidden md:block">Business, simplified.<br />Control, visualized.</span>
      </motion.div>
    </div>
  );
};

// 1 — RealityBreak
const RealityBreak = ({ isActive }: { isActive: boolean }) => {
  const leftChips = [
    { label: "Customer management", hi: true },
    { label: "Inventory tracking", hi: false },
    { label: "GST · CGST · VAT · GCC", hi: true },
    { label: "Sales reports", hi: false },
    { label: "Purchase tracking", hi: true },
    { label: "Unlimited history", hi: false },
  ];

  const rightChips = [
    { label: "ZATCA QR", hi: false },
    { label: "Quotations", hi: true },
    { label: "A4 & thermal print", hi: false },
    { label: "Cloud or local", hi: true },
    { label: "Real-time dashboard", hi: false },
    { label: "Supplier management", hi: true },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 md:px-20 py-28">
      {/* Background glow */}
      <div className="absolute inset-0 violet-glow opacity-20 pointer-events-none" />

      {/* LEFT FLOATING LABELS */}
      <div className="absolute inset-y-0 left-0 w-[22%] hidden xl:block pointer-events-none">
        {leftChips.map((chip, i) => {
          const top = 12 + i * 13;

          return (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, x: -20 }}
              animate={
                isActive
                  ? {
                      opacity: 1,
                      y: [0, -16, 10, 0],
                      x: [0, 10, -4, 0],
                    }
                  : { opacity: 0 }
              }
              transition={{
                opacity: {
                  duration: 0.8,
                  delay: i * 0.15,
                },
                y: {
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                x: {
                  duration: 7 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              style={{
                top: `${top}%`,
                left: `${8 + (i % 2) * 12}%`,
              }}
              className={`absolute text-xs px-4 py-2 rounded-full border backdrop-blur-md whitespace-nowrap ${
                chip.hi
                  ? "bg-[hsl(265_100%_70%/0.12)] border-[hsl(265_100%_70%/0.35)] text-[hsl(265_100%_75%)] shadow-[0_0_30px_hsl(265_100%_70%/0.12)]"
                  : "bg-background/30 border-border/70 text-muted-foreground"
              }`}
            >
              {chip.label}
            </motion.span>
          );
        })}
      </div>

      {/* RIGHT FLOATING LABELS */}
      <div className="absolute inset-y-0 right-0 w-[22%] hidden xl:block pointer-events-none">
        {rightChips.map((chip, i) => {
          const top = 10 + i * 13;

          return (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, x: 20 }}
              animate={
                isActive
                  ? {
                      opacity: 1,
                      y: [0, 14, -10, 0],
                      x: [0, -10, 6, 0],
                    }
                  : { opacity: 0 }
              }
              transition={{
                opacity: {
                  duration: 0.8,
                  delay: i * 0.15,
                },
                y: {
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                x: {
                  duration: 8 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              style={{
                top: `${top}%`,
                right: `${8 + (i % 2) * 12}%`,
              }}
              className={`absolute text-xs px-4 py-2 rounded-full border backdrop-blur-md whitespace-nowrap ${
                chip.hi
                  ? "bg-[hsl(265_100%_70%/0.12)] border-[hsl(265_100%_70%/0.35)] text-[hsl(265_100%_75%)] shadow-[0_0_30px_hsl(265_100%_70%/0.12)]"
                  : "bg-background/30 border-border/70 text-muted-foreground"
              }`}
            >
              {chip.label}
            </motion.span>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
        {/* Top paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-10"
        >
          Most POS systems were built like accounting software — slow,
          disconnected and frustrating to use. Businesses today move in
          real-time, but traditional systems still force teams to manage
          multiple tools for billing, inventory, customers and reporting.
          VioletPOS replaces that chaos with one fast, beautifully connected
          platform built for modern business operations.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="w-16 h-px bg-border/80 mb-12 origin-center"
        />

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={
            isActive
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0 }
          }
          transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
          className="editorial-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.04em] max-w-5xl mb-12"
        >
          Everything you thought about POS is wrong.
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay: 1, ease: EASE }}
          className="w-16 h-px bg-border/80 mb-10 origin-center"
        />

        {/* Bottom paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: EASE }}
          className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-4xl"
        >
          VioletPOS is more than billing software. Manage customers,
          suppliers and products from one unified workspace with real-time
          dashboards, advanced sales analytics, purchase tracking and smart
          inventory control. Generate quotations instantly, print through A4
          or thermal devices, and operate seamlessly with GST, CGST, VAT,
          GCC tax systems and ZATCA QR compliance. Whether deployed locally
          or in the cloud, VioletPOS delivers the speed, flexibility and
          reliability modern businesses actually need.
        </motion.p>
      </div>
    </section>
  );
};

// 2 — Narrative
const Narrative = ({ isActive }: { isActive: boolean }) => {
  const lines = [
    { text: "Your business is not", accent: "spreadsheets.", align: "left" as const },
    { text: "It's people. Products.", accent: "Decisions.", align: "right" as const },
    { text: "You need", accent: "clarity.", align: "center" as const },
  ];

  const justify = {
    left: "justify-start text-left",
    right: "justify-end text-right",
    center: "justify-center text-center",
  };

  return (
    <div className="relative h-full flex flex-col justify-center px-6 md:px-12 py-24 overflow-hidden">
      {/* Ambient background — floating shapes, theme-driven */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* soft glows */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 0.5, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-accent/40 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 0.35, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
          className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-3xl"
        />

        {/* floating ring — top right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1, y: [0, -24, 0], rotate: [0, 8, 0] } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, ease: EASE },
            y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 14, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-[12%] right-[10%] h-40 w-40 rounded-full border border-foreground/15"
        />

        {/* small filled dot — mid left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.7, y: [0, 18, 0], x: [0, 6, 0] } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, delay: 0.3, ease: EASE },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 11, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-[40%] left-[8%] h-2.5 w-2.5 rounded-full bg-foreground/60"
        />

        {/* outlined square, rotating — bottom left */}
        <motion.div
          initial={{ opacity: 0, rotate: 12 }}
          animate={
            isActive
              ? { opacity: 1, rotate: [12, 28, 12], y: [0, -14, 0] }
              : { opacity: 0 }
          }
          transition={{
            opacity: { duration: 1, delay: 0.4, ease: EASE },
            rotate: { duration: 16, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-[18%] left-[14%] h-24 w-24 border border-foreground/15 rounded-md"
        />

        {/* tiny ring — bottom right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.8, y: [0, -12, 0] } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1, delay: 0.5, ease: EASE },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-[28%] right-[18%] h-6 w-6 rounded-full border-2 border-foreground/30"
        />

        {/* drifting hairline */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isActive ? { opacity: 0.4, x: [-40, 40, -40] } : { opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: EASE },
            x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-[28%] right-[28%] h-px w-40 bg-foreground/40"
        />

        {/* dot constellation — top center, gently pulsing */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 flex gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: [0.2, 0.8, 0.2], y: [0, -4, 0] } : { opacity: 0 }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.25,
              }}
              className="h-1 w-1 rounded-full bg-foreground"
            />
          ))}
        </div>
      </div>

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="h-px w-10 bg-foreground/30" />
        <p className="micro-label text-muted-foreground tracking-[0.2em] uppercase text-xs">
          02 — A quiet observation
        </p>
      </motion.div>

      {/* Lines */}
      <div className="space-y-12 md:space-y-20 max-w-[1400px] mx-auto w-full">
        {lines.map((l, i) => (
          <div key={i} className={`flex ${justify[l.align]}`}>
            <motion.h2
              initial={{
                opacity: 0,
                x: l.align === "right" ? 60 : l.align === "center" ? 0 : -60,
                y: l.align === "center" ? 40 : 0,
                filter: "blur(12px)",
              }}
              animate={
                isActive
                  ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, filter: "blur(12px)" }
              }
              transition={{ duration: 1, delay: i * 0.2, ease: EASE }}
              className="editorial-display text-[10vw] md:text-[5.5vw] leading-[1.02] tracking-tight max-w-[16ch] text-balance"
            >
              <span className="text-foreground/55">{l.text}</span>{" "}
              <span className="relative inline-block text-foreground italic font-medium">
                {l.accent}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.9, delay: 0.6 + i * 0.2, ease: EASE }}
                  style={{ transformOrigin: "left" }}
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground/40"
                />
              </span>
            </motion.h2>
          </div>
        ))}
      </div>

      {/* Footer cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
        className="mt-20 flex items-center gap-3 text-muted-foreground"
      >
        <span className="micro-label text-xs tracking-[0.2em] uppercase">
          Keep scrolling
        </span>
        <span className="h-px w-16 bg-muted-foreground/40" />
      </motion.div>
    </div>
  );
};




// 3 — ProductReveal
const ProductReveal = ({ isActive }: { isActive: boolean }) => (
  <div className="h-full flex items-center px-6 md:px-12 overflow-hidden">
    <div className="absolute inset-0 violet-glow opacity-30 pointer-events-none" />
    <div className="relative max-w-[1500px] mx-auto w-full">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label text-muted-foreground mb-12"
      >
        (03) — Discover the instrument
      </motion.p>
      <div className="grid md:grid-cols-12 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60, scale: 0.94 }}
          animate={isActive ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="md:col-span-5"
        >
          <img src={heroDevice} alt="VioletPOS terminal" className="w-full h-auto shadow-[var(--shadow-soft)]" />
        </motion.div>
        <div className="md:col-span-6 md:col-start-7 space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="editorial-display text-[7vw] md:text-[3.5vw] text-balance"
          >
            A single surface for every <em className="text-[hsl(var(--accent))] not-italic font-serif italic">decision</em> you make.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: EASE }}
            className="font-sans text-lg text-muted-foreground max-w-md leading-relaxed"
          >
            Sales. Inventory. People. Reports. Reduced to gestures. Elevated to clarity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
          >
            <img src={uiDashboard} alt="Dashboard preview" className="w-full h-auto shadow-[var(--shadow-soft)] border border-border" />
          </motion.div>
        </div>
      </div>
    </div>
  </div>
);

// 4 — Capability
const Capability = ({ isActive }: { isActive: boolean }) => {
  const items = [
    { left: "You don't track sales.", right: "You understand them." },
    { left: "You don't manage stock.", right: "You control it." },
    { left: "You don't store data.", right: "You own it." },
  ];
  return (
    <div className="h-full flex flex-col justify-center px-6 md:px-12 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label mb-12"
      >
        (04) — A different verb
      </motion.p>
      <div className="max-w-[1400px] mx-auto w-full space-y-8 md:space-y-12">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, delay: i * 0.14, ease: EASE }}
            className="grid md:grid-cols-2 gap-6 md:gap-16 items-baseline"
          >
            <p className="editorial-display text-[7vw] md:text-[4vw] opacity-25 line-through decoration-1">
              {it.left}
            </p>
            <p className="editorial-display text-[7vw] md:text-[4vw] italic text-[hsl(var(--accent-glow))]">
              {it.right}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 5 — Marquee
// 5 — Marquee
const MarqueeSection = ({ isActive }: { isActive: boolean }) => {
  const rows = [
    { text: "SELL · TRACK · CONTROL · ", reverse: false, size: "text-[12vw] md:text-[7vw]", opacity: "opacity-100" },
    { text: "ANALYZE · OPTIMIZE · GROW · ", reverse: true, size: "text-[12vw] md:text-[7vw]", opacity: "opacity-40" },
    { text: "SIMPLIFY · AUTOMATE · SCALE · ", reverse: false, size: "text-[10vw] md:text-[6vw]", opacity: "opacity-20" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-center overflow-hidden bg-background text-foreground">

      {/* Single ambient glow (reduced noise) */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] violet-glow pointer-events-none"
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      {/* Top label */}
      <div className="relative z-10 flex justify-between items-start px-6 md:px-12 pt-10 micro-label text-muted-foreground">
        <span>(05) — In flow</span>
        <span className="hidden md:block">A constant rhythm</span>
      </div>

      {/* Date (replacing big number) */}
      <div className="relative z-10 px-6 md:px-12 mt-6 mb-6">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 0.8, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="editorial-display text-[10vw] md:text-[5vw] leading-none text-[hsl(var(--accent))]"
        >
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </motion.span>
      </div>

      {/* Divider */}
      <div className="relative z-10 mx-6 md:mx-12 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))]/40 to-transparent mb-10" />

      {/* Marquee rows */}
      <div className="relative z-10 space-y-6 md:space-y-10 py-6">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex whitespace-nowrap ${
              row.reverse ? "animate-marquee-reverse" : "animate-marquee"
            } ${row.opacity} hover:[animation-duration:15s]`}
          >
            {Array.from({ length: 8 }).map((_, j) => (
              <span
                key={j}
                className={`editorial-display ${row.size} mx-6 text-foreground`}
              >
                {row.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* CENTER FOCAL MESSAGE (main upgrade) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
     </motion.div>

      {/* Bottom note */}
      <div className="relative z-10 flex justify-between items-end px-6 md:px-12 pb-10 mt-10 micro-label text-muted-foreground">
        <span>Every scroll, intentional.</span>
        <span className="hidden md:block italic font-serif text-base">— a quiet pulse</span>
      </div>
    </div>
  );
};


// 6 — Gallery
const Gallery = ({ isActive }: { isActive: boolean }) => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const items = [
    { src: uiDashboard, label: "Dashboard",  num: "01", desc: "Real-time sales overview" },
    { src: uiBilling,   label: "Billing",    num: "02", desc: "Fast, frictionless checkout" },
    { src: uiReports,   label: "Reports",    num: "03", desc: "Insights that drive decisions" },
    { src: uiInventory, label: "Inventory",  num: "04", desc: "Stock control, simplified" },
  ];

  return (
    <div className="h-full flex flex-col justify-between px-6 md:px-16 py-10 overflow-hidden">

      {/* Header row */}
    <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
  transition={{ duration: 0.6, ease: EASE }}
  className="flex justify-between items-end pt-16 md:pt-14"
>
  <div>
    <p className="micro-label opacity-50 text-muted-foreground mb-1">(05) — In use</p>
  </div>
  <div className="hidden md:block" />
</motion.div>

      {/* Main feature card + thumbnails */}
      <div className="flex gap-4 md:gap-6 flex-1 min-h-0 mt-6">

        {/* Thumbnail strip — left */}
        <div className="flex flex-col gap-3 justify-center w-[72px] md:w-[88px] shrink-0">
          {items.map((it, i) => (
            <motion.button
              key={it.num}
              onClick={() => setActiveCard(i)}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
              className="relative group focus:outline-none"
              data-cursor="View"
            >
              <div className={`relative overflow-hidden transition-all duration-500 ${
                activeCard === i
                  ? "ring-2 ring-[hsl(var(--accent))] ring-offset-2 ring-offset-background"
                  : "opacity-40 hover:opacity-70"
              }`}>
                <img
                  src={it.src}
                  alt={it.label}
                  className="w-full aspect-video object-cover object-top"
                />
              </div>
              <p className={`mt-1 micro-label text-[0.55rem] transition-colors duration-300 ${
                activeCard === i ? "text-[hsl(var(--accent))]" : "text-muted-foreground"
              }`}>
                {it.num}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Feature image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="flex-1 relative min-h-0 group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="absolute inset-0"
            >
              <img
                src={items[activeCard].src}
                alt={items[activeCard].label}
                className="w-full h-full object-cover object-top border border-border"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />

              {/* Bottom label bar */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end">
                <div>
                  <p className="micro-label text-background/50 text-[0.6rem] mb-1">
                    {items[activeCard].num} / {items.length}
                  </p>
                  <p className="font-serif italic text-xl md:text-2xl text-background leading-none">
                    {items[activeCard].label}
                  </p>
                  <p className="font-sans text-xs text-background/60 mt-1">
                    {items[activeCard].desc}
                  </p>
                </div>
                <button
                  onClick={() => setLightbox(items[activeCard].src)}
                  data-cursor="Expand"
                  className="w-10 h-10 border border-background/30 flex items-center justify-center text-background hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] transition-colors duration-300"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Dot indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex gap-2 justify-center mt-4"
      >
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveCard(i)}
            className="focus:outline-none"
          >
            <motion.div
              animate={{
                width: activeCard === i ? 24 : 6,
                backgroundColor: activeCard === i
                  ? "hsl(265 100% 70%)"
                  : "hsl(240 10% 8% / 0.2)",
              }}
              transition={{ duration: 0.3, ease: EASE }}
              className="h-[3px] rounded-full"
            />
          </button>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-foreground/95 backdrop-blur-md flex items-center justify-center p-6 md:p-16"
          >
            <motion.button
              className="absolute top-6 right-6 text-background w-12 h-12 border border-background/20 flex items-center justify-center hover:border-[hsl(var(--accent))] transition-colors"
              onClick={() => setLightbox(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-full object-contain shadow-[var(--shadow-glow)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 7 — Video
const VideoSection = ({ isActive }: { isActive: boolean }) => (
  <div className="h-full flex flex-col justify-center px-6 md:px-12 bg-[hsl(var(--foreground))]">
    <div className="max-w-[1500px] mx-auto w-full">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label text-[hsl(var(--background))]/50 mb-8"
      >
        (06) — In motion
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className="relative w-full aspect-[16/9] overflow-hidden"
      >
        <video src="/demo.mp4" autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-white/40 flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

// 8 — Flexibility
const Flexibility = ({ isActive }: { isActive: boolean }) => (
  <div className="h-full flex items-center px-6 md:px-12 overflow-hidden">
    <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="micro-label text-muted-foreground"
        >
          (07) — Anywhere
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="editorial-display text-[10vw] md:text-[5.5vw] text-balance"
        >
          Run it <em className="italic font-serif text-[hsl(var(--accent))]">local.</em>
        </motion.h2>
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="editorial-display text-[10vw] md:text-[5.5vw] text-muted-foreground text-balance"
        >
          Or take it to the <em className="italic font-serif text-foreground">cloud.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: EASE }}
          className="font-sans text-lg text-muted-foreground max-w-md leading-relaxed"
        >
          One device. Or fifty. Same surface. Same silence. Synced when you choose.
        </motion.p>
      </div>

      <div className="relative h-[50vh] flex items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i - 2) * 16;
          const xOffset = (i - 2) * 60;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 0, rotate: 0 }}
              animate={isActive
                ? { opacity: i === 2 ? 1 : 0.5, x: xOffset, rotate: angle, scale: i === 2 ? 1.05 : 0.95 }
                : { opacity: 0, x: 0 }
              }
              transition={{ duration: 1.2, delay: i * 0.08, ease: EASE }}
              className="absolute w-36 md:w-48 aspect-[3/4] bg-foreground border border-border shadow-[var(--shadow-soft)]"
            >
              <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--accent))]/30 via-foreground to-foreground p-4 flex flex-col justify-between">
                <div className="micro-label opacity-60 text-background/60">Device {i + 1}</div>
                <div className="w-full h-[2px] bg-[hsl(var(--accent-glow))]/60" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

// 9 — Trust
const Trust = ({ isActive }: { isActive: boolean }) => {
  const items = [
    { k: 20, symbol: "",  v: "Days, free.",     note: "Full product. No commitments." },
    { k: 1,  symbol: "",  v: "Subscription.",   note: "Monthly/Yearly. Cancel anytime." },
    { k: null, symbol: "∞", v: "Conversation.", note: "Onboarding by humans." },
  ];
  return (
    <div className="h-full flex flex-col justify-center px-6 md:px-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label text-muted-foreground mb-16 max-w-[1400px] mx-auto w-full"
      >
        (08) — The terms
      </motion.p>
      <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-3 gap-12">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, delay: i * 0.14, ease: EASE }}
            className="border-t border-foreground pt-8"
          >
            <div className="editorial-display text-[16vw] md:text-[7vw] text-[hsl(var(--accent))] leading-none mb-4">
              {it.k !== null ? <Counter target={it.k} active={isActive} /> : it.symbol}
            </div>
            <p className="font-serif italic text-2xl mb-2">{it.v}</p>
            <p className="font-sans text-sm text-muted-foreground">{it.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 10 — FinalCTA
const FinalCTA = ({ isActive }: { isActive: boolean }) => {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div className="h-full flex flex-col justify-center items-center px-6 md:px-12 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] overflow-hidden relative">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] violet-glow opacity-40 animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 text-center max-w-[1400px] w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="micro-label mb-12"
        >
          (09) — Begin
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="editorial-display text-[12vw] leading-[0.9] tracking-tight md:text-[9vw] text-balance"
        >
          Start simple.
          <br />
          <em className="italic font-serif text-[hsl(var(--accent-glow))]">
            Stay in control.
          </em>
        </motion.h2>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-16 flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Magnetic strength={0.4}>
            <a
              href="#"
              className="group relative px-10 py-5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm uppercase transition hover:scale-105"
            >
              Download Free Trial
            </a>
          </Magnetic>

          <Magnetic strength={0.4}>
            <button
              onClick={() => setOpen(true)}
              className="group relative px-10 py-5 border border-background/30 text-[hsl(var(--background))] text-sm uppercase transition hover:border-[hsl(var(--accent))] hover:scale-105"
            >
              Request a Demo
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-16 w-full max-w-[1400px] flex justify-between items-end micro-label opacity-60">
        <span>VioletPOS — © 2026</span>
        <span className="hidden md:block">Designed for those who decide.</span>
        <span>Edition Nº1</span>
      </div>

      {/* ================= POPUP ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-background text-foreground p-6 rounded-xl border border-border"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Request Demo</h3>
                <button onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const form = e.currentTarget;

                  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                  const mobile = (form.elements.namedItem("mobile") as HTMLInputElement).value;
                  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                  const country = (form.elements.namedItem("country") as HTMLInputElement).value;
                  const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

                  const msg =
                    `Demo Request:\n` +
                    `Name: ${name}\n` +
                    `Mobile: ${mobile}\n` +
                    `Email: ${email}\n` +
                    `Country: ${country}\n` +
                    `Notes: ${notes}`;

                  // Open WhatsApp
                  window.open(
                    `https://wa.me/917736082117?text=${encodeURIComponent(msg)}`,
                    "_blank"
                  );

                  // Reset form
                  form.reset();

                  // Close popup
                  setOpen(false);

                  // Show success message
                  setSuccess(true);

                  // Auto hide after 3 sec
                  setTimeout(() => setSuccess(false), 3000);
                }}
                className="space-y-3"
              >
                <input name="name" placeholder="Name" required className="w-full p-2 border border-border" />
                <input name="mobile" placeholder="Mobile" required className="w-full p-2 border border-border" />
                <input name="email" type="email" placeholder="Email" required className="w-full p-2 border border-border" />
                <input name="country" placeholder="Country" className="w-full p-2 border border-border" />
                <textarea name="notes" placeholder="Notes" className="w-full p-2 border border-border" />

                <button
                  type="submit"
                  className="w-full py-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SUCCESS MESSAGE ================= */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-full shadow-lg"
          >
            Request received. We’ll contact you shortly.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



/* ─────────────────────────────────────────────
   FULL-PAGE SCROLL ENGINE
───────────────────────────────────────────── */
const TOTAL_SECTIONS = 11;
const THROTTLE_MS = 900;

const FullPageScroll = () => {
  const [active, setActive] = useState(0);
  const transitioning = useRef(false);
  const lastTouch = useRef<number | null>(null);

  const goTo = useCallback((i: number) => {
    const target = Math.max(0, Math.min(TOTAL_SECTIONS - 1, i));
    if (target === active || transitioning.current) return;
    transitioning.current = true;
    setActive(target);
    setTimeout(() => { transitioning.current = false; }, THROTTLE_MS);
  }, [active]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) next();
      else if (e.deltaY < -30) prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Touch
  useEffect(() => {
    const onStart = (e: TouchEvent) => { lastTouch.current = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      if (lastTouch.current === null) return;
      const delta = lastTouch.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
      lastTouch.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); next(); }
      if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const sections = [
    <Opening     key={0}  isActive={active === 0}  />,
    <RealityBreak key={1} isActive={active === 1}  />,
    <Narrative   key={2}  isActive={active === 2}  />,
    <ProductReveal key={3} isActive={active === 3} />,
    <Capability  key={4}  isActive={active === 4}  />,
    <MarqueeSection key={5} isActive={active === 5} />,
    <Gallery     key={6}  isActive={active === 6}  />,
    <VideoSection key={7} isActive={active === 7}  />,
    <Flexibility key={8}  isActive={active === 8}  />,
    <Trust       key={9}  isActive={active === 9}  />,
    <FinalCTA    key={10} isActive={active === 10} />,
  ];

  return (
    <ScrollCtx.Provider value={{ active, total: TOTAL_SECTIONS, goTo }}>
      <Cursor />
      <Nav />
      <SectionProgress />
      <NavDots />

      <div className="fixed inset-0 bg-background overflow-hidden pt-[52px]">
        {sections.map((section, i) => (
          <Section key={i} index={i}>
            {section}
          </Section>
        ))}
      </div>
    </ScrollCtx.Provider>
  );
};

export default FullPageScroll;