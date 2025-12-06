const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 800;

let gameRunning = false;
let score = 0;
let crystals = 0;
let health = 3;
let wave = 1;

const tower = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 40,
    height: 50,
    speed: 8,
    fireRate: 300,
    lastShot: 0,
    damage: 1,
    element: 'normal',
    elementTime: 0
};

let shieldActive = false;
let shieldCooldown = 0;
let shieldTimer = 0;
let shieldRadius = 0;
const shieldMaxRadius = 100;
const shieldDuration = 1500;
const shieldCooldownTime = 5000;

let waveModifier = null;
let modifierTime = 0;
const modifiers = [
    { name: 'Campo Reverso', duration: 10000, effect: 'reverse' },
    { name: 'Chuva de Asteroides', duration: 8000, effect: 'asteroids' },
    { name: 'Inimigos Fantasma', duration: 12000, effect: 'ghost' }
];
const asteroids = [];

const bullets = [];
const enemies = [];
const drops = [];
const particles = [];
let gridOffset = 0;
let lastSpawnTime = 0;
let spawnInterval = 1500;
let upgradesPending = false;
let upgradeOptions = [];

let keys = {};
let touchLeft = false;
let touchRight = false;

document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === ' ' && gameRunning) {
        e.preventDefault();
        activateShield();
    }
});
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

document.getElementById('btnLeft').addEventListener('touchstart', e => { e.preventDefault(); touchLeft = true; });
document.getElementById('btnLeft').addEventListener('touchend', e => { e.preventDefault(); touchLeft = false; });
document.getElementById('btnRight').addEventListener('touchstart', e => { e.preventDefault(); touchRight = true; });
document.getElementById('btnRight').addEventListener('touchend', e => { e.preventDefault(); touchRight = false; });
document.getElementById('btnShield').addEventListener('touchstart', e => { e.preventDefault(); activateShield(); });

canvas.addEventListener('click', () => {
    if (!gameRunning) startGame();
});

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('menuBtn').style.display = 'block';
    gameRunning = true;
    lastSpawnTime = Date.now();
    document.getElementById('instructions').style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function showMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('menuBtn').style.display = 'none';
    gameRunning = false;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('upgradeMenu').style.display = 'none';
    score = 0;
    crystals = 0;
    health = 3;
    wave = 1;
    bullets.length = 0;
    enemies.length = 0;
    drops.length = 0;
    particles.length = 0;
    asteroids.length = 0;
    shieldActive = false;
    shieldCooldown = 0;
    waveModifier = null;
    tower.element = 'normal';
    tower.elementTime = 0;
}

function showCredits() {
    alert('🛡️ NeoDefend\n\nDefesa vertical estratégica!\nDestrua inimigos e colete upgrades.\n\n© 2024 NeoGames');
}

function gameLoop() {
    if (!gameRunning) return;
    
    if (!upgradesPending) {
        update();
    }
    render();
    
    requestAnimationFrame(gameLoop);
}

function activateShield() {
    if (!shieldActive && shieldCooldown <= 0 && health > 0 && gameRunning) {
        shieldActive = true;
        shieldTimer = shieldDuration;
        shieldRadius = 0;
    }
}

