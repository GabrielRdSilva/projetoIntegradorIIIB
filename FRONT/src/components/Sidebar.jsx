import React from "react";

const Sidebar = ({ setTelaAtiva, telaAtiva }) => { 
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'produto', label: 'Produtos', icon: '📦' },
    { id: 'venda', label: 'Vendas', icon: '💰' },
    { id: 'cliente', label: 'Clientes', icon: '👥' },
    { id: 'cobranca', label: 'Cobrança', icon: '💸' }, 
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-bold text-slate-800">SalesCRM</span>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTelaAtiva(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 font-medium ${
              telaAtiva === item.id 
                ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="border-t border-slate-100 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 transition-all">
          <span>⚙️</span> Configurações
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
