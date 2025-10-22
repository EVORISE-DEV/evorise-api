# ---- build/runtime base ----
FROM node:20-alpine

# Instala ferramentas úteis para aguardar DB (nc) e shell
RUN apk add --no-cache bash busybox-extras postgresql16-client

# Diretório da aplicação
WORKDIR /usr/src/app

# Copia apenas manifestos primeiro (melhor cache)
COPY package*.json ./

# Instala dependências do projeto
# - use "npm ci" se você usa package-lock.json; troca para "npm i" se não tiver lock
RUN npm ci

# (Opcional) CLI global do Sequelize v6 — útil para rodar migrate via npx/sequelize
RUN npm i -g sequelize-cli@6.6.2

# Copia o restante do código
COPY . .

# Copia o entrypoint
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Porta padrão do app (ajuste conforme seu servidor)
EXPOSE 3000

# Variáveis padrão (podem ser sobrescritas no compose/ENV)
ENV NODE_ENV=development

# Inicia via entrypoint: espera DB -> migra -> sobe app
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
