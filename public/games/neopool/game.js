const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

const TABLE = { x: 50, y: 50, w: 900, h: 500, friction: 0.985, cushionRestitution: 0.7 };
const BALL_RADIUS = 12;
const POCKET_RADIUS = 20;

const pockets = [
    { x: TABLE.x, y: TABLE.y },
    { x: TABLE.x + TABLE.w / 2, y: TABLE.y },
    { x: TABLE.x + TABLE.w, y: TABLE.y },
    { x: TABLE.x, y: TABLE.y + TABLE.h },
    { x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.h },
    { x: TABLE.x + TABLE.w, y: TABLE.y + TABLE.h }
];

let balls = [];
let cueBall = null;
let aiming = false;
let aimStart = { x: 0, y: 0 };
let currentMouse = { x: 0, y: 0 };
let power = 0;
let settingPower = false;
let powerSet = false;
let currentPlayer = 1;
let playerTypes = { 1: null, 2: null };
let spin = { x: 0, y: 0 };
let ballsMoving = false;
let gameMode = null;
let aiDifficulty = null;
let waitingForTurn = false;
let ballsPocketedThisTurn = [];
let extraTurn = false;

function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
}

function hideMenu() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';
}

document.getElementById('localBtn').addEventListener('click', () => {
    gameMode = 'local';
    hideMenu();
    initBalls();
    gameLoop();
});

document.getElementById('aiBtn').addEventListener('click', () => {
    document.getElementById('difficultySection').style.display = 'block';
});

document.querySelectorAll('.difficulty').forEach(btn => {
    btn.addEventListener('click', () => {
        gameMode = 'ai';
        aiDifficulty = btn.dataset.difficulty;
        hideMenu();
        initBalls();
        gameLoop();
    });
});

document.getElementById('creditsBtn').addEventListener('click', () => {
    document.getElementById('creditsModal').style.display = 'flex';
});

document.getElementById('closeCredits').addEventListener('click', () => {
    document.getElementById('creditsModal').style.display = 'none';
});

function initBalls() {
    const startX = TABLE.x + TABLE.w * 0.75;
    const startY = TABLE.y + TABLE.h / 2;
    const spacing = BALL_RADIUS * 2.1;

    cueBall = { x: TABLE.x + TABLE.w * 0.25, y: startY, vx: 0, vy: 0, color: '#ffffff', type: 'cue', pocketed: false };
    balls = [cueBall];

    const ballSetup = [
        { color: '#ffff00', type: 'solid', number: 1 },
        { color: '#0000ff', type: 'solid', number: 2 },
        { color: '#ff0000', type: 'solid', number: 3 },
        { color: '#800080', type: 'solid', number: 4 },
        { color: '#ff8800', type: 'solid', number: 5 },
        { color: '#00ff00', type: 'solid', number: 6 },
        { color: '#8b0000', type: 'solid', number: 7 },
        { color: '#000000', type: '8ball', number: 8 },
        { color: '#ffff00', type: 'striped', number: 9 },
        { color: '#0000ff', type: 'striped', number: 10 },
        { color: '#ff0000', type: 'striped', number: 11 },
        { color: '#800080', type: 'striped', number: 12 },
        { color: '#ff8800', type: 'striped', number: 13 },
        { color: '#00ff00', type: 'striped', number: 14 },
        { color: '#8b0000', type: 'striped', number: 15 }
    ];
    
    let idx = 0;
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
            if (idx >= 15) break;
            const x = startX + row * spacing * 0.866;
            const y = startY + (col - row / 2) * spacing;
            balls.push({ 
                x, y, vx: 0, vy: 0, 
                color: ballSetup[idx].color, 
                type: ballSetup[idx].type, 
                number: ballSetup[idx].number,
                pocketed: false 
            });
            idx++;
        }
    }
}

