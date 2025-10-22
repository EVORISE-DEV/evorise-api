#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] NODE_ENV=${NODE_ENV:-development}"
echo "[entrypoint] DB_DIALECT=${DB_DIALECT:-} DB_HOST=${DB_HOST:-} DB_PORT=${DB_PORT:-}"
echo "[entrypoint] DB_DATABASE=${DB_DATABASE:-} DB_USERNAME=${DB_USERNAME:-}"

ENV_NAME="${NODE_ENV:-development}"

# ------------------------------------------------------------------------------
# Funções auxiliares
# ------------------------------------------------------------------------------

wait_for_db() {
  if [[ -n "${DB_HOST:-}" && -n "${DB_PORT:-}" ]]; then
    echo "[entrypoint] Aguardando ${DB_HOST}:${DB_PORT}..."
    for i in {1..60}; do
      if nc -z "${DB_HOST}" "${DB_PORT}" >/dev/null 2>&1; then
        echo "[entrypoint] Banco acessível!"
        return 0
      fi
      sleep 1
    done
    echo "[entrypoint] ERRO: Banco não respondeu em 60s." >&2
    return 1
  fi
}

have_psql() {
  command -v psql >/dev/null 2>&1
}

psql_cmd() {
  if ! have_psql; then
    echo "[entrypoint] ERRO: psql não disponível para psql_cmd." >&2
    return 127
  fi
  PGPASSWORD="${DB_PASSWORD:-}" psql \
    -v ON_ERROR_STOP=1 \
    -h "${DB_HOST:-localhost}" \
    -p "${DB_PORT:-5432}" \
    -U "${DB_USERNAME:-postgres}" \
    -d postgres \
    -X -q -t -c "$1"
}

db_exists() {
  local db="${DB_DATABASE:-}"
  [[ -z "$db" ]] && return 1
  if ! have_psql; then
    echo "[entrypoint] Aviso: psql indisponível; não consigo verificar existência do DB."
    return 1
  fi
  local out
  out=$(psql_cmd "SELECT 1 FROM pg_database WHERE datname='${db}';" || true)
  [[ "$out" =~ 1 ]]
}

terminate_connections() {
  local db="${DB_DATABASE:-}"
  [[ -z "$db" ]] && return 0
  if ! have_psql; then
    echo "[entrypoint] Aviso: psql indisponível; não consigo terminar conexões."
    return 0
  fi
  echo "[entrypoint] Terminando conexões da base '${db}'..."
  psql_cmd "
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname='${db}' AND pid <> pg_backend_pid();
  " || true
}

drop_db_force() {
  local db="${DB_DATABASE:-}"
  [[ -z "$db" ]] && return 0
  if ! have_psql; then
    echo "[entrypoint] ERRO: psql indisponível; não consigo forçar DROP." >&2
    return 127
  fi

  echo "============================================================"
  echo "[entrypoint] DROP database '${db}' (forçado)..."
  echo "============================================================"

  # Tenta WITH (FORCE) (PG 13+). Se falhar, termina conexões e tenta DROP normal.
  if ! psql_cmd "DROP DATABASE IF EXISTS \"${db}\" WITH (FORCE);" >/dev/null 2>&1; then
    echo "[entrypoint] WITH (FORCE) indisponível. Tentando terminar conexões e dropar..."
    terminate_connections
    psql_cmd "DROP DATABASE IF EXISTS \"${db}\";" || {
      echo "[entrypoint] Falha no DROP via psql." >&2
      return 1
    }
  fi
  echo "[entrypoint] DROP concluído."
}

# ------------------------------------------------------------------------------
# Início
# ------------------------------------------------------------------------------

wait_for_db

if ! command -v npx >/dev/null 2>&1; then
  echo "[entrypoint] ERRO: npx não encontrado." >&2
  exit 1
fi

# 1) Tenta dropar via sequelize-cli (sem --force, por compatibilidade)
echo "============================================================"
echo "[entrypoint] sequelize-cli db:drop --env ${ENV_NAME}"
echo "============================================================"
drop_ok=true
if ! npx sequelize-cli db:drop --env "${ENV_NAME}"; then
  echo "[entrypoint] Aviso: db:drop do sequelize-cli falhou. Tentarei fallback (se disponível)."
  drop_ok=false
fi

# 2) Se ainda existir, derruba à força via psql; se psql não existir e o drop falhou, aborta
if db_exists; then
  if have_psql; then
    drop_db_force || {
      echo "[entrypoint] ERRO: não foi possível dropar o banco via psql." >&2
      exit 1
    }
  else
    if [[ "${drop_ok}" == "false" ]]; then
      echo "[entrypoint] ERRO: sequelize-cli db:drop falhou e 'psql' não está disponível no container."
      echo "[entrypoint] Instale o cliente do Postgres no container (ex.: Debian: 'apt-get install -y postgresql-client')."
      exit 1
    else
      echo "[entrypoint] Aviso: psql indisponível para confirmar DROP; prosseguindo."
    fi
  fi
else
  echo "[entrypoint] Base já não existe após tentativa de drop."
fi

# 3) CREATE
echo "============================================================"
echo "[entrypoint] sequelize-cli db:create --env ${ENV_NAME}"
echo "============================================================"
npx sequelize-cli db:create --env "${ENV_NAME}"

# 4) Log de migrations/seeders detectados (visibilidade)
MIG_DIRS=( "./migrations" "./src/database/migrations" "./src/migrations" "./database/migrations" )
SEED_DIRS=( "./seeders" "./src/database/seeders" "./src/seeders" "./database/seeders" )

echo "------------------------------------------------------------"
echo "[entrypoint] Migrations detectadas:"
for d in "${MIG_DIRS[@]}"; do
  [[ -d "$d" ]] && { echo " - $d"; ls -1 "$d" || true; }
done

echo "------------------------------------------------------------"
echo "[entrypoint] Seeders detectados:"
for d in "${SEED_DIRS[@]}"; do
  [[ -d "$d" ]] && { echo " - $d"; ls -1 "$d" || true; }
done

# 5) MIGRATE
echo "============================================================"
echo "[entrypoint] sequelize-cli db:migrate --env ${ENV_NAME}"
echo "============================================================"
npx sequelize-cli db:migrate --env "${ENV_NAME}"

# 6) SEED
echo "============================================================"
echo "[entrypoint] sequelize-cli db:seed:all --env ${ENV_NAME}"
echo "============================================================"
if ! npx sequelize-cli db:seed:all --env "${ENV_NAME}"; then
  echo "[entrypoint] ERRO: Falha ao executar seeds." >&2
  exit 1
fi

echo "------------------------------------------------------------"
echo "[entrypoint] Pipeline DB OK: DROP -> CREATE -> MIGRATE -> SEED."
echo "------------------------------------------------------------"

# 7) Sobe a aplicação
if npm run | grep -qE "^\s*dev\b"; then
  echo "[entrypoint] Iniciando: npm run dev"
  exec npm run dev
elif npm run | grep -qE "^\s*start\b"; then
  echo "[entrypoint] Iniciando: npm start"
  exec npm start
else
  echo "[entrypoint] Iniciando: node src/server.js"
  exec node src/server.js
fi
