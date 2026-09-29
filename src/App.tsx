import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  FaGithub, FaEnvelope, FaExternalLinkAlt, FaPython, FaReact, FaLaravel, FaPhp, FaNodeJs,
  FaDocker, FaDatabase, FaHtml5, FaJs, FaGitAlt, FaBars, FaTimes, FaArrowUp, FaDownload,
  FaCode, FaServer, FaCheck,
} from 'react-icons/fa';
import './index.css';
import './effects.css';

const BASE = import.meta.env.BASE_URL;
const NAV = ['home', 'about', 'skills', 'projects', 'contact'];
const ROLES = ['Full Stack Developer', 'React & TypeScript Engineer', 'Laravel Backend Developer', 'Problem Solver'];
const EMAIL = 'dinaabdelbaset08@gmail.com';

const SKILLS = [
  { title: 'Frontend', icon: <FaReact />, items: [[<FaReact />, 'React.js'], [<FaCode />, 'TypeScript'], [<FaCode />, 'Tailwind CSS'], [<FaHtml5 />, 'HTML5 & CSS3'], [<FaJs />, 'JavaScript ES6+']] },
  { title: 'Backend', icon: <FaServer />, items: [[<FaLaravel />, 'Laravel'], [<FaPhp />, 'PHP'], [<FaNodeJs />, 'Node.js'], [<FaNodeJs />, 'Express'], [<FaServer />, 'RESTful APIs']] },
  { title: 'Tools & Data', icon: <FaPython />, items: [[<FaPython />, 'Python'], [<FaDatabase />, 'MySQL'], [<FaDatabase />, 'PostgreSQL'], [<FaGitAlt />, 'Git & GitHub'], [<FaDocker />, 'Docker']] },
] as const;

const PROJECTS = [
  { t: 'Kemet - Tourism Platform', d: 'Tourism management dashboard and frontend for exploring historical sites, with bookings, admin dashboard and a modern UI.', tech: ['React', 'TypeScript', 'Laravel', 'MySQL'], cat: 'Full Stack', hue: 210 },
  { t: 'Car-Zone', d: 'Online automotive platform with vehicle listings, advanced search filters, authentication and an admin dashboard.', tech: ['React', 'TypeScript', 'Node.js'], cat: 'Full Stack', hue: 265 },
  { t: 'Restaurant Full Stack', d: 'Complete restaurant management system with dynamic menus, order processing and a responsive interface.', tech: ['React', 'Full Stack', 'CSS Modules'], cat: 'Full Stack', hue: 170 },
  { t: 'Korsat - Educational Platform', d: 'Online learning platform where users browse and enroll in educational courses.', tech: ['JavaScript', 'Frontend'], cat: 'Frontend', hue: 25 },
];

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1400, 1);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Typewriter() {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState('');
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = ROLES[i];
    const id = setTimeout(() => {
      if (!del && txt === full) return setDel(true);
      if (del && txt === '') { setDel(false); return setI((i + 1) % ROLES.length); }
      setTxt(full.slice(0, txt.length + (del ? -1 : 1)));
    }, !del && txt === full ? 1400 : del ? 35 : 70);
    return () => clearTimeout(id);
  }, [txt, del, i]);
  return <span className="typed">{txt}<i className="caret" /></span>;
}