function drawTable() {
    ctx.fillStyle = '#0a3d2e';
    ctx.fillRect(TABLE.x, TABLE.y, TABLE.w, TABLE.h);
    
    ctx.strokeStyle = 'rgba(0,255,136,0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < TABLE.w; i += 20) {
        for (let j = 0; j < TABLE.h; j += 20) {
            ctx.strokeRect(TABLE.x + i, TABLE.y + j, 20, 20);
        }
    }
    
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff88';
    ctx.strokeRect(TABLE.x, TABLE.y, TABLE.w, TABLE.h);
    ctx.shadowBlur = 0;
    
    pockets.forEach(p => {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 3;
        ctx.stroke();
    });
}

function drawBalls() {
    balls.forEach(ball => {
        if (ball.pocketed) return;
        
        const gradient = ctx.createRadialGradient(ball.x - 5, ball.y - 5, 2, ball.x, ball.y, BALL_RADIUS);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, ball.color);
        gradient.addColorStop(1, ball.color === '#ffffff' ? '#cccccc' : '#000000');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        if (ball.type === 'striped') {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, BALL_RADIUS * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        if (ball.type === '8ball') {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, BALL_RADIUS * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('8', ball.x, ball.y);
        }
    });
}

function drawAim() {
    if ((!aiming && !settingPower) || ballsMoving || (gameMode === 'ai' && currentPlayer === 2)) return;
    
    if (settingPower) {
        document.getElementById('powerFill').style.height = (power * 100) + '%';
        return;
    }
    
    const dx = cueBall.x - currentMouse.x;
    const dy = cueBall.y - currentMouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 10) return;
    
    const dirX = dx / dist;
    const dirY = dy / dist;
    
    const collision = calculatePreciseCollision(cueBall, dirX, dirY);
    
    if (collision) {
        const { targetBall, impactPoint, targetDirection } = collision;
        
        ctx.strokeStyle = 'rgba(0,255,136,0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(cueBall.x, cueBall.y);
        ctx.lineTo(impactPoint.x, impactPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = 'rgba(0,255,136,0.5)';
        ctx.beginPath();
        ctx.arc(impactPoint.x, impactPoint.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255,255,0,0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(targetBall.x, targetBall.y);
        
        let predX = targetBall.x;
        let predY = targetBall.y;
        const predLength = 150;
        
        for (let i = 0; i < predLength; i++) {
            predX += targetDirection.x * 2;
            predY += targetDirection.y * 2;
            
            if (predX - BALL_RADIUS < TABLE.x || predX + BALL_RADIUS > TABLE.x + TABLE.w ||
                predY - BALL_RADIUS < TABLE.y || predY + BALL_RADIUS > TABLE.y + TABLE.h) {
                break;
            }
            
            let nearPocket = false;
            for (const pocket of pockets) {
                const distToPocket = Math.sqrt((predX - pocket.x) ** 2 + (predY - pocket.y) ** 2);
                if (distToPocket < POCKET_RADIUS * 1.5) {
                    nearPocket = true;
                    break;
                }
            }
            if (nearPocket) break;
        }
        
        ctx.lineTo(predX, predY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        const arrowX = targetBall.x + targetDirection.x * 25;
        const arrowY = targetBall.y + targetDirection.y * 25;
        
        ctx.fillStyle = 'rgba(255,255,0,0.8)';
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - targetDirection.x * 15 - targetDirection.y * 8, arrowY - targetDirection.y * 15 + targetDirection.x * 8);
        ctx.lineTo(arrowX - targetDirection.x * 15 + targetDirection.y * 8, arrowY - targetDirection.y * 15 - targetDirection.x * 8);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.strokeStyle = 'rgba(0,255,136,0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(cueBall.x, cueBall.y);
        ctx.lineTo(cueBall.x + dirX * 200, cueBall.y + dirY * 200);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    const arrowDist = Math.min(80, dist * 0.4);
    const arrowX = cueBall.x + dirX * arrowDist;
    const arrowY = cueBall.y + dirY * arrowDist;
    
    ctx.fillStyle = 'rgba(0,255,136,0.9)';
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX - dirX * 20 - dirY * 10, arrowY - dirY * 20 + dirX * 10);
    ctx.lineTo(arrowX - dirX * 20 + dirY * 10, arrowY - dirY * 20 - dirX * 10);
    ctx.closePath();
    ctx.fill();
    
    document.getElementById('powerFill').style.height = (power * 100) + '%';
}

function calculatePreciseCollision(cue, dirX, dirY) {
    let closestBall = null;
    let minDist = Infinity;
    let impactPoint = null;
    let targetDirection = null;
    
    balls.forEach(ball => {
        if (ball === cue || ball.pocketed) return;
        
        const toBallX = ball.x - cue.x;
        const toBallY = ball.y - cue.y;
        const projection = toBallX * dirX + toBallY * dirY;
        
        if (projection < 0) return;
        
        const closestX = cue.x + dirX * projection;
        const closestY = cue.y + dirY * projection;
        const perpDist = Math.sqrt((ball.x - closestX) ** 2 + (ball.y - closestY) ** 2);
        
        if (perpDist < BALL_RADIUS * 2 && projection < minDist) {
            minDist = projection;
            closestBall = ball;
            
            const distToBall = Math.sqrt(toBallX * toBallX + toBallY * toBallY);
            const impactDist = Math.sqrt(distToBall * distToBall - perpDist * perpDist) - 
                              Math.sqrt((BALL_RADIUS * 2) ** 2 - perpDist * perpDist);
            
            impactPoint = {
                x: cue.x + dirX * impactDist,
                y: cue.y + dirY * impactDist
            };
            
            const normalX = (ball.x - impactPoint.x) / BALL_RADIUS;
            const normalY = (ball.y - impactPoint.y) / BALL_RADIUS;
            const normalSpeed = dirX * normalX + dirY * normalY;
            
            targetDirection = { x: normalX * normalSpeed, y: normalY * normalSpeed };
            
            const targetSpeed = Math.sqrt(targetDirection.x ** 2 + targetDirection.y ** 2);
            if (targetSpeed > 0) {
                targetDirection.x /= targetSpeed;
                targetDirection.y /= targetSpeed;
            }
        }
    });
    
    return closestBall ? { targetBall: closestBall, impactPoint, targetDirection } : null;
}

function updatePhysics() {
    const wasBallsMoving = ballsMoving;
    ballsMoving = false;
    
    balls.forEach(ball => {
        if (ball.pocketed) return;
        
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed > 0.01) {
            const frictionForce = 0.015;
            ball.vx -= (ball.vx / speed) * frictionForce;
            ball.vy -= (ball.vy / speed) * frictionForce;
            ball.vx *= TABLE.friction;
            ball.vy *= TABLE.friction;
        } else {
            ball.vx = 0;
            ball.vy = 0;
        }
        
        if (Math.abs(ball.vx) < 0.02) ball.vx = 0;
        if (Math.abs(ball.vy) < 0.02) ball.vy = 0;
        
        if (ball.vx !== 0 || ball.vy !== 0) ballsMoving = true;
        
        if (ball.x - BALL_RADIUS < TABLE.x) {
            ball.x = TABLE.x + BALL_RADIUS;
            ball.vx = Math.abs(ball.vx) * TABLE.cushionRestitution;
        }
        if (ball.x + BALL_RADIUS > TABLE.x + TABLE.w) {
            ball.x = TABLE.x + TABLE.w - BALL_RADIUS;
            ball.vx = -Math.abs(ball.vx) * TABLE.cushionRestitution;
        }
        if (ball.y - BALL_RADIUS < TABLE.y) {
            ball.y = TABLE.y + BALL_RADIUS;
            ball.vy = Math.abs(ball.vy) * TABLE.cushionRestitution;
        }
        if (ball.y + BALL_RADIUS > TABLE.y + TABLE.h) {
            ball.y = TABLE.y + TABLE.h - BALL_RADIUS;
            ball.vy = -Math.abs(ball.vy) * TABLE.cushionRestitution;
        }
        
        pockets.forEach(p => {
            const dx = ball.x - p.x;
            const dy = ball.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < POCKET_RADIUS && !ball.pocketed) {
                ball.pocketed = true;
                if (ball.type === 'cue') {
                    setTimeout(() => {
                        ball.pocketed = false;
                        ball.x = TABLE.x + TABLE.w * 0.25;
                        ball.y = TABLE.y + TABLE.h / 2;
                        ball.vx = 0;
                        ball.vy = 0;
                    }, 500);
                } else {
                    ballsPocketedThisTurn.push(ball);
                    addPocketedBall(ball);
                    checkWin(ball);
                }
            }
        });
    });
    
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const b1 = balls[i];
            const b2 = balls[j];
            if (b1.pocketed || b2.pocketed) continue;
            
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < BALL_RADIUS * 2 && dist > 0) {
                const nx = dx / dist;
                const ny = dy / dist;
                const tx = -ny;
                const ty = nx;
                
                const v1n = b1.vx * nx + b1.vy * ny;
                const v1t = b1.vx * tx + b1.vy * ty;
                const v2n = b2.vx * nx + b2.vy * ny;
                const v2t = b2.vx * tx + b2.vy * ty;
                
                const restitution = 0.98;
                b1.vx = (v2n * nx + v1t * tx) * restitution;
                b1.vy = (v2n * ny + v1t * ty) * restitution;
                b2.vx = (v1n * nx + v2t * tx) * restitution;
                b2.vy = (v1n * ny + v2t * ty) * restitution;
                
                const overlap = (BALL_RADIUS * 2 - dist) / 2;
                b1.x -= overlap * nx;
                b1.y -= overlap * ny;
                b2.x += overlap * nx;
                b2.y += overlap * ny;
            }
        }
    }
    
    if (wasBallsMoving && !ballsMoving && waitingForTurn) {
        waitingForTurn = false;
        
        const validBallPocketed = ballsPocketedThisTurn.some(b => {
            if (!playerTypes[currentPlayer]) return b.type !== '8ball';
            return b.type === playerTypes[currentPlayer];
        });
        
        if (validBallPocketed && ballsPocketedThisTurn.length > 0) {
            extraTurn = true;
            document.getElementById('turnStatus').textContent = '🎯';
            document.getElementById('instructions').textContent = t('extraTurn') || 'Jogada Extra!';
        } else {
            extraTurn = false;
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            document.getElementById('player').textContent = currentPlayer;
            document.getElementById('turnStatus').textContent = '🎱';
            document.getElementById('instructions').textContent = t('instructions');
        }
        
        ballsPocketedThisTurn = [];
        
        if (gameMode === 'ai' && currentPlayer === 2) {
            setTimeout(() => aiTurn(), 1000);
        }
    }
}

