-----

# Fast BI iGreen v2

**Sistema de Business Intelligence para monitoramento de dados da iGreen Energy.**

-----

[](https://www.google.com/search?q=https://github.com/douglasmsigreen/fast-bi-igreen-v2/actions/workflows/ci.yml)
[](https://opensource.org/licenses/MIT)

O **Fast BI iGreen v2** é uma plataforma de Business Intelligence projetada para visualizar e analisar métricas de consumo de energia, faturamento e clientes em tempo real. A aplicação conta com um backend robusto em Python (Flask) e um frontend moderno e interativo em React (Vite).

## ✨ Principais Funcionalidades

  - **Dashboard Principal:** Visualização consolidada dos principais KPIs (kWh vendido, clientes, faturamento).
  - **Dashboard para TV:** Modo de exibição otimizado para telas grandes, com rotação automática de métricas e atualização em tempo real.
  - **Autenticação Segura:** Sistema de login com Tokens JWT (Access e Refresh).
  - **Tema Dinâmico:** Suporte para modo Claro (Light) e Escuro (Dark).
  - **Rotas Protegidas:** Acesso seguro às páginas internas da aplicação.
  - **Estrutura Modular:** Código organizado para facilitar a manutenção e escalabilidade.

## 🛠️ Tecnologias Utilizadas

| Área      | Tecnologia                                                                                                                                                                                                                                              |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend** | **React 19** com **Vite**, **Tailwind CSS**, **React Router**, **Chart.js** (gráficos), **Framer Motion** (animações), **Lucide React** (ícones) |
| **Backend** | **Python** com **Flask**, **SQLAlchemy** (ORM), **PostgreSQL** (Banco de Dados), **Flask-JWT-Extended** (Autenticação), **Gunicorn** (Servidor WSGI)      |
| **DevOps** | **ESLint** (Qualidade de Código), **GitHub Actions** (CI/CD)                                                                                                                                                                                            |

## 🚀 Configuração do Ambiente

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

  - **Node.js**: `v18.0` ou superior.
  - **Python**: `v3.9` ou superior.
  - **PostgreSQL**: Instância local ou remota acessível.

### 1\. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/fast-bi-igreen-v2.git
cd fast-bi-igreen-v2
```

### 2\. Configurar Variáveis de Ambiente

O projeto utiliza arquivos `.env` para gerenciar as variáveis de ambiente. Existem scripts para facilitar a criação deles.

Execute o seguinte comando na raiz do projeto:

```bash
bash setup-commands.sh
```

Este comando criará os arquivos `.env` necessários para o frontend e o backend. **Revise os arquivos gerados** para garantir que as credenciais do banco de dados e outras chaves estão corretas.

**Importante:** Os arquivos `.env` não devem ser versionados no Git.

### 3\. Configurar e Iniciar o Backend

Abra um **novo terminal** e navegue até a pasta `server`.

```bash
# 1. Navegue para a pasta do servidor
cd server

# 2. Crie e ative um ambiente virtual
python3 -m venv venv
source venv/bin/activate

# 3. Instale as dependências Python
pip install -r requirements.txt

# 4. Inicie o servidor Flask
python run.py
```

O backend estará rodando em `http://localhost:5000`.

### 4\. Configurar e Iniciar o Frontend

Volte para o **terminal original** (na raiz do projeto).

```bash
# 1. Instale as dependências do Node.js
npm install

# 2. Inicie o servidor de desenvolvimento Vite
npm run dev
```

O frontend estará acessível em `http://localhost:4200`.

## 📜 Scripts Disponíveis

Na pasta raiz do projeto, você pode executar os seguintes scripts:

  - `npm run dev`: Inicia o servidor de desenvolvimento do frontend.
  - `npm run build`: Compila o projeto frontend para produção.
  - `npm run lint`: Executa o ESLint para analisar a qualidade do código.
  - `npm run preview`: Inicia um servidor local para visualizar a build de produção.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
