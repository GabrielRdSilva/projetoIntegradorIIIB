import React, { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { LabelVenda } from "../components/Typography";

const ListaVendas = ({ vendas, aoNovaVenda, aoDetalhar, filtros, setFiltros, aoBuscar }) => {
  return (
    <Card title="Histórico de Vendas">
      {/* Área de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <Input 
          label="Nome do Cliente" 
          value={filtros.nomeCliente} 
          onChange={(e) => setFiltros({...filtros, nomeCliente: e.target.value})}
          placeholder="Buscar por nome..."
        />
        <Input 
          label="Cód. Cliente" 
          value={filtros.codCliente} 
          onChange={(e) => setFiltros({...filtros, codCliente: e.target.value})}
          placeholder="CLIEN-..."
        />
        <Input 
          label="Data da Venda" 
          type="date"
          value={filtros.dataVenda} 
          onChange={(e) => setFiltros({...filtros, dataVenda: e.target.value})}
        />
        <div className="flex items-end gap-2">
          <Button variant="primary" onClick={aoBuscar} className="flex-1">🔍 Filtrar</Button>
          <Button variant="success" onClick={aoNovaVenda} className="flex-1">➕ Nova</Button>
        </div>
      </div>

      {/* Tabela de Vendas */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="p-4">Cód. Venda</th>
              <th className="p-4">Data</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Total</th>
              <th className="p-4">Tipo</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendas.map((v) => (
              <tr key={v.id} className="text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-bold text-blue-600">{v.CodigoVenda}</td>
                <td className="p-4">{new Date(v.DataVenda).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 font-semibold">{v.NomeCliente}</td>
                <td className="p-4 font-bold text-emerald-600">R$ {v.TotalVenda.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${v.TipoVenda === 'Avista' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {v.TipoVenda === 'Avista' ? 'À VISTA' : 'A PRAZO'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Button variant="secondary" onClick={() => aoDetalhar(v)} className="py-1 px-3 text-xs">
                    👁️ Detalhar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
export default ListaVendas
