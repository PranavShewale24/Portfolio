import { useEffect, useRef, useState } from 'react';
import MicroSlats from './MicroSlats';
import FlipCard from './FlipCard';
import pranavImage from './pranav.jpg';
import './App.css';

/* ---------- React Bits-style components ---------- */
const SplitText = ({ text, className = '' }) => (
  <span className={className}>
    {text.split('').map((c, i) => (
      <span key={i} className="ch" style={{ animationDelay: `${i * 35}ms` }}>{c === ' ' ? '\u00a0' : c}</span>
    ))}
  </span>
);

const ShinyText = ({ children }) => <span className="shiny">{children}</span>;

const Reveal = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ref.current.classList.add('on'); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="rv">{children}</div>;
};

const SpotlightCard = ({ children }) => (
  <div
    className="card"
    onMouseMove={e => {
      const b = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--x', `${e.clientX - b.left}px`);
      e.currentTarget.style.setProperty('--y', `${e.clientY - b.top}px`);
    }}
  >
    {children}
  </div>
);

const CountUp = ({ to, dec = 0, suffix = '' }) => {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = t => {
        const p = Math.min((t - t0) / 1400, 1);
        setV(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <b ref={ref}>{v.toFixed(dec)}{suffix}</b>;
};

const Marquee = ({ items }) => (
  <div className="mq">
    <div>{[...items, ...items].map((s, i) => <span key={i}>{s}</span>)}</div>
  </div>
);

/* ---------- Data (from resume) ---------- */
const EMAIL = 'pranavshewale2852@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/pranav-shewale24/';
const GITHUB = 'https://github.com/pranavshewale24';

const projects = [
  {
    t: 'Smart Attendance Monitoring System',
    d: 'A web-based attendance system that automates classroom attendance through facial recognition and short video uploads.',
    problem: 'Traditional attendance is time-consuming and can lead to manual errors and proxy attendance. Teachers have to call names, maintain records and update attendance regularly.',
    solution: 'I developed a web-based system where teachers upload a short classroom video, registered students are detected and recognized, and attendance is marked automatically. Separate teacher and student dashboards support tracking, Google Sheets updates and absent-student email notifications.',
    frontStack: ['React.js', 'FastAPI', 'OpenCV', 'JWT'],
    s: ['React.js', 'JavaScript', 'FastAPI', 'OpenCV', 'JWT', 'Google Sheets API', 'SMTP', 'REST APIs', 'Git/GitHub', 'Postman'],
    l: ['Facial recognition-based attendance', 'Teacher and student authentication', 'Classroom video upload and automatic attendance recording', 'Attendance history and tracking', 'Google Sheets integration', 'Absent-student email notifications']
  },
  {
    t: 'Emergency Healthcare Network',
    d: 'A real-time platform connecting patients with ambulance drivers, volunteer drivers and hospitals during emergencies.',
    problem: 'During a medical emergency, people may struggle to quickly find an available ambulance, volunteer driver or nearby suitable hospital. Poor coordination can cause unnecessary delays.',
    solution: 'I developed a real-time emergency healthcare platform where patients can trigger an SOS request and share their location. Available drivers can receive and accept requests, users can find nearby hospitals, and each user role gets a dedicated dashboard.',
    frontStack: ['React.js', 'Node.js', 'Express.js', 'Socket.IO', 'Google Maps API'],
    s: ['React.js', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'JWT', 'Socket.IO', 'Geolocation API', 'Google Maps API / Leaflet.js', 'REST APIs', 'Git/GitHub', 'Postman'],
    l: ['One-click SOS emergency request', 'Ambulance and volunteer driver management', 'Driver online/offline availability', 'Real-time emergency request handling', 'Nearby hospital finder with location tracking and navigation', 'Patient, driver, hospital and admin dashboards', 'Role-based authentication']
  },
  {
    t: 'DevCollab – DSA Tracker',
    d: 'A full-stack DSA tracking platform that centralizes coding practice, progress tracking and preparation analytics.',
    problem: 'Students preparing for coding interviews often practice DSA problems across multiple platforms, making it difficult to organize questions, track solved problems, identify weak topics and measure preparation.',
    solution: 'I developed DevCollab as a centralized preparation workspace where users explore curated problems by topic, mark their progress and view analytics that show their overall preparation level.',
    frontStack: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
    s: ['React.js', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express.js', 'JWT', 'REST APIs', 'React Router', 'Git/GitHub', 'Postman'],
    l: ['DSA topic-wise problem organization', 'Curated coding problems', 'Problem-solving progress tracking', 'Solved and in-progress status', 'Topic-wise progress', 'Overall preparation analytics', 'User authentication and personalized dashboard']
  },
];
const skills = ['C++', 'JavaScript', 'SQL', 'HTML', 'CSS', 'React.js', 'Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Postman', 'Git & GitHub', 'DSA', 'OOP', 'DBMS', 'OS', 'CNS'];
const achievements = ['2-star rating on CodeChef', 'Perfect 10.0 SGPA in Semester 2', 'Top 100 Teams — ZS Campus Beats Hackathon', 'Participant — TechFesta Hackathon', 'Captain, College Kabaddi Team — 1st in Intra-College Tournament'];
const stats = [
  { to: 9.47, dec: 2, label: 'CGPA' },
  { to: 1711, label: 'LeetCode contest rating' },
  { to: 99.5, dec: 1, suffix: '%', label: 'MHT-CET' },
  { to: 10, dec: 1, label: 'Perfect SGPA, Sem 2' },
];

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  if (selectedProject) {
    return <main className="project-page">
      <button className="back-link" onClick={() => setSelectedProject(null)}>← Back to portfolio</button>
      <span className="pill">Project case study</span>
      <h1>{selectedProject.t}</h1>
      <p className="project-lede">{selectedProject.d}</p>
      <div className="project-detail-grid">
        <article className="detail-block"><span className="detail-label">The problem</span><h2>What needed to change</h2><p>{selectedProject.problem}</p></article>
        <article className="detail-block detail-block--accent"><span className="detail-label">The solution</span><h2>What I built</h2><p>{selectedProject.solution}</p></article>
      </div>
      <section className="detail-section"><span className="detail-label">Build notes</span><h2>How it works</h2><ul>{selectedProject.l.map(x => <li key={x}>{x}</li>)}</ul><div className="tags">{selectedProject.s.map(x => <span key={x}>{x}</span>)}</div></section>
    </main>;
  }

  return (
    <>
      <div className="bg">
        <MicroSlats
          preset="swell" color="#7c5cff" glintColor="#22d3ee" backgroundColor="#07070d"
          slatWidth={8} slatHeight={22} gap={3} swirl={0.6} lean={0.5} cursorSize={60}
        />
      </div>

      <nav>
        <b>PS.</b>
        <div>
          {['About', 'Experience', 'Projects', 'Skills'].map(x => <a key={x} href={`#${x.toLowerCase()}`}>{x}</a>)}
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="pill">● Open to internships & full-time roles</span>
          <h1><SplitText text={'Hi, I\u2019m '} /><SplitText text="Pranav Shewale" className="grad" /></h1>
          <p className="sub"><ShinyText>Computer Engineering student & full-stack developer building fast, real-time web products and solving problems on the side.</ShinyText></p>
          <div className="btns">
            <a className="btn p" href="#projects">View projects</a>
            <a className="btn" href={`mailto:${EMAIL}`}>Get in touch</a>
          </div>
        </div>
        <figure className="hero-portrait">
          <img src={pranavImage} alt="Pranav Shewale" />
        </figure>
        <div className="hero-scroll" aria-hidden="true">Scroll to explore <span>↓</span></div>
      </section>

      <section id="about"><Reveal>
        <h2>About</h2>
        <div className="grid">
          <SpotlightCard>
            <h3>PICT, Pune</h3>
            <p>B.E. Computer Engineering · Sept 2023 – May 2027 (expected)</p>
            <div className="tags"><span>SCTR’s Pune Institute of Computer Technology</span></div>
          </SpotlightCard>
          <SpotlightCard>
            <h3>Before college</h3>
            <p>MHT-CET 99.525 percentile · HSC 83.17% · SSC 96.60%</p>
          </SpotlightCard>
        </div>
        <div className="stats">
          {stats.map(s => (
            <SpotlightCard key={s.label}>
              <div className="stat"><CountUp to={s.to} dec={s.dec} suffix={s.suffix} /><span>{s.label}</span></div>
            </SpotlightCard>
          ))}
        </div>
      </Reveal></section>

      <section id="experience"><Reveal>
        <h2>Experience</h2>
        <div className="tl">
          <SpotlightCard>
            <small>Jan 1 – Mar 15, 2025</small>
            <h3>In-House Intern — Emergency Healthcare System</h3>
            <div className="tags">{['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.IO', 'Google Maps API'].map(x => <span key={x}>{x}</span>)}</div>
            <ul>
              <li>Built a centralized platform for finding ambulances, hospitals, blood and critical medical resources.</li>
              <li>Implemented a one-tap SOS using geolocation to alert nearby ambulances, hospitals and volunteers.</li>
              <li>Shipped hospital discovery, live ICU/Emergency/NICU bed availability, blood-bank search and equipment sharing via role-based dashboards.</li>
            </ul>
          </SpotlightCard>
        </div>
      </Reveal></section>

      <section id="projects"><Reveal>
        <h2>Projects</h2>
        <div className="grid">
          {projects.map(p => (
            <div className="project-card-wrap" key={p.t}>
              <FlipCard
                ariaLabel={`${p.t} project card`}
                front={<div className="project-face project-face--front"><span className="project-index">0{projects.indexOf(p) + 1}</span><h3>{p.t}</h3><p>{p.d}</p><div className="tags">{p.frontStack.map(x => <span key={x}>{x}</span>)}</div></div>}
                back={<div className="project-face project-face--back"><span className="detail-label">Case study</span><h3>{p.t}</h3><p>{p.problem}</p><button className="card-action" onClick={() => setSelectedProject(p)}>Open project <span aria-hidden="true">↗</span></button></div>}
                axis="y" flipOnClick draggable tilt glare hoverScale={1.02} width={340} height={390} radius={20} background="#10101d" color="#eceaf6" shadow
              />
            </div>
          ))}
        </div>
      </Reveal></section>

      <section id="skills"><Reveal>
        <h2>Skills</h2>
        <Marquee items={skills} />
        <h2 style={{ marginTop: 70 }}>Achievements</h2>
        <div className="grid">
          {achievements.map(a => <SpotlightCard key={a}><p style={{ color: 'var(--fg)' }}>★  {a}</p></SpotlightCard>)}
        </div>
      </Reveal></section>

      <footer id="contact"><Reveal>
        <h2>Let’s <span className="grad">build</span> something</h2>
        <p>Open to internships and full-time opportunities.</p>
        <div className="btns" style={{ justifyContent: 'center' }}>
          <a className="btn p" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a className="btn" href={LINKEDIN}>LinkedIn</a>
          <a className="btn" href={GITHUB}>GitHub</a>
        </div>
      </Reveal></footer>
    </>
  );
}
