import React from  "react"
import { LabelVenda, BigValue } from "../components/Typography";
import Card from "../components/Card";


const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <LabelVenda>Vendas Hoje</LabelVenda>
        <BigValue color="emerald">R$ 0,00</BigValue>
      </Card>
      
      <Card>
        <LabelVenda>Pedidos</LabelVenda>
        <BigValue>0</BigValue>
      </Card>
      
      <Card>
        <LabelVenda>Estoque</LabelVenda>
        <BigValue>0</BigValue>
      </Card>
    </div>
  )
}

export default Dashboard
