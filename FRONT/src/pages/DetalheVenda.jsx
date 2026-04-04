import React from "react";

const DetalheVenda = ({ venda, aoVoltar }) => {
  if (!venda) {
    return <p className="text-slate-500 text-center py-10">Nenhuma venda selecionada para detalhamento.</p>;
  }

  // Função auxiliar para formatar a data sem erro de fuso horário
  const formatarDataLocal = (dataStr) => {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Detalhes da Venda: {venda.CodigoVenda}</h2>
        <button
          onClick={aoVoltar}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Voltar para Lista
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Informações da Venda */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Informações Gerais</h3>
          <p className="mb-2"><strong>Data da Venda:</strong> {formatarDataLocal(venda.DataVenda)}</p>
          <p className="mb-2"><strong>Vendedor:</strong> {venda.VendedorVenda}</p>
          <p className="mb-2"><strong>Tipo de Venda:</strong> {venda.TipoVenda}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${venda.StatusVenda === 'Finalizada' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
              {venda.StatusVenda}
            </span>
          </p>
        </div>

        {/* Informações do Cliente */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Dados do Cliente</h3>
          <p className="mb-2"><strong>Cód. Cliente:</strong> {venda.CodigoCliente}</p>
          <p className="mb-2"><strong>Nome:</strong> {venda.NomeCliente}</p>
          <p><strong>Referência:</strong> {venda.ReferenciaCliente}</p>
        </div>
      </div>

      {/* Itens da Venda */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Itens da Venda</h3>
        {venda.itens && venda.itens.length > 0 ? (
          <div className="overflow-hidden border border-slate-200 rounded-2xl">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4 text-center">Qtd</th>
                  <th className="p-4 text-right">Unitário</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {venda.itens.map((item, index) => (
                  <tr key={index} className="text-sm text-slate-700 hover:bg-slate-50">
                    <td className="p-4 font-bold">
                      {item.CodigoProdVendaDet}
                      <span className="block font-normal text-xs text-slate-400">
                        {item.DescricaoProdutoVendaDet}
                      </span>
                    </td>
                    <td className="p-4 text-center">{item.QuantidadeVendaDet}</td>
                    <td className="p-4 text-right">R$ {parseFloat(item.ValorUnitarioVendaDet).toFixed(2)}</td>
                    <td className="p-4 text-right font-bold">R$ {parseFloat(item.TotalVendaVendaDet).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 bg-slate-50 p-4 rounded-xl text-center border border-dashed">Nenhum item registrado nesta venda.</p>
        )}
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Resumo Financeiro</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Valor Total Bruto</span>
            <span className="text-xl font-bold text-slate-700">R$ {parseFloat(venda.ValorVenda).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Desconto Concedido</span>
            <span className="text-xl font-bold text-red-600">R$ {parseFloat(venda.DescontoConcedidoVenda).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase block">Total Final Líquido</span>
            <span className="text-2xl font-bold text-emerald-700">R$ {parseFloat(venda.TotalVenda).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Informações de Pagamento */}
      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Informações de Pagamento</h3>
        <p className="mb-2"><strong>Forma de Pagamento:</strong> {venda.FormaPagamento}</p>
        {venda.TipoVenda === 'Avista' && (
          <>
            <p className="mb-2"><strong>Valor Pago:</strong> R$ {parseFloat(venda.ValorPagoAVista || 0).toFixed(2)}</p>
            <p><strong>Data Pagamento:</strong> {formatarDataLocal(venda.DataPagamentoAVista)}</p>
          </>
        )}
        {venda.TipoVenda === 'A Prazo' && (
          <p><strong>Número de Parcelas:</strong> {venda.NumeroParcelas}x</p>
        )}
      </div>
    </div>
  );
};

export default DetalheVenda;

