"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sections } from "@/lib/data";
import { input, setActive } from "@/lib/store";

const norm = (a: number) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

function Car() {
  const group = useRef<THREE.Group>(null);
  const st = useRef({ x: 0, z: 0, h: Math.PI, v: 0 });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      input.keys[k] = true; input.auto = null;
    };
    const up = (e: KeyboardEvent) => { input.keys[e.key.toLowerCase()] = false; };
    addEventListener("keydown", down); addEventListener("keyup", up);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); };
  }, []);

  useFrame(({ camera }) => {
    const s = st.current, k = input.keys, auto = input.auto;
    const fwd = k.w || k.arrowup, back = k.s || k.arrowdown, left = k.a || k.arrowleft, right = k.d || k.arrowright;
    if (auto) {
      const dx = auto.x - s.x, dz = auto.z - s.z, dist = Math.hypot(dx, dz);
      const df = norm(Math.atan2(dx, dz) - s.h);
      s.h += Math.max(-0.06, Math.min(0.06, df));
      if (dist > 2.5) s.v += (0.3 - s.v) * 0.06;
      else { s.v *= 0.85; if (s.v < 0.01) input.auto = null; }
    } else {
      if (fwd) s.v += 0.012;
      if (back) s.v -= 0.01;
      s.v *= 0.97;
      const turn = Math.min(1, Math.abs(s.v) * 5) * 0.035 * (s.v >= 0 ? 1 : -1);
      if (left) s.h += turn;
      if (right) s.h -= turn;
    }
    s.v = Math.max(-0.12, Math.min(0.35, s.v));
    s.x += Math.sin(s.h) * s.v; s.z += Math.cos(s.h) * s.v;
    const rad = Math.hypot(s.x, s.z);
    if (rad > 55) { s.x *= 55 / rad; s.z *= 55 / rad; s.v *= 0.8; }
    group.current?.position.set(s.x, 0, s.z);
    if (group.current) group.current.rotation.y = s.h;

    camera.position.x += (s.x - Math.sin(s.h) * 10 - camera.position.x) * 0.07;
    camera.position.y += (6 - camera.position.y) * 0.07;
    camera.position.z += (s.z - Math.cos(s.h) * 10 - camera.position.z) * 0.07;
    camera.lookAt(s.x + Math.sin(s.h) * 4, 1, s.z + Math.cos(s.h) * 4);

    let near: string | null = null, nd = 5;
    for (const p of sections) {
      const d = Math.hypot(s.x - p.x, s.z - p.z);
      if (d < nd) { nd = d; near = p.id; }
    }
    setActive(near);
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.65, 0]}><boxGeometry args={[1.6, 0.7, 3]} /><meshLambertMaterial color="#2b1b3d" /></mesh>
      <mesh position={[0, 1.2, -0.2]}><boxGeometry args={[1.3, 0.6, 1.4]} /><meshLambertMaterial color="#f97b80" /></mesh>
      <mesh position={[0, 0.7, 1.52]}><boxGeometry args={[1.2, 0.2, 0.1]} /><meshBasicMaterial color="#fff3a8" /></mesh>
      {[[-0.9, 1], [0.9, 1], [-0.9, -1], [0.9, -1]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.35, 14]} /><meshLambertMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

function Pad({ s }: { s: (typeof sections)[number] }) {
  const beam = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = beam.current?.material as THREE.MeshBasicMaterial | undefined;
    if (m) m.opacity = 0.35 + 0.2 * Math.sin(clock.elapsedTime * 3);
  });
  return (
    <group position={[s.x, 0, s.z]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[4, 4, 0.25, 40]} /><meshLambertMaterial color={s.color} /></mesh>
      <mesh ref={beam} position={[0, 4.6, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 9, 10]} /><meshBasicMaterial color={s.color} transparent opacity={0.5} />
      </mesh>
      <Html position={[0, 9.5, 0]} center zIndexRange={[4, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-full bg-[#2b1b3d]/70 px-3 py-1 text-xs font-bold text-white">{s.label}</div>
      </Html>
    </group>
  );
}

function Decor() {
  const trees = useMemo(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const out: { x: number; z: number; h: number; c: string }[] = [];
    for (let i = 0; i < 60 && out.length < 46; i++) {
      const a = rnd() * Math.PI * 2, d = 8 + rnd() * 48, x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (sections.some((p) => Math.hypot(x - p.x, z - p.z) < 7)) continue;
      out.push({ x, z, h: 2 + rnd() * 2, c: rnd() > 0.5 ? "#e9677a" : "#6b4b8a" });
    }
    return out;
  }, []);
  const clouds = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (clouds.current) clouds.current.rotation.y += dt * 0.01; });
  return (
    <>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.2, 0.3, 1, 6]} /><meshLambertMaterial color="#6b4b8a" /></mesh>
          <mesh position={[0, 1 + t.h / 2, 0]}><coneGeometry args={[1.2, t.h, 7]} /><meshLambertMaterial color={t.c} /></mesh>
        </group>
      ))}
      <group ref={clouds}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 80, 20 + (i % 3) * 4, Math.sin(a) * 80]} scale={[3, 1, 1.6]}>
              <sphereGeometry args={[3, 10, 8]} /><meshBasicMaterial color="#fff" transparent opacity={0.8} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

export default function World() {
  return (
    <Canvas className="!fixed inset-0 touch-none" camera={{ position: [0, 6, 10], fov: 55, far: 220 }} dpr={[1, 2]}>
      <fog attach="fog" args={["#ffc58a", 30, 95]} />
      <hemisphereLight args={["#fff0e0", "#c9889a", 0.95]} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[60, 64]} /><meshLambertMaterial color="#fff0dc" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}><ringGeometry args={[58, 60, 64]} /><meshBasicMaterial color="#f97b80" side={THREE.DoubleSide} /></mesh>
      <Car />
      {sections.map((s) => <Pad key={s.id} s={s} />)}
      <Decor />
    </Canvas>
  );
}
