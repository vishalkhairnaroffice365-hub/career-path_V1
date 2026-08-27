import { useRef, useMemo, useState  } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Domain, SubDomain } from '../../data/domains';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLOUD SPHERE CLUSTER — custom 3D cloud
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CloudSphereProps {
  color: string;
  emissive: string;
  scale: number;
  opacity?: number;
}

function CloudSphere({ color, emissive, scale, opacity = 0.85 }: CloudSphereProps) {
  const PUFFS = useMemo(() => {
    return Array.from({ length: 9 }, () => ({
      position: [
        (Math.random() - 0.5) * 1.8 * scale,
        (Math.random() - 0.5) * 0.7 * scale,
        (Math.random() - 0.5) * 0.9 * scale,
      ] as [number, number, number],
      radius: (0.5 + Math.random() * 0.6) * scale,
    }));
  }, [scale]);

  return (
    <group>
      {PUFFS.map((puff, i) => (
        <mesh key={i} position={puff.position}>
          <sphereGeometry args={[puff.radius, 16, 12]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.12}
            transparent
            opacity={opacity - i * 0.04}
            roughness={0.95}
            metalness={0.0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOMAIN CLOUD — interactive cloud node
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface DomainCloudProps {
  domain: Domain;
  isActive?: boolean;
  isHovered?: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
}

function DomainCloud({ domain, isActive, isHovered, onClick, onHover }: DomainCloudProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle float
    groupRef.current.position.y =
      domain.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + domain.position[0]) * 0.18;

    // Scale on hover/active
    const targetScale = isActive ? 1.25 : isHovered ? 1.1 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);

    // Glow pulse
    if (glowRef.current) {
      (glowRef.current.material as any).opacity =
        (isHovered || isActive ? 0.25 : 0.1) + Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
    }

    // Light flicker
    if (lightRef.current) {
      lightRef.current.intensity = (isHovered || isActive ? 2.5 : 1.2) + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const baseColor = new THREE.Color(domain.theme.primaryColor);


  return (
    <group
      ref={groupRef}
      position={domain.position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(domain.id); }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(null); }}
    >
      {/* Point light for domain atmosphere */}
      <pointLight
        ref={lightRef}
        color={domain.theme.primaryColor}
        intensity={1.5}
        distance={6}
        decay={2}
      />

      {/* Main cloud body */}
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0}>
        <CloudSphere
          color={`#${baseColor.clone().addScalar(0.15).getHexString()}`}
          emissive={domain.theme.emissiveColor}
          scale={domain.scale}
          opacity={isHovered || isActive ? 0.95 : 0.82}
        />
      </Float>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[domain.scale * 1.8, 12, 8]} />
        <meshBasicMaterial
          color={domain.theme.primaryColor}
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ring for active domain */}
      {(isHovered || isActive) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[domain.scale * 2.0, domain.scale * 2.2, 48]} />
          <meshBasicMaterial
            color={domain.theme.primaryColor}
            transparent
            opacity={0.4}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUB-DOMAIN CLOUD — smaller cloud for sub-domains
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SubDomainCloudProps {
  subDomain: SubDomain;
  domain: Domain;
  isHovered?: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
  centerPos: [number, number, number];
}

function SubDomainCloud({ subDomain, domain, isHovered, onClick, onHover, centerPos }: SubDomainCloudProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Position relative to parent domain in world space
  const worldPos: [number, number, number] = [
    centerPos[0] + subDomain.position[0],
    centerPos[1] + subDomain.position[1],
    centerPos[2] + subDomain.position[2],
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      worldPos[1] + Math.sin(state.clock.elapsedTime * 0.7 + subDomain.position[0] * 2) * 0.12;

    const targetScale = isHovered ? 1.15 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.07);
  });

  const baseColor = new THREE.Color(domain.theme.secondaryColor);

  return (
    <group
      ref={groupRef}
      position={worldPos}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(subDomain.id); }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(null); }}
    >
      <pointLight color={domain.theme.secondaryColor} intensity={0.8} distance={4} decay={2} />

      <Float speed={1.8} floatIntensity={0}>
        <CloudSphere
          color={`#${baseColor.clone().addScalar(0.2).getHexString()}`}
          emissive={domain.theme.emissiveColor}
          scale={subDomain.scale}
          opacity={isHovered ? 0.92 : 0.78}
        />
      </Float>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[subDomain.scale * 1.6, 10, 8]} />
        <meshBasicMaterial
          color={domain.theme.secondaryColor}
          transparent
          opacity={isHovered ? 0.18 : 0.08}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AMBIENT PARTICLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AmbientParticles({ activeDomain }: { activeDomain: Domain | null }) {
  const meshRef = useRef<THREE.Points>(null);
  const COUNT = 200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const color = new THREE.Color(activeDomain?.theme.primaryColor || '#6366f1');

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, [activeDomain]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAMERA CONTROLLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CameraControllerProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}

