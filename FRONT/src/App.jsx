import React, { useState, useEffect } from 'react'
import { Input } from './components/Input'
import { Button } from './components/Button'
import axios from 'axios'



function App() {
  const [telaAtiva, setTelaAtiva] = useState('home')
  const [produto, setProduto] = useState({
    CodigoProd: '', CodigoForn: '', FornecedorNome: '', LocalForn: '',
    TipoProd: '', DescricaoProd: '', MaterialProd: '', QuantidadeProd: '',
    ValorOriginalProd: '', DescontoAplicadoProd: '', EmbalagemProd: 'não',
    CustoProd: 0, ValorEmbalagemProd: 0, CustoTotalProd: 0,
    PorcentagemAcrescidaProd: '', ValorSugeridoProd: 0, ValorCorrigidoProd: '',
    PorcentagemLucroProd: 0, LucroProd: 0
  })

  // Lógica de Cálculos
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
    e.preventDefault() // Impede a página de recarregar

    try {
      // Fazemos o POST para a rota que criamos no backend
      const response = await axios.post('http://localhost:3000/Produtos', produto)

      console.log('Resposta do Servidor:', response.data)
      alert('Produto cadastrado com sucesso no banco de dados!')

      // Opcional: Limpar o formulário após o sucesso
      setTelaAtiva('home')
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      alert('Erro ao cadastrar o produto. Verifique se o servidor está rodando!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-green-500 pb-2">CRM de Vendas</h1>

      <div className="flex gap-4 mb-8">
        <Button variant="success" onClick={() => setTelaAtiva('produto')}>Novo Produto</Button>
        <Button onClick={() => setTelaAtiva('venda')}>Nova Venda</Button>
        {telaAtiva !== 'home' && <Button variant="secondary" onClick={() => setTelaAtiva('home')}>Voltar</Button>}
      </div>

      <div className="w-full max-w-5xl bg-white p-6 rounded-2xl shadow-2xl border border-gray-200">
        {telaAtiva === 'home' && <p className="text-center text-gray-500 py-10">Selecione uma opção acima para começar.</p>}

        {telaAtiva === 'produto' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <h2 className="col-span-full text-xl font-bold text-green-700 border-b pb-2 mb-2">Cadastro de Produto</h2>

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
              <label className="text-sm font-bold text-gray-700">Embalagem?</label>
              <select name="EmbalagemProd" value={produto.EmbalagemProd} onChange={handleChange} className="border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-green-500">
                <option value="não">Não</option>
                <option value="sim">Sim</option>
              </select>
            </div>

            <Input label="% Acréscimo" type="number" name="PorcentagemAcrescidaProd" value={produto.PorcentagemAcrescidaProd} onChange={handleChange} />
            <Input label="Valor Corrigido (Venda)" type="number" name="ValorCorrigidoProd" value={produto.ValorCorrigidoProd} onChange={handleChange} />

            <div className="col-span-full grid grid-cols-2 md:grid-cols-6 gap-4 bg-green-50 p-4 rounded-xl border border-green-100 mt-4 text-center">
              <div className="flex flex-col"><span className="text-[10px] text-green-600 font-bold uppercase">Custo Líquido</span><span className="text-sm font-mono">R$ {produto.CustoProd}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-green-600 font-bold uppercase">Embalagem</span><span className="text-sm font-mono">R$ {produto.ValorEmbalagemProd}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-green-600 font-bold uppercase">Custo Total</span><span className="text-sm font-mono">R$ {produto.CustoTotalProd}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-blue-600 font-bold uppercase">Sugestão Venda</span><span className="text-sm font-mono font-bold">R$ {produto.ValorSugeridoProd}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-orange-600 font-bold uppercase">Lucro Bruto</span><span className="text-sm font-mono">R$ {produto.LucroProd}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-orange-600 font-bold uppercase">% Lucro</span><span className="text-sm font-mono">{produto.PorcentagemLucroProd}%</span></div>
            </div>

            <div className="col-span-full mt-6">
              <Button variant="success" type="submit" className="w-full text-xl py-4">Cadastrar Produto no Sistema</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default App



