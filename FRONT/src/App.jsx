import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Button from "./components/Button";
import Dashboard from "./pages/Dashboard";
import TelaProduto from "./pages/TelaProduto";
import TelaVenda from "./pages/TelaVenda"; 
import TelaCliente from "./pages/TelaCliente"; 
import ListaClientes from "./pages/ListaClientes"; 
import ListaProdutos from "./pages/ListaProdutos";
import ListaVendas from "./pages/ListaVendas";
import DetalheVenda from "./pages/DetalheVenda";
import Cobranca from "./pages/Cobranca"; 

function App() {
  const [telaAtiva, setTelaAtiva] = useState('home')
  const [listaProdutos, setListaProdutos] = useState([]);
  const [modoEdicaoProduto, setModoEdicaoProduto] = useState(false);
  const [listaClientes, setListaClientes] = useState([]);
  const [modoVenda, setModoVenda] = useState('lista'); 
  const [modoEdicaoVenda, setModoEdicaoVenda] = useState(false);  

  const [parcelasOriginaisEdicao, setParcelasOriginaisEdicao] = useState([]);

  const [vendaEmDetalhe, setVendaEmDetalhe] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [buscaCliente, setBuscaCliente] = useState('')
  const [clientesFiltrados, setClientesFiltrados] = useState([])
  const [buscaProduto, setBuscaProduto] = useState('')
  const [produtosFiltrados, setProdutosFiltrados] = useState([])
  const [itensVenda, setItensVenda] = useState([])
  const [dataPrimeiraParcela, setDataPrimeiraParcela] = useState(new Date().toISOString().split('T')[0]);
  const [debugData, setDebugData] = useState(null); 
  const [parcelasEditaveis, setParcelasEditaveis] = useState([]);
  const [exibirItens, setExibirItens] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro')
  const [numeroParcelas, setNumeroParcelas] = useState(3)
  const [dataPagamentoAVista, setDataPagamentoAVista] = useState(new Date().toISOString().split('T')[0])
  const [valorPagoAVista, setValorPagoAVista] = useState(0)
  const [totalFinalVenda, setTotalFinalVenda] = useState(0);
  const [temEntrada, setTemEntrada] = useState(false);
  
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

  const [novoCliente, setNovoCliente] = useState({
    id: null,       
    codCliente: `CLIEN-${Math.floor(1000 + Math.random() * 9000)}`,
    Nome: '',
    Email: '',
    Referencia: '',
    Endereco: '',
    Contato: '' 
  });

  const buscarProximoCodigoCliente = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes/proximo-codigo');
      setNovoCliente(prev => ({ ...prev, codCliente: response.data.proximoCodigo }));
    } catch (error) {
      console.error("Erro ao buscar próximo código:", error);
    }
  };


  useEffect(() => {
    if (telaAtiva === 'cliente') {
      buscarProximoCodigoCliente();
    }
  }, [telaAtiva]);

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


  const handleExcluirCliente = async (cliente) => {
    const confirmou = window.confirm(`⚠️ Tem certeza que deseja excluir o cliente "${cliente.Nome}"?\nEsta ação não pode ser desfeita.`);

    if (confirmou) {
      try {
        await axios.delete(`http://localhost:3000/clientes/${cliente.id}`);
        alert('✅ Cliente excluído com sucesso!');
        carregarClientes(); 
      } catch (error) {
        alert('❌ Erro ao excluir: ' + error.message);
      }
    }
  };

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


      if (novoCliente.id) {

        await axios.put(`http://localhost:3000/clientes/${novoCliente.id}`, dadosParaEnviar);
        alert('✅ Cliente atualizado com sucesso!');
      } else {

        await axios.post('http://localhost:3000/clientes', dadosParaEnviar);
        alert('✅ Cliente gravado com sucesso!');
        await buscarProximoCodigoCliente(); 


        setNovoCliente(prev => ({
          ...prev,
          Nome: '', Email: '', Referencia: '', Endereco: '', Contato: ''
        }));
      }

      setTelaAtiva('home');
      carregarClientes(); 
      setModoEdicao(false); 
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

  
    const parcelasPagasNoBanco = parcelasOriginaisEdicao.filter(p => p.StatusParcela === 'Paga');
    const totalJaPagoNoBanco = parcelasPagasNoBanco.reduce((acc, p) => acc + (parseFloat(p.ValorParcela) || 0), 0);

  
    const valorNovaEntrada = temEntrada ? parseFloat(dadosEntrada.valor) : 0;

  
    const saldoDevedor = totalVendaAtual - totalJaPagoNoBanco - valorNovaEntrada;

    if (saldoDevedor < -0.01) {
      alert(`❌ Valor excedido! \nJá Pago: R$ ${totalJaPagoNoBanco.toFixed(2)}\nNova Entrada: R$ ${valorNovaEntrada.toFixed(2)}\nTotal Venda: R$ ${totalVendaAtual.toFixed(2)}`);
      return;
    }

 
    const novasParcelas = [...parcelasPagasNoBanco];

  
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



  useEffect(() => {
    if (totalFinalVenda <= 0) {
      setParcelasEditaveis([]);
      return;
    }

    const numParc = venda.TipoVenda === 'Avista' ? 1 : (parseInt(numeroParcelas) || 1);
    const valorCada = parseFloat((totalFinalVenda / numParc).toFixed(2));
    const novas = [];


    let dataReferencia = new Date(venda.TipoVenda === 'Avista' ? dataPagamentoAVista : dataPrimeiraParcela);

    for (let i = 1; i <= numParc; i++) {
      let dVenc = new Date(dataReferencia);

      if (i > 1) {
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

 
  useEffect(() => {
    if (!modoEdicaoVenda && venda.DataVenda && venda.CodigoCliente) {
      const dataParts = venda.DataVenda.split('-'); 

      const ano = dataParts[0].slice(-2); 
      const mes = dataParts[1]; 
      const dia = dataParts[2]; 

      const ultimosDigitosCliente = venda.CodigoCliente.slice(-4);

      
      const aleatorio = Math.random().toString(36).substring(2, 5).toUpperCase();

      
    
      const novoCodigo = `V${ano}${mes}${dia}-${ultimosDigitosCliente}-${aleatorio}`;

      setVenda(prev => ({ ...prev, CodigoVenda: novoCodigo }));
    }
  }, [venda.DataVenda, venda.CodigoCliente, modoEdicaoVenda]);



  
  const selecionarCliente = (c) => {
    setVenda(prev => ({ ...prev, CodigoCliente: c.codCliente, ReferenciaCliente: c.Referencia, NomeCliente: c.Nome }))
    setBuscaCliente(c.Nome); setClientesFiltrados([])
  }

  const selecionarProduto = (p) => {
    setItemAtual({ ...itemAtual, CodigoProdVendaDet: p.CodigoProd, ValorUnitarioVendaDet: p.ValorCorrigidoProd, TipoProdutoVendaDet: p.TipoProd, MaterialVendaDet: p.MaterialProd, DescricaoProdutoVendaDet: p.DescricaoProd, TotalVendaVendaDet: p.ValorCorrigidoProd })
    setBuscaProduto(p.CodigoProd); setProdutosFiltrados([])
  }

  useEffect(() => {
    const buscarClientes = async () => {
   
      if (buscaCliente.length >= 3) {
        try {
   
          const response = await axios.get(`http://localhost:3000/clientes?Nome=${buscaCliente}`);
          setClientesFiltrados(response.data);
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
        }
      } else {
        setClientesFiltrados([]); 
      }
    };


    const timeoutId = setTimeout(() => {
      buscarClientes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [buscaCliente]);
 

  useEffect(() => {
    const subtotal = itensVenda.reduce((acc, item) => acc + (parseFloat(item.TotalVendaVendaDet) || 0), 0);
    const desconto = parseFloat(venda.DescontoConcedidoVenda) || 0;
    const total = subtotal - desconto;
    setTotalFinalVenda(total > 0 ? total : 0);


    if (venda.TipoVenda === 'Avista') {
      setValorPagoAVista(total > 0 ? total : 0);
    }
  }, [itensVenda, venda.DescontoConcedidoVenda, venda.TipoVenda]);

  useEffect(() => {
    if (telaAtiva === 'produto') {
      carregarProdutos();
    }
  }, [telaAtiva]);

  useEffect(() => {
    const buscarProdutos = async () => {

      if (buscaProduto.length >= 2) {
        try {

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

        await axios.put(`http://localhost:3000/Produtos/${produto.id}`, produto);
        alert('✅ Produto atualizado com sucesso!');
      } else {

        await axios.post('http://localhost:3000/Produtos', produto);
        alert('✅ Produto cadastrado com sucesso!');
      }

      setModoEdicaoProduto(false);
      carregarProdutos(); 
    } catch (error) {
      console.error(error);
      alert('❌ Erro ao salvar produto: ' + error.message);
    }
  };



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


  const aoEditarProduto = (p) => {
    setProduto(p); 
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
                handleChange={handleChangeProduto} 

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
                  setModoEdicaoVenda(false); 
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


                    const parcelasFormatadas = vendaCarregada.parcelas.map(p => ({
                      ...p,
                      DataVencimento: p.DataVencimento.split('T')[0],
                      DataPagamento: p.DataPagamento ? p.DataPagamento.split('T')[0] : null,
                      ValorParcela: parseFloat(p.ValorParcela)
                    }));

                    setParcelasEditaveis(parcelasFormatadas);
                    setParcelasOriginaisEdicao(parcelasFormatadas); 

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
                modoEdicaoVenda={modoEdicaoVenda} 
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
