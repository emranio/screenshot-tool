import React, { useRef, useCallback } from 'react'

const SelectionCanvas = ({ 
  overlayData, 
  isSelecting, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp,
  drawOverlay 
}) => {
  const canvasRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    onMouseDown({ x, y })
  }, [onMouseDown])

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    onMouseMove({ x, y })
  }, [onMouseMove])

  React.useEffect(() => {
    if (overlayData?.screenshot && canvasRef.current) {
      drawOverlay(canvasRef.current, overlayData)
    }
  }, [overlayData, drawOverlay])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={onMouseUp}
      style={{ cursor: 'crosshair' }}
    />
  )
}

export default SelectionCanvas
