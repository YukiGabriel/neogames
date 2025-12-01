// Game State
let potatoes = 0;
let potatoesPerSecond = 0;
let clickPower = 1;
let prestigeLevel = 0;
let prestigeMultiplier = 1;
let currentSkin = '🥔';
let totalClicks = 0;
let totalPotatoesEarned = 0;
let gameStartTime = Date.now();
let uiTheme = localStorage.getItem('uiTheme') || 'purple';
let clickKeybind = localStorage.getItem('clickKeybind') || null;
let isSettingKeybind = false;
let usedCodes = JSON.parse(localStorage.getItem('usedCodes') || '[]');
let playerName = localStorage.getItem('playerName') || 'Jogador';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
let globalLeaderboard = [];

// CONFIGURE AQUI: Cole sua API Key e Bin ID do JSONBin.io
const JSONBIN_API_KEY = '$2a$10$hasSmM1JlGKrytK.ci06Y.dOZmhYBiS/gu5W8u/ai.68WLnbE2rDa'; // Substitua pela sua API Key
const JSONBIN_BIN_ID = '692b4f71ae596e708f78f459'; // Substitua pelo seu Bin ID

const codes = {
    '10BCLICKS': { type: 'clickPower', value: 10000000000, desc: '10B de poder de clique' },
    'MEGABOOST': { type: 'potatoes', value: 1000000000, desc: '1B de batatas' },
    'PRESTIGE5': { type: 'prestige', value: 5, desc: '5 níveis de prestígio' },
    'ALLSKINS': { type: 'skins', value: true, desc: 'Todas as skins' },
    'SPEEDUP': { type: 'production', value: 1000000, desc: '1M batatas/seg' },
    'STARTER': { type: 'potatoes', value: 100000, desc: '100K batatas iniciais' },
    'LUCKY7': { type: 'clickPower', value: 7777, desc: '7777 de poder de clique' },
    'GOLDENPOTATO': { type: 'potatoes', value: 50000000, desc: '50M de batatas' }
};

const upgrades = [
    { name: '👨‍🌾 Fazendeiro', cost: 15, owned: 0, pps: 0.2, baseCost: 15, multiplier: 1.18 },
    { name: '🚜 Trator', cost: 150, owned: 0, pps: 1.5, baseCost: 150, multiplier: 1.18 },
    { name: '🏭 Fábrica', cost: 1500, owned: 0, pps: 10, baseCost: 1500, multiplier: 1.18 },
    { name: '🤖 Robô', cost: 15000, owned: 0, pps: 80, baseCost: 15000, multiplier: 1.18 },
    { name: '🏙️ Cidade', cost: 150000, owned: 0, pps: 500, baseCost: 150000, multiplier: 1.18 },
    { name: '🚀 Nave Espacial', cost: 1500000, owned: 0, pps: 3500, baseCost: 1500000, multiplier: 1.18 },
    { name: '🌍 Planeta', cost: 15000000, owned: 0, pps: 25000, baseCost: 15000000, multiplier: 1.18 },
    { name: '🌌 Galáxia', cost: 150000000, owned: 0, pps: 180000, baseCost: 150000000, multiplier: 1.18 },
    { name: '🔮 Portal Mágico', cost: 1500000000, owned: 0, pps: 1300000, baseCost: 1500000000, multiplier: 1.18 },
    { name: '🌀 Dimensão', cost: 15000000000, owned: 0, pps: 10000000, baseCost: 15000000000, multiplier: 1.18 },
    { name: '⚡ Universo', cost: 150000000000, owned: 0, pps: 80000000, baseCost: 150000000000, multiplier: 1.18 },
    { name: '🌟 Multiverso', cost: 1500000000000, owned: 0, pps: 650000000, baseCost: 1500000000000, multiplier: 1.18 },
    { name: '👁️ Omniverso', cost: 15000000000000, owned: 0, pps: 5000000000, baseCost: 15000000000000, multiplier: 1.18 }
];

