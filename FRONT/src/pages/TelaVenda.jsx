import React from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { SectionTitle, LabelVenda } from "../components/Typography";
import TabelaItens from "../components/TabelaItens";
import ResumoFinanceiro from "../components/ResumoFinanceiro";
import GeradorParcelas from "../components/GeradorParcelas";


const TelaVenda = ({
  venda, setVenda, parcelasEditaveis,
  setParcelasEditaveis,
  dataPrimeiraParcela, setDataPrimeiraParcela, // ADICIONE ESTAS DUAS AQUI
  buscaCliente, setBuscaCliente, clientesFiltrados, selecionarCliente,
  exibirItens, setExibirItens,
  buscaProduto, setBuscaProduto, produtosFiltrados, selecionarProduto,
  itemAtual, setItemAtual, adicionarItem,
  itensVenda, setItensVenda,
  // ADICIONE ESTAS NOVAS AQUI:
  temEntrada, 
  setTemEntrada, 
  dadosEntrada, 
  setDadosEntrada, 
  gerarFinanceiro,
  formaPagamento, setFormaPagamento,
  numeroParcelas, setNumeroParcelas,
  valorPagoAVista, setValorPagoAVista,
  dataPagamentoAVista, setDataPagamentoAVista,
  handleFinalizarVenda
}) => {

  const totalItens = itensVenda.reduce((acc, item) => acc + parseFloat(item.TotalVendaVendaDet || 0), 0);

  return (
    <Card title="Lançar Nova Venda">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Data da Venda" type="date" value={venda.DataVenda} onChange={(e) => setVenda({ ...venda, DataVenda: e.target.value })} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-700">Vendedor</label>
          <select value={venda.VendedorVenda} onChange={(e) => setVenda({ ...venda, VendedorVenda: e.target.value })} className="border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="Gabriel Rodrigues">Gabriel Rodrigues</option>
            <option value="Natalia Almeida">Natalia Almeida</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-slate-700">Tipo de Venda</label>
          <select value={venda.TipoVenda} onChange={(e) => setVenda({ ...venda, TipoVenda: e.target.value })} className="border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="Avista">À Vista</option>
            <option value="A Prazo">A Prazo</option>
          </select>
        </div>

        <Input label="Cód. Venda (Automático)" value={venda.CodigoVenda} readOnly />

        <div className="md:col-span-2 relative">
          <Input label="Buscar Cliente (Nome)" placeholder="Digite o nome..." value={buscaCliente} onChange={(e) => setBuscaCliente(e.target.value)} />
          {clientesFiltrados.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-40 overflow-y-auto">
              {clientesFiltrados.map((c) => (
                <li key={c.id} onClick={() => selecionarCliente(c)} className="p-3 hover:bg-emerald-50 cursor-pointer text-sm border-b border-slate-100">
                  <span className="font-bold">{c.codCliente}</span> - {c.Nome}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex flex-col"><LabelVenda>Cód. Cliente</LabelVenda><span className="font-semibold">{venda.CodigoCliente || '-'}</span></div>
          <div className="flex flex-col"><LabelVenda>Referência</LabelVenda><span className="font-semibold">{venda.ReferenciaCliente || '-'}</span></div>
          <div className="flex flex-col"><LabelVenda>Nome Selecionado</LabelVenda><span className="font-semibold">{venda.NomeCliente || 'Nenhum selecionado'}</span></div>
        </div>

        {!exibirItens ? (
          <div className="col-span-full mt-6">
            <Button variant="primary" type="button" onClick={() => setExibirItens(true)} className="w-full py-4 text-lg">Adicionar Itens</Button>
          </div>
        ) : (
          <div className="col-span-full mt-8 border-t pt-8">
            <SectionTitle step="2">Itens da Venda</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="relative">
                <Input label="Buscar Produto (Cód)" placeholder="Ex: NAS-001" value={buscaProduto} onChange={(e) => setBuscaProduto(e.target.value)} />
                {produtosFiltrados.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {produtosFiltrados.map((p) => (
                      <li key={p.id} onClick={() => selecionarProduto(p)} className="p-3 hover:bg-emerald-50 cursor-pointer text-sm border-b border-slate-100">
                        <span className="font-bold">{p.CodigoProd}</span> - {p.TipoProd}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Input label="Qtd" type="number" value={itemAtual.QuantidadeVendaDet} onChange={(e) => setItemAtual({ ...itemAtual, QuantidadeVendaDet: e.target.value, TotalVendaVendaDet: (e.target.value * itemAtual.ValorUnitarioVendaDet).toFixed(2) })} />
              <Input label="Valor Unit." type="number" value={itemAtual.ValorUnitarioVendaDet} onChange={(e) => setItemAtual({ ...itemAtual, ValorUnitarioVendaDet: e.target.value, TotalVendaVendaDet: (e.target.value * itemAtual.QuantidadeVendaDet).toFixed(2) })} />
              <Button variant="success" type="button" onClick={adicionarItem}>+ Adicionar</Button>
            </div>

            <TabelaItens itens={itensVenda} removerItem={(id) => setItensVenda(itensVenda.filter(i => i.idTemporario !== id))} />

            <ResumoFinanceiro
              totalItens={totalItens}
              desconto={venda.DescontoConcedidoVenda}
              dataPrimeiraParcela={dataPrimeiraParcela} // ADICIONE ESTA
              setDataPrimeiraParcela={setDataPrimeiraParcela} // ADICIONE ESTA
              setDesconto={(val) => setVenda({ ...venda, DescontoConcedidoVenda: val })}
              tipoVenda={venda.TipoVenda}
              formaPagamento={formaPagamento}
              setFormaPagamento={setFormaPagamento}
              temEntrada={temEntrada}
              setTemEntrada={setTemEntrada}
              dadosEntrada={dadosEntrada}
              setDadosEntrada={setDadosEntrada}
              gerarFinanceiro={gerarFinanceiro}
              numeroParcelas={numeroParcelas}
              setNumeroParcelas={setNumeroParcelas}
              valorPagoAVista={valorPagoAVista}
              setValorPagoAVista={setValorPagoAVista}
              dataPagamentoAVista={dataPagamentoAVista}
              setDataPagamentoAVista={setDataPagamentoAVista}
            />
            {/* ESTE BLOCO É O QUE FAZ APARECER NA TELA */}
            {parcelasEditaveis.length > 0 && (
              <GeradorParcelas
                parcelas={parcelasEditaveis}
                setParcelas={setParcelasEditaveis}
              />
            )}

            <Button variant="success" type="button" onClick={handleFinalizarVenda} className="w-full py-4 text-xl mt-6">
              Finalizar e Gravar Venda
            </Button>

          </div>
        )}
      </form>
    </Card>
  )
}

export default TelaVenda
