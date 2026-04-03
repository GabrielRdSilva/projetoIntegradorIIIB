import React from  "react"

const Card = ({ children, title, className = "" }) => (
  <div className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 ${className}`}>
    {title && <h2 className="text-xl font-bold text-slate-800 border-b pb-4 mb-6">{title}</h2>}
    {children}
  </div>
)

// ESTA É A LINHA QUE ESTÁ FALTANDO:
export default Card