function update() {
    const moveDir = (waveModifier?.effect === 'reverse') ? -1 : 1;
    if (keys['arrowleft'] || keys['a'] || touchLeft) tower.x -= tower.speed * moveDir;
    if (keys['arrowright'] || keys['d'] || touchRight) tower.x += tower.speed * moveDir;
    
    tower.x = Math.max(tower.width / 2, Math.min(canvas.width - tower.width / 2, tower.x));
    
    if (shieldCooldown > 0) {
        shieldCooldown -= 16;
        if (shieldCooldown < 0) shieldCooldown = 0;
    }
    
    if (shieldActive) {
        shieldTimer -= 16;
        shieldRadius = Math.min(shieldRadius + 10, shieldMaxRadius);
        
        if (shieldTimer <= 0) {
            shieldActive = false;
            shieldRadius = 0;
            shieldCooldown = shieldCooldownTime;
        }
    }
    
    if (tower.elementTime > 0) {
        tower.elementTime -= 16;
        if (tower.elementTime <= 0) tower.element = 'normal';
    }
    if (modifierTime > 0) {
        modifierTime -= 16;
        if (modifierTime <= 0) waveModifier = null;
    }
    
    if (Date.now() - tower.lastShot > tower.fireRate) {
        bullets.push({
            x: tower.x,
            y: tower.y - 20,
            width: 6,
            height: 15,
            speed: 10,
            damage: tower.damage,
            element: tower.element
        });
        tower.lastShot = Date.now();
    }
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < -20) bullets.splice(i, 1);
    }
    
    if (Date.now() - lastSpawnTime > spawnInterval) {
        spawnEnemy();
        lastSpawnTime = Date.now();
    }
    
    if (waveModifier?.effect === 'asteroids') {
        if (Math.random() < 0.02) {
            asteroids.push({
                x: Math.random() * canvas.width,
                y: -20,
                size: 15 + Math.random() * 10,
                speed: 5 + Math.random() * 3
            });
        }
    }
    
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        a.y += a.speed;
        
        if (a.y > canvas.height) {
            asteroids.splice(i, 1);
            continue;
        }
        
        if (a.y + a.size > tower.y && a.y < tower.y + tower.height &&
            a.x + a.size > tower.x - tower.width / 2 && a.x < tower.x + tower.width / 2) {
            if (!shieldActive) health--;
            asteroids.splice(i, 1);
            createParticles(a.x, a.y, '#888888', 15);
            if (health <= 0) gameOver();
        }
    }
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const speedMod = e.slowed ? 0.3 : 1;
        e.y += e.speed * speedMod;
        e.x += Math.sin(e.y / 50 + e.offset) * e.wobble;
        
        if (e.burning && e.hp > 0) {
            e.burnTick = (e.burnTick || 0) + 16;
            if (e.burnTick >= 500) {
                e.hp -= 0.5;
                e.burnTick = 0;
                createParticles(e.x + e.width / 2, e.y + e.height / 2, '#ff6600', 3);
                
                if (e.hp <= 0) {
                    score += e.points;
                    enemies.splice(i, 1);
                    createParticles(e.x + e.width / 2, e.y + e.height / 2, e.color, 15);
                    
                    const dropType = Math.random();
                    drops.push({
                        x: e.x + e.width / 2,
                        y: e.y + e.height / 2,
                        speed: 2,
                        rotation: 0,
                        type: dropType < 0.1 ? 'element' : 'normal'
                    });
                    continue;
                }
            }
        }
        
        if (e.y > canvas.height) {
            enemies.splice(i, 1);
            continue;
        }
        
        if (shieldActive) {
            const dist = Math.hypot(e.x + e.width / 2 - tower.x, e.y + e.height / 2 - tower.y);
            if (dist < shieldRadius + e.width / 2) {
                const angle = Math.atan2(e.y - tower.y, e.x - tower.x);
                e.x += Math.cos(angle) * 5;
                e.y -= 3;
                createParticles(e.x + e.width / 2, e.y + e.height / 2, '#ff00ff', 5);
            }
        }
        
        if (e.y + e.height > tower.y && e.y < tower.y + tower.height &&
            e.x + e.width > tower.x - tower.width / 2 && e.x < tower.x + tower.width / 2) {
            if (!shieldActive) health--;
            enemies.splice(i, 1);
            createParticles(e.x, e.y, shieldActive ? '#ff00ff' : '#ff0000', 20);
            
            if (health <= 0) gameOver();
            continue;
        }
        
        for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
                if (e.ghost && b.element === 'normal') {
                    bullets.splice(j, 1);
                    continue;
                }
                
                e.hp -= b.damage;
                bullets.splice(j, 1);
                
                if (b.element === 'ice' && !e.slowed) {
                    e.slowed = true;
                    setTimeout(() => { if (e) e.slowed = false; }, 2000);
                    createParticles(e.x + e.width / 2, e.y + e.height / 2, '#00ffff', 5);
                } else if (b.element === 'electric') {
                    for (let k = enemies.length - 1; k >= 0; k--) {
                        const other = enemies[k];
                        if (other !== e && Math.hypot(other.x + other.width / 2 - (e.x + e.width / 2), other.y + other.height / 2 - (e.y + e.height / 2)) < 60) {
                            other.hp -= b.damage * 0.5;
                            createParticles(other.x + other.width / 2, other.y + other.height / 2, '#ffff00', 5);
                            if (other.hp <= 0) {
                                score += other.points;
                                enemies.splice(k, 1);
                                if (k < i) i--;
                                createParticles(other.x + other.width / 2, other.y + other.height / 2, other.color, 15);
                                drops.push({
                                    x: other.x + other.width / 2,
                                    y: other.y + other.height / 2,
                                    speed: 2,
                                    rotation: 0,
                                    type: Math.random() < 0.1 ? 'element' : 'normal'
                                });
                            }
                        }
                    }
                    createParticles(e.x + e.width / 2, e.y + e.height / 2, '#ffff00', 8);
                } else if (b.element === 'fire' && !e.burning) {
                    e.burning = true;
                    e.burnTick = 0;
                    createParticles(e.x + e.width / 2, e.y + e.height / 2, '#ff6600', 5);
                } else {
                    createParticles(e.x + e.width / 2, e.y + e.height / 2, e.color, 5);
                }
                
                if (e.hp <= 0) {
                    score += e.points;
                    enemies.splice(i, 1);
                    createParticles(e.x + e.width / 2, e.y + e.height / 2, e.color, 15);
                    
                    const dropType = Math.random();
                    drops.push({
                        x: e.x + e.width / 2,
                        y: e.y + e.height / 2,
                        speed: 2,
                        rotation: 0,
                        type: dropType < 0.1 ? 'element' : 'normal'
                    });
                }
                break;
            }
        }
    }
    
    for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.speed;
        d.rotation += 0.1;
        
        if (d.y > canvas.height) {
            drops.splice(i, 1);
            continue;
        }
        
        if (d.y + 15 > tower.y && d.y < tower.y + tower.height &&
            d.x + 15 > tower.x - tower.width / 2 && d.x < tower.x + tower.width / 2) {
            if (d.type === 'element') {
                const elements = ['ice', 'electric', 'fire'];
                tower.element = elements[Math.floor(Math.random() * elements.length)];
                tower.elementTime = 10000;
                createParticles(d.x, d.y, '#00ffff', 15);
            } else {
                crystals++;
                createParticles(d.x, d.y, '#ffd700', 10);
            }
            drops.splice(i, 1);
            
            if (crystals >= 100) {
                crystals -= 100;
                showUpgradeMenu();
            }
        }
    }
    
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) particles.splice(i, 1);
    }
    
    if (enemies.length === 0 && score >= wave * 100) {
        wave++;
        spawnInterval = Math.max(500, 1500 - wave * 100);
        
        if (wave % 3 === 0 && Math.random() < 0.5) {
            waveModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
            modifierTime = waveModifier.duration;
        }
    }
    
    gridOffset += 1;
    if (gridOffset >= 50) gridOffset = 0;
    
    document.getElementById('score').textContent = score;
    document.getElementById('crystals').textContent = crystals;
    document.getElementById('health').textContent = health;
    document.getElementById('wave').textContent = wave;
    
    const shieldPercent = Math.max(0, (1 - shieldCooldown / shieldCooldownTime) * 100);
    document.getElementById('shieldBar').style.width = shieldPercent + '%';
    document.getElementById('shieldText').textContent = shieldCooldown > 0 ? 
        `${Math.ceil(shieldCooldown / 1000)}s` : 'PRONTO';
    
    if (waveModifier) {
        document.getElementById('modifierText').textContent = waveModifier.name;
        document.getElementById('modifierText').style.display = 'block';
    } else {
        document.getElementById('modifierText').style.display = 'none';
    }
    
    if (tower.element !== 'normal') {
        const elementNames = { ice: 'GELO', electric: 'ELÉTRICO', fire: 'FOGO' };
        document.getElementById('elementText').textContent = elementNames[tower.element];
        document.getElementById('elementText').style.display = 'block';
    } else {
        document.getElementById('elementText').style.display = 'none';
    }
}

