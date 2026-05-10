"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import emailjs from '@emailjs/browser';
import { useChat } from "@/components/chat/ChatContext";

const sections = [
   { id: "home", label: "HOME" },
   { id: "about", label: "ABOUT" },
   { id: "works", label: "WORKS" },
   { id: "experience", label: "EXPERIENCE" },
   { id: "wins", label: "WINS" },
   { id: "contact", label: "CONTACT" }
];

const projects = [
   {
      id: "gitpilot",
      title: "GitPilot CLI",
      category: "AI Automation",
      image: "/images/obys/new/gitpilot_cover_1776867279068.png",
      date: "2026",
      desc: "A Python CLI tool that uses local Ollama LLMs to auto-generate git commit messages and READMEs. Packaged on PyPI with fully offline AI capabilities.",
      tech: ["Python", "Ollama", "GitHub API", "PyPI"],
      link: "https://github.com/imanishraj/gitpilot"
   },
   {
      id: "data_collection",
      title: "Data System",
      category: "Full Stack Platform",
      image: "/images/obys/new/data_system_cover_1776867298536.png",
      date: "2026",
      desc: "A secure form-based data collection platform built with Next.js and Supabase Auth. Includes an admin dashboard with role-based access, search, CSV export, and PostgreSQL storage.",
      tech: ["Next.js", "Node.js", "Supabase", "PostgreSQL"],
      link: "https://github.com/imanishraj/SRN_backend"
   },
   {
      id: "smart_irrigation",
      title: "Smart Irrigation",
      category: "IoT + ML",
      image: "/images/obys/new/smart_irrigation_cover_1776867314104.png",
      date: "2025",
      desc: "IoT precision agriculture system using ESP32, soil/humidity sensors, and Facebook's Prophet ML model for crop rotation forecasting and automated drip irrigation control.",
      tech: ["C", "Python", "ESP32", "Prophet ML"],
      link: "https://github.com/imanishraj/precision_agriculture_and_crop_management_using_IoT"
   },
   {
      id: "inventory_event_processor",
      title: "Inventory Event Processor",
      category: "Backend Systems",
      image: "/images/obys/new/inventory_processor_cover.png",
      date: "2024",
      desc: "Event-driven inventory system using Spring Boot and PostgreSQL. Implements a producer-consumer queue to decouple API writes from DB persistence. Features an immutable event log, async batch processing, low-stock alerts, and a live React dashboard.",
      tech: ["Java 21", "Spring Boot", "PostgreSQL", "Flyway", "React", "Recharts"],
      link: "https://github.com/imanishraj/inventory_event_processor"
   },
   {
      id: "street_light",
      title: "Adaptive Lighting",
      category: "IoT System",
      image: "/images/obys/new/adaptive_lighting_cover_1776867372064.png",
      date: "2023",
      desc: "Smart street lighting system using ESP8266 sensors that auto-adjusts brightness based on ambient light and motion to reduce energy usage.",
      tech: ["C", "Python", "ESP8266"],
      link: "https://github.com/imanishraj/Smart-Street-Light-System"
   },
   {
      id: "music_player",
      title: "Sonic Shell",
      category: "Frontend Dev",
      image: "/images/obys/new/sonic_shell_cover_1776867391097.png",
      date: "2026",
      desc: "Component-based music player UI built in React with frequency visualizers, spatial routing, and glassmorphism styling.",
      tech: ["React", "Vite", "HTML", "CSS"],
      link: "https://github.com/imanishraj/music-player"
   }
];
const TypingLoop = ({ text, color = '#444' }: { text: string; color?: string }) => {
  const [displayed, setDisplayed] = useState("")
  const [isErasing, setIsErasing] = useState(false)
  const pos = useRef(0)

  useEffect(() => {
    const tick = () => {
      if (!isErasing) {
        if (pos.current < text.length) {
          pos.current++
          setDisplayed(text.slice(0, pos.current))
        } else {
          setTimeout(() => setIsErasing(true), 2000)
          return
        }
      } else {
        if (pos.current > 0) {
          pos.current--
          setDisplayed(text.slice(0, pos.current))
        } else {
          setTimeout(() => setIsErasing(false), 500)
          return
        }
      }
    }
    const id = setTimeout(tick, isErasing ? 25 : 55)
    return () => clearTimeout(id)
  }, [displayed, isErasing, text])

  return (
    <span style={{
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
      letterSpacing: '0.3em',
      color: color,
      textTransform: 'uppercase',
    }}>
      {displayed}<span style={{ animation: 'blink 1s infinite' }}>|</span>
    </span>
  )
}
export default function App() {
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
   const { openChat } = useChat();
   const [isMobile, setIsMobile] = useState(false);
   const [jsLoaded, setJsLoaded] = useState(false);

   useEffect(() => {
      setJsLoaded(true);
      const check = () => setIsMobile(window.innerWidth <= 768);
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
   }, []);

   const [contactEmail, setContactEmail] = useState('');
   const [contactMessage, setContactMessage] = useState('');
   const [sending, setSending] = useState(false);
   const [sent, setSent] = useState(false);
   const [showNudge, setShowNudge] = useState(true);

   useEffect(() => {
      const hide = () => { if (window.scrollY > 80) setShowNudge(false); };
      window.addEventListener('scroll', hide);
      return () => window.removeEventListener('scroll', hide);
   }, []);

   useEffect(() => {
      const t = setTimeout(() => setLoading(false), 2600);
      return () => clearTimeout(t);
   }, []);

   useEffect(() => {
      if (selectedId) {
         document.body.style.overflow = "hidden";
         document.documentElement.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
         document.documentElement.style.overflow = "";
      }
   }, [selectedId]);

   const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!contactEmail || !contactMessage) return;
      setSending(true);
      try {
         await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
            { from_email: contactEmail, message: contactMessage },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
         );
         setSent(true);
         setContactEmail('');
         setContactMessage('');
         setTimeout(() => setSent(false), 4000);
      } catch (err) { alert('Transmission failed.'); }
      finally { setSending(false); }
   };

   return (
      <div className={jsLoaded ? "" : "js-fallback"} style={{ backgroundColor: "#050505", minHeight: "100vh", color: "#ffffff" }}>
         <CustomCursor />

         <AnimatePresence mode="wait">
            {loading && <Preloader key="preloader" />}
         </AnimatePresence>

         <TopicScroller hidden={!!selectedId} />

         <main style={{ padding: "4vw", opacity: loading ? 0 : 1, transition: "opacity 1s ease 0.5s", maxWidth: "1800px", margin: "0 auto" }}>

            {/* === HOME === */}
            <section id="home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
               <header style={{ position: "absolute", top: "4vw", width: "calc(100% - 8vw)", display: "flex", justifyContent: "space-between", fontFamily: '"Inter", sans-serif', zIndex: 100 }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "-0.02em" }} className="hover-target"></div>
                  <div style={{ fontSize: "0.85rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.2em" }}><DataScramble text="Selected Works '26" /></div>
               </header>

               <ScrollReveal blur delay={0.5} yOffset={100}>
                  <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: "clamp(3rem, 12vw, 15rem)", lineHeight: 0.85, letterSpacing: "-0.04em", fontStyle: "italic", fontWeight: 400, color: "#e0e0e0", position: "relative", zIndex: 10 }}>
                     <ScatterText text="Creative" /> <span style={{ display: "block", paddingLeft: "15vw", fontFamily: '"Inter", sans-serif', textTransform: "uppercase", fontStyle: "normal", fontWeight: 800, letterSpacing: "-0.05em", color: "#ffffff" }}><ScatterText text="Developer" /></span>
                  </h1>
               </ScrollReveal>
               
               

               <AnimatePresence>
                  {showNudge && (
                     <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 4 }}
                        style={{ position: "fixed", bottom: "8vh", left: "50%",
                                 transform: "translateX(-50%)", display: "flex",
                                 alignItems: "center", gap: "10px",
                                 fontFamily: '"Inter", sans-serif',
                                 fontSize: "0.75rem", letterSpacing: "0.2em",
                                 color: "#444", textTransform: "uppercase",
                                 pointerEvents: "none", zIndex: 50 }}
                     >
                        <motion.div
                           animate={{ y: [0, 6, 0] }}
                           transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                           style={{ width: 6, height: 6, borderRadius: "50%", background: "#444" }}
                        />
                        scroll to explore
                     </motion.div>
                  )}
               </AnimatePresence>
            </section>

            <div className="typing-hint" style={{ 
               marginTop: '2.5rem', 
               paddingLeft: isMobile ? '0' : '25vw',
               textAlign: isMobile ? 'center' : 'left'
            }}>
               <TypingLoop 
                  text={isMobile ? "PLEASE USE LAPTOP OR DESKTOP FOR BEST VIEWING PERFORMANCE" : "Go slow as you can and explore with cursor"} 
                  color={isMobile ? "#ffffff" : "#444"}
               />
            </div>

            {/* === ABOUT === */}
            <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "10vh 0" }}>
               <div style={{ maxWidth: "800px" }}>
                  <h2 style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 10rem)", color: "#ffffff", marginBottom: "4rem", lineHeight: 0.9, letterSpacing: "-0.05em" }}><DataScramble text="MANISH RAJ" /></h2>
                  <ScrollReveal delay={0.15}>
                     <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "clamp(1.2rem, 3vw, 1.8rem)", lineHeight: 1.6, color: "#aaaaaa", marginBottom: "2rem", fontWeight: 300 }}>
                        I am a Full Stack Developer & IoT Explorer based in the structural intersections of software and hardware. Currently building automated systems at Alstonair Technologies.
                     </p>
                  </ScrollReveal>
                  <ScrollReveal delay={0.3}>
                     <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "1rem", letterSpacing: "0.15em", color: "#666", marginBottom: "4rem", textTransform: "uppercase" }}>
                        GITAM University · B.Tech CSE (2022-2025)
                     </p>
                  </ScrollReveal>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", paddingBottom: "10px" }}>
                     {["Java", "Python", "React", "Next.js", "Django", "FastAPI", "PostgreSQL", "IoT / ESP32"].map((skill, i) => (
                        <ScrollReveal key={skill} delay={0.4 + (i * 0.05)} yOffset={30} style={{ display: "inline-block" }}>
                           <span className="skill-pill" style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "12px 24px", borderRadius: "50px", fontSize: "0.9rem", color: "#ffffff", transition: "all 0.3s ease", display: "inline-block", whiteSpace: "nowrap", cursor: "none" }}>
                              {skill}
                           </span>
                        </ScrollReveal>
                     ))}
                  </div>
               </div>
            </section>

            {/* === WORKS === */}
            <HorizontalWorks selectedId={selectedId} setSelectedId={setSelectedId} isMobile={isMobile} />

            {/* === EXPERIENCE === */}
            <section id="experience" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "15vh 0" }}>
               <div style={{ width: "100%", maxWidth: "1200px" }}>
                  <h2 style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.05em", fontSize: "clamp(2.5rem, 8vw, 10rem)", color: "#ffffff", marginBottom: "8rem", lineHeight: 0.9 }}><DataScramble text="EXPERIENCE" /></h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
                     {[
                        { role: "Full Stack Developer", corp: "ALSTONAIR TECHNOLOGIES", date: "Apr 2026 \u2013 Present", summary: "Building and maintaining FastAPI microservices and PostgreSQL data pipelines for the NAL platform. Contributing to frontend features in React + TypeScript (Vite)." },
                        { role: "Field Assistant (IoT)", corp: "GITAM UNIVERSITY", date: "Sep 2025 \u2013 Present", summary: "Prototyped ESP32-based environmental sensor arrays for precision agriculture research. Built a Blynk IoT dashboard and conducted farmer awareness workshops in Kannada and English." },
                        { role: "Software Dev Intern", corp: "HIMALAYA WELLNESS", date: "Jan \u2013 Feb 2025", summary: "Developed an admin dashboard and optimized SQL queries for internal reporting. Built a geolocation-based QR attendance system using .NET and SQL Server." }
                     ].map((exp, i) => (
                        <ScrollReveal key={i} blur yOffset={50} delay={0.15 + (i * 0.2)}>
                           <ExperienceRow role={exp.role} corp={exp.corp} date={exp.date} summary={exp.summary} />
                        </ScrollReveal>
                     ))}
                  </div>
               </div>
            </section>

            {/* === ACHIEVEMENTS === */}
            <section id="wins" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "15vh 0" }}>
               <div style={{ width: "100%" }}>
                  <h2 style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.05em", fontSize: "clamp(2.5rem, 8vw, 10rem)", color: "#ffffff", marginBottom: "8rem", lineHeight: 0.9, textAlign: "right" }}><DataScramble text="MILESTONES" /></h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3vw" }}>
                     <ScrollReveal delay={0.1}><AchievementCard image="/images/achievements/reev.jpeg" icon="🏎️" title="2nd Runner-up" event="SAE India REEV" sub="2026 • Infotainment Lead" /></ScrollReveal>
                     <ScrollReveal delay={0.2}><AchievementCard image="/images/achievements/sih.jpg" icon="💻" title="Runner-up" event="SIH Hackathon" sub="2023" /></ScrollReveal>
                     <ScrollReveal delay={0.3}><AchievementCard image="/images/obys/new/campus_branding_cover_1776867409970.png" icon="🎯" title="Lead" event="Campus Branding" sub="GITAM University" /></ScrollReveal>
                     <ScrollReveal delay={0.4}><AchievementCard icon="🤝" title="Member" event="Rotaract Club" sub="Core Team" /></ScrollReveal>
                  </div>
               </div>
            </section>

            {/* === CONTACT === */}
            <section id="contact" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "10vh 0" }}>
               <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
                  <h2 style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.05em", fontSize: "clamp(3.5rem, 12vw, 15rem)", color: "#ffffff", marginBottom: "3rem", textAlign: "center", lineHeight: 0.85 }}><DataScramble text="FIND ME" /></h2>
                  <ScrollReveal delay={0.2}>
                     <div style={{ color: "#666", letterSpacing: "0.2em", textAlign: "center", marginBottom: "10rem", fontSize: "1rem", textTransform: "uppercase", fontFamily: '"Inter", sans-serif' }}>
                        <DataScramble text="NO PILLS. NO POPUPS. JUST CONTACT." />
                     </div>
                  </ScrollReveal>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "10vw", alignItems: "start" }}>
                     <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                        <ScrollReveal delay={0.1} yOffset={30}><ContactRow label="GITHUB" val="github.com/imanishraj" href="https://github.com/imanishraj" /></ScrollReveal>
                        <ScrollReveal delay={0.2} yOffset={30}><ContactRow label="LINKEDIN" val="linkedin.com/in/manishrajakumar" href="https://linkedin.com/in/manishrajakumar" /></ScrollReveal>
                        <ScrollReveal delay={0.3} yOffset={30}><ContactRow label="EMAIL" val="manish64raja@gmail.com" href="mailto:manish64raja@gmail.com" /></ScrollReveal>
                     </div>

                     <form onSubmit={handleSendMessage} style={{ display: "flex", flexDirection: "column", gap: "3rem", background: "rgba(255,255,255,0.02)", padding: "4vw", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <ScrollReveal delay={0.2} yOffset={30}>
                           <div style={{ position: "relative" }}>
                              <input type="email" placeholder="Your Email ID *" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="hover-target obys-input" style={{ fontSize: "1.2rem" }} />
                           </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.4} yOffset={30}>
                           <div style={{ position: "relative" }}>
                              <textarea placeholder="Your Message *" required rows={1} value={contactMessage} onChange={e => setContactMessage(e.target.value)} className="hover-target obys-input" style={{ resize: "none", fontSize: "1.2rem" }} />
                           </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.6} yOffset={30}>
                           <button type="submit" disabled={sending || sent} className="hover-target obys-btn submit-btn" style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
                              {sending ? "SENDING..." : sent ? "MESSAGE SENT" : "SEND MESSAGE"}
                           </button>
                        </ScrollReveal>
                     </form>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "8rem", flexWrap: "wrap" }}>
                     <ScrollReveal delay={0.4} yOffset={30}>
                        <a href="/resume.pdf" download className="hover-target obys-btn" style={{ display: "inline-block" }}>DOWNLOAD RESUME</a>
                     </ScrollReveal>
                     <ScrollReveal delay={0.5} yOffset={30}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                           <button onClick={openChat} className="hover-target obys-btn" style={{ display: "inline-block", background: "transparent" }}>Chat with my AI assistant</button>
                           <span style={{ fontSize: "0.75rem", color: "#888", fontFamily: '"Inter", sans-serif', letterSpacing: "0.05em" }}>Ask me anything about my work or skills.</span>
                        </div>
                     </ScrollReveal>
                     <ScrollReveal delay={0.7}>
                        <div style={{ paddingLeft: "0vw", marginTop: "1.5rem", fontFamily: '"Inter", sans-serif', fontSize: "clamp(0.85rem, 1.5vw, 1rem)", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                           Currently open to full-time Full Stack roles in Bengaluru (remote-friendly).
                        </div>
                     </ScrollReveal>
                  </div>
               </div>
            </section>

            <footer style={{ marginTop: "10vh", padding: "5vw 0", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", color: "#444", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: '"Inter", sans-serif' }}>
               <div>©2026 MANISH RAJ.</div>
               <div className="hover-target" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</div>
            </footer>

         </main>

         {/* Seamless Overlay */}
         <AnimatePresence>
            {selectedId && (
               <CaseStudy project={projects.find(p => p.id === selectedId)} onClose={() => setSelectedId(null)} />
            )}
         </AnimatePresence>

         <style dangerouslySetInnerHTML={{
            __html: `
        ::selection { background: #ffffff; color: #000; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #050505; overflow-x: clip; }
        @media (pointer: fine) {
          body { cursor: none; }
        }
        p {
          text-align: justify;
          text-justify: inter-word;
        }
        
        /* Custom Scrollbar Styles */
        ::-webkit-scrollbar { width: 8px; height: 8px; display: block; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
        * { scrollbar-width: thin; scrollbar-color: #222 #050505; }
        
        .obys-input {
           width: 100%;
           padding: 1rem 0;
           background: transparent;
           border: none;
           border-bottom: 2px solid rgba(255,255,255,0.2) !important;
           color: #ffffff;
           font-family: "Inter", sans-serif;
           font-size: 1.5rem;
           outline: none;
           transition: border-color 0.3s ease;
        }
        .obys-input::placeholder { color: #555; }
        .obys-input:focus { border-bottom-color: #ffffff !important; padding-left: 10px; }
        
        .obys-btn {
           background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #ffffff;
           padding: 18px 42px; font-family: "Inter", sans-serif; font-size: 0.9rem; letter-spacing: 0.2em; text-transform: uppercase;
           cursor: none; transition: all 0.3s ease; text-decoration: none; display: inline-block; border-radius: 50px;
        }
        .obys-btn:hover { background: #ffffff; color: #000000 !important; border-color: #ffffff; }

        .skill-pill:hover { background: #ffffff !important; color: #000000 !important; }

        .scroller-container {
           position: fixed; top: 50%; right: 3vw; transform: translateY(-50%); z-index: 40; display: flex; flex-direction: column; gap: 20px; align-items: flex-end;
           transition: opacity 0.5s ease;
        }
        @media (max-width: 768px) {
           .scroller-container { display: none; }
        }
        .scroller-item {
           display: flex; align-items: center; gap: 15px; cursor: none; text-decoration: none; color: #666;
           font-family: "Inter", sans-serif; font-size: 0.75rem; letter-spacing: 0.2em;
        }
        .scroller-label {
           opacity: 0; transform: translateX(10px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;
        }
        .scroller-container:hover .scroller-label {
           opacity: 1; transform: translateX(0);
        }
        .scroller-dot {
           width: 6px; height: 6px; border-radius: 50%; background: #666; transition: all 0.3s ease; flex-shrink: 0;
        }
        .scroller-item:hover { color: #fff; }
        .scroller-item:hover .scroller-dot { background: #fff; transform: scale(2); }
        .scroller-item.active { color: #fff; }
        .scroller-item.active .scroller-dot { background: #fff; transform: scale(2); }
        .scroller-item.active .scroller-label { opacity: 1; transform: translateX(0); font-weight: 600; color: #ffffff; }
        
        /* Fallback animations for JS failure */
        .js-fallback .preloader-overlay { animation: fallbackHide 4s forwards; }
        .js-fallback main { animation: fallbackReveal 4s forwards !important; }
        @keyframes fallbackHide { 0%, 80% { opacity: 1; visibility: visible; } 100% { opacity: 0; visibility: hidden; } }
        @keyframes fallbackReveal { 0%, 80% { opacity: 0; } 100% { opacity: 1; } }
        
        .submit-btn {
           background: #ffffff !important; color: #000000 !important; font-weight: 600; border-color: #ffffff !important;
        }
        .submit-btn:hover {
           background: transparent !important; color: #ffffff !important;
        }
        .submit-btn:disabled {
           background: rgba(255,255,255,0.2) !important; color: rgba(255,255,255,0.5) !important; border-color: rgba(255,255,255,0.2) !important; cursor: not-allowed;
        }
        /* Mobile additions */
        @media (max-width: 768px) {
          form[style] { padding: 8vw !important; }
          .typing-hint { padding-left: 0 !important; text-align: center; }
          footer { flex-direction: column !important; gap: 1rem; }
          .case-close { top: 5vw !important; right: 5vw !important; font-size: 1.1rem !important; padding: 10px; }
          .contact-row { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem; }
          .contact-val { font-size: 1.1rem !important; word-break: break-all; }
          p { text-align: left !important; }
        }
      ` }} />
      </div>
   );
}

const DataScramble = ({ text }: { text: string }) => {
   const [displayText, setDisplayText] = useState(text);
   const ref = useRef(null);
   const isInView = useInView(ref, { once: true, margin: "-10%" });
   const intervalRef = useRef<any>(null);

   const triggerScramble = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let iteration = 0;
      intervalRef.current = setInterval(() => {
         setDisplayText(prev =>
            prev.split("")
               .map((letter, index) => {
                  if (index < iteration) return text[index];
                  if (text[index] === " ") return " ";
                  return chars[Math.floor(Math.random() * chars.length)];
               })
               .join("")
         );
         if (iteration >= text.length) clearInterval(intervalRef.current);
         iteration += 1 / 3;
      }, 30);
   };

   useEffect(() => {
      if (isInView) triggerScramble();
      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
      };
   }, [isInView, text]);

   return <span ref={ref} onMouseEnter={triggerScramble} style={{ display: "inline-block", cursor: "none" }}>{displayText}</span>;
}

