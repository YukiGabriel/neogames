const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 600;

let gameRunning = false;
let gameSpeed = 6;
let distance = 0;
let score = 0;
let bits = 0;
let perfectDodges = 0;

const player = {
    x: 150,
    y: 350,
    width: 40,
    height: 50,
    lane: 1,
    targetLane: 1,
    jumping: false,
    ducking: false,
    jumpVelocity: 0,
    gravity: 1.2,
    jumpPower: -18,
    color: '#00d4ff',
    trail: []
};

const lanes = [200, 350, 500];
const obstacles = [];
const collectibles = [];
const particles = [];

let keys = {};
let lastObstacleTime = 0;
let lastCollectibleTime = 0;
let gridOffset = 0;

document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (!gameRunning && e.key === ' ') {
        e.preventDefault();
        startGame();
    }
});
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

document.getElementById('btnUp').addEventListener('touchstart', e => { e.preventDefault(); if (player.lane > 0) player.targetLane--; });
document.getElementById('btnDown').addEventListener('touchstart', e => { e.preventDefault(); if (player.lane < 2) player.targetLane++; });
document.getElementById('btnJump').addEventListener('touchstart', e => { e.preventDefault(); if (!player.jumping && !player.ducking) { player.jumping = true; player.jumpVelocity = player.jumpPower; } });
document.getElementById('btnDuck').addEventListener('touchstart', e => { e.preventDefault(); if (!player.jumping) player.ducking = true; });
document.getElementById('btnDuck').addEventListener('touchend', e => { e.preventDefault(); player.ducking = false; });

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('menuBtn').style.display = 'block';
    gameRunning = true;
    player.y = lanes[player.lane];
    lastObstacleTime = Date.now();
    lastCollectibleTime = Date.now();
    document.getElementById('instructions').style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function showMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('menuBtn').style.display = 'none';
    gameRunning = false;
    document.getElementById('gameOver').style.display = 'none';
    distance = 0;
    score = 0;
    bits = 0;
    perfectDodges = 0;
    gameSpeed = 6;
    obstacles.length = 0;
    collectibles.length = 0;
    particles.length = 0;
    player.lane = 1;
    player.targetLane = 1;
    player.y = lanes[1];
    player.jumping = false;
    player.ducking = false;
}

function showCredits() {
    alert('🦖 NeoRun\n\nCorrida infinita quântica!\nDesvie de obstáculos e colete bits.\n\n© 2024 NeoGames');
}

function gameLoop() {
    if (!gameRunning) return;
    
    update();
    render();
    
    requestAnimationFrame(gameLoop);
}

function update() {
    distance += gameSpeed / 10;
    score = Math.floor(distance * 10 + perfectDodges * 100 + bits * 50);
    gameSpeed += 0.001;
    
    if (keys['arrowup'] || keys['w']) {
        if (player.lane > 0) {
            player.targetLane = player.lane - 1;
            keys['arrowup'] = false;
            keys['w'] = false;
        }
    }
    if (keys['arrowdown'] || keys['s']) {
        if (player.lane < 2) {
            player.targetLane = player.lane + 1;
            keys['arrowdown'] = false;
            keys['s'] = false;
        }
    }
    if (keys[' '] && !player.jumping && !player.ducking && player.y === lanes[player.lane]) {
        player.jumping = true;
        player.jumpVelocity = player.jumpPower;
        keys[' '] = false;
    }
    if (keys['shift']) {
        player.ducking = true;
    } else {
        player.ducking = false;
    }
    
    if (player.lane !== player.targetLane && !player.jumping) {
        const targetY = lanes[player.targetLane];
        const diff = targetY - player.y;
        player.y += diff * 0.2;
        if (Math.abs(diff) < 2) {
            player.lane = player.targetLane;
            player.y = lanes[player.lane];
        }
    }
    
    if (player.jumping) {
        player.jumpVelocity += player.gravity;
        player.y += player.jumpVelocity;
        
        if (player.y >= lanes[player.lane]) {
            player.y = lanes[player.lane];
            player.jumping = false;
            player.jumpVelocity = 0;
        }
    } else if (player.lane === player.targetLane && player.y !== lanes[player.lane]) {
        player.y = lanes[player.lane];
    }
    
    player.trail.push({ x: player.x, y: player.y, alpha: 1 });
    if (player.trail.length > 10) player.trail.shift();
    player.trail.forEach(t => t.alpha -= 0.1);
    
    if (Date.now() - lastObstacleTime > 1500 - gameSpeed * 20) {
        spawnObstacle();
        lastObstacleTime = Date.now();
    }
    
    if (Date.now() - lastCollectibleTime > 2000) {
        spawnCollectible();
        lastCollectibleTime = Date.now();
    }
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;
        
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            if (obs.type !== 'fenda' || i === 0 || obstacles[i-1]?.type !== 'fenda') {
                perfectDodges++;
            }
        } else if (checkCollision(player, obs)) {
            gameOver();
        }
    }
    
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const col = collectibles[i];
        col.x -= gameSpeed;
        col.rotation += 0.1;
        
        if (col.x + col.size < 0) {
            collectibles.splice(i, 1);
        } else if (checkCollision(player, { x: col.x, y: col.y, width: col.size, height: col.size })) {
            bits++;
            collectibles.splice(i, 1);
            createParticles(20, col.y, '#00d4ff');
        }
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
    
    gridOffset -= gameSpeed;
    if (gridOffset <= -50) gridOffset = 0;
    
    document.getElementById('distance').textContent = Math.floor(distance) + 'm';
    document.getElementById('score').textContent = score;
    document.getElementById('bits').textContent = bits;
    document.getElementById('streakValue').textContent = perfectDodges;
}

