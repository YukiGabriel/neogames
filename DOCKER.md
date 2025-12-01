# 🐳 Guia Docker - NeoGames

Este guia explica como executar a aplicação NeoGames usando Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10 ou superior)
- Docker Compose instalado (versão 2.0 ou superior)

## 🚀 Comandos Rápidos

### Ambiente de Desenvolvimento

```bash
# Iniciar a aplicação em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Iniciar em background
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar a aplicação
docker-compose -f docker-compose.dev.yml down

# Parar e remover volumes (limpar banco de dados)
docker-compose -f docker-compose.dev.yml down -v
```

### Ambiente de Produção

```bash
# Build e iniciar a aplicação
docker-compose up --build

# Iniciar em background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar a aplicação
docker-compose down

# Parar e remover volumes
docker-compose down -v
```

## 📁 Arquivos Docker

### Dockerfile
Usado para build de produção. Cria uma imagem otimizada multi-stage para melhor performance.

### Dockerfile.dev
Usado para desenvolvimento. Inclui hot-reload e ferramentas de desenvolvimento.

### docker-compose.yml
Configuração para ambiente de produção com:
- Aplicação Next.js otimizada
- MongoDB 7.0
- Network isolada
- Volume persistente para dados

### docker-compose.dev.yml
Configuração para ambiente de desenvolvimento com:
- Hot-reload habilitado
- Volumes montados para código-fonte
- MongoDB para desenvolvimento
- Logs detalhados

### .dockerignore
Lista de arquivos e pastas ignorados durante o build do Docker.

## 🌐 Acessando a Aplicação

Após iniciar os containers:

- **Aplicação**: http://localhost:3000
- **MongoDB**: localhost:27017

## 🔧 Configurações Importantes

### Variáveis de Ambiente

Para configurar variáveis de ambiente, você pode:

1. Criar um arquivo `.env` na raiz do projeto
2. Modificar a seção `environment` no `docker-compose.yml`

Exemplo de `.env`:

```env
MONGODB_URI=mongodb://mongo:27017/neogames
NODE_ENV=production
# Adicione outras variáveis conforme necessário
```

### Next.js Standalone Build

O Dockerfile de produção usa o modo `standalone` do Next.js para criar uma imagem menor e mais eficiente. Para isso funcionar, certifique-se de adicionar no seu `next.config.js`:

```javascript
module.exports = {
  output: 'standalone',
}
```

## 🛠️ Comandos Úteis

### Reconstruir as imagens

```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml build

# Produção
docker-compose build
```

### Executar comandos dentro do container

```bash
# Acessar shell do container da aplicação
docker-compose exec app sh

# Executar npm install
docker-compose exec app npm install

# Ver logs específicos
docker-compose logs app
docker-compose logs mongo
```

### Limpar tudo (cuidado!)

```bash
# Parar todos os containers e remover volumes
docker-compose down -v

# Remover imagens não utilizadas
docker image prune -a
```

## 🔍 Troubleshooting

### Porta já em uso

Se a porta 3000 ou 27017 já estiver em uso, modifique no `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Usa porta 3001 no host
```

### Problemas com permissões

Se encontrar problemas com permissões no Linux:

```bash
sudo chown -R $USER:$USER .
```

### Rebuild completo

Se algo não estiver funcionando, tente um rebuild completo:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## 📊 Monitoramento

### Ver uso de recursos

```bash
docker stats
```

### Inspecionar containers

```bash
docker-compose ps
docker inspect neogames-app-1
```

## 🔐 Segurança

Para produção, considere:

1. Usar secrets do Docker para credenciais sensíveis
2. Configurar autenticação no MongoDB
3. Usar HTTPS com proxy reverso (nginx/traefik)
4. Limitar recursos dos containers
5. Manter imagens atualizadas

## 📝 Notas

- Os dados do MongoDB são persistidos em volumes Docker
- O modo desenvolvimento tem hot-reload habilitado
- O modo produção usa build otimizado do Next.js
- Logs são acessíveis via `docker-compose logs`
