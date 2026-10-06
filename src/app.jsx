const BehanceIcon = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="1.5 1.5 21 21" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
        <path d="M7.5 8 v8 h3.5 c2 0 2 -4 0 -4 h-3.5" />
        <path d="M11 12 c2 0 2 -4 0 -4 h-3.5" />
        <path d="M13.5 13.5 h4.5 c0 -2.5 -4.5 -2.5 -4.5 0 c0 2.5 4.5 2.5 4.5 0.5" />
        <path d="M14.5 9.5 h3" />
    </svg>
);

// -------------------------------------------------------------
// CUSTOM HOOKS & SHARED COMPONENTS
// -------------------------------------------------------------
const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FadeUp = ({ children, delay = 0, className = "", ...props }) => {
    const domRef = useRef();
    const [isVisible, setVisible] = useState(prefersReducedMotion());

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        if (domRef.current && !prefersReducedMotion()) observer.observe(domRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0 transform-none' : 'opacity-0 translate-y-12'} ${className}`}
            style={{ transitionDelay: `${delay}s` }}
            {...props}
        >
            {children}
        </div>
    );
};

// Subtle scroll parallax applied straight to the DOM node (no React re-render per scroll event).
const useParallax = (factor) => {
    const ref = useRef(null);
    useEffect(() => {
        if (prefersReducedMotion()) return;
        let frame = 0;
        const update = () => {
            frame = 0;
            if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * factor}px)`;
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, [factor]);
    return ref;
};

const Header = ({ title, subtitle }) => {
    const parallaxRef = useParallax(0.1);
    return (
        <header ref={parallaxRef} className="px-6 md:px-12 pt-8 pb-16 flex flex-col justify-between items-start">
            <div>
                <FadeUp delay={0.1}>
                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05]">
                        {title}
                    </h1>
                </FadeUp>
                {subtitle && (
                    <FadeUp delay={0.2}>
                        <p className="mt-4 md:mt-6 text-2xl md:text-3xl font-medium tracking-tight max-w-xl text-black/80">
                            {subtitle}
                        </p>
                    </FadeUp>
                )}
            </div>
        </header>
    );
};

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

const Footer = ({ hasTopMargin = false, onOpenContact }) => (
    <FadeUp delay={0.1}>
        <footer className={`bg-[#111111] text-white py-24 md:py-32 flex flex-col items-center justify-center px-4 ${hasTopMargin ? 'mt-32' : ''}`}>
            <span className="text-lg font-medium mb-8 text-white/80">(Connect)</span>
            <h2
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-12 transition-all duration-300"
            >
                Let's talk
            </h2>
            <button
                onClick={onOpenContact}
                className="bg-white text-[#111] hover:bg-gray-200 px-8 py-4 rounded-none text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 mb-24 shadow-lg hover:shadow-xl inline-block"
            >
                Get in Touch
            </button>

            <nav className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium text-white/80">
                {NAV_LINKS.map(({ label, href }) => (
                    <a
                        key={href}
                        href={href}
                        className="transition-colors hover:text-white"
                    >
                        {label}
                    </a>
                ))}
            </nav>
        </footer>
    </FadeUp>
);

const MenuOverlay = ({ isMenuOpen, toggleMenu }) => (
    <div
        id="site-menu"
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-50 flex flex-col justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMenuOpen ? 'visible opacity-100 pointer-events-auto backdrop-blur-md bg-black/90' : 'invisible opacity-0 pointer-events-none bg-black/0'
            }`}
    >
        {/* Close Button */}
        <button
            onClick={toggleMenu}
            className={`absolute top-8 right-6 md:top-12 md:right-12 text-white/70 hover:text-white p-2 transition-all duration-700 ${isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}
            aria-label="Close menu"
        >
            <X size={40} strokeWidth={1.5} />
        </button>

        {/* Menu Links */}
        <nav className="flex flex-col items-center gap-3 md:gap-5 text-center w-full px-4">
            {NAV_LINKS.map(({ label, href }, index) => (
                <div
                    key={href}
                    className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-12 blur-sm'
                        }`}
                    style={{
                        transitionDelay: isMenuOpen ? `${0.2 + (index * 0.08)}s` : '0ms'
                    }}
                >
                    <a
                        href={href}
                        onClick={() => toggleMenu()}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white/50 hover:text-white transition-all duration-300 hover:translate-x-4 inline-block"
                    >
                        {label}
                    </a>
                </div>
            ))}
        </nav>
    </div>
);

// -------------------------------------------------------------
// PAGE COMPONENTS
// -------------------------------------------------------------

const CASE_STUDIES = [
    { id: 'new-1', name: 'workplanner', label: '(UX Design)', title: 'Certinia Work Planner', subtitle: 'How I solved the problem of managing resources in work planner efficiently by implementing multi select.', bg: 'bg-[#1e1e1e]', img: './images/Certinia.webp', link: 'https://www.figma.com/proto/JfGi78eKPW9wKChWmFG26p/Certinia-Case-Study?node-id=1-261&viewport=139%2C193%2C0.59&t=4W7j4V5OaKkKwtb3-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1', password: 'Certinia' },
    { id: 'new-2', name: 'ai-ux', label: '(Process & AI)', title: 'AI UX Process', subtitle: 'How I use notebook llm and claude in my day to day ux process', bg: 'bg-[#4a90e2]', img: './images/claude-logo.webp', password: 'Certinia' },
    { id: 'new-3', name: 'wayo-audit', label: '(UX Audit)', title: 'Wayo UX Audit', subtitle: 'Evaluating and improving the Wayo app experience.', bg: 'bg-[#ff7b00]', img: './images/wayo.webp', link: 'https://www.figma.com/design/eiWofvVh2SpqKyYjXeVCXK/Wayo-UX-Audit?node-id=1-2&t=7uhmnzNLg5SCZtO8-1' },
    { id: '1', name: 'motorpedia', label: '(End to End Digital Product Design)', title: 'MotorPedia Platform', subtitle: 'Designing a Unified Dealer Platform for 10k Automotive Professionals', bg: 'bg-white', img: './images/w-motorpedia.webp' },
    { id: '2', name: 'studentcircus', label: '(UX Design)', title: 'Student Circus UX', subtitle: 'Boosting student engagement through better UX and visual clarity.', bg: 'bg-[#3C5BFF]', img: './images/w-studentcircus.svg', link: 'https://www.behance.net/gallery/234413029/Student-Circus-A-UX-case-study' },
    { id: '3', name: 'mentorclan', label: '(End to End Digital Product Design)', title: 'Mentor Clan', subtitle: 'Creating meaningful connections through thoughtful community design.', bg: 'bg-[#e5e5e5]', img: './images/w-mentorclan.webp', link: 'https://www.behance.net/gallery/175789307/Mentorship-Platform-Design-UX-Case-Study' },
    { id: '4', name: 'flashcraft', label: '(UI Design)', title: 'FlashCraft Entertainment', subtitle: 'Bringing event magic online with a bold, mobile-friendly experience.', bg: 'bg-[#893895]', img: './images/w-flashcraft.webp', link: './flashcraft-events-case-study/index.html' },
    { id: '5', name: 'sharpz', label: '(Visual Design)', title: 'Sharpz Landing Page', subtitle: 'Clean, bold, and conversion-focused design for a modern product.', bg: 'bg-[#2a2d2a]', img: './images/w-sharpz.webp', link: 'https://www.behance.net/gallery/154341755/Sharpz-Figma-Webflow-Landing-Page' },
    { id: '6', name: 'rawstream', label: '(Branding & Design)', title: 'Rawstream Identity', subtitle: 'Crafting a sharp visual identity and a scroll-worthy digital home.', bg: 'bg-[#0a1843]', img: './images/w-rawstream.webp', link: 'https://www.figma.com/proto/deWzbWtpyFg8DHX0VVJiyZ/Case-studies?node-id=440-27&viewport=114%2C356%2C1.12&t=kOK5ulmJdabdoqDg-1&scaling=min-zoom&content-scaling=fixed&page-id=440%3A7' },
];

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
};

// Props that make a non-native element behave like a button (click, Enter, Space).
const activatable = (onActivate) => ({
    role: 'button',
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onActivate(e);
        }
    },
});

const openProject = (p) => {
    const url = p.link || 'https://www.behance.net/kapilbatra1';
    if (p.password) {
        const entered = window.prompt('This case study is password protected. Please enter the password:');
        if (entered === null) return;
        if (entered !== p.password) {
            window.alert("That password didn't match. Please try again.");
            return;
        }
    }
    window.open(url, '_blank', 'noopener,noreferrer');
};

// 3D-ish card carousel: the centre card is active, neighbours shrink and fade.
// `sizes` holds [centre, adjacent, far] pixel sizes for lg / md / sm viewports.
const Carousel = ({ items, sizes, gap, opacities, stageClass, onOpen, renderCard, cardStyle, label }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const winW = useWindowWidth();
    const dragStartX = useRef(null);
    const isDragging = useRef(false);
    const len = items.length;

    const step = (dir) => setActiveIndex((p) => (p + dir + len) % len);

    useEffect(() => {
        if (paused || prefersReducedMotion()) return;
        const timer = setInterval(() => step(1), 4000);
        return () => clearInterval(timer);
    }, [paused]);

    const tier = winW >= 1024 ? 'lg' : winW >= 768 ? 'md' : 'sm';
    const getSize = (absDiff) => sizes[tier][Math.min(absDiff, 2)];

    // Offset so the gap between every pair of adjacent card edges is exactly `gap`px.
    const getTranslateX = (diff) => {
        if (diff === 0) return 0;
        const a = Math.abs(diff);
        const c = getSize(0), adj = getSize(1), far = getSize(2);
        let x = c.w / 2 + gap + adj.w / 2;
        if (a >= 2) x += adj.w / 2 + gap + far.w / 2;
        if (a >= 3) x += far.w / 2 + gap + far.w / 2;
        return Math.sign(diff) * x;
    };

    const onPointerDown = (e) => { dragStartX.current = e.clientX; isDragging.current = false; };
    const onPointerMove = (e) => {
        if (dragStartX.current !== null && Math.abs(e.clientX - dragStartX.current) > 5) isDragging.current = true;
    };
    const onPointerEnd = (e) => {
        if (dragStartX.current === null) return;
        const d = e.clientX - dragStartX.current;
        if (Math.abs(d) > 50) step(d < 0 ? 1 : -1);
        dragStartX.current = null;
    };

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            style={{ height: getSize(0).h + 60 + 'px', touchAction: 'pan-y' }}
            className="relative w-full flex justify-center items-center overflow-hidden cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerLeave={onPointerEnd}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={(e) => {
                if (e.key === 'ArrowRight') step(1);
                if (e.key === 'ArrowLeft') step(-1);
            }}
        >
            {items.map((item, i) => {
                let diff = i - activeIndex;
                if (diff > len / 2) diff -= len;
                if (diff < -len / 2) diff += len;

                const absDiff = Math.abs(diff);
                const isCenter = diff === 0;
                const { w, h } = getSize(absDiff);
                const [opacity, zIndex] = opacities[absDiff] || [0, 5];

                const activate = () => {
                    if (isDragging.current) return;
                    if (isCenter) onOpen(item);
                    else setActiveIndex(i);
                };

                return (
                    <div
                        key={item.id}
                        {...activatable(activate)}
                        aria-label={isCenter ? `Open ${item.title}` : `Show ${item.title}`}
                        style={{
                            position: 'absolute',
                            width: w + 'px',
                            height: h + 'px',
                            transform: `translateX(${getTranslateX(diff)}px)`,
                            opacity,
                            zIndex,
                            pointerEvents: absDiff <= 2 ? 'auto' : 'none',
                            transition: 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.1s ease, width 1.1s ease, height 1.1s ease',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            ...cardStyle(isCenter),
                        }}
                        className={`group ${stageClass}`}
                    >
                        {renderCard(item, i, isCenter)}
                    </div>
                );
            })}
        </div>
    );
};

const WorkImageSlider = () => (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y border-black/10 bg-transparent my-16 md:my-24 py-12 md:py-16 select-none">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center mb-10">
            <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse inline-block" aria-hidden="true" />
                <h2 className="text-xs md:text-sm font-bold text-black/60 tracking-widest uppercase font-syne">
                    // Featured Case Studies
                </h2>
            </div>
        </div>
        <Carousel
            label="Featured case studies"
            items={CASE_STUDIES}
            gap={24}
            stageClass="shadow-md"
            sizes={{
                lg: [{ w: 380, h: 520 }, { w: 300, h: 420 }, { w: 240, h: 340 }],
                md: [{ w: 310, h: 430 }, { w: 248, h: 348 }, { w: 200, h: 280 }],
                sm: [{ w: 240, h: 340 }, { w: 200, h: 282 }, { w: 164, h: 228 }],
            }}
            opacities={[[1, 30], [0.8, 20], [0.5, 15], [0.2, 10]]}
            cardStyle={() => ({ backgroundColor: '#e0e0e0', border: '1px solid rgba(0,0,0,0.08)' })}
            onOpen={openProject}
            renderCard={(project) => (
                <>
                    <img
                        src={project.img}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 sm:p-7 text-white">
                        <div className="flex justify-end">
                            <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                <ArrowUpRight className="w-5 h-5" strokeWidth={2.2} />
                            </div>
                        </div>
                        <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white/70 block mb-1.5 font-syne">{project.label}</span>
                            <h3 className="text-base sm:text-xl md:text-2xl font-bold line-clamp-2 leading-tight font-syne">{project.title}</h3>
                            <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-1.5 font-medium hidden sm:block">{project.subtitle}</p>
                        </div>
                    </div>
                </>
            )}
        />
    </section>
);

// Skewed, overlapping fan of work thumbnails that opens the homepage.
// `ty` lifts the card, `s` scales it so the middle of the fan reads as the focal point.
const HERO_FAN = [
    { img: './images/Certinia.webp', ty: 22, s: 0.8 },
    { img: './images/claude-logo.webp', ty: 10, s: 0.88 },
    { img: './images/w-motorpedia.webp', ty: 0, s: 0.95 },
    { img: './images/about.webp', ty: -8, s: 1.05 },
    { img: './images/w-flashcraft.webp', ty: 0, s: 0.95 },
    { img: './images/wayo.webp', ty: 10, s: 0.88 },
    { img: './images/w-mentorclan.webp', ty: 22, s: 0.8 },
];

const HeroFan = () => (
    <ul className="hero-fan" aria-hidden="true">
        {HERO_FAN.map(({ img, ty, s }, i) => (
            <li
                key={img}
                className="hero-fan-item"
                style={{ '--z': i < 4 ? i : 7 - i, animation: `fadeSlideIn 0.8s ease ${0.1 + i * 0.08}s both` }}
            >
                <div className="hero-fan-card" style={{ '--ty': `${ty}px`, '--s': s }}>
                    <img
                        src={img}
                        alt=""
                        width="300"
                        height="400"
                        decoding="async"
                        draggable={false}
                        className="w-full h-full object-cover block"
                    />
                </div>
            </li>
        ))}
    </ul>
);

const HomePage = ({ onOpenContact }) => {
    const heroRef = useParallax(0.05);
    return (
        <main>
            {/* Hero: photo fan + intro */}
            <header ref={heroRef} className="px-6 md:px-12 pt-10 md:pt-16 pb-12 md:pb-16">
                <HeroFan />
                <FadeUp delay={0.3} className="w-full flex flex-col items-center text-center mt-14 md:mt-20">
                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] font-syne">
                        Hi, I'm Kapil
                    </h1>
                    <p className="mt-5 md:mt-6 max-w-2xl text-lg md:text-2xl font-medium tracking-tight leading-snug text-black/50">
                        I'm an <span className="text-[#1a1a1a]">AI User Experience Designer</span> &amp; <span className="text-[#1a1a1a]">Product Designer</span> with 5+ years of experience in UX, design systems and digital products.
                    </p>
                </FadeUp>
            </header>

            {/* --- HERO INFO & PROJECTS GRID --- */}
            <section className="px-6 md:px-12 max-w-7xl mx-auto w-full mb-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pt-16 border-t border-black/10">

                    {/* Left Column - Profile & Info */}
                    <FadeUp delay={0.2} className="flex flex-col">
                        {/* Row with Avatar & Availability */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="hero-avatar w-24 h-24 md:w-28 md:h-28 rounded-none overflow-hidden shrink-0 border border-black/10 bg-[#e5e5e5] shadow-md">
                                <img
                                    src="./images/about.webp"
                                    alt="Kapil Batra"
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] md:text-xs font-semibold tracking-wider text-black/50 uppercase">
                                        Available for work
                                    </span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold tracking-tight font-syne">Kapil Batra</h3>
                                <p className="text-xs md:text-sm text-black/60 font-medium">AI UX & Product Designer</p>
                            </div>
                        </div>

                        {/* Bio — staggered fade in */}
                        <p
                            className="text-black/60 leading-relaxed text-sm md:text-base font-medium max-w-xl mb-6"
                            style={{ animation: 'fadeSlideIn 0.7s ease 0.5s both' }}
                        >
                            Designing calm, precise interfaces guided by structure and typography.
                        </p>

                        {/* Email */}
                        <a
                            href="mailto:Kapilbatrayt@gmail.com"
                            className="hero-email-link text-sm md:text-base font-medium tracking-tight text-black/60 hover:text-black transition-colors pb-0.5 self-start"
                            style={{ animation: 'fadeSlideIn 0.7s ease 0.65s both' }}
                        >
                            Kapilbatrayt@gmail.com
                        </a>
                    </FadeUp>

                    {/* Right Column - Newest Projects & Collaboration */}
                    <FadeUp delay={0.3} className="flex flex-col justify-between h-full min-h-[250px] lg:min-h-[280px]">
                        <div>
                            {/* Header */}
                            <span className="text-xs md:text-sm font-bold text-black/40 tracking-widest block mb-6">
                                // NEWEST PROJECTS
                            </span>

                            {/* Description & Project Cards side by side */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-4">
                                <p
                                    className="text-black/60 max-w-[220px] leading-relaxed text-sm md:text-base font-medium"
                                    style={{ animation: 'fadeSlideIn 0.7s ease 0.4s both' }}
                                >
                                    Recent projects focused on clarity and usability.
                                </p>
                                <div className="flex gap-4 shrink-0">
                                    {/* Thumb 1 — stagger 0.45s */}
                                    <a
                                        href="#work"
                                        className="project-thumb w-[110px] h-[80px] sm:w-[130px] sm:h-[95px] md:w-[150px] md:h-[110px] bg-[#e5e5e5] rounded-none border border-black/[0.08] shadow-sm hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 hover:border-black/20 duration-300 block"
                                        style={{ animation: 'fadeSlideIn 0.6s ease 0.45s both' }}
                                    >
                                        <img
                                            src="./images/Certinia.webp"
                                            alt="Certinia Work Planner"
                                width="150" height="110"
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                    {/* Thumb 2 — stagger 0.55s */}
                                    <a
                                        href="#work"
                                        className="project-thumb w-[110px] h-[80px] sm:w-[130px] sm:h-[95px] md:w-[150px] md:h-[110px] bg-[#e5e5e5] rounded-none border border-black/[0.08] shadow-sm hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 hover:border-black/20 duration-300 block"
                                        style={{ animation: 'fadeSlideIn 0.6s ease 0.55s both' }}
                                    >
                                        <img
                                            src="./images/claude-logo.webp"
                                            alt="AI Process Case Study"
                                            className="w-full h-full object-cover"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Collaboration Button — wired to contact modal */}
                        <button
                            onClick={onOpenContact}
                            className="group w-full bg-[#111111] hover:bg-black text-white py-4 relative font-semibold text-sm md:text-base transition-all hover:scale-[1.02] active:scale-[0.99] mt-10 flex justify-center items-center shadow-lg hover:shadow-xl border border-black/10 rounded-none overflow-hidden"
                            style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                            {/* Shimmer sweep on hover */}
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                            <span className="relative z-10" >
                                Let's Start a Collaboration
                            </span>
                            <span className="collab-btn-arrow absolute right-6 font-bold tracking-widest text-white/70 font-mono text-xs md:text-sm z-10">&gt;</span>
                        </button>
                    </FadeUp>

                </div>
            </section>

            {/* --- FEATURED CASE STUDIES SLIDER --- */}
            <FadeUp delay={0.1}>
                <WorkImageSlider />
            </FadeUp>

            {/* --- ABOUT PREVIEW --- */}
            <section id="about" className="px-6 md:px-12 mb-24 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-24 items-start border-black/10 pt-4">
                    <FadeUp delay={0.1}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight max-w-3xl border-l-[3px] border-transparent hover:border-black pl-0 hover:pl-4 transition-all duration-300">
                            As an AI User Experience Designer, I focus on producing top-notch and impactful digital experiences.
                        </h2>
                    </FadeUp>

                    <FadeUp delay={0.2} className="md:border-l border-black/10 md:pl-24 h-full flex flex-col justify-between min-h-[150px]">
                        <span className="text-lg font-medium mb-8 block">(About me)</span>
                        <div className="flex gap-3 mt-auto">
                            <a
                                href="https://www.linkedin.com/in/kapil-batra"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-90 transition-all duration-200"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="https://www.behance.net/kapilbatra1"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Behance"
                                className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-90 transition-all duration-200"
                            >
                                <BehanceIcon size={18} />
                            </a>
                            <a
                                href="https://www.instagram.com/kyayaarbatra/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-90 transition-all duration-200"
                            >
                                <Instagram size={18} />
                            </a>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* --- WHAT I DO --- */}
            <section className="px-6 md:px-12 mb-24 max-w-7xl mx-auto">
                <div className="border-t border-black/10 pt-16 flex flex-col lg:flex-row gap-12 lg:gap-0">
                    <div className="w-full lg:w-1/4 shrink-0">
                        <FadeUp delay={0.1}>
                            <span className="text-2xl font-medium block sticky top-8">(What I do)</span>
                        </FadeUp>
                    </div>

                    <div className="w-full lg:w-3/4 lg:border-l border-black/10 grid grid-cols-1 md:grid-cols-2">
                        {/* Item 1 */}
                        <FadeUp delay={0.2} className="p-0 pb-12 md:p-12 md:pt-0 border-b border-black/10 md:border-r">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight group-hover:text-black/70">UX Design</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base">
                                I blend user needs with business goals to craft intuitive experiences — wireframes, prototypes, and design systems that guide people seamlessly through digital products.
                            </p>
                        </FadeUp>
                        {/* Item 2 */}
                        <FadeUp delay={0.3} className="p-0 py-12 md:p-12 md:pt-0 border-b border-black/10">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Business Research</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base">
                                Understanding the "why" behind user behavior and business needs helps me design with purpose. I dive into data, competitor landscapes, and product goals to shape smarter, user-focused decisions.
                            </p>
                        </FadeUp>
                        {/* Item 3 */}
                        <FadeUp delay={0.4} className="p-0 py-12 md:p-12 md:pb-0 border-b md:border-b-0 border-black/10 md:border-r">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Brand & Graphic Design</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base">
                                From logos to social media creatives, I translate ideas into visuals that stay consistent across platforms, building the recognition and emotional connection brands need to be remembered.
                            </p>
                        </FadeUp>
                        {/* Item 4 */}
                        <FadeUp delay={0.5} className="p-0 pt-12 md:p-12 md:pb-0">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Photography & Video Editing</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base">
                                I bring stories to life through visuals — whether it's product shots, team culture, or motion-based storytelling — to elevate design presentations, brand messaging, and product demos.
                            </p>
                        </FadeUp>
                    </div>
                </div>
            </section>



            {/* --- TESTIMONIALS --- */}
            <section className="px-6 md:px-12 mb-24 max-w-7xl mx-auto">
                <div className="border-t border-black/10 pt-16 flex flex-col lg:flex-row gap-12 lg:gap-0">
                    <div className="w-full lg:w-1/4 shrink-0">
                        <FadeUp delay={0.1}>
                            <span className="text-2xl font-medium block sticky top-8">(Testimonials)</span>
                        </FadeUp>
                    </div>

                    <div className="w-full lg:w-3/4 lg:border-l border-black/10 grid grid-cols-1 md:grid-cols-2">
                        {/* Testimonial 1 */}
                        <FadeUp delay={0.2} className="p-0 pb-12 md:p-12 md:pt-0 border-b border-black/10 md:border-r flex flex-col h-full">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight">MotorPedia</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8">
                                Kapil helped us design our mobile app from scratch. He understood our complex inventory and service flows very quickly and made them super easy to use. The designs looked premium too. Great experience working with him!
                            </p>
                            <div className="flex items-center gap-3">
                                <img src="./images/Vibhore.png" alt="Vibhore Kumar" className="w-10 h-10 rounded-full object-cover shadow-sm bg-black/5" />
                                <div>
                                    <h4 className="font-semibold text-sm">Vibhore Kumar</h4>
                                    <span className="text-xs text-black/60">Founder, MotorPedia</span>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Testimonial 2 */}
                        <FadeUp delay={0.3} className="p-0 py-12 md:p-12 md:pt-0 border-b border-black/10 flex flex-col h-full">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Student Circus</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8">
                                Kapil has a sharp eye for what students really need. He made our platform more user-friendly and visually appealing. He's also very cooperative and always open to feedback. Highly recommended!
                            </p>
                            <div className="flex items-center gap-3">
                                <img src="./images/Dhruv.png" alt="Dhruv Krishnaraj" className="w-10 h-10 rounded-full object-cover shadow-sm bg-black/5" />
                                <div>
                                    <h4 className="font-semibold text-sm">Dhruv Krishnaraj</h4>
                                    <span className="text-xs text-black/60">Founder, Student Circus</span>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Testimonial 3 */}
                        <FadeUp delay={0.4} className="p-0 py-12 md:p-12 md:pb-0 border-b md:border-b-0 border-black/10 md:border-r flex flex-col h-full">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight">FlashCraft Events</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8">
                                We had no idea how to show our event services online in a clean way. Kapil turned our ideas into a modern website & app. His designs brought a lot of compliments from our clients!
                            </p>
                            <div className="flex items-center gap-3">
                                <img src="./images/Nishant.png" alt="Nishant" className="w-10 h-10 rounded-full object-cover shadow-sm bg-black/5" />
                                <div>
                                    <h4 className="font-semibold text-sm">Nishant</h4>
                                    <span className="text-xs text-black/60">Founder, FlashCraft Events</span>
                                </div>
                            </div>
                        </FadeUp>

                        {/* Testimonial 4 */}
                        <FadeUp delay={0.5} className="p-0 pt-12 md:p-12 md:pb-0 flex flex-col h-full">
                            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Metacube Softwares</h3>
                            <p className="text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8">
                                Kapil has been a huge asset to our team. He's not just a designer. He thinks about the product, the user, and the business. Always proactive and dependable. A true all-rounder!
                            </p>
                            <div className="flex items-center gap-3">
                                <img src="./images/Himank.png" alt="Himank Jha" className="w-10 h-10 rounded-full object-cover shadow-sm bg-black/5" />
                                <div>
                                    <h4 className="font-semibold text-sm">Himank Jha</h4>
                                    <span className="text-xs text-black/60">UX Manager, Certinia Project</span>
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>
        </main>
    );
};

const WorkPage = () => {
    const projects = CASE_STUDIES;

    return (
        <main>
            <Header
                title="Work"
                subtitle="Turning confusion into clicks, with flair."
            />

            <section className="w-full bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                    {projects.map((p, i) => (
                        <FadeUp key={p.id} delay={0.1 * (i % 3)} className={`w-full flex flex-col group cursor-pointer bg-[#f3f3f3] hover:bg-[#222222] focus-visible:bg-[#222222] transition-colors duration-300 border-b border-black/10 ${i % 3 !== 2 ? 'lg:border-r border-black/10' : ''}`} {...activatable(() => openProject(p))}>
                            <div className={`w-full h-[250px] md:h-[350px] relative overflow-hidden ${p.bg} border-b border-black/10`}>
                                {/* Added transition to the bg itself and the image */}
                                <img
                                    src={p.img}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                />
                            </div>
                            <div className="p-8 md:p-10 flex flex-col flex-grow transition-colors duration-300">
                                <span className="text-sm font-medium mb-5 text-black group-hover:text-white/80 transition-colors inline-block">{p.label}</span>
                                <h3 className="text-2xl md:text-[1.7rem] leading-[1.2] font-bold tracking-tight mb-4 text-black group-hover:text-white transition-colors">{p.title}</h3>
                                <p className="text-black/70 group-hover:text-white/80 leading-relaxed text-[15px] transition-colors">{p.subtitle}</p>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </section>
        </main>
    );
};

const AboutPage = () => {
    const experience = [
        {
            title: 'AI UX Designer (promoted once)',
            company: 'Metacube Softwares, Jaipur',
            date: 'Mar 2022 - Present',
            skills: ['UX Research', 'Salesforce LDS', 'Collaboration', 'User Interaction', 'Usability testing', 'Accessibility'],
            bullets: [
                'Led usability testing, tracked issues, iterated on designs, and collaborated with product managers, developers, and visual designers to ensure alignment with business goals and user needs.',
                "Improving the UI & UX of Certinia's Resource & Project management tools while working/Improving the Salesforce Lightning Design System",
                'Collaborating with UK/Spain/US UX team to create custom design system & designs to solve user problems',
                'Conducted user and stakeholder research, analysed task models, defined workflows, and created wireframes and prototypes to inform design solutions and improve user experience.',
                'Applied AI to analyze large sets of customer interviews and usage data, identifying hidden patterns and unmet needs; used these insights to redesign workflows in Salesforce apps, reduce user friction, and boost engagement.'
            ]
        },
        {
            title: 'UI Designer/Product designer',
            company: 'FirstPrinciples holding company, Bengaluru',
            date: 'Aug 2021 - Mar 2022',
            skills: ['Mobile & Web UI Design', 'Branding', 'Collaboration', 'Social Media Posts', 'Graphic Design'],
            bullets: [
                'Created visually appealing and intuitive user interfaces for mass-market consumer apps such Omni Outreach, Syndication Pro, Rawstream etc. ensuring consistency in branding, typography, color schemes, and layout',
                "Designed compelling infographics and visually engaging social media posts to convey information, promote the startup's brand, and drive user engagement on various platforms"
            ]
        },
        {
            title: 'Freelance product designer & Video Editor',
            company: 'Freelance',
            date: 'Oct 2019 - Present',
            skills: ['End to End Design', 'UX Research', 'Design Systems', 'AI', 'User Interviews', 'UX Audits'],
            bullets: [
                'Designed and delivered end-to-end digital experiences across diverse industries including Automobile (Motorpedia), Education (Mentor Clan, Student Circus), Resource Management (Culture Hint), Event Management (Rayna Events, Flashcraft Entertainment) etc.',
                'Improved user engagement and retention by conducting user research, usability testing, and translating insights into intuitive design solutions tailored for each domain.',
                'Collaborated directly with clients and stakeholders, aligning business objectives with user needs through workshops, wireframes, and interactive prototypes.',
                "Delivered measurable impact such as increasing Student Circus' average session duration by 73% through dashboard redesign, gamification, and community features."
            ]
        },
        {
            title: 'Process Executive-Data',
            company: 'Cognizant , Gurugram',
            date: 'Jun 2018 - Sept 2019',
            skills: ['Copywriting', 'Keyword Extraction', 'Data Analysis', 'SEO'],
            bullets: [
                "Optimised search engine results and designing SMPs that appeared on google's search results page"
            ]
        }
    ];

    return (
        <main className="w-full flex flex-col lg:flex-row relative">
            {/* Left Sticky Image */}
            <div className="w-full lg:w-1/2 lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px] relative group border-r border-black/10 z-30 bg-[#e5e5e5]">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="./images/about.webp"
                        alt="Kapil Batra"
                        className="w-full h-[60vh] lg:h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    />
                </div>
            </div>

            {/* Right Scrolling Content */}
            <div className="w-full lg:w-1/2 flex flex-col bg-transparent z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)]">
                <div className="pt-8">
                    <Header
                        title="Kapil Batra"
                        subtitle="As an AI User Experience Designer, I focus on producing top-notch and impactful digital experiences."
                    />
                </div>

                <div className="px-6 md:px-12 pb-24 md:pb-32 -mt-4">
                    {/* Profile Intro */}
                    <FadeUp delay={0.1}>
                        <p className="text-black/80 leading-loose text-base md:text-lg mb-8">
                            I am an AI User Experience Designer based in Jaipur with 5+ years of experience crafting intuitive, impactful digital products. I blend user research, AI tools, systems thinking, and visual design to create experiences that are both beautiful and functional.
                        </p>
                        <p className="text-black/80 leading-loose text-base md:text-lg mb-16">
                            From mobile apps to enterprise platforms, I have worked across diverse industries - shaping wireframes, prototypes, and design systems that guide users seamlessly and help businesses grow.
                        </p>
                    </FadeUp>

                    {/* Experience Section */}
                    <div className="border-t border-black/10 pt-16">
                        <FadeUp delay={0.2}>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">Experience</h2>
                        </FadeUp>

                        <div className="space-y-16">
                            {experience.map((job, idx) => (
                                <FadeUp key={idx} delay={0.2 + (idx * 0.1)} className="flex gap-8 group">
                                    {/* Job Details */}
                                    <div className="flex-grow pb-8 border-b border-black/5 last:border-0 last:pb-0">
                                        <div className="mb-4">
                                            <h3 className="text-2xl font-bold tracking-tight leading-snug mb-1 group-hover:text-black/70 transition-colors">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className="text-[#1a1a1a] font-medium">{job.company}</span>
                                                <span className="hidden md:inline text-black/30">•</span>
                                                <span className="text-black/50 text-sm font-medium">{job.date}</span>
                                            </div>
                                        </div>

                                        {/* Bullets */}
                                        <ul className="space-y-4 mb-6">
                                            {job.bullets.map((bullet, bIdx) => (
                                                <li key={bIdx} className="flex gap-4 text-black/80 leading-relaxed text-[15px]">
                                                    <div className="w-[6px] h-[6px] rounded-full bg-black/30 mt-2 shrink-0"></div>
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Skills Pills */}
                                        <div className="flex flex-wrap gap-2 mt-6">
                                            {job.skills.map(skill => (
                                                <span key={skill} className="px-3 py-1.5 bg-[#e5e5e5] rounded-md text-xs font-semibold tracking-wide text-black/70 hover:bg-black hover:text-white transition-colors cursor-default">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </FadeUp>
                            ))}
                        </div>
                    </div>

                    {/* Awards */}
                    <div className="border-t border-black/10 pt-16 mt-8">
                        <FadeUp delay={0.4}>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Awards/Appreciations</h2>
                            <ul className="space-y-5 mt-8">
                                <li className="text-lg font-medium text-black/80 flex items-center gap-4"><div className="w-[6px] h-[6px] rounded-full bg-black shrink-0"></div>Team of the Year (2024)</li>
                                <li className="text-lg font-medium text-black/80 flex items-center gap-4"><div className="w-[6px] h-[6px] rounded-full bg-black shrink-0"></div>Hero in the rank (2025)</li>
                                <li className="text-lg font-medium text-black/80 flex items-center gap-4"><div className="w-[6px] h-[6px] rounded-full bg-black shrink-0"></div>9 client appreciations in 2 years (2023 - 2025)</li>
                            </ul>
                        </FadeUp>
                    </div>

                </div>
            </div>
        </main>
    );
};



const FORM_ENDPOINT = 'https://formsubmit.co/ajax/kapilbatrayt@gmail.com';

const SuccessCard = () => (
    <div role="status" className="bg-white border border-green-200 text-green-800 p-8 rounded-2xl text-center shadow-sm">
        <span className="text-4xl mb-4 block" aria-hidden="true">👋</span>
        <p className="font-bold text-lg">Message sent successfully!</p>
        <p className="text-sm mt-2 opacity-80">I'll get back to you within a day or two.</p>
    </div>
);

// Shared by the Contact page and the "Get in touch" modal.
const ContactForm = ({ idPrefix, compact = false, onSent, className = '' }) => {
    const [status, setStatus] = useState('idle');
    const fieldClass = `w-full bg-white border border-black/10 rounded-none px-4 ${compact ? 'py-3' : 'py-4'} focus:ring-2 focus:ring-black/20 outline-none transition-shadow text-[#1a1a1a]`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setStatus('loading');
        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form),
            });
            if (!response.ok) throw new Error(`Form service responded ${response.status}`);
            form.reset();
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                if (onSent) onSent();
            }, compact ? 3000 : 5000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') return <SuccessCard />;

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <input type="hidden" name="_captcha" value="false" />
            <div>
                <label htmlFor={`${idPrefix}-name`} className="block text-sm font-bold mb-2 text-[#1a1a1a]">Name</label>
                <input id={`${idPrefix}-name`} type="text" name="name" autoComplete="name" required className={fieldClass} placeholder="John Doe" />
            </div>
            <div>
                <label htmlFor={`${idPrefix}-email`} className="block text-sm font-bold mb-2 text-[#1a1a1a]">Email</label>
                <input id={`${idPrefix}-email`} type="email" name="email" autoComplete="email" required className={fieldClass} placeholder="john@example.com" />
            </div>
            <div>
                <label htmlFor={`${idPrefix}-message`} className="block text-sm font-bold mb-2 text-[#1a1a1a]">Message</label>
                <textarea id={`${idPrefix}-message`} name="message" required rows={compact ? 4 : 5} className={`${fieldClass} resize-none`} placeholder="How can I help you?"></textarea>
            </div>
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-none font-semibold hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-70 disabled:hover:scale-100"
            >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'error' && (
                <p role="alert" className="text-red-600 text-sm font-medium text-center">
                    Message couldn't be sent. Please try again or email me directly at kapilbatrayt@gmail.com.
                </p>
            )}
        </form>
    );
};

const ContactPage = () => (
    <main id="main" className="w-full flex flex-col lg:flex-row relative">
        <div className="w-full lg:w-1/2 lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px] relative group border-r border-black/10 z-30 bg-[#e5e5e5]">
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src="./images/about.webp"
                    alt="Kapil Batra"
                    className="w-full h-[60vh] lg:h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
            </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col bg-transparent z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] min-h-[calc(100vh-80px)] justify-center">
            <div className="px-6 md:px-12 py-24 md:py-32 flex-grow flex flex-col justify-center">
                <FadeUp delay={0.1}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 text-[#1a1a1a]">Get in touch</h1>
                    <p className="text-black/60 mb-12 font-medium text-lg">Drop me a message and I'll get back to you soon.</p>
                    <ContactForm idPrefix="page" className="max-w-lg" />
                </FadeUp>
            </div>
        </div>
    </main>
);

const ContactModal = ({ isOpen, onClose }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const previouslyFocused = document.activeElement;
        const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKeyDown);
        dialogRef.current?.querySelector('input:not([type=hidden])')?.focus();
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true"></div>
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="contact-modal-title"
                className="relative bg-[#f3f3f3] w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl p-8 md:p-12 shadow-2xl border border-black/10 animate-[scaleIn_0.3s_ease-out]"
            >
                <button
                    onClick={onClose}
                    aria-label="Close contact form"
                    className="absolute top-6 right-6 text-black/50 hover:text-black transition-colors bg-black/5 rounded-full p-2"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                <h2 id="contact-modal-title" className="text-3xl font-bold tracking-tight mb-2 text-[#1a1a1a]">Get in touch</h2>
                <p className="text-black/60 mb-8 font-medium">Drop me a message and I'll get back to you soon.</p>
                <ContactForm idPrefix="modal" compact onSent={onClose} />
            </div>
        </div>
    );
};

