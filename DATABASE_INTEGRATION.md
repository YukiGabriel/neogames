# 🗄️ Integração com Banco de Dados - NeoGames

## 📋 Opções de Banco de Dados

### 1. **MongoDB Atlas** (Recomendado - Grátis)
- ✅ Fácil de configurar
- ✅ 512MB grátis
- ✅ Hospedado na nuvem
- ✅ Ideal para jogos (JSON)

### 2. **PostgreSQL** (Supabase)
- ✅ SQL tradicional
- ✅ Grátis com Supabase
- ✅ Autenticação integrada

### 3. **Firebase** (Google)
- ✅ Realtime Database
- ✅ Fácil integração
- ✅ Plano grátis generoso

---

## 🚀 Implementação com MongoDB Atlas

### Passo 1: Criar Conta MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta grátis
3. Crie um cluster (escolha região mais próxima)
4. Em "Database Access", crie um usuário
5. Em "Network Access", adicione `0.0.0.0/0` (permitir todos)
6. Copie a Connection String

### Passo 2: Instalar Dependências

```bash
npm install mongodb mongoose
```

### Passo 3: Criar Estrutura de Pastas

```
src/
├── lib/
│   └── mongodb.js       # Conexão com banco
├── models/
│   ├── User.js          # Modelo de usuário
│   └── GameSave.js      # Modelo de save do jogo
└── pages/
    └── api/
        ├── auth/
        │   ├── register.js
        │   └── login.js
        └── game/
            ├── save.js
            └── load.js
```

---

## 💾 Exemplo: Sistema de Save na Nuvem para Potato Clicker

### 1. Configurar MongoDB (`src/lib/mongodb.js`)

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Defina MONGODB_URI no .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

### 2. Criar Modelo de Save (`src/models/GameSave.js`)

```javascript
import mongoose from 'mongoose';

const GameSaveSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  gameName: {
    type: String,
    required: true,
    default: 'potato-clicker'
  },
  saveData: {
    potatoes: { type: Number, default: 0 },
    potatoesPerSecond: { type: Number, default: 0 },
    clickPower: { type: Number, default: 1 },
    prestigeLevel: { type: Number, default: 0 },
    prestigeMultiplier: { type: Number, default: 1 },
    currentSkin: { type: String, default: '🥔' },
    upgrades: { type: Array, default: [] },
    clickUpgrades: { type: Array, default: [] },
    skins: { type: Array, default: [] },
    achievements: { type: Array, default: [] }
  },
  lastSaved: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.GameSave || mongoose.model('GameSave', GameSaveSchema);
```

### 3. API para Salvar (`src/pages/api/game/save.js`)

```javascript
import connectDB from '../../../lib/mongodb';
import GameSave from '../../../models/GameSave';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    await connectDB();

    const { userId, saveData } = req.body;

    const gameSave = await GameSave.findOneAndUpdate(
      { userId },
      { 
        saveData,
        lastSaved: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Jogo salvo com sucesso!',
      lastSaved: gameSave.lastSaved
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar jogo' });
  }
}
```

### 4. API para Carregar (`src/pages/api/game/load.js`)

```javascript
import connectDB from '../../../lib/mongodb';
import GameSave from '../../../models/GameSave';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    await connectDB();

    const { userId } = req.query;

    const gameSave = await GameSave.findOne({ userId });

    if (!gameSave) {
      return res.status(404).json({ error: 'Save não encontrado' });
    }

    res.status(200).json({ 
      success: true, 
      saveData: gameSave.saveData,
      lastSaved: gameSave.lastSaved
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar jogo' });
  }
}
```

### 5. Atualizar Potato Clicker (adicionar ao game.js)

