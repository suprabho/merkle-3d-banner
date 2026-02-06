import { useState } from 'react'

const PRESETS = [
  { name: 'Mobile S', width: 375, offsetX: 0, offsetY: 0, fov: 50 },
  { name: 'Mobile L', width: 479, offsetX: 0, offsetY: 0, fov: 50 },
  { name: 'Tablet', width: 767, offsetX: 0, offsetY: 0, fov: 50 },
  { name: 'Laptop', width: 991, offsetX: 0, offsetY: 0, fov: 50 },
  { name: 'Desktop', width: 1200, offsetX: 0, offsetY: 0, fov: 50 },
  { name: 'Large', width: 1920, offsetX: 0, offsetY: 0, fov: 50 },
]

export default function PreviewConfigurator() {
  const [baseUrl, setBaseUrl] = useState(window.location.origin)
  const [previewWidth, setPreviewWidth] = useState(1200)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [fov, setFov] = useState(50)
  const [breakpointConfigs, setBreakpointConfigs] = useState([
    { name: 'Mobile S', maxWidth: 479, offsetX: 0, offsetY: 0, fov: 50 },
    { name: 'Mobile L', maxWidth: 767, offsetX: 0, offsetY: 0, fov: 50 },
    { name: 'Tablet', maxWidth: 991, offsetX: 0, offsetY: 0, fov: 50 },
    { name: 'Laptop', maxWidth: 1439, offsetX: 0, offsetY: 0, fov: 50 },
    { name: 'Desktop', maxWidth: 1919, offsetX: 0, offsetY: 0, fov: 50 },
    { name: 'Large', maxWidth: 9999, offsetX: 0, offsetY: 0, fov: 50 },
  ])
  const [copied, setCopied] = useState(false)

  const embedUrl = `${baseUrl}/embed.html?offsetX=${offsetX}&offsetY=${offsetY}&fov=${fov}`

  const updateBreakpointConfig = (index, field, value) => {
    const updated = [...breakpointConfigs]
    updated[index][field] = value
    setBreakpointConfigs(updated)
  }

  const generateEmbedCode = () => {
    const bpConfig = JSON.stringify(
      breakpointConfigs.map(bp => ({
        maxWidth: bp.maxWidth,
        offsetX: bp.offsetX,
        offsetY: bp.offsetY,
        fov: bp.fov
      }))
    )

    return `<div style="width: 100%; height: 400px;">
  <iframe id="glass-logo-embed" style="width: 100%; height: 100%; border: none;" loading="lazy"></iframe>
</div>
<script>
(function() {
  var BASE_URL = '${baseUrl}/embed.html';
  var breakpoints = ${bpConfig};
  function getConfig(w) {
    for (var i = 0; i < breakpoints.length; i++) {
      if (w <= breakpoints[i].maxWidth) return breakpoints[i];
    }
    return { offsetX: 0, offsetY: 0, fov: 50 };
  }
  function update() {
    var cfg = getConfig(window.innerWidth);
    document.getElementById('glass-logo-embed').src = BASE_URL + '?offsetX=' + cfg.offsetX + '&offsetY=' + cfg.offsetY + '&fov=' + cfg.fov;
  }
  update();
  var t;
  window.addEventListener('resize', function() {
    clearTimeout(t);
    t = setTimeout(update, 250);
  });
})();
<\/script>`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.title}>Embed Configurator</h2>

        {/* Base URL */}
        <div style={styles.section}>
          <label style={styles.label}>Base URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            style={styles.input}
            placeholder="https://your-domain.com"
          />
        </div>

        {/* Preview Controls */}
        <div style={styles.section}>
          <label style={styles.label}>Preview Width: {previewWidth}px</label>
          <input
            type="range"
            min="320"
            max="2560"
            value={previewWidth}
            onChange={(e) => setPreviewWidth(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.presetButtons}>
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setPreviewWidth(preset.width)
                  setOffsetX(preset.offsetX)
                  setOffsetY(preset.offsetY)
                  setFov(preset.fov)
                }}
                style={{
                  ...styles.presetButton,
                  background: previewWidth === preset.width ? '#4a90d9' : '#3a3a3a',
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* X Offset Control */}
        <div style={styles.section}>
          <label style={styles.label}>X Offset: {offsetX}</label>
          <div style={styles.sliderRow}>
            <input
              type="range"
              min="-30"
              max="30"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              style={styles.sliderFlex}
            />
            <input
              type="number"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              style={styles.numberInput}
            />
          </div>
        </div>

        {/* Y Offset Control */}
        <div style={styles.section}>
          <label style={styles.label}>Y Offset: {offsetY}</label>
          <div style={styles.sliderRow}>
            <input
              type="range"
              min="-30"
              max="30"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              style={styles.sliderFlex}
            />
            <input
              type="number"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              style={styles.numberInput}
            />
          </div>
        </div>

        {/* FOV Control */}
        <div style={styles.section}>
          <label style={styles.label}>FOV: {fov}°</label>
          <div style={styles.sliderRow}>
            <input
              type="range"
              min="20"
              max="120"
              value={fov}
              onChange={(e) => setFov(Number(e.target.value))}
              style={styles.sliderFlex}
            />
            <input
              type="number"
              value={fov}
              onChange={(e) => setFov(Number(e.target.value))}
              style={styles.numberInput}
            />
          </div>
        </div>

        {/* Breakpoint Configs */}
        <div style={styles.section}>
          <label style={styles.label}>Breakpoint Settings</label>
          {breakpointConfigs.map((bp, index) => {
            const minWidth = index === 0 ? 0 : breakpointConfigs[index - 1].maxWidth + 1
            const rangeLabel = bp.maxWidth >= 9999 ? `${minWidth}px+` : `${minWidth}-${bp.maxWidth}px`
            return (
              <div key={bp.name} style={styles.breakpointCard}>
                <div style={styles.breakpointHeader}>
                  <span style={styles.breakpointName}>{bp.name}</span>
                  <span style={styles.breakpointWidth}>{rangeLabel}</span>
                </div>
                <div style={styles.breakpointInputs}>
                  <div style={styles.inputGroup}>
                    <span style={styles.inputLabel}>X</span>
                    <input
                      type="number"
                      value={bp.offsetX}
                      onChange={(e) => updateBreakpointConfig(index, 'offsetX', Number(e.target.value))}
                      style={styles.smallInput}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <span style={styles.inputLabel}>Y</span>
                    <input
                      type="number"
                      value={bp.offsetY}
                      onChange={(e) => updateBreakpointConfig(index, 'offsetY', Number(e.target.value))}
                      style={styles.smallInput}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <span style={styles.inputLabel}>FOV</span>
                    <input
                      type="number"
                      value={bp.fov}
                      onChange={(e) => updateBreakpointConfig(index, 'fov', Number(e.target.value))}
                      style={styles.smallInput}
                    />
                  </div>
                </div>
                <div style={styles.breakpointActions}>
                  <button
                    onClick={() => {
                      setPreviewWidth(Math.floor((minWidth + bp.maxWidth) / 2))
                      setOffsetX(bp.offsetX)
                      setOffsetY(bp.offsetY)
                      setFov(bp.fov)
                    }}
                    style={styles.actionButton}
                    title="Preview this breakpoint"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      updateBreakpointConfig(index, 'offsetX', offsetX)
                      updateBreakpointConfig(index, 'offsetY', offsetY)
                      updateBreakpointConfig(index, 'fov', fov)
                    }}
                    style={{ ...styles.actionButton, background: '#4a90d9' }}
                    title="Save current values to this breakpoint"
                  >
                    Set from current
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Generate Button */}
        <button onClick={copyToClipboard} style={styles.generateButton}>
          {copied ? 'Copied!' : 'Copy Embed Code'}
        </button>

        {/* Generated Code Preview */}
        <div style={styles.section}>
          <label style={styles.label}>Generated Embed Code</label>
          <pre style={styles.codePreview}>{generateEmbedCode()}</pre>
        </div>
      </div>

      {/* Preview Area */}
      <div style={styles.previewArea}>
        <div style={styles.previewHeader}>
          Preview ({previewWidth}px × 100%)
        </div>
        <div style={styles.previewWrapper}>
          <div
            style={{
              width: `${previewWidth}px`,
              height: '100%',
              margin: '0 auto',
              background: '#fff',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            }}
          >
            <iframe
              src={embedUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: '#1a1a1a',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  sidebar: {
    width: '380px',
    padding: '20px',
    background: '#252525',
    overflowY: 'auto',
    borderRight: '1px solid #333',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: '600',
  },
  section: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    background: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  slider: {
    width: '100%',
    marginBottom: '8px',
  },
  sliderRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  sliderFlex: {
    flex: 1,
  },
  numberInput: {
    width: '70px',
    padding: '6px 8px',
    background: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '14px',
  },
  presetButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  presetButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '12px',
  },
  breakpointCard: {
    marginBottom: '10px',
    padding: '10px',
    background: '#2a2a2a',
    borderRadius: '6px',
  },
  breakpointHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  breakpointName: {
    flex: '1',
    fontSize: '13px',
    fontWeight: '500',
  },
  breakpointWidth: {
    fontSize: '11px',
    color: '#888',
  },
  breakpointInputs: {
    display: 'flex',
    gap: '8px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  inputLabel: {
    fontSize: '11px',
    color: '#888',
    minWidth: '24px',
  },
  smallInput: {
    width: '50px',
    padding: '4px 6px',
    background: '#333',
    border: '1px solid #444',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '12px',
  },
  breakpointActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  actionButton: {
    flex: 1,
    padding: '6px 8px',
    background: '#3a3a3a',
    border: 'none',
    borderRadius: '3px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '11px',
  },
  generateButton: {
    width: '100%',
    padding: '12px',
    background: '#4a90d9',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  codePreview: {
    background: '#1a1a1a',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '11px',
    overflow: 'auto',
    maxHeight: '200px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  previewArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#2a2a2a',
  },
  previewHeader: {
    padding: '12px 20px',
    background: '#333',
    fontSize: '13px',
    color: '#aaa',
    borderBottom: '1px solid #444',
  },
  previewWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
  },
}
