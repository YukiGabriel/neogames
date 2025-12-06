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
let speed = 120;
let isGameRunning = false;
let lastUpdateTime = 0;
let accumulator = 0;
let snakePositions = [];
let particles = [];
let gridOffset = 0;

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
    const maxSize = Math.min(container.clientWidth - 40, container.clientHeight - 40, window.innerHeight - 200);
    
    if (maxSize < 400) {
        GRID_SIZE = 15;
        canvasSize = Math.floor(maxSize / 15) * 15;
    } else if (maxSize < 600) {
        GRID_SIZE = 20;
        canvasSize = Math.floor(maxSize / 20) * 20;
    } else {
        GRID_SIZE = 25;
        canvasSize = Math.floor(maxSize / 25) * 25;
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
    speed = 120;
    accumulator = 0;
    food = [];
    obstacles = [];
    particles = [];
    gridOffset = 0;
    
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
    updateParticles(deltaTime);
    gridOffset = (gridOffset + deltaTime * 0.01) % TILE_SIZE;
    render(alpha);
    
    gameLoop = requestAnimationFrame(gameLoopFunc);
}

function interpolatePositions(alpha) {
    const smoothAlpha = easeOutCubic(alpha);
    
    for (let i = 0; i < snake.length; i++) {
        const target = { x: snake[i].x * TILE_SIZE, y: snake[i].y * TILE_SIZE };
        if (!snakePositions[i]) {
            snakePositions[i] = { ...target };
        } else {
            snakePositions[i] = {
                x: snakePositions[i].x + (target.x - snakePositions[i].x) * smoothAlpha,
                y: snakePositions[i].y + (target.y - snakePositions[i].y) * smoothAlpha
            };
        }
    }
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function createParticle(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x * TILE_SIZE + TILE_SIZE / 2,
            y: y * TILE_SIZE + TILE_SIZE / 2,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 1,
            color: color
        });
    }
}

function updateParticles(delta) {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= delta * 0.001;
        return p.life > 0;
    });
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
        createParticle(head.x, head.y, food.find(f => f.x === head.x && f.y === head.y)?.color || '#00ff88');
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
        createParticle(snake[0].x, snake[0].y, '#00d4ff');
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
        speed = Math.max(60, speed - 8);
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

function render(alpha) {
    // Background gradient
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#050510');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animated grid
    ctx.save();
    ctx.strokeStyle = 'rgba(0,255,136,0.08)';
    ctx.lineWidth = 1;
    const offset = gridOffset;
    for (let i = 0; i <= GRID_SIZE; i++) {
        const opacity = 0.08 + Math.sin((i + offset) * 0.1) * 0.02;
        ctx.strokeStyle = `rgba(0,255,136,${opacity})`;
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
    }
    ctx.restore();
    
    // Obstacles with glow
    obstacles.forEach(obs => {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff6b6b';
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.roundRect(obs.x * TILE_SIZE + 3, obs.y * TILE_SIZE + 3, TILE_SIZE - 6, TILE_SIZE - 6, 4);
        ctx.fill();
        ctx.restore();
    });
    
    // Food with pulse animation
    const time = Date.now() * 0.003;
    food.forEach((f, idx) => {
        const pulse = 1 + Math.sin(time + idx) * 0.15;
        const radius = ((TILE_SIZE / 2) - 4) * pulse;
        
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = f.color;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(
            f.x * TILE_SIZE + TILE_SIZE / 2,
            f.y * TILE_SIZE + TILE_SIZE / 2,
            radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        if (f.type === 'super') {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.shadowBlur = 30;
            ctx.shadowColor = f.color;
            ctx.beginPath();
            ctx.arc(
                f.x * TILE_SIZE + TILE_SIZE / 2,
                f.y * TILE_SIZE + TILE_SIZE / 2,
                radius + 5,
                0,
                Math.PI * 2
            );
            ctx.strokeStyle = f.color;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        ctx.restore();
    });
    
    // Particles
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    
    // Snake with smooth rendering and trail
    ctx.save();
    
    // Draw trail
    if (snakePositions.length > 1) {
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = TILE_SIZE * 0.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff88';
        
        ctx.beginPath();
        ctx.moveTo(snakePositions[snakePositions.length - 1].x + TILE_SIZE/2, snakePositions[snakePositions.length - 1].y + TILE_SIZE/2);
        for (let i = snakePositions.length - 2; i >= 0; i--) {
            ctx.lineTo(snakePositions[i].x + TILE_SIZE/2, snakePositions[i].y + TILE_SIZE/2);
        }
        ctx.stroke();
    }
    ctx.restore();
    
    // Draw body segments
    for (let i = snakePositions.length - 1; i >= 0; i--) {
        const pos = snakePositions[i];
        const alpha = 0.6 + (1 - i / snakePositions.length) * 0.4;
        const size = TILE_SIZE * (0.7 + (1 - i / snakePositions.length) * 0.3);
        const offset = (TILE_SIZE - size) / 2;
        
        ctx.save();
        
        if (i === 0) {
            // Head with enhanced glow
            const headColor = abilities.shield.active ? '#00d4ff' : '#00ff88';
            ctx.fillStyle = headColor;
            ctx.shadowBlur = 25;
            ctx.shadowColor = headColor;
            
            ctx.beginPath();
            ctx.roundRect(pos.x + offset, pos.y + offset, size, size, 6);
            ctx.fill();
            
            if (abilities.shield.active) {
                ctx.strokeStyle = '#00d4ff';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 35;
                ctx.stroke();
                
                // Shield pulse
                const shieldPulse = 1 + Math.sin(time * 3) * 0.2;
                ctx.beginPath();
                ctx.arc(pos.x + TILE_SIZE/2, pos.y + TILE_SIZE/2, size/2 * shieldPulse + 5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(0,212,255,0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            // Eyes
            const eyeSize = TILE_SIZE * 0.15;
            const eyeOffsetX = TILE_SIZE * 0.25;
            const eyeOffsetY = TILE_SIZE * 0.3;
            ctx.fillStyle = '#0f0f23';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(pos.x + TILE_SIZE/2 - eyeOffsetX, pos.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.arc(pos.x + TILE_SIZE/2 + eyeOffsetX, pos.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Body with gradient
            ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = `rgba(0, 255, 136, ${alpha * 0.6})`;
            
            ctx.beginPath();
            ctx.roundRect(pos.x + offset, pos.y + offset, size, size, 5);
            ctx.fill();
            
            // Inner highlight
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.roundRect(pos.x + offset + 2, pos.y + offset + 2, size * 0.4, size * 0.4, 3);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // Magnet effect visualization
    if (abilities.magnet.active) {
        ctx.save();
        const head = snakePositions[0];
        ctx.strokeStyle = 'rgba(0,212,255,0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(head.x + TILE_SIZE/2, head.y + TILE_SIZE/2, TILE_SIZE * 3.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
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
