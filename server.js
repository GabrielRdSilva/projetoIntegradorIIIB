/* SENHA Q4QUPfGBJn8gJvtm */
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(cors())

// metodo post para criar um cliente 
app.post('/clientes', async (req, res) => {
    const cliente = await prisma.cliente.create({
        data: {
            codCliente: req.body.codCliente,
            Nome: req.body.Nome,
            Email: req.body.Email,
            Referencia: req.body.Referencia,
            Endereco: req.body.Endereco,
            Contato: req.body.Contato
        }
    })
    clientes.push(cliente)
    res.status(201).json(cliente)
})
// metodo post para criar um produto 
// --- METODO POST PARA CRIAR UM PRODUTO ---
app.post('/Produtos', async (req, res) => {
    try {
        const produto = await prisma.produto.create({
            data: {
                CodigoProd: req.body.CodigoProd,
                CodigoForn: req.body.CodigoForn,
                FornecedorNome: req.body.FornecedorNome,
                LocalForn: req.body.LocalForn,
                TipoProd: req.body.TipoProd,
                DescricaoProd: req.body.DescricaoProd,
                MaterialProd: req.body.MaterialProd,
                QuantidadeProd: Number(req.body.QuantidadeProd), // Conversão para número por segurança
                ValorOriginalProd: Number(req.body.ValorOriginalProd),
                DescontoAplicadoProd: Number(req.body.DescontoAplicadoProd),
                EmbalagemProd: req.body.EmbalagemProd,
                CustoProd: Number(req.body.CustoProd),
                ValorEmbalagemProd: Number(req.body.ValorEmbalagemProd),
                CustoTotalProd: Number(req.body.CustoTotalProd),
                PorcentagemAcrescidaProd: Number(req.body.PorcentagemAcrescidaProd),
                ValorSugeridoProd: Number(req.body.ValorSugeridoProd),
                ValorCorrigidoProd: Number(req.body.ValorCorrigidoProd),
                PorcentagemLucroProd: Number(req.body.PorcentagemLucroProd),
                LucroProd: Number(req.body.LucroProd)
            }
        })
        res.status(201).json(produto)
    } catch (error) {
        res.status(400).json({ error: "Erro ao criar produto. Verifique se o modelo existe no banco." })
    }
})
// --- METODO POST PARA REGISTRAR UMA VENDA ---
app.post('/Vendas', async (req, res) => {
    try {
        const venda = await prisma.venda.create({
            data: {
                DataVenda: req.body.DataVenda ? new Date(req.body.DataVenda) : new Date(),
                CodigoVenda: req.body.CodigoVenda,
                VendedorVenda: req.body.VendedorVenda,
                TipoVenda: req.body.TipoVenda,
                CodigoCliente: req.body.CodigoCliente,
                ReferenciaCliente: req.body.ReferenciaCliente,
                NomeCliente: req.body.NomeCliente,
                ValorVenda: Number(req.body.ValorVenda),
                DescontoConcedidoVenda: Number(req.body.DescontoConcedidoVenda || 0),
                TotalVenda: Number(req.body.TotalVenda)
            }
        })
        res.status(201).json(venda)
    } catch (error) {
        res.status(400).json({ error: "Erro ao registrar venda. Verifique se o CodigoVenda é único." })
    }
})
// --- METODO POST PARA REGISTRAR DETALHES DE UMA VENDA ---
app.post('/DetalhesVenda', async (req, res) => {
    try {
        const detalhe = await prisma.detalheVenda.create({
            data: {
                CodigoVendaDet: req.body.CodigoVendaDet,
                DataVendaDet: new Date(req.body.DataVendaDet), // Recebe a data calculada no frontend
                CodigoProdVendaDet: req.body.CodigoProdVendaDet,
                TipoProdutoVendaDet: req.body.TipoProdutoVendaDet,
                MaterialVendaDet: req.body.MaterialVendaDet,
                DescricaoProdutoVendaDet: req.body.DescricaoProdutoVendaDet,
                QuantidadeVendaDet: Number(req.body.QuantidadeVendaDet),
                ValorUnitarioVendaDet: Number(req.body.ValorUnitarioVendaDet),
                TotalVendaVendaDet: Number(req.body.TotalVendaVendaDet)
            }
        })
        res.status(201).json(detalhe)
    } catch (error) {
        res.status(400).json({ error: "Erro ao registrar detalhe da venda. Verifique os dados enviados." })
    }
})



