import { Fragment, useEffect, useState } from 'react'
import { profile, projects, about, capabilities, experience } from './data.js'
import './App.css'

const sections = ['work', 'about', 'contact']

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  return [theme, () => setTheme(theme === 'dark' ? 'light' : 'dark')]
}

function useCopyEmail() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2500)
    return () => clearTimeout(timer)
  }, [copied])

  const fallbackCopy = () => {
    const field = document.createElement('textarea')
    field.value = profile.email
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    field.remove()
    if (ok) setCopied(true)
  }

  // mailto only works when the visitor has a default mail app, so also copy the address
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.email).then(() => setCopied(true), fallbackCopy)
    } else {
      fallbackCopy()
    }
  }

  return [copied, copy]
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function Background() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const root = document.documentElement
    let frame = 0

    const onMove = (e) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--mouse-x', `${e.clientX}px`)
        root.style.setProperty('--mouse-y', `${e.clientY}px`)
      })
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-glow" />
    </div>
  )
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

function Nav({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'nav scrolled' : 'nav'}>
      <a href="#top" className="nav-logo" aria-label={profile.name}>
        <span className="nav-mark" aria-hidden="true" />
        <span className="nav-name">{profile.name}</span>
      </a>
      <div className="nav-right">
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {sections.map((id) => (
            <a key={id} href={`#${id}`} className="link" onClick={() => setOpen(false)}>
              {id}
            </a>
          ))}
          <a href={profile.resume} className="btn btn-small" target="_blank" rel="noreferrer">
            Résumé
          </a>
        </nav>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function AnimatedWords({ text, start = 0 }) {
  return text.split(' ').map((word, i) => (
    <Fragment key={word + i}>
      <span className="word">
        <span style={{ '--i': start + i }}>{word}</span>
      </span>{' '}
    </Fragment>
  ))
}

function Hero() {
  const nameCount = profile.name.split(' ').length
  const [copied, copyEmail] = useCopyEmail()

  return (
    <section id="top" className="hero">
      <h1>
        <AnimatedWords text={profile.name} />
        <span className="hero-title hero-muted">
          <AnimatedWords text={profile.title} start={nameCount} />
        </span>
      </h1>
      <p className="hero-intro hero-fade" style={{ '--i': 7 }}>
        {profile.intro}
      </p>
      <ul className="hero-now hero-fade" style={{ '--i': 8 }}>
        {profile.now.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="hero-actions hero-fade" style={{ '--i': 9 }}>
        <a href="#work" className="btn">
          See my work
        </a>
        <a href={`mailto:${profile.email}`} className="btn btn-outline" onClick={copyEmail} aria-live="polite">
          {copied ? 'Email copied!' : 'Email me'}
        </a>
      </div>
      <a href="#work" className="scroll-cue hero-fade" style={{ '--i': 11 }} aria-label="Scroll to work">
        <span />
      </a>
    </section>
  )
}

function Project({ project, index }) {
  const number = String(index + 1).padStart(2, '0')
  const images = project.images ?? (project.image ? [{ src: project.image, alt: `${project.title} preview` }] : [])

  return (
    <article className="project reveal">
      <div className={images.length > 1 ? 'project-media project-media-stack' : 'project-media'}>
        {images.length > 0 ? (
          images.map((img) => <img key={img.src} src={img.src} alt={img.alt} />)
        ) : (
          <div className="project-placeholder">
            <span className="project-placeholder-num">{number}</span>
            <span>{project.title}</span>
          </div>
        )}
      </div>
      <div className="project-info">
        <p className="project-meta">
          <span>{number}</span>
          <span>{[project.category, project.year].filter(Boolean).join(' · ')}</span>
        </p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.contribution && <p className="project-contribution">{project.contribution}</p>}
        {project.role && (
          <p className="project-role">
            <strong>Role</strong> {project.role}
          </p>
        )}
        <ul className="tags">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {(project.live || project.devpost || project.code) && (
          <div className="project-links">
            {project.live && (
              <a href={project.live} className="link" target="_blank" rel="noreferrer">
                Visit site ↗
              </a>
            )}
            {project.devpost && (
              <a href={project.devpost} className="link" target="_blank" rel="noreferrer">
                Devpost ↗
              </a>
            )}
            {project.code && (
              <a href={project.code} className="link" target="_blank" rel="noreferrer">
                View code ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

function Work() {
  return (
    <section id="work" className="section">
      <div className="section-head reveal">
        <h2>Selected Work</h2>
        <span>{projects.length} projects</span>
      </div>
      <div className="projects">
        {projects.map((p, i) => (
          <Project key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <div className="section-head reveal">
        <h2>About</h2>
      </div>
      <div className="about">
        <div className="about-text reveal">
          {about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="capabilities">
          {capabilities.map((c, i) => (
            <div key={c.title} className="reveal" style={{ '--delay': `${i * 100}ms` }}>
              <h4>{c.title}</h4>
              <ul>
                {c.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <h3 className="subhead reveal">Experience</h3>
      <ul className="experience">
        {experience.map((e, i) => (
          <li key={e.role + e.company} className="reveal" style={{ '--delay': `${i * 70}ms` }}>
            <div>
              <span className="experience-role">{e.role}</span>
              <span className="experience-company">{e.company}</span>
            </div>
            <span className="experience-date">{e.date}</span>
          </li>
        ))}
      </ul>
      <a href={profile.resume} className="text-link link" target="_blank" rel="noreferrer">
        Full résumé ↗
      </a>
    </section>
  )
}

function Contact() {
  const [copied, copyEmail] = useCopyEmail()

  return (
    <section id="contact" className="contact">
      <div className="reveal">
        <p className="eyebrow">Open to frontend and web design roles</p>
        <h2>Let's build something together.</h2>
        <a href={`mailto:${profile.email}`} className="contact-email" onClick={copyEmail}>
          {profile.email}
        </a>
        <p className="contact-copied" aria-live="polite">
          {copied ? 'Copied to your clipboard' : 'Click to email or copy'}
        </p>
        <div className="social">
          <a href={profile.links.github} className="link" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.links.linkedin} className="link" target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={profile.resume} className="link" target="_blank" rel="noreferrer">
            Résumé ↗
          </a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  useReveal()

  return (
    <>
      <Background />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Work />
        <About />
      </main>
      <Contact />
      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Designed & built by me with React and Vite</span>
      </footer>
    </>
  )
}
