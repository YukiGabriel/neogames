// Game State
const BOARD_SIZE = 8;
const EMOJIS = ['💖', '✨', '🍓', '🍕', '🚀', '💎'];
let board = [];
let score = 0;
let moves = 30;
let level = 1;
let lives = 5;
let selectedCell = null;
let isAnimating = false;
let boosters = { hammer: 3, shuffle: 2, moves: 2 };
let activeBooster = null;
let coins = 0;
let stars = 0;
let furyBar = 0;
let comboCount = 0;
let dailyStreak = 0;

const levels = [
    { goal: 1500, moves: 25, desc: 'Meta: 1500 pontos', coins: 50, stars: 1 },
    { goal: 3000, moves: 22, desc: 'Meta: 3000 pontos', coins: 75, stars: 1 },
    { goal: 5000, moves: 20, desc: 'Meta: 5000 pontos', coins: 100, stars: 2 },
    { goal: 8000, moves: 18, desc: 'Meta: 8000 pontos', coins: 150, stars: 2 },
    { goal: 12000, moves: 16, desc: 'Meta: 12000 pontos', coins: 200, stars: 3 },
    { goal: 18000, moves: 15, desc: 'Meta: 18000 pontos', coins: 300, stars: 3 },
    { goal: 25000, moves: 14, desc: 'Meta: 25000 pontos', coins: 400, stars: 4 },
    { goal: 35000, moves: 13, desc: 'Meta: 35000 pontos', coins: 500, stars: 5 }
];



function init() {
    loadGame();
    checkDailyLogin();
    createBoard();
    updateUI();
}

function checkDailyLogin() {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('lastLogin');
    
    if (lastLogin !== today) {
        if (lastLogin === new Date(Date.now() - 86400000).toDateString()) {
            dailyStreak++;
        } else {
            dailyStreak = 1;
        }
        
        const reward = Math.min(dailyStreak * 10, 100);
        coins += reward;
        showNotification(`🎁 Login Diário! +${reward} moedas | Sequência: ${dailyStreak} dias`);
        localStorage.setItem('lastLogin', today);
        saveGame();
    }
}

function createBoard() {
    board = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        board[row] = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            board[row][col] = { emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], type: 'normal' };
        }
    }
    
    while (hasMatches()) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (isPartOfMatch(row, col)) {
                    board[row][col] = { emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], type: 'normal' };
                }
            }
        }
    }
    renderBoard();
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const emoji = board[row][col];
            cell.textContent = emoji.emoji;
            
            if (emoji.type === 'striped') cell.classList.add('striped');
            if (emoji.type === 'wrapped') cell.classList.add('wrapped');
            if (emoji.type === 'color-bomb') cell.classList.add('color-bomb');
            
            cell.addEventListener('click', () => handleCellClick(row, col));
            boardEl.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    if (isAnimating) return;
    
    if (activeBooster === 'hammer') {
        useHammer(row, col);
        return;
    }
    
    const cells = document.querySelectorAll('.cell');
    
    if (!selectedCell) {
        selectedCell = { row, col };
        cells[row * BOARD_SIZE + col].classList.add('selected');
    } else {
        cells[selectedCell.row * BOARD_SIZE + selectedCell.col].classList.remove('selected');
        
        if (isAdjacent(selectedCell.row, selectedCell.col, row, col)) {
            swapEmojis(selectedCell.row, selectedCell.col, row, col);
        }
        selectedCell = null;
    }
}

function isAdjacent(row1, col1, row2, col2) {
    return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
           (Math.abs(col1 - col2) === 1 && row1 === row2);
}

async function swapEmojis(row1, col1, row2, col2) {
    isAnimating = true;
    
    [board[row1][col1], board[row2][col2]] = [board[row2][col2], board[row1][col1]];
    renderBoard();
    await sleep(200);
    
    if (!hasMatches()) {
        [board[row1][col1], board[row2][col2]] = [board[row2][col2], board[row1][col1]];
        renderBoard();
        isAnimating = false;
        return;
    }
    
    moves--;
    comboCount = 0;
    updateUI();
    await processMatches();
    
    // Verificar vitória após cada movimento
    const currentLevel = levels[Math.min(level - 1, levels.length - 1)];
    if (score >= currentLevel.goal) {
        checkGameOver();
    } else if (moves <= 0) {
        checkGameOver();
    }
    
    isAnimating = false;
}

function hasMatches() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (isPartOfMatch(row, col)) return true;
        }
    }
    return false;
}

function isPartOfMatch(row, col) {
    if (!board[row][col]) return false;
    const emoji = board[row][col].emoji;
    
    let hCount = 1;
    for (let c = col - 1; c >= 0 && board[row][c] && board[row][c].emoji === emoji; c--) hCount++;
    for (let c = col + 1; c < BOARD_SIZE && board[row][c] && board[row][c].emoji === emoji; c++) hCount++;
    if (hCount >= 3) return true;
    
    let vCount = 1;
    for (let r = row - 1; r >= 0 && board[r][col] && board[r][col].emoji === emoji; r--) vCount++;
    for (let r = row + 1; r < BOARD_SIZE && board[r][col] && board[r][col].emoji === emoji; r++) vCount++;
    if (vCount >= 3) return true;
    
    return false;
}

