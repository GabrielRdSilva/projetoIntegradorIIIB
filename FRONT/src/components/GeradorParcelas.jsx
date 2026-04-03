import React from "react";
import Input from "./Input";
import { SectionTitle, LabelVenda } from "./Typography";

const GeradorParcelas = ({ parcelas, setParcelas }) => {
  
  const handleAlterarParcela = (index, campo, valor) => {
    const novas = [...parcelas];
    
    // 1. Atualiza o campo alterado (Garantindo que valor seja número se for ValorParcela)
    if (campo === 'ValorParcela') {
      novas[index][campo] = parseFloat(valor) || 0;
    } else {
      novas[index][campo] = valor;
    }

     // 2. Lógica de Recálculo Automático
    if (campo === 'ValorParcela') {
      // O total que as parcelas DEVEM somar (subtotal da venda - desconto)
      // Pegamos o total atual da soma de todas as parcelas antes da alteração
      const totalQueDeveTer = parcelas.reduce((acc, p) => acc + (parseFloat(p.ValorParcela) || 0), 0);
      
      // Quanto já foi definido pelo usuário até a parcela atual
      const jaDefinido = novas.slice(0, index + 1).reduce((acc, p) => acc + (parseFloat(p.ValorParcela) || 0), 0);
      
      // Quanto sobra para as próximas parcelas
      const restante = totalQueDeveTer - jaDefinido;
      const qtdParcelasRestantes = novas.length - (index + 1);

      if (qtdParcelasRestantes > 0) {
        // Divide o que sobrou igualmente entre as próximas
        const valorCadaRestante = parseFloat((restante / qtdParcelasRestantes).toFixed(2));
        for (let i = index + 1; i < novas.length; i++) {
          novas[i].ValorParcela = valorCadaRestante;
        }
      }
    }
    
    setParcelas(novas);
  };

  return (
    <div className="mt-8 border-t pt-8">
      <SectionTitle step="4">Configuração das Parcelas</SectionTitle>
      <div className="grid grid-cols-1 gap-4">
        {parcelas.map((p, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-16"><LabelVenda>Parc.</LabelVenda><div className="font-bold text-lg">#{p.NumeroParcela}</div></div>
            
            <div className="flex-1">
              <Input label="Vencimento" type="date" value={p.DataVencimento} onChange={(e) => handleAlterarParcela(idx, 'DataVencimento', e.target.value)} />
            </div>

            <div className="flex-1">
              <Input label="Valor (R$)" type="number" step="0.01" value={p.ValorParcela} onChange={(e) => handleAlterarParcela(idx, 'ValorParcela', e.target.value)} />
            </div>

            <div className="flex-1">
              <label className="text-sm font-bold text-slate-700">Status</label>
              <select 
                value={p.StatusParcela} 
                onChange={(e) => handleAlterarParcela(idx, 'StatusParcela', e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pendente">Pendente</option>
                <option value="Paga">Paga</option>
              </select>
            </div>

            {/* NOVO CAMPO: Forma de Pagamento Individual */}
            <div className="flex-1">
              <label className="text-sm font-bold text-slate-700">Pagamento</label>
              <select 
                value={p.FormaPagamento} 
                onChange={(e) => handleAlterarParcela(idx, 'FormaPagamento', e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A Prazo">A Prazo</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartao Credito">Cartão de Crédito</option>
                <option value="Cartao Debito">Cartão de Débito</option>
                <option value="Pix">PIX</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GeradorParcelas
