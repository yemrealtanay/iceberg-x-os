import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollState, lerp } from './scroll';

/*
 * "The Cube Network" as a living 3D constellation: a magenta core cube wired to
 * a shell of orbiting nodes, every node linked to the core and to its
 * neighbours. Slowly rotates and answers to the pointer.
 */

const NODES = 10;

function Constellation() {
  const group = useRef<THREE.Group>(null!);
  const packets = useRef<THREE.Mesh[]>([]);

  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    // Fibonacci sphere for even spread
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODES; i++) {
      const y = 1 - (i / (NODES - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(2.6));
    }
    return pts;
  }, []);

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    const center = new THREE.Vector3(0, 0, 0);
    nodes.forEach((n, i) => {
      arr.push(center.x, center.y, center.z, n.x, n.y, n.z);
      const next = nodes[(i + 1) % nodes.length];
      arr.push(n.x, n.y, n.z, next.x, next.y, next.z);
    });
    return new Float32Array(arr);
  }, [nodes]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    // Packets riding the links from the core out to the nodes.
    const t = state.clock.elapsedTime;
    packets.current.forEach((p, i) => {
      if (!p) return;
      const k = ((t * 0.4 + i / NODES) % 1);
      p.position.copy(nodes[i]).multiplyScalar(k);
      const s = 0.5 + Math.sin(k * Math.PI) * 0.8;
      p.scale.setScalar(s);
    });
    g.rotation.y += dt * 0.18;
    g.rotation.x = lerp(g.rotation.x, scrollState.py * 0.35 + 0.15, 0.05);
    g.rotation.z = lerp(g.rotation.z, scrollState.px * 0.25, 0.05);
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    g.scale.setScalar(pulse);
  });

  return (
    <group ref={group}>
      {/* core */}
      <mesh>
        <boxGeometry args={[1.15, 1.15, 1.15]} />
        <meshStandardMaterial color="#e6007e" emissive="#ff2f9e" emissiveIntensity={0.6} roughness={0.3} metalness={0.2} />
        <Edges threshold={15} color="#ffd9ec" />
      </mesh>

      {/* links */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#e6007e" transparent opacity={0.28} />
      </lineSegments>

      {/* packets in flight along each link */}
      {nodes.map((_, i) => (
        <mesh key={`p${i}`} ref={(m) => { if (m) packets.current[i] = m; }}>
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.95} toneMapped={false} />
        </mesh>
      ))}

      {/* nodes */}
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#00f0ff' : '#ffffff'}
            emissive={i % 3 === 0 ? '#00f0ff' : '#ff99cc'}
            emissiveIntensity={0.5}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

export const NetworkOrb: React.FC = () => (
  <Canvas
    className="!absolute inset-0"
    gl={{ antialias: true, alpha: true }}
    dpr={[1, 1.75]}
    camera={{ position: [0, 0, 8], fov: 50 }}
  >
    <ambientLight intensity={0.6} />
    <pointLight position={[6, 5, 6]} intensity={70} color="#ff4da6" distance={30} />
    <pointLight position={[-6, -4, 4]} intensity={50} color="#00f0ff" distance={30} />
    <Constellation />
    <EffectComposer>
      <Bloom intensity={1.1} luminanceThreshold={0.32} luminanceSmoothing={0.5} mipmapBlur radius={0.6} />
    </EffectComposer>
  </Canvas>
);