function spawnEnemy() {
    const types = ['normal', 'fast', 'tank'];
    const weights = [0.6, 0.3, 0.1];
    const rand = Math.random();
    let type = 'normal';
    let cumulative = 0;
    
    for (let i = 0; i < types.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
            type = types[i];
            break;
        }
    }
    
    const enemy = {
        x: Math.random() * (canvas.width - 40),
        y: -40,
        offset: Math.random() * 100,
        wobble: 0
    };
    
    if (type === 'normal') {
        enemy.width = 30;
        enemy.height = 30;
        enemy.speed = 1.5 + wave * 0.1;
        enemy.hp = 1;
        enemy.color = '#ff0066';
        enemy.points = 10;
        enemy.wobble = 1;
    } else if (type === 'fast') {
        enemy.width = 25;
        enemy.height = 25;
        enemy.speed = 3 + wave * 0.15;
        enemy.hp = 1;
        enemy.color = '#ffaa00';
        enemy.points = 15;
        enemy.wobble = 2;
    } else {
        enemy.width = 40;
        enemy.height = 40;
        enemy.speed = 1 + wave * 0.05;
        enemy.hp = 3;
        enemy.color = '#9900ff';
        enemy.points = 30;
        enemy.wobble = 0.5;
    }
    
    if (waveModifier?.effect === 'ghost') {
        enemy.ghost = true;
        enemy.color = '#00ffff';
    }
    
    enemies.push(enemy);
}

