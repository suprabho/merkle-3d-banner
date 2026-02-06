import { Grid } from '@react-three/drei'

export default function BackgroundGrid() {
    return (
        <Grid
            position={[0, 0, -5]}
            rotation={[Math.PI / 2, 0, 0]} // XY plane (vertical, facing camera)
            args={[100, 100]} // Grid size
            cellSize={1}
            cellThickness={0.5}
            cellColor="#cccccc"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#EEF2FF"
            fadeDistance={50}
            infiniteGrid
        />
    )
}