const clickUpgrades = [
    { name: '👆 Cursor', cost: 75, owned: 0, power: 1, baseCost: 75, multiplier: 1.25 },
    { name: '✋ Mão de Ferro', cost: 750, owned: 0, power: 3, baseCost: 750, multiplier: 1.25 },
    { name: '💪 Braço Mecânico', cost: 7500, owned: 0, power: 15, baseCost: 7500, multiplier: 1.25 },
    { name: '🦾 Braço Cibernético', cost: 75000, owned: 0, power: 60, baseCost: 75000, multiplier: 1.25 },
    { name: '⚡ Poder Elétrico', cost: 750000, owned: 0, power: 300, baseCost: 750000, multiplier: 1.25 },
    { name: '🔥 Toque Flamejante', cost: 7500000, owned: 0, power: 1500, baseCost: 7500000, multiplier: 1.25 },
    { name: '💎 Dedo Diamante', cost: 75000000, owned: 0, power: 7500, baseCost: 75000000, multiplier: 1.25 },
    { name: '🌟 Clique Divino', cost: 750000000, owned: 0, power: 40000, baseCost: 750000000, multiplier: 1.25 },
    { name: '🌌 Clique Cósmico', cost: 7500000000, owned: 0, power: 200000, baseCost: 7500000000, multiplier: 1.25 },
    { name: '👑 Clique Real', cost: 75000000000, owned: 0, power: 1000000, baseCost: 75000000000, multiplier: 1.25 },
    { name: '🔱 Clique Supremo', cost: 750000000000, owned: 0, power: 5000000, baseCost: 750000000000, multiplier: 1.25 }
];

const skins = [
    { emoji: '🥔', name: 'Batata Clássica', requirement: 0, unlocked: true },
    { emoji: '🍟', name: 'Batata Frita', requirement: 500, unlocked: false },
    { emoji: '🧀', name: 'Batata com Queijo', requirement: 2500, unlocked: false },
    { emoji: '🥓', name: 'Batata com Bacon', requirement: 10000, unlocked: false },
    { emoji: '🌟', name: 'Batata Dourada', requirement: 50000, unlocked: false },
    { emoji: '💎', name: 'Batata Diamante', requirement: 250000, unlocked: false },
    { emoji: '🔥', name: 'Batata Flamejante', requirement: 1000000, unlocked: false },
    { emoji: '❄️', name: 'Batata Congelada', requirement: 5000000, unlocked: false },
    { emoji: '🌈', name: 'Batata Arco-Íris', requirement: 25000000, unlocked: false },
    { emoji: '⚡', name: 'Batata Elétrica', requirement: 100000000, unlocked: false },
    { emoji: '👑', name: 'Batata Real', requirement: 500000000, unlocked: false },
    { emoji: '🌌', name: 'Batata Cósmica', requirement: 2500000000, unlocked: false },
    { emoji: '🔮', name: 'Batata Mística', requirement: 10000000000, unlocked: false },
    { emoji: '👁️', name: 'Batata Onisciente', requirement: 50000000000, unlocked: false },
    { emoji: '🎃', name: 'Batata Halloween', requirement: 100000000000, unlocked: false }
];

