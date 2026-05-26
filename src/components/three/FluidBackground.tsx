"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FluidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom shader for a soothing, slow-moving fluid aesthetic
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_color1: { value: new THREE.Color("#faf8f5") },
      u_color2: { value: new THREE.Color("#f2e8cf") },
      u_color3: { value: new THREE.Color("#e4d9c0") },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float u_time;
          uniform vec3 u_color1;
          uniform vec3 u_color2;
          uniform vec3 u_color3;
          varying vec2 vUv;

          // Simple 2D noise
          float random (in vec2 st) {
              return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
          }

          // Value noise
          float noise(vec2 st) {
              vec2 i = floor(st);
              vec2 f = fract(st);
              float a = random(i);
              float b = random(i + vec2(1.0, 0.0));
              float c = random(i + vec2(0.0, 1.0));
              float d = random(i + vec2(1.0, 1.0));
              vec2 u = f*f*(3.0-2.0*f);
              return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          void main() {
            vec2 st = vUv * 3.0;
            
            vec2 q = vec2(0.);
            q.x = noise(st + u_time);
            q.y = noise(st + vec2(1.0));

            vec2 r = vec2(0.);
            r.x = noise(st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
            r.y = noise(st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

            float f = noise(st+r);

            vec3 color = mix(
                u_color1,
                u_color2,
                clamp((f*f)*4.0,0.0,1.0)
            );

            color = mix(
                color,
                u_color3,
                clamp(length(q),0.0,1.0)
            );

            gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// Wrapper for the animated fluid canvas.
// An inward radial mask fades the animation softly toward the edges so it
// blends with the page's cream background instead of cutting off at hard
// rectangular borders. Tweak the percentages below to change the size of
// the "visible" center vs. the faded edges.
export function FluidBackground() {
  // Visible in the middle, fully transparent by the edges.
  // (0%–35%) = fully opaque, (35%–95%) = soft fade, (95%+) = transparent.
  const maskStyle = {
    WebkitMaskImage:
      "radial-gradient(ellipse at center, black 35%, transparent 95%)",
    maskImage:
      "radial-gradient(ellipse at center, black 35%, transparent 95%)",
  } as React.CSSProperties;

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60"
      style={maskStyle}
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <FluidMesh />
      </Canvas>
    </div>
  );
}
