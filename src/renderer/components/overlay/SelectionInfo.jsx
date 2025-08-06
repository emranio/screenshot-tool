import React from 'react'

const SelectionInfo = ({ selectionRect, currentMouse, mode = 'screenshot' }) => {
  if (selectionRect.width === 0 && selectionRect.height === 0) return null

  return (
    <div 
      className="absolute bg-black bg-opacity-80 text-white px-3 py-2 rounded-md text-sm pointer-events-none z-10 font-mono border border-gray-600"
      style={{
        left: Math.max(10, Math.min(currentMouse.x + 15, window.innerWidth - 200)),
        top: Math.max(10, currentMouse.y - 45)
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-blue-300">
          {mode === 'video' ? '📹' : '📷'}
        </span>
        <span className="text-white">
          {Math.round(selectionRect.width)} × {Math.round(selectionRect.height)}
        </span>
      </div>
      {mode === 'video' && (
        <div className="text-xs text-red-300 mt-1">
          Recording Area
        </div>
      )}
    </div>
  )
}

export default SelectionInfo
