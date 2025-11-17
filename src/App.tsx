import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'
import './App.css'

function App() {
  const [url, setUrl] = useState('https://example.com')
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQR = (size: number) => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    // Crear un canvas para convertir el SVG a PNG
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Obtener las dimensiones del SVG
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    
    // Crear un blob del SVG
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      // Configurar el tamaño del canvas
      canvas.width = size
      canvas.height = size

      // Dibujar fondo blanco
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar la imagen del QR
      ctx.drawImage(img, 0, 0, size, size)

      // Convertir canvas a PNG y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = 'qrcode.png'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
        }
      })

      URL.revokeObjectURL(url)
    }

    img.src = url
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div style={{ flex: 1 }}>
        <div className="container" style={{ marginTop: '40px', maxWidth: '600px' }}>
          <div className="card-panel white">
            <h4 className="center-align grey-text text-darken-2">QR Generator</h4>
            
            <div className="input-field">
              <i className="material-icons prefix">link</i>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <label htmlFor="url-input" className="active">Text or URL</label>
            </div>

            <div className="center-align" style={{ padding: '30px 0 20px' }}>
              <div ref={qrRef} style={{ display: 'inline-block', padding: '15px', backgroundColor: '#fff', border: '1px solid #e0e0e0' }}>
                <QRCode 
                  value={url} 
                  size={200}   // Preview is 200px
                  level="H"
                />
              </div>
            </div>

            <div className="center-align">
              <button
                onClick={() => downloadQR(1500)} // Download will be 1500px
                className="btn waves-effect waves-light blue"
              >
                <i className="material-icons left">file_download</i>
                Descargar PNG
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer style={{ 
        backgroundColor: '#263238', 
        color: '#b0bec5', 
        padding: '30px 20px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0', fontSize: '14px' }}>
          Made with ❤️ by <span style={{ color: '#ffffff', fontWeight: '500' }}>latra</span>
        </p>
        <p style={{ margin: '10px 0 0', fontSize: '13px' }}>
          <a 
            href="https://github.com/latra/simple-qr" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#64b5f6', 
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#90caf9'}
            onMouseOut={(e) => e.currentTarget.style.color = '#64b5f6'}
          >
            View source code
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
