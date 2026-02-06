import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import BackgroundGrid from './BackgroundGrid'
import GlassLogo from './GlassLogo'
import ParticleSystem from './Particles'

function getParamsFromURL() {
    const params = new URLSearchParams(window.location.search)
    return {
        offsetX: parseFloat(params.get('offsetX')) || 0,
        offsetY: parseFloat(params.get('offsetY')) || 0,
        fov: parseFloat(params.get('fov')) || 50,
    }
}

export default function EmbedScene() {
    const { offsetX, offsetY, fov } = useMemo(() => getParamsFromURL(), [])

    return (
        <Canvas>
            {/* Move camera along x/y axis for true pan (not rotation) */}
            <PerspectiveCamera makeDefault position={[offsetX, offsetY, 50]} fov={fov} />
            <OrbitControls
                makeDefault
                enableZoom={false}
                enableRotate={false}
                enablePan={false}
                target={[offsetX, offsetY, 0]}
            />

            <color attach="background" args={['#ffffff']} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} intensity={200} angle={0.5} penumbra={1} castShadow />

            <Suspense fallback={null}>
                <group>
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
