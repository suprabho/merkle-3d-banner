import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useMemo, useEffect } from 'react'
import BackgroundGrid from './BackgroundGrid'
import GlassLogo from './GlassLogo'
import ParticleSystem from './Particles'

function getParamsFromURL() {
    const params = new URLSearchParams(window.location.search)
    const result = {
        offsetX: parseFloat(params.get('offsetX')) || 0,
        offsetY: parseFloat(params.get('offsetY')) || 0,
        fov: parseFloat(params.get('fov')) || 50,
        debug: params.get('debug') === 'true',
    }
    console.log('[EmbedScene] URL params:', window.location.search, '→', result)
    return result
}

export default function EmbedScene() {
    const { offsetX, offsetY, fov, debug } = useMemo(() => getParamsFromURL(), [])

    useEffect(() => {
        console.log('[EmbedScene] Mounted with offsetX:', offsetX, 'offsetY:', offsetY, 'fov:', fov)
    }, [offsetX, offsetY, fov])

    return (
        <>
            {debug && (
                <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    zIndex: 1000,
                }}>
                    X: {offsetX} | Y: {offsetY} | FOV: {fov}
                </div>
            )}
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
        </>
    )
}