const ScatterText = ({ text }: { text: string }) => {
   const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);

   return (
      <span style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
         {text.split('').map((char, i) => {
            if (char === ' ') return <span key={i} style={{ width: '0.4em' }}>&nbsp;</span>;
            return <ScatterChar key={i} char={char} mousePos={mousePos} />;
         })}
      </span>
   );
}

const ScatterChar = ({ char, mousePos }: any) => {
   const ref = useRef<HTMLSpanElement>(null);
   const [transform, setTransform] = useState({ x: 0, y: 0, rotate: 0 });
   const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

   useEffect(() => {
      if (isTouch) return;
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = mousePos.x - centerX;
      const distanceY = mousePos.y - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const maxDistance = 150; // Radius of repulsion
      if (distance < maxDistance) {
         const force = (maxDistance - distance) / maxDistance;
         const angle = Math.atan2(distanceY, distanceX);

         const moveX = -Math.cos(angle) * force * 60;
         const moveY = -Math.sin(angle) * force * 60;
         const rotate = (Math.random() - 0.5) * force * 40;

         setTransform({ x: moveX, y: moveY, rotate });
      } else {
         setTransform({ x: 0, y: 0, rotate: 0 });
      }
   }, [mousePos, isTouch]);

   return (
      <motion.span
         ref={ref}
         animate={{ x: transform.x, y: transform.y, rotate: transform.rotate }}
         transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
         style={{ display: 'inline-block', originX: 0.5, originY: 0.5, cursor: "none" }}
      >
         {char}
      </motion.span>
   );
}

