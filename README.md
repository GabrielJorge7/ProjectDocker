# 🚀 Projeto Web Completo com Docker

Este é um projeto de exemplo que integra uma Web API em .NET, frontend em React, banco de dados PostgreSQL, e gerenciador PgAdmin. Toda a aplicação é containerizada utilizando Docker e orquestrada com Docker Compose.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** ASP.NET Core 7
- **Frontend:** React + Vite
- **Banco de Dados:** PostgreSQL
- **Gerenciador do Banco:** PgAdmin (opcional)
- **Containerização:** Docker & Docker Compose

---

## 📦 Estrutura do Projeto

.
├── backend/
│ ├── SGED.csproj
│ ├── Controllers/
│ ├── Models/
│ ├── Dockerfile
│ └── ...
├── frontend/
│ ├── src/
│ ├── public/
│ ├── Dockerfile
│ ├── nginx.conf
│ └── ...
├── Database/
│ └── sged.sql
├── docker/
│ └── docker-compose.yml
└── README.md

yaml
Copiar
Editar

---

## 🔧 Configuração do Docker

### 📁 Backend (.NET)

1. Crie o `Dockerfile` no diretório do backend com o seguinte conteúdo:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
COPY ./*.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "SGED.dll"]
Altere a Startup.cs ou Program.cs para ler a DATABASE_URL:

csharp
Copiar
Editar
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? Configuration.GetConnectionString("DefaultConnection");
Gere o build local com:

bash
Copiar
Editar
dotnet publish -c Release
🌐 Frontend (React + Vite)
Crie o Dockerfile no diretório do frontend:

dockerfile
Copiar
Editar
FROM node:18 AS build
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . ./
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
Crie o arquivo .env na raiz do frontend:

bash
Copiar
Editar
VITE_API_URL=http://localhost:7096/api/
Configure a base URL do React usando import.meta.env.VITE_API_URL.

Crie o arquivo nginx.conf:

nginx
Copiar
Editar
worker_processes auto;
events {
    worker_connections 1024;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;

    server {
        listen 80;
        server_name localhost;

        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://api_container:7096;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
🗄️ Banco de Dados PostgreSQL
Exporte seu banco local com:

bash
Copiar
Editar
pg_dump -U postgres -d sgedDB -h localhost -p 5432 -f sged.sql
Coloque esse arquivo na pasta Database/.

🧩 Docker Compose
Crie a pasta docker/ e adicione o arquivo docker-compose.yml:

yaml
Copiar
Editar
version: '3.8'

services:
  postgres:
    image: postgres:latest
    container_name: postgres_container
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: sgedDB
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../Database/sged.sql:/docker-entrypoint-initdb.d/sged.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ../backend
    container_name: api_container
    restart: always
    ports:
      - "7096:80"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: "Host=postgres_container;Port=5432;Database=sgedDB;Username=postgres;Password=123456;"

  frontend:
    build:
      context: ../frontend
      args:
        VITE_API_URL: http://localhost:7096/api/
    container_name: frontend_container
    restart: always
    ports:
      - "5173:80"
    depends_on:
      api:
        condition: service_started

volumes:
  postgres_data:
    driver: local
🚀 Como Rodar o Projeto
Vá até a pasta docker/:

bash
Copiar
Editar
cd docker/
Suba os containers:

bash
Copiar
Editar
docker-compose up --build
Acesse no navegador:

Frontend: http://localhost:5173

API: http://localhost:7096

Banco (se usar PgAdmin): http://localhost:5432

🧹 Comandos Úteis
Parar e remover tudo:

bash
Copiar
Editar
docker-compose down --rmi all -v
Subir novamente:

bash
Copiar
Editar
docker-compose up --build