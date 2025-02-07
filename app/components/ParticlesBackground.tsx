"use client";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#0D1117" },
        particles: {
          color: { value: "#58A6FF" },
          links: { enable: true, color: "#58A6FF", distance: 150 },
          move: { enable: true, speed: 1 },
          number: { value: 50 },
          opacity: { value: 0.7 },
          size: { value: 2 },
        },
      }}
      className="absolute inset-0 -z-10"
    />
  );
}
