import React from  "react"

export const LabelVenda = ({ children, color = "slate" }) => {
  const colors = {
    slate: "text-slate-400",
    emerald: "text-emerald-600",
    orange: "text-orange-600",
    blue: "text-blue-600"
  }
  
  return (
    <span className={`${colors[color]} text-xs font-bold uppercase tracking-widest`}>
      {children}
    </span>
  )
}
export const SectionTitle = ({ children, step }) => (
  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
    {step && (
      <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
        {step}
      </span>
    )}
    {children}
  </h3>
)

export const BigValue = ({ children, color = "slate" }) => {
  const colors = {
    slate: "text-slate-800",
    emerald: "text-emerald-600",
    orange: "text-orange-700"
  }
  
  return (
    <h3 className={`text-3xl font-bold ${colors[color]} mt-2`}>
      {children}
    </h3>
  )
}

export const BadgeValue = ({ label, value, color = "emerald" }) => {
  const themes = {
    emerald: { bg: "bg-emerald-50/50", border: "border-emerald-100", text: "text-emerald-600" },
    blue: { bg: "bg-blue-50/50", border: "border-blue-100", text: "text-blue-600" },
    orange: { bg: "bg-orange-50/50", border: "border-orange-100", text: "text-orange-600" }
  }
  
  const theme = themes[color] || themes.emerald

  return (
    <div className="flex flex-col">
      <span className={`text-[10px] ${theme.text} font-bold uppercase tracking-tighter`}>
        {label}
      </span>
      <span className="text-sm font-mono font-bold">
        {value}
      </span>
    </div>
  )
}

export const BadgeContainer = ({ children, color = "emerald" }) => {
  const themes = {
    emerald: "bg-emerald-50/50 border-emerald-100",
    blue: "bg-blue-50/50 border-blue-100",
    orange: "bg-orange-50/50 border-orange-100"
  }
  
  return (
    <div className={`col-span-full grid grid-cols-2 md:grid-cols-6 gap-4 ${themes[color]} p-6 rounded-3xl border mt-4 text-center`}>
      {children}
    </div>
  )
}
