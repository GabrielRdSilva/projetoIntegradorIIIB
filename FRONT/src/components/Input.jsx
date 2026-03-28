import React from 'react'

export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700 font-bold">{label}</label>
      <input 
        {...props} 
        className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none transition-all border-gray-300 hover:border-green-400" 
      />
    </div>
  )
}

