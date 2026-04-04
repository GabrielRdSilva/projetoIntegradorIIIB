import React from "react";

const DetalheVenda = ({ venda, aoVoltar }) => {
  if (!venda) return null;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Venda: {venda.CodigoVenda}</h2>
        <button onClick={aoVoltar} className="bg-slate-200 p-2 px-4 rounded-xl font-bold">Voltar</button>
      </div>
      <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border mb-6">
        <div>
          <p><strong>Cliente:</strong> {venda.NomeCliente}</p>
          <p><strong>Data:</strong> {venda.DataVenda}</p>
        </div>
        <div>
          <p><strong>Total:</strong> R$ {venda.TotalVenda}</p>
          <p><strong>Forma Pagamento:</strong> {venda.FormaPagamento}</p>
        </div>
      </div>
      {/* Aqui você pode listar os itens da venda se salvou no JSON */}
    </div>
  );
};

export default DetalheVenda;
