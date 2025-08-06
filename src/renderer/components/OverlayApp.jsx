import React, { useState, useEffect, useRef, useCallback } from 'react'

const OverlayApp = () => {
  const [overlayData, setOverlayData] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })
  const [currentMouse, setCurrentMouse] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (window.overlayAPI) {
      window.overlayAPI.onInitializeOverlay((event, data) => {
        setOverlayData(data)
      })
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (window.overlayAPI) {
        window.overlayAPI.removeAllListeners('initialize-overlay')
      }
    }
  }, [])

  useEffect(() => {
    if (overlayData?.screenshot && canvasRef.current) {
      drawScreenshot()
    }
  }, [overlayData])

  const drawScreenshot = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (overlayData?.display) {
      canvas.width = overlayData.display.bounds.width
      canvas.height = overlayData.display.bounds.height
    }

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      drawOverlay()
    }
    img.src = `data:image/png;base64,${overlayData.screenshot}`
  }

  const drawOverlay = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!canvas || !ctx) return

    // Clear previous overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Redraw the screenshot
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      
      // Draw semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Clear selection area to show original image
      if (isSelecting || (selectionStart.x !== selectionEnd.x && selectionStart.y !== selectionEnd.y)) {
        const rect = getSelectionRect()
        ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
        ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, rect.x, rect.y, rect.width, rect.height)
        
        // Draw selection border
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
        
        // Draw corner handles
        drawCornerHandles(ctx, rect)
      }
    }
    img.src = `data:image/png;base64,${overlayData.screenshot}`
  }

  const drawCornerHandles = (ctx, rect) => {
    const handleSize = 8
    const handles = [
      { x: rect.x - handleSize/2, y: rect.y - handleSize/2 }, // top-left
      { x: rect.x + rect.width - handleSize/2, y: rect.y - handleSize/2 }, // top-right
      { x: rect.x - handleSize/2, y: rect.y + rect.height - handleSize/2 }, // bottom-left
      { x: rect.x + rect.width - handleSize/2, y: rect.y + rect.height - handleSize/2 } // bottom-right
    ]

    ctx.fillStyle = '#3b82f6'
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize)
    })
  }

  const getSelectionRect = () => {
    const x = Math.min(selectionStart.x, selectionEnd.x)
    const y = Math.min(selectionStart.y, selectionEnd.y)
    const width = Math.abs(selectionEnd.x - selectionStart.x)
    const height = Math.abs(selectionEnd.y - selectionStart.y)
    
    return { x, y, width, height }
  }

  const handleMouseDown = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsSelecting(true)
    setSelectionStart({ x, y })
    setSelectionEnd({ x, y })
  }, [])

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setCurrentMouse({ x, y })
    
    if (isSelecting) {
      setSelectionEnd({ x, y })
      drawOverlay()
    }
  }, [isSelecting])

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false)
      
      const rect = getSelectionRect()
      if (rect.width > 10 && rect.height > 10) {
        // Valid selection
        handleSelectionComplete(rect)
      }
    }
  }, [isSelecting, selectionStart, selectionEnd])

  const handleSelectionComplete = async (bounds) => {
    if (window.overlayAPI) {
      await window.overlayAPI.selectionComplete({
        screenshot: overlayData.screenshot,
        bounds,
        mode: overlayData.mode
      })
    }
  }

  const handleCancel = () => {
    if (window.overlayAPI) {
      window.overlayAPI.cancel()
    }
  }

  if (!overlayData) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  const selectionRect = getSelectionRect()

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 w-full h-full"
      style={{ cursor: 'crosshair' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      
      {/* Selection Info */}
      {(isSelecting || selectionRect.width > 0) && (
        <div 
          className="absolute bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm pointer-events-none"
          style={{
            left: Math.max(10, Math.min(currentMouse.x + 10, window.innerWidth - 200)),
            top: Math.max(10, currentMouse.y - 40)
          }}
        >
          {Math.round(selectionRect.width)} × {Math.round(selectionRect.height)}
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded pointer-events-none">
        <div className="text-center">
          <div className="text-sm font-medium">
            {overlayData.mode === 'video' ? 'Select area to record' : 'Select area to capture'}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Drag to select • ESC to cancel
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverlayApp
