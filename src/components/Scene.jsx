import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import BackgroundGrid from './BackgroundGrid'
import GlassLogo from './GlassLogo'
import ParticleSystem from './Particles'

export default function Scene() {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 50]} fov={50} />
            <OrbitControls makeDefault enableZoom={false} enableRotate={false} enablePan={false} target={[0, 0, 0]} />

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
