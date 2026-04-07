import React from "react";
import { format } from "date-fns";

const ListaVendas = ({ vendas, aoNovaVenda, aoDetalhar, aoEditarVenda, filtros, setFiltros, aoBuscar }) => {

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Gestão de Vendas</h2>
                <button
                    onClick={aoNovaVenda}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    + Nova Venda
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-slate-700">Nome do Cliente</label>
                    <input
                        type="text"
                        name="nomeCliente"
                        value={filtros.nomeCliente}
                        onChange={handleFiltroChange}
                        placeholder="Buscar por nome..."
                        className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:border-emerald-300 bg-slate-50/50"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-slate-700">Cód. Cliente</label>
                    <input
                        type="text"
                        name="codCliente"
                        value={filtros.codCliente}
                        onChange={handleFiltroChange}
                        placeholder="Buscar por código..."
                        className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:border-emerald-300 bg-slate-50/50"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-slate-700">Data da Venda</label>
                    <input
                        type="date"
                        name="dataVenda"
                        value={filtros.dataVenda}
                        onChange={handleFiltroChange}
                        className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:border-emerald-300 bg-slate-50/50"
                    />
                </div>
                <div className="md:col-span-3 flex justify-end">
                    <button
                        onClick={aoBuscar}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-2xl">
                <table className="min-w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <tr>
                            <th className="p-4">Cód. Venda</th>
                            <th className="p-4">Cliente</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Ações</th>
                            <th className="p-4"></th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vendas.map((v) => (
                            <tr key={v.id} className="text-sm text-slate-700 hover:bg-slate-50">
                                <td className="p-4 font-bold">{v.CodigoVenda}</td>
                                <td className="p-4">{v.NomeCliente}</td>
                                <td className="p-4">
                                    {(() => {
                                        const [ano, mes, dia] = v.DataVenda.split('T')[0].split('-');
                                        return `${dia}/${mes}/${ano}`;
                                    })()}
                                </td>
                                <td className="p-4 font-bold">R$ {v.TotalVenda}</td>
                                <td className="p-4">
                                    <button onClick={() => aoDetalhar(v)} className="text-blue-600 font-bold">Detalhes</button>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => aoEditarVenda(v.id)} className="text-orange-600 font-bold">Editar</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaVendas;
