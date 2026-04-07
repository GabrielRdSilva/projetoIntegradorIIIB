import React from  "react"

const TabelaItens = ({ itens, removerItem }) => {
  if (itens.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden border border-slate-200 rounded-2xl">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <tr>
            <th className="p-4">Produto</th>
            <th className="p-4">Qtd</th>
            <th className="p-4">Unitário</th>
            <th className="p-4">Total</th>
            <th className="p-4">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {itens.map((item) => (
            <tr key={item.idTemporario} className="text-sm text-slate-700 hover:bg-slate-50">
              <td className="p-4 font-bold">
                {item.CodigoProdVendaDet}
                <span className="block font-normal text-xs text-slate-400">
                  {item.TipoProdutoVendaDet} - {item.DescricaoProdutoVendaDet}
                </span>
              </td>
              <td className="p-4">{item.QuantidadeVendaDet}</td>
              <td className="p-4">R$ {item.ValorUnitarioVendaDet}</td>
              <td className="p-4 font-bold">R$ {item.TotalVendaVendaDet}</td>
              <td className="p-4">
                <button 
                  onClick={() => removerItem(item.idTemporario)} 
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TabelaItens

