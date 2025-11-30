// Game State
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let GRID_SIZE = 20;
let TILE_SIZE = 30;
let canvasSize = 600;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = [];
let obstacles = [];
let score = 0;
let xp = 0;
let level = 1;
let gameLoop = null;
let speed = 150;
let isGameRunning = false;
let lastUpdateTime = 0;
let accumulator = 0;
let snakePositions = [];

// Abilities
let abilities = {
    dash: { cooldown: 0, maxCooldown: 5000, active: false },
    shield: { cooldown: 0, maxCooldown: 10000, active: false, duration: 0 },
    magnet: { cooldown: 0, maxCooldown: 8000, active: false, duration: 0 }
};

// Food types
const FOOD_TYPES = {
    normal: { color: '#00ff88', points: 10, xp: 5, size: 1 },
    super: { color: '#ffd700', points: 30, xp: 15, size: 3 },
    speed: { color: '#ff6b6b', points: 20, xp: 10, size: 1 },
    ability: { color: '#00d4ff', points: 15, xp: 8, size: 1 }
};

function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    const maxSize = Math.min(container.clientWidth - 40, container.clientHeight - 40);
    
    if (maxSize < 500) {
        GRID_SIZE = 15;
        canvasSize = Math.min(maxSize, 450);
    } else if (maxSize < 700) {
        GRID_SIZE = 20;
        canvasSize = Math.min(maxSize, 600);
    } else {
        GRID_SIZE = 25;
        canvasSize = Math.min(maxSize, 800);
    }
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    TILE_SIZE = canvasSize / GRID_SIZE;
}

function initGame() {
    resizeCanvas();
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    snakePositions = snake.map(s => ({ x: s.x * TILE_SIZE, y: s.y * TILE_SIZE }));
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    xp = 0;
    level = 1;
    speed = 150;
    accumulator = 0;
    food = [];
    obstacles = [];
    
    abilities.dash.cooldown = 0;
    abilities.shield.cooldown = 0;
    abilities.magnet.cooldown = 0;
    abilities.shield.active = false;
    abilities.magnet.active = false;
    
    spawnFood();
    generateObstacles();
    updateUI();
}

function startGame() {
    const menu = document.getElementById('mainMenu');
    menu.classList.add('hidden');
    menu.classList.remove('visible');
    document.getElementById('gameContainer').classList.add('active');
    document.getElementById('menuBtn').style.display = 'block';
    document.getElementById('touchControls').style.display = 'grid';
    
    document.removeEventListener('keydown', handleKeyPress);
    
    window.addEventListener('resize', handleResize);
    setupTouchControls();
    
    initGame();
    isGameRunning = true;
    accumulator = 0;
    lastUpdateTime = performance.now();
    gameLoop = requestAnimationFrame(gameLoopFunc);
    
    document.addEventListener('keydown', handleKeyPress);
}

function showMainMenu() {
    isGameRunning = false;
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = null;
    
    const menu = document.getElementById('mainMenu');
    menu.classList.remove('hidden');
    menu.classList.add('visible');
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('menuBtn').style.display = 'none';
    document.getElementById('touchControls').style.display = 'none';
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('gameOverModal').classList.remove('show');
    
    document.removeEventListener('keydown', handleKeyPress);
    window.removeEventListener('resize', handleResize);
    removeTouchControls();
}

function showCredits() {
    const modal = document.createElement('div');
    modal.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);padding:40px;border-radius:20px;border:3px solid #00ff88;z-index:10001;text-align:center;color:white;max-width:400px;`;
    modal.innerHTML = `
        <h2 style="color:#00ff88;margin-bottom:20px;font-size:2rem;">🐍 NeoSnake</h2>
        <p style="margin:15px 0;font-size:1.1rem;">Desenvolvido para <strong>NeoGames</strong></p>
        <p style="margin:15px 0;color:#aaa;">O clássico Snake reimaginado com habilidades, power-ups e ação dinâmica!</p>
        <button onclick="this.parentElement.remove();document.getElementById('creditsOverlay').remove()" style="margin-top:20px;padding:12px 30px;background:#00ff88;color:#0f0f23;border:none;border-radius:10px;font-size:1rem;font-weight:bold;cursor:pointer;">Fechar</button>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'creditsOverlay';
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;`;
    overlay.onclick = () => { modal.remove(); overlay.remove(); };
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function handleKeyPress(e) {
    if (!isGameRunning) return;
    
    const key = e.key.toLowerCase();
    
    // Movement
    if ((key === 'arrowup' || key === 'w') && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
    } else if ((key === 'arrowdown' || key === 's') && direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
    } else if ((key === 'arrowleft' || key === 'a') && direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
    } else if ((key === 'arrowright' || key === 'd') && direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
    }
    
    // Abilities
    if (key === '1' || key === 'q') useDash();
    if (key === '2' || key === 'e') useShield();
    if (key === '3' || key === 'r') useMagnet();
}

