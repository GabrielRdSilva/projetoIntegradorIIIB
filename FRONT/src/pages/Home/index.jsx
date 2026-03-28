import { useState, useEffect , useRef } from 'react'
import './Style.css'
import Lixo from '../../assets/lixo.png'  // ← Corrigido o caminho
import api from '../../services/api'

function Home() {

  /*let clientesData = []*/
  const [clientes, setClientes] = useState([]) 

  const InputcodCliente = useRef()
  const InputNome = useRef()
  const InputEmail = useRef()
  const InputReferencia = useRef()
  const InputEndereco = useRef()
  const InputContato = useRef()

  async function getClientes() {
    /*clientes = await api.get('/clientes')*/
    const response = await api.get('/clientes')
    setClientes(response.data)  // 
    
    console.log(setClientes)
  }
  async function createclientes() {
    await api.post('/clientes', {
      codCliente: InputcodCliente.current.value,
      Nome: InputNome.current.value,
      Email: InputEmail.current.value,
      Referencia: InputReferencia.current.value,
      Endereco: InputEndereco.current.value,
      Contato: Number(InputContato.current.value)
    })
    getClientes()
  }
  async function deletecliente(id) {
    await api.delete(`/clientes/${id}`)
    getClientes()
  }


  useEffect(() => {
    getClientes()
  }, [])

  const [count, setCount] = useState(0)

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Clientes</h1>
        <input placeholder="Codigo do Cliente" name='Codigo Cliente' type='text' ref={InputcodCliente}/>  {/* ← name e não nam */}
        <input placeholder="Nome" name='Nome' type='text' ref={InputNome}/>             {/* ← name corrigido */}
        <input placeholder="E-mail" name='Email' type='email' ref={InputEmail}/>           {/* ← name corrigido */}
        <input placeholder="Referência" name='Referencia' type='text' ref={InputReferencia}/>       {/* ← name corrigido */}
        <input placeholder="Endereço" name='Endereço' type='text' ref={InputEndereco}/>       {/* ← name corrigido */}
        <input placeholder="Contato" name='Contato' type='number' ref={InputContato}/>        {/* ← name corrigido */}
        <button type="button" onClick={createclientes}>cadastrar</button>
      </form>
      {clientes.map(cliente => (
        <div key={cliente.id} className='card'>
          <div>
            <p>Codigo Cliente: {cliente.codCliente}</p>
            <p>Nome: {cliente.Nome}</p>
            <p>Email:{cliente.Email}</p>
            <p>Referencia:{cliente.Referencia}</p>
            <p>Endereco:{cliente.Endereco}</p>
            <p>Contato:{cliente.Contato}</p>
          </div>
          <button>
            <img src={Lixo} alt="lixo" style={{ width: '24px', height: '24px' }}  onClick={() => deletecliente(cliente.id)}/>  {/* ← adicionado alt */}
          </button>
        </div>
      ))}
    </div>
  )
}
export default Home