const TopicScroller = ({ hidden }: { hidden: boolean }) => {
   const [activeId, setActiveId] = useState<string>("home");

   useEffect(() => {
      const handleScroll = () => {
         let currentId = "home";
         for (const sec of sections) {
            const el = document.getElementById(sec.id);
            if (el) {
               const rect = el.getBoundingClientRect();
               if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                  currentId = sec.id;
                  break;
               }
            }
         }
         setActiveId(currentId);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className="scroller-container" style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? 'none' : 'auto' }}>
         {sections.map((sec) => (
            <a key={sec.id} href={`#${sec.id}`} className={`hover-target scroller-item ${activeId === sec.id ? 'active' : ''}`}>
               <span className="scroller-label">{sec.label}</span>
               <div className="scroller-dot" />
            </a>
         ))}
      </div>
   )
}

function ScrollReveal({ children, style = {}, delay = 0, yOffset = 50, blur = false }: any) {
   const ref = useRef(null);
   const isInView = useInView(ref, { once: false, margin: "0px" });
   return (
      <motion.div
         ref={ref}
         initial={{ opacity: 0, y: yOffset, filter: blur ? "blur(10px)" : "blur(0px)" }}
         animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: yOffset, filter: blur ? "blur(10px)" : "blur(0px)" }}
         transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
         style={style}
      >
         {children}
      </motion.div>
   )
}