function CameraController({ targetPosition, targetLookAt }: CameraControllerProps) {
  const { camera } = useThree();
  const lookAtVec = useRef(new THREE.Vector3(...targetLookAt));
  const posVec = useRef(new THREE.Vector3(...targetPosition));

  useFrame(() => {
    posVec.current.lerp(new THREE.Vector3(...targetPosition), 0.04);
    lookAtVec.current.lerp(new THREE.Vector3(...targetLookAt), 0.05);

    camera.position.copy(posVec.current);
    camera.lookAt(lookAtVec.current);
  });

  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENE — composites everything
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type CameraView = 'SKY_VIEW' | 'DOMAIN_VIEW' | 'CAREER_VIEW';

interface SkySceneProps {
  domains: Domain[];
  cameraView: CameraView;
  activeDomainId: string | null;
  onDomainClick: (domain: Domain) => void;
  onSubDomainClick: (subDomain: SubDomain, domain: Domain) => void;
}

export function SkyScene({
  domains,
  cameraView,
  activeDomainId,
  onDomainClick,
  onSubDomainClick,
}: SkySceneProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeDomain = domains.find((d) => d.id === activeDomainId) || null;

  // Camera positions for each view
  const cameraPos: [number, number, number] =
    cameraView === 'SKY_VIEW'
      ? [0, 2, 18]
      : cameraView === 'DOMAIN_VIEW' && activeDomain
      ? [
          activeDomain.position[0] * 0.5,
          activeDomain.position[1] + 1,
          activeDomain.position[2] + 8,
        ]
      : [0, 2, 10];

  const cameraLookAt: [number, number, number] =
    cameraView === 'SKY_VIEW'
      ? [0, 0, 0]
      : cameraView === 'DOMAIN_VIEW' && activeDomain
      ? activeDomain.position
      : [0, 0, 0];

  return (
    <>
      {/* Camera */}
      <CameraController targetPosition={cameraPos} targetLookAt={cameraLookAt} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#8b9bbf" />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#c7d2fe" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#818cf8" />
      <pointLight position={[10, -5, -10]} intensity={0.3} color="#06b6d4" />

      {/* Stars */}
      <Stars radius={80} depth={50} count={3000} factor={3} saturation={0.3} fade speed={0.5} />

      {/* Ambient particles */}
      <AmbientParticles activeDomain={activeDomain} />

      {/* Domain clouds — shown in SKY_VIEW and DOMAIN_VIEW */}
      {(cameraView === 'SKY_VIEW' || cameraView === 'DOMAIN_VIEW') &&
        domains.map((domain) => (
          <DomainCloud
            key={domain.id}
            domain={domain}
            isActive={domain.id === activeDomainId}
            isHovered={hoveredId === domain.id}
            onClick={() => onDomainClick(domain)}
            onHover={setHoveredId}
          />
        ))}

      {/* Sub-domain clouds — shown when a domain is active */}
      {cameraView === 'DOMAIN_VIEW' &&
        activeDomain?.subDomains.map((sub) => (
          <SubDomainCloud
            key={sub.id}
            subDomain={sub}
            domain={activeDomain}
            isHovered={hoveredId === sub.id}
            onClick={() => onSubDomainClick(sub, activeDomain)}
            onHover={setHoveredId}
            centerPos={activeDomain.position}
          />
        ))}

      {/* Fog */}
      <fog attach="fog" args={[activeDomain?.theme.fogColor || '#020817', 30, 80]} />
    </>
  );
}
