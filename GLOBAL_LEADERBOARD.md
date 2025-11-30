# 🌐 Sistema de Placar Global - Potato Clicker

## 📋 Opções para Implementar Placar Global

### Opção 1: JSONBin.io (Mais Simples - Recomendado)

1. **Criar conta grátis**: https://jsonbin.io
2. **Criar um Bin** para armazenar o leaderboard
3. **Copiar API Key** e Bin ID

#### Implementação:

```javascript
const API_KEY = 'SUA_API_KEY_AQUI';
const BIN_ID = 'SEU_BIN_ID_AQUI';

async function saveToGlobalLeaderboard() {
    const score = {
        name: playerName,
        potatoes: totalPotatoesEarned,
        prestige: prestigeLevel,
        clicks: totalClicks,
        timestamp: Date.now()
    };
    
    try {
        // Buscar leaderboard atual
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        let globalLeaderboard = data.record.players || [];
        
        // Adicionar/atualizar jogador
        globalLeaderboard = globalLeaderboard.filter(p => p.name !== playerName);
        globalLeaderboard.push(score);
        globalLeaderboard.sort((a, b) => b.potatoes - a.potatoes);
        globalLeaderboard = globalLeaderboard.slice(0, 100); // Top 100
        
        // Salvar de volta
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ players: globalLeaderboard })
        });
        
        return globalLeaderboard;
    } catch (error) {
        console.error('Erro ao salvar no placar global:', error);
        return null;
    }
}

async function loadGlobalLeaderboard() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: { 'X-Master-Key': API_KEY }
        });
        const data = await response.json();
        return data.record.players || [];
    } catch (error) {
        console.error('Erro ao carregar placar global:', error);
        return [];
    }
}
```

### Opção 2: Firebase Realtime Database

1. **Criar projeto**: https://console.firebase.google.com
2. **Ativar Realtime Database**
3. **Configurar regras** (permitir leitura/escrita)

```javascript
// Adicionar no HTML
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"></script>

// Configurar Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    databaseURL: "https://seu-projeto.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Salvar score
await db.ref('leaderboard/' + playerName).set({
    potatoes: totalPotatoesEarned,
    prestige: prestigeLevel,
    clicks: totalClicks,
    timestamp: Date.now()
});

// Carregar top 10
const snapshot = await db.ref('leaderboard')
    .orderByChild('potatoes')
    .limitToLast(10)
    .once('value');
const leaderboard = [];
snapshot.forEach(child => {
    leaderboard.push({ name: child.key, ...child.val() });
});
```

### Opção 3: Supabase (PostgreSQL)

1. **Criar projeto**: https://supabase.com
2. **Criar tabela** `leaderboard`
3. **Usar API REST**

```sql
CREATE TABLE leaderboard (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(50) UNIQUE,
    potatoes BIGINT,
    prestige INT,
    clicks BIGINT,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_KEY = 'sua-key';

async function saveToSupabase() {
    await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
            player_name: playerName,
            potatoes: totalPotatoesEarned,
            prestige: prestigeLevel,
            clicks: totalClicks
        })
    });
}
```

---

## 🚀 Implementação Rápida (JSONBin.io)

### Passo 1: Criar Conta
1. Acesse: https://jsonbin.io
2. Crie conta grátis
3. Crie um novo Bin
4. Copie o **Bin ID** e **API Key**

### Passo 2: Adicionar ao Código

Adicione no início do `game.js`:

```javascript
const GLOBAL_LEADERBOARD_API = 'SUA_API_KEY';
const GLOBAL_LEADERBOARD_BIN = 'SEU_BIN_ID';
let globalLeaderboard = [];
```

### Passo 3: Adicionar Funções

Cole as funções `saveToGlobalLeaderboard()` e `loadGlobalLeaderboard()` no código.

### Passo 4: Chamar ao Salvar

Modifique a função `saveGame()`:

```javascript
function saveGame() {
    updateLeaderboard();
    saveToGlobalLeaderboard(); // Adicionar esta linha
    // ... resto do código
}
```

### Passo 5: Carregar ao Iniciar

```javascript
loadGame();
loadGlobalLeaderboard().then(data => {
    globalLeaderboard = data;
    renderGlobalLeaderboard();
});
```

---

## 📊 Vantagens de Cada Opção

### JSONBin.io
- ✅ Mais simples
- ✅ Sem configuração complexa
- ✅ Grátis (100 requests/min)
- ❌ Limite de requests

### Firebase
- ✅ Realtime (atualização automática)
- ✅ Escalável
- ✅ Grátis até 10GB
- ❌ Configuração mais complexa

### Supabase
- ✅ PostgreSQL (mais robusto)
- ✅ API REST simples
- ✅ Grátis até 500MB
- ❌ Requer SQL básico

---

## 🔒 Segurança

Para produção, considere:
1. **Rate limiting** para evitar spam
2. **Validação** de dados no backend
3. **Autenticação** de usuários
4. **Sanitização** de nomes (evitar palavrões)

---

## 💡 Recomendação

Para começar rápido: **JSONBin.io**
Para projeto sério: **Firebase** ou **Supabase**

Quer que eu implemente uma dessas opções?