function ExperienceRow({ role, corp, date, summary }: any) {
   return (
      <div className="hover-target" style={{ borderLeft: "2px solid rgba(255,255,255,0.2)", paddingLeft: "3rem", position: "relative", transition: "all 0.3s ease" }}>
         <div style={{ position: "absolute", left: "-6px", top: "8px", width: "10px", height: "10px", borderRadius: "50%", background: "#ffffff" }} />
         <div style={{ fontFamily: '"Inter", sans-serif', fontSize: "0.85rem", color: "#666", letterSpacing: "0.2em", marginBottom: "1rem", textTransform: "uppercase" }}>{date}</div>
         <h3 style={{ fontFamily: '"Inter", sans-serif', fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#ffffff", margin: "0 0 1rem 0", fontWeight: 400, letterSpacing: "-0.03em" }}>{role}</h3>
         <div style={{ fontFamily: '"Inter", sans-serif', color: "#aaaaaa", letterSpacing: "0.1em", fontSize: "1.1rem", marginBottom: "1.5rem" }}>{corp}</div>
         <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "1rem", color: "#888", lineHeight: 1.6, maxWidth: "80%" }}>{summary}</p>
      </div>
   )
}

function ContactRow({ label, val, href }: any) {
   return (
      <a href={href} target="_blank" rel="noreferrer" className="hover-target contact-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem 0", textDecoration: "none", transition: "all 0.3s ease" }}>
         <span style={{ fontFamily: '"Inter", sans-serif', color: "#666", letterSpacing: "0.2em", fontSize: "0.85rem" }}>{label}</span>
         <span className="contact-val" style={{ fontFamily: '"Inter", sans-serif', color: "#ffffff", fontSize: "1.5rem" }}>{val}</span>
      </a>
   )
}

