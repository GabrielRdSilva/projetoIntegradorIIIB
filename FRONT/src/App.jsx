import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'

// Componentes internos
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <input
      {...props}
      className={`border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:border-emerald-300 bg-slate-50/50 ${props.readOnly ? 'bg-slate-100 cursor-not-allowed' : ''}`}
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
    <button {...props} className={`${variants[variant]} font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2`}>
      {children}
    </button>
  )
}

function App() {
  const [telaAtiva, setTelaAtiva] = useState('home')
  const [buscaCliente, setBuscaCliente] = useState('')
  const [clientesFiltrados, setClientesFiltrados] = useState([])

  const [produto, setProduto] = useState({
    CodigoProd: '', CodigoForn: '', FornecedorNome: '', LocalForn: '',
    TipoProd: '', DescricaoProd: '', MaterialProd: '', QuantidadeProd: '',
    ValorOriginalProd: '', DescontoAplicadoProd: '', EmbalagemProd: 'não',
    CustoProd: 0, ValorEmbalagemProd: 0, CustoTotalProd: 0,
    PorcentagemAcrescidaProd: '', ValorSugeridoProd: 0, ValorCorrigidoProd: '',
    PorcentagemLucroProd: 0, LucroProd: 0
  })

  const [venda, setVenda] = useState({
    DataVenda: new Date().toISOString().split('T')[0],
    CodigoVenda: '',
    VendedorVenda: 'Gabriel Rodrigues',
    TipoVenda: 'Avista',
    CodigoCliente: '',
    ReferenciaCliente: '',
    NomeCliente: '',
    ValorVenda: 0,
    DescontoConcedidoVenda: 0,
    TotalVenda: 0
  })

  const [itensVenda, setItensVenda] = useState([]) // Lista de produtos adicionados
  const [exibirItens, setExibirItens] = useState(false) // Controla a visibilidade da seção de itens
  const [buscaProduto, setBuscaProduto] = useState('') // Texto da busca de produto
  const [produtosFiltrados, setProdutosFiltrados] = useState([]) // Sugestões do banco
  const [itemAtual, setItemAtual] = useState({
    CodigoProdVendaDet: '',
    QuantidadeVendaDet: 1,
    ValorUnitarioVendaDet: 0,
    TotalVendaVendaDet: 0,
    // Campos que virão do produto selecionado:
    TipoProdutoVendaDet: '',
    MaterialVendaDet: '',
    DescricaoProdutoVendaDet: ''
  })
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro')
  const [numeroParcelas, setNumeroParcelas] = useState(3)
  // --- LÓGICA DE CÁLCULOS DO PRODUTO ---
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

  // Sempre que mudar de tela principal, resetamos a visualização de itens
  useEffect(() => {
    setExibirItens(false)
    setItensVenda([]) // Opcional: limpa o carrinho ao sair da tela
  }, [telaAtiva])

  // --- LÓGICA DE GERAÇÃO DO CÓDIGO DA VENDA ---
  useEffect(() => {
    if (venda.DataVenda && venda.CodigoCliente) {
      const dataParts = venda.DataVenda.split('-') // [YYYY, MM, DD]
      const dia = dataParts[2]
      const mes = parseInt(dataParts[1]).toString() // Remove zero à esquerda
      const ultimosDigitos = venda.CodigoCliente.slice(-4)

      const novoCodigo = `VENDA - ${dia}${mes}/${ultimosDigitos}`
      if (venda.CodigoVenda !== novoCodigo) {
        setVenda(prev => ({ ...prev, CodigoVenda: novoCodigo }))
      }
    }
  }, [venda.DataVenda, venda.CodigoCliente])

  // --- BUSCA DE CLIENTES ---
  useEffect(() => {
    const buscarClientes = async () => {
      if (buscaCliente.length > 2) {
        try {
          const response = await axios.get(`http://localhost:3000/clientes?Nome=${buscaCliente}`)
          setClientesFiltrados(response.data)
        } catch (error) { console.error(error) }
      } else { setClientesFiltrados([]) }
    }
    buscarClientes()
  }, [buscaCliente])

  const selecionarCliente = (cliente) => {
    setVenda(prev => ({
      ...prev,
      CodigoCliente: cliente.codCliente,
      ReferenciaCliente: cliente.Referencia,
      NomeCliente: cliente.Nome
    }))
    setBuscaCliente(cliente.Nome)
    setClientesFiltrados([])
  }

  // Busca produtos no banco enquanto digita
  useEffect(() => {
    const buscarProdutos = async () => {
      if (buscaProduto.length > 1) {
        try {
          const response = await axios.get(`http://localhost:3000/Produtos?CodigoProd=${buscaProduto}`)
          setProdutosFiltrados(response.data)
        } catch (error) { console.error(error) }
      } else { setProdutosFiltrados([]) }
    }
    buscarProdutos()
  }, [buscaProduto])

  // Ao clicar em um produto da lista de sugestões
  const selecionarProduto = (prod) => {
    setItemAtual({
      ...itemAtual,
      CodigoProdVendaDet: prod.CodigoProd,
      ValorUnitarioVendaDet: prod.ValorCorrigidoProd, // Preço padrão de venda
      TipoProdutoVendaDet: prod.TipoProd,
      MaterialVendaDet: prod.MaterialProd,
      DescricaoProdutoVendaDet: prod.DescricaoProd,
      TotalVendaVendaDet: (1 * prod.ValorCorrigidoProd).toFixed(2)
    })
    setBuscaProduto(prod.CodigoProd)
    setProdutosFiltrados([])
  }

  // Adiciona o item atual à lista da venda
  const adicionarItem = () => {
    if (!itemAtual.CodigoProdVendaDet) return alert("Selecione um produto primeiro!")

    setItensVenda([...itensVenda, { ...itemAtual, idTemporario: Date.now() }])

    // Limpa o campo para o próximo item
    setItemAtual({
      CodigoProdVendaDet: '', QuantidadeVendaDet: 1, ValorUnitarioVendaDet: 0,
      TotalVendaVendaDet: 0, TipoProdutoVendaDet: '', MaterialVendaDet: '', DescricaoProdutoVendaDet: ''
    })
    setBuscaProduto('')
  }
  // Função para finalizar e gravar a venda
  const handleFinalizarVenda = async () => {
    // Validações
    if (!venda.CodigoCliente) {
      return alert('❌ Selecione um cliente!')
    }
    if (itensVenda.length === 0) {
      return alert('❌ Adicione pelo menos um item à venda!')
    }
    if (!venda.TipoVenda) {
      return alert('❌ Selecione o tipo de venda!')
    }
    if (!formaPagamento) {
      return alert('❌ Selecione a forma de pagamento!')
    }

    try {
      // 1. Calcular totais
      const valorTotalVenda = itensVenda.reduce((acc, item) => acc + parseFloat(item.TotalVendaVendaDet || 0), 0)
      const totalFinal = valorTotalVenda - venda.DescontoConcedidoVenda

      const vendaCompleta = {
        ...venda,
        ValorVenda: valorTotalVenda,
        TotalVenda: totalFinal
      }

      // 2. Salvar a venda
      console.log('Salvando venda:', vendaCompleta)
      const responseVenda = await axios.post('http://localhost:3000/Vendas', vendaCompleta)
      const codigoVendaSalvo = responseVenda.data.CodigoVenda

      console.log('Venda salva com código:', codigoVendaSalvo)

      // 3. Salvar os detalhes da venda
      for (const item of itensVenda) {
        await axios.post('http://localhost:3000/DetalhesVenda', {
          CodigoVendaDet: codigoVendaSalvo,
          DataVendaDet: venda.DataVenda,
          TipoProdutoVendaDet: item.TipoProdutoVendaDet,
          MaterialVendaDet: item.MaterialVendaDet,
          DescricaoProdutoVendaDet: item.DescricaoProdutoVendaDet,
          CodigoProdVendaDet: item.CodigoProdVendaDet,
          QuantidadeVendaDet: item.QuantidadeVendaDet,
          ValorUnitarioVendaDet: item.ValorUnitarioVendaDet,
          TotalVendaVendaDet: item.TotalVendaVendaDet
        })
      }

      console.log('Detalhes da venda salvos')

      // 4. Gerar parcelas se for "A Prazo"
      if (venda.TipoVenda === 'A Prazo') {
        console.log('Criando parcelas...')
        await axios.post('http://localhost:3000/Parcelas/criar', {
          CodigoVenda: codigoVendaSalvo,
          CodigoFinanceiro: venda.CodigoCliente,
          TotalVenda: totalFinal,
          NumeroParcelas: numeroParcelas,
          FormaPagamento: formaPagamento,
          DataPrimeiraVenda: venda.DataVenda
        })
        console.log('Parcelas criadas com sucesso')
      }

      // 5. Sucesso!
      alert('✅ Venda finalizada com sucesso!')

      // Limpar formulário
      setVenda({
        DataVenda: new Date().toISOString().split('T')[0],
        CodigoVenda: '',
        VendedorVenda: 'Gabriel Rodrigues',
        TipoVenda: 'Avista',
        CodigoCliente: '',
        ReferenciaCliente: '',
        NomeCliente: '',
        ValorVenda: 0,
        DescontoConcedidoVenda: 0,
        TotalVenda: 0
      })
      setItensVenda([])
      setExibirItens(false)
      setBuscaCliente('')
      setFormaPagamento('Dinheiro')
      setNumeroParcelas(3)
      setTelaAtiva('home')

    } catch (error) {
      console.error('Erro completo:', error)
      alert('❌ Erro ao finalizar venda: ' + (error.response?.data?.error || error.message))
    }
  }


  const handleChangeProduto = (e) => {
    const { name, value } = e.target
    setProduto(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitProduto = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/Produtos', produto)
      alert('✅ Produto cadastrado!')
      setTelaAtiva('home')
    } catch (error) { alert('❌ Erro ao cadastrar.') }
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar setTela={setTelaAtiva} />

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
              <form onSubmit={handleSubmitProduto} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <h2 className="col-span-full text-xl font-bold text-slate-800 border-b pb-4 mb-2">Novo Produto</h2>
                <Input label="Cód. Produto" name="CodigoProd" value={produto.CodigoProd} onChange={handleChangeProduto} />
                <Input label="Cód. Fornecedor" name="CodigoForn" value={produto.CodigoForn} onChange={handleChangeProduto} />
                <Input label="Fornecedor" name="FornecedorNome" value={produto.FornecedorNome} onChange={handleChangeProduto} />
                <Input label="Localidade" name="LocalForn" value={produto.LocalForn} onChange={handleChangeProduto} />
                <Input label="Tipo" name="TipoProd" value={produto.TipoProd} onChange={handleChangeProduto} />
                <Input label="Material" name="MaterialProd" value={produto.MaterialProd} onChange={handleChangeProduto} />
                <Input label="Quantidade" type="number" name="QuantidadeProd" value={produto.QuantidadeProd} onChange={handleChangeProduto} />
                <Input label="Preço Original (R$)" type="number" name="ValorOriginalProd" value={produto.ValorOriginalProd} onChange={handleChangeProduto} />
                <Input label="Desconto (%)" type="number" name="DescontoAplicadoProd" value={produto.DescontoAplicadoProd} onChange={handleChangeProduto} />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">Embalagem?</label>
                  <select name="EmbalagemProd" value={produto.EmbalagemProd} onChange={handleChangeProduto} className="border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="não">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>

                <Input label="% Acréscimo" type="number" name="PorcentagemAcrescidaProd" value={produto.PorcentagemAcrescidaProd} onChange={handleChangeProduto} />
                <Input label="Preço de Venda (R$)" type="number" name="ValorCorrigidoProd" value={produto.ValorCorrigidoProd} onChange={handleChangeProduto} />

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

          {telaAtiva === 'venda' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <h2 className="col-span-full text-xl font-bold text-slate-800 border-b pb-4 mb-2">Lançar Nova Venda</h2>

                <Input label="Data da Venda" type="date" name="DataVenda" value={venda.DataVenda} onChange={(e) => setVenda({ ...venda, DataVenda: e.target.value })} />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">Vendedor</label>
                  <select name="VendedorVenda" value={venda.VendedorVenda} onChange={(e) => setVenda({ ...venda, VendedorVenda: e.target.value })} className="border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Gabriel Rodrigues">Gabriel Rodrigues</option>
                    <option value="Natalia Almeida">Natalia Almeida</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-slate-700">Tipo de Venda</label>
                  <select name="TipoVenda" value={venda.TipoVenda} onChange={(e) => setVenda({ ...venda, TipoVenda: e.target.value })} className="border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="Avista">À Vista</option>
                    <option value="A Prazo">A Prazo</option>
                  </select>
                </div>

                <Input label="Cód. Venda (Automático)" name="CodigoVenda" value={venda.CodigoVenda} readOnly />

                <div className="md:col-span-2 relative">
                  <Input
                    label="Buscar Cliente (Nome)"
                    placeholder="Digite o nome para buscar..."
                    value={buscaCliente}
                    onChange={(e) => setBuscaCliente(e.target.value)}
                  />
                  {clientesFiltrados.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {clientesFiltrados.map((cliente) => (
                        <li key={cliente.id} onClick={() => selecionarCliente(cliente)} className="p-3 hover:bg-emerald-50 cursor-pointer text-sm text-slate-700 border-b last:border-none border-slate-100">
                          <span className="font-bold">{cliente.codCliente}</span> - {cliente.Nome}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex flex-col"><span className="text-xs text-slate-400 font-bold uppercase">Cód. Cliente</span><span className="font-semibold">{venda.CodigoCliente || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-slate-400 font-bold uppercase">Referência</span><span className="font-semibold">{venda.ReferenciaCliente || '-'}</span></div>
                  <div className="flex flex-col"><span className="text-xs text-slate-400 font-bold uppercase">Nome Selecionado</span><span className="font-semibold">{venda.NomeCliente || 'Nenhum cliente selecionado'}</span></div>
                </div>

                {/* Botão para exibir a seção de itens */}
                {!exibirItens && (
                  <div className="col-span-full mt-6">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => setExibirItens(true)}
                      className="w-full py-4 text-lg"
                    >
                      Adicionar Itens
                    </Button>
                  </div>
                )}

                {/* SEÇÃO DE ADIÇÃO DE PRODUTOS - SÓ APARECE SE exibirItens FOR TRUE */}
                {exibirItens && (
                  <div className="col-span-full mt-8 border-t pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                      Itens da Venda
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="md:col-span-1 relative">
                        <Input
                          label="Buscar Produto (Cód)"
                          placeholder="Ex: NAS-001"
                          value={buscaProduto}
                          onChange={(e) => setBuscaProduto(e.target.value)}
                        />
                        {produtosFiltrados.length > 0 && (
                          <ul className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-lg mt-1 max-h-40 overflow-y-auto">
                            {produtosFiltrados.map((p) => (
                              <li key={p.id} onClick={() => selecionarProduto(p)} className="p-3 hover:bg-emerald-50 cursor-pointer text-sm border-b last:border-none border-slate-100">
                                <span className="font-bold">{p.CodigoProd}</span> - {p.TipoProd} - {p.DescricaoProd}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <Input
                        label="Qtd" type="number"
                        value={itemAtual.QuantidadeVendaDet}
                        onChange={(e) => setItemAtual({ ...itemAtual, QuantidadeVendaDet: e.target.value, TotalVendaVendaDet: (e.target.value * itemAtual.ValorUnitarioVendaDet).toFixed(2) })}
                      />

                      <Input
                        label="Valor Unit. (R$)" type="number"
                        value={itemAtual.ValorUnitarioVendaDet}
                        onChange={(e) => setItemAtual({ ...itemAtual, ValorUnitarioVendaDet: e.target.value, TotalVendaVendaDet: (e.target.value * itemAtual.QuantidadeVendaDet).toFixed(2) })}
                      />

                      <Button variant="success" type="button" onClick={adicionarItem}>+ Adicionar Item</Button>
                    </div>

                    {/* TABELA DE ITENS ADICIONADOS */}
                    {itensVenda.length > 0 && (
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
                            {itensVenda.map((item) => (
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
                                  <button onClick={() => setItensVenda(itensVenda.filter(i => i.idTemporario !== item.idTemporario))} className="text-red-500 hover:text-red-700 font-bold">Remover</button>
                                </td>
                              </tr>

                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* RESUMO DA VENDA - TOTALIZAÇÕES */}
                    <div className="mt-10 pt-6 border-t border-slate-100">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                        Resumo da Venda
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-6">
                        {/* Valor Total da Venda */}
                        <div className="flex flex-col">
                          <span className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Valor Total Venda</span>
                          <span className="text-3xl font-bold text-emerald-700 mt-2">
                            R$ {itensVenda.reduce((acc, item) => acc + parseFloat(item.TotalVendaVendaDet || 0), 0).toFixed(2)}
                          </span>
                        </div>

                        {/* Desconto Opcional */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-slate-600 font-bold uppercase tracking-widest">Desconto Opcional (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={venda.DescontoConcedidoVenda}
                            onChange={(e) => setVenda({ ...venda, DescontoConcedidoVenda: parseFloat(e.target.value) || 0 })}
                            className="border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-lg"
                            placeholder="0.00"
                          />
                        </div>

                        {/* Total Final */}
                        <div className="flex flex-col">
                          <span className="text-xs text-orange-600 font-bold uppercase tracking-widest">Total Final</span>
                          <span className="text-3xl font-bold text-orange-700 mt-2">
                            R$ {(itensVenda.reduce((acc, item) => acc + parseFloat(item.TotalVendaVendaDet || 0), 0) - venda.DescontoConcedidoVenda).toFixed(2)}
                          </span>
                        </div>
                        {/* RESUMO DA VENDA - TOTALIZAÇÕES */}
                        <div className="mt-10 pt-6 border-t border-slate-100"></div>
                        {/* SEÇÃO DE TIPO DE VENDA E PAGAMENTO */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                            Tipo de Venda e Pagamento
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-6">
                            {/* Tipo de Venda */}
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-bold text-slate-700">Tipo de Venda</label>
                              <select
                                value={venda.TipoVenda}
                                onChange={(e) => setVenda({ ...venda, TipoVenda: e.target.value })}
                                className="border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg"
                              >
                                <option value="Avista">À Vista</option>
                                <option value="A Prazo">A Prazo</option>
                              </select>
                            </div>

                            {/* Forma de Pagamento */}
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-bold text-slate-700">Forma de Pagamento</label>
                              <select
                                value={formaPagamento}
                                onChange={(e) => setFormaPagamento(e.target.value)}
                                className="border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg"
                              >
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Cartao Credito">Cartão de Crédito</option>
                                <option value="Cartao Debito">Cartão de Débito</option>
                                <option value="Transferencia">Transferência Bancária</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Pix">PIX</option>
                              </select>
                            </div>

                            {/* Campo de Parcelas - Só aparece se for "A Prazo" */}
                            {venda.TipoVenda === 'A Prazo' && (
                              <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Número de Parcelas</label>
                                <input
                                  type="number"
                                  min="2"
                                  max="12"
                                  value={numeroParcelas}
                                  onChange={(e) => setNumeroParcelas(parseInt(e.target.value) || 3)}
                                  className="border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-lg"
                                  placeholder="Ex: 3"
                                />
                              </div>
                            )}
                          </div>
                        </div>


                      </div>

                      {/* Botão Finalizar */}
                      <Button
                        variant="success"
                        type="button"
                        onClick={handleFinalizarVenda}
                        className="w-full py-4 text-xl"
                      >
                        Finalizar e Gravar Venda
                      </Button>


                    </div>

                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App




