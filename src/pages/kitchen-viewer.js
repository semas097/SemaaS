import React, { useState, useEffect, useRef } from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const KitchenViewer = () => {
  const viewerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [renderProgress, setRenderProgress] = useState(0)

  // Simulated kitchen views - in production these would be actual renders
  const kitchenViews = [
    {
      name: "Main View",
      description: "Primary kitchen perspective with island and cabinets",
      angle: "Front-facing view",
      image: "/images/kitchen-main.jpg" // placeholder - would be render_4k.jpg
    },
    {
      name: "Island Focus",
      description: "Close-up of the oak island with concrete column",
      angle: "Close-up perspective",
      image: "/images/kitchen-island.jpg" // placeholder
    },
    {
      name: "Cabinet Details",
      description: "Detailed view of black handleless cabinets",
      angle: "Side perspective",
      image: "/images/kitchen-cabinets.jpg" // placeholder
    },
    {
      name: "Ceiling View",
      description: "Sloped oak ceiling with LED lighting",
      angle: "Upward perspective",
      image: "/images/kitchen-ceiling.jpg" // placeholder
    }
  ]

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false)
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const downloadRender = () => {
    // In production, this would download the actual render_4k.jpg
    const link = document.createElement('a')
    link.href = kitchenViews[currentView].image
    link.download = `kitchen-4k-view-${currentView + 1}.jpg`
    link.click()
  }

  if (isLoading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center'
        }}>
          <h1>Loading 4K Kitchen Render</h1>
          <div style={{
            width: '300px',
            height: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            overflow: 'hidden',
            margin: '20px 0'
          }}>
            <div style={{
              width: `${renderProgress}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p>{renderProgress}% - Preparing ultra-realistic kitchen visualization...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <h1 style={{ margin: 0 }}>4K Kitchen Visualizer</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={toggleFullscreen}
              style={{
                padding: '10px 20px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button 
              onClick={downloadRender}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Download 4K
            </button>
          </div>
        </div>

        {/* Main 4K Viewer */}
        <div 
          ref={viewerRef}
          style={{
            width: '100%',
            maxWidth: '100%',
            backgroundColor: '#000',
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '16/9'
          }}
        >
          <img 
            src={kitchenViews[currentView].image}
            alt={kitchenViews[currentView].description}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              e.target.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#2c3e50"/>
                  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="120" fill="#ecf0f1" text-anchor="middle" dy=".3em">
                    4K Kitchen Render
                  </text>
                  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="60" fill="#95a5a6" text-anchor="middle" dy=".3em">
                    3840 x 2160 pixels
                  </text>
                  <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="40" fill="#7f8c8d" text-anchor="middle" dy=".3em">
                    ${kitchenViews[currentView].name}
                  </text>
                </svg>
              `)}`
            }}
          />
          
          {/* View Controls Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '25px'
          }}>
            {kitchenViews.map((view, index) => (
              <button
                key={index}
                onClick={() => setCurrentView(index)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentView === index ? '#4CAF50' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              >
                {view.name}
              </button>
            ))}
          </div>

          {/* View Info */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            maxWidth: '300px'
          }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
              {kitchenViews[currentView].name}
            </h3>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px', opacity: 0.9 }}>
              {kitchenViews[currentView].description}
            </p>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
              {kitchenViews[currentView].angle}
            </p>
          </div>
        </div>

        {/* View Thumbnails */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '20px'
        }}>
          {kitchenViews.map((view, index) => (
            <div 
              key={index}
              onClick={() => setCurrentView(index)}
              style={{
                cursor: 'pointer',
                border: currentView === index ? '3px solid #4CAF50' : '3px solid transparent',
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                backgroundColor: '#f5f5f5'
              }}
            >
              <img 
                src={view.image}
                alt={view.name}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="200" height="120" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#34495e"/>
                      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#ecf0f1" text-anchor="middle" dy=".3em">
                        ${view.name}
                      </text>
                    </svg>
                  `)}`
                }}
              />
              <div style={{ padding: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                  {view.name}
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  {view.angle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specifications */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h2>Technical Specifications</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <h3>Render Quality</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Resolution: 3840 x 2160 (4K UHD)</li>
                <li>Format: JPEG, 95% quality</li>
                <li>Engine: Blender EEVEE/Cycles</li>
                <li>Samples: 128-256 (configurable)</li>
              </ul>
            </div>
            <div>
              <h3>Kitchen Features</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>Parametric design system</li>
                <li>Matte black handleless cabinets</li>
                <li>Warm oak countertops & backsplash</li>
                <li>Concrete structural column</li>
                <li>LED strip lighting</li>
              </ul>
            </div>
            <div>
              <h3>Compatibility</h3>
              <ul style={{ paddingLeft: '20px' }}>
                <li>All modern browsers</li>
                <li>Mobile & tablet responsive</li>
                <li>Fullscreen support</li>
                <li>Touch & mouse navigation</li>
                <li>Download 4K images</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '10px'
        }}>
          <h2>How to Generate Your Own Kitchen</h2>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Install Blender 4.x on your system</li>
            <li>Download <code>blender_generate_kitchen.py</code> and <code>render_config.json</code></li>
            <li>Place both files in the same folder</li>
            <li>Open terminal in that folder and run:</li>
            <pre style={{
              backgroundColor: '#2c3e50',
              color: '#ecf0f1',
              padding: '10px',
              borderRadius: '5px',
              margin: '10px 0',
              overflow: 'auto'
            }}>
              blender --background --python blender_generate_kitchen.py
            </pre>
            <li>Results: <code>render_4k.jpg</code> (3840x2160) + <code>scene.blend</code></li>
          </ol>
        </div>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="4K Kitchen Visualizer" />

export default KitchenViewer