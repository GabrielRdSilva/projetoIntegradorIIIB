SalesCRM - Projeto Integrador III-B

O SalesCRM é uma solução completa para gestão de relacionamento com clientes (CRM), controle de estoque e gerenciamento de vendas, desenvolvida como parte do Projeto Integrador III-B. O sistema oferece uma interface intuitiva para o acompanhamento de processos comerciais, desde o cadastro de produtos e clientes até a finalização de vendas com suporte a parcelamento e controle de cobrança.




🚀 Funcionalidades Principais

O sistema está estruturado em módulos integrados que facilitam a gestão do negócio:

📊 Dashboard

•
Visão geral das operações comerciais.

•
Indicadores rápidos de vendas do dia, pedidos realizados e status do estoque.

👥 Gestão de Clientes

•
Cadastro completo de clientes com informações de contato, endereço e referências.

•
Geração automática de códigos de identificação (CLIEN-XXXX).

•
Listagem com busca incremental e filtros por nome ou código.

•
Histórico de interações e pendências financeiras.

📦 Controle de Estoque (Produtos)

•
Gerenciamento detalhado de produtos, incluindo fornecedor, tipo de material e embalagem.

•
Cálculo Automático de Preços: O sistema calcula automaticamente o custo total, valor sugerido de venda e margem de lucro com base em porcentagens configuráveis.

•
Controle de quantidade em estoque e alertas visuais.

💰 Gestão de Vendas e Financeiro

•
Lançamento de Vendas: Interface otimizada para seleção de clientes e produtos via busca rápida.

•
Flexibilidade de Pagamento: Suporte para vendas à vista e a prazo.

•
Gerador de Parcelas: Automação na criação de cronogramas de pagamento, permitindo definir entradas, número de parcelas e datas de vencimento.

•
Módulo de Cobrança: Consulta rápida de pendências por cliente, exibindo saldo devedor e percentual pago de cada venda.




🛠️ Tecnologias Utilizadas

O projeto utiliza uma stack moderna e robusta para garantir performance e escalabilidade:

Frontend

•
React 19: Biblioteca principal para construção da interface.

•
Vite: Ferramenta de build ultra-rápida.

•
Tailwind CSS: Framework utilitário para estilização responsiva e moderna.

•
Axios: Cliente HTTP para comunicação com a API.

•
Date-fns: Manipulação e formatação de datas.

Backend

•
Node.js & Express: Ambiente de execução e framework para a API REST.

•
Prisma ORM: Mapeamento objeto-relacional para interação com o banco de dados.

•
MongoDB: Banco de dados NoSQL para armazenamento flexível dos dados.




⚙️ Como Executar o Projeto

Pré-requisitos

•
Node.js instalado (v18 ou superior recomendado).

•
Instância do MongoDB (local ou Atlas).

•
Gerenciador de pacotes npm ou pnpm.

1. Configuração do Backend

Navegue até a raiz do projeto:

Bash


# Instale as dependências
npm install

# Configure as variáveis de ambiente no arquivo .env
# DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/salescrm"

# Gere o cliente do Prisma
npx prisma generate

# Inicie o servidor
node server.js



O servidor rodará por padrão na porta 3000.

2. Configuração do Frontend

Navegue até a pasta FRONT:

Bash


cd FRONT

# Instale as dependências
npm install

# Inicie o ambiente de desenvolvimento
npm run dev



O frontend estará disponível no endereço indicado pelo Vite (geralmente http://localhost:5173 ).




📂 Estrutura do Repositório

•
/FRONT: Código fonte da aplicação React (Vite).

•
/prisma: Esquemas e configurações do banco de dados (Prisma).

•
server.js: Ponto de entrada da API Express.

•
package.json: Dependências e scripts do backend.




📝 Licença

Este projeto foi desenvolvido para fins acadêmicos no âmbito do Projeto Integrador III-B.
Autor: Gabriel Rodrigues da Silva