function AchievementCard({ image, icon, title, event, sub }: any) {
   return (
      <div className="hover-target" style={{ border: "1px solid rgba(255,255,255,0.1)", padding: "2.5rem", borderRadius: "4px", background: "rgba(255,255,255,0.01)", display: "flex", flexDirection: "column", transition: "transform 0.4s ease, border-color 0.4s ease" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
         {image && (
            <div style={{ width: "100%", height: "250px", position: "relative", marginBottom: "2rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)", overflow: "hidden" }}>
               <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
         )}
         <div style={{ fontSize: "3rem", marginBottom: "2rem", opacity: 0.9 }}>{icon}</div>
         <div style={{ fontFamily: '"Inter", sans-serif', fontSize: "1.8rem", color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>{title}</div>
         <div style={{ fontFamily: '"Inter", sans-serif', fontSize: "1rem", color: "#888", marginTop: "1rem", lineHeight: 1.6 }}>
            <span style={{ color: "#fff" }}>{event}</span> <br /> {sub}
         </div>
      </div>
   )
}

const HorizontalWorks = ({ selectedId, setSelectedId, isMobile }: { selectedId: string | null, setSelectedId: (id: string) => void, isMobile: boolean }) => {
   const wrapperRef = useRef<HTMLDivElement>(null);
   const trackRef = useRef<HTMLDivElement>(null);
   const hScrollRef = useRef(0);
   const [progress, setProgress] = useState(0);

   useEffect(() => {
      if (isMobile || selectedId) return;
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const onWheel = (e: WheelEvent) => {
         const maxScroll = track.scrollWidth - window.innerWidth;
         if (maxScroll <= 0) return;

         const rect = wrapper.getBoundingClientRect();

         if (rect.top > -300 && rect.top < 300) {
            if (Math.abs(rect.top) > 2) {
               window.scrollTo(0, window.scrollY + rect.top);
            }

            if (hScrollRef.current <= 0 && e.deltaY < 0) return;
            if (hScrollRef.current >= maxScroll && e.deltaY > 0) return;

            e.preventDefault();
            hScrollRef.current = Math.max(0, Math.min(maxScroll, hScrollRef.current + e.deltaY * 1.5));
            track.style.transform = `translateX(${-hScrollRef.current}px)`;
            setProgress(hScrollRef.current / maxScroll);
         }
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      return () => window.removeEventListener('wheel', onWheel);
   }, [isMobile, selectedId]);

   if (isMobile) {
      return (
         <section id="works" style={{ padding: "15vw 0" }}>
            <h2 style={{
               fontFamily: '"Inter", sans-serif', fontWeight: 800,
               letterSpacing: "-0.05em", fontSize: "clamp(4rem, 16vw, 8rem)",
               color: "#ffffff", marginBottom: "4rem", lineHeight: 0.9
            }}>WORKS</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
               {projects.map((proj, idx) => (
                  <ScrollReveal key={proj.id} yOffset={40} delay={0.1}>
                     <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "4rem" }}>
                        <div style={{ width: "100%", height: "55vw", overflow: "hidden", marginBottom: "2rem", borderRadius: "4px" }}>
                           <img
                              src={proj.image} alt={proj.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.2)" }}
                           />
                        </div>
                        <span style={{ fontFamily: "monospace", color: "#444", fontSize: "1rem" }}>0{idx + 1}</span>
                        <h3
                           onClick={() => setSelectedId(proj.id)}
                           style={{
                              fontFamily: '"Inter", sans-serif', fontSize: "clamp(2.5rem, 10vw, 5rem)",
                              margin: "0.5rem 0 0.5rem 0", fontWeight: 400, letterSpacing: "-0.04em",
                              color: "#fff", lineHeight: 1, cursor: "pointer"
                           }}
                        >{proj.title}</h3>
                        <div style={{ fontSize: "0.85rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1.5rem", fontFamily: '"Inter", sans-serif' }}>
                           {proj.category}
                        </div>
                        <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#aaa", marginBottom: "1.5rem", fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
                           {proj.desc}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.5rem" }}>
                           {proj.tech.map((t: string) => (
                              <span key={t} style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: "50px", fontSize: "0.8rem", color: "#fff", fontFamily: '"Inter", sans-serif' }}>{t}</span>
                           ))}
                        </div>
                        {proj.link && (
                           <a href={proj.link} target="_blank" rel="noreferrer" className="obys-btn" style={{ fontSize: "0.8rem", padding: "12px 24px" }}>
                              REPOSITORY ↗
                           </a>
                        )}
                     </div>
                  </ScrollReveal>
                  
               ))}
            </div>
         </section>
      );
   }

   return (
      <section id="works" ref={wrapperRef} style={{ position: "relative", height: "100vh", width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
         <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#050505" }}>

            {/* Large background title to maintain the "WORKS" aesthetic */}
            <div style={{ position: "absolute", top: "10vh", right: "5vw", pointerEvents: "none", zIndex: 0 }}>
               <h2 style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.05em", fontSize: "clamp(4rem, 8vw, 10rem)", color: "rgba(255,255,255,0.03)", margin: 0, textAlign: "right" }}>WORKS</h2>
            </div>

            {/* Progress Bar */}
            <div style={{ position: "absolute", bottom: "8vh", left: "5vw", width: "90vw", height: "2px", background: "rgba(255,255,255,0.1)", zIndex: 10, borderRadius: "2px", overflow: "hidden" }}>
               <motion.div
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ height: "100%", background: "#ffffff" }}
               />
            </div>

            <div
               ref={trackRef}
               style={{ display: "flex", height: "100vh", zIndex: 1, willChange: "transform", transition: "transform 0.1s ease-out" }}
            >
               {projects.map((proj, idx) => (
                  <ProjectItem key={proj.id} project={proj} index={idx} onClick={() => setSelectedId(proj.id)} />
               ))}
            </div>
         </div>
      </section>
   );
};

const ProjectItem = ({ project, index, onClick }: any) => {
   const [trail, setTrail] = useState<{x:number,y:number,id:number}[]>([]);
   const trailId = useRef(0);
   const [imgHovered, setImgHovered] = useState(false);

   const handleMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = ++trailId.current;
      setTrail(t => [...t.slice(-2), { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
   };

   return (
      <div
         style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10vw", boxSizing: "border-box", flexShrink: 0 }}
      >
         <div style={{ flex: 1, paddingRight: "5vw", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontFamily: "monospace", color: "#444", fontSize: "1.2rem", marginBottom: "1rem" }}>0{index + 1}</span>
            <h2
               className="hover-target"
               onClick={onClick}
               style={{ fontFamily: '"Inter", sans-serif', fontSize: "clamp(3.5rem, 5vw, 7rem)", margin: "0 0 1rem 0", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.04em", color: "#fff", cursor: "none", display: "inline-block" }}
            >
               {project.title}
            </h2>
            <div style={{ fontSize: "1rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "2rem", fontFamily: '"Inter", sans-serif' }}>
               {project.category}
            </div>
            <p style={{ fontSize: "1.2rem", lineHeight: 1.6, color: "#aaa", marginBottom: "2rem", maxWidth: "600px", fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
               {project.desc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "3rem" }}>
               {project.tech.map((t: string) => (
                  <span key={t} className="hover-target" style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: "50px", fontSize: "0.85rem", color: "#fff", transition: "all 0.3s ease", cursor: "none", fontFamily: '"Inter", sans-serif' }}>
                     {t}
                  </span>
               ))}
            </div>
            {project.link && (
               <div>
                  <a
                     href={project.link}
                     target="_blank"
                     rel="noreferrer"
                     className="hover-target obys-btn"
                  >
                     REPOSITORY ↗
                  </a>
               </div>
            )}
         </div>
         <div style={{ flex: 1, height: "60vh", position: "relative", overflow: "hidden", cursor: "none" }} className="hover-target" onClick={onClick}>
            <motion.div
               layoutId={`image-container-${project.id}`}
               style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
               onMouseEnter={() => setImgHovered(true)}
               onMouseLeave={() => setImgHovered(false)}
               onMouseMove={handleMouseMove}
            >
               {['tl','tr','bl','br'].map(pos => (
                  <motion.div key={pos}
                     animate={{ opacity: imgHovered ? 1 : 0, scale: imgHovered ? 1 : 0.5 }}
                     transition={{ duration: 0.25 }}
                     style={{
                        position: "absolute", zIndex: 10, pointerEvents: "none",
                        width: 20, height: 20,
                        top: pos.includes('t') ? 20 : 'auto',
                        bottom: pos.includes('b') ? 20 : 'auto',
                        left: pos.includes('l') ? 20 : 'auto',
                        right: pos.includes('r') ? 20 : 'auto',
                        borderTop: pos.includes('t') ? '2px solid #fff' : 'none',
                        borderBottom: pos.includes('b') ? '2px solid #fff' : 'none',
                        borderLeft: pos.includes('l') ? '2px solid #fff' : 'none',
                        borderRight: pos.includes('r') ? '2px solid #fff' : 'none',
                     }}
                  />
               ))}
               {trail.map((dot) => (
                  <motion.div key={dot.id}
                     initial={{ opacity: 0.5, scale: 1 }}
                     animate={{ opacity: 0, scale: 0.3 }}
                     transition={{ duration: 0.6 }}
                     style={{ position: "absolute", left: dot.x, top: dot.y,
                              width: 8, height: 8, borderRadius: "50%",
                              background: "#fff", pointerEvents: "none", zIndex: 20,
                              transform: "translate(-50%,-50%)" }}
                  />
               ))}
               <motion.img
                  layoutId={`image-${project.id}`}
                  src={project.image}
                  alt={project.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.2)" }}
                  whileHover={{ scale: 1.05, filter: "grayscale(0%) contrast(1)" }}
                  transition={{ duration: 0.4 }}
               />
            </motion.div>
         </div>
      </div>
   )
}

const CaseStudy = ({ project, onClose }: any) => {
   if (!project) return null;
   return (
      <motion.div
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
         style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 50, background: "#050505", overflowY: "auto", overflowX: "hidden", overscrollBehavior: "none" }}
      >
         <div style={{ position: "fixed", top: "4vw", right: "5vw", zIndex: 60, fontFamily: '"Inter", sans-serif', fontSize: "0.9rem", letterSpacing: "0.2em", color: "#fff" }} onClick={onClose} className="hover-target case-close">
            [ CLOSE ]
         </div>

         <motion.div layoutId={`image-container-${project.id}`} style={{ width: "100vw", height: "80vh", overflow: "hidden", position: "relative", filter: "grayscale(0%) contrast(1)" }}>
            <motion.img layoutId={`image-${project.id}`} src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(5,5,5,1) 100%)" }} />
         </motion.div>

         <div style={{ padding: "0 5vw 10vw 5vw", marginTop: "-15vh", position: "relative", zIndex: 10, maxWidth: "1600px", margin: "0 auto" }}>
            <motion.h1 layoutId={`title-${project.id}`} style={{ fontFamily: '"Inter", sans-serif', fontSize: "clamp(5rem, 12vw, 15rem)", margin: 0, color: "#ffffff", lineHeight: 0.85, letterSpacing: "-0.04em", fontWeight: 800 }}>
               <DataScramble text={project.title} />
            </motion.h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "8vw", marginTop: "15vh", alignItems: "start", fontFamily: '"Inter", sans-serif' }}>
               <ScrollReveal delay={0.4} yOffset={50}>
                  <div style={{ fontSize: "0.85rem", color: "#666", letterSpacing: "0.2em", marginBottom: "2.5rem", textTransform: "uppercase" }}>The Objective</div>
                  <p style={{ fontSize: "1.4rem", lineHeight: 1.7, color: "#aaaaaa", fontWeight: 300 }}>{project.desc}</p>
               </ScrollReveal>

               <ScrollReveal delay={0.5} yOffset={50}>
                  <div style={{ fontSize: "0.85rem", color: "#666", letterSpacing: "0.2em", marginBottom: "2.5rem", textTransform: "uppercase" }}>Stack & System</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                     {project.tech.map((t: string) => (
                        <span key={t} className="hover-target" style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "12px 24px", borderRadius: "50px", fontSize: "0.85rem", color: "#fff", letterSpacing: "0.05em", transition: "all 0.3s ease" }}>
                           {t}
                        </span>
                     ))}
                  </div>
                  <div style={{ marginTop: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                     <div>
                        <div style={{ fontSize: "0.85rem", color: "#666", letterSpacing: "0.2em", marginBottom: "1.5rem", textTransform: "uppercase" }}>Timeline</div>
                        <div style={{ fontSize: "1.2rem", color: "#fff" }}>{project.date}</div>
                     </div>
                     {project.link && (
                        <a href={project.link} target="_blank" rel="noreferrer" className="hover-target obys-btn" style={{ padding: "12px 30px", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.4)" }}>
                           REPOSITORY
                        </a>
                     )}
                  </div>
               </ScrollReveal>
            </div>
         </div>
      </motion.div>
   )
}

const CustomCursor = () => {
   const [pos, setPos] = useState({ x: -100, y: -100 });
   const [hovered, setHovered] = useState(false);
   const [isTouchDevice, setIsTouchDevice] = useState(false);

   useEffect(() => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
      
      if (isTouch) return;
      
      const move = (e: MouseEvent) => {
         setPos({ x: e.clientX, y: e.clientY });
         const target = e.target as HTMLElement;
         if (target.closest(".hover-target") || target.tagName === "A" || target.tagName === "BUTTON" || target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
            setHovered(true);
         } else {
            setHovered(false);
         }
      };
      window.addEventListener("mousemove", move);
      return () => window.removeEventListener("mousemove", move);
   }, []);

   if (isTouchDevice) return null;

   return (
      <motion.div
         animate={{ x: pos.x - (hovered ? 60 : 10), y: pos.y - (hovered ? 60 : 10), scale: hovered ? 1 : 1 }}
         transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.3 }}
         style={{ position: "fixed", top: 0, left: 0, width: hovered ? "120px" : "20px", height: hovered ? "120px" : "20px", borderRadius: "50%", backgroundColor: "#ffffff", mixBlendMode: "difference", pointerEvents: "none", zIndex: 99999 }}
      />
   )
}

const Preloader = () => {
   const [counter, setCounter] = useState(0);
   useEffect(() => {
      const i = setInterval(() => {
         setCounter(c => {
            if (c >= 100) { clearInterval(i); return 100; }
            return c + Math.floor(Math.random() * 12) + 2;
         })
      }, 70);
      return () => clearInterval(i);
   }, []);

   return (
      <motion.div
         className="preloader-overlay"
         exit={{ y: "-100vh", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
         style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#020202", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: "5vw" }}
      >
         <div style={{ fontSize: "clamp(8rem, 20vw, 25rem)", color: "#fff", lineHeight: 0.8, fontFamily: '"Inter", sans-serif', fontWeight: 800, letterSpacing: "-0.05em" }}>
            {Math.min(counter, 100)}%
         </div>
      </motion.div>
   )
}