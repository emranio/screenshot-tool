import React from 'react'

const Checkbox = ({ 
  label, 
  error, 
  helperText,
  id,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex items-start ${className}`}>
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
          error ? 'border-red-300' : ''
        }`}
        {...props}
      />
      <div className="ml-2 text-sm">
        {label && (
          <label htmlFor={id} className="text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    </div>
  )
}

export default Checkbox