const achievements = [
    { id: 'first_click', name: 'Primeiro Clique', desc: 'Clique na batata', icon: '👆', unlocked: false, check: () => totalClicks >= 1 },
    { id: 'hundred', name: 'Centenário', desc: '100 batatas', icon: '💯', unlocked: false, check: () => potatoes >= 100 },
    { id: 'thousand', name: 'Milhar', desc: '1.000 batatas', icon: '🎯', unlocked: false, check: () => potatoes >= 1000 },
    { id: 'ten_thousand', name: 'Dez Mil', desc: '10.000 batatas', icon: '🔟', unlocked: false, check: () => potatoes >= 10000 },
    { id: 'hundred_thousand', name: 'Cem Mil', desc: '100.000 batatas', icon: '💰', unlocked: false, check: () => potatoes >= 100000 },
    { id: 'million', name: 'Milionário', desc: '1.000.000 batatas', icon: '💎', unlocked: false, check: () => potatoes >= 1000000 },
    { id: 'billion', name: 'Bilionário', desc: '1.000.000.000 batatas', icon: '🏆', unlocked: false, check: () => potatoes >= 1000000000 },
    { id: 'trillion', name: 'Trilionário', desc: '1.000.000.000.000 batatas', icon: '👑', unlocked: false, check: () => potatoes >= 1000000000000 },
    { id: 'first_upgrade', name: 'Primeiro Upgrade', desc: 'Compre um upgrade', icon: '🛒', unlocked: false, check: () => upgrades.some(u => u.owned > 0) || clickUpgrades.some(u => u.owned > 0) },
    { id: 'ten_upgrades', name: 'Colecionador', desc: '10 upgrades', icon: '📦', unlocked: false, check: () => upgrades.reduce((s, u) => s + u.owned, 0) + clickUpgrades.reduce((s, u) => s + u.owned, 0) >= 10 },
    { id: 'fifty_upgrades', name: 'Acumulador', desc: '50 upgrades', icon: '📚', unlocked: false, check: () => upgrades.reduce((s, u) => s + u.owned, 0) + clickUpgrades.reduce((s, u) => s + u.owned, 0) >= 50 },
    { id: 'hundred_upgrades', name: 'Mestre Coletor', desc: '100 upgrades', icon: '🎓', unlocked: false, check: () => upgrades.reduce((s, u) => s + u.owned, 0) + clickUpgrades.reduce((s, u) => s + u.owned, 0) >= 100 },
    { id: 'auto_100', name: 'Automação', desc: '100 batatas/seg', icon: '⚡', unlocked: false, check: () => potatoesPerSecond >= 100 },
    { id: 'auto_1000', name: 'Fábrica', desc: '1.000 batatas/seg', icon: '🏭', unlocked: false, check: () => potatoesPerSecond >= 1000 },
    { id: 'auto_10000', name: 'Indústria', desc: '10.000 batatas/seg', icon: '🏙️', unlocked: false, check: () => potatoesPerSecond >= 10000 },
    { id: 'clicks_100', name: 'Clicador', desc: '100 cliques', icon: '🖱️', unlocked: false, check: () => totalClicks >= 100 },
    { id: 'clicks_1000', name: 'Clicador Pro', desc: '1.000 cliques', icon: '⌨️', unlocked: false, check: () => totalClicks >= 1000 },
    { id: 'clicks_10000', name: 'Clicador Master', desc: '10.000 cliques', icon: '🎮', unlocked: false, check: () => totalClicks >= 10000 },
    { id: 'first_prestige', name: 'Renascimento', desc: 'Primeiro prestígio', icon: '⭐', unlocked: false, check: () => prestigeLevel >= 1 },
    { id: 'five_prestige', name: 'Veterano', desc: '5 prestígios', icon: '🌟', unlocked: false, check: () => prestigeLevel >= 5 },
    { id: 'ten_prestige', name: 'Lenda', desc: '10 prestígios', icon: '👑', unlocked: false, check: () => prestigeLevel >= 10 },
    { id: 'all_skins', name: 'Fashionista', desc: 'Todas as skins', icon: '🎨', unlocked: false, check: () => skins.every(s => s.unlocked) },
    { id: 'half_skins', name: 'Coletor de Skins', desc: 'Metade das skins', icon: '🎭', unlocked: false, check: () => skins.filter(s => s.unlocked).length >= Math.floor(skins.length / 2) }
];

const themes = {
    purple: { primary: '#667eea', secondary: '#764ba2', accent: '#ffd700' },
    blue: { primary: '#2193b0', secondary: '#6dd5ed', accent: '#00d4ff' },
    green: { primary: '#11998e', secondary: '#38ef7d', accent: '#90ee90' },
    red: { primary: '#eb3349', secondary: '#f45c43', accent: '#ff6b6b' },
    orange: { primary: '#f46b45', secondary: '#eea849', accent: '#ffa500' },
    pink: { primary: '#ff6a88', secondary: '#ff99ac', accent: '#ff69b4' }
};

const potatoEl = document.getElementById('potato');
const countEl = document.getElementById('count');
const perSecondEl = document.getElementById('perSecond');
const multiplierEl = document.getElementById('multiplier');
const upgradesEl = document.getElementById('upgrades');
const skinsEl = document.getElementById('skinsContainer');
const achievementsEl = document.getElementById('achievementsContainer');
const prestigeBtn = document.getElementById('prestigeBtn');
const prestigeMultiplierEl = document.getElementById('prestigeMultiplier');
const nextPrestigeEl = document.getElementById('nextPrestige');

function formatNumber(num) {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num);
}

function updateDisplay() {
    countEl.textContent = formatNumber(potatoes) + ' batatas';
    perSecondEl.textContent = formatNumber(potatoesPerSecond * prestigeMultiplier) + '/seg';
    multiplierEl.textContent = prestigeLevel > 0 ? `Multiplicador: x${prestigeMultiplier}` : '';
    prestigeMultiplierEl.textContent = `x${prestigeMultiplier}`;
    nextPrestigeEl.textContent = `x${prestigeLevel + 2}`;
    prestigeBtn.disabled = potatoes < 10000000;
}

function showClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = '+' + formatNumber(clickPower * prestigeMultiplier);
    effect.style.left = (x - 50) + 'px';
    effect.style.top = (y - 50) + 'px';
    effect.style.position = 'fixed';
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

function performClick(x, y) {
    const earned = clickPower * prestigeMultiplier;
    potatoes += earned;
    totalPotatoesEarned += earned;
    totalClicks++;
    updateDisplay();
    checkAchievements();
    checkSkinUnlocks();
    showClickEffect(x, y);
}

potatoEl.addEventListener('click', (e) => {
    performClick(e.clientX, e.clientY);
});

document.addEventListener('keydown', (e) => {
    if (isSettingKeybind) return;
    if (clickKeybind && e.key.toLowerCase() === clickKeybind.toLowerCase()) {
        e.preventDefault();
        const rect = potatoEl.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        performClick(x, y);
        potatoEl.style.transform = 'scale(0.95)';
        setTimeout(() => potatoEl.style.transform = '', 100);
    }
});

function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (potatoes >= upgrade.cost) {
        potatoes -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.owned));
        potatoesPerSecond += upgrade.pps;
        updateDisplay();
        renderUpgrades();
        checkAchievements();
    }
}

function buyClickUpgrade(index) {
    const upgrade = clickUpgrades[index];
    if (potatoes >= upgrade.cost) {
        potatoes -= upgrade.cost;
        upgrade.owned++;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.owned));
        clickPower += upgrade.power;
        updateDisplay();
        renderUpgrades();
        checkAchievements();
    }
}