```javascript
// Adicionar no início do arquivo
const USER_ID = 'user_' + (localStorage.getItem('userId') || Date.now());
localStorage.setItem('userId', USER_ID.replace('user_', ''));

// Substituir função saveGame()
async function saveGame() {
    const saveData = {
        potatoes,
        potatoesPerSecond,
        clickPower,
        prestigeLevel,
        prestigeMultiplier,
        currentSkin,
        upgrades: upgrades.map(u => ({ owned: u.owned, cost: u.cost })),
        clickUpgrades: clickUpgrades.map(u => ({ owned: u.owned, cost: u.cost })),
        skins: skins.map(s => ({ unlocked: s.unlocked })),
        achievements: achievements.map(a => ({ unlocked: a.unlocked }))
    };

    // Salvar localmente
    localStorage.setItem('potatoClickerSave', JSON.stringify(saveData));

    // Salvar na nuvem
    try {
        const response = await fetch('/api/game/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: USER_ID, saveData })
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification('💾 Jogo salvo na nuvem!');
        }
    } catch (error) {
        showNotification('💾 Salvo localmente (offline)');
    }
}

// Substituir função loadGame()
async function loadGame() {
    // Tentar carregar da nuvem primeiro
    try {
        const response = await fetch(`/api/game/load?userId=${USER_ID}`);
        const data = await response.json();
        
        if (data.success) {
            applyLoadedData(data.saveData);
            showNotification('☁️ Progresso carregado da nuvem!');
            return;
        }
    } catch (error) {
        console.log('Carregando save local...');
    }

    // Fallback: carregar do localStorage
    const saveData = localStorage.getItem('potatoClickerSave');
    if (saveData) {
        applyLoadedData(JSON.parse(saveData));
    }
}

function applyLoadedData(data) {
    potatoes = data.potatoes || 0;
    potatoesPerSecond = data.potatoesPerSecond || 0;
    clickPower = data.clickPower || 1;
    prestigeLevel = data.prestigeLevel || 0;
    prestigeMultiplier = data.prestigeMultiplier || 1;
    currentSkin = data.currentSkin || '🥔';
    
    if (data.upgrades) {
        data.upgrades.forEach((saved, i) => {
            if (upgrades[i]) {
                upgrades[i].owned = saved.owned;
                upgrades[i].cost = saved.cost;
            }
        });
    }
    
    if (data.clickUpgrades) {
        data.clickUpgrades.forEach((saved, i) => {
            if (clickUpgrades[i]) {
                clickUpgrades[i].owned = saved.owned;
                clickUpgrades[i].cost = saved.cost;
            }
        });
    }
    
    if (data.skins) {
        data.skins.forEach((saved, i) => {
            if (skins[i]) skins[i].unlocked = saved.unlocked;
        });
    }
    
    if (data.achievements) {
        data.achievements.forEach((saved, i) => {
            if (achievements[i]) achievements[i].unlocked = saved.unlocked;
        });
    }
    
    potatoEl.textContent = currentSkin;
}
```

### 6. Configurar Variáveis de Ambiente (`.env.local`)

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/neogames?retryWrites=true&w=majority
```

---

## 🎯 Funcionalidades Adicionais

### Sistema de Ranking

```javascript
// src/pages/api/game/leaderboard.js
export default async function handler(req, res) {
  await connectDB();
  
  const topPlayers = await GameSave.find()
    .sort({ 'saveData.potatoes': -1 })
    .limit(10)
    .select('userId saveData.potatoes saveData.prestigeLevel');
  
  res.status(200).json({ leaderboard: topPlayers });
}
```

### Sistema de Autenticação Simples

```javascript
// src/models/User.js
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Use bcrypt!
  createdAt: { type: Date, default: Date.now }
});
```

---

## 📊 Outras Opções Rápidas

### Firebase (Alternativa Simples)

```bash
npm install firebase
```

```javascript
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  databaseURL: "https://seu-projeto.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Salvar
await set(ref(db, 'saves/' + userId), saveData);

// Carregar
const snapshot = await get(ref(db, 'saves/' + userId));
const data = snapshot.val();
```

---

## ⚠️ Segurança

1. **Nunca exponha credenciais** no código
2. Use **variáveis de ambiente** (.env.local)
3. Implemente **autenticação** para saves pessoais
4. Valide **dados no backend**
5. Use **HTTPS** em produção

---

## 🚀 Deploy

Para produção, considere:
- **Vercel** (Next.js) + MongoDB Atlas
- **Netlify** + Firebase
- **AWS** / **Azure** / **Google Cloud**

---

## 📚 Recursos

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Firebase: https://firebase.google.com
- Supabase: https://supabase.com
- Mongoose Docs: https://mongoosejs.com
