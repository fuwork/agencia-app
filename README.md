# Sistema de Gestão - React com Supabase

Sistema de gestão para controle de clientes, agências e pagamentos, desenvolvido com React para o frontend e Supabase para o backend.

## Características

- Design limpo e moderno com tema claro
- Fonte Poppins para melhor legibilidade
- Interface responsiva
- CRUD completo para todas as entidades
- Dashboard com estatísticas
- Integração com Supabase
- Validação de formulários

## Entidades

- **Clientes**: Gerenciamento de informações de clientes
- **Agências**: Gerenciamento de agências
- **Pagamentos**: Registro e controle de pagamentos vinculados a clientes e agências

## Tecnologias utilizadas

- React 18
- React Router v6
- Supabase (Backend as a Service)
- CSS personalizado

## Como executar o projeto

### Pré-requisitos

- Node.js instalado
- Conta no Supabase (gratuita)

### Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. No SQL Editor, execute os scripts de criação de tabelas fornecidos no arquivo `src/services/supabase.js`
4. Obtenha sua URL do projeto e chave anon key nas configurações do projeto

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as credenciais do Supabase no arquivo `src/services/supabase.js`
4. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```
5. Acesse a aplicação em `http://localhost:3000`

## Estrutura do projeto

```
project-root/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Modal.jsx
│   │   ├── cliente/
│   │   │   ├── ClienteForm.jsx
│   │   │   ├── ClienteList.jsx
│   │   │   └── ClienteItem.jsx
│   │   ├── agencia/
│   │   │   ├── AgenciaForm.jsx
│   │   │   ├── AgenciaList.jsx
│   │   │   └── AgenciaItem.jsx
│   │   └── pagamento/
│   │       ├── PagamentoForm.jsx
│   │       ├── PagamentoList.jsx
│   │       └── PagamentoItem.jsx
│   ├── pages/
│   │   ├── Clientes.jsx
│   │   ├── Agencias.jsx
│   │   ├── Pagamentos.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── supabase.js
│   │   ├── clienteService.js
│   │   ├── agenciaService.js
│   │   └── pagamentoService.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── index.js
│   └── styles.css
├── package.json
└── README.md
```

## Recursos da interface

- **Dashboard**: Visão geral com estatísticas
- **Clientes**: Listagem, criação, edição e exclusão de clientes
- **Agências**: Listagem, criação, edição e exclusão de agências
- **Pagamentos**: Listagem, criação, edição e exclusão de pagamentos com filtros por status

## Personalização

O sistema utiliza variáveis CSS que podem ser facilmente personalizadas para alterar cores, fontes e outros aspectos visuais. Edite o arquivo `src/styles.css` para personalizar a aparência.