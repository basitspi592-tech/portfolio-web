"use client";
import dynamic from "next/dynamic";
import HUD from "@/components/HUD";

const World = dynamic(() => import("@/components/World"), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <World />
      <HUD />
    </main>
  );
}
