import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Button from "./components/Button";
import Dashboard from "./pages/Dashboard";
import TelaProduto from "./pages/TelaProduto";
import TelaVenda from "./pages/TelaVenda";
import TelaCliente from "./pages/TelaCliente"; // ADICIONE ESTA LINHA
import ListaClientes from "./pages/ListaClientes"; // ADICIONE ESTA LINHA
import ListaProdutos from "./pages/ListaProdutos";
import ListaVendas from "./pages/ListaVendas";
import DetalheVenda from "./pages/DetalheVenda";
import Cobranca from "./pages/Cobranca"; // ADICIONE ESTA LINHA

function App() {
  const [telaAtiva, setTelaAtiva] = useState('home')
  const [listaProdutos, setListaProdutos] = useState([]);
  const [modoEdicaoProduto, setModoEdicaoProduto] = useState(false);
  const [listaClientes, setListaClientes] = useState([]);
  const [modoVenda, setModoVenda] = useState('lista'); // 'lista', 'cadastro' ou 'detalhe'
  const [modoEdicaoVenda, setModoEdicaoVenda] = useState(false); // Novo estado para controlar o modo de edição de venda
  const [parcelasOriginaisEdicao, setParcelasOriginaisEdicao] = useState([]);

  const [vendaEmDetalhe, setVendaEmDetalhe] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
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
  // Novos estados para Vendas
  const [listaVendas, setListaVendas] = useState([]);
  const [filtrosVendas, setFiltrosVendas] = useState({ nomeCliente: '', codCliente: '', dataVenda: '' });
  const [dadosEntrada, setDadosEntrada] = useState({
    valor: 0, data: new Date().toISOString().split('T')[0], forma: 'Pix', status: 'Paga'
  });
  const [produto, setProduto] = useState({
    id: null, CodigoProd: '', CodigoForn: '', FornecedorNome: '', LocalForn: '',
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
    id: null,           // ← ADICIONE ESTA LINHA
    codCliente: `CLIEN-${Math.floor(1000 + Math.random() * 9000)}`,
    Nome: '',
    Email: '',
    Referencia: '',
    Endereco: '',
    Contato: '' // Será convertido para Int no envio
  });

  const buscarProximoCodigoCliente = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes/proximo-codigo');
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
  // Carregar clientes do banco
  const carregarClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes');
      setListaClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  useEffect(() => {
    if (telaAtiva === 'cliente') carregarClientes();
  }, [telaAtiva]);

  // Função para Excluir
  const handleExcluirCliente = async (cliente) => {
    const confirmou = window.confirm(`⚠️ Tem certeza que deseja excluir o cliente "${cliente.Nome}"?\nEsta ação não pode ser desfeita.`);

    if (confirmou) {
      try {
        await axios.delete(`http://localhost:3000/clientes/${cliente.id}`);
        alert('✅ Cliente excluído com sucesso!');
        carregarClientes(); // Recarrega a lista
      } catch (error) {
        alert('❌ Erro ao excluir: ' + error.message);
      }
    }
  };
  // Carregar produtos do banco
  const carregarProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Produtos');
      setListaProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };
  const carregarVendas = async () => {
    try {
      // Construir query string para filtros
      const params = new URLSearchParams();
      if (filtrosVendas.nomeCliente) params.append('nome', filtrosVendas.nomeCliente);
      if (filtrosVendas.codCliente) params.append('codCliente', filtrosVendas.codCliente);
      if (filtrosVendas.dataVenda) params.append('data', filtrosVendas.dataVenda);

      const response = await axios.get(`http://localhost:3000/Vendas?${params.toString()}`);
      setListaVendas(response.data);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    }
  };

  // Atualizar a navegação para resetar o modo de edição de produtos também
  const navegarPara = (tela) => {
    setTelaAtiva(tela);
    if (tela === 'cliente') {
      setModoEdicao(false);
      carregarClientes();
    }
    if (tela === 'produto') {
      setModoEdicaoProduto(false);
      carregarProdutos();
    }
    if (tela === 'venda') {
      setModoVenda('lista');
      setVendaEmDetalhe(null);
      setModoEdicaoVenda(false);
      carregarVendas();
    }
  };


  // Função para Excluir Produto
  const handleExcluirProduto = async (produto) => {
    const confirmou = window.confirm(`⚠️ Deseja excluir o produto "${produto.DescricaoProd}"?\nEsta ação é permanente.`);
    if (confirmou) {
      try {
        await axios.delete(`http://localhost:3000/Produtos/${produto.id}`);
        alert('✅ Produto removido com sucesso!');
        carregarProdutos();
      } catch (error) {
        alert('❌ Erro ao excluir: ' + error.message);
      }
    }
  };

  const handleSalvarCliente = async (e) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        ...novoCliente,
        Contato: parseInt(novoCliente.Contato, 10) || 0
      };

      // Verifica se é edição (se existe id)
      if (novoCliente.id) {
        // PUT para atualizar
        await axios.put(`http://localhost:3000/clientes/${novoCliente.id}`, dadosParaEnviar);
        alert('✅ Cliente atualizado com sucesso!');
      } else {
        // POST para criar novo
        await axios.post('http://localhost:3000/clientes', dadosParaEnviar);
        alert('✅ Cliente gravado com sucesso!');
        await buscarProximoCodigoCliente(); // só gera novo código se for criação

        // Limpa os campos (mantendo o novo código)
        setNovoCliente(prev => ({
          ...prev,
          Nome: '', Email: '', Referencia: '', Endereco: '', Contato: ''
        }));
      }

      setTelaAtiva('home');
      carregarClientes(); // recarrega a lista
      setModoEdicao(false); // sai do modo edição
    } catch (error) {
      alert('❌ Erro ao salvar cliente: ' + error.message);
    }
  };

  const handleChangeProduto = (e) => {
    const { name, value } = e.target;
    setProduto(prev => ({ ...prev, [name]: value }));
  };

  const gerarFinanceiro = () => {
    const subtotal = itensVenda.reduce((acc, item) => acc + (parseFloat(item.TotalVendaVendaDet) || 0), 0);
    const desconto = parseFloat(venda.DescontoConcedidoVenda) || 0;
    const totalVendaAtual = subtotal - desconto;

    // 1. OLHAMOS PARA O BACKUP: O que já estava pago no banco?
    const parcelasPagasNoBanco = parcelasOriginaisEdicao.filter(p => p.StatusParcela === 'Paga');
    const totalJaPagoNoBanco = parcelasPagasNoBanco.reduce((acc, p) => acc + (parseFloat(p.ValorParcela) || 0), 0);

    // 2. Valor da NOVA Entrada configurada agora
    const valorNovaEntrada = temEntrada ? parseFloat(dadosEntrada.valor) : 0;

    // 3. Saldo Devedor Real
    const saldoDevedor = totalVendaAtual - totalJaPagoNoBanco - valorNovaEntrada;

    if (saldoDevedor < -0.01) {
      alert(`❌ Valor excedido! \nJá Pago: R$ ${totalJaPagoNoBanco.toFixed(2)}\nNova Entrada: R$ ${valorNovaEntrada.toFixed(2)}\nTotal Venda: R$ ${totalVendaAtual.toFixed(2)}`);
      return;
    }

    // 4. RECONSTRUÇÃO DA LISTA
    // Começamos com as pagas que vieram do banco
    const novasParcelas = [...parcelasPagasNoBanco];

    // 5. Adicionamos a Nova Entrada (se houver)
    if (valorNovaEntrada > 0) {
        novasParcelas.push({
            NumeroParcela: novasParcelas.length + 1,
            ValorParcela: valorNovaEntrada, ValorRecebido: valorNovaEntrada,
            DataVencimento: dadosEntrada.data, DataPagamento: dadosEntrada.data,
            StatusParcela: 'Paga',
            FormaPagamento: dadosEntrada.forma,
            Observacoes: "Nova Entrada (Renegociação)"
        });
    }

    // 6. Geramos as novas parcelas Pendentes
    const qtdParaGerar = parseInt(numeroParcelas) || 0;
    if (qtdParaGerar > 0 && saldoDevedor > 0) {
      const valorCada = parseFloat((saldoDevedor / qtdParaGerar).toFixed(2));
      let dataReferencia = new Date(dataPrimeiraParcela);

      for (let i = 1; i <= qtdParaGerar; i++) {
        let dVenc = new Date(dataReferencia);
        if (i > 1) {
          dVenc.setMonth(dVenc.getMonth() + 1);
          dVenc.setDate(5);
          dataReferencia = new Date(dVenc);
        }

        novasParcelas.push({
          NumeroParcela: novasParcelas.length + 1,
          ValorParcela: valorCada,
          DataVencimento: dVenc.toISOString().split('T')[0],
          StatusParcela: 'Pendente',
          FormaPagamento: 'A Prazo',
          Observacoes: "Renegociada"
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

  // GERAÇÃO DE CÓDIGO DE VENDA ÚNICO E SEGURO (APENAS PARA NOVAS VENDAS)
  useEffect(() => {
    if (!modoEdicaoVenda && venda.DataVenda && venda.CodigoCliente) {
      const dataParts = venda.DataVenda.split('-'); // Use aspas simples normais aqui

      const ano = dataParts[0].slice(-2); // Pega os últimos 2 dígitos do ano (ex: 26)
      const mes = dataParts[1]; // Mês com 2 dígitos (ex: 04)
      const dia = dataParts[2]; // Dia com 2 dígitos (ex: 03]

      const ultimosDigitosCliente = venda.CodigoCliente.slice(-4);

      // Criamos um sufixo aleatório de 3 caracteres para garantir unicidade absoluta
      const aleatorio = Math.random().toString(36).substring(2, 5).toUpperCase();

      // Novo Padrão: V-ANO-MES-DIA-CLIENTE-ALEATORIO
      // Exemplo: V260403-0085-X7Z
      const novoCodigo = `V${ano}${mes}${dia}-${ultimosDigitosCliente}-${aleatorio}`;

      setVenda(prev => ({ ...prev, CodigoVenda: novoCodigo }));
    }
  }, [venda.DataVenda, venda.CodigoCliente, modoEdicaoVenda]);



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

  useEffect(() => {
    if (telaAtiva === 'produto') {
      carregarProdutos();
    }
  }, [telaAtiva]);
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
      const valorTotalVenda = itensVenda.reduce((acc, item) => acc + (parseFloat(item.TotalVendaVendaDet) || 0), 0);
      const totalFinal = valorTotalVenda - (parseFloat(venda.DescontoConcedidoVenda) || 0);

      if (itensVenda.length === 0) return alert("❌ Adicione itens!");
      if (parcelasEditaveis.length === 0) return alert("❌ Gere as parcelas!");

      const dadosParaEnviar = {
        vendaData: { ...venda, ValorVenda: valorTotalVenda, TotalVenda: totalFinal },
        itensVenda: itensVenda,
        parcelasData: parcelasEditaveis
      };

      if (modoEdicaoVenda && venda.id) {
        await axios.put(`http://localhost:3000/Vendas/${venda.id}`, dadosParaEnviar);
        alert('✅ Venda atualizada!');
      } else {
        // Lógica de criação original...
        const res = await axios.post('http://localhost:3000/Vendas', dadosParaEnviar.vendaData);
        const cod = res.data.CodigoVenda;
        for (const item of itensVenda) {
          await axios.post('http://localhost:3000/DetalhesVenda', { ...item, CodigoVendaDet: cod, DataVendaDet: venda.DataVenda });
        }
        await axios.post('http://localhost:3000/Parcelas/criar', {
          CodigoVenda: cod,
          CodigoFinanceiro: venda.CodigoCliente,
          listaParcelas: parcelasEditaveis
        });
        alert('✅ Venda gravada!');
      }

      setTelaAtiva('home');
      setModoVenda('lista');
      setModoEdicaoVenda(false);
    } catch (error) {
      alert('❌ Erro: ' + error.message);
    }
  };



  const handleSalvarProduto = async (e) => {
    e.preventDefault();
    try {
      if (produto.id) {
        // Edição: PUT
        await axios.put(`http://localhost:3000/Produtos/${produto.id}`, produto);
        alert('✅ Produto atualizado com sucesso!');
      } else {
        // Criação: POST
        await axios.post('http://localhost:3000/Produtos', produto);
        alert('✅ Produto cadastrado com sucesso!');
      }
      // Após salvar, volta para a lista e recarrega os produtos
      setModoEdicaoProduto(false);
      carregarProdutos(); // função que busca a lista atualizada
    } catch (error) {
      console.error(error);
      alert('❌ Erro ao salvar produto: ' + error.message);
    }
  };

  // Função chamada ao clicar em "Novo Produto"
  // ✅ CORRETO
  const aoNovoProduto = () => {
    setProduto({
      id: null,
      CodigoProd: '', CodigoForn: '', FornecedorNome: '', LocalForn: '',
      TipoProd: '', DescricaoProd: '', MaterialProd: '', QuantidadeProd: '',
      ValorOriginalProd: '', DescontoAplicadoProd: '', EmbalagemProd: 'não',
      CustoProd: 0, ValorEmbalagemProd: 0, CustoTotalProd: 0,
      PorcentagemAcrescidaProd: '', ValorSugeridoProd: 0, ValorCorrigidoProd: '',
      PorcentagemLucroProd: 0, LucroProd: 0
    });
    setModoEdicaoProduto(true);
  };

  // Função chamada ao clicar em "Editar" em um produto da lista
  const aoEditarProduto = (p) => {
    setProduto(p); // p já contém id e todos os campos
    setModoEdicaoProduto(true);
  };



  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar setTelaAtiva={navegarPara} telaAtiva={telaAtiva} />
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
            modoEdicaoProduto ? (
              <TelaProduto
                produto={produto}
                handleChange={handleChangeProduto} // Use sua função de cálculo de lucro aqui
                handleSubmit={handleSalvarProduto}
                aoCancelar={() => setModoEdicaoProduto(false)}
              />
            ) : (
              <ListaProdutos
                produtos={listaProdutos}
                aoEditar={aoEditarProduto}
                aoExcluir={handleExcluirProduto}
                aoNovo={aoNovoProduto}
              />
            )
          )}

          {telaAtiva === 'cliente' && (
            modoEdicao ? (
              <TelaCliente
                cliente={novoCliente}
                handleChange={(e) => setNovoCliente({ ...novoCliente, [e.target.name]: e.target.value })}
                handleSubmit={handleSalvarCliente}
                aoCancelar={() => setModoEdicao(false)}
              />
            ) : (
              <ListaClientes
                clientes={listaClientes}
                aoEditar={(c) => {
                  // Aqui sim você define o que acontece ao clicar em Editar
                  setNovoCliente({
                    id: c.id,
                    codCliente: c.codCliente,
                    Nome: c.Nome,
                    Email: c.Email,
                    Referencia: c.Referencia,
                    Endereco: c.Endereco,
                    Contato: c.Contato
                  });
                  setModoEdicao(true);
                }}
                aoExcluir={handleExcluirCliente}
                aoNovo={() => {
                  setNovoCliente({
                    id: null,
                    codCliente: `CLIEN-${Math.floor(1000 + Math.random() * 9000)}`,
                    Nome: '', Email: '', Referencia: '', Endereco: '', Contato: ''
                  });
                  setModoEdicao(true);
                  buscarProximoCodigoCliente();
                }}
              />
            )
          )}
          {telaAtiva === 'cobranca' && <Cobranca />}
          {telaAtiva === 'venda' && (
            modoVenda === 'lista' ? (
              <ListaVendas
                vendas={listaVendas}
                aoNovaVenda={() => {
                  setModoEdicaoVenda(false); // Garante que é uma nova venda
                  setVenda({
                    DataVenda: new Date().toISOString().split('T')[0],
                    CodigoVenda: '', VendedorVenda: 'Gabriel Rodrigues', TipoVenda: 'Avista',
                    CodigoCliente: '', ReferenciaCliente: '', NomeCliente: '',
                    ValorVenda: 0, DescontoConcedidoVenda: 0, TotalVenda: 0
                  });
                  setItensVenda([]);
                  setParcelasEditaveis([]);
                  setModoVenda('cadastro');
                }}
                aoDetalhar={(v) => { setVendaEmDetalhe(v); setModoVenda('detalhe'); }}
                aoEditarVenda={async (vendaId) => {
                  try {
                    const response = await axios.get(`http://localhost:3000/Vendas/${vendaId}`);
                    const vendaCarregada = response.data;

                    vendaCarregada.DataVenda = vendaCarregada.DataVenda.split('T')[0];
                    setVenda(vendaCarregada);

                    setItensVenda(vendaCarregada.itensVenda.map(item => ({
                      ...item,
                      DataVendaDet: item.DataVendaDet.split('T')[0],
                      idTemporario: item.id
                    })));

                    // SALVAMOS AS PARCELAS ORIGINAIS AQUI
                    const parcelasFormatadas = vendaCarregada.parcelas.map(p => ({
                      ...p,
                      DataVencimento: p.DataVencimento.split('T')[0],
                      DataPagamento: p.DataPagamento ? p.DataPagamento.split('T')[0] : null,
                      ValorParcela: parseFloat(p.ValorParcela)
                    }));

                    setParcelasEditaveis(parcelasFormatadas);
                    setParcelasOriginaisEdicao(parcelasFormatadas); // BACKUP PARA RENEGOCIAÇÃO

                    setModoEdicaoVenda(true);
                    setModoVenda('cadastro');
                  } catch (error) {
                    console.error("Erro ao carregar venda:", error);
                    alert("❌ Erro ao carregar venda.");
                  }
                }}

                filtros={filtrosVendas}
                setFiltros={setFiltrosVendas}
                aoBuscar={carregarVendas}
              />
            ) : modoVenda === 'cadastro' ? (
              <TelaVenda
                venda={venda} setVenda={setVenda} buscaCliente={buscaCliente} setBuscaCliente={setBuscaCliente}
                dataPrimeiraParcela={dataPrimeiraParcela}
                setDataPrimeiraParcela={setDataPrimeiraParcela}
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
                modoEdicaoVenda={modoEdicaoVenda} // Passa o modo de edição para TelaVenda
              />
            ) : (
              <DetalheVenda venda={vendaEmDetalhe} aoVoltar={() => setModoVenda('lista')} />
            ))}

        </div>
      </main>
    </div>
  )
}
export default App
