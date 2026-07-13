<h1 align="center">
  <br>
    <img src="./.github/logo-oto.jpg" width="500" heigh="300" alt="logo OTO">
</h1>
<p align="center">
    <img alt="Plataforma" src="https://img.shields.io/static/v1?label=Plataforma&message=Mobile/PC&color=121212&labelColor=F2C94C">
    <img alt="Status" src="https://img.shields.io/static/v1?label=Status&message=Em%20desenvolvimento&color=121212&labelColor=F2C94C">
    <img alt="Tamanho do repositório" src="https://img.shields.io/github/repo-size/JhuanNohl/OTO?color=121212&labelColor=F2C94C">
    <a href="https://github.com/JhuanNohl/OTO/blob/main/LICENSE">
        <img alt="Licença" src="https://img.shields.io/static/v1?label=License&message=MIT&color=121212&labelColor=F2C94C">
    </a>
</p>
<p align="center">
    <a href="#oto-">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#tecnologias-">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#layout-">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#configuração-do-supabase-">Supabase</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#feedbacks-">Feedbacks</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#licença-%EF%B8%8F">Licença</a>
</p>

# <img src=".github/logo-icon.png" width="40" alt="logo icon"> OTO <img src=".github/logo-icon.png" width="40" alt="logo icon">
OTO é um organizador financeiro em desenvolvimento, criado para registrar entradas e saídas de forma simples, acompanhar o saldo e apoiar uma visão mais clara da rotina financeira.

O projeto está sendo desenvolvido de forma autoral a partir de um MVP encontrado no GitHub. A base inicial foi adaptada para validar ideias próprias de interface, organização visual e fluxo de uso.

#### Funcionalidades
* Registro de entradas e saídas financeiras
* Exclusão de transações cadastradas
* Visualização de saldo, receitas e despesas
* Interface responsiva para desktop e mobile
* Botão flutuante para abertura do modal de cadastro
* Validação de formulário com toast de erro
* Destaque visual do card de total conforme o saldo
* Cadastro e limite de gastos por categoria
* Indicador de saúde financeira do mês, calculado a partir do saldo, receitas e despesas
* Login e cadastro de usuário via Supabase, com sincronização automática dos dados na nuvem

## Tecnologias 🚀
Esse projeto foi desenvolvido com as seguintes tecnologias:

- [HTML](https://pt.wikipedia.org/wiki/HTML)
- [CSS](https://pt.wikipedia.org/wiki/Cascading_Style_Sheets)
- [Javascript](https://pt.wikipedia.org/wiki/JavaScript)
- [Supabase](https://supabase.com/) (autenticação e banco de dados)

## Layout 🚧
#### Desktop Screenshot
<div style="display: flex; flex-direction: 'column'; align-items: 'center';">
<!-- Responsive, 1440 x 900, 50% (Laptop L - 1440px)-->
    <img src="./.github/desktop-index-null.jpg" width="400px">
    <img src="./.github/desktop-index.jpg" width="400px">
</div>

#### Mobile Screenshot
<div style="display: flex; flex-direction: 'row';">
<!-- Responsive, 425 x 900, 60% (Mobile L - 425px)-->
    <img src="./.github/mobile-index-null.jpg" width="180">
    <img src="./.github/mobile-index.jpg" width="180">
    <img src="./.github/mobile-modal-null-toast.jpg" width="180">
    <img src="./.github/mobile-modal.jpg" width="180">
</div>

## Rodando o projeto 🚴🏻‍♂️

```bash

# Clone o repositório
$ git clone https://github.com/JhuanNohl/OTO.git

# Acesse a pasta do projeto no prompt de comando
$ cd OTO

# Abra o projeto com o navegador de sua preferência
$ index.html
```

## Configuração do Supabase 🔑
O OTO usa o [Supabase](https://supabase.com/) para autenticação de usuários e sincronização dos dados (perfil, categorias, limites, saldos iniciais e transações) entre dispositivos. Sem essa configuração, o app continua funcionando normalmente, mas apenas com armazenamento local (`localStorage`).

1. Crie um projeto gratuito em [supabase.com](https://supabase.com/).
2. No editor SQL do projeto, execute o script [`supabase/schema.sql`](./supabase/schema.sql) para criar as tabelas (`profiles`, `categories`, `transactions`, `category_budgets`, `opening_balances`) e as políticas de Row Level Security, garantindo que cada usuário só acesse os próprios dados.
3. Em **Project Settings > API**, copie a **Project URL** e a **anon/public key**.
4. Preencha essas informações em [`scripts/supabase-config.js`](./scripts/supabase-config.js):

    ```js
    window.OTO_SUPABASE_CONFIG = {
        url: "SUA-PROJETO.supabase.co",
        anonKey: "SUA_SUPABASE_ANON_KEY"
    }
    ```

5. Salve o arquivo e recarregue a página. O botão de login/cadastro no cabeçalho passa a permitir criar uma conta e sincronizar os dados na nuvem automaticamente.

> ⚠️ O arquivo `supabase-config.js` é carregado direto no navegador, então use apenas a chave `anon/public`, nunca a `service_role` (que dá acesso administrativo total ao banco).

## Feedbacks 💭
O OTO ainda está em fase inicial e passa por ajustes de identidade, interface e experiência de uso.

Feedbacks sobre fluxo, clareza das informações, responsividade e melhorias de organização são bem-vindos por meio das issues do repositório.

## Licença ⚖️
Este projeto está sob a licença do MIT. Veja o arquivo [LICENSE](https://github.com/JhuanNohl/OTO/blob/main/LICENSE) para mais detalhes.
