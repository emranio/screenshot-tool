import React from 'react'

const SelectionInfo = ({ selectionRect, currentMouse }) => {
  if (selectionRect.width === 0 && selectionRect.height === 0) return null

  return (
    <div 
      className="absolute bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm pointer-events-none"
      style={{
        left: Math.max(10, Math.min(currentMouse.x + 10, window.innerWidth - 200)),
        top: Math.max(10, currentMouse.y - 40)
      }}
    >
      {Math.round(selectionRect.width)} × {Math.round(selectionRect.height)}
    </div>
  )
}

export default SelectionInfo
