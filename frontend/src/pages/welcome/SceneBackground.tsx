import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { scrollState, lerp, smooth } from './scroll';
import type { Quality } from './quality';

/*
 * A single fixed WebGL layer that sits behind the whole Welcome page.
 *
 * It is one continuous "world" you fly through: an infinite neon grid floor and
 * ceiling rush past, light trails streak by, wireframe polyhedra assemble out of
 * nothing as you scroll, and the camera dollies forward the whole way down the
 * page. Sections that want the world to show through render a transparent
 * background; opaque sections simply cover it.
 *
 * Palette is locked to the brand: magenta / pink / cyan on the near-black ground.
 */

const MAGENTA = new THREE.Color('#e6007e');
const PINK = new THREE.Color('#ff99cc');
const CYAN = new THREE.Color('#00f0ff');

/* ---------------------------------------------------------------- grid floor */

const GRID_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/*
 * Analytic grid: `fwidth` keeps every line exactly one pixel wide no matter how
 * far away it is, which is what stops the horizon turning into moiré soup. The
 * whole plane scrolls along V with the page and fades out radially so it has no
 * visible edge.
 */
const GRID_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform float uCells;
  uniform float uOpacity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  float gridMask(vec2 p) {
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    vec2 p = vec2(vUv.x, vUv.y + uScroll) * uCells;
    float line = gridMask(p);
    // a second, denser lattice for depth
    line = max(line, gridMask(p * 4.0) * 0.28);

    // radial fade: strong under the viewer, gone at the horizon and the sides
    vec2 c = vUv - 0.5;
    float fade = 1.0 - smoothstep(0.06, 0.46, length(vec2(c.x * 1.15, c.y)));

    // a pulse of light travelling away from the viewer
    float pulse = smoothstep(0.0, 1.0, sin((vUv.y * 9.0 - uTime * 0.55)) * 0.5 + 0.5);

    vec3 col = mix(uColorA, uColorB, smoothstep(0.2, 0.9, vUv.y) * 0.85 + pulse * 0.15);
    float a = line * fade * uOpacity * (0.55 + pulse * 0.75);
    if (a < 0.002) discard;
    gl_FragColor = vec4(col, a);
  }