function showUpgradeMenu() {
    upgradesPending = true;
    
    const allUpgrades = [
        { name: 'Taxa de Tiro +20%', apply: () => tower.fireRate *= 0.8 },
        { name: 'Dano +1', apply: () => tower.damage++ },
        { name: 'Velocidade +30%', apply: () => tower.speed += 2 },
        { name: 'Vida +1', apply: () => health++ },
        { name: 'Tiro Duplo', apply: () => tower.fireRate *= 0.9 }
    ];
    
    upgradeOptions = [];
    const used = new Set();
    while (upgradeOptions.length < 3 && upgradeOptions.length < allUpgrades.length) {
        const idx = Math.floor(Math.random() * allUpgrades.length);
        if (!used.has(idx)) {
            upgradeOptions.push(allUpgrades[idx]);
            used.add(idx);
        }
    }
    
    document.getElementById('upgradeMenu').style.display = 'flex';
    document.getElementById('upgrade1').textContent = upgradeOptions[0].name;
    document.getElementById('upgrade2').textContent = upgradeOptions[1].name;
    document.getElementById('upgrade3').textContent = upgradeOptions[2].name;
}

function selectUpgrade(index) {
    upgradeOptions[index].apply();
    document.getElementById('upgradeMenu').style.display = 'none';
    upgradesPending = false;
}