function gameLoopFunc(currentTime) {
    if (!isGameRunning) return;
    
    const deltaTime = currentTime - lastUpdateTime;
    accumulator += deltaTime;
    lastUpdateTime = currentTime;
    
    while (accumulator >= speed) {
        update();
        accumulator -= speed;
    }
    
    const alpha = accumulator / speed;
    interpolatePositions(alpha);
    render();
    
    gameLoop = requestAnimationFrame(gameLoopFunc);
}

function interpolatePositions(alpha) {
    const smoothAlpha = easeInOutQuad(alpha);
    
    for (let i = 0; i < Math.min(snake.length, snakePositions.length); i++) {
        const target = { x: snake[i].x * TILE_SIZE, y: snake[i].y * TILE_SIZE };
        if (snakePositions[i]) {
            snakePositions[i] = {
                x: snakePositions[i].x + (target.x - snakePositions[i].x) * smoothAlpha,
                y: snakePositions[i].y + (target.y - snakePositions[i].y) * smoothAlpha
            };
        }
    }
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function update() {
    direction = nextDirection;
    
    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
    // Dash effect
    if (abilities.dash.active) {
        head.x += direction.x;
        head.y += direction.y;
        abilities.dash.active = false;
    }
    
    // Wrap around
    if (head.x < 0) head.x = GRID_SIZE - 1;
    if (head.x >= GRID_SIZE) head.x = 0;
    if (head.y < 0) head.y = GRID_SIZE - 1;
    if (head.y >= GRID_SIZE) head.y = 0;
    
    // Check collision with self
    if (!abilities.shield.active && snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Check collision with obstacles
    if (!abilities.shield.active && obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    snakePositions.unshift({ x: head.x * TILE_SIZE, y: head.y * TILE_SIZE });
    
    // Check food collision
    let ate = false;
    food = food.filter(f => {
        if (f.x === head.x && f.y === head.y) {
            ate = true;
            score += f.points;
            xp += f.xp;
            
            if (f.type === 'super') {
                for (let i = 0; i < 2; i++) {
                    snake.push({ ...snake[snake.length - 1] });
                    snakePositions.push({ ...snakePositions[snakePositions.length - 1] });
                }
            }
            if (f.type === 'ability') {
                const abilityKeys = Object.keys(abilities);
                const randomAbility = abilityKeys[Math.floor(Math.random() * abilityKeys.length)];
                abilities[randomAbility].cooldown = Math.max(0, abilities[randomAbility].cooldown - 2000);
            }
            
            checkLevelUp();
            return false;
        }
        return true;
    });
    
    if (!ate) {
        snake.pop();
        snakePositions.pop();
    } else {
        spawnFood();
    }
    
    // Magnet effect
    if (abilities.magnet.active) {
        food.forEach(f => {
            const dx = head.x - f.x;
            const dy = head.y - f.y;
            if (Math.abs(dx) <= 3 && Math.abs(dy) <= 3) {
                if (dx !== 0) f.x += Math.sign(dx);
                if (dy !== 0) f.y += Math.sign(dy);
            }
        });
    }
    
    updateAbilities();
    updateUI();
}

function spawnFood() {
    while (food.length < 3) {
        const type = Math.random() < 0.7 ? 'normal' : 
                     Math.random() < 0.5 ? 'super' : 
                     Math.random() < 0.5 ? 'speed' : 'ability';
        
        const foodData = FOOD_TYPES[type];
        const newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
            type: type,
            ...foodData
        };
        
        const collision = snake.some(s => s.x === newFood.x && s.y === newFood.y) ||
                         obstacles.some(o => o.x === newFood.x && o.y === newFood.y) ||
                         food.some(f => f.x === newFood.x && f.y === newFood.y);
        
        if (!collision) {
            food.push(newFood);
        }
    }
}

function generateObstacles() {
    obstacles = [];
    const count = Math.min(level * 2, 15);
    
    for (let i = 0; i < count; i++) {
        const obs = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        const collision = snake.some(s => s.x === obs.x && s.y === obs.y) ||
                         food.some(f => f.x === obs.x && f.y === obs.y) ||
                         obstacles.some(o => o.x === obs.x && o.y === obs.y);
        
        if (!collision) {
            obstacles.push(obs);
        }
    }
}

function useDash() {
    if (abilities.dash.cooldown <= 0 && isGameRunning) {
        abilities.dash.active = true;
        abilities.dash.cooldown = abilities.dash.maxCooldown;
    }
}

function useShield() {
    if (abilities.shield.cooldown <= 0 && isGameRunning) {
        abilities.shield.active = true;
        abilities.shield.duration = 3000;
        abilities.shield.cooldown = abilities.shield.maxCooldown;
    }
}

function useMagnet() {
    if (abilities.magnet.cooldown <= 0 && isGameRunning) {
        abilities.magnet.active = true;
        abilities.magnet.duration = 5000;
        abilities.magnet.cooldown = abilities.magnet.maxCooldown;
    }
}

function updateAbilities() {
    const delta = speed;
    
    Object.keys(abilities).forEach(key => {
        if (abilities[key].cooldown > 0) {
            abilities[key].cooldown -= delta;
        }
        if (abilities[key].duration !== undefined && abilities[key].duration > 0) {
            abilities[key].duration -= delta;
            if (abilities[key].duration <= 0) {
                abilities[key].active = false;
            }
        }
    });
    
    // Update UI
    document.getElementById('dashBtn').disabled = abilities.dash.cooldown > 0;
    document.getElementById('shieldBtn').disabled = abilities.shield.cooldown > 0;
    document.getElementById('magnetBtn').disabled = abilities.magnet.cooldown > 0;
    
    document.getElementById('dashCooldown').textContent = abilities.dash.cooldown > 0 ? Math.ceil(abilities.dash.cooldown / 1000) + 's' : '';
    document.getElementById('shieldCooldown').textContent = abilities.shield.cooldown > 0 ? Math.ceil(abilities.shield.cooldown / 1000) + 's' : '';
    document.getElementById('magnetCooldown').textContent = abilities.magnet.cooldown > 0 ? Math.ceil(abilities.magnet.cooldown / 1000) + 's' : '';
}

function checkLevelUp() {
    const xpNeeded = level * 100;
    if (xp >= xpNeeded) {
        level++;
        xp = 0;
        speed = Math.max(50, speed - 10);
        generateObstacles();
        showNotification(`🎉 Nível ${level}!`);
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('length').textContent = snake.length;
    document.getElementById('level').textContent = level;
    document.getElementById('xp').textContent = xp + '/' + (level * 100);
}

function render() {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = 'rgba(0,255,136,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
    }
    
    // Obstacles
    ctx.fillStyle = '#ff6b6b';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x * TILE_SIZE + 2, obs.y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    });
    
    // Food
    food.forEach(f => {
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(
            f.x * TILE_SIZE + TILE_SIZE / 2,
            f.y * TILE_SIZE + TILE_SIZE / 2,
            (TILE_SIZE / 2) - 4,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        if (f.type === 'super') {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
    
    // Snake with smooth rendering
    ctx.save();
    
    // Draw body segments
    for (let i = snakePositions.length - 1; i >= 0; i--) {
        const pos = snakePositions[i];
        const alpha = 1 - (i / snakePositions.length) * 0.5;
        
        if (i === 0) {
            // Head
            ctx.fillStyle = abilities.shield.active ? '#00d4ff' : '#00ff88';
            ctx.shadowBlur = 10;
            ctx.shadowColor = abilities.shield.active ? '#00d4ff' : '#00ff88';
            
            ctx.beginPath();
            ctx.roundRect(pos.x + 2, pos.y + 2, TILE_SIZE - 4, TILE_SIZE - 4, 4);
            ctx.fill();
            
            if (abilities.shield.active) {
                ctx.strokeStyle = '#00d4ff';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        } else {
            // Body
            ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = `rgba(0, 255, 136, ${alpha * 0.5})`;
            
            ctx.beginPath();
            ctx.roundRect(pos.x + 3, pos.y + 3, TILE_SIZE - 6, TILE_SIZE - 6, 3);
            ctx.fill();
        }
    }
    
    ctx.restore();
}

function gameOver() {
    isGameRunning = false;
    if (gameLoop) cancelAnimationFrame(gameLoop);
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLength').textContent = snake.length;
    document.getElementById('finalXP').textContent = xp;
    
    document.getElementById('overlay').classList.add('show');
    document.getElementById('gameOverModal').classList.add('show');
}

function restartGame() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('gameOverModal').classList.remove('show');
    
    initGame();
    isGameRunning = true;
    accumulator = 0;
    lastUpdateTime = performance.now();
    gameLoop = requestAnimationFrame(gameLoopFunc);
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:20px;right:20px;background:rgba(0,0,0,0.9);color:#00ff88;padding:20px;border-radius:10px;font-size:1.2rem;z-index:3000;border:2px solid #00ff88;`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (isGameRunning) {
            const oldGridSize = GRID_SIZE;
            resizeCanvas();
            if (oldGridSize !== GRID_SIZE) {
                showNotification('⚠️ Tamanho do mapa ajustado!');
            }
        }
    }, 250);
}

function handleTouch(dir) {
    if (!isGameRunning) return;
    
    if (dir === 'up' && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
    } else if (dir === 'down' && direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
    } else if (dir === 'left' && direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
    } else if (dir === 'right' && direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
    }
}

let touchStartX = 0;
let touchStartY = 0;

function setupTouchControls() {
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
}

function removeTouchControls() {
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
}

function handleTouchStart(e) {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isGameRunning) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
        if (dx > 0 && direction.x === 0) {
            nextDirection = { x: 1, y: 0 };
        } else if (dx < 0 && direction.x === 0) {
            nextDirection = { x: -1, y: 0 };
        }
        touchStartX = touchEndX;
        touchStartY = touchEndY;
    } else if (Math.abs(dy) > 30) {
        if (dy > 0 && direction.y === 0) {
            nextDirection = { x: 0, y: 1 };
        } else if (dy < 0 && direction.y === 0) {
            nextDirection = { x: 0, y: -1 };
        }
        touchStartX = touchEndX;
        touchStartY = touchEndY;
    }
}