// --- METODO GET PARA LISTAR clientes ---
const clientes = []
app.get('/clientes', async (req, res) => {
    /*console.log(req)*/

    let clientes = []
    if (req.query) {
        clientes = await prisma.cliente.findMany({
            where: {
                Nome: req.query.Nome,
                codCliente: req.query.codCliente,
                Referencia: req.query.Referencia,
                Email: req.query.Email,
                Endereco: req.query.Endereco,
                Contato: req.query.Contato
            }
        })
    } else {
        const clientes = await prisma.cliente.findMany()
    }
    res.status(200).json(clientes)
})
// --- METODO GET PARA LISTAR PRODUTOS (Baseado em Clientes) ---
app.get('/Produtos', async (req, res) => {
    let produtos = []

    // Verifica se há parâmetros de busca na URL (query strings)
    if (Object.keys(req.query).length > 0) {
        produtos = await prisma.produto.findMany({
            where: {
                CodigoProd: req.query.CodigoProd,
                CodigoForn: req.query.CodigoForn,
                FornecedorNome: req.query.FornecedorNome,
                TipoProd: req.query.TipoProd,
                DescricaoProd: req.query.DescricaoProd,
                MaterialProd: req.query.MaterialProd,
                ValorCorrigidoProd: req.query.ValorCorrigidoProd // Adicione outros filtros se desejar
            }
        })
    } else {
        // Se não houver filtros, busca todos
        produtos = await prisma.produto.findMany()
    }

    res.status(200).json(produtos)
})
// --- METODO GET PARA LISTAR VENDAS ---
app.get('/Vendas', async (req, res) => {
    let vendas = []

    // Verifica se há parâmetros de busca (ex: por Vendedor ou Código de Venda)
    if (Object.keys(req.query).length > 0) {
        vendas = await prisma.venda.findMany({
            where: {
                CodigoCliente: req.query.CodigoCliente,
                NomeCliente: req.query.NomeCliente,
                CodigoVenda: req.query.CodigoVenda,
                VendedorVenda: req.query.VendedorVenda,
                TipoVenda: req.query.TipoVenda
            }
        })
    } else {
        vendas = await prisma.venda.findMany()
    }
    res.status(200).json(vendas)
})
// --- METODO GET PARA LISTAR DETALHES (Permite filtrar por Código da Venda) ---
app.get('/DetalhesVenda', async (req, res) => {
    let detalhes = []
    
    // Filtro principal: buscar todos os itens de uma venda específica
    if (req.query.CodigoVendaDet) {
        detalhes = await prisma.detalheVenda.findMany({
            where: {
                CodigoVendaDet: req.query.CodigoVendaDet
            }
        })
    } else {
        detalhes = await prisma.detalheVenda.findMany()
    }
    res.status(200).json(detalhes)
})


// --- METODO PUT PARA ALTERAR UMA VENDA ---
app.put('/Vendas/:id', async (req, res) => {
    const { id } = req.params
    try {
        const vendaAtualizada = await prisma.venda.update({
            where: { id: id },
            data: {
                DataVenda: req.body.DataVenda ? new Date(req.body.DataVenda) : undefined,
                CodigoVenda: req.body.CodigoVenda,
                VendedorVenda: req.body.VendedorVenda,
                TipoVenda: req.body.TipoVenda,
                CodigoCliente: req.body.CodigoCliente,
                ReferenciaCliente: req.body.ReferenciaCliente,
                NomeCliente: req.body.NomeCliente,
                ValorVenda: Number(req.body.ValorVenda),
                DescontoConcedidoVenda: Number(req.body.DescontoConcedidoVenda),
                TotalVenda: Number(req.body.TotalVenda)
            }
        })
        res.status(200).json(vendaAtualizada)
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar venda. Verifique o ID fornecido." })
    }
})