function spawnObstacle() {
    const types = ['laser', 'drone', 'fenda'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    if (type === 'laser') {
        const laneIndex = Math.floor(Math.random() * 3);
        obstacles.push({
            x: canvas.width,
            y: lanes[laneIndex] - 10,
            width: 30,
            height: 60,
            type: 'laser',
            color: '#ff0066',
            lane: laneIndex
        });
    } else if (type === 'drone') {
        const laneIndex = Math.floor(Math.random() * 3);
        obstacles.push({
            x: canvas.width,
            y: lanes[laneIndex] - 60,
            width: 50,
            height: 40,
            type: 'drone',
            color: '#ff6600',
            offset: 0,
            lane: laneIndex
        });
    } else if (type === 'fenda') {
        const safeLane = Math.floor(Math.random() * 3);
        for (let i = 0; i < 3; i++) {
            if (i !== safeLane) {
                obstacles.push({
                    x: canvas.width,
                    y: lanes[i] - 40,
                    width: 80,
                    height: 120,
                    type: 'fenda',
                    color: '#9900ff',
                    lane: i
                });
            }
        }
    }
}

function spawnCollectible() {
    collectibles.push({
        x: canvas.width,
        y: lanes[Math.floor(Math.random() * 3)],
        size: 20,
        rotation: 0
    });
}

function checkCollision(a, b) {
    const margin = 8;
    const h = a.ducking ? a.height / 2 : a.height;
    const yOffset = a.ducking ? a.height / 2 : 0;
    const aLeft = a.x + margin;
    const aRight = a.x + a.width - margin;
    const aTop = a.y + yOffset + margin;
    const aBottom = a.y + yOffset + h - margin;
    const bLeft = b.x;
    const bRight = b.x + b.width;
    const bTop = b.y;
    const bBottom = b.y + b.height;
    return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

function createParticles(count, y, color) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: player.x + player.width / 2,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            alpha: 1,
            color: color
        });
    }
}

