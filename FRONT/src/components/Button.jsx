import React from 'react'

export function Button({ children, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-gray-500 hover:bg-gray-600'
  }

  return (
    <button 
      {...props} 
      className={`${variants[variant]} text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all active:scale-95`}
    >
      {children}
    </button>
  )
}
