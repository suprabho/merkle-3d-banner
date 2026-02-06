import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EmbedScene from './components/EmbedScene'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div style={{ width: '100vw', height: '100vh' }}>
            <EmbedScene />
        </div>
    </StrictMode>
)
