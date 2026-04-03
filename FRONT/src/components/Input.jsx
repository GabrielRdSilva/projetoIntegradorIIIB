import React from  "react"

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <input
      {...props}
      className={`border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:border-emerald-300 bg-slate-50/50 ${props.readOnly ? 'bg-slate-100 cursor-not-allowed' : ''}`}
    />
  </div>
)

// VERIFIQUE SE ESTA LINHA EXISTE NO FINAL:
export default Input

