import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, ContactShadows, Cloud, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Leaf } from 'lucide-react';

// --- Procedural Generation Utilities ---

// Seeded random number generator
const pseudoRandom = (seed) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Tree Colors
const LEAF_COLORS = ['#2ea354', '#4ade80', '#10b981', '#f59e0b', '#ec4899', '#34d399'];
const TRUNK_COLORS = ['#78350f', '#92400e', '#5c2214', '#b45309'];
const FRUIT_COLORS = ['#ef4444', '#f97316', '#eab308'];

// --- Components ---

// Low Poly Tree
const Tree = ({ position, scale, seed, level }) => {
  const isFruitful = level > 5;
  const isBig = level > 3;
  
  const rand = pseudoRandom(seed);
  const trunkColor = TRUNK_COLORS[Math.floor(pseudoRandom(seed + 1) * TRUNK_COLORS.length)];
  const leafColor = LEAF_COLORS[Math.floor(pseudoRandom(seed + 2) * LEAF_COLORS.length)];
  const leafType = pseudoRandom(seed + 3) > 0.5 ? 'round' : 'pine';
  
  const height = 2 + pseudoRandom(seed + 4) * 2;
  const radius = 0.3 + pseudoRandom(seed + 5) * 0.2;

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.5, radius, height, 6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* Leaves */}
      {leafType === 'round' ? (
        <group position={[0, height, 0]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color={leafColor} roughness={0.7} flatShading />
          </mesh>
          {isBig && (
            <>
              <mesh castShadow receiveShadow position={[0.8, -0.2, 0.5]} scale={0.7}>
                <icosahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color={leafColor} roughness={0.7} flatShading />
              </mesh>
              <mesh castShadow receiveShadow position={[-0.8, -0.4, -0.5]} scale={0.6}>
                <icosahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color={leafColor} roughness={0.7} flatShading />
              </mesh>
            </>
          )}
        </group>
      ) : (
        <group position={[0, height, 0]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <coneGeometry args={[1.5, 2.5, 5]} />
            <meshStandardMaterial color={leafColor} roughness={0.7} flatShading />
          </mesh>
          {isBig && (
            <mesh castShadow receiveShadow position={[0, 1, 0]} scale={0.8}>
              <coneGeometry args={[1.5, 2.5, 5]} />
              <meshStandardMaterial color={leafColor} roughness={0.7} flatShading />
            </mesh>
          )}
        </group>
      )}

      {/* Fruits */}
      {isFruitful && (
        <group position={[0, height, 0]}>
          {[...Array(5)].map((_, i) => (
             <mesh 
               key={i} 
               position={[
                 (pseudoRandom(seed + i * 10) - 0.5) * 2.5, 
                 (pseudoRandom(seed + i * 11) - 0.5) * 2, 
                 (pseudoRandom(seed + i * 12) - 0.5) * 2.5
               ]}
               castShadow
             >
               <sphereGeometry args={[0.2, 8, 8]} />
               <meshStandardMaterial color={FRUIT_COLORS[i % FRUIT_COLORS.length]} roughness={0.4} />
             </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// Low Poly Flower/Bush
const Flower = ({ position, scale, seed, level }) => {
  const rand = pseudoRandom(seed);
  const color = ['#f472b6', '#c084fc', '#fcd34d', '#38bdf8'][Math.floor(rand * 4)];
  const isBush = pseudoRandom(seed + 1) > 0.5;

  return (
    <group position={position} scale={scale}>
      {isBush ? (
         <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <icosahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} flatShading />
         </mesh>
      ) : (
        <>
          {/* Stem */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 5]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
          {/* Petals */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <icosahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color={color} roughness={0.4} flatShading />
          </mesh>
        </>
      )}
    </group>
  );
};

// Ground
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#14532d" roughness={1} />
    </mesh>
  );
};

// Grass blades
const Grass = ({ seed }) => {
   return (
      <group>
         {[...Array(50)].map((_, i) => {
             const r = pseudoRandom(seed + i * 10) * 15;
             const theta = pseudoRandom(seed + i * 11) * Math.PI * 2;
             const x = r * Math.cos(theta);
             const z = r * Math.sin(theta);
             return (
                <mesh key={i} position={[x, 0.1, z]} rotation={[0, pseudoRandom(seed + i) * Math.PI, 0]}>
                   <coneGeometry args={[0.1, 0.3 + pseudoRandom(seed+i*2)*0.3, 3]} />
                   <meshStandardMaterial color="#16a34a" flatShading />
                </mesh>
             )
         })}
      </group>
   )
}

// Main 3D Scene
export default function Garden3D({ totalXP }) {
  // Logic to determine garden elements based on totalXP
  // Let's say 1 tree = 50 XP, 1 flower/bush = 10 XP
  
  const gardenElements = useMemo(() => {
    const elements = [];
    const numTrees = Math.floor(totalXP / 50);
    const numFlowers = Math.floor((totalXP % 50) / 10) + Math.floor(totalXP / 100) * 5; // Extra flowers for high XP
    
    // Generate Trees (spiraling outward)
    for (let i = 0; i < numTrees; i++) {
       // Using Fermat's spiral for organic distribution
       const angle = i * 137.5 * (Math.PI / 180);
       const radius = 2 + Math.sqrt(i) * 1.5;
       const x = radius * Math.cos(angle);
       const z = radius * Math.sin(angle);
       
       // Calculate tree level (older trees get bigger and more fruitful)
       const treeAge = numTrees - i; 
       const level = Math.min(10, Math.floor(treeAge / 3) + 1);
       
       // Smooth scaling effect based on XP remainder for the newest tree
       let scale = 0.8 + (level * 0.1);
       if (i === numTrees - 1) {
          const remainder = (totalXP % 50) / 50;
          scale *= (0.5 + remainder * 0.5); // Grows as user approaches next tree
       }

       elements.push({
           type: 'tree',
           id: `tree-${i}`,
           position: [x, 0, z],
           scale: [scale, scale, scale],
           seed: i * 100,
           level
       });
    }

    // Generate Flowers/Bushes
    for (let i = 0; i < numFlowers; i++) {
       const angle = pseudoRandom(i * 123) * Math.PI * 2;
       const radius = 1 + pseudoRandom(i * 321) * Math.min(15, 3 + Math.sqrt(numTrees) * 2);
       const x = radius * Math.cos(angle);
       const z = radius * Math.sin(angle);

       let scale = 1;
       if (i === numFlowers - 1) {
           const remainder = (totalXP % 10) / 10;
           scale = 0.2 + remainder * 0.8;
       }

       elements.push({
           type: 'flower',
           id: `flower-${i}`,
           position: [x, 0, z],
           scale: [scale, scale, scale],
           seed: i * 500,
           level: 1
       });
    }

    return elements;
  }, [totalXP]);

  return (
    <div className="w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative bg-sky-100 dark:bg-sky-900 transition-colors">
      
      {/* Overlay UI - Hadith and Title */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center z-10 p-6 md:p-8 mt-2">
        <h4 className="text-3xl md:text-5xl font-black mb-4 text-emerald-300 drop-shadow-md flex items-center justify-center gap-3">
          <Leaf className="w-8 h-8 md:w-12 md:h-12 text-emerald-400 animate-pulse" />
          بستان الجنة
        </h4>
        <p className="text-xs md:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-medium px-4 text-center">
          «ألَا أدُلُّكَ على غِراسٍ، هو خير مِنْ هذا؟ تقول: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر، يُغرس لك بكل كلمةٍ منها شجرةٌ في الجنة»
        </p>
      </div>

      <Canvas shadows camera={{ position: [0, 8, 15], fov: 45 }}>
        {/* Environment and Lighting */}
        <Sky sunPosition={[10, 20, -10]} turbidity={0.1} rayleigh={0.5} />
        <ambientLight intensity={0.4} />
        <directionalLight 
           castShadow 
           position={[10, 20, 10]} 
           intensity={1.2} 
           shadow-mapSize={[1024, 1024]}
           shadow-camera-left={-20}
           shadow-camera-right={20}
           shadow-camera-top={20}
           shadow-camera-bottom={-20}
        />
        
        {/* Soft shadow under everything */}
        <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.4} far={10} color="#064e3b" />
        
        {/* Clouds */}
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[0, 1]}>
           <Cloud position={[-10, 15, -10]} speed={0.2} opacity={0.5} segments={20} bounds={[10, 2, 2]} />
           <Cloud position={[10, 12, -15]} speed={0.2} opacity={0.4} segments={15} bounds={[5, 2, 2]} />
        </Float>

        {/* The Ground */}
        <Ground />
        <Grass seed={42} />

        {/* Generate Elements */}
        {gardenElements.map((el) => {
           if (el.type === 'tree') {
              return <Tree key={el.id} position={el.position} scale={el.scale} seed={el.seed} level={el.level} />;
           } else {
              return <Flower key={el.id} position={el.position} scale={el.scale} seed={el.seed} level={el.level} />;
           }
        })}

        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={30} 
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below ground
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl font-bold border border-white/10 pointer-events-auto">
             إجمالي الغراس: {gardenElements.length}
          </div>
          <div className="bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-xs flex items-center gap-2 pointer-events-auto">
             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
             يمكنك تدوير البستان بإصبعك
          </div>
      </div>
    </div>
  );
}
