# 📦 Estrutura do Projeto: Normalizer API

Este documento descreve a função de cada pasta e arquivo no monorepo e execução
do projeto e testes.

---

## 📁 Estrutura geral

```
luizalabs-monorepo/
├── packages/
│   ├── api/                ← Servidor Fastify (API REST)
│   └── core/               ← Lógica de negócio (parser, normalizador, filtro)
├── tsconfig.json          ← Configuração global do TypeScript
├── package.json           ← Raiz do monorepo com Yarn Workspaces
└── README.md              ← Documentação de uso
```

---

## 🧩 Root

### `package.json`
- Declara o projeto como `private`
- Define os workspaces: `packages/*`
- Scripts úteis:
  - `yarn build`: compila o core
  - `yarn dev`: sobe a API

### `tsconfig.json`
- Base compartilhada para TypeScript
- Define paths e módulo ES
- Suporte a `@normalizer/core`

---

## 📦 Pacote `@normalizer/core` (packages/core)

### Responsabilidade:
Toda lógica de domínio:
- Parsing de linhas
- Normalização dos pedidos
- Filtros

### Arquivos principais:

#### `src/parser.ts`
- Função: `parseLine(line)`
- Quebra a linha fixa em campos estruturados:
  - user_id, name, order_id, product_id, value, date

#### `src/normalizer.ts`
- Função: `normalizeData(lines)`
- Agrupa dados por usuário e por pedido
- Soma total do pedido
- Lista produtos do pedido

#### `src/filter.ts`
- Função: `filterOrders(data, order_id?, start?, end?)`
- Aplica filtros opcionais:
  - order_id
  - intervalo de datas

#### `src/index.ts`
- Reexporta as 3 funções para facilitar os imports

#### `tsconfig.json`
- Define `module: ESNext`
- Compila para `dist/`
- Gera `*.d.ts` com typings

#### `package.json`
- Nome do pacote: `@normalizer/core`
- Build com: `tsup`
- `"type": "module"` para ESM

---

## 🌐 Pacote `luizalabs` (packages/api)

### Responsabilidade:
Expor a lógica do core via API HTTP com Fastify

### Arquivos principais:

#### `src/server.ts`
- Inicia o servidor Fastify
- Plugins registrados:
  - `@fastify/multipart` (upload de arquivos)
  - `@fastify/static` (serve HTML)
- Endpoints:
  - `POST /upload`: recebe arquivo .txt e processa
  - `GET /orders`: retorna pedidos agrupados (com filtros)

#### `package.json`
- Nome: `luizalabs`
- Script dev: `tsx watch src/server.ts`
- `"type": "module"` ativo
- Dependente de `@normalizer/core`

#### `public/pedidos.html`
- Interface HTML estática para visualizar e filtrar pedidos
- Usa `fetch()` para consumir a API
- Filtra por:
  - `order_id`
  - `start_date`
  - `end_date`

---

## 🔁 Fluxo completo

1. Usuário envia `pedidos.txt` via `/upload`
2. API faz `parseLine` + `normalizeData`
3. Dados ficam na memória (em `ordersData`)
4. Chamadas para `/orders` retornam JSON agrupado e filtrável

---

## ✅ Tecnologias utilizadas

- [x] Node.js
- [x] TypeScript
- [x] Fastify
- [x] Yarn Workspaces
- [x] Tsup (build)
- [x] tsx (dev com ESM)
- [x] HTML + JS para visualização

## ✅ Requisitos 

- Node.js 18+ ou 20
- Yarn v1.x (npm install -g yarn)
- Navegador (para abrir a pedidos.html)

## 🚀 Executando o projeto

- yarn install na raiz do projeto
- yarn workspace @normalizer/core build
- yarn workspace luizalabs dev

- Faça o upload do arquivo através do terminal.
curl -X POST http://localhost:3000/upload \
  -F "file=@./data_1.txt"

- O resultado será exibido no browser através do url, podendo utilizar os filtros.
http://localhost:3000/pedidos.html

## 🧩 Para rodar os testes

- yarn workspace luizalabs test
- yarn workspace @normalizer/core test
