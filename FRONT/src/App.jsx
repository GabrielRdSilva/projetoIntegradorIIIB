import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'

// Componentes internos para manter o estilo minimalista
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <input 
      {...props} 
      className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:border-emerald-300 bg-slate-50/50" 
    />
  </div>
)

const Button = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-slate-800 hover:bg-slate-900 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700'
  }
  return (
    <button 
      {...props} 
      className={`${variants[variant]} font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  )
}

function App() {
  const [telaAtiva, setTelaAtiva] = useState('home')
  const [produto, setProduto] = useState({
    CodigoProd: '', CodigoForn: '', FornecedorNome: '', LocalForn: '',
    TipoProd: '', DescricaoProd: '', MaterialProd: '', QuantidadeProd: '',
    ValorOriginalProd: '', DescontoAplicadoProd: 0, EmbalagemProd: 'não',
    CustoProd: 0, ValorEmbalagemProd: 0, CustoTotalProd: 0,
    PorcentagemAcrescidaProd: '', ValorSugeridoProd: 0, ValorCorrigidoProd: '',
    PorcentagemLucroProd: 0, LucroProd: 0
  })

  // Lógica de Cálculos Automáticos
  useEffect(() => {
    const valorOriginal = parseFloat(produto.ValorOriginalProd) || 0
    const desconto = (parseFloat(produto.DescontoAplicadoProd) || 0) / 100
    const acrescimo = (parseFloat(produto.PorcentagemAcrescidaProd) || 0) / 100
    const valorCorrigido = parseFloat(produto.ValorCorrigidoProd) || 0

    const custoProd = valorOriginal * (1 - desconto)
    const valorEmbalagem = produto.EmbalagemProd === 'sim' ? 2.5 : 0
    const custoTotal = custoProd + valorEmbalagem
    const valorSugerido = custoTotal * (1 + acrescimo)
    
    const lucroProd = valorCorrigido - custoTotal
    const porcLucro = valorCorrigido > 0 ? (1 - (custoTotal / valorCorrigido)) * 100 : 0

    setProduto(prev => ({
      ...prev,
      CustoProd: custoProd.toFixed(2),
      ValorEmbalagemProd: valorEmbalagem.toFixed(2),
      CustoTotalProd: custoTotal.toFixed(2),
      ValorSugeridoProd: valorSugerido.toFixed(2),
      LucroProd: lucroProd.toFixed(2),
      PorcentagemLucroProd: porcLucro.toFixed(2)
    }))
  }, [produto.ValorOriginalProd, produto.DescontoAplicadoProd, produto.EmbalagemProd, produto.PorcentagemAcrescidaProd, produto.ValorCorrigidoProd])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduto(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/Produtos', produto )
      alert('✅ Produto cadastrado com sucesso!')
      setTelaAtiva('home')
    } catch (error) {
      console.error(error)
      alert('❌ Erro ao cadastrar. O servidor está ligado?')
    }
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Menu Lateral */}
      <Sidebar setTela={setTelaAtiva} />
      
      {/* Área Principal */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              {telaAtiva === 'home' ? 'Visão Geral' : `Gestão de ${telaAtiva}s`}
            </h1>
            <p className="text-slate-400 text-sm">Controle total do seu CRM.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="success" onClick={() => setTelaAtiva('venda')}>+ Nova Venda</Button>
            <Button onClick={() => setTelaAtiva('produto')}>+ Novo Produto</Button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto">
          {telaAtiva === 'home' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Vendas Hoje</span>
                <h3 className="text-3xl font-bold text-emerald-600 mt-2">R$ 0,00</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pedidos</span>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">0</h3>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Estoque</span>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">0</h3>
              </div>
            </div>
          )}

          {telaAtiva === 'produto' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <h2 className="col-span-full text-xl font-bold text-slate-800 border-b pb-4 mb-2">Novo Produto</h2>
                
                <Input label="Cód. Produto" name="CodigoProd" value={produto.CodigoProd} onChange={handleChange} />
                <Input label="Cód. Fornecedor" name="CodigoForn" value={produto.CodigoForn} onChange={handleChange} />
                <Input label="Fornecedor" name="FornecedorNome" value={produto.FornecedorNome} onChange={handleChange} />
                <Input label="Localidade" name="LocalForn" value={produto.LocalForn} onChange={handleChange} />
                <Input label="Tipo" name="TipoProd" value={produto.TipoProd} onChange={handleChange} />
                <Input label="Material" name="MaterialProd" value={produto.MaterialProd} onChange={handleChange} />
                <Input label="Quantidade" type="number" name="QuantidadeProd" value={produto.QuantidadeProd} onChange={handleChange} />
                <Input label="Preço Original (R$)" type="number" name="ValorOriginalProd" value={produto.ValorOriginalProd} onChange={handleChange} />
                <Input label="Desconto (%)" type="number" name="DescontoAplicadoProd" value={produto.DescontoAplicadoProd} onChange={handleChange} />
                
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">Embalagem?</label>
                  <select name="EmbalagemProd" value={produto.EmbalagemProd} onChange={handleChange} className="border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="não">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>

                <Input label="% Acréscimo" type="number" name="PorcentagemAcrescidaProd" value={produto.PorcentagemAcrescidaProd} onChange={handleChange} />
                <Input label="Preço de Venda (R$)" type="number" name="ValorCorrigidoProd" value={produto.ValorCorrigidoProd} onChange={handleChange} />

                <div className="col-span-full grid grid-cols-2 md:grid-cols-6 gap-4 bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 mt-4 text-center">
                  <div className="flex flex-col"><span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Custo Líq.</span><span className="text-sm font-mono font-bold">R$ {produto.CustoProd}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Embalagem</span><span className="text-sm font-mono font-bold">R$ {produto.ValorEmbalagemProd}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Custo Total</span><span className="text-sm font-mono font-bold">R$ {produto.CustoTotalProd}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">Sugestão</span><span className="text-sm font-mono font-bold text-blue-700">R$ {produto.ValorSugeridoProd}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-orange-600 font-bold uppercase tracking-tighter">Lucro</span><span className="text-sm font-mono font-bold text-orange-700">R$ {produto.LucroProd}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-orange-600 font-bold uppercase tracking-tighter">% Lucro</span><span className="text-sm font-mono font-bold text-orange-700">{produto.PorcentagemLucroProd}%</span></div>
                </div>

                <div className="col-span-full mt-6">
                  <Button variant="success" type="submit" className="w-full py-4 text-lg">Cadastrar Produto</Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App



