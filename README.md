# AbreShort

## Setup do projeto
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
````

#### 6. Rodar as migrations
```bash
npm run db:migrate
```

#### 7. Rodar o projeto
```bash
npm run dev
```
