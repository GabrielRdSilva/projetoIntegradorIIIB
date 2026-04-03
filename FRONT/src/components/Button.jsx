import React from  "react"

const Button = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-slate-800 hover:bg-slate-900 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  }
  
  return (
    <button 
      {...props} 
      className={`${variants[variant]} font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${props.className || ''}`}
    >
      {children}
    </button>
  )
}

// ADICIONE ESTA LINHA NO FINAL:
export default Button

