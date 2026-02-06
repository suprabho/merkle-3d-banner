import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

const GRID_SIZE = 1 // Match BackgroundGrid
const SPEED = 4
const BOUNDS = 50

// Cardinal directions (XY plane)
const DIRECTIONS = [
    new THREE.Vector3(1, 0, 0),  // right
    new THREE.Vector3(-1, 0, 0), // left
    new THREE.Vector3(0, 1, 0),  // up
    new THREE.Vector3(0, -1, 0), // down
]

// Turn left or right relative to current direction
function turnLeft(dir) {
    if (dir.x === 1) return new THREE.Vector3(0, 1, 0)   // right -> up
    if (dir.x === -1) return new THREE.Vector3(0, -1, 0) // left -> down
    if (dir.y === 1) return new THREE.Vector3(-1, 0, 0)  // up -> left
    return new THREE.Vector3(1, 0, 0)                     // down -> right
}

function turnRight(dir) {
    if (dir.x === 1) return new THREE.Vector3(0, -1, 0)  // right -> down
    if (dir.x === -1) return new THREE.Vector3(0, 1, 0)  // left -> up
    if (dir.y === 1) return new THREE.Vector3(1, 0, 0)   // up -> right
    return new THREE.Vector3(-1, 0, 0)                    // down -> left
}

// Generate a path with exactly 1 left turn and 1 right turn, reaching the edge
function generatePath(startPos) {
    const path = []
    let currentPos = startPos.clone()
    let currentDir = DIRECTIONS[Math.floor(Math.random() * 4)].clone()

    // Exactly 3 segments: initial -> turn -> turn -> exit screen
    // Randomly decide order: left then right, or right then left
    const firstTurn = Math.random() > 0.5 ? 'left' : 'right'
    const secondTurn = firstTurn === 'left' ? 'right' : 'left'

    // Segment 1: Go some distance before first turn
    const seg1Length = (5 + Math.floor(Math.random() * 10)) * GRID_SIZE
    let endPos = currentPos.clone().addScaledVector(currentDir, seg1Length)
    path.push({
        start: currentPos.clone(),
        end: endPos.clone(),
        direction: currentDir.clone()
    })
    currentPos = endPos

    // First turn
    currentDir = firstTurn === 'left' ? turnLeft(currentDir) : turnRight(currentDir)

    // Segment 2: Go some distance before second turn
    const seg2Length = (5 + Math.floor(Math.random() * 10)) * GRID_SIZE
    endPos = currentPos.clone().addScaledVector(currentDir, seg2Length)
    path.push({
        start: currentPos.clone(),
        end: endPos.clone(),
        direction: currentDir.clone()
    })
    currentPos = endPos

    // Second turn
    currentDir = secondTurn === 'left' ? turnLeft(currentDir) : turnRight(currentDir)

    // Segment 3: Go until off screen (use BOUNDS to ensure it exits)
    const seg3Length = BOUNDS * 2
    endPos = currentPos.clone().addScaledVector(currentDir, seg3Length)
    path.push({
        start: currentPos.clone(),
        end: endPos.clone(),
        direction: currentDir.clone()
    })

    return path
}

function Particle({ startPos, delay = 0 }) {
    const ref = useRef()
    const elapsedRef = useRef(0)
    const [started, setStarted] = useState(false)
    const [pathIndex, setPathIndex] = useState(0)
    const [path, setPath] = useState(() => generatePath(startPos))
    const [visible, setVisible] = useState(false)
    const [trailKey, setTrailKey] = useState(0) // Key to force Trail remount

    useFrame((state, delta) => {
        if (!ref.current) return

        // Handle delay before starting
        if (!started) {
            elapsedRef.current += delta
            if (elapsedRef.current >= delay) {
                setStarted(true)
                setVisible(true)
                ref.current.position.copy(path[0].start)
            }
            return
        }

        const currentSegment = path[pathIndex]
        if (!currentSegment) return

        // Move towards segment end
        ref.current.position.addScaledVector(currentSegment.direction, SPEED * delta)

        // Check if out of bounds - reset with new path
        if (Math.abs(ref.current.position.x) > BOUNDS || Math.abs(ref.current.position.y) > BOUNDS) {
            const newPath = generatePath(startPos)
            setPath(newPath)
            setPathIndex(0)
            setTrailKey(k => k + 1) // Force Trail to remount, clearing the trail
            ref.current.position.copy(newPath[0].start)
            return
        }

        // Check if we reached the end of current segment
        const distToEnd = ref.current.position.distanceTo(currentSegment.end)
        if (distToEnd < SPEED * delta * 2) {
            // Snap to end position
            ref.current.position.copy(currentSegment.end)

            // Move to next segment
            if (pathIndex < path.length - 1) {
                setPathIndex(pathIndex + 1)
            }
        }
    })

    return (
        <Trail
            key={trailKey}
            width={1}
            length={8}
            color={new THREE.Color('#0000FD')}
            attenuation={(t) => t}
        >
            <mesh ref={ref} position={startPos} visible={visible}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#0000FD" toneMapped={false} />
            </mesh>
        </Trail>
    )
}

export default function ParticleSystem({ count = 20 }) {
    // Create multiple particles with staggered delays
    const particles = useMemo(() => {
        return new Array(count).fill(0).map((_, i) => ({
            startPos: new THREE.Vector3(0, 0, 0),
            // Stagger delays: random between 0 and 3 seconds
            delay: Math.random() * 3
        }))
    }, [count])

    return (
        <group position={[0, 0, 0.1]}> {/* Slightly in front of grid (along Z) */}
            {particles.map((particle, i) => (
                <Particle
                    key={i}
                    startPos={particle.startPos}
                    delay={particle.delay}
                />
            ))}
        </group>
    )
}
