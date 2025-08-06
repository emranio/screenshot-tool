import React from 'react'

const OverlayInstructions = ({ mode }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded pointer-events-none">
      <div className="text-center">
        <div className="text-sm font-medium">
          {mode === 'video' ? 'Select area to record' : 'Select area to capture'}
        </div>
        <div className="text-xs text-gray-300 mt-1">
          Drag to select • ESC to cancel
        </div>
      </div>
    </div>
  )
}

export default OverlayInstructions