function aiTurn() {
    if (ballsMoving) return;
    
    document.getElementById('instructions').textContent = t('aiTurn');
    
    setTimeout(() => {
        if (ballsMoving) return;
        
        const myType = playerTypes[2];
        let targets = balls.filter(b => !b.pocketed && b.type === myType);
        
        if (!myType || targets.length === 0) {
            targets = balls.filter(b => !b.pocketed && b.type !== 'cue' && b.type !== '8ball');
        }
        
        if (targets.length === 0) {
            currentPlayer = 1;
            document.getElementById('player').textContent = currentPlayer;
            document.getElementById('instructions').textContent = t('instructions');
            return;
        }
        
        let bestShot = null;
        let bestScore = -1;
        
        targets.forEach(target => {
            pockets.forEach(pocket => {
                const dx = pocket.x - target.x;
                const dy = pocket.y - target.y;
                const distToPocket = Math.sqrt(dx * dx + dy * dy);
                
                if (distToPocket < 50) return;
                
                const pocketAngle = Math.atan2(dy, dx);
                const impactX = target.x - Math.cos(pocketAngle) * BALL_RADIUS * 2;
                const impactY = target.y - Math.sin(pocketAngle) * BALL_RADIUS * 2;
                
                const toCueX = impactX - cueBall.x;
                const toCueY = impactY - cueBall.y;
                const distToCue = Math.sqrt(toCueX * toCueX + toCueY * toCueY);
                
                if (distToCue < 30) return;
                
                const shotAngle = Math.atan2(toCueY, toCueX);
                
                let blocked = false;
                for (const ball of balls) {
                    if (ball === cueBall || ball === target || ball.pocketed) continue;
                    const toBallX = ball.x - cueBall.x;
                    const toBallY = ball.y - cueBall.y;
                    const proj = toBallX * Math.cos(shotAngle) + toBallY * Math.sin(shotAngle);
                    if (proj > 0 && proj < distToCue) {
                        const perpX = cueBall.x + Math.cos(shotAngle) * proj;
                        const perpY = cueBall.y + Math.sin(shotAngle) * proj;
                        const perpDist = Math.sqrt((ball.x - perpX) ** 2 + (ball.y - perpY) ** 2);
                        if (perpDist < BALL_RADIUS * 3) {
                            blocked = true;
                            break;
                        }
                    }
                }
                
                if (blocked) return;
                
                const score = 1000 / distToPocket + 500 / distToCue;
                if (score > bestScore) {
                    bestScore = score;
                    bestShot = { angle: shotAngle, power: Math.min(0.7 + distToCue / 500, 1) };
                }
            });
        });
        
        if (!bestShot) {
            const target = targets[0];
            const angle = Math.atan2(target.y - cueBall.y, target.x - cueBall.x);
            bestShot = { angle, power: 0.6 };
        }
        
        let accuracy = aiDifficulty === 'easy' ? 0.2 : aiDifficulty === 'medium' ? 0.08 : 0.03;
        const finalAngle = bestShot.angle + (Math.random() - 0.5) * accuracy;
        
        cueBall.vx = Math.cos(finalAngle) * bestShot.power * 20;
        cueBall.vy = Math.sin(finalAngle) * bestShot.power * 20;
        ballsMoving = true;
        waitingForTurn = true;
    }, 1500);
}