function render() {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#000510');
    bgGrad.addColorStop(0.5, '#001030');
    bgGrad.addColorStop(1, '#000520');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(0,212,255,0.15)';
    ctx.lineWidth = 1;
    for (let x = gridOffset; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
            ctx.strokeRect(x, y, 50, 50);
        }
    }
    
    for (let i = 0; i < 3; i++) {
        const y = 100 + i * 200;
        const grad = ctx.createLinearGradient(0, y, canvas.width, y);
        grad.addColorStop(0, 'rgba(0,212,255,0)');
        grad.addColorStop(0.5, 'rgba(0,212,255,0.1)');
        grad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, canvas.width, 100);
    }
    
    lanes.forEach((lane, i) => {
        const grad = ctx.createLinearGradient(0, lane, 0, lane + 50);
        grad.addColorStop(0, 'rgba(0,212,255,0.3)');
        grad.addColorStop(0.5, 'rgba(0,212,255,0.6)');
        grad.addColorStop(1, 'rgba(0,212,255,0.3)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 10]);
        ctx.lineDashOffset = -gridOffset * 2;
        ctx.beginPath();
        ctx.moveTo(0, lane + 25);
        ctx.lineTo(canvas.width, lane + 25);
        ctx.stroke();
        ctx.setLineDash([]);
    });
    
    player.trail.forEach((t, i) => {
        if (t.alpha > 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00d4ff';
            ctx.fillStyle = `rgba(0,212,255,${t.alpha * 0.4})`;
            const h = player.ducking ? player.height / 2 : player.height;
            ctx.fillRect(t.x, t.y + (player.ducking ? player.height / 2 : 0), player.width, h);
        }
    });
    ctx.shadowBlur = 0;
    
    const h = player.ducking ? player.height / 2 : player.height;
    const yOffset = player.ducking ? player.height / 2 : 0;
    
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00d4ff';
    const pGrad = ctx.createLinearGradient(player.x, player.y + yOffset, player.x + player.width, player.y + yOffset + h);
    pGrad.addColorStop(0, '#00d4ff');
    pGrad.addColorStop(0.5, '#0099ff');
    pGrad.addColorStop(1, '#0066ff');
    ctx.fillStyle = pGrad;
    ctx.fillRect(player.x, player.y + yOffset, player.width, h);
    
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(player.x + 5, player.y + yOffset + 5, 10, h - 10);
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff';
    if (!player.ducking) {
        ctx.beginPath();
        ctx.arc(player.x + 32, player.y + 15, 4, 0, Math.PI * 2);
        ctx.arc(player.x + 32, player.y + 28, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.fillStyle = '#00ffff';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(player.x - 5 - i * 3, player.y + yOffset + h / 2 - 2, 3, 4);
    }
    ctx.shadowBlur = 0;
    
    obstacles.forEach(obs => {
        if (obs.type === 'laser') {
            ctx.shadowBlur = 25;
            ctx.shadowColor = obs.color;
            const lGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y + obs.height);
            lGrad.addColorStop(0, obs.color);
            lGrad.addColorStop(0.5, '#ff3388');
            lGrad.addColorStop(1, obs.color);
            ctx.fillStyle = lGrad;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(obs.x + 5, obs.y + 10, 5, obs.height - 20);
            
            ctx.fillStyle = 'rgba(255,0,102,0.4)';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(obs.x - 30 - i * 15, obs.y + 20, 10, 20);
            }
        } else if (obs.type === 'drone') {
            obs.offset += 0.1;
            const dy = Math.sin(obs.offset) * 8;
            ctx.shadowBlur = 25;
            ctx.shadowColor = obs.color;
            const dGrad = ctx.createRadialGradient(obs.x + 25, obs.y + dy + 20, 5, obs.x + 25, obs.y + dy + 20, 30);
            dGrad.addColorStop(0, '#ffaa00');
            dGrad.addColorStop(0.5, obs.color);
            dGrad.addColorStop(1, '#cc3300');
            ctx.fillStyle = dGrad;
            ctx.fillRect(obs.x, obs.y + dy, obs.width, obs.height);
            
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(obs.x + 5, obs.y + dy + 5, 15, 8);
            ctx.fillRect(obs.x + 30, obs.y + dy + 5, 15, 8);
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff0000';
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(obs.x + 25, obs.y + dy + 20, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
            ctx.beginPath();
            ctx.arc(obs.x + 25, obs.y + dy + 20, 12, 0, Math.PI * 2);
            ctx.fill();
        } else if (obs.type === 'fenda') {
            ctx.shadowBlur = 30;
            ctx.shadowColor = obs.color;
            const fGrad = ctx.createRadialGradient(obs.x + obs.width / 2, obs.y + obs.height / 2, 10, obs.x + obs.width / 2, obs.y + obs.height / 2, 80);
            fGrad.addColorStop(0, '#cc00ff');
            fGrad.addColorStop(0.5, obs.color);
            fGrad.addColorStop(1, '#000');
            ctx.fillStyle = fGrad;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            for (let i = 0; i < 5; i++) {
                ctx.fillStyle = `rgba(153,0,255,${0.3 - i * 0.05})`;
                ctx.fillRect(obs.x - 10 - i * 8, obs.y + 20, 8, obs.height - 40);
            }
            
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(obs.x + 10 + i * 20, obs.y + 30, 3, obs.height - 60);
            }
        }
        ctx.shadowBlur = 0;
    });
    
    collectibles.forEach(col => {
        ctx.save();
        ctx.translate(col.x + col.size / 2, col.y + col.size / 2);
        ctx.rotate(col.rotation);
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00d4ff';
        const cGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, col.size);
        cGrad.addColorStop(0, '#ffffff');
        cGrad.addColorStop(0.4, '#00d4ff');
        cGrad.addColorStop(1, '#0066ff');
        ctx.fillStyle = cGrad;
        ctx.fillRect(-col.size / 2, -col.size / 2, col.size, col.size);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-col.size / 2, -col.size / 2, col.size, col.size);
        
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(-col.size / 4, -col.size / 4, col.size / 2, col.size / 2);
        ctx.shadowBlur = 0;
        ctx.restore();
    });
    
    particles.forEach(p => {
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = `rgba(${p.color === '#ffd700' ? '255,215,0' : '0,212,255'},${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
}

function gameOver() {
    gameRunning = false;
    document.getElementById('finalDistance').textContent = Math.floor(distance);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalBits').textContent = bits;
    document.getElementById('finalStreak').textContent = perfectDodges;
    document.getElementById('gameOver').style.display = 'block';
}

for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `position:absolute;width:4px;height:4px;background:white;border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:particleFloat ${2+Math.random()*2}s ease-in-out infinite;animation-delay:${Math.random()*2}s;`;
    document.querySelector('.particles').appendChild(particle);
}