function renderUpgrades() {
    const clickHTML = clickUpgrades.map((u, i) => `
        <div class="upgrade ${potatoes >= u.cost ? '' : 'disabled'}" onclick="buyClickUpgrade(${i})">
            <div class="upgrade-header">
                <div class="upgrade-name">${u.name}</div>
                <div class="upgrade-cost">${formatNumber(u.cost)}</div>
            </div>
            <div class="upgrade-info">Possui: ${u.owned} | +${formatNumber(u.power)}/clique</div>
        </div>
    `).join('');

    const autoHTML = upgrades.map((u, i) => `
        <div class="upgrade ${potatoes >= u.cost ? '' : 'disabled'}" onclick="buyUpgrade(${i})">
            <div class="upgrade-header">
                <div class="upgrade-name">${u.name}</div>
                <div class="upgrade-cost">${formatNumber(u.cost)}</div>
            </div>
            <div class="upgrade-info">Possui: ${u.owned} | +${formatNumber(u.pps)}/seg</div>
        </div>
    `).join('');

    upgradesEl.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: var(--accent); margin-bottom: 10px; font-size: 1.2rem;">👆 Upgrades de Clique</h3>
            ${clickHTML}
        </div>
        <div>
            <h3 style="color: var(--accent); margin-bottom: 10px; font-size: 1.2rem;">⚡ Produção Automática</h3>
            ${autoHTML}
        </div>
    `;
}

function selectSkin(index) {
    const skin = skins[index];
    if (skin.unlocked) {
        currentSkin = skin.emoji;
        potatoEl.textContent = currentSkin;
        renderSkins();
        saveGame();
    }
}

function checkSkinUnlocks() {
    skins.forEach(skin => {
        if (!skin.unlocked && potatoes >= skin.requirement) {
            skin.unlocked = true;
            showNotification(`🎨 Nova skin: ${skin.name}!`);
        }
    });
    renderSkins();
}

function renderSkins() {
    skinsEl.innerHTML = skins.map((s, i) => `
        <div class="skin ${s.unlocked ? (s.emoji === currentSkin ? 'active' : '') : 'locked'}" 
             onclick="selectSkin(${i})"
             title="${s.name} - ${s.unlocked ? 'Desbloqueada' : formatNumber(s.requirement) + ' batatas'}">
            ${s.emoji}
        </div>
    `).join('');
}

function checkAchievements() {
    achievements.forEach(a => {
        if (!a.unlocked && a.check()) {
            a.unlocked = true;
            showNotification(`🏆 ${a.name}!`);
        }
    });
    renderAchievements();
}

function renderAchievements() {
    achievementsEl.innerHTML = achievements.map(a => `
        <div class="achievement ${a.unlocked ? 'unlocked' : ''}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${a.name}</div>
                <div class="achievement-desc">${a.desc}</div>
            </div>
        </div>
    `).join('');
}

function updateLeaderboard() {
    const score = {
        name: playerName,
        potatoes: totalPotatoesEarned,
        prestige: prestigeLevel,
        clicks: totalClicks,
        timestamp: Date.now()
    };
    
    leaderboard = leaderboard.filter(s => s.name !== playerName);
    leaderboard.push(score);
    leaderboard.sort((a, b) => b.potatoes - a.potatoes);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

async function saveToGlobalLeaderboard() {
    if (!JSONBIN_API_KEY.includes('EXAMPLE') && !JSONBIN_BIN_ID.includes('6789')) {
        try {
            const score = {
                name: playerName,
                potatoes: totalPotatoesEarned,
                prestige: prestigeLevel,
                clicks: totalClicks,
                timestamp: Date.now()
            };
            
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: { 'X-Master-Key': JSONBIN_API_KEY }
            });
            const data = await response.json();
            let players = data.record.players || [];
            
            players = players.filter(p => p.name !== playerName);
            players.push(score);
            players.sort((a, b) => b.potatoes - a.potatoes);
            players = players.slice(0, 100);
            
            await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ players })
            });
            
            globalLeaderboard = players;
            return true;
        } catch (error) {
            console.error('Erro ao salvar no placar global:', error);
            return false;
        }
    }
    return false;
}

async function loadGlobalLeaderboard() {
    if (!JSONBIN_API_KEY.includes('EXAMPLE') && !JSONBIN_BIN_ID.includes('6789')) {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: { 'X-Master-Key': JSONBIN_API_KEY }
            });
            const data = await response.json();
            globalLeaderboard = data.record.players || [];
            renderGlobalLeaderboard();
        } catch (error) {
            console.error('Erro ao carregar placar global:', error);
        }
    }
}

function renderGlobalLeaderboard() {
    const globalEl = document.getElementById('globalLeaderboardContainer');
    if (!globalEl) return;
    
    if (globalLeaderboard.length === 0) {
        globalEl.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Carregando placar global...</div>';
        return;
    }
    
    globalEl.innerHTML = globalLeaderboard.slice(0, 10).map((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`;
        const isCurrentPlayer = player.name === playerName;
        return `
            <div class="leaderboard-item ${isCurrentPlayer ? 'current-player' : ''}">
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${player.name}</div>
                    <div class="leaderboard-stats">
                        🥔 ${formatNumber(player.potatoes)} | ⭐ ${player.prestige} | 👆 ${formatNumber(player.clicks)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLeaderboard() {
    const leaderboardEl = document.getElementById('leaderboardContainer');
    if (!leaderboardEl) return;
    
    if (leaderboard.length === 0) {
        leaderboardEl.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">Nenhum jogador ainda. Seja o primeiro!</div>';
        return;
    }
    
    leaderboardEl.innerHTML = leaderboard.map((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`;
        const isCurrentPlayer = player.name === playerName;
        return `
            <div class="leaderboard-item ${isCurrentPlayer ? 'current-player' : ''}">
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${player.name}</div>
                    <div class="leaderboard-stats">
                        🥔 ${formatNumber(player.potatoes)} | ⭐ ${player.prestige} | 👆 ${formatNumber(player.clicks)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setPlayerName() {
    const name = prompt('Digite seu nome de jogador:', playerName);
    if (name && name.trim()) {
        playerName = name.trim().substring(0, 20);
        localStorage.setItem('playerName', playerName);
        document.getElementById('playerNameDisplay').textContent = playerName;
        updateLeaderboard();
        renderLeaderboard();
        showNotification(`👤 Nome alterado para: ${playerName}`);
    }
}

function renderStats() {
    const statsEl = document.getElementById('statsContainer');
    const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
    const hours = Math.floor(playTime / 3600);
    const minutes = Math.floor((playTime % 3600) / 60);
    const seconds = playTime % 60;
    const totalUpgrades = upgrades.reduce((s, u) => s + u.owned, 0) + clickUpgrades.reduce((s, u) => s + u.owned, 0);
    const unlockedSkins = skins.filter(s => s.unlocked).length;
    const unlockedAchievements = achievements.filter(a => a.unlocked).length;
    const clickPercentage = totalClicks > 0 ? ((totalClicks / totalPotatoesEarned) * 100).toFixed(1) : 0;
    
    statsEl.innerHTML = `
        <div class="stat-item">
            <div class="stat-icon">🖱️</div>
            <div class="stat-info">
                <div class="stat-label">Total de Cliques</div>
                <div class="stat-value">${formatNumber(totalClicks)}</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">🥔</div>
            <div class="stat-info">
                <div class="stat-label">Batatas Totais Ganhas</div>
                <div class="stat-value">${formatNumber(totalPotatoesEarned)}</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">⚡</div>
            <div class="stat-info">
                <div class="stat-label">Produção por Segundo</div>
                <div class="stat-value">${formatNumber(potatoesPerSecond * prestigeMultiplier)}/seg</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">👆</div>
            <div class="stat-info">
                <div class="stat-label">Poder de Clique</div>
                <div class="stat-value">${formatNumber(clickPower * prestigeMultiplier)}</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
                <div class="stat-label">Nível de Prestígio</div>
                <div class="stat-value">${prestigeLevel} (x${prestigeMultiplier})</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">🛒</div>
            <div class="stat-info">
                <div class="stat-label">Total de Upgrades</div>
                <div class="stat-value">${totalUpgrades}</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">🎨</div>
            <div class="stat-info">
                <div class="stat-label">Skins Desbloqueadas</div>
                <div class="stat-value">${unlockedSkins}/${skins.length}</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
                <div class="stat-label">Conquistas</div>
                <div class="stat-value">${unlockedAchievements}/${achievements.length}</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
                <div class="stat-label">Tempo de Jogo</div>
                <div class="stat-value">${hours}h ${minutes}m ${seconds}s</div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
                <div class="stat-label">Eficiência de Clique</div>
                <div class="stat-value">${clickPercentage}%</div>
            </div>
        </div>
    `;
}

function doPrestige() {
    if (potatoes >= 10000000) {
        if (confirm('Prestígio resetará tudo mas aumentará o multiplicador. Continuar?')) {
            prestigeLevel++;
            prestigeMultiplier = prestigeLevel + 1;
            potatoes = 0;
            potatoesPerSecond = 0;
            clickPower = 1;
            upgrades.forEach(u => { u.owned = 0; u.cost = u.baseCost; });
            clickUpgrades.forEach(u => { u.owned = 0; u.cost = u.baseCost; });
            updateDisplay();
            renderUpgrades();
            checkAchievements();
            showNotification(`⭐ Prestígio ${prestigeLevel}! Multiplicador: x${prestigeMultiplier}`);
        }
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function changeTheme(theme) {
    uiTheme = theme;
    const t = themes[theme];
    document.documentElement.style.setProperty('--primary', t.primary);
    document.documentElement.style.setProperty('--secondary', t.secondary);
    document.documentElement.style.setProperty('--accent', t.accent);
    localStorage.setItem('uiTheme', theme);
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function setKeybind() {
    isSettingKeybind = true;
    const btn = document.getElementById('keybindBtn');
    btn.textContent = 'Pressione uma tecla...';
    btn.style.background = 'rgba(255,215,0,0.3)';
    
    const handler = (e) => {
        e.preventDefault();
        clickKeybind = e.key;
        localStorage.setItem('clickKeybind', e.key);
        btn.textContent = `Tecla: ${e.key.toUpperCase()}`;
        btn.style.background = '';
        isSettingKeybind = false;
        document.removeEventListener('keydown', handler);
        showNotification(`⌨️ Keybind definida: ${e.key.toUpperCase()}`);
    };
    
    document.addEventListener('keydown', handler);
}

function removeKeybind() {
    clickKeybind = null;
    localStorage.removeItem('clickKeybind');
    document.getElementById('keybindBtn').textContent = 'Definir Tecla';
    showNotification('⌨️ Keybind removida!');
}

function redeemCode() {
    const input = document.getElementById('codeInput');
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('❌ Digite um código!');
        return;
    }
    
    if (usedCodes.includes(code)) {
        showNotification('❌ Código já usado!');
        input.value = '';
        return;
    }
    
    if (!codes[code]) {
        showNotification('❌ Código inválido!');
        input.value = '';
        return;
    }
    
    const reward = codes[code];
    
    switch(reward.type) {
        case 'clickPower':
            clickPower += reward.value;
            break;
        case 'potatoes':
            potatoes += reward.value;
            totalPotatoesEarned += reward.value;
            break;
        case 'prestige':
            prestigeLevel += reward.value;
            prestigeMultiplier = prestigeLevel + 1;
            break;
        case 'skins':
            skins.forEach(s => s.unlocked = true);
            renderSkins();
            break;
        case 'production':
            potatoesPerSecond += reward.value;
            break;
    }
    
    usedCodes.push(code);
    localStorage.setItem('usedCodes', JSON.stringify(usedCodes));
    
    showNotification(`✅ ${reward.desc} resgatado!`);
    input.value = '';
    updateDisplay();
    renderUpgrades();
    checkAchievements();
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:20px;right:20px;background:rgba(0,0,0,0.9);color:var(--accent);padding:20px;border-radius:10px;font-size:1.2rem;z-index:1000;animation:slideIn 0.5s;box-shadow:0 5px 20px rgba(0,0,0,0.5)`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function saveGame() {
    updateLeaderboard();
    saveToGlobalLeaderboard();
    const data = {
        potatoes, potatoesPerSecond, clickPower, prestigeLevel, prestigeMultiplier, currentSkin, totalClicks, totalPotatoesEarned, gameStartTime, uiTheme, clickKeybind, usedCodes, playerName,
        upgrades: upgrades.map(u => ({ owned: u.owned, cost: u.cost })),
        clickUpgrades: clickUpgrades.map(u => ({ owned: u.owned, cost: u.cost })),
        skins: skins.map(s => ({ unlocked: s.unlocked })),
        achievements: achievements.map(a => ({ unlocked: a.unlocked }))
    };
    localStorage.setItem('potatoClickerSave', JSON.stringify(data));
    showNotification('💾 Salvo!');
}

function loadGame() {
    const data = localStorage.getItem('potatoClickerSave');
    if (data) {
        const d = JSON.parse(data);
        potatoes = d.potatoes || 0;
        potatoesPerSecond = d.potatoesPerSecond || 0;
        clickPower = d.clickPower || 1;
        prestigeLevel = d.prestigeLevel || 0;
        prestigeMultiplier = d.prestigeMultiplier || 1;
        currentSkin = d.currentSkin || '🥔';
        totalClicks = d.totalClicks || 0;
        totalPotatoesEarned = d.totalPotatoesEarned || 0;
        gameStartTime = d.gameStartTime || Date.now();
        uiTheme = d.uiTheme || 'purple';
        clickKeybind = d.clickKeybind || null;
        usedCodes = d.usedCodes || [];
        playerName = d.playerName || 'Jogador';
        
        if (d.upgrades) d.upgrades.forEach((s, i) => { if (upgrades[i]) { upgrades[i].owned = s.owned; upgrades[i].cost = s.cost; } });
        if (d.clickUpgrades) d.clickUpgrades.forEach((s, i) => { if (clickUpgrades[i]) { clickUpgrades[i].owned = s.owned; clickUpgrades[i].cost = s.cost; } });
        if (d.skins) d.skins.forEach((s, i) => { if (skins[i]) skins[i].unlocked = s.unlocked; });
        if (d.achievements) d.achievements.forEach((s, i) => { if (achievements[i]) achievements[i].unlocked = s.unlocked; });
        
        potatoEl.textContent = currentSkin;
        changeTheme(uiTheme);
    }
}

setInterval(saveGame, 30000);
let upgradeRenderCounter = 0;
setInterval(() => {
    const earned = (potatoesPerSecond * prestigeMultiplier) / 10;
    potatoes += earned;
    totalPotatoesEarned += earned;
    updateDisplay();
    
    upgradeRenderCounter++;
    if (upgradeRenderCounter >= 10) {
        renderUpgrades();
        upgradeRenderCounter = 0;
    }
    
    checkAchievements();
    checkSkinUnlocks();
}, 100);

setInterval(() => {
    if (document.getElementById('stats').classList.contains('active')) {
        renderStats();
    }
}, 1000);

loadGame();
updateDisplay();
renderUpgrades();
renderSkins();
renderAchievements();
renderStats();
renderLeaderboard();
loadGlobalLeaderboard();
changeTheme(uiTheme);
if (clickKeybind) {
    document.getElementById('keybindBtn').textContent = `Tecla: ${clickKeybind.toUpperCase()}`;
}
if (document.getElementById('playerNameDisplay')) {
    document.getElementById('playerNameDisplay').textContent = playerName;
}
