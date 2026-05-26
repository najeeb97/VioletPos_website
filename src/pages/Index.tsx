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
import { RevealText } from "@/components/Reveal";
import { Cursor } from "@/components/Cursor";
import heroDevice from "@/assets/hero-device.jpg";
import uiDashboard from "@/assets/ui-dashboard.jpg";
import uiBilling from "@/assets/ui-billing.jpg";
import uiInventory from "@/assets/ui-inventory.jpg";
import uiReports from "@/assets/ui-reports.jpg";
import {
  Play,
  ArrowUpRight,
  X,
  MessageCircle,
  Instagram,
  Youtube,
  Monitor,
  Cloud,
  Check,
  Download,
  ArrowRight,
  Lock,
  Settings,
  Package,
  CreditCard,
} from "lucide-react";
import type { TargetAndTransition } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ─────────────────────────────────────────────
   SCROLL CONTEXT
───────────────────────────────────────────── */
const ScrollCtx = createContext<{
  active: number;
  total: number;
  goTo: (i: number) => void;
}>({ active: 0, total: 0, goTo: () => {} });

/* ─────────────────────────────────────────────
   LANGUAGE CONTEXT
───────────────────────────────────────────── */
const LanguageCtx = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({ language: "en", setLanguage: () => {} });

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL_SECTIONS = 11;
const THROTTLE_MS = 900;

/* ─────────────────────────────────────────────
   SECTION TRANSITION VARIANTS
───────────────────────────────────────────── */
const variants: Record<
  string,
  { enter: TargetAndTransition; exit: TargetAndTransition }
> = {
  fadeScale: {
    enter: { opacity: 0, scale: 0.97, filter: "blur(8px)" },
    exit: { opacity: 0, scale: 1.03, filter: "blur(8px)" },
  },
  slideUp: {
    enter: { opacity: 0, y: "5vh" },
    exit: { opacity: 0, y: "-5vh" },
  },
  slideRight: {
    enter: { opacity: 0, x: "4vw" },
    exit: { opacity: 0, x: "-4vw" },
  },
  clipUp: {
    enter: { opacity: 0, y: "6vh", scale: 0.98 },
    exit: { opacity: 0, y: "-4vh", scale: 1.01 },
  },
  invert: {
    enter: { opacity: 0, y: "4vh" },
    exit: { opacity: 0, y: "-4vh" },
  },
  zoomReveal: {
    enter: { opacity: 0, scale: 1.04 },
    exit: { opacity: 0, scale: 0.96 },
  },
};

const sectionVariants = [
  "fadeScale",  // 0 Opening
  "slideUp",    // 1 RealityBreak
  "slideRight", // 2 Narrative
  "clipUp",     // 3 ProductReveal
  "invert",     // 4 Capability
  "slideUp",    // 5 Marquee
  "fadeScale",  // 6 Gallery
  "zoomReveal", // 7 Video
  "slideRight", // 8 Flexibility
  "clipUp",     // 9 Trust
  "fadeScale",  // 10 FinalCTA
];

/* ─────────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────────── */
type Language = "en" | "ar" | "hi";

const translations: Record<Language, {
  getting_started_label: string;
  getting_started_title: string;
  getting_started_subtitle: string;
  steps: Array<{ title: string; description: string }>;
}> = {
  en: {
    getting_started_label: "(05) — Getting Started",
    getting_started_title: "From installation to first sale in 5 clear steps.",
    getting_started_subtitle: "Set up your POS system in just a few minutes and start accepting sales immediately.",
    steps: [
      {
        title: "Download & Install",
        description: "Download the POS application and install it in minutes. Quick setup wizard gets you started fast.",
      },
      {
        title: "Login or Create Account",
        description: "Sign up or log in securely to access your dashboard and cloud sync features.",
      },
      {
        title: "Setup Your Business",
        description: "Add company details, GST settings, bank details, and invoice preferences.",
      },
      {
        title: "Add Products & Customers",
        description: "Create your inventory, customers, and suppliers easily. Bulk import available.",
      },
      {
        title: "Start Selling",
        description: "Generate invoices, manage sales, print bills, and run your business smoothly.",
      },
    ],
  },
  ar: {
    getting_started_label: "(05) — ابدأ الآن",
    getting_started_title: "من التثبيت إلى أول عملية بيع في 5 خطوات واضحة.",
    getting_started_subtitle: "قم بإعداد نظام نقاط البيع الخاص بك في دقائق قليلة وابدأ قبول المبيعات على الفور.",
    steps: [
      {
        title: "التحميل والتثبيت",
        description: "قم بتحميل تطبيق نقاط البيع وتثبيته في دقائق. يساعدك معالج الإعداد السريع على البدء بسرعة.",
      },
      {
        title: "تسجيل الدخول أو إنشاء حساب",
        description: "قم بالتسجيل أو تسجيل الدخول بشكل آمن للوصول إلى لوحة المعلومات والمزامنة السحابية.",
      },
      {
        title: "إعداد عملك",
        description: "أضف تفاصيل الشركة وإعدادات ضريبة القيمة المضافة وتفاصيل البنك وتفضيلات الفاتورة.",
      },
      {
        title: "إضافة المنتجات والعملاء",
        description: "قم بإنشاء المخزون والعملاء والموردين بسهولة. الاستيراد الجماعي متاح.",
      },
      {
        title: "ابدأ البيع",
        description: "قم بإنشاء الفواتير وإدارة المبيعات وطباعة الفواتير وتشغيل عملك بسلاسة.",
      },
    ],
  },
  hi: {
    getting_started_label: "(05) — शुरुआत करें",
    getting_started_title: "5 स्पष्ट चरणों में स्थापना से पहली बिक्री तक।",
    getting_started_subtitle: "अपने POS सिस्टम को कुछ ही मिनटों में सेट करें और तुरंत बिक्री स्वीकार करना शुरू करें।",
    steps: [
      {
        title: "डाउनलोड और इंस्टॉल करें",
        description: "POS एप्लिकेशन को डाउनलोड करें और इसे मिनटों में इंस्टॉल करें। त्वरित सेटअप विज़ार्ड आपको जल्दी शुरू करने में मदद करता है।",
      },
      {
        title: "लॉगिन करें या खाता बनाएं",
        description: "अपने डैशबोर्ड और क्लाउड सिंक सुविधाओं तक पहुंचने के लिए सुरक्षित रूप से साइन अप या लॉगिन करें।",
      },
      {
        title: "अपना व्यवसाय सेट करें",
        description: "कंपनी का विवरण, GST सेटिंग्स, बैंक विवरण और चालान वरीयताएं जोड़ें।",
      },
      {
        title: "उत्पाद और ग्राहक जोड़ें",
        description: "आसानी से अपनी इन्वेंटरी, ग्राहक और आपूर्तिकर्ता बनाएं। बल्क आयात उपलब्ध है।",
      },
      {
        title: "बिक्री शुरू करें",
        description: "चालान बनाएं, बिक्री प्रबंधित करें, बिल प्रिंट करें और अपना व्यवसाय आसानी से चलाएं।",
      },
    ],
  },
};

const sectionLabels = [
  "Opening", "Reality", "Story", "Product",
  "Capability", "Flow", "Experience", "Motion",
  "Deploy", "Terms", "Begin",
];

