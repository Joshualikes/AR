import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Cone, Cylinder, Box } from "@react-three/drei";
import { GrowthStage } from "@/types/plant";
import * as THREE from "three";

interface Plant3DProps {
  stage: GrowthStage;
  plantType: string;
  autoRotate?: boolean;
  scale?: number;
  rotation?: number;
}

export const Plant3D = ({ stage, plantType, autoRotate = true, scale = 1, rotation = 0 }: Plant3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.3;
      } else {
        groupRef.current.rotation.y = rotation;
      }
    }
  });

  // Pechay (Chinese Cabbage) - Broad leafy structure, light green
  const renderPechay = () => {
    switch (stage) {
      case "seed":
        return (
          <group>
            <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#8B7355" roughness={0.8} />
            </Sphere>
          </group>
        );

      case "sprout":
        return (
          <group>
            <Sphere args={[0.12, 16, 16]} position={[0, -0.1, 0]}>
              <meshStandardMaterial color="#8B7355" roughness={0.8} />
            </Sphere>
            <Cylinder args={[0.02, 0.02, 0.25, 8]} position={[0, 0.12, 0]}>
              <meshStandardMaterial color="#C8E6C9" />
            </Cylinder>
            <Box args={[0.15, 0.08, 0.02]} position={[-0.08, 0.25, 0]} rotation={[0, 0, Math.PI / 6]}>
              <meshStandardMaterial color="#A5D6A7" />
            </Box>
            <Box args={[0.15, 0.08, 0.02]} position={[0.08, 0.25, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <meshStandardMaterial color="#A5D6A7" />
            </Box>
          </group>
        );

      case "small":
        return (
          <group>
            <Cylinder args={[0.05, 0.06, 0.15, 8]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#E8F5E9" />
            </Cylinder>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Box 
                key={i}
                args={[0.25, 0.12, 0.02]} 
                position={[
                  Math.cos((i * Math.PI) / 3) * 0.15,
                  0.15,
                  Math.sin((i * Math.PI) / 3) * 0.15
                ]}
                rotation={[Math.PI / 6, (i * Math.PI) / 3, 0]}
              >
                <meshStandardMaterial color="#A5D6A7" />
              </Box>
            ))}
          </group>
        );

      case "growing":
        return (
          <group>
            <Cylinder args={[0.08, 0.1, 0.25, 8]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#F1F8E9" />
            </Cylinder>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Box 
                key={i}
                args={[0.35, 0.18, 0.03]} 
                position={[
                  Math.cos((i * Math.PI) / 4) * 0.22,
                  0.2,
                  Math.sin((i * Math.PI) / 4) * 0.22
                ]}
                rotation={[Math.PI / 4, (i * Math.PI) / 4, 0]}
              >
                <meshStandardMaterial color="#81C784" />
              </Box>
            ))}
          </group>
        );

      case "mature":
        return (
          <group>
            <Cylinder args={[0.1, 0.12, 0.3, 8]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#F9FBE7" />
            </Cylinder>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Box 
                key={i}
                args={[0.45, 0.22, 0.04]} 
                position={[
                  Math.cos((i * Math.PI) / 5) * 0.28,
                  0.25,
                  Math.sin((i * Math.PI) / 5) * 0.28
                ]}
                rotation={[Math.PI / 3, (i * Math.PI) / 5, 0]}
              >
                <meshStandardMaterial color="#66BB6A" />
              </Box>
            ))}
          </group>
        );
    }
  };

  // Kamatis (Tomato) - Vining plant with red fruits
  const renderKamatis = () => {
    switch (stage) {
      case "seed":
        return (
          <group>
            <Sphere args={[0.12, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#A0522D" roughness={0.9} />
            </Sphere>
          </group>
        );

      case "sprout":
        return (
          <group>
            <Cylinder args={[0.02, 0.03, 0.3, 8]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#7CB342" />
            </Cylinder>
            <Cone args={[0.08, 0.12, 8]} position={[0, 0.32, 0]}>
              <meshStandardMaterial color="#8BC34A" />
            </Cone>
          </group>
        );

      case "small":
        return (
          <group>
            <Cylinder args={[0.03, 0.04, 0.5, 8]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color="#689F38" />
            </Cylinder>
            {[0.2, 0.35, 0.5].map((height, i) => (
              <group key={i} position={[0, height, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
                <Cone args={[0.15, 0.2, 6]} position={[0.12, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                  <meshStandardMaterial color="#7CB342" />
                </Cone>
              </group>
            ))}
          </group>
        );

      case "growing":
        return (
          <group>
            <Cylinder args={[0.04, 0.05, 0.8, 8]} position={[0, 0.4, 0]}>
              <meshStandardMaterial color="#689F38" />
            </Cylinder>
            {[0.3, 0.5, 0.7].map((height, i) => (
              <group key={i} position={[0, height, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
                <Cone args={[0.18, 0.24, 6]} position={[0.15, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                  <meshStandardMaterial color="#7CB342" />
                </Cone>
                <Sphere args={[0.08, 16, 16]} position={[0.1, -0.1, 0]}>
                  <meshStandardMaterial color="#9CCC65" />
                </Sphere>
              </group>
            ))}
          </group>
        );

      case "mature":
        return (
          <group>
            <Cylinder args={[0.05, 0.06, 1, 8]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#558B2F" />
            </Cylinder>
            {[0.3, 0.5, 0.7, 0.9].map((height, i) => (
              <group key={i} position={[0, height, 0]} rotation={[0, (i * Math.PI * 2) / 4, 0]}>
                <Cone args={[0.2, 0.28, 6]} position={[0.18, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                  <meshStandardMaterial color="#689F38" />
                </Cone>
                <Sphere args={[0.12, 16, 16]} position={[0.12, -0.15, 0]}>
                  <meshStandardMaterial color="#D32F2F" emissive="#D32F2F" emissiveIntensity={0.2} />
                </Sphere>
                <Sphere args={[0.1, 16, 16]} position={[0.15, -0.3, 0.05]}>
                  <meshStandardMaterial color="#E53935" emissive="#E53935" emissiveIntensity={0.2} />
                </Sphere>
              </group>
            ))}
          </group>
        );
    }
  };

  // Okra - Tall, slender with elongated pods
  const renderOkra = () => {
    switch (stage) {
      case "seed":
        return (
          <group>
            <Sphere args={[0.13, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#654321" roughness={0.85} />
            </Sphere>
          </group>
        );

      case "sprout":
        return (
          <group>
            <Cylinder args={[0.025, 0.025, 0.35, 8]} position={[0, 0.175, 0]}>
              <meshStandardMaterial color="#7CB342" />
            </Cylinder>
            <Cone args={[0.09, 0.15, 8]} position={[0, 0.37, 0]}>
              <meshStandardMaterial color="#8BC34A" />
            </Cone>
          </group>
        );

      case "small":
        return (
          <group>
            <Cylinder args={[0.035, 0.045, 0.6, 8]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#558B2F" />
            </Cylinder>
            {[0.25, 0.45].map((height, i) => (
              <group key={i} position={[0, height, 0]} rotation={[0, (i * Math.PI), 0]}>
                <Cone args={[0.16, 0.22, 5]} position={[0.12, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                  <meshStandardMaterial color="#689F38" />
                </Cone>
              </group>
            ))}
          </group>
        );

      case "growing":
        return (
          <group>
            <Cylinder args={[0.045, 0.055, 0.9, 8]} position={[0, 0.45, 0]}>
              <meshStandardMaterial color="#558B2F" />
            </Cylinder>
            {[0.3, 0.5, 0.7].map((height, i) => (
              <group key={i} position={[0, height, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
                <Cone args={[0.18, 0.25, 5]} position={[0.14, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                  <meshStandardMaterial color="#689F38" />
                </Cone>
                <Cylinder args={[0.04, 0.03, 0.15, 6]} position={[0.1, -0.12, 0]} rotation={[Math.PI / 6, 0, 0]}>
                  <meshStandardMaterial color="#7CB342" />
                </Cylinder>
              </group>
            ))}
          </group>
        );

      case "mature":
        return (
          <group>
            <Cylinder args={[0.05, 0.06, 1.2, 8]} position={[0, 0.6, 0]}>
              <meshStandardMaterial color="#33691E" />
            </Cylinder>
            {[0.4, 0.6, 0.8, 1.0].map((height, i) => (
              <group key={i} position={[0, height, 0]} rotation={[0, (i * Math.PI * 2) / 4, 0]}>
                <Cone args={[0.2, 0.28, 5]} position={[0.16, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                  <meshStandardMaterial color="#558B2F" />
                </Cone>
                <Cylinder args={[0.05, 0.04, 0.25, 6]} position={[0.12, -0.15, 0]} rotation={[Math.PI / 4, 0, 0]}>
                  <meshStandardMaterial color="#558B2F" />
                </Cylinder>
                <Cylinder args={[0.045, 0.035, 0.22, 6]} position={[0.14, -0.3, 0.05]} rotation={[Math.PI / 5, 0, 0]}>
                  <meshStandardMaterial color="#689F38" />
                </Cylinder>
              </group>
            ))}
          </group>
        );
    }
  };

  // Basil - Bushy with small aromatic leaves
  const renderBasil = () => {
    switch (stage) {
      case "seed":
        return (
          <group>
            <Sphere args={[0.1, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#2C1810" roughness={0.9} />
            </Sphere>
          </group>
        );

      case "sprout":
        return (
          <group>
            <Cylinder args={[0.02, 0.02, 0.25, 8]} position={[0, 0.125, 0]}>
              <meshStandardMaterial color="#558B2F" />
            </Cylinder>
            <Box args={[0.1, 0.06, 0.01]} position={[-0.05, 0.25, 0]} rotation={[0, 0, Math.PI / 8]}>
              <meshStandardMaterial color="#66BB6A" />
            </Box>
            <Box args={[0.1, 0.06, 0.01]} position={[0.05, 0.25, 0]} rotation={[0, 0, -Math.PI / 8]}>
              <meshStandardMaterial color="#66BB6A" />
            </Box>
          </group>
        );

      case "small":
        return (
          <group>
            <Cylinder args={[0.025, 0.03, 0.4, 8]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color="#558B2F" />
            </Cylinder>
            {[0.15, 0.28, 0.4].map((height, i) => (
              <group key={i} position={[0, height, 0]} rotation={[0, (i * Math.PI) / 2, 0]}>
                <Box args={[0.12, 0.08, 0.01]} position={[-0.08, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
                  <meshStandardMaterial color="#4CAF50" />
                </Box>
                <Box args={[0.12, 0.08, 0.01]} position={[0.08, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
                  <meshStandardMaterial color="#4CAF50" />
                </Box>
              </group>
            ))}
          </group>
        );

      case "growing":
        return (
          <group>
            <Cylinder args={[0.03, 0.04, 0.6, 8]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#388E3C" />
            </Cylinder>
            {[0.2, 0.35, 0.5].map((height, i) => (
              <group key={i}>
                {[0, 1, 2, 3].map((j) => (
                  <Box 
                    key={`${i}-${j}`}
                    args={[0.14, 0.1, 0.01]} 
                    position={[
                      Math.cos((j * Math.PI) / 2) * 0.1,
                      height,
                      Math.sin((j * Math.PI) / 2) * 0.1
                    ]}
                    rotation={[0, (j * Math.PI) / 2, Math.PI / 6]}
                  >
                    <meshStandardMaterial color="#43A047" />
                  </Box>
                ))}
              </group>
            ))}
          </group>
        );

      case "mature":
        return (
          <group>
            <Cylinder args={[0.04, 0.05, 0.7, 8]} position={[0, 0.35, 0]}>
              <meshStandardMaterial color="#2E7D32" />
            </Cylinder>
            {[0.2, 0.35, 0.5, 0.65].map((height, i) => (
              <group key={i}>
                {[0, 1, 2, 3, 4, 5].map((j) => (
                  <Box 
                    key={`${i}-${j}`}
                    args={[0.16, 0.12, 0.01]} 
                    position={[
                      Math.cos((j * Math.PI) / 3) * 0.12,
                      height,
                      Math.sin((j * Math.PI) / 3) * 0.12
                    ]}
                    rotation={[0, (j * Math.PI) / 3, Math.PI / 5]}
                  >
                    <meshStandardMaterial color="#388E3C" />
                  </Box>
                ))}
              </group>
            ))}
            {[0, 1, 2].map((i) => (
              <Sphere key={i} args={[0.03, 8, 8]} position={[
                Math.cos((i * Math.PI * 2) / 3) * 0.08,
                0.75,
                Math.sin((i * Math.PI * 2) / 3) * 0.08
              ]}>
                <meshStandardMaterial color="#9C27B0" emissive="#9C27B0" emissiveIntensity={0.3} />
              </Sphere>
            ))}
          </group>
        );
    }
  };

  // Lettuce - Low rosette of leaves, light green
  const renderLettuce = () => {
    switch (stage) {
      case "seed":
        return (
          <group>
            <Sphere args={[0.08, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#5D4E37" roughness={0.9} />
            </Sphere>
          </group>
        );

      case "sprout":
        return (
          <group>
            <Cylinder args={[0.015, 0.02, 0.15, 8]} position={[0, 0.075, 0]}>
              <meshStandardMaterial color="#C5E1A5" />
            </Cylinder>
            <Box args={[0.12, 0.07, 0.01]} position={[-0.06, 0.15, 0]} rotation={[0, 0, Math.PI / 8]}>
              <meshStandardMaterial color="#DCEDC8" />
            </Box>
            <Box args={[0.12, 0.07, 0.01]} position={[0.06, 0.15, 0]} rotation={[0, 0, -Math.PI / 8]}>
              <meshStandardMaterial color="#DCEDC8" />
            </Box>
          </group>
        );

      case "small":
        return (
          <group>
            <Cylinder args={[0.04, 0.05, 0.1, 8]} position={[0, 0.05, 0]}>
              <meshStandardMaterial color="#F1F8E9" />
            </Cylinder>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Box 
                key={i}
                args={[0.2, 0.12, 0.02]} 
                position={[
                  Math.cos((i * Math.PI) / 3) * 0.12,
                  0.12,
                  Math.sin((i * Math.PI) / 3) * 0.12
                ]}
                rotation={[Math.PI / 6, (i * Math.PI) / 3, 0]}
              >
                <meshStandardMaterial color="#C5E1A5" />
              </Box>
            ))}
          </group>
        );

      case "growing":
        return (
          <group>
            <Cylinder args={[0.06, 0.07, 0.15, 8]} position={[0, 0.075, 0]}>
              <meshStandardMaterial color="#F9FBE7" />
            </Cylinder>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Box 
                key={i}
                args={[0.28, 0.16, 0.02]} 
                position={[
                  Math.cos((i * Math.PI) / 4) * 0.18,
                  0.15,
                  Math.sin((i * Math.PI) / 4) * 0.18
                ]}
                rotation={[Math.PI / 4, (i * Math.PI) / 4, 0]}
              >
                <meshStandardMaterial color="#AED581" />
              </Box>
            ))}
          </group>
        );

      case "mature":
        return (
          <group>
            <Cylinder args={[0.08, 0.09, 0.2, 8]} position={[0, 0.1, 0]}>
              <meshStandardMaterial color="#FFFDE7" />
            </Cylinder>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Box 
                key={i}
                args={[0.35, 0.2, 0.03]} 
                position={[
                  Math.cos((i * Math.PI) / 5) * 0.22,
                  0.2,
                  Math.sin((i * Math.PI) / 5) * 0.22
                ]}
                rotation={[Math.PI / 3.5, (i * Math.PI) / 5, 0]}
              >
                <meshStandardMaterial color="#9CCC65" />
              </Box>
            ))}
          </group>
        );
    }
  };

  const renderPlantByType = () => {
    switch (plantType.toLowerCase()) {
      case 'pechay':
        return renderPechay();
      case 'kamatis':
      case 'tomato':
        return renderKamatis();
      case 'okra':
        return renderOkra();
      case 'basil':
        return renderBasil();
      case 'lettuce':
        return renderLettuce();
      default:
        return renderPechay();
    }
  };

  return (
    <group ref={groupRef} scale={scale}>
      {renderPlantByType()}
    </group>
  );
};