async function processMatches() {
    while (hasMatches()) {
        comboCount++;
        const matches = findMatches();
        await removeMatches(matches);
        await applyGravity();
        await fillEmpty();
        renderBoard();
        await sleep(300);
        
        if (comboCount > 1) {
            const comboBonus = comboCount * 50;
            score += comboBonus;
            furyBar = Math.min(furyBar + 10, 100);
            showFloatingText(`🔥 COMBO x${comboCount}! +${comboBonus}`);
        }
    }
}

function findMatches() {
    const matches = [];
    const processed = new Set();
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const key = `${row},${col}`;
            if (processed.has(key) || !board[row][col]) continue;
            
            const emoji = board[row][col].emoji;
            const match = [{ row, col }];
            
            for (let c = col + 1; c < BOARD_SIZE && board[row][c] && board[row][c].emoji === emoji; c++) {
                match.push({ row, col: c });
            }
            
            if (match.length >= 3) {
                match.forEach(m => processed.add(`${m.row},${m.col}`));
                matches.push({ cells: match, length: match.length });
            } else {
                match.length = 1;
            }
            
            const vMatch = [{ row, col }];
            for (let r = row + 1; r < BOARD_SIZE && board[r][col] && board[r][col].emoji === emoji; r++) {
                vMatch.push({ row: r, col });
            }
            
            if (vMatch.length >= 3) {
                vMatch.forEach(m => processed.add(`${m.row},${m.col}`));
                matches.push({ cells: vMatch, length: vMatch.length });
            }
        }
    }
    
    return matches;
}

async function removeMatches(matches) {
    for (const match of matches) {
        const points = match.length * 100 * (comboCount || 1);
        score += points;
        
        if (match.length === 4) {
            const cell = match.cells[0];
            board[cell.row][cell.col] = { emoji: board[cell.row][cell.col].emoji, type: 'striped' };
            match.cells.shift();
        } else if (match.length >= 5) {
            const cell = match.cells[0];
            board[cell.row][cell.col] = { emoji: '🌈', type: 'color-bomb' };
            match.cells.shift();
        }
        
        for (const cell of match.cells) {
            board[cell.row][cell.col] = null;
        }
    }
    
    furyBar = Math.min(furyBar + matches.length * 5, 100);
    updateUI();
    await sleep(300);
}

async function applyGravity() {
    for (let col = 0; col < BOARD_SIZE; col++) {
        let emptyRow = BOARD_SIZE - 1;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (board[row][col] !== null) {
                if (row !== emptyRow) {
                    board[emptyRow][col] = board[row][col];
                    board[row][col] = null;
                }
                emptyRow--;
            }
        }
    }
}

async function fillEmpty() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === null) {
                board[row][col] = { emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], type: 'normal' };
            }
        }
    }
}

async function useFuryPower() {
    if (furyBar < 100) return;
    
    furyBar = 0;
    for (let i = 0; i < 5; i++) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        board[row][col] = { emoji: '🌈', type: 'color-bomb' };
    }
    
    renderBoard();
    showNotification('⚡ PODER DA FÚRIA!');
    updateUI();
    await sleep(500);
    await processMatches();
}

function useBooster(type) {
    if (boosters[type] <= 0) return;
    
    if (type === 'hammer') {
        activeBooster = 'hammer';
        document.body.style.cursor = 'crosshair';
    } else if (type === 'shuffle') {
        shuffleBoard();
        boosters.shuffle--;
    } else if (type === 'moves') {
        moves += 5;
        boosters.moves--;
    }
    updateUI();
}

async function useHammer(row, col) {
    board[row][col] = null;
    boosters.hammer--;
    activeBooster = null;
    document.body.style.cursor = 'default';
    
    await applyGravity();
    await fillEmpty();
    renderBoard();
    await processMatches();
    updateUI();
}

function shuffleBoard() {
    const emojis = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            emojis.push(board[row][col]);
        }
    }
    
    for (let i = emojis.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
    }
    
    let idx = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            board[row][col] = emojis[idx++];
        }
    }
    renderBoard();
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = moves;
    document.getElementById('level').textContent = level;
    document.getElementById('coins').textContent = coins;
    document.getElementById('stars').textContent = stars;
    document.getElementById('hammerCount').textContent = boosters.hammer;
    document.getElementById('shuffleCount').textContent = boosters.shuffle;
    document.getElementById('movesCount').textContent = boosters.moves;
    document.getElementById('dailyStreak').textContent = dailyStreak;
    
    document.getElementById('hammerBooster').disabled = boosters.hammer <= 0;
    document.getElementById('shuffleBooster').disabled = boosters.shuffle <= 0;
    document.getElementById('movesBooster').disabled = boosters.moves <= 0;
    document.getElementById('furyBtn').disabled = furyBar < 100;
    
    document.getElementById('furyFill').style.width = furyBar + '%';
    document.getElementById('lives').innerHTML = '❤️'.repeat(lives) + '🖤'.repeat(5 - lives);
    
    const currentLevel = levels[Math.min(level - 1, levels.length - 1)];
    document.getElementById('goal').textContent = currentLevel.desc;
}