function addPocketedBall(ball) {
    const container = ball.type === 'solid' ? document.getElementById('solidBalls') : document.getElementById('stripedBalls');
    const ballEl = document.createElement('div');
    ballEl.className = 'pocketedBall';
    ballEl.style.background = ball.color;
    if (ball.type === 'striped') ballEl.classList.add('striped');
    if (ball.type === '8ball') ballEl.classList.add('eight');
    container.appendChild(ballEl);
}

function checkWin(ball) {
    if (ball.type === '8ball') {
        const playerType = playerTypes[currentPlayer];
        const allPocketed = balls.filter(b => b.type === playerType && !b.pocketed).length === 0;
        
        if (allPocketed) {
            document.getElementById('winner').textContent = currentPlayer;
            document.getElementById('gameOver').style.display = 'block';
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            document.getElementById('player').textContent = currentPlayer;
        }
    } else if (ball.type !== 'cue') {
        if (!playerTypes[currentPlayer]) {
            playerTypes[currentPlayer] = ball.type;
            playerTypes[currentPlayer === 1 ? 2 : 1] = ball.type === 'solid' ? 'striped' : 'solid';
            document.getElementById('ballType').textContent = ball.type === 'solid' ? t('solids') : t('stripes');
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTable();
    drawBalls();
    drawAim();
    updatePhysics();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousedown', e => {
    if (ballsMoving || waitingForTurn || (gameMode === 'ai' && currentPlayer === 2)) return;
    const rect = canvas.getBoundingClientRect();
    currentMouse.x = e.clientX - rect.left;
    currentMouse.y = e.clientY - rect.top;
    
    if (!powerSet) {
        settingPower = true;
    } else {
        aiming = true;
    }
});

canvas.addEventListener('touchstart', e => {
    if (ballsMoving || waitingForTurn || (gameMode === 'ai' && currentPlayer === 2)) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    currentMouse.x = touch.clientX - rect.left;
    currentMouse.y = touch.clientY - rect.top;
    
    if (!powerSet) {
        settingPower = true;
    } else {
        aiming = true;
    }
});

document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    currentMouse.x = e.clientX - rect.left;
    currentMouse.y = e.clientY - rect.top;
    
    if (settingPower && !ballsMoving) {
        const dx = cueBall.x - currentMouse.x;
        const dy = cueBall.y - currentMouse.y;
        power = Math.min(Math.sqrt(dx * dx + dy * dy) / 200, 1);
    }
});