/* ─────────────────────────────────────────────
   NAV DOTS
───────────────────────────────────────────── */
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
                transition={{ duration: 0.2 }}
                className="micro-label text-muted-foreground text-[0.6rem] tracking-widest"
              >
                {sectionLabels[i]}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div
            animate={{
              width: active === i ? 20 : 6,
              height: 4,
              backgroundColor:
                active === i
                  ? "hsl(265 100% 70%)"
                  : hovered === i
                  ? "hsl(265 100% 70% / 0.5)"
                  : "hsl(240 10% 8% / 0.25)",
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
    <div className="fixed top-0 left-0 right-0 h-[1px] z-[9998] bg-border/30">
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
const Magnetic = ({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode;
  strength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * strength);
      y.set((e.clientY - r.top - r.height / 2) * strength);
    },
    [x, y, strength]
  );
  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
const Counter = ({
  target,
  suffix = "",
  active,
}: {
  target: number;
  suffix?: string;
  active: boolean;
}) => {
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
      onUpdate: (v) => {
        if (el) el.textContent = Math.round(v) + suffix;
      },
    });
    return () => ctrl.stop();
  }, [active, target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

/* ─────────────────────────────────────────────
   LOADER  ← NEW
───────────────────────────────────────────── */
const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const ctrl = animate(0, 100, {
      duration: 1.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
      onComplete: () => {
        setTimeout(() => {
          setLeaving(true);
          setTimeout(onComplete, 750);
        }, 250);
      },
    });
    return () => ctrl.stop();
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-[hsl(var(--foreground))] flex flex-col items-center justify-center overflow-hidden"
      animate={leaving ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Grain overlay */}
      <div className="grain absolute inset-0 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] violet-glow opacity-25 pointer-events-none" />

      {/* Logotype */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-14"
      >
        <span className="font-serif text-2xl tracking-tight text-[hsl(var(--background))]">
          Violet<span className="font-light opacity-40">POS</span>
        </span>
      </motion.div>

      {/* Progress track */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 w-36 h-[1px] bg-[hsl(var(--background))]/10"
      >
        <div
          className="absolute inset-y-0 left-0 bg-[hsl(var(--accent))]"
          style={{ width: `${progress}%`, transition: "width 0.05s linear" }}
        />
      </motion.div>

      {/* Counter */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.35 }}
        className="relative z-10 mt-5 font-sans text-[0.62rem] text-[hsl(var(--background))] tabular-nums tracking-[0.22em]"
      >
        {String(progress).padStart(3, "0")}
      </motion.span>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
const Nav = () => {
  const { goTo } = useContext(ScrollCtx);
  return (
    <header className="fixed top-0 left-0 right-0 z-[999] bg-background/70 backdrop-blur-xl border-b border-border/40">
      <div className="flex items-center justify-between px-6 md:px-12 py-3">
        <button
          onClick={() => goTo(0)}
          className="font-serif text-xl tracking-tight"
        >
          Violet<span className="font-light opacity-50">POS</span>
        </button>

        <nav className="hidden md:flex items-center gap-10 text-sm text-muted-foreground">
          {(
            [
              ["Story", 2],
              ["Product", 3],
              ["Experience", 6],
              ["Begin", 10],
            ] as [string, number][]
          ).map(([label, idx]) => (
            <button
              key={label}
              onClick={() => goTo(idx)}
              className="hover:text-foreground transition-colors duration-300"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/917736082117"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:text-green-500 hover:border-green-500/50 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:text-pink-500 hover:border-pink-500/50 transition-all duration-300"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com/yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border/50 text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-all duration-300"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <button
            onClick={() => goTo(10)}
            className="ml-1 px-4 py-2 text-xs rounded-full border border-border text-foreground hover:bg-foreground hover:text-background transition-all duration-500"
          >
            Start Free Trial
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

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={`section-${index}`}
          className={`absolute inset-0 w-full h-full ${className}`}
          initial={v.enter}
          animate={{
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
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
   SECTION 0 — OPENING
───────────────────────────────────────────── */
const heroLayers = [
  { x: -90, y: -110, z: -240, size: 720, rotate: -12, color: "286 100% 76%", opacity: 0.32, depth: 0.72, delay: "0s" },
  { x: -100, y: -55, z: -76, size: 420, rotate: 16, color: "268 100% 78%", opacity: 0.28, depth: 0.52, delay: "0.2s" },
  { x: 90, y: -30, z: -24, size: 320, rotate: -22, color: "264 100% 84%", opacity: 0.26, depth: 0.34, delay: "0.8s" },
  { x: 55, y: 90, z: -12, size: 260, rotate: 18, color: "226 90% 78%", opacity: 0.3, depth: 0.18, delay: "1.4s" },
  { x: -42, y: 74, z: -118, size: 240, rotate: 42, color: "296 100% 74%", opacity: 0.22, depth: 0.68, delay: "0.4s" },
];

const heroDetails = [
  { left: "28%", top: "22%", width: 132, height: 88, rotate: -10, depth: 0.26, accent: "hsla(268, 100%, 82%, 0.9)" },
  { left: "72%", top: "24%", width: 136, height: 80, rotate: 12, depth: 0.18, accent: "hsla(286, 100%, 84%, 0.9)" },
  { left: "23%", top: "70%", width: 96, height: 60, rotate: 8, depth: 0.15, accent: "hsla(215, 100%, 80%, 0.9)" },
  { left: "68%", top: "76%", width: 108, height: 72, rotate: -16, depth: 0.2, accent: "hsla(295, 100%, 76%, 0.9)" },
];

const HeroBackground = ({ pointer }: { pointer: { x: number; y: number } }) => (
  <div className="hero-3d-scene absolute inset-0 pointer-events-none overflow-hidden">
    <div
      className="hero-3d-halo"
      style={{ transform: `translate3d(${pointer.x * 140}px, ${pointer.y * 108}px, 0)` }}
    />
    <div
      className="hero-3d-ring"
      style={{ transform: `translate3d(${pointer.x * 92}px, ${pointer.y * 72}px, 0)` }}
    />
    <div
      className="hero-3d-core"
      style={{
        transform: `perspective(1400px) rotateX(${10 + pointer.y * 32}deg) rotateY(${pointer.x * 34}deg) translate3d(${pointer.x * 128}px, ${pointer.y * 98}px, -24px) scale(${1 + pointer.y * 0.31})`,
      }}
    />
    <div className="hero-3d-grid" />
    {heroLayers.map((layer, index) => (
      <div
        key={index}
        className="hero-3d-layer"
        style={{
          width: `${layer.size}px`,
          height: `${layer.size}px`,
          left: `calc(50% + ${layer.x}px)`,
          top: `calc(50% + ${layer.y}px)`,
          transform: `translate3d(calc(-50% + ${pointer.x * layer.depth * 520}px), calc(-50% + ${pointer.y * layer.depth * 520}px), ${layer.z + pointer.y * 18}px) rotate(${layer.rotate + pointer.x * 10}deg) rotateX(${pointer.y * 18}deg) rotateY(${pointer.x * 10}deg) scale(${1 + pointer.y * 0.42 * layer.depth})`,
          opacity: layer.opacity,
          animationDelay: layer.delay,
        }}
      >
        <div
          className="hero-3d-card"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsla(${layer.color}, 0.35), transparent 55%)`,
            borderColor: `hsla(${layer.color}, 0.28)`,
            boxShadow: `0 48px 120px -58px hsla(${layer.color}, 0.28)`,
          }}
        />
      </div>
    ))}

    {heroDetails.map((detail, index) => (
      <div
        key={index}
        className="hero-3d-detail"
        style={{
          left: detail.left,
          top: detail.top,
          width: `${detail.width}px`,
          height: `${detail.height}px`,
          transform: `translate3d(calc(-50% + ${pointer.x * detail.depth * 420}px), calc(-50% + ${pointer.y * detail.depth * 420}px), 0) rotate(${detail.rotate + pointer.x * 8}deg) rotateX(${pointer.y * 14}deg) scale(${1 + pointer.y * 0.3})`,
        }}
      >
        <div
          className="hero-3d-detail-card"
          style={{ borderColor: detail.accent, boxShadow: `0 20px 50px -18px ${detail.accent}` }}
        >
          <div className="hero-3d-detail-header" />
          <div className="hero-3d-detail-lines">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RealityParticles = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) {
      setPointer({ x: 0, y: 0 });
      return;
    }

    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const xPct = (e.clientX - r.left) / r.width;
      const yPct = (e.clientY - r.top) / r.height;
      setPointer({ x: (xPct - 0.5) * 2.4, y: (yPct - 0.5) * 2.4 });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isActive]);

  const dots = [
    { left: "16%", top: "18%", size: 92, x: -1.2, y: 1.1, color: "hsla(273, 100%, 80%, 0.62)" },
    { left: "74%", top: "12%", size: 108, x: 1.8, y: -1.4, color: "hsla(300, 100%, 85%, 0.54)" },
    { left: "42%", top: "72%", size: 112, x: -1.6, y: 1.7, color: "hsla(245, 88%, 86%, 0.5)" },
  ];

  return (
    <div
      ref={containerRef}
      className="section-3d-scene absolute inset-0 overflow-hidden"
      style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      <div
        className="section-3d-glow"
        style={{ transform: `translate3d(${pointer.x * 48}px, ${pointer.y * 42}px, 0)` }}
      />
      <div
        className="section-3d-ring-soft"
        style={{ transform: `translate3d(${pointer.x * 82}px, ${pointer.y * 56}px, 0)` }}
      />
      <div
        className="section-3d-grid-soft"
        style={{ transform: `translate3d(${pointer.x * -26}px, ${pointer.y * -18}px, 0)` }}
      />
      {dots.map((dot, index) => (
        <div
          key={index}
          className="section-3d-dot"
          style={{
            left: dot.left,
            top: dot.top,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            background: `radial-gradient(circle, ${dot.color}, transparent 58%)`,
            transform: `translate3d(${pointer.x * dot.x}px, ${pointer.y * dot.y}px, 0)`,
          }}
        />
      ))}
    </div>
  );
};

const Opening = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef<number | null>(null);
  const idleAnimRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [idlePointer, setIdlePointer] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true);
  const isIdleRef = useRef(true);
  const frameRef = useRef<number | null>(null);

  const startPointerLoop = useCallback(() => {
    if (frameRef.current !== null) return;

    const tick = () => {
      const target = pointerTargetRef.current;
      const current = pointerCurrentRef.current;
      const nextX = current.x + (target.x - current.x) * 0.14;
      const nextY = current.y + (target.y - current.y) * 0.14;
      pointerCurrentRef.current = { x: nextX, y: nextY };
      setPointer(pointerCurrentRef.current);

      if (
        Math.abs(nextX - target.x) > 0.001 ||
        Math.abs(nextY - target.y) > 0.001 ||
        isIdleRef.current
      ) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const onMouse = useCallback(
    (e: React.MouseEvent) => {
      if (!glowRef.current || !containerRef.current) return;
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      setIsIdle(false);
      if (idleAnimRef.current) {
        window.cancelAnimationFrame(idleAnimRef.current);
        idleAnimRef.current = null;
      }

      const r = containerRef.current.getBoundingClientRect();
      const xPct = (e.clientX - r.left) / r.width;
      const yPct = (e.clientY - r.top) / r.height;
      glowRef.current.style.left = `${xPct * 100}%`;
      glowRef.current.style.top = `${yPct * 100}%`;
      pointerTargetRef.current = {
        x: (xPct - 0.5) * 4.3,
        y: (yPct - 0.5) * 4.3,
      };
      startPointerLoop();
      idleTimerRef.current = window.setTimeout(() => setIsIdle(true), 1400);
    },
    [startPointerLoop]
  );

  const onLeave = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => setIsIdle(true), 1400);
  }, []);

  useEffect(() => {
    isIdleRef.current = isIdle;
  }, [isIdle]);

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (idleAnimRef.current) window.cancelAnimationFrame(idleAnimRef.current);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isIdle) {
      if (idleAnimRef.current) {
        window.cancelAnimationFrame(idleAnimRef.current);
        idleAnimRef.current = null;
      }
      setIdlePointer({ x: 0, y: 0 });
      return;
    }

    let start = performance.now();
    const animateIdle = (time: number) => {
      const t = (time - start) / 1200;
      const x = Math.sin(t * 1.1) * 0.08;
      const y = Math.cos(t * 0.9) * 0.06;
      setIdlePointer({ x, y });
      idleAnimRef.current = window.requestAnimationFrame(animateIdle);
    };

    idleAnimRef.current = window.requestAnimationFrame(animateIdle);
    return () => {
      if (idleAnimRef.current) window.cancelAnimationFrame(idleAnimRef.current);
      idleAnimRef.current = null;
    };
  }, [isIdle]);

  return (
    <div
      ref={containerRef}
      className="relative h-full flex flex-col justify-between px-6 md:px-12 py-28 overflow-hidden grain"
      style={{ perspective: 1400, perspectiveOrigin: "50% 50%" }}
      onMouseMove={onMouse}
      onMouseLeave={onLeave}
    >
      <HeroBackground pointer={{ x: pointer.x + (isIdle ? idlePointer.x : 0), y: pointer.y + (isIdle ? idlePointer.y : 0) }} />
      {/* Mouse-tracked glow */}
      <div
        ref={glowRef}
        className="absolute w-[70vw] h-[70vw] violet-glow animate-glow-pulse pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-700 ease-out"
        style={{ left: "50%", top: "45%" }}
      />

      {/* Meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 flex justify-between items-start micro-label opacity-40 text-muted-foreground"
      >
        <span>(01) — Manifesto</span>
        <span className="hidden md:block">Est. 2026 / Edition Nº1</span>
      </motion.div>

      {/* Hero text */}
      <div className="relative z-10 max-w-[1400px]">
        <h1 className="editorial-display text-[13vw] md:text-[9.5vw] leading-[0.9] tracking-tight text-balance">
          <RevealText
            text="Not Just Another POS System"
            isActive={isActive}
            delay={0.3}
          />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: EASE }}
          className="mt-10 md:mt-16 editorial-display text-[7vw] md:text-[4.5vw] text-[hsl(var(--accent))]"
        >
          It's a better way to sell
        </motion.p>
      </div>

      {/* Footer row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.5 } : { opacity: 0 }}
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
        <span className="hidden md:block text-right leading-relaxed">
          Business, simplified.
          <br />
          Control, visualized.
        </span>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 1 — REALITY BREAK  ← FIXED
───────────────────────────────────────────── */
const RealityBreak = ({ isActive }: { isActive: boolean }) => {
  const chips = [
    { label: "Customer management",     hi: true,  x: 2,  y: 9  },
    { label: "Inventory tracking",      hi: true,  x: 68, y: 7  },
    { label: "GST · CGST · VAT · GCC",  hi: true,  x: 1,  y: 48 },
    { label: "ZATCA QR",                hi: true,  x: 80, y: 52 },
    { label: "Sales reports",           hi: false, x: 2,  y: 84 },
    { label: "Quotations",              hi: false, x: 70, y: 87 },
    { label: "A4 & thermal print",      hi: false, x: 27, y: 4  },
    { label: "Cloud or local",          hi: false, x: 44, y: 91 },
  ];

  const floatY = [
    [-9, 7],  [-6, 10], [8, -6],  [-5, 11],
    [10, -8], [6, -10], [-11, 5], [7, -9],
  ];
  const durs = [4.1, 3.7, 5.2, 4.5, 3.6, 5.3, 4.2, 3.3];

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 md:px-28 text-center overflow-hidden relative">
      <RealityParticles isActive={isActive} />
      {/* Ambient glow */}
      <div className="absolute inset-0 violet-glow opacity-15 pointer-events-none" />

      {/* ── Floating chips across the full section ── */}
      {chips.map((chip, i) => (
        <motion.span
          key={chip.label}
          initial={{ opacity: 0 }}
          animate={
            isActive
              ? {
                  opacity: 1,
                  y: floatY[i] as [number, number],
                }
              : { opacity: 0 }
          }
          transition={{
            opacity: { duration: 0.7, delay: 0.2 + i * 0.09 },
            y: {
              duration: durs[i],
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
              delay: i * 0.3,
            },
          }}
          style={{
            position: "absolute",
            left: `${chip.x}%`,
            top: `${chip.y}%`,
            rotate: ((i % 3) - 1) * 1.5,
          }}
          className={`text-[0.6rem] md:text-[0.65rem] px-3 py-[5px] rounded-full border
            whitespace-nowrap pointer-events-none select-none z-10 ${
              chip.hi
                ? "bg-[hsl(265_100%_70%/0.08)] border-[hsl(265_100%_70%/0.35)] text-[hsl(265_100%_72%)]"
                : "bg-background/50 border-border/60 text-muted-foreground"
            }`}
        >
          {chip.label}
        </motion.span>
      ))}

      {/* Pre-paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className="relative z-20 font-sans text-sm md:text-[15px] text-muted-foreground
          max-w-md leading-[1.9] mb-10"
      >
        Most businesses run on disconnected tools — a spreadsheet here, a receipt
        printer there, a phone call for inventory. You spend more time{" "}
        <span className="text-foreground font-medium">managing the system</span>{" "}
        than running your business. Billing slows at checkout. Stock goes missing.
        Reports arrive too late to act on.
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
        style={{ transformOrigin: "center" }}
        className="relative z-20 w-8 h-[1px] bg-border mb-10"
      />

      {/* Central statement */}
      <motion.h2
        initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
        animate={
          isActive
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0 }
        }
        transition={{ duration: 1.2, delay: 0.65, ease: EASE }}
        className="relative z-20 editorial-display text-[6.5vw] md:text-[4.5vw]
          text-balance max-w-[22ch] mb-10 leading-[1.05]"
      >
        Everything you thought about POS is wrong.
      </motion.h2>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, delay: 1.15, ease: EASE }}
        style={{ transformOrigin: "center" }}
        className="relative z-20 w-8 h-[1px] bg-border mb-10"
      />

      {/* Post-paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.25, ease: EASE }}
        className="relative z-20 font-sans text-sm md:text-[15px] text-muted-foreground
          max-w-lg leading-[1.9]"
      >
        <span className="text-foreground font-medium">VioletPos</span> gives you one
        unified surface —{" "}
        <span className="text-foreground font-medium">
          customers, suppliers and products
        </span>{" "}
        managed together with unlimited review history. Real-time{" "}
        <span className="text-foreground font-medium">
          sales dashboards and detailed reports
        </span>
        ,{" "}
        <span className="text-foreground font-medium">
          purchase &amp; inventory tracking
        </span>
        ,{" "}
        <span className="text-foreground font-medium">
          GST, CGST, VAT &amp; GCC
        </span>{" "}
        tax support,{" "}
        <span className="text-foreground font-medium">ZATCA QR</span> compliance,
        flexible{" "}
        <span className="text-foreground font-medium">A4 &amp; thermal printing</span>
        , and instant{" "}
        <span className="text-foreground font-medium">quotation creation</span>.
      </motion.p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 2 — NARRATIVE
───────────────────────────────────────────── */
const NarrativeDepth = ({ pointer }: { pointer: { x: number; y: number } }) => {
  const nodes = [
    { left: "16%", top: "18%", size: 90, depth: 0.22, hue: 278, rotate: -16 },
    { left: "72%", top: "24%", size: 110, depth: 0.18, hue: 292, rotate: 20 },
    { left: "24%", top: "70%", size: 72, depth: 0.14, hue: 232, rotate: 8 },
  ];

  return (
    <div className="narrative-3d-scene absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="narrative-3d-grid"
        style={{ transform: `translate3d(${pointer.x * 24}px, ${pointer.y * 18}px, 0)` }}
      />
      <div
        className="narrative-3d-ring"
        style={{ transform: `translate3d(${pointer.x * 38}px, ${pointer.y * 30}px, 0) rotate(${pointer.x * 4}deg)` }}
      />
      {nodes.map((node, index) => (
        <div
          key={index}
          className="narrative-3d-blob"
          style={{
            left: node.left,
            top: node.top,
            width: `${node.size}px`,
            height: `${node.size}px`,
            transform: `translate3d(${pointer.x * node.depth * 72}px, ${pointer.y * node.depth * 72}px, 0) rotate(${node.rotate + pointer.x * 8}deg)`,
            background: `radial-gradient(circle at 30% 30%, hsla(${node.hue}, 100%, 82%, 0.65), transparent 52%)`,
            borderColor: `hsla(${node.hue}, 100%, 82%, 0.32)`,
          }}
        />
      ))}
    </div>
  );
};

const Narrative = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const isIdleRef = useRef(true);
  const idleTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true);

  const startPointerLoop = useCallback(() => {
    if (frameRef.current !== null) return;

    const tick = () => {
      const target = isIdleRef.current ? { x: 0, y: 0 } : pointerTargetRef.current;
      const current = pointerCurrentRef.current;
      const speed = isIdleRef.current ? 0.08 : 0.26;
      const nextX = current.x + (target.x - current.x) * speed;
      const nextY = current.y + (target.y - current.y) * speed;
      pointerCurrentRef.current = { x: nextX, y: nextY };
      setPointer(pointerCurrentRef.current);

      if (
        Math.abs(nextX - target.x) > 0.001 ||
        Math.abs(nextY - target.y) > 0.001 ||
        !isIdleRef.current
      ) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true);
      isIdleRef.current = true;
      pointerTargetRef.current = { x: 0, y: 0 };
      startPointerLoop();
    }, 1200);
  }, [startPointerLoop]);

  const onPointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      setIsIdle(false);
      isIdleRef.current = false;

      const rect = containerRef.current.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;
      pointerTargetRef.current = {
        x: (xPct - 0.5) * 3.0,
        y: (yPct - 0.5) * 3.0,
      };
      startPointerLoop();
      resetIdleTimer();
    },
    [resetIdleTimer, startPointerLoop]
  );

  const onLeave = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  const onWheel = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    setIsIdle(false);
    isIdleRef.current = false;
    startPointerLoop();
    resetIdleTimer();
  }, [resetIdleTimer, startPointerLoop]);

  useEffect(() => {
    if (!isActive) {
      setPointer({ x: 0, y: 0 });
      pointerTargetRef.current = { x: 0, y: 0 };
      pointerCurrentRef.current = { x: 0, y: 0 };
      setIsIdle(true);
      isIdleRef.current = true;
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [isActive]);

  const lines = [
    { text: "Your business is not spreadsheets.", align: "left" as const,   dx: -60 },
    { text: "It's people. Products. Decisions.",  align: "right" as const,  dx: 60  },
    { text: "You need clarity.",                  align: "center" as const, dx: 0   },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={onPointerMove}
      onMouseLeave={onLeave}
      onWheel={onWheel}
      className="h-full flex flex-col justify-center px-6 md:px-12 py-24 overflow-hidden relative"
    >
      <NarrativeDepth pointer={pointer} />
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.45 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label text-muted-foreground mb-16"
      >
        (02) — A quiet observation
      </motion.p>
      <div className="space-y-10 md:space-y-16 max-w-[1400px] mx-auto w-full">
        {lines.map((l, i) => (
          <div
            key={i}
            className={`flex ${
              l.align === "right"
                ? "justify-end"
                : l.align === "center"
                ? "justify-center"
                : "justify-start"
            }`}
          >
            <motion.h2
              initial={{
                opacity: 0,
                x: l.dx,
                y: l.align === "center" ? 40 : 0,
              }}
              animate={isActive ? { opacity: 1, x: 0, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1.1, delay: i * 0.2, ease: EASE }}
              className="editorial-display text-[8vw] md:text-[5vw] max-w-[14ch] text-balance"
            >
              {l.text}
            </motion.h2>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 3 — PRODUCT REVEAL
───────────────────────────────────────────── */
const ProductRevealDepth = ({ pointer }: { pointer: { x: number; y: number } }) => {
  const panels = [
    { left: "14%", top: "18%", width: 184, height: 130, depth: 0.22, rotate: -10, hue: 280 },
    { left: "76%", top: "14%", width: 156, height: 116, depth: 0.18, rotate: 12, hue: 256 },
    { left: "52%", top: "68%", width: 140, height: 94, depth: 0.14, rotate: -6, hue: 236 },
  ];

  return (
    <div className="product-3d-scene absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="product-3d-halo"
        style={{ transform: `translate3d(${pointer.x * 48}px, ${pointer.y * 34}px, 0)` }}
      />
      <div
        className="product-3d-grid"
        style={{ transform: `translate3d(${pointer.x * -18}px, ${pointer.y * -14}px, 0)` }}
      />
      {panels.map((panel, index) => (
        <div
          key={index}
          className="product-3d-panel"
          style={{
            left: panel.left,
            top: panel.top,
            width: `${panel.width}px`,
            height: `${panel.height}px`,
            transform: `translate3d(${pointer.x * panel.depth * 96}px, ${pointer.y * panel.depth * 96}px, 0) rotate(${panel.rotate + pointer.x * 6}deg) rotateX(${pointer.y * 8}deg)`,
            background: `linear-gradient(135deg, hsla(${panel.hue}, 100%, 80%, 0.28), hsla(${panel.hue}, 100%, 84%, 0.14))`,
            borderColor: `hsla(${panel.hue}, 100%, 82%, 0.24)`,
          }}
        />
      ))}
    </div>
  );
};

const ProductReveal = ({ isActive }: { isActive: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const isIdleRef = useRef(true);
  const idleTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(true);

  const startPointerLoop = useCallback(() => {
    if (frameRef.current !== null) return;

    const tick = () => {
      const target = isIdleRef.current ? { x: 0, y: 0 } : pointerTargetRef.current;
      const current = pointerCurrentRef.current;
      const speed = isIdleRef.current ? 0.08 : 0.24;
      const nextX = current.x + (target.x - current.x) * speed;
      const nextY = current.y + (target.y - current.y) * speed;
      pointerCurrentRef.current = { x: nextX, y: nextY };
      setPointer(pointerCurrentRef.current);

      if (
        Math.abs(nextX - target.x) > 0.001 ||
        Math.abs(nextY - target.y) > 0.001 ||
        !isIdleRef.current
      ) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true);
      isIdleRef.current = true;
      pointerTargetRef.current = { x: 0, y: 0 };
      startPointerLoop();
    }, 1200);
  }, [startPointerLoop]);

  const onPointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      setIsIdle(false);
      isIdleRef.current = false;

      const rect = containerRef.current.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;
      pointerTargetRef.current = {
        x: (xPct - 0.5) * 2.8,
        y: (yPct - 0.5) * 2.8,
      };
      startPointerLoop();
      resetIdleTimer();
    },
    [resetIdleTimer, startPointerLoop]
  );

  const onLeave = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  const onWheel = useCallback(() => {
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    setIsIdle(false);
    isIdleRef.current = false;
    startPointerLoop();
    resetIdleTimer();
  }, [resetIdleTimer, startPointerLoop]);

  useEffect(() => {
    if (!isActive) {
      setPointer({ x: 0, y: 0 });
      pointerTargetRef.current = { x: 0, y: 0 };
      pointerCurrentRef.current = { x: 0, y: 0 };
      setIsIdle(true);
      isIdleRef.current = true;
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [isActive]);

  const features = [
    "Customer, Supplier & Product Management",
    "Unlimited Reviews per Entity",
    "Sales Dashboard & Detailed Reports",
    "Purchase & Inventory Tracking",
    "Tax Config — GST, CGST, VAT, GCC",
    "ZATCA QR Code (Saudi Compliance)",
    "Flexible A4 & Thermal Printing",
    "Quotation Creation",
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={onPointerMove}
      onMouseLeave={onLeave}
      onWheel={onWheel}
      className="h-full flex items-center px-6 md:px-12 overflow-hidden relative"
    >
      <ProductRevealDepth pointer={pointer} />
      <div className="absolute inset-0 violet-glow opacity-25 pointer-events-none" />
      <div className="relative max-w-[1500px] mx-auto w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.5 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="micro-label text-muted-foreground mb-10"
        >
          (03) — Discover the instrument
        </motion.p>
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Device image */}
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={isActive ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="md:col-span-5 relative"
          >
            <img
              src={heroDevice}
              alt="VioletPOS terminal"
              className="w-full h-auto"
              style={{ boxShadow: "var(--shadow-soft)" }}
            />
            {/* Accent rule */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isActive ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EASE }}
              style={{ transformOrigin: "top" }}
              className="absolute -left-5 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[hsl(var(--accent))] to-transparent"
            />
          </motion.div>

          {/* Right content */}
          <div className="md:col-span-6 md:col-start-7 space-y-7">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="editorial-display text-[7vw] md:text-[3.2vw] text-balance"
            >
              A single surface for every{" "}
              <em className="text-[hsl(var(--accent))] not-italic font-serif italic">
                decision
              </em>{" "}
              you make.
            </motion.h2>

            {/* Feature list */}
            <div className="space-y-[10px]">
              {features.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.3 + i * 0.07,
                    ease: EASE,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="w-[5px] h-[5px] rounded-full bg-[hsl(var(--accent))] shrink-0" />
                  <span className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                    {feat}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: EASE }}
            >
              <img
                src={uiDashboard}
                alt="Dashboard preview"
                className="w-full h-auto border border-border"
                style={{ boxShadow: "var(--shadow-soft)" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 4 — CAPABILITY
───────────────────────────────────────────── */
const Capability = ({ isActive }: { isActive: boolean }) => {
  const items = [
    { left: "You don't track sales.",  right: "You understand them." },
    { left: "You don't manage stock.", right: "You control it."      },
    { left: "You don't store data.",   right: "You own it."          },
  ];

  return (
    <div className="h-full flex flex-col justify-center px-6 md:px-12 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] overflow-hidden relative">
      <div className="grain absolute inset-0 pointer-events-none" />
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.45 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label mb-14 relative z-10"
      >
        (04) — A different verb
      </motion.p>
      <div className="max-w-[1400px] mx-auto w-full space-y-8 md:space-y-10 relative z-10">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, delay: i * 0.15, ease: EASE }}
            className="grid md:grid-cols-2 gap-4 md:gap-16 items-baseline
              border-b border-[hsl(var(--background))]/8 pb-8"
          >
            <p className="editorial-display text-[7vw] md:text-[3.8vw] opacity-20 line-through decoration-1">
              {it.left}
            </p>
            <p className="editorial-display text-[7vw] md:text-[3.8vw] italic text-[hsl(var(--accent-glow))]">
              {it.right}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 5 — MARQUEE
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   SECTION 5 — GETTING STARTED (REDESIGNED)
───────────────────────────────────────────── */
const GetStartedStep = ({
  step,
  title,
  description,
  icon,
  isActive,
  index,
  expanded,
}: {
  step: number;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  index: number;
  expanded?: boolean;
}) => {
  const extendedDesc = expanded
    ? description +
      " Manage your invoice templates, choose between A4 or thermal printing, set up payment methods, and configure default tax rules all in one centralized location."
    : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="group"
    >
      <div className={`space-y-4 ${expanded ? "h-full" : ""}`}>
        {/* Step circle */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--accent))]/25 to-[hsl(var(--accent))]/8 border border-[hsl(var(--accent))]/40 flex items-center justify-center backdrop-blur-sm overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(var(--accent))]/0 via-[hsl(var(--accent))]/25 to-[hsl(var(--accent))]/0"
          />
          <span className="relative z-10 text-xl font-bold text-[hsl(var(--accent))]">{step}</span>
        </motion.div>

        {/* Content */}
        <div className="space-y-2 flex-1">
          <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">
            {title}
          </h3>
          <p className={`text-sm text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {extendedDesc}
          </p>
        </div>

        {/* Icon area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: index * 0.1 }}
          className={`p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--accent))]/12 to-[hsl(var(--accent))]/4 border border-[hsl(var(--accent))]/20 backdrop-blur-sm flex items-center justify-center text-[hsl(var(--accent))]/50 hover:text-[hsl(var(--accent))]/70 transition-colors ${
            expanded ? "h-32" : "h-20"
          }`}
        >
          <div className="text-6xl md:text-7xl opacity-40">{icon}</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MarqueeSection = ({ isActive }: { isActive: boolean }) => {
  const { language, setLanguage } = useContext(LanguageCtx);
  const translation = translations[language];

  const stepIcons = [
    <Download className="h-9 w-9" />, 
    <Lock className="h-9 w-9" />,
    <Settings className="h-9 w-9" />,
    <Package className="h-9 w-9" />,
    <CreditCard className="h-9 w-9" />,
  ];

  const steps = translation.steps.map((step, index) => ({
    step: index + 1,
    title: step.title,
    description: step.description,
    icon: stepIcons[index],
  }));

  return (
    <div className="relative w-full h-full overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="section-3d-grid-soft" />
        <div
          className="section-3d-dot"
          style={{
            left: "10%",
            top: "20%",
            width: "14rem",
            height: "14rem",
            background: "rgba(205,172,255,0.18)",
          }}
        />
        <div
          className="section-3d-dot"
          style={{
            left: "75%",
            top: "18%",
            width: "12rem",
            height: "12rem",
            background: "rgba(217,197,255,0.12)",
          }}
        />
        <div
          className="section-3d-dot"
          style={{
            left: "50%",
            bottom: "8%",
            width: "20rem",
            height: "20rem",
            background: "rgba(188,148,255,0.10)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-full">
        <div className="px-6 md:px-12 pt-20 md:pt-28 pb-8 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto max-w-5xl text-center"
          >
            <p className="micro-label text-[hsl(var(--accent))] tracking-[0.26em] uppercase text-[0.75rem]">
              {translation.getting_started_label}
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-[hsl(var(--foreground))]">
              {translation.getting_started_title}
            </h2>
            <p className="mt-4 mx-auto max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
              {translation.getting_started_subtitle}
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 px-6 md:px-12 pb-16 md:pb-20">
          <div className="mx-auto max-w-8xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 22 }}
                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.65, delay: index * 0.08, ease: EASE }}
                  className="group relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_40px_90px_-48px_rgba(88,71,193,0.22)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_42px_100px_-45px_rgba(88,71,193,0.34)] dark:border-slate-700/70 dark:bg-slate-950/85 dark:shadow-[0_40px_100px_-45px_rgba(0,0,0,0.45)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,94,255,0.18),transparent_45%)] opacity-80" />
                  <div className="relative flex flex-1 flex-col p-8">
                      <div className="flex h-24 items-center justify-center rounded-[2rem] bg-[hsl(var(--accent))]/10 p-5 text-[hsl(var(--accent))] shadow-[0_12px_30px_-18px_rgba(88,71,193,0.25)]">
                      {step.icon}
                    </div>

                    <div className="mt-6 flex-1 space-y-4 text-center">
                      <h3 className="text-lg md:text-xl font-semibold text-[hsl(var(--foreground))]">
                        {step.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                        Step {step.step}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 6 — GALLERY
───────────────────────────────────────────── */
const Gallery = ({ isActive }: { isActive: boolean }) => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState(0);

  const items = [
    { src: uiDashboard, label: "Dashboard", num: "01", desc: "Real-time sales overview"       },
    { src: uiBilling,   label: "Billing",   num: "02", desc: "Fast, frictionless checkout"    },
    { src: uiReports,   label: "Reports",   num: "03", desc: "Insights that drive decisions"  },
    { src: uiInventory, label: "Inventory", num: "04", desc: "Stock control, simplified"      },
  ];

  return (
    <div className="h-full flex flex-col justify-between px-6 md:px-16 py-10 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex justify-between items-end pt-16 md:pt-14"
      >
        <p className="micro-label opacity-45 text-muted-foreground">(06) — In use</p>
      </motion.div>

      {/* Main area */}
      <div className="flex gap-4 md:gap-6 flex-1 min-h-0 mt-6">
        {/* Thumbnail strip */}
        <div className="flex flex-col gap-3 justify-center w-[72px] md:w-[88px] shrink-0">
          {items.map((it, i) => (
            <motion.button
              key={it.num}
              onClick={() => setActiveCard(i)}
              initial={{ opacity: 0, x: -16 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
              className="relative focus:outline-none"
              data-cursor="View"
            >
              <div
                className={`relative overflow-hidden transition-all duration-500 ${
                  activeCard === i
                    ? "ring-2 ring-[hsl(var(--accent))] ring-offset-2 ring-offset-background"
                    : "opacity-35 hover:opacity-60"
                }`}
              >
                <img
                  src={it.src}
                  alt={it.label}
                  className="w-full aspect-video object-cover object-top"
                />
              </div>
              <p
                className={`mt-1 micro-label text-[0.55rem] transition-colors duration-300 ${
                  activeCard === i
                    ? "text-[hsl(var(--accent))]"
                    : "text-muted-foreground"
                }`}
              >
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
          className="flex-1 relative min-h-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute inset-0"
            >
              <img
                src={items[activeCard].src}
                alt={items[activeCard].label}
                className="w-full h-full object-cover object-top border border-border"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end">
                <div>
                  <p className="micro-label text-background/40 text-[0.6rem] mb-1">
                    {items[activeCard].num} / {items.length}
                  </p>
                  <p className="font-serif italic text-xl md:text-2xl text-background leading-none">
                    {items[activeCard].label}
                  </p>
                  <p className="font-sans text-xs text-background/50 mt-1">
                    {items[activeCard].desc}
                  </p>
                </div>
                <button
                  onClick={() => setLightbox(items[activeCard].src)}
                  data-cursor="Expand"
                  className="w-10 h-10 border border-background/25 flex items-center justify-center
                    text-background hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]
                    transition-colors duration-300"
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
          <button key={i} onClick={() => setActiveCard(i)} className="focus:outline-none">
            <motion.div
              animate={{
                width: activeCard === i ? 24 : 6,
                backgroundColor:
                  activeCard === i
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
              className="absolute top-6 right-6 text-background w-12 h-12 border border-background/20
                flex items-center justify-center hover:border-[hsl(var(--accent))] transition-colors"
              onClick={() => setLightbox(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.93, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-full object-contain"
              style={{ boxShadow: "var(--shadow-glow)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 7 — VIDEO
───────────────────────────────────────────── */
const VideoSection = ({ isActive }: { isActive: boolean }) => (
  <div className="h-full flex flex-col justify-center px-6 md:px-12 bg-[hsl(var(--foreground))] relative overflow-hidden">
    <div className="grain absolute inset-0 pointer-events-none" />
    <div className="max-w-[1500px] mx-auto w-full relative z-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.45 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label text-[hsl(var(--background))]/40 mb-8"
      >
        (07) — In motion
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className="relative w-full aspect-[16/9] overflow-hidden"
      >
        <video
          src="/demo.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center
              backdrop-blur-sm bg-white/5 cursor-pointer"
          >
            <Play className="w-5 h-5 text-white fill-white ml-1" />
          </motion.div>
        </div>
        <div className="absolute bottom-6 left-6">
          <p className="font-serif italic text-base text-white/50">
            Watch VioletPos in action
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   SECTION 8 — FLEXIBILITY  ← REBUILT
   Combines deployment options + step-by-step
───────────────────────────────────────────── */
const Flexibility = ({ isActive }: { isActive: boolean }) => {
  const [mode, setMode] = useState<"standalone" | "cloud">("standalone");

  const steps = [
    { num: "01", label: "Download",  desc: "Get VioletPos installer for Windows or Mac" },
    { num: "02", label: "Install",   desc: "One-click local setup, no server needed"    },
    { num: "03", label: "Trial",     desc: "Activate your full 20-day free trial"       },
    { num: "04", label: "Subscribe", desc: "Monthly or yearly — cancel anytime"         },
  ];

  const modes = {
    standalone: {
      title: "Standalone Desktop",
      desc: "Runs entirely on your device. No internet required. Full speed, full control. Your data stays local.",
      perks: ["No cloud dependency", "Works fully offline", "Instant startup", "Full data ownership"],
    },
    cloud: {
      title: "Optional Cloud Setup",
      desc: "Enable multi-device access and mobile viewing. Sync on demand. Scale when your business grows.",
      perks: ["Multi-device access", "Mobile viewing", "Real-time sync", "Remote reporting"],
    },
  };

  const current = modes[mode];

  return (
    <div className="h-full flex items-center px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Left — Step-by-step */}
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 0.5 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="micro-label text-muted-foreground"
          >
            (08) — Getting started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="editorial-display text-[9vw] md:text-[4.5vw] text-balance"
          >
            Up and running in{" "}
            <em className="italic font-serif text-[hsl(var(--accent))]">minutes.</em>
          </motion.h2>

          <div className="space-y-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -24 }}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.11, ease: EASE }}
                className="flex items-start gap-5"
              >
                <span className="micro-label text-[hsl(var(--accent))] opacity-60 mt-1 shrink-0 w-6">
                  {step.num}
                </span>
                <div className="border-t border-border/50 pt-3 flex-1">
                  <p className="font-serif text-lg text-foreground leading-snug">
                    {step.label}
                  </p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — Deployment toggle */}
        <div className="space-y-6">
          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
            className="flex gap-1 p-1 border border-border w-fit"
          >
            {(["standalone", "cloud"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative px-5 py-2 text-xs tracking-widest uppercase transition-all duration-300 ${
                  mode === m
                    ? "text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="modeHighlight"
                    className="absolute inset-0 bg-foreground"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {m === "standalone" ? (
                    <Monitor className="w-3 h-3" />
                  ) : (
                    <Cloud className="w-3 h-3" />
                  )}
                  {m === "standalone" ? "Local" : "Cloud"}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Mode content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="space-y-5"
            >
              <h3 className="editorial-display text-[6vw] md:text-[2.8vw]">
                {current.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-sm">
                {current.desc}
              </p>
              <div className="space-y-[10px] pt-1">
                {current.perks.map((perk, i) => (
                  <motion.div
                    key={perk}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.07, ease: EASE }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-4 h-4 rounded-full bg-[hsl(var(--accent))]/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[hsl(var(--accent))]" />
                    </div>
                    <span className="font-sans text-sm text-foreground">{perk}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Device stack visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="relative h-28 mt-2"
          >
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i - 2) * 13;
              const xOffset = (i - 2) * 48;
              return (
                <motion.div
                  key={i}
                  animate={
                    isActive
                      ? {
                          opacity: i === 2 ? 1 : 0.35,
                          x: xOffset,
                          rotate: angle,
                          scale: i === 2 ? 1.06 : 0.92,
                        }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 1.2, delay: i * 0.07, ease: EASE }}
                  className="absolute left-1/2 top-0 w-16 md:w-20 aspect-[3/4] bg-foreground border border-border"
                  style={{ marginLeft: -40 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--accent))]/20 via-foreground to-foreground p-2 flex flex-col justify-between">
                    <div className="micro-label text-[0.42rem] opacity-35 text-background/50">
                      {mode === "cloud" && i !== 2 ? "Remote" : `Device ${i + 1}`}
                    </div>
                    <div className="w-full h-[1px] bg-[hsl(var(--accent-glow))]/40" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 9 — TRUST
───────────────────────────────────────────── */
const Trust = ({ isActive }: { isActive: boolean }) => {
  const items = [
    {
      k: 20,
      symbol: "",
      v: "Days, free.",
      note: "Full product. No commitments.",
      sub: "Everything included from day one.",
    },
    {
      k: 1,
      symbol: "",
      v: "Subscription.",
      note: "Monthly or yearly. Cancel anytime.",
      sub: "No lock-in. No hidden fees.",
    },
    {
      k: null,
      symbol: "∞",
      v: "Conversation.",
      note: "Onboarding by humans.",
      sub: "Real support — not a chatbot.",
    },
  ];

  return (
    <div className="h-full flex flex-col justify-center px-6 md:px-12">
      <motion.p
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="micro-label text-muted-foreground mb-16 max-w-[1400px] mx-auto w-full"
      >
        (09) — The terms
      </motion.p>
      <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-3 gap-10 md:gap-16">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 1, delay: i * 0.15, ease: EASE }}
            className="border-t border-foreground/12 pt-8 space-y-3"
          >
            <div className="editorial-display text-[15vw] md:text-[6.5vw] text-[hsl(var(--accent))] leading-none">
              {it.k !== null ? (
                <Counter target={it.k} active={isActive} />
              ) : (
                it.symbol
              )}
            </div>
            <p className="font-serif italic text-xl md:text-2xl text-foreground">
              {it.v}
            </p>
            <p className="font-sans text-sm text-muted-foreground">{it.note}</p>
            <p className="font-sans text-xs text-muted-foreground/55 italic">
              {it.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION 10 — FINAL CTA
───────────────────────────────────────────── */
const FinalCTA = ({ isActive }: { isActive: boolean }) => {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const fields = [
    { name: "name",    placeholder: "Name",    type: "text",  required: true  },
    { name: "mobile",  placeholder: "Mobile",  type: "tel",   required: true  },
    { name: "email",   placeholder: "Email",   type: "email", required: true  },
    { name: "country", placeholder: "Country", type: "text",  required: false },
  ] as const;

  return (
    <div className="h-full flex flex-col justify-center items-center px-6 md:px-12 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] overflow-hidden relative">
      <div className="grain absolute inset-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] violet-glow opacity-35 animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 text-center max-w-[1400px] w-full">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 0.45 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="micro-label mb-12"
        >
          (10) — Begin
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="editorial-display text-[11vw] leading-[0.9] md:text-[8vw] text-balance"
        >
          Start simple.
          <br />
          <em className="italic font-serif text-[hsl(var(--accent-glow))]">
            Stay in control.
          </em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-14 flex flex-col md:flex-row gap-5 justify-center items-center"
        >
          <Magnetic strength={0.4}>
            <a
              href="#"
              className="flex items-center gap-3 px-10 py-5 bg-[hsl(var(--accent))]
                text-[hsl(var(--accent-foreground))] text-xs uppercase tracking-widest
                transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Download Free Trial
            </a>
          </Magnetic>

          <Magnetic strength={0.4}>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-3 px-10 py-5 border border-background/25
                text-[hsl(var(--background))] text-xs uppercase tracking-widest
                transition-all hover:border-[hsl(var(--accent))] hover:scale-105"
            >
              <ArrowRight className="w-4 h-4" />
              Request a Demo
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 px-6 md:px-12 flex justify-between items-end micro-label opacity-25 text-[hsl(var(--background))]">
        <span>VioletPos — © {new Date().getFullYear()}</span>
        <span className="hidden md:block">Designed for those who decide.</span>
        <span>Edition Nº1</span>
      </div>

      {/* Demo request popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm bg-background text-foreground p-7 border border-border"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="flex justify-between items-start mb-7">
                <div>
                  <h3 className="font-serif text-xl">Request Demo</h3>
                  <p className="font-sans text-xs text-muted-foreground mt-1">
                    We'll reach out via WhatsApp
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const get = (n: string) =>
                    (form.elements.namedItem(n) as HTMLInputElement).value;
                  const msg =
                    `Demo Request:\n` +
                    `Name: ${get("name")}\n` +
                    `Mobile: ${get("mobile")}\n` +
                    `Email: ${get("email")}\n` +
                    `Country: ${get("country")}\n` +
                    `Notes: ${get("notes")}`;
                  window.open(
                    `https://wa.me/917736082117?text=${encodeURIComponent(msg)}`,
                    "_blank"
                  );
                  form.reset();
                  setOpen(false);
                  setSuccess(true);
                  setTimeout(() => setSuccess(false), 3500);
                }}
                className="space-y-3"
              >
                {fields.map((f) => (
                  <input
                    key={f.name}
                    name={f.name}
                    placeholder={f.placeholder}
                    type={f.type}
                    required={f.required}
                    className="w-full p-3 text-sm border border-border bg-transparent font-sans
                      placeholder:text-muted-foreground focus:outline-none
                      focus:border-[hsl(var(--accent))] transition-colors duration-300"
                  />
                ))}
                <textarea
                  name="notes"
                  placeholder="Notes (optional)"
                  rows={3}
                  className="w-full p-3 text-sm border border-border bg-transparent font-sans
                    placeholder:text-muted-foreground focus:outline-none
                    focus:border-[hsl(var(--accent))] transition-colors duration-300 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]
                    text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Send via WhatsApp
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3
              px-6 py-3 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
          >
            <Check className="w-4 h-4" />
            <span className="font-sans text-sm">
              Request received. We'll contact you shortly.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FULL-PAGE SCROLL ENGINE
───────────────────────────────────────────── */
const FullPageScroll = () => {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const transitioning = useRef(false);
  const lastTouch = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => {
      const target = Math.max(0, Math.min(TOTAL_SECTIONS - 1, i));
      if (target === active || transitioning.current) return;
      transitioning.current = true;
      setActive(target);
      setTimeout(() => {
        transitioning.current = false;
      }, THROTTLE_MS);
    },
    [active]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Wheel — only after loader completes
  useEffect(() => {
    if (!loaded) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) next();
      else if (e.deltaY < -30) prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev, loaded]);

  // Touch
  useEffect(() => {
    if (!loaded) return;
    const onStart = (e: TouchEvent) => {
      lastTouch.current = e.touches[0].clientY;
    };
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
  }, [next, prev, loaded]);

  // Keyboard
  useEffect(() => {
    if (!loaded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, loaded]);

  const sections = [
    <Opening        key={0}  isActive={active === 0}  />,
    <RealityBreak   key={1}  isActive={active === 1}  />,
    <Narrative      key={2}  isActive={active === 2}  />,
    <ProductReveal  key={3}  isActive={active === 3}  />,
    <Capability     key={4}  isActive={active === 4}  />,
    <MarqueeSection key={5}  isActive={active === 5}  />,
    <Gallery        key={6}  isActive={active === 6}  />,
    <VideoSection   key={7}  isActive={active === 7}  />,
    <Flexibility    key={8}  isActive={active === 8}  />,
    <Trust          key={9}  isActive={active === 9}  />,
    <FinalCTA       key={10} isActive={active === 10} />,
  ];

  return (
    <ScrollCtx.Provider value={{ active, total: TOTAL_SECTIONS, goTo }}>
      <LanguageCtx.Provider value={{ language, setLanguage }}>
        <Cursor />

        {/* ── Cinematic loader ── */}
        <AnimatePresence>
          {!loaded && (
            <Loader key="loader" onComplete={() => setLoaded(true)} />
          )}
        </AnimatePresence>

        {/* ── Main page ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
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
        </motion.div>
      </LanguageCtx.Provider>
    </ScrollCtx.Provider>
  );
};

export default FullPageScroll;