<p align="center">
  <img src="https://github.com/EVORISE-DEV/evorise-api/blob/main/assets/logo-evorise.png" alt="Evorise" width="220">
</p>

<h1 align="center">🏃‍♂️ Evorise — Corrida Inteligente e Evolutiva</h1>

<p align="center">
  <em>Transforme sua corrida em uma jornada de evolução com metodologia, ciência e motivação.</em>
</p>

---

## 🚀 Sobre o Projeto

A equipe **Evorise** está desenvolvendo um aplicativo inteligente de corrida e treinamento voltado para **jovens e adultos que desejam evoluir**, mas enfrentam desafios em manter **constância, disciplina e clareza sobre como treinar**.

O app combina uma **metodologia exclusiva em 4 estágios**:

1. 🟢 **Despertar** — descoberta e primeiros passos na corrida  
2. 🔵 **Decolagem** — início de treinos estruturados  
3. 🟠 **Forja** — consolidação da rotina e aumento de performance  
4. 🔴 **Ápice** — evolução máxima e manutenção da excelência  

Cada usuário recebe **planos personalizados** de acordo com:
- Nível atual e objetivo (5 km, 10 km, meia maratona etc.)
- Testes de performance e **anamnese inteligente**
- Feedbacks em tempo real (distância, tempo e pausas)

---

## 💡 Diferenciais

✨ **Metodologia estruturada:** trilha pedagógica de evolução contínua  
⚙️ **Acompanhamento inteligente:** monitoramento em tempo real  
🎯 **Personalização:** treinos baseados em dados e objetivos  
🏅 **Gamificação:** rankings, medalhas e recompensas  
📚 **Educação esportiva:** aulas sobre técnica, prevenção e estratégias  

> Diferente de plataformas como *Strava* ou *Nike Run Club*, a **Evorise** vai além do registro de treinos — ela **ensina, guia e motiva** cada corredor a atingir seu melhor desempenho.

---

## 🧠 Tecnologias Utilizadas

- **Node.js + Express** — API RESTful  
- **Sequelize ORM** — integração com banco PostgreSQL  
- **Docker + Docker Compose** — ambiente isolado e reproduzível  
- **PostgreSQL** — banco de dados principal  
- **JWT + Bcrypt** — autenticação segura  
- **ESLint + Prettier** — padronização e qualidade do código  

---

## ⚙️ Como Rodar o Projeto (API)

### 🔹 Pré-requisitos
- **Docker Desktop** ou Docker Engine instalado
- **Git** configurado
- Porta `3000` (ou definida no `.env`) livre

---

### 🔹 Passo a Passo

1. **Clone o repositório e entre na pasta:**
   ```bash
   git clone https://github.com/EVORISE-DEV/evorise-api.git
   cd evorise-api
   ````
2. Acesse a branch de desenvolvimento:
    ```bash
    git checkout develop
    ```

3. **Crie o arquivo `.env` baseado no `.env.example`:**
   ```bash
   cp .env.example .env
   ```

5. Suba os containers com build limpo:
   ```bash
   docker-compose up --build
   ```
6. Aguarde os serviços iniciarem. A API estará disponível em `http://localhost:3000/health`.

---
## 🧪 Scripts úteis

Comando	Descrição

**npm run dev**	-> Inicia o servidor em modo desenvolvimento
___
**npm run lint** ->Executa o ESLint
___
**npx sequelize-cli db:migrate** ->	Executa as migrations
___
**npx sequelize-cli db:seed:all** ->	Executa os seeders
