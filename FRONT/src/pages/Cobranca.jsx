import React, { useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

const Cobranca = () => {
    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const buscarCobranca = async () => {
        if (!busca) return;
        setCarregando(true);
        try {
            const response = await axios.get(`http://localhost:3000/Cobranca/cliente/${busca}` );
            setResultados(response.data);
            if (response.data.length === 0) alert("Nenhuma pendência encontrada para este cliente.");
        } catch (error) {
            alert("Erro ao buscar cobrança. Verifique o código do cliente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card title="Painel de Cobrança">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <Input 
                            label="Código do Cliente" 
                            placeholder="Digite o código (ex: 0085)" 
                            value={busca} 
                            onChange={(e) => setBusca(e.target.value)} 
                        />
                    </div>
                    <Button variant="primary" onClick={buscarCobranca} disabled={carregando}>
                        {carregando ? "Buscando..." : "Consultar Pendências"}
                    </Button>
                </div>
            </Card>

            {resultados.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resultados.map((v) => (
                        <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Venda</span>
                                    <h3 className="text-lg font-bold text-slate-800">{v.CodigoVenda}</h3>
                                    <p className="text-sm text-slate-500">{new Date(v.DataVenda).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {v.PercentualPago}% Pago
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total da Venda:</span>
                                    <span className="font-bold text-slate-800">R$ {v.TotalVenda.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Valor já Recebido:</span>
                                    <span className="font-bold text-emerald-600">R$ {v.ValorPago.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">SALDO DEVEDOR:</span>
                                    <span className="text-xl font-black text-red-600">R$ {v.ValorPendente.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cobranca;
