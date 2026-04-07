import React from "react"
import Button from "../components/Button"
import Card from "../components/Card";
import { LabelVenda, BadgeValue } from "../components/Typography";

const ListaProdutos = ({ produtos, aoEditar, aoExcluir, aoNovo }) => {
  return (
    <Card title="Estoque de Produtos">
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500 text-sm">Produtos cadastrados: <strong>{produtos.length}</strong></p>
        <Button variant="success" onClick={aoNovo}>
          📦 Novo Produto
        </Button>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="p-4">Cód. Produto</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Custo</th>
              <th className="p-4">Venda</th>
              <th className="p-4">Lucro</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {produtos.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400 italic">
                  Nenhum produto em estoque.
                </td>
              </tr>
            ) : (
              produtos.map((p) => (
                <tr key={p.id} className="text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600">{p.CodigoProd}</td>
                  <td className="p-4 font-semibold">
                    {p.TipoProd} 
                    <span className="block text-[10px] text-slate-400 font-normal">{p.DescricaoProd}- {p.MaterialProd}</span>
                  </td>
                  <td className="p-4 text-slate-500">R$ {parseFloat(p.CustoProd).toFixed(2)}</td>
                  <td className="p-4 font-bold text-emerald-600">R$ {parseFloat(p.ValorCorrigidoProd).toFixed(2)}</td>
                  <td className="p-4">
                    <span className="text-orange-600 font-bold">R$ {parseFloat(p.LucroProd).toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Button variant="secondary" onClick={() => aoEditar(p)} className="py-1 px-3 text-xs">
                        ✏️ Editar
                      </Button>
                      <Button variant="danger" onClick={() => aoExcluir(p)} className="py-1 px-3 text-xs">
                        🗑️ Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ListaProdutos