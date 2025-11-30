// Game State
let sequence = [];
let playerSequence = [];
let score = 0;
let isPlaying = false;
let isPlayerTurn = false;
let speed = 600;
let gridSize = 2;

const allColors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink', 'lime', 'magenta', 'teal', 'indigo', 'coral', 'gold', 'silver', 'bronze'];
let colors = [];
let buttons = [];

function startGame() {
    const menu = document.getElementById('mainMenu');
    menu.classList.add('hidden');
    menu.classList.remove('visible');
    document.getElementById('gameContainer').classList.add('active');
    document.getElementById('menuBtn').style.display = 'block';
    
    initGame();
}

function showMainMenu() {
    isPlaying = false;
    isPlayerTurn = false;
    
    const menu = document.getElementById('mainMenu');
    menu.classList.remove('hidden');
    menu.classList.add('visible');
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('menuBtn').style.display = 'none';
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('gameOverModal').classList.remove('show');
}

function showCredits() {
    const modal = document.createElement('div');
    modal.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);padding:40px;border-radius:20px;border:3px solid #00d4ff;z-index:10001;text-align:center;color:white;max-width:400px;`;
    modal.innerHTML = `
        <h2 style="color:#00d4ff;margin-bottom:20px;font-size:2rem;">🧠 Code Recall</h2>
        <p style="margin:15px 0;font-size:1.1rem;">Desenvolvido para <strong>NeoGames</strong></p>
        <p style="margin:15px 0;color:#aaa;">Jogo de memória visual! Repita a sequência de cores mostrada.</p>
        <button onclick="this.parentElement.remove();document.getElementById('creditsOverlay').remove()" style="margin-top:20px;padding:12px 30px;background:#00d4ff;color:#0a0a0a;border:none;border-radius:10px;font-size:1rem;font-weight:bold;cursor:pointer;">Fechar</button>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'creditsOverlay';
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;`;
    overlay.onclick = () => { modal.remove(); overlay.remove(); };
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function initGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    speed = 600;
    gridSize = 2;
    isPlaying = true;
    isPlayerTurn = false;
    
    createGrid();
    updateScore();
    updateStatus('Prepare-se...');
    
    setTimeout(nextRound, 1000);
}

function createGrid() {
    const console = document.getElementById('console');
    console.innerHTML = '';
    
    const totalButtons = gridSize * gridSize;
    colors = allColors.slice(0, totalButtons);
    
    const buttonSize = Math.max(80, 480 / gridSize - 10);
    
    console.style.gridTemplateColumns = `repeat(${gridSize}, ${buttonSize}px)`;
    console.style.gridTemplateRows = `repeat(${gridSize}, ${buttonSize}px)`;
    
    for (let i = 0; i < totalButtons; i++) {
        const btn = document.createElement('div');
        btn.className = `color-btn ${colors[i]}`;
        btn.dataset.color = colors[i];
        btn.addEventListener('click', handlePlayerClick);
        console.appendChild(btn);
    }
    
    buttons = document.querySelectorAll('.color-btn');
    updateLevelIndicator();
}

function updateLevelIndicator() {
    document.getElementById('levelIndicator').textContent = `Grade: ${gridSize}x${gridSize} (${gridSize * gridSize} cores)`;
}

function nextRound() {
    if (!isPlaying) return;
    
    playerSequence = [];
    isPlayerTurn = false;
    
    // Aumentar grid a cada 5 rodadas (antes de adicionar nova cor)
    if (score > 0 && score % 5 === 0 && gridSize < 5) {
        gridSize++;
        createGrid();
        updateStatus(`Nível Up! Grade ${gridSize}x${gridSize}`);
        setTimeout(() => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            sequence.push(randomColor);
            score = sequence.length;
            updateScore();
            updateStatus('Observe a sequência...');
            playSequence();
        }, 2000);
        return;
    }
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    score = sequence.length;
    
    updateScore();
    updateStatus('Observe a sequência...');
    
    playSequence();
}

async function playSequence() {
    for (let i = 0; i < sequence.length; i++) {
        await sleep(speed);
        await lightUp(sequence[i]);
    }
    
    isPlayerTurn = true;
    updateStatus('Sua vez! Repita a sequência');
}

function lightUp(color) {
    return new Promise(resolve => {
        const btn = document.querySelector(`[data-color="${color}"]`);
        if (!btn) {
            resolve();
            return;
        }
        btn.classList.add('active');
        
        setTimeout(() => {
            btn.classList.remove('active');
            resolve();
        }, 400);
    });
}

function handlePlayerClick(e) {
    if (!isPlayerTurn || !isPlaying) return;
    
    const color = e.target.dataset.color;
    if (!color) return;
    
    // Prevenir cliques múltiplos
    if (playerSequence.includes(color) && playerSequence.length === sequence.length) return;
    
    playerSequence.push(color);
    
    lightUp(color);
    
    const currentIndex = playerSequence.length - 1;
    
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        gameOver();
        return;
    }
    
    if (playerSequence.length === sequence.length) {
        isPlayerTurn = false;
        updateStatus('Correto! Próxima rodada...');
        
        // Aumentar velocidade a cada 3 rodadas
        if (score % 3 === 0 && score > 0) {
            speed = Math.max(200, speed - 40);
        }
        
        setTimeout(nextRound, 1500);
    }
}

function updateScore() {
    document.getElementById('scoreValue').textContent = score;
}

function updateStatus(text) {
    document.getElementById('statusText').textContent = text;
}

function gameOver() {
    isPlaying = false;
    isPlayerTurn = false;
    
    updateStatus('Erro! Sequência incorreta');
    
    // Remover event listeners
    buttons.forEach(btn => {
        btn.removeEventListener('click', handlePlayerClick);
    });
    
    setTimeout(() => {
        document.getElementById('finalScore').textContent = score - 1;
        document.getElementById('overlay').classList.add('show');
        document.getElementById('gameOverModal').classList.add('show');
    }, 1000);
}

function restartGame() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('gameOverModal').classList.remove('show');
    
    initGame();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
