# App Community Animals

Uma plataforma comunitária desenvolvida para conectar pessoas e animais. Este projeto utiliza uma arquitetura moderna baseada em React, Vite e TypeScript, focando em performance e uma interface de usuário elegante.

### Figma - Protótipo
- **[Figma](https://www.figma.com/design/VNQDkzgdDdh1FTufbPaRF8/App-Animais-Comunitarios?node-id=0-1&t=K6iKMscUjKxWd7al-1)**

## Tecnologias Utilizadas

O projeto foi construído com as seguintes ferramentas e bibliotecas:

### Core & Build
- **[React 18](https://react.dev/)**: Biblioteca para construção de interfaces.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build extremamente rápida.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset JavaScript para tipagem estática e segurança no código.

### Estilização & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Framework de utilitários CSS para estilização rápida.
- **[Shadcn/UI](https://ui.shadcn.com/)**: Componentes de interface reutilizáveis e acessíveis (baseados em Radix UI).
- **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones leve e consistente.
- **[Sonner](https://sonner.emilkowal.ski/)**: Componente para notificações (Toasts).

### Navegação & Utilitários
- **[React Router DOM v7](https://reactrouter.com/)**: Gerenciamento de rotas da aplicação.
- **clsx & tailwind-merge**: Utilitários para renderização condicional de classes CSS.

---

## Como Rodar o Projeto

### Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
- **[Node.js](https://nodejs.org/)** (Versão 18 ou superior).

### Instalação e Execução
Copie e cole os comandos abaixo no seu terminal para baixar e rodar o projeto:

```bash
# 1. Clone o repositório
git clone [https://github.com/Edsso/App_Community_Animals.git](https://github.com/Edsso/App_Community_Animals.git)

# 2. Entre na pasta do projeto
cd App_Community_Animals

# 3. Instale todas as dependências
npm install

# 4. Instale o React Router DOM
npm install react-router-dom

# 5. Instale o  Tailwind CSS e utilitários
npm install tailwindcss @tailwindcss/vite clsx tailwind-merge

# 6.Instale o Ícones e Notificações
npm install lucide-react sonner

# 7. Instale o Shadcn/UI e dependências do Radix
npm install class-variance-authority next-themes @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-alert-dialog @radix-ui/react-dialog

# 8. Inicie o servidor de desenvolvimento
npm run dev
```