window.selectUpgrade = selectUpgrade;

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            alpha: 1,
            color
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
    
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = (Math.random() * canvas.height + gridOffset * 2) % canvas.height;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
        ctx.fillRect(x, y, 1, 1);
    }
    
    ctx.strokeStyle = 'rgba(0,212,255,0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
        for (let y = -gridOffset; y < canvas.height; y += 50) {
            ctx.strokeRect(x, y, 50, 50);
        }
    }
    
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#00d4ff';
    
    const bodyGrad = ctx.createLinearGradient(tower.x, tower.y, tower.x, tower.y + tower.height);
    bodyGrad.addColorStop(0, '#00ffff');
    bodyGrad.addColorStop(0.5, '#00d4ff');
    bodyGrad.addColorStop(1, '#0066ff');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(tower.x, tower.y);
    ctx.lineTo(tower.x - 15, tower.y + 35);
    ctx.lineTo(tower.x - 8, tower.y + 35);
    ctx.lineTo(tower.x - 8, tower.y + 50);
    ctx.lineTo(tower.x + 8, tower.y + 50);
    ctx.lineTo(tower.x + 8, tower.y + 35);
    ctx.lineTo(tower.x + 15, tower.y + 35);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(tower.x - 5, tower.y + 10, 10, 25);
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(tower.x, tower.y + 15, 3, 0, Math.PI * 2);
    ctx.fill();
    
    const wingGrad = ctx.createLinearGradient(tower.x - 20, tower.y + 30, tower.x - 15, tower.y + 40);
    wingGrad.addColorStop(0, '#0099ff');
    wingGrad.addColorStop(1, '#003366');
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.moveTo(tower.x - 15, tower.y + 30);
    ctx.lineTo(tower.x - 25, tower.y + 35);
    ctx.lineTo(tower.x - 15, tower.y + 40);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(tower.x + 15, tower.y + 30);
    ctx.lineTo(tower.x + 25, tower.y + 35);
    ctx.lineTo(tower.x + 15, tower.y + 40);
    ctx.closePath();
    ctx.fill();
    
    const engineGrad = ctx.createRadialGradient(tower.x - 8, tower.y + 50, 0, tower.x - 8, tower.y + 50, 8);
    engineGrad.addColorStop(0, '#ffffff');
    engineGrad.addColorStop(0.5, '#00ffff');
    engineGrad.addColorStop(1, 'rgba(0,255,255,0)');
    ctx.fillStyle = engineGrad;
    ctx.fillRect(tower.x - 10, tower.y + 50, 4, 8);
    ctx.fillRect(tower.x + 6, tower.y + 50, 4, 8);
    
    if (shieldActive) {
        ctx.strokeStyle = `rgba(255,0,255,${0.6 + Math.sin(Date.now() / 100) * 0.4})`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#ff00ff';
        ctx.beginPath();
        ctx.arc(tower.x, tower.y + 25, shieldRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = `rgba(255,0,255,${0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tower.x, tower.y + 25, shieldRadius - 10, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    
    bullets.forEach(b => {
        let color1 = '#ffffff', color2 = '#00ffff', color3 = '#0066ff';
        if (b.element === 'ice') {
            color2 = '#00ffff'; color3 = '#0099ff';
        } else if (b.element === 'electric') {
            color2 = '#ffff00'; color3 = '#ffaa00';
        } else if (b.element === 'fire') {
            color2 = '#ff6600'; color3 = '#ff0000';
        }
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = color2;
        const bGrad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.height);
        bGrad.addColorStop(0, color1);
        bGrad.addColorStop(0.5, color2);
        bGrad.addColorStop(1, color3);
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y + b.height / 2, b.width / 2, b.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.ellipse(b.x, b.y + b.height / 3, b.width / 4, b.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    asteroids.forEach(a => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#888888';
        const aGrad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.size);
        aGrad.addColorStop(0, '#aaaaaa');
        aGrad.addColorStop(0.5, '#666666');
        aGrad.addColorStop(1, '#333333');
        ctx.fillStyle = aGrad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    enemies.forEach(e => {
        ctx.shadowBlur = 25;
        ctx.shadowColor = e.color;
        
        if (e.ghost) {
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 200) * 0.3;
        }
        
        const eGrad = ctx.createRadialGradient(e.x + e.width / 2, e.y + e.height / 2, 0, e.x + e.width / 2, e.y + e.height / 2, e.width / 2);
        eGrad.addColorStop(0, '#ffffff');
        eGrad.addColorStop(0.3, e.color);
        eGrad.addColorStop(1, '#000000');
        ctx.fillStyle = eGrad;
        
        ctx.beginPath();
        ctx.moveTo(e.x + e.width / 2, e.y + e.height);
        ctx.lineTo(e.x, e.y + e.height / 3);
        ctx.lineTo(e.x + e.width / 2, e.y);
        ctx.lineTo(e.x + e.width, e.y + e.height / 3);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.arc(e.x + e.width / 2, e.y + e.height / 2, e.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        if (e.hp > 1) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(e.x + e.width / 2, e.y + e.height);
            ctx.lineTo(e.x, e.y + e.height / 3);
            ctx.lineTo(e.x + e.width / 2, e.y);
            ctx.lineTo(e.x + e.width, e.y + e.height / 3);
            ctx.closePath();
            ctx.stroke();
        }
        
        const glowGrad = ctx.createRadialGradient(e.x + e.width / 2, e.y + e.height / 2, 0, e.x + e.width / 2, e.y + e.height / 2, e.width / 3);
        glowGrad.addColorStop(0, `${e.color}80`);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(e.x + e.width / 2, e.y + e.height / 2, e.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        if (e.slowed) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(e.x + e.width / 2, e.y + e.height / 2, e.width / 2 + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        if (e.burning) {
            for (let i = 0; i < 3; i++) {
                const flameGrad = ctx.createRadialGradient(
                    e.x + e.width / 2 + (Math.random() - 0.5) * 10,
                    e.y + e.height / 2 + (Math.random() - 0.5) * 10,
                    0,
                    e.x + e.width / 2,
                    e.y + e.height / 2,
                    10
                );
                flameGrad.addColorStop(0, '#ffff00');
                flameGrad.addColorStop(0.5, '#ff6600');
                flameGrad.addColorStop(1, 'rgba(255,0,0,0)');
                ctx.fillStyle = flameGrad;
                ctx.beginPath();
                ctx.arc(e.x + e.width / 2, e.y + e.height / 2, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    });
    
    drops.forEach(d => {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rotation);
        const dropColor = d.type === 'element' ? '#00ffff' : '#ffd700';
        ctx.shadowBlur = 25;
        ctx.shadowColor = dropColor;
        
        const dGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
        if (d.type === 'element') {
            dGrad.addColorStop(0, '#ffffff');
            dGrad.addColorStop(0.4, '#00ffff');
            dGrad.addColorStop(1, '#0066ff');
        } else {
            dGrad.addColorStop(0, '#ffffff');
            dGrad.addColorStop(0.4, '#ffd700');
            dGrad.addColorStop(1, '#ff6600');
        }
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(-3, -3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.restore();
    });
    
    particles.forEach(p => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4);
        pGrad.addColorStop(0, `rgba(255,255,255,${p.alpha})`);
        pGrad.addColorStop(0.5, `${p.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`);
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
}

function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalWave').textContent = wave;
    document.getElementById('gameOver').style.display = 'block';
}

for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `position:absolute;width:4px;height:4px;background:white;border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:particleFloat ${2+Math.random()*2}s ease-in-out infinite;animation-delay:${Math.random()*2}s;`;
    document.querySelector('.particles').appendChild(particle);
}
