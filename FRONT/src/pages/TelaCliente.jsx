import React from "react"
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { SectionTitle } from "../components/Typography";


// Adicione 'aoCancelar' nas props do componente
const TelaCliente = ({ cliente, handleChange, handleSubmit, aoCancelar }) => {
  return (
    <Card title={cliente.id ? "Editar Cliente" : "Novo Cliente"}>
      <form onSubmit={handleSubmit} className="...">
        <Card title="Cadastrar Novo Cliente">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <SectionTitle step="1">Identificação</SectionTitle>
            </div>

            <Input label="Código do Cliente" name="codCliente" value={cliente.codCliente} readOnly />
            <Input label="Nome Completo" name="Nome" value={cliente.Nome} onChange={handleChange} required placeholder="Nome do Cliente" />

            <Input label="E-mail" name="Email" type="email" value={cliente.Email} onChange={handleChange} placeholder="email@exemplo.com" />
            <Input label="Contato (Apenas Números)" name="Contato" type="number" value={cliente.Contato} onChange={handleChange} placeholder="Ex: 11999999999" />

            <div className="col-span-full mt-4">
              <SectionTitle step="2">Localização e Referência</SectionTitle>
            </div>

            <Input label="Endereço" name="Endereco" value={cliente.Endereco} onChange={handleChange} placeholder="Rua, Número, Bairro..." />
            <Input label="Referência" name="Referencia" value={cliente.Referencia} onChange={handleChange} placeholder="Perto de qual local?" />

            {/*<div className="col-span-full mt-6">
              <Button variant="success" type="submit" className="w-full py-4 text-lg">
                Gravar Cliente no Banco
              </Button>
            </div>*/}
          </form>
        </Card>

        <div className="col-span-full mt-6 flex gap-4">
          {/* Botão Cancelar/Voltar */}
          <Button
            variant="secondary"
            type="button"
            onClick={aoCancelar}
            className="flex-1 py-4 text-lg"
          >
            ⬅️ Voltar para Lista
          </Button>

          <Button
            variant="success"
            type="submit"
            className="flex-[2] py-4 text-lg"
          >
            {cliente.id ? "💾 Salvar Alterações" : "✅ Gravar Cliente"}
          </Button>
        </div>
      </form>
    </Card>
  )
}


// ESTA É A LINHA QUE ESTÁ FALTANDO:
export default TelaCliente