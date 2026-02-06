import { useLoader, useFrame, useThree } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { MeshTransmissionMaterial, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'

export default function GlassLogo({ url = '/MS-Logo.svg' }) {
    const groupRef = useRef()
    const svgData = useLoader(SVGLoader, url)
    const [hovered, setHovered] = useState(false)
    const targetRotation = useRef({ x: 0, y: 0 })
    const { viewport } = useThree()

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.z = Math.sin(state.clock.elapsedTime) * 1

            if (hovered) {
                const mouseX = (state.pointer.x * viewport.width) / 2
                const mouseY = (state.pointer.y * viewport.height) / 2
                targetRotation.current.x = mouseY * 0.05
                targetRotation.current.y = mouseX * 0.01
            } else {
                targetRotation.current.x = 0
                targetRotation.current.y = 0
            }

            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                Math.PI / 2 + targetRotation.current.x,
                0.1
            )
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetRotation.current.y,
                0.1
            )
        }
    })

    const shapes = useMemo(() => {
        return svgData.paths.flatMap((path) => {
            // SVGLoader returns an array of ShapePath, we need to convert to Shapes
            // We also need to handle colors if we want to retain them, but here we want Glass.
            return path.toShapes(true)
        })
    }, [svgData])

    return (
        <group
            ref={groupRef}
            rotation={[Math.PI / 2, 0, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Use Center to ensure it pivots correctly */}
            <Center>
                <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.05}> {/* Scale down SVG */}
                    <extrudeGeometry
                        args={[
                            shapes,
                            {
                                depth: 10,
                                bevelEnabled: true,
                                bevelThickness: 10,
                                bevelSize: 1,
                                bevelSegments: 20
                            }
                        ]}
                    />
                    <MeshTransmissionMaterial
                        backside
                        samples={16}
                        resolution={512}
                        transmission={1}
                        roughness={0.5} // Glossy
                        thickness={20} // High refraction
                        ior={1.5}
                        chromaticAberration={0.2}
                        anisotropy={0.1}
                        distortion={0.1}
                        distortionScale={0.1}
                        temporalDistortion={0.1}
                        color="#9090FF" // Slight blue tint
                    />
                </mesh>
            </Center>
        </group>
    )
}
