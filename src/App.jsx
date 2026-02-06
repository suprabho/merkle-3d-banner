import Scene from './components/Scene'

function App() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Scene />
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                color: 'white',
                fontFamily: 'sans-serif',
                pointerEvents: 'none'
            }}>
                <h1 style={{ margin: 0 }}>Merkle Science</h1>
                <p style={{ margin: 0, opacity: 0.7 }}>Glass & Grid Concept</p>
            </div>
        </div>
    )
}

export default App
