"use client";
import { useCallback } from "react";
import { loadSlim } from "tsparticles-slim"; // Use slim version for better performance
import Particles from "react-tsparticles";
import React from "react";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine); // Correct function to initialize tsparticles
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
