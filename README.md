# AbreShort

## Setup de Desenvolvimento (API)
Siga os passos abaixo para rodar o projeto localmente.

#### 1. Entrar na pasta da API
```bash
cd api
```
#### 2. Instalar dependências
```bash
npm install
```
#### 3. Configurar variáveis de ambiente

Crie seu arquivo `.env` a partir do modelo `.env.example`.
    
#### 4. Subir o banco com Docker
```bash
docker compose up -d
```

#### 5. Gerar o client do Prisma
```bash
npm run db:generate
```

#### 6. Rodar as migrations
```bash
npm run db:migrate
```

#### 7. Rodar o projeto
```bash
npm run dev
```

## Setup de Desenvolvimento (Frontend)

#### 1. Entrar na pasta do frontend
```bash
cd frontend
```
#### 2. Instalar dependências
```bash
npm install
```
#### 3. Configurar variáveis de ambiente

Crie seu arquivo `.env` a partir do modelo `.env.example`.

#### 4. Rodar o projeto
```bash
npm run dev
```

## Build com Docker (API + Frontend)
> Todos os containers usam o .env na raiz. Certifique-se de ter o .env tanto no frontend quanto no backend.

#### 1. Na raiz do projeto, buildar e subir os containers

```bash
docker compose up --build -d
```

#### 2. Após a API estar rodando, gerar migrations dentro do container (uma única vez ou ao atualizar schema)
```bash
docker compose exec api npm run db:migrate
```

#### 3. Disponibilidade dos serviços


| Serviço  | URL                        | porta padrão |
| -------- | -------------------------- | ------------ |
| API      | http://localhost:3000      | 3000         |
| API Docs | http://localhost:3000/docs | 3000         |
| Frontend | http://localhost:5173      | 5173         |