document.addEventListener('touchmove', e => {
    if (!settingPower && !aiming) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    currentMouse.x = touch.clientX - rect.left;
    currentMouse.y = touch.clientY - rect.top;
    
    if (settingPower && !ballsMoving) {
        const dx = cueBall.x - currentMouse.x;
        const dy = cueBall.y - currentMouse.y;
        power = Math.min(Math.sqrt(dx * dx + dy * dy) / 200, 1);
    }
});

document.addEventListener('mouseup', e => {
    if (ballsMoving) return;
    
    if (settingPower) {
        settingPower = false;
        powerSet = true;
        return;
    }
    
    if (!aiming) return;
    aiming = false;
    
    const dx = cueBall.x - currentMouse.x;
    const dy = cueBall.y - currentMouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 10) return;
    
    cueBall.vx = (dx / dist) * power * 20 + spin.x * 2;
    cueBall.vy = (dy / dist) * power * 20 + spin.y * 2;
    ballsMoving = true;
    waitingForTurn = true;
    ballsPocketedThisTurn = [];
    
    power = 0;
    powerSet = false;
    document.getElementById('powerFill').style.height = '0%';
});

document.addEventListener('touchend', e => {
    if (ballsMoving) return;
    e.preventDefault();
    
    if (settingPower) {
        settingPower = false;
        powerSet = true;
        return;
    }
    
    if (!aiming) return;
    aiming = false;
    
    const dx = cueBall.x - currentMouse.x;
    const dy = cueBall.y - currentMouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 10) return;
    
    cueBall.vx = (dx / dist) * power * 20 + spin.x * 2;
    cueBall.vy = (dy / dist) * power * 20 + spin.y * 2;
    ballsMoving = true;
    waitingForTurn = true;
    ballsPocketedThisTurn = [];
    
    power = 0;
    powerSet = false;
    document.getElementById('powerFill').style.height = '0%';
});

const spinPoint = document.getElementById('spinPoint');
const cueBallEl = document.getElementById('cueBall');

spinPoint.addEventListener('mousedown', e => {
    e.stopPropagation();
    const move = e2 => {
        const rect = cueBallEl.getBoundingClientRect();
        const x = e2.clientX - rect.left - rect.width / 2;
        const y = e2.clientY - rect.top - rect.height / 2;
        const maxDist = 30;
        const dist = Math.sqrt(x * x + y * y);
        if (dist > maxDist) {
            const angle = Math.atan2(y, x);
            spin.x = Math.cos(angle) * maxDist / 30;
            spin.y = Math.sin(angle) * maxDist / 30;
            spinPoint.style.left = (50 + Math.cos(angle) * maxDist) + '%';
            spinPoint.style.top = (50 + Math.sin(angle) * maxDist) + '%';
        } else {
            spin.x = x / 30;
            spin.y = y / 30;
            spinPoint.style.left = (50 + x / rect.width * 100) + '%';
            spinPoint.style.top = (50 + y / rect.height * 100) + '%';
        }
    };
    const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
});
