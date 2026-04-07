import React from "react"
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { BadgeValue, BadgeContainer } from "../components/Typography";


const TelaProduto = ({ produto, handleChange, handleSubmit, aoCancelar}) => {
  return (
    <Card title={produto.id ? "Editar Produto" : "Novo Produto"}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
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


        <BadgeContainer color="emerald">
          <BadgeValue label="Custo Líq." value={`R$ ${produto.CustoProd}`} />
          <BadgeValue label="Embalagem" value={`R$ ${produto.ValorEmbalagemProd}`} />
          <BadgeValue label="Custo Total" value={`R$ ${produto.CustoTotalProd}`} />
          <BadgeValue label="Sugestão" value={`R$ ${produto.ValorSugeridoProd}`} color="blue" />
          <BadgeValue label="Lucro" value={`R$ ${produto.LucroProd}`} color="orange" />
          <BadgeValue label="Lucro %" value={`${produto.PorcentagemLucroProd}%`} color="orange" />
        </BadgeContainer>

        <div className="col-span-full mt-6 flex gap-4">
          <Button variant="secondary" type="button" onClick={aoCancelar} className="flex-1 py-4 text-lg">
            ⬅️ Voltar para Lista
          </Button>
          <Button variant="success" type="submit" className="flex-[2] py-4 text-lg">
            {produto.id ? "💾 Salvar Alterações" : "✅ Cadastrar Produto"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default TelaProduto

