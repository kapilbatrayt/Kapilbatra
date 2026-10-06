(function () {
'use strict';
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const { Linkedin, Instagram, ArrowUpRight, X } = LucideReact;
const BehanceIcon = ({
  size = 24,
  color = "currentColor"
}) => React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "1.5 1.5 21 21",
  fill: "none",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  xmlns: "http://www.w3.org/2000/svg"
}, React.createElement("rect", {
  x: "3",
  y: "3",
  width: "18",
  height: "18",
  rx: "5",
  ry: "5"
}), React.createElement("path", {
  d: "M7.5 8 v8 h3.5 c2 0 2 -4 0 -4 h-3.5"
}), React.createElement("path", {
  d: "M11 12 c2 0 2 -4 0 -4 h-3.5"
}), React.createElement("path", {
  d: "M13.5 13.5 h4.5 c0 -2.5 -4.5 -2.5 -4.5 0 c0 2.5 4.5 2.5 4.5 0.5"
}), React.createElement("path", {
  d: "M14.5 9.5 h3"
}));
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FadeUp = ({
  children,
  delay = 0,
  className = "",
  ...props
}) => {
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
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });
    if (domRef.current && !prefersReducedMotion()) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);
  return React.createElement("div", {
    ref: domRef,
    className: `transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0 transform-none' : 'opacity-0 translate-y-12'} ${className}`,
    style: {
      transitionDelay: `${delay}s`
    },
    ...props
  }, children);
};
const useParallax = factor => {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * factor}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [factor]);
  return ref;
};
const Header = ({
  title,
  subtitle
}) => {
  const parallaxRef = useParallax(0.1);
  return React.createElement("header", {
    ref: parallaxRef,
    className: "px-6 md:px-12 pt-8 pb-16 flex flex-col justify-between items-start"
  }, React.createElement("div", null, React.createElement(FadeUp, {
    delay: 0.1
  }, React.createElement("h1", {
    className: "text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05]"
  }, title)), subtitle && React.createElement(FadeUp, {
    delay: 0.2
  }, React.createElement("p", {
    className: "mt-4 md:mt-6 text-2xl md:text-3xl font-medium tracking-tight max-w-xl text-black/80"
  }, subtitle))));
};
const NAV_LINKS = [{
  label: 'Home',
  href: '#home'
}, {
  label: 'Work',
  href: '#work'
}, {
  label: 'About',
  href: '#about'
}, {
  label: 'Extra-curricular',
  href: '#extra-curricular'
}, {
  label: 'Contact',
  href: '#contact'
}];
const Footer = ({
  hasTopMargin = false,
  onOpenContact
}) => React.createElement(FadeUp, {
  delay: 0.1
}, React.createElement("footer", {
  className: `bg-[#111111] text-white py-24 md:py-32 flex flex-col items-center justify-center px-4 ${hasTopMargin ? 'mt-32' : ''}`
}, React.createElement("span", {
  className: "text-lg font-medium mb-8 text-white/80"
}, "(Connect)"), React.createElement("h2", {
  className: "text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-12 transition-all duration-300"
}, "Let's talk"), React.createElement("button", {
  onClick: onOpenContact,
  className: "bg-white text-[#111] hover:bg-gray-200 px-8 py-4 rounded-none text-base font-semibold transition-all duration-300 hover:scale-105 active:scale-95 mb-24 shadow-lg hover:shadow-xl inline-block"
}, "Get in Touch"), React.createElement("nav", {
  className: "flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-medium text-white/80"
}, NAV_LINKS.map(({
  label,
  href
}) => React.createElement("a", {
  key: href,
  href: href,
  className: "transition-colors hover:text-white"
}, label)))));
const MenuOverlay = ({
  isMenuOpen,
  toggleMenu
}) => React.createElement("div", {
  id: "site-menu",
  "aria-hidden": !isMenuOpen,
  className: `fixed inset-0 z-50 flex flex-col justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isMenuOpen ? 'visible opacity-100 pointer-events-auto backdrop-blur-md bg-black/90' : 'invisible opacity-0 pointer-events-none bg-black/0'}`
}, React.createElement("button", {
  onClick: toggleMenu,
  className: `absolute top-8 right-6 md:top-12 md:right-12 text-white/70 hover:text-white p-2 transition-all duration-700 ${isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`,
  "aria-label": "Close menu"
}, React.createElement(X, {
  size: 40,
  strokeWidth: 1.5
})), React.createElement("nav", {
  className: "flex flex-col items-center gap-3 md:gap-5 text-center w-full px-4"
}, NAV_LINKS.map(({
  label,
  href
}, index) => React.createElement("div", {
  key: href,
  className: `transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-12 blur-sm'}`,
  style: {
    transitionDelay: isMenuOpen ? `${0.2 + index * 0.08}s` : '0ms'
  }
}, React.createElement("a", {
  href: href,
  onClick: () => toggleMenu(),
  className: "text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white/50 hover:text-white transition-all duration-300 hover:translate-x-4 inline-block"
}, label)))));
const CASE_STUDIES = [{
  id: 'new-1',
  name: 'workplanner',
  label: '(UX Design)',
  title: 'Certinia Work Planner',
  subtitle: 'How I solved the problem of managing resources in work planner efficiently by implementing multi select.',
  bg: 'bg-[#1e1e1e]',
  img: './images/Certinia.webp',
  link: 'https://www.figma.com/proto/JfGi78eKPW9wKChWmFG26p/Certinia-Case-Study?node-id=1-261&viewport=139%2C193%2C0.59&t=4W7j4V5OaKkKwtb3-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1',
  password: 'Certinia'
}, {
  id: 'new-2',
  name: 'ai-ux',
  label: '(Process & AI)',
  title: 'AI UX Process',
  subtitle: 'How I use notebook llm and claude in my day to day ux process',
  bg: 'bg-[#4a90e2]',
  img: './images/claude-logo.webp',
  password: 'Certinia'
}, {
  id: 'new-3',
  name: 'wayo-audit',
  label: '(UX Audit)',
  title: 'Wayo UX Audit',
  subtitle: 'Evaluating and improving the Wayo app experience.',
  bg: 'bg-[#ff7b00]',
  img: './images/wayo.webp',
  link: 'https://www.figma.com/design/eiWofvVh2SpqKyYjXeVCXK/Wayo-UX-Audit?node-id=1-2&t=7uhmnzNLg5SCZtO8-1'
}, {
  id: '1',
  name: 'motorpedia',
  label: '(End to End Digital Product Design)',
  title: 'MotorPedia Platform',
  subtitle: 'Designing a Unified Dealer Platform for 10k Automotive Professionals',
  bg: 'bg-white',
  img: './images/w-motorpedia.webp'
}, {
  id: '2',
  name: 'studentcircus',
  label: '(UX Design)',
  title: 'Student Circus UX',
  subtitle: 'Boosting student engagement through better UX and visual clarity.',
  bg: 'bg-[#3C5BFF]',
  img: './images/w-studentcircus.svg',
  link: 'https://www.behance.net/gallery/234413029/Student-Circus-A-UX-case-study'
}, {
  id: '3',
  name: 'mentorclan',
  label: '(End to End Digital Product Design)',
  title: 'Mentor Clan',
  subtitle: 'Creating meaningful connections through thoughtful community design.',
  bg: 'bg-[#e5e5e5]',
  img: './images/w-mentorclan.webp',
  link: 'https://www.behance.net/gallery/175789307/Mentorship-Platform-Design-UX-Case-Study'
}, {
  id: '4',
  name: 'flashcraft',
  label: '(UI Design)',
  title: 'FlashCraft Entertainment',
  subtitle: 'Bringing event magic online with a bold, mobile-friendly experience.',
  bg: 'bg-[#893895]',
  img: './images/w-flashcraft.webp',
  link: './flashcraft-events-case-study/index.html'
}, {
  id: '5',
  name: 'sharpz',
  label: '(Visual Design)',
  title: 'Sharpz Landing Page',
  subtitle: 'Clean, bold, and conversion-focused design for a modern product.',
  bg: 'bg-[#2a2d2a]',
  img: './images/w-sharpz.webp',
  link: 'https://www.behance.net/gallery/154341755/Sharpz-Figma-Webflow-Landing-Page'
}, {
  id: '6',
  name: 'rawstream',
  label: '(Branding & Design)',
  title: 'Rawstream Identity',
  subtitle: 'Crafting a sharp visual identity and a scroll-worthy digital home.',
  bg: 'bg-[#0a1843]',
  img: './images/w-rawstream.webp',
  link: 'https://www.figma.com/proto/deWzbWtpyFg8DHX0VVJiyZ/Case-studies?node-id=440-27&viewport=114%2C356%2C1.12&t=kOK5ulmJdabdoqDg-1&scaling=min-zoom&content-scaling=fixed&page-id=440%3A7'
}];
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
};
const activatable = onActivate => ({
  role: 'button',
  tabIndex: 0,
  onClick: onActivate,
  onKeyDown: e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate(e);
    }
  }
});
const openProject = p => {
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
const Carousel = ({
  items,
  sizes,
  gap,
  opacities,
  stageClass,
  onOpen,
  renderCard,
  cardStyle,
  label
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const winW = useWindowWidth();
  const dragStartX = useRef(null);
  const isDragging = useRef(false);
  const len = items.length;
  const step = dir => setActiveIndex(p => (p + dir + len) % len);
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const timer = setInterval(() => step(1), 4000);
    return () => clearInterval(timer);
  }, [paused]);
  const tier = winW >= 1024 ? 'lg' : winW >= 768 ? 'md' : 'sm';
  const getSize = absDiff => sizes[tier][Math.min(absDiff, 2)];
  const getTranslateX = diff => {
    if (diff === 0) return 0;
    const a = Math.abs(diff);
    const c = getSize(0),
      adj = getSize(1),
      far = getSize(2);
    let x = c.w / 2 + gap + adj.w / 2;
    if (a >= 2) x += adj.w / 2 + gap + far.w / 2;
    if (a >= 3) x += far.w / 2 + gap + far.w / 2;
    return Math.sign(diff) * x;
  };
  const onPointerDown = e => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  };
  const onPointerMove = e => {
    if (dragStartX.current !== null && Math.abs(e.clientX - dragStartX.current) > 5) isDragging.current = true;
  };
  const onPointerEnd = e => {
    if (dragStartX.current === null) return;
    const d = e.clientX - dragStartX.current;
    if (Math.abs(d) > 50) step(d < 0 ? 1 : -1);
    dragStartX.current = null;
  };
  return React.createElement("div", {
    role: "region",
    "aria-roledescription": "carousel",
    "aria-label": label,
    style: {
      height: getSize(0).h + 60 + 'px',
      touchAction: 'pan-y'
    },
    className: "relative w-full flex justify-center items-center overflow-hidden cursor-grab active:cursor-grabbing",
    onPointerDown: onPointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerLeave: onPointerEnd,
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
    onKeyDown: e => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    }
  }, items.map((item, i) => {
    let diff = i - activeIndex;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;
    const absDiff = Math.abs(diff);
    const isCenter = diff === 0;
    const {
      w,
      h
    } = getSize(absDiff);
    const [opacity, zIndex] = opacities[absDiff] || [0, 5];
    const activate = () => {
      if (isDragging.current) return;
      if (isCenter) onOpen(item);else setActiveIndex(i);
    };
    return React.createElement("div", {
      key: item.id,
      ...activatable(activate),
      "aria-label": isCenter ? `Open ${item.title}` : `Show ${item.title}`,
      style: {
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
        ...cardStyle(isCenter)
      },
      className: `group ${stageClass}`
    }, renderCard(item, i, isCenter));
  }));
};
const WorkImageSlider = () => React.createElement("section", {
  className: "relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y border-black/10 bg-transparent my-16 md:my-24 py-12 md:py-16 select-none"
}, React.createElement("div", {
  className: "max-w-7xl mx-auto px-6 md:px-12 flex items-center mb-10"
}, React.createElement("div", {
  className: "flex items-center gap-3"
}, React.createElement("span", {
  className: "w-2.5 h-2.5 rounded-full bg-black animate-pulse inline-block",
  "aria-hidden": "true"
}), React.createElement("h2", {
  className: "text-xs md:text-sm font-bold text-black/60 tracking-widest uppercase font-syne"
}, "// Featured Case Studies"))), React.createElement(Carousel, {
  label: "Featured case studies",
  items: CASE_STUDIES,
  gap: 24,
  stageClass: "shadow-md",
  sizes: {
    lg: [{
      w: 380,
      h: 520
    }, {
      w: 300,
      h: 420
    }, {
      w: 240,
      h: 340
    }],
    md: [{
      w: 310,
      h: 430
    }, {
      w: 248,
      h: 348
    }, {
      w: 200,
      h: 280
    }],
    sm: [{
      w: 240,
      h: 340
    }, {
      w: 200,
      h: 282
    }, {
      w: 164,
      h: 228
    }]
  },
  opacities: [[1, 30], [0.8, 20], [0.5, 15], [0.2, 10]],
  cardStyle: () => ({
    backgroundColor: '#e0e0e0',
    border: '1px solid rgba(0,0,0,0.08)'
  }),
  onOpen: openProject,
  renderCard: project => React.createElement(React.Fragment, null, React.createElement("img", {
    src: project.img,
    alt: "",
    loading: "lazy",
    decoding: "async",
    draggable: false,
    className: "w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
  }), React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 sm:p-7 text-white"
  }, React.createElement("div", {
    className: "flex justify-end"
  }, React.createElement("div", {
    className: "w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
  }, React.createElement(ArrowUpRight, {
    className: "w-5 h-5",
    strokeWidth: 2.2
  }))), React.createElement("div", {
    className: "transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
  }, React.createElement("span", {
    className: "text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white/70 block mb-1.5 font-syne"
  }, project.label), React.createElement("h3", {
    className: "text-base sm:text-xl md:text-2xl font-bold line-clamp-2 leading-tight font-syne"
  }, project.title), React.createElement("p", {
    className: "text-xs sm:text-sm text-white/80 line-clamp-2 mt-1.5 font-medium hidden sm:block"
  }, project.subtitle))))
}));
const INSTAGRAM_REELS = [{
  id: 'reel-1',
  title: 'Design Workflow & AI Tools',
  caption: 'How I use NotebookLM & Claude in my daily UX design process.',
  views: '42.5K',
  likes: '3.8K',
  tag: 'UX Process',
  img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  link: 'https://www.instagram.com/kyayaarbatra/'
}, {
  id: 'reel-2',
  title: 'Micro-Interactions & Motion',
  caption: 'Exploring subtle micro-animations that elevate user delight.',
  views: '68.2K',
  likes: '5.4K',
  tag: 'Motion Design',
  img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  link: 'https://www.instagram.com/kyayaarbatra/'
}, {
  id: 'reel-3',
  title: 'App UX Breakdown',
  caption: 'Deconstructing what makes modern mobile UI clean and accessible.',
  views: '54.9K',
  likes: '4.1K',
  tag: 'UX Audit',
  img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
  link: 'https://www.instagram.com/kyayaarbatra/'
}, {
  id: 'reel-4',
  title: 'Behind the Scenes: Video Editing',
  caption: 'Pacing, color grading, and timing visual stories.',
  views: '39.7K',
  likes: '2.9K',
  tag: 'Video Editing',
  img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
  link: 'https://www.instagram.com/kyayaarbatra/'
}, {
  id: 'reel-5',
  title: 'Life Outside Design',
  caption: 'Capturing moments, travel, and everyday design inspirations.',
  views: '31.4K',
  likes: '2.5K',
  tag: 'Vlog & Life',
  img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
  link: 'https://www.instagram.com/kyayaarbatra/'
}];
const ReelsImageSlider = () => React.createElement("section", {
  className: "relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y border-black/10 bg-[#111111] text-white my-16 md:my-24 py-12 md:py-16 select-none"
}, React.createElement("div", {
  className: "max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between mb-10"
}, React.createElement("div", {
  className: "flex items-center gap-3"
}, React.createElement("span", {
  className: "w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse inline-block",
  "aria-hidden": "true"
}), React.createElement("h2", {
  className: "text-xs md:text-sm font-bold text-white/70 tracking-widest uppercase font-syne"
}, "// Instagram Reels Showcase")), React.createElement("span", {
  className: "text-xs text-white/50 hidden md:inline-block font-mono"
}, "Swipe or drag to explore reels")), React.createElement(Carousel, {
  label: "Instagram reels",
  items: INSTAGRAM_REELS,
  gap: 28,
  stageClass: "shadow-2xl",
  sizes: {
    lg: [{
      w: 300,
      h: 533
    }, {
      w: 230,
      h: 408
    }, {
      w: 180,
      h: 320
    }],
    md: [{
      w: 250,
      h: 444
    }, {
      w: 190,
      h: 337
    }, {
      w: 150,
      h: 266
    }],
    sm: [{
      w: 210,
      h: 373
    }, {
      w: 160,
      h: 284
    }, {
      w: 125,
      h: 222
    }]
  },
  opacities: [[1, 30], [0.75, 20], [0.45, 15], [0.2, 10]],
  cardStyle: isCenter => ({
    borderRadius: '16px',
    backgroundColor: '#1a1a1a',
    border: isCenter ? '2px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
  }),
  onOpen: reel => window.open(reel.link, '_blank', 'noopener,noreferrer'),
  renderCard: (reel, i, isCenter) => React.createElement(React.Fragment, null, React.createElement("img", {
    src: reel.img,
    alt: "",
    loading: "lazy",
    decoding: "async",
    draggable: false,
    className: "w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
  }), React.createElement("div", {
    className: "absolute top-3 left-3 right-3 flex justify-between items-center z-10"
  }, React.createElement("span", {
    className: "bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 border border-white/10 flex items-center gap-1.5 font-syne"
  }, React.createElement(Instagram, {
    size: 12,
    className: "text-pink-400"
  }), reel.tag), reel.views && React.createElement("span", {
    className: "bg-black/60 backdrop-blur-md text-[10px] font-mono px-2 py-0.5 rounded-full text-white/70 border border-white/10"
  }, reel.views, " views")), React.createElement("div", {
    className: `absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`
  }, React.createElement("div", {
    className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform duration-300"
  }, React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true"
  }, React.createElement("polygon", {
    points: "5 3 19 12 5 21 5 3"
  })))), React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white"
  }, React.createElement("span", {
    className: "text-[11px] font-bold text-pink-400 font-syne mb-1.5"
  }, "@kyayaarbatra"), React.createElement("h3", {
    className: "text-sm sm:text-base md:text-lg font-bold line-clamp-2 leading-tight font-syne text-white"
  }, reel.title), React.createElement("p", {
    className: "text-[11px] sm:text-xs text-white/80 line-clamp-2 mt-1 font-medium hidden sm:block"
  }, reel.caption), React.createElement("div", {
    className: "mt-3 pt-2 border-t border-white/10 text-[11px] font-semibold text-white/90"
  }, React.createElement("span", {
    className: "inline-flex items-center gap-1 group-hover:text-pink-400 transition-colors"
  }, "Watch Reel ", React.createElement(ArrowUpRight, {
    size: 14
  })))))
}));
const ExtracurricularPage = () => {
  const highlights = [{
    title: 'Video Editing & Visual FX',
    desc: 'Crafting engaging cuts, smooth motion graphics, color grading, and visual storytelling.'
  }, {
    title: 'Instagram Reels & Content Creation',
    desc: 'Creating bite-sized design breakdowns, UX audits, productivity insights, and tech reviews.'
  }, {
    title: 'AI & Creative Workflows',
    desc: 'Leveraging cutting-edge generative tools to brainstorm, rapidly prototype, and streamline workflows.'
  }, {
    title: 'Community & Beyond',
    desc: 'Sharing design learnings, inspiring upcoming creators, and capturing everyday life & travel snippets.'
  }];
  return React.createElement("main", {
    className: "bg-transparent min-h-screen"
  }, React.createElement("div", {
    className: "px-6 md:px-12 pt-8 pb-12"
  }, React.createElement(Header, {
    title: "Extra-Curricular",
    subtitle: "Exploring storytelling, content creation, visual arts, and life beyond the screen."
  }), React.createElement("section", {
    className: "max-w-7xl mx-auto mt-8 border-t border-black/10 pt-12 md:pt-16"
  }, React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
  }, React.createElement(FadeUp, {
    delay: 0.1,
    className: "lg:col-span-7 flex flex-col gap-6"
  }, React.createElement("h2", {
    className: "text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a] font-syne"
  }, "Creative Pursuits & Visual Experiments"), React.createElement("p", {
    className: "text-black/80 leading-relaxed text-base md:text-lg"
  }, "Beyond digital product and UX design, I spend time creating visual content, editing videos, and breaking down user experiences through Instagram Reels and short-form storytelling."), React.createElement("p", {
    className: "text-black/80 leading-relaxed text-base md:text-lg"
  }, "Whether it's dissecting micro-interactions, showcasing design workflows with AI tools like Claude & NotebookLM, or documenting everyday creative inspirations, I love communicating ideas through dynamic motion and engaging visuals."), React.createElement("div", {
    className: "flex flex-wrap gap-2.5 pt-4"
  }, ['Instagram Reels', 'Video Editing', 'UX Breakdowns', 'AI Workflows', 'Content Creation', 'Visual Storytelling'].map(tag => React.createElement("span", {
    key: tag,
    className: "px-4 py-2 bg-black/5 hover:bg-black hover:text-white transition-colors duration-200 border border-black/10 rounded-full text-xs font-semibold tracking-wide text-black/80 font-syne"
  }, tag)))), React.createElement(FadeUp, {
    delay: 0.2,
    className: "lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6"
  }, highlights.map((h, i) => React.createElement("div", {
    key: i,
    className: "p-6 bg-white border border-black/10 shadow-sm flex flex-col justify-between hover:border-black/30 transition-colors"
  }, React.createElement("span", {
    className: "text-xs font-bold text-black/40 font-syne uppercase tracking-wider mb-2"
  }, "0", i + 1, " //"), React.createElement("h3", {
    className: "text-lg font-bold text-[#1a1a1a] font-syne mb-2"
  }, h.title), React.createElement("p", {
    className: "text-sm text-black/70 leading-relaxed"
  }, h.desc))))))), React.createElement(FadeUp, {
    delay: 0.2
  }, React.createElement(ReelsImageSlider, null)));
};
const HomePage = ({
  onOpenContact
}) => {
  const heroRef = useParallax(0.05);
  return React.createElement("main", null, React.createElement("header", {
    ref: heroRef,
    className: "px-6 md:px-12 pt-12 pb-16"
  }, React.createElement(FadeUp, {
    delay: 0.1,
    className: "w-full flex flex-col items-center justify-center"
  }, React.createElement("h1", {
    className: "text-[9.5vw] md:text-[9.5vw] lg:text-[7.7rem] font-black uppercase tracking-tighter text-center leading-[0.85] font-syne select-none"
  }, "Kapil Batra"), React.createElement("h2", {
    className: "text-[4.35vw] md:text-[4.35vw] lg:text-[3.55rem] font-bold tracking-tight text-center mt-4 leading-[1] font-syne select-none text-[#1a1a1a]"
  }, "AI User Experience Designer"))), React.createElement("section", {
    className: "px-6 md:px-12 max-w-7xl mx-auto w-full mb-24 relative z-10"
  }, React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start pt-16 border-t border-black/10"
  }, React.createElement(FadeUp, {
    delay: 0.2,
    className: "flex flex-col"
  }, React.createElement("div", {
    className: "flex items-center gap-6 mb-8"
  }, React.createElement("div", {
    className: "hero-avatar w-24 h-24 md:w-28 md:h-28 rounded-none overflow-hidden shrink-0 border border-black/10 bg-[#e5e5e5] shadow-md"
  }, React.createElement("img", {
    src: "./images/about.webp",
    alt: "Kapil Batra",
    className: "w-full h-full object-cover transition-transform duration-500 hover:scale-110"
  })), React.createElement("div", {
    className: "flex flex-col gap-1.5"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("span", {
    className: "relative flex h-2 w-2"
  }, React.createElement("span", {
    className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
  }), React.createElement("span", {
    className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
  })), React.createElement("span", {
    className: "text-[10px] md:text-xs font-semibold tracking-wider text-black/50 uppercase"
  }, "Available for work")), React.createElement("h3", {
    className: "text-xl md:text-2xl font-bold tracking-tight font-syne"
  }, "Kapil Batra"), React.createElement("p", {
    className: "text-xs md:text-sm text-black/60 font-medium"
  }, "AI UX & Product Designer"))), React.createElement("p", {
    className: "text-black/60 leading-relaxed text-sm md:text-base font-medium max-w-xl mb-6",
    style: {
      animation: 'fadeSlideIn 0.7s ease 0.5s both'
    }
  }, "Designing calm, precise interfaces guided by structure and typography."), React.createElement("a", {
    href: "mailto:Kapilbatrayt@gmail.com",
    className: "hero-email-link text-sm md:text-base font-medium tracking-tight text-black/60 hover:text-black transition-colors pb-0.5 self-start",
    style: {
      animation: 'fadeSlideIn 0.7s ease 0.65s both'
    }
  }, "Kapilbatrayt@gmail.com")), React.createElement(FadeUp, {
    delay: 0.3,
    className: "flex flex-col justify-between h-full min-h-[250px] lg:min-h-[280px]"
  }, React.createElement("div", null, React.createElement("span", {
    className: "text-xs md:text-sm font-bold text-black/40 tracking-widest block mb-6"
  }, "// NEWEST PROJECTS"), React.createElement("div", {
    className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-4"
  }, React.createElement("p", {
    className: "text-black/60 max-w-[220px] leading-relaxed text-sm md:text-base font-medium",
    style: {
      animation: 'fadeSlideIn 0.7s ease 0.4s both'
    }
  }, "Recent projects focused on clarity and usability."), React.createElement("div", {
    className: "flex gap-4 shrink-0"
  }, React.createElement("a", {
    href: "#work",
    className: "project-thumb w-[110px] h-[80px] sm:w-[130px] sm:h-[95px] md:w-[150px] md:h-[110px] bg-[#e5e5e5] rounded-none border border-black/[0.08] shadow-sm hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 hover:border-black/20 duration-300 block",
    style: {
      animation: 'fadeSlideIn 0.6s ease 0.45s both'
    }
  }, React.createElement("img", {
    src: "./images/Certinia.webp",
    alt: "Certinia Work Planner",
    width: "150",
    height: "110",
    className: "w-full h-full object-cover"
  })), React.createElement("a", {
    href: "#work",
    className: "project-thumb w-[110px] h-[80px] sm:w-[130px] sm:h-[95px] md:w-[150px] md:h-[110px] bg-[#e5e5e5] rounded-none border border-black/[0.08] shadow-sm hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1 hover:border-black/20 duration-300 block",
    style: {
      animation: 'fadeSlideIn 0.6s ease 0.55s both'
    }
  }, React.createElement("img", {
    src: "./images/claude-logo.webp",
    alt: "AI Process Case Study",
    className: "w-full h-full object-cover"
  }))))), React.createElement("button", {
    onClick: onOpenContact,
    className: "group w-full bg-[#111111] hover:bg-black text-white py-4 relative font-semibold text-sm md:text-base transition-all hover:scale-[1.02] active:scale-[0.99] mt-10 flex justify-center items-center shadow-lg hover:shadow-xl border border-black/10 rounded-none overflow-hidden",
    style: {
      fontFamily: 'Syne, sans-serif'
    }
  }, React.createElement("span", {
    className: "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
  }), React.createElement("span", {
    className: "relative z-10"
  }, "Let's Start a Collaboration"), React.createElement("span", {
    className: "collab-btn-arrow absolute right-6 font-bold tracking-widest text-white/70 font-mono text-xs md:text-sm z-10"
  }, ">"))))), React.createElement(FadeUp, {
    delay: 0.1
  }, React.createElement(WorkImageSlider, null)), React.createElement("section", {
    id: "about",
    className: "px-6 md:px-12 mb-24 max-w-7xl mx-auto relative z-10"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-24 items-start border-black/10 pt-4"
  }, React.createElement(FadeUp, {
    delay: 0.1
  }, React.createElement("h2", {
    className: "text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight max-w-3xl border-l-[3px] border-transparent hover:border-black pl-0 hover:pl-4 transition-all duration-300"
  }, "As an AI User Experience Designer, I focus on producing top-notch and impactful digital experiences.")), React.createElement(FadeUp, {
    delay: 0.2,
    className: "md:border-l border-black/10 md:pl-24 h-full flex flex-col justify-between min-h-[150px]"
  }, React.createElement("span", {
    className: "text-lg font-medium mb-8 block"
  }, "(About me)"), React.createElement("div", {
    className: "flex gap-3 mt-auto"
  }, React.createElement("a", {
    href: "https://www.linkedin.com/in/kapil-batra",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "LinkedIn",
    className: "w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-90 transition-all duration-200"
  }, React.createElement(Linkedin, {
    size: 18
  })), React.createElement("a", {
    href: "https://www.behance.net/kapilbatra1",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Behance",
    className: "w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-90 transition-all duration-200"
  }, React.createElement(BehanceIcon, {
    size: 18
  })), React.createElement("a", {
    href: "https://www.instagram.com/kyayaarbatra/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Instagram",
    className: "w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-90 transition-all duration-200"
  }, React.createElement(Instagram, {
    size: 18
  })))))), React.createElement("section", {
    className: "px-6 md:px-12 mb-24 max-w-7xl mx-auto"
  }, React.createElement("div", {
    className: "border-t border-black/10 pt-16 flex flex-col lg:flex-row gap-12 lg:gap-0"
  }, React.createElement("div", {
    className: "w-full lg:w-1/4 shrink-0"
  }, React.createElement(FadeUp, {
    delay: 0.1
  }, React.createElement("span", {
    className: "text-2xl font-medium block sticky top-8"
  }, "(What I do)"))), React.createElement("div", {
    className: "w-full lg:w-3/4 lg:border-l border-black/10 grid grid-cols-1 md:grid-cols-2"
  }, React.createElement(FadeUp, {
    delay: 0.2,
    className: "p-0 pb-12 md:p-12 md:pt-0 border-b border-black/10 md:border-r"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight group-hover:text-black/70"
  }, "UX Design"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base"
  }, "I blend user needs with business goals to craft intuitive experiences — wireframes, prototypes, and design systems that guide people seamlessly through digital products.")), React.createElement(FadeUp, {
    delay: 0.3,
    className: "p-0 py-12 md:p-12 md:pt-0 border-b border-black/10"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight"
  }, "Business Research"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base"
  }, "Understanding the \"why\" behind user behavior and business needs helps me design with purpose. I dive into data, competitor landscapes, and product goals to shape smarter, user-focused decisions.")), React.createElement(FadeUp, {
    delay: 0.4,
    className: "p-0 py-12 md:p-12 md:pb-0 border-b md:border-b-0 border-black/10 md:border-r"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight"
  }, "Brand & Graphic Design"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base"
  }, "From logos to social media creatives, I translate ideas into visuals that stay consistent across platforms, building the recognition and emotional connection brands need to be remembered.")), React.createElement(FadeUp, {
    delay: 0.5,
    className: "p-0 pt-12 md:p-12 md:pb-0"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight"
  }, "Photography & Video Editing"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base"
  }, "I bring stories to life through visuals — whether it's product shots, team culture, or motion-based storytelling — to elevate design presentations, brand messaging, and product demos."))))), React.createElement("section", {
    className: "px-6 md:px-12 mb-24 max-w-7xl mx-auto"
  }, React.createElement("div", {
    className: "border-t border-black/10 pt-16 flex flex-col lg:flex-row gap-12 lg:gap-0"
  }, React.createElement("div", {
    className: "w-full lg:w-1/4 shrink-0"
  }, React.createElement(FadeUp, {
    delay: 0.1
  }, React.createElement("span", {
    className: "text-2xl font-medium block sticky top-8"
  }, "(Testimonials)"))), React.createElement("div", {
    className: "w-full lg:w-3/4 lg:border-l border-black/10 grid grid-cols-1 md:grid-cols-2"
  }, React.createElement(FadeUp, {
    delay: 0.2,
    className: "p-0 pb-12 md:p-12 md:pt-0 border-b border-black/10 md:border-r flex flex-col h-full"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight"
  }, "MotorPedia"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8"
  }, "Kapil helped us design our mobile app from scratch. He understood our complex inventory and service flows very quickly and made them super easy to use. The designs looked premium too. Great experience working with him!"), React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("img", {
    src: "./images/Vibhore.png",
    alt: "Vibhore Kumar",
    className: "w-10 h-10 rounded-full object-cover shadow-sm bg-black/5"
  }), React.createElement("div", null, React.createElement("h4", {
    className: "font-semibold text-sm"
  }, "Vibhore Kumar"), React.createElement("span", {
    className: "text-xs text-black/60"
  }, "Founder, MotorPedia")))), React.createElement(FadeUp, {
    delay: 0.3,
    className: "p-0 py-12 md:p-12 md:pt-0 border-b border-black/10 flex flex-col h-full"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight"
  }, "Student Circus"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8"
  }, "Kapil has a sharp eye for what students really need. He made our platform more user-friendly and visually appealing. He's also very cooperative and always open to feedback. Highly recommended!"), React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("img", {
    src: "./images/Dhruv.png",
    alt: "Dhruv Krishnaraj",
    className: "w-10 h-10 rounded-full object-cover shadow-sm bg-black/5"
  }), React.createElement("div", null, React.createElement("h4", {
    className: "font-semibold text-sm"
  }, "Dhruv Krishnaraj"), React.createElement("span", {
    className: "text-xs text-black/60"
  }, "Founder, Student Circus")))), React.createElement(FadeUp, {
    delay: 0.4,
    className: "p-0 py-12 md:p-12 md:pb-0 border-b md:border-b-0 border-black/10 md:border-r flex flex-col h-full"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight"
  }, "FlashCraft Events"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8"
  }, "We had no idea how to show our event services online in a clean way. Kapil turned our ideas into a modern website & app. His designs brought a lot of compliments from our clients!"), React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("img", {
    src: "./images/Nishant.png",
    alt: "Nishant",
    className: "w-10 h-10 rounded-full object-cover shadow-sm bg-black/5"
  }), React.createElement("div", null, React.createElement("h4", {
    className: "font-semibold text-sm"
  }, "Nishant"), React.createElement("span", {
    className: "text-xs text-black/60"
  }, "Founder, FlashCraft Events")))), React.createElement(FadeUp, {
    delay: 0.5,
    className: "p-0 pt-12 md:p-12 md:pb-0 flex flex-col h-full"
  }, React.createElement("h3", {
    className: "text-2xl font-semibold mb-4 tracking-tight"
  }, "Metacube Softwares"), React.createElement("p", {
    className: "text-black/70 leading-relaxed text-sm md:text-base flex-grow mb-8"
  }, "Kapil has been a huge asset to our team. He's not just a designer. He thinks about the product, the user, and the business. Always proactive and dependable. A true all-rounder!"), React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("img", {
    src: "./images/Himank.png",
    alt: "Himank Jha",
    className: "w-10 h-10 rounded-full object-cover shadow-sm bg-black/5"
  }), React.createElement("div", null, React.createElement("h4", {
    className: "font-semibold text-sm"
  }, "Himank Jha"), React.createElement("span", {
    className: "text-xs text-black/60"
  }, "UX Manager, Certinia Project"))))))));
};
const WorkPage = () => {
  const projects = CASE_STUDIES;
  return React.createElement("main", null, React.createElement(Header, {
    title: "Work",
    subtitle: "Turning confusion into clicks, with flair."
  }), React.createElement("section", {
    className: "w-full bg-white"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
  }, projects.map((p, i) => React.createElement(FadeUp, {
    key: p.id,
    delay: 0.1 * (i % 3),
    className: `w-full flex flex-col group cursor-pointer bg-[#f3f3f3] hover:bg-[#222222] focus-visible:bg-[#222222] transition-colors duration-300 border-b border-black/10 ${i % 3 !== 2 ? 'lg:border-r border-black/10' : ''}`,
    ...activatable(() => openProject(p))
  }, React.createElement("div", {
    className: `w-full h-[250px] md:h-[350px] relative overflow-hidden ${p.bg} border-b border-black/10`
  }, React.createElement("img", {
    src: p.img,
    alt: "",
    loading: "lazy",
    decoding: "async",
    className: "absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
  })), React.createElement("div", {
    className: "p-8 md:p-10 flex flex-col flex-grow transition-colors duration-300"
  }, React.createElement("span", {
    className: "text-sm font-medium mb-5 text-black group-hover:text-white/80 transition-colors inline-block"
  }, p.label), React.createElement("h3", {
    className: "text-2xl md:text-[1.7rem] leading-[1.2] font-bold tracking-tight mb-4 text-black group-hover:text-white transition-colors"
  }, p.title), React.createElement("p", {
    className: "text-black/70 group-hover:text-white/80 leading-relaxed text-[15px] transition-colors"
  }, p.subtitle)))))));
};
const AboutPage = () => {
  const experience = [{
    title: 'AI UX Designer (promoted once)',
    company: 'Metacube Softwares, Jaipur',
    date: 'Mar 2022 - Present',
    skills: ['UX Research', 'Salesforce LDS', 'Collaboration', 'User Interaction', 'Usability testing', 'Accessibility'],
    bullets: ['Led usability testing, tracked issues, iterated on designs, and collaborated with product managers, developers, and visual designers to ensure alignment with business goals and user needs.', "Improving the UI & UX of Certinia's Resource & Project management tools while working/Improving the Salesforce Lightning Design System", 'Collaborating with UK/Spain/US UX team to create custom design system & designs to solve user problems', 'Conducted user and stakeholder research, analysed task models, defined workflows, and created wireframes and prototypes to inform design solutions and improve user experience.', 'Applied AI to analyze large sets of customer interviews and usage data, identifying hidden patterns and unmet needs; used these insights to redesign workflows in Salesforce apps, reduce user friction, and boost engagement.']
  }, {
    title: 'UI Designer/Product designer',
    company: 'FirstPrinciples holding company, Bengaluru',
    date: 'Aug 2021 - Mar 2022',
    skills: ['Mobile & Web UI Design', 'Branding', 'Collaboration', 'Social Media Posts', 'Graphic Design'],
    bullets: ['Created visually appealing and intuitive user interfaces for mass-market consumer apps such Omni Outreach, Syndication Pro, Rawstream etc. ensuring consistency in branding, typography, color schemes, and layout', "Designed compelling infographics and visually engaging social media posts to convey information, promote the startup's brand, and drive user engagement on various platforms"]
  }, {
    title: 'Freelance product designer & Video Editor',
    company: 'Freelance',
    date: 'Oct 2019 - Present',
    skills: ['End to End Design', 'UX Research', 'Design Systems', 'AI', 'User Interviews', 'UX Audits'],
    bullets: ['Designed and delivered end-to-end digital experiences across diverse industries including Automobile (Motorpedia), Education (Mentor Clan, Student Circus), Resource Management (Culture Hint), Event Management (Rayna Events, Flashcraft Entertainment) etc.', 'Improved user engagement and retention by conducting user research, usability testing, and translating insights into intuitive design solutions tailored for each domain.', 'Collaborated directly with clients and stakeholders, aligning business objectives with user needs through workshops, wireframes, and interactive prototypes.', "Delivered measurable impact such as increasing Student Circus' average session duration by 73% through dashboard redesign, gamification, and community features."]
  }, {
    title: 'Process Executive-Data',
    company: 'Cognizant , Gurugram',
    date: 'Jun 2018 - Sept 2019',
    skills: ['Copywriting', 'Keyword Extraction', 'Data Analysis', 'SEO'],
    bullets: ["Optimised search engine results and designing SMPs that appeared on google's search results page"]
  }];
  return React.createElement("main", {
    className: "w-full flex flex-col lg:flex-row relative"
  }, React.createElement("div", {
    className: "w-full lg:w-1/2 lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px] relative group border-r border-black/10 z-30 bg-[#e5e5e5]"
  }, React.createElement("div", {
    className: "absolute inset-0 overflow-hidden"
  }, React.createElement("img", {
    src: "./images/about.webp",
    alt: "Kapil Batra",
    className: "w-full h-[60vh] lg:h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
  }))), React.createElement("div", {
    className: "w-full lg:w-1/2 flex flex-col bg-transparent z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)]"
  }, React.createElement("div", {
    className: "pt-8"
  }, React.createElement(Header, {
    title: "Kapil Batra",
    subtitle: "As an AI User Experience Designer, I focus on producing top-notch and impactful digital experiences."
  })), React.createElement("div", {
    className: "px-6 md:px-12 pb-24 md:pb-32 -mt-4"
  }, React.createElement(FadeUp, {
    delay: 0.1
  }, React.createElement("p", {
    className: "text-black/80 leading-loose text-base md:text-lg mb-8"
  }, "I am an AI User Experience Designer based in Jaipur with 5+ years of experience crafting intuitive, impactful digital products. I blend user research, AI tools, systems thinking, and visual design to create experiences that are both beautiful and functional."), React.createElement("p", {
    className: "text-black/80 leading-loose text-base md:text-lg mb-16"
  }, "From mobile apps to enterprise platforms, I have worked across diverse industries - shaping wireframes, prototypes, and design systems that guide users seamlessly and help businesses grow.")), React.createElement("div", {
    className: "border-t border-black/10 pt-16"
  }, React.createElement(FadeUp, {
    delay: 0.2
  }, React.createElement("h2", {
    className: "text-4xl md:text-5xl font-bold tracking-tight mb-12"
  }, "Experience")), React.createElement("div", {
    className: "space-y-16"
  }, experience.map((job, idx) => React.createElement(FadeUp, {
    key: idx,
    delay: 0.2 + idx * 0.1,
    className: "flex gap-8 group"
  }, React.createElement("div", {
    className: "flex-grow pb-8 border-b border-black/5 last:border-0 last:pb-0"
  }, React.createElement("div", {
    className: "mb-4"
  }, React.createElement("h3", {
    className: "text-2xl font-bold tracking-tight leading-snug mb-1 group-hover:text-black/70 transition-colors"
  }, job.title), React.createElement("div", {
    className: "flex flex-wrap items-center gap-x-2 gap-y-1"
  }, React.createElement("span", {
    className: "text-[#1a1a1a] font-medium"
  }, job.company), React.createElement("span", {
    className: "hidden md:inline text-black/30"
  }, "•"), React.createElement("span", {
    className: "text-black/50 text-sm font-medium"
  }, job.date))), React.createElement("ul", {
    className: "space-y-4 mb-6"
  }, job.bullets.map((bullet, bIdx) => React.createElement("li", {
    key: bIdx,
    className: "flex gap-4 text-black/80 leading-relaxed text-[15px]"
  }, React.createElement("div", {
    className: "w-[6px] h-[6px] rounded-full bg-black/30 mt-2 shrink-0"
  }), React.createElement("span", null, bullet)))), React.createElement("div", {
    className: "flex flex-wrap gap-2 mt-6"
  }, job.skills.map(skill => React.createElement("span", {
    key: skill,
    className: "px-3 py-1.5 bg-[#e5e5e5] rounded-md text-xs font-semibold tracking-wide text-black/70 hover:bg-black hover:text-white transition-colors cursor-default"
  }, skill)))))))), React.createElement("div", {
    className: "border-t border-black/10 pt-16 mt-8"
  }, React.createElement(FadeUp, {
    delay: 0.4
  }, React.createElement("h2", {
    className: "text-4xl md:text-5xl font-bold tracking-tight mb-8"
  }, "Awards/Appreciations"), React.createElement("ul", {
    className: "space-y-5 mt-8"
  }, React.createElement("li", {
    className: "text-lg font-medium text-black/80 flex items-center gap-4"
  }, React.createElement("div", {
    className: "w-[6px] h-[6px] rounded-full bg-black shrink-0"
  }), "Team of the Year (2024)"), React.createElement("li", {
    className: "text-lg font-medium text-black/80 flex items-center gap-4"
  }, React.createElement("div", {
    className: "w-[6px] h-[6px] rounded-full bg-black shrink-0"
  }), "Hero in the rank (2025)"), React.createElement("li", {
    className: "text-lg font-medium text-black/80 flex items-center gap-4"
  }, React.createElement("div", {
    className: "w-[6px] h-[6px] rounded-full bg-black shrink-0"
  }), "9 client appreciations in 2 years (2023 - 2025)")))))));
};
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/kapilbatrayt@gmail.com';
const SuccessCard = () => React.createElement("div", {
  role: "status",
  className: "bg-white border border-green-200 text-green-800 p-8 rounded-2xl text-center shadow-sm"
}, React.createElement("span", {
  className: "text-4xl mb-4 block",
  "aria-hidden": "true"
}, "👋"), React.createElement("p", {
  className: "font-bold text-lg"
}, "Message sent successfully!"), React.createElement("p", {
  className: "text-sm mt-2 opacity-80"
}, "I'll get back to you within a day or two."));
const ContactForm = ({
  idPrefix,
  compact = false,
  onSent,
  className = ''
}) => {
  const [status, setStatus] = useState('idle');
  const fieldClass = `w-full bg-white border border-black/10 rounded-none px-4 ${compact ? 'py-3' : 'py-4'} focus:ring-2 focus:ring-black/20 outline-none transition-shadow text-[#1a1a1a]`;
  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('loading');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: new FormData(form)
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
  if (status === 'success') return React.createElement(SuccessCard, null);
  return React.createElement("form", {
    onSubmit: handleSubmit,
    className: `space-y-6 ${className}`
  }, React.createElement("input", {
    type: "hidden",
    name: "_captcha",
    value: "false"
  }), React.createElement("div", null, React.createElement("label", {
    htmlFor: `${idPrefix}-name`,
    className: "block text-sm font-bold mb-2 text-[#1a1a1a]"
  }, "Name"), React.createElement("input", {
    id: `${idPrefix}-name`,
    type: "text",
    name: "name",
    autoComplete: "name",
    required: true,
    className: fieldClass,
    placeholder: "John Doe"
  })), React.createElement("div", null, React.createElement("label", {
    htmlFor: `${idPrefix}-email`,
    className: "block text-sm font-bold mb-2 text-[#1a1a1a]"
  }, "Email"), React.createElement("input", {
    id: `${idPrefix}-email`,
    type: "email",
    name: "email",
    autoComplete: "email",
    required: true,
    className: fieldClass,
    placeholder: "john@example.com"
  })), React.createElement("div", null, React.createElement("label", {
    htmlFor: `${idPrefix}-message`,
    className: "block text-sm font-bold mb-2 text-[#1a1a1a]"
  }, "Message"), React.createElement("textarea", {
    id: `${idPrefix}-message`,
    name: "message",
    required: true,
    rows: compact ? 4 : 5,
    className: `${fieldClass} resize-none`,
    placeholder: "How can I help you?"
  })), React.createElement("button", {
    type: "submit",
    disabled: status === 'loading',
    className: "w-full bg-[#1a1a1a] text-white py-4 rounded-none font-semibold hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-70 disabled:hover:scale-100"
  }, status === 'loading' ? 'Sending...' : 'Send Message'), status === 'error' && React.createElement("p", {
    role: "alert",
    className: "text-red-600 text-sm font-medium text-center"
  }, "Message couldn't be sent. Please try again or email me directly at kapilbatrayt@gmail.com."));
};
const ContactPage = () => React.createElement("main", {
  id: "main",
  className: "w-full flex flex-col lg:flex-row relative"
}, React.createElement("div", {
  className: "w-full lg:w-1/2 lg:h-[calc(100vh-80px)] lg:sticky lg:top-[80px] relative group border-r border-black/10 z-30 bg-[#e5e5e5]"
}, React.createElement("div", {
  className: "absolute inset-0 overflow-hidden"
}, React.createElement("img", {
  src: "./images/about.webp",
  alt: "Kapil Batra",
  className: "w-full h-[60vh] lg:h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
}))), React.createElement("div", {
  className: "w-full lg:w-1/2 flex flex-col bg-transparent z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] min-h-[calc(100vh-80px)] justify-center"
}, React.createElement("div", {
  className: "px-6 md:px-12 py-24 md:py-32 flex-grow flex flex-col justify-center"
}, React.createElement(FadeUp, {
  delay: 0.1
}, React.createElement("h1", {
  className: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 text-[#1a1a1a]"
}, "Get in touch"), React.createElement("p", {
  className: "text-black/60 mb-12 font-medium text-lg"
}, "Drop me a message and I'll get back to you soon."), React.createElement(ContactForm, {
  idPrefix: "page",
  className: "max-w-lg"
})))));
const ContactModal = ({
  isOpen,
  onClose
}) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    const onKeyDown = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('input:not([type=hidden])')?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return React.createElement("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center p-4"
  }, React.createElement("div", {
    className: "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
    onClick: onClose,
    "aria-hidden": "true"
  }), React.createElement("div", {
    ref: dialogRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "contact-modal-title",
    className: "relative bg-[#f3f3f3] w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl p-8 md:p-12 shadow-2xl border border-black/10 animate-[scaleIn_0.3s_ease-out]"
  }, React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close contact form",
    className: "absolute top-6 right-6 text-black/50 hover:text-black transition-colors bg-black/5 rounded-full p-2"
  }, React.createElement(X, {
    size: 20,
    strokeWidth: 2.5
  })), React.createElement("h2", {
    id: "contact-modal-title",
    className: "text-3xl font-bold tracking-tight mb-2 text-[#1a1a1a]"
  }, "Get in touch"), React.createElement("p", {
    className: "text-black/60 mb-8 font-medium"
  }, "Drop me a message and I'll get back to you soon."), React.createElement(ContactForm, {
    idPrefix: "modal",
    compact: true,
    onSent: onClose
  })));
};
const ROUTES = {
  '#home': 'Kapil Batra - AI User Experience Designer & Product Designer',
  '#work': 'Work | Kapil Batra',
  '#about': 'About | Kapil Batra',
  '#extra-curricular': 'Extra-curricular | Kapil Batra',
  '#contact': 'Contact | Kapil Batra'
};
const normalizeRoute = hash => {
  const route = hash === '#extracurricular' ? '#extra-curricular' : hash || '#home';
  return route in ROUTES ? route : '#home';
};
function App() {
  const [currentRoute, setCurrentRoute] = useState(() => normalizeRoute(window.location.hash));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const siteRef = useRef(null);
  const gridCanvasRef = useRef(null);
  const toggleMenu = () => setIsMenuOpen(open => !open);
  const openContact = () => setIsContactOpen(true);
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(normalizeRoute(window.location.hash));
      setIsMenuOpen(false);
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  useEffect(() => {
    document.title = ROUTES[currentRoute];
  }, [currentRoute]);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isContactOpen ? 'hidden' : '';
    if (!isMenuOpen) return;
    const onKeyDown = e => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen, isContactOpen]);
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const site = siteRef.current;
    if (!canvas || !site || prefersReducedMotion()) return;
    const context = canvas.getContext('2d');
    const pointer = {
      x: -1000,
      y: -1000,
      energy: 0
    };
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
          const offsetX = distance ? dx / distance * shift : 0;
          const offsetY = distance ? dy / distance * shift : 0;
          context.fillRect(x + offsetX - 0.9, y + offsetY - 0.9, 1.8, 1.8);
        }
      }
      if (pointer.energy > 0.01) schedule();
    };
    const schedule = () => {
      if (!frameId) frameId = requestAnimationFrame(draw);
    };
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
    const movePointer = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY + window.scrollY;
      pointer.energy = 1;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(site);
    resize();
    window.addEventListener('pointermove', movePointer, {
      passive: true
    });
    window.addEventListener('scroll', schedule, {
      passive: true
    });
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('pointermove', movePointer);
      window.removeEventListener('scroll', schedule);
    };
  }, []);
  const breadcrumb = {
    '#work': 'Work',
    '#about': 'About',
    '#extra-curricular': 'Extra-curricular',
    '#contact': 'Contact'
  }[currentRoute];
  return React.createElement("div", {
    ref: siteRef,
    className: "bg-[#f3f3f3] text-[#1a1a1a] min-h-screen font-sans selection:bg-[#1a1a1a] selection:text-white relative flex flex-col justify-between"
  }, React.createElement("canvas", {
    ref: gridCanvasRef,
    className: "site-dot-grid",
    "aria-hidden": "true"
  }), React.createElement("div", {
    className: "relative z-10 flex min-h-screen flex-col"
  }, React.createElement("div", {
    className: "sticky top-0 z-40 bg-[#f3f3f3]/60 backdrop-blur-2xl border-b border-black/[0.03] px-6 md:px-12 py-4 md:py-5 flex justify-between items-center transition-all duration-300 w-full"
  }, React.createElement("div", {
    className: "flex items-center gap-3 text-sm font-medium tracking-wide min-h-[32px]"
  }, React.createElement("a", {
    href: "#home",
    "aria-label": "Home",
    className: "text-xl md:text-2xl font-extrabold tracking-tighter hover:opacity-70 transition-opacity mr-1"
  }, "kb."), breadcrumb && React.createElement(React.Fragment, null, React.createElement("span", {
    className: "text-black/30 hidden md:inline",
    "aria-hidden": "true"
  }, "/"), React.createElement("span", {
    className: "text-black hidden md:inline"
  }, breadcrumb))), React.createElement("div", {
    className: "flex gap-3 md:gap-4"
  }, React.createElement("a", {
    href: "./Resume_Kapil%20Batra.pdf",
    download: "Resume_Kapil_Batra.pdf",
    className: "bg-[#1a1a1a] text-white hover:bg-black px-6 py-3 rounded-none text-xs md:text-sm font-medium transition-all hover:scale-105 active:scale-95 duration-200 shadow-sm flex items-center justify-center whitespace-nowrap"
  }, "Download Resume"), React.createElement("button", {
    onClick: toggleMenu,
    "aria-expanded": isMenuOpen,
    "aria-controls": "site-menu",
    className: "bg-[#1a1a1a] text-white hover:bg-black px-6 py-3 rounded-none text-xs md:text-sm font-medium transition-all hover:scale-105 active:scale-95 duration-200 shadow-sm max-h-min"
  }, "Menu"))), currentRoute === '#work' ? React.createElement(WorkPage, null) : currentRoute === '#about' ? React.createElement(AboutPage, null) : currentRoute === '#extra-curricular' ? React.createElement(ExtracurricularPage, null) : currentRoute === '#contact' ? React.createElement(ContactPage, null) : React.createElement(HomePage, {
    onOpenContact: openContact
  }), React.createElement(Footer, {
    hasTopMargin: ['#home', '#work', '#extra-curricular'].includes(currentRoute),
    onOpenContact: openContact
  }), React.createElement(MenuOverlay, {
    isMenuOpen: isMenuOpen,
    toggleMenu: toggleMenu
  }), React.createElement(ContactModal, {
    isOpen: isContactOpen,
    onClose: () => setIsContactOpen(false)
  })));
}
createRoot(document.getElementById('root')).render(React.createElement(App, null));
})();
