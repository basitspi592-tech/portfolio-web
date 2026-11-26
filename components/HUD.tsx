"use client";
import { useEffect, useState } from "react";
import { profile, projects, sections, skillGroups, type SectionId } from "@/lib/data";
import { input, useActive } from "@/lib/store";

const chip = "rounded-full border border-current/20 px-3 py-0.5 text-[13px]";
const cta = "mt-4 inline-block rounded-full bg-[#2b1b3d] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#f97b80] dark:text-[#2b1b3d]";

function Content({ id }: { id: SectionId }) {
  if (id === "about")
    return (
      <>
        <h2 className="mb-2 text-2xl font-bold">About me</h2>
        <p>I&apos;m a Software Engineering student at Abasyn University Peshawar (2023–2027), based in {profile.location}.</p>
        <p className="mt-2">I learn by building: self-directed projects in full-stack web development and agentic AI, from RAG pipelines to tool-using agents over MCP.</p>
      </>
    );
  if (id === "skills")
    return (
      <>
        <h2 className="mb-2 text-2xl font-bold">Skills</h2>
        {skillGroups.map((g) => (
          <div key={g.title} className="mb-3">
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-[#f97b80]">{g.title}</div>
            <div className="flex flex-wrap gap-1.5">{g.items.map((s) => <span key={s} className={chip}>{s}</span>)}</div>
          </div>
        ))}
      </>
    );
  if (id === "projects")
    return (
      <>
        <h2 className="mb-2 text-2xl font-bold">Projects</h2>
        {projects.length ? (
          projects.map((p) => (
            <a key={p.title} href={p.link} target="_blank" rel="noreferrer" className="mb-3 block rounded-xl border border-current/20 p-3">
              <div className="font-semibold">{p.title} ↗</div>
              <div className="text-sm opacity-75">{p.description}</div>
            </a>
          ))
        ) : (
          <p>I build in the open, with self-directed projects in agentic AI and full-stack apps. Finished projects will land here as I ship them. Until then, the code lives on GitHub.</p>
        )}
        <a className={cta} href={profile.github} target="_blank" rel="noreferrer">See my GitHub</a>
      </>
    );
  return (
    <>
      <h2 className="mb-2 text-2xl font-bold">Let&apos;s build something</h2>
      <p>Open to internships, collaborations and interesting projects.</p>
      <a className={cta} href={profile.github} target="_blank" rel="noreferrer">GitHub: basitspi592-tech</a>
    </>
  );
}

function Hold({ k, children }: { k: string; children: React.ReactNode }) {
  const set = (v: boolean) => { input.keys[k] = v; if (v) input.auto = null; };
  return (
    <button className="h-14 w-14 touch-none rounded-2xl bg-white/90 text-xl text-[#2b1b3d]"
      onPointerDown={() => set(true)} onPointerUp={() => set(false)} onPointerLeave={() => set(false)} onPointerCancel={() => set(false)}>
      {children}
    </button>
  );
}

export default function HUD() {
  const active = useActive();
  const [hint, setHint] = useState(true);
  useEffect(() => { const h = () => setHint(false); addEventListener("keydown", h, { once: true }); return () => removeEventListener("keydown", h); }, []);
  const pill = "rounded-full px-4 py-2.5 text-[13px] font-semibold shadow-lg transition hover:-translate-y-0.5";

  return (
    <>
      <div className="fixed left-5 top-[max(16px,env(safe-area-inset-top))] z-10 text-white [text-shadow:0_2px_12px_rgba(60,20,80,.35)]">
        <h1 className="text-[clamp(22px,4vw,34px)] font-extrabold leading-tight tracking-tight">{profile.name}</h1>
        <p className="mt-1 max-w-[340px] text-[clamp(13px,2vw,16px)]">{profile.title}, {profile.location}</p>
      </div>

      <div className="fixed right-4 top-[max(16px,env(safe-area-inset-top))] z-10 flex max-w-[60vw] flex-wrap justify-end gap-2 max-sm:inset-x-0 max-sm:bottom-[max(10px,env(safe-area-inset-bottom))] max-sm:top-auto max-sm:max-w-none max-sm:justify-center">
        {sections.map((s) => (
          <button key={s.id} onClick={() => { input.auto = s; setHint(false); }}
            className={`${pill} ${active === s.id ? "bg-[#2b1b3d] text-white" : "bg-white/90 text-[#2b1b3d]"}`}>{s.label}</button>
        ))}
        <a href={profile.github} target="_blank" rel="noreferrer" className={`${pill} bg-white/90 text-[#2b1b3d]`}>GitHub ↗</a>
      </div>

      <div className={`fixed bottom-[max(70px,calc(env(safe-area-inset-bottom)+64px))] right-5 z-20 max-h-[60vh] w-[min(380px,calc(100vw-40px))] overflow-auto rounded-3xl border border-black/10 bg-[#fffaf4]/95 p-6 text-[#2b1b3d] shadow-2xl backdrop-blur transition duration-300 dark:border-white/15 dark:bg-[#1e1230]/95 dark:text-[#fff4ea] max-sm:right-1/2 max-sm:translate-x-1/2 ${active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
        {active && <div className="text-[15px] leading-relaxed opacity-90"><Content id={active as SectionId} /></div>}
      </div>

      {hint && (
        <div className="fixed bottom-[max(18px,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2b1b3d]/75 px-4 py-2 text-[13px] text-white backdrop-blur max-sm:hidden [@media(pointer:coarse)]:hidden">
          Drive with W A S D or arrow keys. Park on a glowing pad.
        </div>
      )}

      <div className="fixed bottom-[max(64px,calc(env(safe-area-inset-bottom)+64px))] left-3.5 z-10 hidden gap-2 [@media(pointer:coarse)]:flex max-sm:bottom-[calc(env(safe-area-inset-bottom)+72px)]">
        <Hold k="a">◀</Hold><Hold k="w">▲</Hold><Hold k="s">▼</Hold><Hold k="d">▶</Hold>
      </div>
    </>
  );
}
