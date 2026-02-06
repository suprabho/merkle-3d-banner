import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PreviewConfigurator from './components/PreviewConfigurator'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PreviewConfigurator />
    </StrictMode>
)