const ROUTES = {
    '#home': 'Kapil Batra - AI User Experience Designer & Product Designer',
    '#work': 'Work | Kapil Batra',
    '#about': 'About | Kapil Batra',
    '#contact': 'Contact | Kapil Batra',
};

const normalizeRoute = (hash) => {
    const route = hash || '#home';
    return route in ROUTES ? route : '#home';
};

function App() {
    const [currentRoute, setCurrentRoute] = useState(() => normalizeRoute(window.location.hash));
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const siteRef = useRef(null);
    const gridCanvasRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen((open) => !open);
    const openContact = () => setIsContactOpen(true);

    // Hash routing: update view, title and scroll position.
    useEffect(() => {
        const handleHashChange = () => {
            setCurrentRoute(normalizeRoute(window.location.hash));
            setIsMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'instant' });
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        document.title = ROUTES[currentRoute];
    }, [currentRoute]);

    // Prevent background scrolling and close the menu with Escape.
    useEffect(() => {
        document.body.style.overflow = isMenuOpen || isContactOpen ? 'hidden' : '';
        if (!isMenuOpen) return;
        const onKeyDown = (e) => { if (e.key === 'Escape') setIsMenuOpen(false); };
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isMenuOpen, isContactOpen]);

    // Dot field that reacts to the pointer. Only redraws while something is moving.
    useEffect(() => {
        const canvas = gridCanvasRef.current;
        const site = siteRef.current;
        if (!canvas || !site || prefersReducedMotion()) return;

        const context = canvas.getContext('2d');
        const pointer = { x: -1000, y: -1000, energy: 0 };
        const spacing = 24;
        const radius = 150;
        let width = 0;
        let height = 0;
        let frameId = 0;

        const draw = () => {
            frameId = 0;
            pointer.energy *= 0.92;
            context.clearRect(0, 0, width, height);
            context.fillStyle = 'rgba(26, 26, 26, 0.35)';

            const startY = Math.floor(window.scrollY / spacing) * spacing;
            const endY = Math.min(height, window.scrollY + window.innerHeight + spacing);

            for (let y = startY; y <= endY; y += spacing) {
                for (let x = 0; x <= width; x += spacing) {
                    const dx = x - pointer.x;
                    const dy = y - pointer.y;
                    const distance = Math.hypot(dx, dy);
                    const falloff = Math.max(0, 1 - distance / radius) ** 2 * pointer.energy;
                    const shift = distance ? falloff * 15 : 0;
                    const offsetX = distance ? (dx / distance) * shift : 0;
                    const offsetY = distance ? (dy / distance) * shift : 0;
                    context.fillRect(x + offsetX - 0.9, y + offsetY - 0.9, 1.8, 1.8);
                }
            }
            if (pointer.energy > 0.01) schedule();
        };
        const schedule = () => { if (!frameId) frameId = requestAnimationFrame(draw); };

        const resize = () => {
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.ceil(site.clientWidth);
            height = Math.max(Math.ceil(site.scrollHeight), window.innerHeight);
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            schedule();
        };

        const movePointer = (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY + window.scrollY;
            pointer.energy = 1;
            schedule();
        };

        const observer = new ResizeObserver(resize);
        observer.observe(site);
        resize();
        window.addEventListener('pointermove', movePointer, { passive: true });
        window.addEventListener('scroll', schedule, { passive: true });

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('pointermove', movePointer);
            window.removeEventListener('scroll', schedule);
        };
    }, []);

    const breadcrumb = { '#work': 'Work', '#about': 'About', '#contact': 'Contact' }[currentRoute];

    return (
        <div ref={siteRef} className="bg-[#f3f3f3] text-[#1a1a1a] min-h-screen font-sans selection:bg-[#1a1a1a] selection:text-white relative flex flex-col justify-between">
            <canvas ref={gridCanvasRef} className="site-dot-grid" aria-hidden="true"></canvas>
            <div className="relative z-10 flex min-h-screen flex-col">

                {/* GLOBAL STICKY NAV */}
                <div className="sticky top-0 z-40 bg-[#f3f3f3]/60 backdrop-blur-2xl border-b border-black/[0.03] px-6 md:px-12 py-4 md:py-5 flex justify-between items-center transition-all duration-300 w-full">
                    <div className="flex items-center gap-3 text-sm font-medium tracking-wide min-h-[32px]">
                        <a href="#home" aria-label="Home" className="text-xl md:text-2xl font-extrabold tracking-tighter hover:opacity-70 transition-opacity mr-1">kb.</a>
                        {breadcrumb && (
                            <>
                                <span className="text-black/30 hidden md:inline" aria-hidden="true">/</span>
                                <span className="text-black hidden md:inline">{breadcrumb}</span>
                            </>
                        )}
                    </div>
                    <div className="flex gap-3 md:gap-4">
                        <a
                            href="./Resume_Kapil%20Batra.pdf"
                            download="Resume_Kapil_Batra.pdf"
                            className="bg-[#1a1a1a] text-white hover:bg-black px-6 py-3 rounded-none text-xs md:text-sm font-medium transition-all hover:scale-105 active:scale-95 duration-200 shadow-sm flex items-center justify-center whitespace-nowrap"
                        >
                            Download Resume
                        </a>
                        <button
                            onClick={toggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-controls="site-menu"
                            className="bg-[#1a1a1a] text-white hover:bg-black px-6 py-3 rounded-none text-xs md:text-sm font-medium transition-all hover:scale-105 active:scale-95 duration-200 shadow-sm max-h-min"
                        >
                            Menu
                        </button>
                    </div>
                </div>

                {/* ROUTER COMPONENT SWITCH */}
                {currentRoute === '#work' ? (
                    <WorkPage />
                ) : currentRoute === '#about' ? (
                    <AboutPage />
                ) : currentRoute === '#contact' ? (
                    <ContactPage />
                ) : (
                    <HomePage onOpenContact={openContact} />
                )}

                <Footer hasTopMargin={['#home', '#work'].includes(currentRoute)} onOpenContact={openContact} />

                <MenuOverlay isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

                <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            </div>
        </div>
    );
}

createRoot(document.getElementById('root')).render(<App />);