const App = () => {
  const [active, setActive] = useState('home');
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('All');
  const [sent, setSent] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      bar.current?.style.setProperty('--p', `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`);
      setScrolled(h.scrollTop > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const reveal = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    }), { threshold: 0.15 });
    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) setActive(e.target.id);
    }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));
    NAV.forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
    return () => { reveal.disconnect(); spy.disconnect(); };
  }, [filter]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const root = e.currentTarget;
    root.style.setProperty('--cx', `${e.clientX}px`);
    root.style.setProperty('--cy', `${e.clientY}px`);
    const card = (e.target as HTMLElement).closest<HTMLElement>('.spot');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    if (card.classList.contains('tilt')) {
      card.style.setProperty('--ry', `${(x / r.width - 0.5) * 8}deg`);
      card.style.setProperty('--rx', `${(0.5 - y / r.height) * 8}deg`);
    }
  };
  const resetTilt = (e: MouseEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.tilt');
    card?.style.setProperty('--rx', '0deg'); card?.style.setProperty('--ry', '0deg');
  };

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio message from ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
    setSent(true); e.currentTarget.reset(); setTimeout(() => setSent(false), 4000);
  };

  const shown = PROJECTS.filter((p) => filter === 'All' || p.cat === filter);

  return (
    <div className="portfolio-app" onMouseMove={onMove} onMouseOut={resetTilt}>
      <div className="scroll-bar" ref={bar} />
      <div className="bg-fx" aria-hidden><i className="blob b1" /><i className="blob b2" /><i className="blob b3" /><i className="grid-bg" /></div>
      <div className="cursor-glow" aria-hidden />

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a href="#home" className="logo">Dina<span>.dev</span></a>
          <ul className={`nav-links ${menu ? 'open' : ''}`}>
            {NAV.map((id) => (
              <li key={id}><a href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setMenu(false)}>{id[0].toUpperCase() + id.slice(1)}</a></li>
            ))}
          </ul>
          <button className="menu-btn" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <FaTimes /> : <FaBars />}</button>
        </div>
      </nav>

      <section id="home" className="hero container">
        <div className="hero-wrapper">
          <div className="hero-content">
            <span className="badge reveal"><i className="dot" /> Open to opportunities</span>
            <h1 className="reveal" style={{ '--d': '100ms' } as React.CSSProperties}>Hi, I'm <span className="grad">Dina Abdelbaset</span></h1>
            <h2 className="reveal" style={{ '--d': '200ms' } as React.CSSProperties}><Typewriter /></h2>
            <p className="reveal" style={{ '--d': '300ms' } as React.CSSProperties}>
              I specialize in building robust and scalable web applications using React, Laravel, and Python.
              Passionate about crafting dynamic, modern user interfaces and powerful backend systems.
            </p>
            <div className="hero-buttons reveal" style={{ '--d': '400ms' } as React.CSSProperties}>
              <a href="#projects" className="btn btn-primary">View My Work</a>
              <a href={`${BASE}cv.pdf`} download className="btn btn-outline"><FaDownload /> Download CV</a>
              <a href="https://github.com/dinaabdelbaset" target="_blank" rel="noreferrer" className="btn btn-outline"><FaGithub /> GitHub</a>
            </div>
          </div>
          <div className="hero-image reveal" style={{ '--d': '300ms' } as React.CSSProperties}>
            <div className="orbit o1"><span><FaReact /></span></div>
            <div className="orbit o2"><span><FaLaravel /></span></div>
            <div className="orbit o3"><span><FaPython /></span></div>
            <div className="image-frame"><img src={`${BASE}profile.jpg`} alt="Dina Abdelbaset" /></div>
          </div>
        </div>
      </section>

      <section id="about" className="container">
        <h2 className="section-title reveal">About Me</h2>
        <div className="about-wrapper spot reveal">
          <div className="about-text">
            <h3>I'm Dina Abdelbaset, a passionate Web Developer</h3>
            <p>I am a Full Stack Web Developer with a strong foundation in modern web technologies. My journey started with a deep curiosity for how things work on the web, which evolved into building high-quality, scalable applications.</p>
            <p>With expertise in <strong>React, TypeScript, Laravel, and Python</strong>, I bridge the gap between frontend aesthetics and backend functionality, creating seamless, intuitive user experiences.</p>
            <p>Whether it's an e-commerce platform, a real-time dashboard, or a complex API, my goal is clean, maintainable code and products that make a real impact.</p>
          </div>
          <div className="about-highlights">
            {[[3, '+', 'Years of\nExperience'], [10, '+', 'Completed\nProjects'], [100, '%', 'Client\nSatisfaction']].map(([n, s, l]) => (
              <div className="highlight-item" key={l as string}>
                <span className="highlight-number"><CountUp to={n as number} suffix={s as string} /></span>
                <span className="highlight-text">{(l as string).split('\n').map((x, i) => <span key={i}>{x}<br /></span>)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="container">
        <h2 className="section-title reveal">Technical Skills</h2>
        <div className="skills-grid">
          {SKILLS.map((c, i) => (
            <div key={c.title} className="skill-category spot reveal" style={{ '--d': `${i * 120}ms` } as React.CSSProperties}>
              <h3><span className="icon-box">{c.icon}</span>{c.title}</h3>
              <div className="skill-list">
                {c.items.map(([ic, name]) => <span className="skill-tag" key={name as string}>{ic}{name}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="container">
        <h2 className="section-title reveal">Featured Projects</h2>
        <div className="filters reveal">
          {['All', 'Full Stack', 'Frontend'].map((f) => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="projects-grid">
          {shown.map((p, i) => (
            <div key={p.t} className="project-card spot tilt reveal" style={{ '--d': `${i * 100}ms`, '--h': p.hue } as React.CSSProperties}>
              <div className="project-cover"><span className="num">0{PROJECTS.indexOf(p) + 1}</span><FaCode /></div>
              <div className="project-content">
                <h3 className="project-title">{p.t}</h3>
                <p className="project-desc">{p.d}</p>
                <div className="project-tech">{p.tech.map((t) => <span className="tech-tag" key={t}>{t}</span>)}</div>
                <div className="project-links">
                  <a href="#" className="btn btn-primary btn-sm"><FaExternalLinkAlt /> Live Demo</a>
                  <a href="https://github.com/dinaabdelbaset" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><FaGithub /> Code</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="container">
        <h2 className="section-title reveal">Get In Touch</h2>
        <div className="contact-wrapper">
          <div className="contact-info reveal">
            <h3>Let's talk about your next project</h3>
            <p className="muted">I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            <a className="contact-item spot" href={`mailto:${EMAIL}`}><FaEnvelope className="contact-icon" /><div className="contact-item-details"><h4>Email</h4><p>{EMAIL}</p></div></a>
            <a className="contact-item spot" href="https://github.com/dinaabdelbaset" target="_blank" rel="noreferrer"><FaGithub className="contact-icon" /><div className="contact-item-details"><h4>GitHub</h4><p>github.com/dinaabdelbaset</p></div></a>
          </div>
          <form className="contact-form reveal" style={{ '--d': '150ms' } as React.CSSProperties} onSubmit={send}>
            <div className="form-group"><input name="name" type="text" placeholder="Your Name" required /></div>
            <div className="form-group"><input name="email" type="email" placeholder="Your Email" required /></div>
            <div className="form-group"><textarea name="message" placeholder="Your Message" required /></div>
            <button type="submit" className={`btn btn-primary ${sent ? 'ok' : ''}`}>{sent ? <><FaCheck /> Opening your mail app…</> : 'Send Message'}</button>
          </form>
        </div>
      </section>

      <footer>
        <div className="container foot">
          <p>&copy; {new Date().getFullYear()} Dina Abdelbaset. All rights reserved.</p>
          <a href="#home" className="to-top" aria-label="Back to top"><FaArrowUp /></a>
        </div>
      </footer>
    </div>
  );
};

export default App;
