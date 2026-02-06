import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import BackgroundGrid from './BackgroundGrid'
import GlassLogo from './GlassLogo'
import ParticleSystem from './Particles'

function getOffsetFromURL() {
    const params = new URLSearchParams(window.location.search)
    const offset = parseFloat(params.get('offsetX')) || 0
    return offset
}

export default function EmbedScene() {
    const offsetX = useMemo(() => getOffsetFromURL(), [])

    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 50]} fov={50} />
            <OrbitControls
                makeDefault
                enableZoom={false}
                enableRotate={false}
                enablePan={false}
                target={[offsetX, 0, 0]}
            />

            <color attach="background" args={['#ffffff']} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10 + offsetX, 20, 10]} intensity={200} angle={0.5} penumbra={1} castShadow />

            <Suspense fallback={null}>
                <group position={[offsetX, 0, 0]}>
                    <GlassLogo />
                    <BackgroundGrid />
                    <ParticleSystem count={4} />
                </group>

                {/* Environment for Glass Reflections */}
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    )
}