`;

function GridPlane({
  y,
  flip,
  colorA,
  colorB,
  opacity,
  cells,
}: {
  y: number;
  flip?: boolean;
  colorA: THREE.Color;
  colorB: THREE.Color;
  opacity: number;
  cells: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uCells: { value: cells },
      uOpacity: { value: opacity },
      uColorA: { value: colorA.clone() },
      uColorB: { value: colorB.clone() },
    }),
    [cells, opacity, colorA, colorB],
  );

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    // The floor slides under you as the page scrolls — the main sensation of
    // travelling forward.
    mat.current.uniforms.uScroll.value = -scrollState.y * 0.0016;
  });

  return (
    <mesh rotation={[flip ? Math.PI / 2 : -Math.PI / 2, 0, 0]} position={[0, y, -40]}>
      <planeGeometry args={[260, 340, 1, 1]} />
      <shaderMaterial
        ref={mat}
        args={[
          {
            uniforms,
            vertexShader: GRID_VERT,
            fragmentShader: GRID_FRAG,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          },
        ]}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------- light streaks */

/** Thin neon rods flying toward the viewer — the "data traffic" of the world. */
function Streaks({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 70,
        y: (Math.random() - 0.5) * 34,
        z: -Math.random() * 260,
        len: 4 + Math.random() * 22,
        speed: 14 + Math.random() * 42,
        hue: Math.random(),
      })),
    [count],
  );

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const boost = 1 + scrollState.speed * 0.11;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      s.z += s.speed * dt * boost;
      if (s.z > 24) {
        s.z = -260;
        s.x = (Math.random() - 0.5) * 70;
        s.y = (Math.random() - 0.5) * 34;
      }
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(1, 1, s.len * (0.6 + boost * 0.5));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  // Per-instance colour has to go through InstancedMesh.setColorAt — an
  // `attributes-color` on the box geometry would be per-vertex instead.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const pick = seeds[i].hue;
      c.copy(pick < 0.55 ? MAGENTA : pick < 0.8 ? PINK : CYAN);
      m.setColorAt(i, c);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count, seeds]);

  return (
    <instancedMesh ref={mesh} args={[undefined!, undefined!, count]}>
      <boxGeometry args={[0.035, 0.035, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

/* -------------------------------------------------------------------- nebula */

function Nebula({ density }: { density: number }) {
  const points = useRef<THREE.Points>(null!);

  const { positions, colors, count } = useMemo(() => {
    const N = Math.round(1600 * density);
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const radius = 5 + Math.pow(Math.random(), 0.6) * 30;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.7;
      positions[i * 3 + 2] = -Math.random() * 220;

      const pick = Math.random();
      c.copy(pick < 0.5 ? MAGENTA : pick < 0.8 ? PINK : CYAN);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, count: N };
  }, [density]);

  useFrame((_, dt) => {
    const p = points.current;
    if (!p) return;
    p.rotation.z += dt * 0.015;
    p.position.z = lerp(p.position.z, scrollState.progress * 190, 0.06);
  });

  return (
    <points ref={points} key={count}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------------- shards */

type ShardProps = {
  geometry: 'ico' | 'octa' | 'torus' | 'box';
  position: [number, number, number];
  scale: number;
  color: THREE.Color;
  speed: number;
  /** scroll progress window in which this shard "assembles" */
  appearAt: number;
};

function Shard({ geometry, position, scale, color, speed, appearAt }: ShardProps) {
  const group = useRef<THREE.Group>(null!);
  const mat = useRef<THREE.LineBasicMaterial>(null!);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.x += dt * 0.12 * speed;
    g.rotation.y += dt * 0.18 * speed;

    const t = state.clock.elapsedTime;
    g.position.y = position[1] + Math.sin(t * 0.4 * speed) * 0.6;
    // Assemble in as scroll passes the window, then drift back on the z axis.
    const reveal = smooth((scrollState.progress - appearAt) / 0.16 + 0.001);
    g.scale.setScalar(lerp(0.001, scale, reveal));
    g.position.z = position[2] + scrollState.progress * 40;
    if (mat.current) mat.current.opacity = 0.25 + reveal * 0.45;
  });

  return (
    <group ref={group} position={position}>
      <lineSegments>
        {geometry === 'ico' && <edgesGeometry args={[new THREE.IcosahedronGeometry(1, 0)]} />}
        {geometry === 'octa' && <edgesGeometry args={[new THREE.OctahedronGeometry(1, 0)]} />}
        {geometry === 'torus' && <edgesGeometry args={[new THREE.TorusGeometry(1, 0.38, 8, 16)]} />}
        {geometry === 'box' && <edgesGeometry args={[new THREE.BoxGeometry(1.4, 1.4, 1.4)]} />}
        <lineBasicMaterial ref={mat} color={color} transparent opacity={0.2} depthWrite={false} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

/* ---------------------------------------------------------------------- rig */

function World({ quality }: { quality: Quality }) {
  const rig = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  useFrame(() => {
    const g = rig.current;
    if (!g) return;
    // Gentle pointer parallax across the whole field.
    g.rotation.y = lerp(g.rotation.y, scrollState.px * 0.12, 0.04);
    g.rotation.x = lerp(g.rotation.x, scrollState.py * 0.08, 0.04);

    // Camera dollies forward and banks slightly as the page is consumed, so the
    // grid horizon keeps opening up instead of the world just sliding by.
    camera.position.z = lerp(camera.position.z, 12 - scrollState.progress * 6, 0.05);
    camera.position.y = lerp(camera.position.y, scrollState.progress * 2.2 - scrollState.py * 0.6, 0.05);
    camera.rotation.z = lerp(camera.rotation.z, scrollState.px * 0.02, 0.04);
  });

  const streaks = Math.round(90 * quality.density);

  return (
    <group ref={rig}>
      <Nebula density={quality.density} />
      <Streaks count={Math.max(18, streaks)} />

      {/* the 3D ground the whole page is built on, plus its mirrored ceiling */}
      <GridPlane y={-7.5} colorA={MAGENTA} colorB={CYAN} opacity={0.95} cells={quality.mobile ? 34 : 52} />
      {!quality.mobile && (
        <GridPlane y={11} flip colorA={CYAN} colorB={MAGENTA} opacity={0.32} cells={40} />
      )}

      <Shard geometry="ico" position={[-7, 2, -12]} scale={2.6} color={MAGENTA} speed={0.8} appearAt={0.04} />
      <Shard geometry="torus" position={[8, -3, -20]} scale={2.2} color={CYAN} speed={1.1} appearAt={0.28} />
      <Shard geometry="octa" position={[-9, -5, -30]} scale={3} color={PINK} speed={0.6} appearAt={0.52} />
      <Shard geometry="ico" position={[10, 5, -40]} scale={1.8} color={CYAN} speed={1.3} appearAt={0.72} />
      {!quality.mobile && (
        <Shard geometry="box" position={[-11, 6, -52]} scale={2.4} color={MAGENTA} speed={0.9} appearAt={0.86} />
      )}
    </group>
  );
}

export const SceneBackground: React.FC<{ quality: Quality }> = ({ quality }) => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        gl={{ antialias: !quality.mobile, alpha: true, powerPreference: 'high-performance' }}
        dpr={quality.dpr}
        camera={{ position: [0, 0, 12], fov: 60 }}
      >
        <World quality={quality} />
        {quality.bloom && (
          <EffectComposer>
            <Bloom intensity={0.85} luminanceThreshold={0.22} luminanceSmoothing={0.5} mipmapBlur radius={0.72} />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0006, 0.0009)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.22} darkness={0.72} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};
