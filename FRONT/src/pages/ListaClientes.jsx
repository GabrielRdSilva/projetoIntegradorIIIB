import React from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { LabelVenda } from "../components/Typography";

const ListaClientes = ({ clientes, aoEditar, aoExcluir, aoNovo }) => {
    return (
        <Card title="Gerenciamento de Clientes">
            <div className="flex justify-between items-center mb-6">
                <p className="text-slate-500 text-sm">Total de clientes: <strong>{clientes.length}</strong></p>
                <Button variant="success" onClick={aoNovo}>
                    ➕ Novo Cliente
                </Button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <tr>
                            <th className="p-4">Código</th>
                            <th className="p-4">Nome</th>
                            <th className="p-4">Contato</th>
                            <th className="p-4">Cidade</th>
                            <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clientes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400 italic">
                                    Nenhum cliente cadastrado.
                                </td>
                            </tr>
                        ) : (
                            clientes.map((c) => (
                                <tr key={c.id} className="text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                                    <td className="py-1 px-4 font-mono font-bold text-emerald-600">{c.codCliente}</td>
                                    <td className="py-1 px-4 font-semibold">{c.Nome}</td>
                                    <td className="py-1 px-4">{c.Contato || '---'}</td>
                                    <td className="py-1 px-4">{c.Endereco || '---'}</td>
                                    <td className="py-1 px-4">
                                        <div className="flex justify-center gap-2">
                                            <Button variant="secondary" onClick={() => aoEditar(c)} className="py-1 px-3 text-xs">
                                                ✏️ Editar
                                            </Button>
                                            <Button variant="danger" onClick={() => aoExcluir(c)} className="py-1 px-3 text-xs">
                                                🗑️ Excluir
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

export default ListaClientes