function checkGameOver() {
    const currentLevel = levels[Math.min(level - 1, levels.length - 1)];
    
    if (score >= currentLevel.goal) {
        const earnedStars = score >= currentLevel.goal * 1.5 ? 3 : score >= currentLevel.goal * 1.2 ? 2 : 1;
        stars += earnedStars;
        coins += currentLevel.coins;
        showLevelComplete(earnedStars, currentLevel.coins);
    } else {
        showGameOver();
    }
}

function showLevelComplete(earnedStars, earnedCoins) {
    document.getElementById('overlay').classList.add('show');
    document.getElementById('levelComplete').classList.add('show');
    document.getElementById('levelScore').textContent = score;
    document.getElementById('starsEarned').textContent = '⭐'.repeat(earnedStars);
    document.getElementById('coinsEarned').textContent = earnedCoins;
    saveGame();
}

function showGameOver() {
    document.getElementById('overlay').classList.add('show');
    document.getElementById('gameOver').classList.add('show');
    document.getElementById('finalScore').textContent = score;
}

function retryLevel() {
    lives--;
    if (lives <= 0) {
        lives = 5;
        level = 1;
        boosters = { hammer: 3, shuffle: 2, moves: 2 };
    }
    
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('gameOver').classList.remove('show');
    document.getElementById('levelComplete').classList.remove('show');
    
    score = 0;
    furyBar = 0;
    moves = levels[Math.min(level - 1, levels.length - 1)].moves;
    
    createBoard();
    updateUI();
    saveGame();
}

async function nextLevel() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('levelComplete').classList.remove('show');
    
    // Animação de transição
    const container = document.querySelector('.game-container');
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
    
    await sleep(300);
    
    level++;
    score = 0;
    furyBar = 0;
    moves = levels[Math.min(level - 1, levels.length - 1)].moves;
    
    createBoard();
    updateUI();
    saveGame();
    
    // Mostrar novo nível
    showLevelTransition();
    
    await sleep(500);
    container.style.opacity = '1';
    container.style.transform = 'scale(1)';
}

function showLevelTransition() {
    const transition = document.createElement('div');
    transition.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 40px 80px;
        border-radius: 20px;
        font-size: 3rem;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: levelPop 1s ease-out;
    `;
    transition.textContent = `NÍVEL ${level}`;
    document.body.appendChild(transition);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes levelPop {
            0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2) rotate(10deg); }
            100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        transition.style.animation = 'levelPop 0.5s ease-in reverse';
        setTimeout(() => transition.remove(), 500);
    }, 1500);
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function showFloatingText(text) {
    const ft = document.createElement('div');
    ft.className = 'floating-text';
    ft.textContent = text;
    ft.style.left = '50%';
    ft.style.top = '40%';
    document.body.appendChild(ft);
    setTimeout(() => ft.remove(), 1500);
}

function saveGame() {
    localStorage.setItem('emojiCrushSave', JSON.stringify({
        level, lives, boosters, coins, stars, dailyStreak
    }));
}

function loadGame() {
    const save = localStorage.getItem('emojiCrushSave');
    if (save) {
        const data = JSON.parse(save);
        level = data.level || 1;
        lives = data.lives || 5;
        boosters = data.boosters || { hammer: 3, shuffle: 2, moves: 2 };
        coins = data.coins || 0;
        stars = data.stars || 0;
        dailyStreak = data.dailyStreak || 0;
    }
    moves = levels[Math.min(level - 1, levels.length - 1)].moves;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('menuBtn').style.display = 'block';
    
    level = 1;
    lives = 5;
    score = 0;
    furyBar = 0;
    coins = 0;
    stars = 0;
    dailyStreak = 0;
    boosters = { hammer: 3, shuffle: 2, moves: 2 };
    
    moves = levels[0].moves;
    createBoard();
    updateUI();
}

function showMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('menuBtn').style.display = 'none';
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('gameOver').classList.remove('show');
    document.getElementById('levelComplete').classList.remove('show');
    saveGame();
}

function showCredits() {
    const modal = document.createElement('div');
    modal.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:40px;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.5);z-index:10001;text-align:center;color:#333;max-width:400px;`;
    modal.innerHTML = `
        <h2 style="color:#667eea;margin-bottom:20px;font-size:2rem;">🎮 Emoji Crush</h2>
        <p style="margin:15px 0;font-size:1.1rem;">Desenvolvido para <strong>NeoGames</strong></p>
        <p style="margin:15px 0;color:#666;">Um jogo match-3 com power-ups, combos e emojis raros para colecionar!</p>
        <button onclick="this.parentElement.remove();document.getElementById('creditsOverlay').remove()" style="margin-top:20px;padding:12px 30px;background:#667eea;color:white;border:none;border-radius:10px;font-size:1rem;font-weight:bold;cursor:pointer;">Fechar</button>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'creditsOverlay';
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;`;
    overlay.onclick = () => { modal.remove(); overlay.remove(); };
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

init();
