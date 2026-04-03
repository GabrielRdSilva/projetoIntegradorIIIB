import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Button from "./components/Button";
import Dashboard from "./pages/Dashboard";
import TelaProduto from "./pages/TelaProduto";
import TelaVenda from "./pages/TelaVenda";
import TelaCliente from "./pages/TelaCliente"; // ADICIONE ESTA LINHA

function App() {
  const [telaAtiva, setTelaAtiva] = useState('home')
  const [buscaCliente, setBuscaCliente] = useState('')
  const [clientesFiltrados, setClientesFiltrados] = useState([])
  const [buscaProduto, setBuscaProduto] = useState('')
  const [produtosFiltrados, setProdutosFiltrados] = useState([])
  const [itensVenda, setItensVenda] = useState([])
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState(new Date().toISOString().split('T')[0]);
  const [debugData, setDebugData] = useState(null); // Para guardar os dados do teste
  const [parcelasEditaveis, setParcelasEditaveis] = useState([]);
  const [exibirItens, setExibirItens] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro')
  const [numeroParcelas, setNumeroParcelas] = useState(3)
  const [dataPagamentoAVista, setDataPagamentoAVista] = useState(new Date().toISOString().split('T')[0])
  const [valorPagoAVista, setValorPagoAVista] = useState(0)
  const [totalFinalVenda, setTotalFinalVenda] = useState(0);
  const [temEntrada, setTemEntrada] = useState(false);
  const [dadosEntrada, setDadosEntrada] = useState({
    valor: 0, data: new Date().toISOString().split('T')[0], forma: 'Pix', status: 'Paga'
  });
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
    CodigoVenda: '', VendedorVenda: 'Gabriel Rodrigues', TipoVenda: 'Avista',
    CodigoCliente: '', ReferenciaCliente: '', NomeCliente: '',
    ValorVenda: 0, DescontoConcedidoVenda: 0, TotalVenda: 0
  })
  // 1. Estado Inicial Ajustado
  const [novoCliente, setNovoCliente] = useState({
    codCliente: `CLIEN-${Math.floor(1000 + Math.random() * 9000)}`,
    Nome: '',
    Email: '',
    Referencia: '',
    Endereco: '',
    Contato: '' // Será convertido para Int no envio
  });
    const buscarProximoCodigoCliente = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes/proximo-codigo' );
      setNovoCliente(prev => ({ ...prev, codCliente: response.data.proximoCodigo }));
    } catch (error) {
      console.error("Erro ao buscar próximo código:", error);
    }
  };

  // Dispara a busca quando a tela de cliente for ativada
  useEffect(() => {
    if (telaAtiva === 'cliente') {
      buscarProximoCodigoCliente();
    }
  }, [telaAtiva]);

    const handleSalvarCliente = async (e) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        ...novoCliente,
        Contato: parseInt(novoCliente.Contato, 10) || 0
      };

      await axios.post('http://localhost:3000/clientes', dadosParaEnviar );
      alert('✅ Cliente gravado com sucesso!');
      
      // Busca o próximo código para o próximo cadastro
      await buscarProximoCodigoCliente();
      
      // Limpa apenas os campos de texto, mantendo o novo código
      setNovoCliente(prev => ({
        ...prev,
        Nome: '', Email: '', Referencia: '', Endereco: '', Contato: ''
      }));
      
      setTelaAtiva('home');
    } catch (error) {
      alert('❌ Erro ao gravar cliente: ' + error.message);
    }
  };



  const gerarFinanceiro = () => {
    // 1. Calcula o Total da Venda
    const subtotal = itensVenda.reduce((acc, item) => acc + (parseFloat(item.TotalVendaVendaDet) || 0), 0);
    const desconto = parseFloat(venda.DescontoConcedidoVenda) || 0;
    const totalVenda = subtotal - desconto;

    // 2. Define o Valor da Entrada (se houver)
    const valorEntrada = temEntrada ? parseFloat(dadosEntrada.valor) : 0;
    const valorParaParcelar = totalVenda - valorEntrada;

    if (valorParaParcelar < 0) {
      alert("❌ O valor da entrada não pode ser maior que o total da venda!");
      return;
    }

    const novasParcelas = [];
    const totalParcelasDesejadas = parseInt(numeroParcelas) || 1;

    // 3. Adiciona a Entrada como Parcela #1 (se houver)
    if (temEntrada) {
      novasParcelas.push({
        NumeroParcela: 1,
        ValorParcela: valorEntrada,
        DataVencimento: dadosEntrada.data,
        StatusParcela: 'Paga',
        FormaPagamento: dadosEntrada.forma
      });
    }

    // 4. Calcula quantas parcelas faltam gerar
    // Se tem entrada, a entrada já contou como 1, então geramos (Total - 1)
    const qtdParaGerar = temEntrada ? (totalParcelasDesejadas - 1) : totalParcelasDesejadas;

    if (qtdParaGerar > 0) {
      const valorCada = parseFloat((valorParaParcelar / qtdParaGerar).toFixed(2));
      let dataReferencia = new Date(dataPrimeiraParcela);

      for (let i = 1; i <= qtdParaGerar; i++) {
        let dVenc = new Date(dataReferencia);

        // O número da parcela real (se tem entrada, começa do 2)
        const numReal = temEntrada ? i + 1 : i;

        if (i > 1) {
          // Lógica: Próximo mês, dia 05
          dVenc.setMonth(dVenc.getMonth() + 1);
          dVenc.setDate(5);
          dataReferencia = new Date(dVenc);
        }

        novasParcelas.push({
          NumeroParcela: numReal,
          ValorParcela: valorCada,
          DataVencimento: dVenc.toISOString().split('T')[0],
          StatusParcela: 'Pendente',
          FormaPagamento: 'A Prazo'
        });
      }
    }

    setParcelasEditaveis(novasParcelas);
  };


  // GERAÇÃO DE PARCELAS (Depende do total calculado acima)
  useEffect(() => {
    if (totalFinalVenda <= 0) {
      setParcelasEditaveis([]);
      return;
    }

    const numParc = venda.TipoVenda === 'Avista' ? 1 : (parseInt(numeroParcelas) || 1);
    const valorCada = parseFloat((totalFinalVenda / numParc).toFixed(2));
    const novas = [];

    // Pega a data base do formulário
    let dataReferencia = new Date(venda.TipoVenda === 'Avista' ? dataPagamentoAVista : dataPrimeiraParcela);

    for (let i = 1; i <= numParc; i++) {
      let dVenc = new Date(dataReferencia);

      if (i > 1) {
        dVenc.setMonth(dVenc.getMonth() + 1);
        dVenc.setDate(5); // Força dia 05 para as próximas
        dataReferencia = new Date(dVenc);
      }

      novas.push({
        NumeroParcela: i,
        ValorParcela: valorCada,
        DataVencimento: dVenc.toISOString().split('T')[0],
        StatusParcela: (venda.TipoVenda === 'Avista') ? 'Paga' : 'Pendente',
        FormaPagamento: (venda.TipoVenda === 'Avista') ? formaPagamento : 'A Prazo'
      });
    }
    setParcelasEditaveis(novas);
  }, [totalFinalVenda, venda.TipoVenda, numeroParcelas, dataPrimeiraParcela, dataPagamentoAVista, formaPagamento]);


  // GERAÇÃO DE PARCELAS (Lógica completa dentro do efeito)
  useEffect(() => {
    if (totalFinalVenda <= 0) {
      setParcelasEditaveis([]);
      return;
    }

    const numParc = venda.TipoVenda === 'Avista' ? 1 : (parseInt(numeroParcelas) || 1);
    const valorCada = parseFloat((totalFinalVenda / numParc).toFixed(2));
    const novas = [];

    // Pega a data base do formulário
    let dataReferencia = new Date(venda.TipoVenda === 'Avista' ? dataPagamentoAVista : dataPrimeiraParcela);

    for (let i = 1; i <= numParc; i++) {
      let dVenc = new Date(dataReferencia);

      if (i > 1) {
        // Lógica: Próximo mês, dia 05
        dVenc.setMonth(dVenc.getMonth() + 1);
        dVenc.setDate(5);
        dataReferencia = new Date(dVenc);
      }

      novas.push({
        NumeroParcela: i,
        ValorParcela: valorCada,
        DataVencimento: dVenc.toISOString().split('T')[0],
        StatusParcela: (venda.TipoVenda === 'Avista') ? 'Paga' : 'Pendente',
        FormaPagamento: (venda.TipoVenda === 'Avista') ? formaPagamento : 'A Prazo'
      });
    }
    setParcelasEditaveis(novas);
  }, [totalFinalVenda, venda.TipoVenda, numeroParcelas, dataPrimeiraParcela, dataPagamentoAVista, formaPagamento]);


  const [itemAtual, setItemAtual] = useState({
    CodigoProdVendaDet: '', QuantidadeVendaDet: 1, ValorUnitarioVendaDet: 0,
    TotalVendaVendaDet: 0, TipoProdutoVendaDet: '', MaterialVendaDet: '', DescricaoProdutoVendaDet: ''
  })

  // Efeitos de Cálculo (Mantenha as lógicas de useEffect que já tínhamos)
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
      ...prev, CustoProd: custoProd.toFixed(2), ValorEmbalagemProd: valorEmbalagem.toFixed(2),
      CustoTotalProd: custoTotal.toFixed(2), ValorSugeridoProd: valorSugerido.toFixed(2),
      LucroProd: lucroProd.toFixed(2), PorcentagemLucroProd: porcLucro.toFixed(2)
    }))
  }, [produto.ValorOriginalProd, produto.DescontoAplicadoProd, produto.EmbalagemProd, produto.PorcentagemAcrescidaProd, produto.ValorCorrigidoProd])

  useEffect(() => {
    const total = itensVenda.reduce((acc, item) => acc + parseFloat(item.TotalVendaVendaDet || 0), 0) - (venda.DescontoConcedidoVenda || 0)
    setValorPagoAVista(total > 0 ? total : 0)
  }, [itensVenda, venda.DescontoConcedidoVenda])

  // GERAÇÃO DE CÓDIGO DE VENDA ÚNICO E SEGURO
  useEffect(() => {
    if (venda.DataVenda && venda.CodigoCliente) {
      const dataParts = venda.DataVenda.split('-'); // [2026, 04, 03]
      const ano = dataParts[0].slice(-2); // Pega os últimos 2 dígitos do ano (ex: 26)
      const mes = dataParts[1]; // Mês com 2 dígitos (ex: 04)
      const dia = dataParts[2]; // Dia com 2 dígitos (ex: 03)

      const ultimosDigitosCliente = venda.CodigoCliente.slice(-4);

      // Criamos um sufixo aleatório de 3 caracteres para garantir unicidade absoluta
      const aleatorio = Math.random().toString(36).substring(2, 5).toUpperCase();

      // Novo Padrão: V-ANO-MES-DIA-CLIENTE-ALEATORIO
      // Exemplo: V260403-0085-X7Z
      const novoCodigo = `V${ano}${mes}${dia}-${ultimosDigitosCliente}-${aleatorio}`;

      setVenda(prev => ({ ...prev, CodigoVenda: novoCodigo }));
    }
  }, [venda.DataVenda, venda.CodigoCliente]);


  // Funções de Busca e Gravação (Mesma lógica anterior, mas simplificada)
  const selecionarCliente = (c) => {
    setVenda(prev => ({ ...prev, CodigoCliente: c.codCliente, ReferenciaCliente: c.Referencia, NomeCliente: c.Nome }))
    setBuscaCliente(c.Nome); setClientesFiltrados([])
  }

  const selecionarProduto = (p) => {
    setItemAtual({ ...itemAtual, CodigoProdVendaDet: p.CodigoProd, ValorUnitarioVendaDet: p.ValorCorrigidoProd, TipoProdutoVendaDet: p.TipoProd, MaterialVendaDet: p.MaterialProd, DescricaoProdutoVendaDet: p.DescricaoProd, TotalVendaVendaDet: p.ValorCorrigidoProd })
    setBuscaProduto(p.CodigoProd); setProdutosFiltrados([])
  }
  // BUSCA DE CLIENTES ENQUANTO DIGITA
  useEffect(() => {
    const buscarClientes = async () => {
      // Só busca se digitar pelo menos 3 letras para não sobrecarregar o banco
      if (buscaCliente.length >= 3) {
        try {
          // Usamos a porta 3000 onde seu servidor Express está rodando
          const response = await axios.get(`http://localhost:3000/clientes?Nome=${buscaCliente}`);
          setClientesFiltrados(response.data);
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
        }
      } else {
        setClientesFiltrados([]); // Limpa a lista se apagar o texto
      }
    };

    // Criamos um pequeno atraso (debounce) para não disparar a cada tecla
    const timeoutId = setTimeout(() => {
      buscarClientes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [buscaCliente]);
  // CÁLCULO DO TOTAL DA VENDA (Independente)

  useEffect(() => {
    const subtotal = itensVenda.reduce((acc, item) => acc + (parseFloat(item.TotalVendaVendaDet) || 0), 0);
    const desconto = parseFloat(venda.DescontoConcedidoVenda) || 0;
    const total = subtotal - desconto;
    setTotalFinalVenda(total > 0 ? total : 0);

    // Atualiza o valor pago à vista automaticamente se for o caso
    if (venda.TipoVenda === 'Avista') {
      setValorPagoAVista(total > 0 ? total : 0);
    }
  }, [itensVenda, venda.DescontoConcedidoVenda, venda.TipoVenda]);

  // BUSCA DE PRODUTOS ENQUANTO DIGITA
  useEffect(() => {
    const buscarProdutos = async () => {
      // Busca se digitar pelo menos 2 caracteres do código
      if (buscaProduto.length >= 2) {
        try {
          // Buscamos na rota de produtos passando o termo de busca
          const response = await axios.get(`http://localhost:3000/Produtos?CodigoProd=${buscaProduto}`);
          setProdutosFiltrados(response.data);
        } catch (error) {
          console.error("Erro ao buscar produtos:", error);
        }
      } else {
        setProdutosFiltrados([]);
      }
    };

    const timeoutId = setTimeout(() => {
      buscarProdutos();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [buscaProduto]);

  const handleFinalizarVenda = async () => {
    try {
      // 1. Cálculos iniciais
      const valorTotalVenda = itensVenda.reduce((acc, item) => acc + (parseFloat(item.TotalVendaVendaDet) || 0), 0);
      const totalFinal = valorTotalVenda - (parseFloat(venda.DescontoConcedidoVenda) || 0);

      if (itensVenda.length === 0) {
        alert("❌ Adicione pelo menos um item à venda!");
        return;
      }

      if (parcelasEditaveis.length === 0) {
        alert("❌ Gere as parcelas antes de finalizar a venda!");
        return;
      }

      // 2. Gravar a VENDA principal
      const responseVenda = await axios.post('http://localhost:3000/Vendas', {
        ...venda,
        ValorVenda: valorTotalVenda,
        TotalVenda: totalFinal,
        DescontoConcedidoVenda: parseFloat(venda.DescontoConcedidoVenda) || 0
      });

      const codVendaGerado = responseVenda.data.CodigoVenda;

      // 3. Gravar os DETALHES da venda (um por um)
      for (const item of itensVenda) {
        await axios.post('http://localhost:3000/DetalhesVenda', {
          ...item,
          QuantidadeVendaDet: parseInt(item.QuantidadeVendaDet, 10),
          ValorUnitarioVendaDet: parseFloat(item.ValorUnitarioVendaDet),
          TotalVendaVendaDet: parseFloat(item.TotalVendaVendaDet),
          CodigoVendaDet: codVendaGerado,
          DataVendaDet: venda.DataVenda
        });
      }

      // 4. Gravar as PARCELAS (Envia a lista completa para a rota de criação em lote)
      await axios.post('http://localhost:3000/Parcelas/criar', {
        CodigoVenda: codVendaGerado,
        CodigoFinanceiro: venda.CodigoCliente,
        listaParcelas: parcelasEditaveis // Enviamos a lista que você editou na tela
      });

      // 5. Sucesso e Limpeza
      alert('✅ Venda e Financeiro gravados com sucesso!');

      // Limpa os estados para a próxima venda
      setTelaAtiva('home');
      setItensVenda([]);
      setParcelasEditaveis([]);
      setBuscaCliente('');
      setExibirItens(false);
      setDebugData(null); // Limpa o quadro de teste se ainda estiver aberto

    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      alert('❌ Erro ao gravar no banco: ' + (error.response?.data?.error || error.message));
    }
  };




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
          {telaAtiva === 'home' && <Dashboard />}
          {telaAtiva === 'produto' && (
            <TelaProduto
              produto={produto}
              handleChange={(e) => setProduto({ ...produto, [e.target.name]: e.target.value })}
              handleSubmit={async (e) => {
                e.preventDefault(); // Impede a página de recarregar
                try {
                  console.log("Enviando produto:", produto); // Adicione este log para testar no F12
                  await axios.post('http://localhost:3000/Produtos', produto);
                  alert('✅ Produto cadastrado com sucesso!');
                  setTelaAtiva('home');
                } catch (error) {
                  console.error("Erro ao cadastrar:", error);
                  alert('❌ Erro ao cadastrar produto. Verifique se o servidor está rodando.');
                }
              }}
            />
          )}
          {telaAtiva === 'cliente' && (
            <TelaCliente
              cliente={novoCliente}
              handleChange={(e) => setNovoCliente({ ...novoCliente, [e.target.name]: e.target.value })}
              handleSubmit={handleSalvarCliente}
            />
          )}
          {telaAtiva === 'venda' && <TelaVenda
            venda={venda} setVenda={setVenda} buscaCliente={buscaCliente} setBuscaCliente={setBuscaCliente}
            dataPrimeiraParcela={dataPrimeiraParcela} // ADICIONE ESTA
            setDataPrimeiraParcela={setDataPrimeiraParcela} // ADICIONE ESTA
            temEntrada={temEntrada}
            setTemEntrada={setTemEntrada}
            dadosEntrada={dadosEntrada}
            setDadosEntrada={setDadosEntrada}
            gerarFinanceiro={gerarFinanceiro}
            parcelasEditaveis={parcelasEditaveis}
            setParcelasEditaveis={setParcelasEditaveis}
            clientesFiltrados={clientesFiltrados} selecionarCliente={selecionarCliente} exibirItens={exibirItens}
            setExibirItens={setExibirItens} buscaProduto={buscaProduto} setBuscaProduto={setBuscaProduto}
            produtosFiltrados={produtosFiltrados} selecionarProduto={selecionarProduto} itemAtual={itemAtual}
            setItemAtual={setItemAtual} adicionarItem={() => { setItensVenda([...itensVenda, { ...itemAtual, idTemporario: Date.now() }]); setBuscaProduto(''); setItemAtual({ ...itemAtual, CodigoProdVendaDet: '' }) }}
            itensVenda={itensVenda} setItensVenda={setItensVenda} formaPagamento={formaPagamento} setFormaPagamento={setFormaPagamento}
            numeroParcelas={numeroParcelas} setNumeroParcelas={setNumeroParcelas} valorPagoAVista={valorPagoAVista}
            setValorPagoAVista={setValorPagoAVista} dataPagamentoAVista={dataPagamentoAVista} setDataPagamentoAVista={setDataPagamentoAVista}
            handleFinalizarVenda={handleFinalizarVenda}
          />}
        </div>
        {debugData && (
          <div className="mt-10 p-6 bg-slate-900 text-emerald-400 rounded-3xl font-mono text-xs overflow-auto max-h-[500px] border-4 border-emerald-500">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold uppercase underline">Resumo do Envio (TESTE)</h2>
              <button onClick={() => setDebugData(null)} className="bg-red-500 text-white px-4 py-1 rounded-lg">Fechar Teste</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-white font-bold mb-2">TABELA: VENDA</h3>
                <pre>{JSON.stringify(debugData.venda, null, 2)}</pre>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">TABELA: DETALHES VENDA</h3>
                <pre>{JSON.stringify(debugData.detalhes, null, 2)}</pre>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">OBJETO PARA GERAR PARCELAS</h3>
                <pre>{JSON.stringify(debugData.parcelas, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
export default App