// --- METODO PUT PARA ALTERAR UM cliente ---
app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params
    const clienteAtualizado = await prisma.cliente.update({
        where: { id: id },
        data: {
            codCliente: req.body.codCliente,
            Nome: req.body.Nome,
            Email: req.body.Email,
            Referencia: req.body.Referencia,
            Endereco: req.body.Endereco,
            Contato: req.body.Contato
        }
    })
    res.status(200).json(clienteAtualizado)
})
// --- METODO PUT PARA ALTERAR UM PRODUTO ---
app.put('/Produtos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const produtoAtualizado = await prisma.produto.update({
            where: { id: id },
            data: {
                CodigoProd: req.body.CodigoProd,
                CodigoForn: req.body.CodigoForn,
                FornecedorNome: req.body.FornecedorNome,
                LocalForn: req.body.LocalForn,
                TipoProd: req.body.TipoProd,
                DescricaoProd: req.body.DescricaoProd,
                MaterialProd: req.body.MaterialProd,
                QuantidadeProd: Number(req.body.QuantidadeProd),
                ValorOriginalProd: Number(req.body.ValorOriginalProd),
                DescontoAplicadoProd: Number(req.body.DescontoAplicadoProd),
                EmbalagemProd: req.body.EmbalagemProd,
                CustoProd: Number(req.body.CustoProd),
                ValorEmbalagemProd: Number(req.body.ValorEmbalagemProd),
                CustoTotalProd: Number(req.body.CustoTotalProd),
                PorcentagemAcrescidaProd: Number(req.body.PorcentagemAcrescidaProd),
                ValorSugeridoProd: Number(req.body.ValorSugeridoProd),
                ValorCorrigidoProd: Number(req.body.ValorCorrigidoProd),
                PorcentagemLucroProd: Number(req.body.PorcentagemLucroProd),
                LucroProd: Number(req.body.LucroProd)
            }
        })
        res.status(200).json(produtoAtualizado)
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar produto. Verifique se o ID está correto." })
    }
})
// --- METODO PUT PARA ALTERAR UM DETALHE ---
app.put('/DetalhesVenda/:id', async (req, res) => {
    const { id } = req.params
    try {
        const detalheAtualizado = await prisma.detalheVenda.update({
            where: { id: id },
            data: {
                CodigoVendaDet: req.body.CodigoVendaDet,
                DataVendaDet: new Date(req.body.DataVendaDet),
                CodigoProdVendaDet: req.body.CodigoProdVendaDet,
                TipoProdutoVendaDet: req.body.TipoProdutoVendaDet,
                MaterialVendaDet: req.body.MaterialVendaDet,
                DescricaoProdutoVendaDet: req.body.DescricaoProdutoVendaDet,
                QuantidadeVendaDet: Number(req.body.QuantidadeVendaDet),
                ValorUnitarioVendaDet: Number(req.body.ValorUnitarioVendaDet),
                TotalVendaVendaDet: Number(req.body.TotalVendaVendaDet)
            }
        })
        res.status(200).json(detalheAtualizado)
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar detalhe. Verifique o ID." })
    }
})


// --- METODO DELETE PARA EXCLUIR UM cliente---
app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params
    await prisma.cliente.delete({
        where: { id: id },
    })
    res.status(200).json({ message: 'Cliente deletado...' })
})
// --- METODO DELETE PARA EXCLUIR UM PRODUTO ---
app.delete('/Produtos/:id', async (req, res) => {
    const { id } = req.params
    try {
        await prisma.produto.delete({
            where: { id: id },
        })
        res.status(200).json({ message: 'Produto deletado com sucesso!' })
    } catch (error) {
        res.status(400).json({ error: "Erro ao deletar produto. Verifique se o ID existe." })
    }
})

// --- METODO DELETE PARA EXCLUIR UMA VENDA (Com Trava de Segurança) ---
app.delete('/Vendas/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        // 1. Primeiro, buscamos a venda para saber qual é o seu CodigoVenda
        const venda = await prisma.venda.findUnique({
            where: { id: id }
        })

        if (!venda) {
            return res.status(404).json({ error: "Venda não encontrada." })
        }

        // 2. Verificamos se existem itens em detalheVenda vinculados a este CodigoVenda
        const temDetalhes = await prisma.detalheVenda.findFirst({
            where: { CodigoVendaDet: venda.CodigoVenda }
        })

        // 3. Se houver detalhes, impedimos a exclusão
        if (temDetalhes) {
            return res.status(403).json({ 
                error: "Não é possível excluir esta venda pois existem itens vinculados a ela nos Detalhes de Venda. Exclua os itens primeiro." 
            })
        }

        // 4. Se não houver detalhes, prosseguimos com a exclusão
        await prisma.venda.delete({
            where: { id: id },
        })

        res.status(200).json({ message: 'Venda excluída com sucesso!' })

    } catch (error) {
        res.status(500).json({ error: "Erro interno ao processar a exclusão da venda." })
    }
})

// --- METODO DELETE PARA EXCLUIR UM DETALHE ---
app.delete('/DetalhesVenda/:id', async (req, res) => {
    const { id } = req.params
    try {
        await prisma.detalheVenda.delete({
            where: { id: id },
        })
        res.status(200).json({ message: 'Item da venda removido com sucesso!' })
    } catch (error) {
        res.status(400).json({ error: "Erro ao excluir detalhe. Verifique se o ID existe." })
    }
})





app.get('/', (req, res) => {
    res.send('API de Clientes está funcionando! 🚀')
})
app.listen(3000)
