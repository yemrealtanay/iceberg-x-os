import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Edges, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollState, lerp } from './scroll';
import type { Quality } from './quality';

/*
 * The hero centrepiece: a glowing "Cube" — the thing every applicant becomes.
 *
 * A magenta core inside a wireframe shell, an inner counter-rotating
 * icosahedron, gyroscopic orbit rings, a holographic scan plane sweeping through
 * it, orbiting satellite cubes and a haze of sparks. It answers to the pointer
 * and drifts / shrinks as the hero scrolls away.
 */

/** Three rings on different axes, spinning like a gyroscope cage. */
function OrbitRings({ reduced }: { reduced: boolean }) {
  const a = useRef<THREE.Mesh>(null!);
  const b = useRef<THREE.Mesh>(null!);
  const c = useRef<THREE.Mesh>(null!);

  useFrame((_, dt) => {
    if (reduced) return;
    if (a.current) a.current.rotation.z += dt * 0.42;
    if (b.current) {
      b.current.rotation.x += dt * 0.3;
      b.current.rotation.y += dt * 0.16;
    }
    if (c.current) c.current.rotation.y -= dt * 0.24;
  });

  return (
    <group>
      <mesh ref={a} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.012, 8, 128]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[3.7, 0.009, 8, 128]} />
        <meshBasicMaterial color="#ff4da6" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh ref={c} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[4.3, 0.007, 8, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** A cyan plane that sweeps up and down through the cube like a scanner. */
function ScanPlane() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.y = Math.sin(t * 0.7) * 2.6;
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.1 + Math.abs(Math.cos(t * 0.7)) * 0.16;
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5.6, 5.6]} />
      <meshBasicMaterial
        color="#00f0ff"
        transparent
        opacity={0.14}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Dashed HUD reticle that ticks around the cube one notch at a time. */
function Reticle() {
  const group = useRef<THREE.Group>(null!);
  const ticks = useMemo(() => Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2), []);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = Math.floor(state.clock.elapsedTime * 4) * ((Math.PI * 2) / 48);
  });
  return (
    <group ref={group} rotation={[Math.PI / 2, 0, 0]}>
      {ticks.map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 4.75, 0, Math.sin(a) * 4.75]} rotation={[0, -a, 0]}>
          <boxGeometry args={[i % 6 === 0 ? 0.3 : 0.13, 0.014, 0.014]} />
          <meshBasicMaterial
            color={i % 6 === 0 ? '#ff4da6' : '#ffffff'}
            transparent
            opacity={i % 6 === 0 ? 0.9 : 0.35}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CubeCluster({ reduced, quality }: { reduced: boolean; quality: Quality }) {
  const root = useRef<THREE.Group>(null!);
  const satellites = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.LineSegments>(null!);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;

    const heroProgress = Math.min(1, scrollState.y / Math.max(1, scrollState.vh));

    if (!reduced) {
      g.rotation.y = lerp(g.rotation.y, 0.6 + scrollState.px * 0.5 + state.clock.elapsedTime * 0.1, 0.05);
      g.rotation.x = lerp(g.rotation.x, 0.42 + scrollState.py * 0.28 + heroProgress * 0.5, 0.05);
      satellites.current.rotation.y += dt * 0.55;
      satellites.current.rotation.z += dt * 0.12;
      inner.current.rotation.x -= dt * 0.5;
      inner.current.rotation.y -= dt * 0.35;
    } else {
      g.rotation.set(0.42, 0.6, 0);
    }

    g.position.y = lerp(g.position.y, heroProgress * 2.4, 0.08);
    // Fling toward the viewer as the hero leaves, so it exits *through* the page.
    g.position.z = lerp(g.position.z, heroProgress * 3.2, 0.08);
    g.scale.setScalar(lerp(g.scale.x, 1 - heroProgress * 0.4, 0.1));
  });

  const satellitePositions: [number, number, number][] = [
    [2.9, 0.5, 0.2],
    [-2.4, 1.3, 1.3],
    [0.4, -2.7, -1],
  ];

  return (
    <group ref={root} rotation={[0.42, 0.6, 0]}>
      {/* Solid core */}
      <Float speed={reduced ? 0 : 1.4} rotationIntensity={reduced ? 0 : 0.25} floatIntensity={reduced ? 0 : 0.7}>
        <RoundedBox args={[2.4, 2.4, 2.4]} radius={0.16} smoothness={4}>
          <meshStandardMaterial
            color="#e6007e"
            emissive="#ff2f9e"
            emissiveIntensity={0.55}
            roughness={0.28}
            metalness={0.15}
          />
          <Edges threshold={15} color="#ffd9ec" />
        </RoundedBox>

        {/* Inner counter-rotating icosahedron */}
        <lineSegments ref={inner}>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(1.55, 0)]} />
          <lineBasicMaterial color="#00f0ff" transparent opacity={0.55} toneMapped={false} />
        </lineSegments>
      </Float>

      {/* Outer wireframe shell */}
      <mesh>
        <boxGeometry args={[3.9, 3.9, 3.9]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.16} toneMapped={false} />
      </mesh>

      {!reduced && <ScanPlane />}
      {!reduced && <OrbitRings reduced={reduced} />}
      {!reduced && !quality.mobile && <Reticle />}

      <group ref={satellites}>
        {satellitePositions.map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial
              color={i % 2 ? '#00f0ff' : '#ff99cc'}
              emissive={i % 2 ? '#00c2cc' : '#ff4da6'}
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {!reduced && (
        <Sparkles
          count={Math.round(44 * quality.density)}
          scale={8}
          size={2.6}
          speed={0.35}
          color="#ff99cc"
          opacity={0.7}
        />
      )}
    </group>
  );
}

export const HeroScene: React.FC<{ reduced?: boolean; quality: Quality }> = ({
  reduced = false,
  quality,
}) => {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true }}
      dpr={quality.dpr}
      camera={{ position: [0, 0, 8.5], fov: 50 }}
    >
      <hemisphereLight args={['#ffd9ec', '#0a0210', 1.1]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 8]} intensity={2.4} color="#ffffff" />
      <pointLight position={[6, 4, 6]} intensity={80} color="#ff4da6" distance={30} />
      <pointLight position={[-8, -3, 4]} intensity={60} color="#00f0ff" distance={30} />
      <CubeCluster reduced={reduced} quality={quality} />
      {quality.bloom && (
        <EffectComposer>
          <Bloom intensity={1.15} luminanceThreshold={0.3} luminanceSmoothing={0.5} mipmapBlur radius={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
};
