import React from 'react';
import { LabelVenda, BigValue, SectionTitle } from './Typography';
import Input from './Input';
import Button from './Button';

const ResumoFinanceiro = ({ 
  totalItens, 
  desconto, 
  setDesconto, 
  tipoVenda, 
  numeroParcelas, 
  setNumeroParcelas, 
  dataPrimeiraParcela, 
  setDataPrimeiraParcela, 
  temEntrada, 
  setTemEntrada, 
  dadosEntrada, 
  setDadosEntrada, 
  gerarFinanceiro 
}) => {
  const totalFinal = totalItens - (parseFloat(desconto) || 0);

  return (
    <div className="mt-10 pt-6 border-t border-slate-100">
      <SectionTitle step="3">Resumo Financeiro</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-6">
        <div className="flex flex-col">
          <LabelVenda color="emerald">Subtotal</LabelVenda>
          <BigValue color="emerald">R$ {totalItens.toFixed(2)}</BigValue>
        </div>

        <div className="flex flex-col gap-2">
          <LabelVenda>Desconto (R$)</LabelVenda>
          <input
            type="number"
            step="0.01"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
            className="border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-lg"
          />
        </div>

        <div className="flex flex-col">
          <LabelVenda color="orange">Total Final</LabelVenda>
          <BigValue color="orange">R$ {totalFinal.toFixed(2)}</BigValue>
        </div>
      </div>
      {tipoVenda === 'A Prazo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Número de Parcelas</label>
            <input 
              type="number" 
              min="1"
              value={numeroParcelas} 
              onChange={(e) => setNumeroParcelas(e.target.value)} 
              className="border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700">Data do 1º Vencimento</label>
            <input 
              type="date" 
              value={dataPrimeiraParcela} 
              onChange={(e) => setDataPrimeiraParcela(e.target.value)} 
              className="border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
            />
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button 
          type="button" 
          variant={temEntrada ? "danger" : "secondary"} 
          onClick={() => setTemEntrada(!temEntrada)}
          className="flex-1 py-3"
        >
          {temEntrada ? "✖ Remover Entrada" : "➕ Adicionar Entrada"}
        </Button>
        
        <Button 
          type="button" 
          variant="primary" 
          onClick={gerarFinanceiro}
          className="flex-1 py-3 font-black uppercase tracking-widest"
        >
          ⚙️ Gerar Parcelas
        </Button>
      </div>
      {temEntrada && (
        <div className="p-6 bg-white rounded-2xl border-2 border-emerald-200 shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold uppercase tracking-widest text-xs">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Dados da Entrada (Valor Pago no Ato)
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Input 
              label="Valor da Entrada (R$)" 
              type="number" 
              step="0.01"
              value={dadosEntrada.valor} 
              onChange={(e) => setDadosEntrada({...dadosEntrada, valor: e.target.value})} 
            />
            
            <Input 
              label="Data do Recebimento" 
              type="date" 
              value={dadosEntrada.data} 
              onChange={(e) => setDadosEntrada({...dadosEntrada, data: e.target.value})} 
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-slate-700">Forma de Pagamento</label>
              <select 
                value={dadosEntrada.forma} 
                onChange={(e) => setDadosEntrada({...dadosEntrada, forma: e.target.value})} 
                className="border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Pix">PIX</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartao Debito">Cartão de Débito</option>
                <option value="Cartao Credito">Cartão de Crédito</option>
                <option value="Transferencia">Transferência</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-emerald-50 flex justify-end">
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Status: Paga
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumoFinanceiro;
