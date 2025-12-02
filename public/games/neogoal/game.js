class NeoGoal {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        this.classes = {
            dash: { name: 'Acelerador', speedBonus: 1.15, stopBonus: 1, aimBonus: 1 },
            anchor: { name: 'Tanque', speedBonus: 1, stopBonus: 1.2, aimBonus: 1 },
            surveyor: { name: 'Tático', speedBonus: 1, stopBonus: 1, aimBonus: 1.5 }
        };
        
        this.cards = [
            { id: 'shield', name: 'Escudo', cost: 3, desc: 'Obstáculo no gol', type: 'normal' },
            { id: 'wind', name: 'Vento', cost: 2, desc: 'Desvia trajetória', type: 'reaction' },
            { id: 'double', name: 'Tiro Duplo', cost: 5, desc: 'Chute extra', type: 'normal' },
            { id: 'barrier', name: 'Barreira', cost: 4, desc: 'Bloco permanente', type: 'normal' },
            { id: 'superpower', name: 'Super Potência', cost: 3, desc: '3x força, -1 turno cartas', type: 'risk' }
        ];
        
        this.fields = ['normal', 'portal', 'moving'];
        
        this.reset();
        this.setupControls();
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    setupCanvas() {
        const isMobile = window.innerWidth <= 768;
        const w = isMobile ? window.innerWidth * 0.95 : Math.min(window.innerWidth * 0.9, 1000);
        const h = isMobile ? window.innerHeight * 0.6 : Math.min(window.innerHeight * 0.7, 600);
        
        const oldW = this.w;
        const oldH = this.h;
        
        this.canvas.width = w;
        this.canvas.height = h;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        
        if (this.ball && oldW && oldH) {
            const scaleX = this.w / oldW;
            const scaleY = this.h / oldH;
            this.ball.x *= scaleX;
            this.ball.y *= scaleY;
            this.striker.x *= scaleX;
            this.striker.y *= scaleY;
            if (this.aiStriker) {
                this.aiStriker.x *= scaleX;
                this.aiStriker.y *= scaleY;
            }
        }
    }
    
    reset() {
        this.p1Score = 0;
        this.p2Score = 0;
        this.energy = 5;
        this.maxEnergy = 5;
        this.turn = 1;
        this.playerClass = null;
        this.field = this.fields[Math.floor(Math.random() * this.fields.length)];
        this.activeCard = null;
        this.shield = null;
        this.portal1 = null;
        this.portal2 = null;
        this.goalOffset = 0;
        this.striker = { x: this.w * 0.3, y: this.h / 2, vx: 0, vy: 0, r: 12 };
        this.ball = { x: this.w / 2, y: this.h / 2, vx: 0, vy: 0, r: 15 };
        this.barriers = [];
        this.damageZones = [];
        this.cardDisabled = 0;
        this.stylePoints = 0;
        this.bounceGoal = false;
        this.aiming = false;
        this.aimStart = null;
        this.aimCurrent = null;
        this.bounces = 0;
        this.frozen = false;
        this.doubleShot = false;
        this.hasShot = false;
        
        this.initField();
    }
    
    initField() {
        if (this.field === 'portal') {
            this.portal1 = { x: this.w * 0.25, y: this.h * 0.3, r: 30 };
            this.portal2 = { x: this.w * 0.75, y: this.h * 0.7, r: 30 };
        }
    }
    
    selectClass(type) {
        this.playerClass = this.classes[type];
        document.getElementById('classSelect').style.display = 'none';
        document.getElementById('modeSelect').style.display = 'block';
    }
    
    selectMode(mode) {
        this.vsAI = mode === 'ai';
        document.getElementById('modeSelect').style.display = 'none';
        
        if (this.vsAI) {
            document.getElementById('difficultySelect').style.display = 'block';
        } else {
            this.aiDifficulty = null;
            this.startGame();
        }
    }
    
    selectDifficulty(level) {
        this.aiDifficulty = level;
        document.getElementById('difficultySelect').style.display = 'none';
        this.startGame();
    }
    
    startGame() {
        this.resetBall();
        this.renderCards();
        this.loop();
    }
    
    renderCards() {
        const container = document.getElementById('cards');
        container.innerHTML = '';
        this.cards.forEach(card => {
            const div = document.createElement('div');
            div.className = 'card' + (this.energy < card.cost ? ' disabled' : '');
            div.innerHTML = `<div class="cardName">${card.name}</div><div class="cardCost">⚡${card.cost}</div>`;
            div.onclick = () => this.useCard(card);
            container.appendChild(div);
        });
    }
    
    useCard(card) {
        if (this.energy < card.cost || (this.turn !== 1 && card.type !== 'reaction') || this.aiming || this.cardDisabled > 0) return;
        
        this.energy -= card.cost;
        this.activeCard = card.id;
        
        if (card.id === 'shield') {
            this.shield = { x: this.w * 0.9, y: this.h / 2, w: 20, h: 100 };
        } else if (card.id === 'double') {
            this.doubleShot = true;
        } else if (card.id === 'barrier' && this.barriers.length < 2) {
            this.barriers.push({ x: this.w * 0.6, y: this.h / 2, w: 15, h: 80 });
        } else if (card.id === 'superpower') {
            this.superPower = true;
            this.cardDisabled = 1;
        }
        
        this.updateUI();
        this.renderCards();
    }
    
    setupControls() {
        this.canvas.addEventListener('mousedown', e => this.startAim(e));
        this.canvas.addEventListener('mousemove', e => this.updateAim(e));
        this.canvas.addEventListener('mouseup', e => this.shoot(e));
        this.canvas.addEventListener('touchstart', e => this.startAim(e.touches[0]), { passive: false });
        this.canvas.addEventListener('touchmove', e => this.updateAim(e.touches[0]), { passive: false });
        this.canvas.addEventListener('touchend', e => this.shoot(e.changedTouches[0]), { passive: false });
    }
    
    startAim(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.w / rect.width);
        const y = (e.clientY - rect.top) * (this.h / rect.height);
        
        if (this.turn === 1 && this.striker.vx === 0 && this.striker.vy === 0 && this.ball.vx === 0 && this.ball.vy === 0) {
            const dx = x - this.striker.x;
            const dy = y - this.striker.y;
            if (Math.sqrt(dx * dx + dy * dy) < this.striker.r * 2) {
                this.aiming = true;
                this.aimStart = { x: this.striker.x, y: this.striker.y };
                this.aimCurrent = { x, y };
                this.bounces = 0;
            }
        } else if (this.turn === 2 && !this.vsAI && this.aiStriker.vx === 0 && this.aiStriker.vy === 0 && this.ball.vx === 0 && this.ball.vy === 0) {
            const dx = x - this.aiStriker.x;
            const dy = y - this.aiStriker.y;
            if (Math.sqrt(dx * dx + dy * dy) < this.aiStriker.r * 2) {
                this.aiming = true;
                this.aimStart = { x: this.aiStriker.x, y: this.aiStriker.y };
                this.aimCurrent = { x, y };
                this.bounces = 0;
            }
        }
    }
    
    updateAim(e) {
        if (!this.aiming) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.w / rect.width);
        const y = (e.clientY - rect.top) * (this.h / rect.height);
        this.aimCurrent = { x, y };
    }
    
    shoot(e) {
        if (!this.aiming || !this.aimCurrent) return;
        
        this.aiming = false;
        
        const dx = this.aimCurrent.x - this.aimStart.x;
        const dy = this.aimCurrent.y - this.aimStart.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 10) {
            const power = Math.min(dist / 100, 2);
            const multiplier = this.superPower ? 3 : 1;
            
            if (this.turn === 1) {
                this.striker.vx = (dx / dist) * power * 15 * multiplier;
                this.striker.vy = (dy / dist) * power * 15 * multiplier;
                this.superPower = false;
                this.hasShot = true;
            } else if (this.turn === 2 && !this.vsAI) {
                this.aiStriker.vx = (dx / dist) * power * 15 * multiplier;
                this.aiStriker.vy = (dy / dist) * power * 15 * multiplier;
                this.hasShot = true;
            }
            
            if (this.activeCard === 'freeze') {
                this.frozen = true;
                setTimeout(() => this.frozen = false, 1000);
            }
        }
        
        this.aimStart = null;
        this.aimCurrent = null;
    }
    
    update() {
        if (this.field === 'moving' && this.turn === 1) {
            this.goalOffset = Math.sin(Date.now() / 1000) * 50;
        }
        
        if (this.frozen) return;
        
        this.striker.x += this.striker.vx;
        this.striker.y += this.striker.vy;
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        
        if (this.aiStriker && this.turn === 2) {
            this.aiStriker.x += this.aiStriker.vx;
            this.aiStriker.y += this.aiStriker.vy;
            this.aiStriker.vx *= 0.98;
            this.aiStriker.vy *= 0.98;
            
            if (Math.abs(this.aiStriker.vx) < 0.1 && Math.abs(this.aiStriker.vy) < 0.1) {
                this.aiStriker.vx = 0;
                this.aiStriker.vy = 0;
            }
            
            const aiDist = Math.sqrt((this.aiStriker.x - this.ball.x) ** 2 + (this.aiStriker.y - this.ball.y) ** 2);
            if (aiDist < this.aiStriker.r + this.ball.r) {
                const dx = this.ball.x - this.aiStriker.x;
                const dy = this.ball.y - this.aiStriker.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const overlap = this.aiStriker.r + this.ball.r - dist;
                this.ball.x += (dx / dist) * overlap;
                this.ball.y += (dy / dist) * overlap;
                
                const transferRate = 0.7;
                this.ball.vx += this.aiStriker.vx * transferRate;
                this.ball.vy += this.aiStriker.vy * transferRate;
                this.aiStriker.vx *= 0.3;
                this.aiStriker.vy *= 0.3;
            }
        }
        
        this.striker.vx *= 0.98;
        this.striker.vy *= 0.98;
        this.ball.vx *= 0.99;
        this.ball.vy *= 0.99;
        
        const strikerDist = Math.sqrt((this.striker.x - this.ball.x) ** 2 + (this.striker.y - this.ball.y) ** 2);
        if (strikerDist < this.striker.r + this.ball.r && this.turn === 1) {
            const dx = this.ball.x - this.striker.x;
            const dy = this.ball.y - this.striker.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const overlap = this.striker.r + this.ball.r - dist;
            this.ball.x += (dx / dist) * overlap;
            this.ball.y += (dy / dist) * overlap;
            
            const transferRate = 0.7;
            this.ball.vx += this.striker.vx * transferRate;
            this.ball.vy += this.striker.vy * transferRate;
            this.striker.vx *= 0.3;
            this.striker.vy *= 0.3;
        }
        
        if (Math.abs(this.striker.vx) < 0.1 && Math.abs(this.striker.vy) < 0.1 && (this.striker.vx !== 0 || this.striker.vy !== 0)) {
            this.striker.vx = 0;
            this.striker.vy = 0;
        }
        
        if (Math.abs(this.ball.vx) < 0.1 && Math.abs(this.ball.vy) < 0.1) {
            this.ball.vx = 0;
            this.ball.vy = 0;
        }
        
        if (this.striker.vx === 0 && this.striker.vy === 0 && this.ball.vx === 0 && this.ball.vy === 0 && this.turn === 1 && !this.doubleShot && !this.aiming && this.hasShot) {
            if (this.cardDisabled > 0) this.cardDisabled--;
            this.hasShot = false;
            this.endTurn();
        } else if (this.doubleShot && this.striker.vx === 0 && this.striker.vy === 0 && this.ball.vx === 0 && this.ball.vy === 0 && this.hasShot) {
            this.doubleShot = false;
            this.hasShot = false;
        }
        
        if (!this.vsAI && this.aiStriker.vx === 0 && this.aiStriker.vy === 0 && this.ball.vx === 0 && this.ball.vy === 0 && this.turn === 2 && !this.aiming && this.hasShot) {
            this.hasShot = false;
            this.turn = 1;
            this.energy = Math.min(this.maxEnergy, this.energy + 1);
            document.getElementById('turnIndicator').textContent = 'TURNO P1';
            this.updateUI();
            this.renderCards();
        }
        
        if (this.striker.y - this.striker.r < 0 || this.striker.y + this.striker.r > this.h) {
            this.striker.vy *= -1;
            this.striker.y = Math.max(this.striker.r, Math.min(this.h - this.striker.r, this.striker.y));
        }
        
        if (this.aiStriker) {
            if (this.aiStriker.y - this.aiStriker.r < 0 || this.aiStriker.y + this.aiStriker.r > this.h) {
                this.aiStriker.vy *= -1;
                this.aiStriker.y = Math.max(this.aiStriker.r, Math.min(this.h - this.aiStriker.r, this.aiStriker.y));
            }
        }
        
        if (this.ball.y - this.ball.r < 0 || this.ball.y + this.ball.r > this.h) {
            this.ball.vy *= -1;
            this.ball.y = Math.max(this.ball.r, Math.min(this.h - this.ball.r, this.ball.y));
            this.bounces++;
            if (this.bounces >= 3) this.bounceGoal = true;
            if (this.bounces === 1 && this.playerClass.speedBonus > 1) {
                this.striker.vx *= this.playerClass.speedBonus;
                this.striker.vy *= this.playerClass.speedBonus;
            }
        }
        
        if (this.striker.x - this.striker.r < 0 || this.striker.x + this.striker.r > this.w) {
            this.striker.vx *= -1;
            this.striker.x = Math.max(this.striker.r, Math.min(this.w - this.striker.r, this.striker.x));
        }
        
        if (this.aiStriker) {
            if (this.aiStriker.x - this.aiStriker.r < 0 || this.aiStriker.x + this.aiStriker.r > this.w) {
                this.aiStriker.vx *= -1;
                this.aiStriker.x = Math.max(this.aiStriker.r, Math.min(this.w - this.aiStriker.r, this.aiStriker.x));
            }
        }
        

        
        if (this.shield && this.checkCollision(this.ball, this.shield)) {
            this.ball.vx *= -1;
            this.ball.x = this.shield.x - this.ball.r;
        }
        
        this.barriers.forEach(barrier => {
            if (this.checkCollision(this.striker, barrier)) {
                this.striker.vx *= -1;
                this.striker.x = barrier.x < this.w / 2 ? barrier.x - this.striker.r : barrier.x + barrier.w + this.striker.r;
            }
            if (this.checkCollision(this.ball, barrier)) {
                this.ball.vx *= -1;
                this.ball.x = barrier.x < this.w / 2 ? barrier.x - this.ball.r : barrier.x + barrier.w + this.ball.r;
            }
        });
        
        if (this.portal1 && this.portal2) {
            const d1 = Math.sqrt((this.ball.x - this.portal1.x) ** 2 + (this.ball.y - this.portal1.y) ** 2);
            const d2 = Math.sqrt((this.ball.x - this.portal2.x) ** 2 + (this.ball.y - this.portal2.y) ** 2);
            
            if (d1 < this.portal1.r) {
                this.ball.x = this.portal2.x;
                this.ball.y = this.portal2.y;
            } else if (d2 < this.portal2.r) {
                this.ball.x = this.portal1.x;
                this.ball.y = this.portal1.y;
            }
        }
        
        if (this.field === 'magnetic' && (this.ball.vx !== 0 || this.ball.vy !== 0)) {
            const centerX = this.w / 2;
            const centerY = this.h / 2;
            const dx = centerX - this.ball.x;
            const dy = centerY - this.ball.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                this.ball.vx += (dx / dist) * 0.1;
                this.ball.vy += (dy / dist) * 0.1;
            }
        }
        
        if (this.activeCard === 'wind' && Math.random() < 0.05) {
            const angle = (Math.random() - 0.5) * 0.2;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const vx = this.ball.vx * cos - this.ball.vy * sin;
            const vy = this.ball.vx * sin + this.ball.vy * cos;
            this.ball.vx = vx;
            this.ball.vy = vy;
        }
        
        this.checkGoal();
    }
    
    checkCollision(ball, rect) {
        const closestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.w));
        const closestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.h));
        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        return (dx * dx + dy * dy) < (ball.r * ball.r);
    }
    
    checkGoal() {
        const goalSize = 80;
        const goalY1 = this.h / 2 - goalSize + this.goalOffset;
        const goalY2 = this.h / 2 + goalSize + this.goalOffset;
        
        if (this.ball.x - this.ball.r <= 0) {
            if (this.ball.y > goalY1 && this.ball.y < goalY2) {
                this.p2Score++;
                if (this.bounceGoal) this.stylePoints++;
                this.resetBall();
                this.checkWin();
            } else {
                this.ball.vx *= -1;
                this.ball.x = this.ball.r;
            }
        }
        
        if (this.ball.x + this.ball.r >= this.w) {
            if (this.ball.y > goalY1 && this.ball.y < goalY2) {
                this.p1Score++;
                if (this.bounceGoal) this.stylePoints++;
                this.resetBall();
                this.checkWin();
            } else {
                this.ball.vx *= -1;
                this.ball.x = this.w - this.ball.r;
            }
        }
    }
    
    resetBall() {
        const p1X = 0.15 + Math.random() * 0.2;
        const p1Y = 0.3 + Math.random() * 0.4;
        const p2X = 0.65 + Math.random() * 0.2;
        const p2Y = 0.3 + Math.random() * 0.4;
        const ballX = 0.4 + Math.random() * 0.2;
        const ballY = 0.3 + Math.random() * 0.4;
        
        this.striker = { x: this.w * p1X, y: this.h * p1Y, vx: 0, vy: 0, r: 12 };
        this.aiStriker = { x: this.w * p2X, y: this.h * p2Y, vx: 0, vy: 0, r: 12 };
        this.ball = { x: this.w * ballX, y: this.h * ballY, vx: 0, vy: 0, r: 15 };
        this.shield = null;
        this.activeCard = null;
        this.frozen = false;
        this.doubleShot = false;
        this.bounceGoal = false;
        this.hasShot = false;
        this.turn = 1;
        document.getElementById('turnIndicator').textContent = this.vsAI ? 'SEU TURNO' : 'TURNO P1';
        this.updateUI();
    }
    
    checkWin() {
        if (this.p1Score >= 3 || this.p2Score >= 3) {
            document.getElementById('winnerText').textContent = this.p1Score >= 3 ? '🏆 Vitória!' : '😢 Derrota';
            document.getElementById('finalScore').textContent = `${this.p1Score} - ${this.p2Score}`;
            document.getElementById('gameOver').style.display = 'block';
            this.ball.vx = 0;
            this.ball.vy = 0;
        }
    }
    
    endTurn() {
        if (this.ball.vx !== 0 || this.ball.vy !== 0 || this.turn !== 1) return;
        
        this.turn = 2;
        this.hasShot = false;
        document.getElementById('turnIndicator').textContent = this.vsAI ? 'TURNO DA IA' : 'TURNO P2';
        
        if (this.vsAI) {
            setTimeout(() => {
                if (this.turn === 2) {
                    this.aiMove();
                    setTimeout(() => {
                        if (this.turn === 2) {
                            this.turn = 1;
                            this.energy = Math.min(this.maxEnergy, this.energy + 1);
                            document.getElementById('turnIndicator').textContent = 'SEU TURNO';
                            this.updateUI();
                            this.renderCards();
                        }
                    }, 3000);
                }
            }, 1000);
        }
    }
    
    aiMove() {
        if (!this.aiStriker) {
            this.aiStriker = { x: this.w * 0.7, y: this.h / 2, vx: 0, vy: 0, r: 12 };
        }
        
        const difficulties = {
            easy: { power: 8, accuracy: 0.65, error: 8 },
            medium: { power: 10, accuracy: 0.80, error: 4 },
            hard: { power: 12, accuracy: 0.92, error: 2 },
            expert: { power: 14, accuracy: 0.98, error: 0.5 }
        };
        
        const diff = difficulties[this.aiDifficulty] || difficulties.medium;
        
        const goalX = 0;
        const goalY = this.h / 2;
        const ballToGoalDx = goalX - this.ball.x;
        const ballToGoalDy = goalY - this.ball.y;
        const ballToGoalDist = Math.sqrt(ballToGoalDx * ballToGoalDx + ballToGoalDy * ballToGoalDy);
        
        const hitPointX = this.ball.x + (ballToGoalDx / ballToGoalDist) * -30;
        const hitPointY = this.ball.y + (ballToGoalDy / ballToGoalDist) * -30;
        
        const dx = hitPointX - this.aiStriker.x;
        const dy = hitPointY - this.aiStriker.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        this.aiStriker.vx = (dx / dist) * diff.power * diff.accuracy + (Math.random() - 0.5) * diff.error;
        this.aiStriker.vy = (dy / dist) * diff.power * diff.accuracy + (Math.random() - 0.5) * diff.error;
    }
    
    updateUI() {
        document.getElementById('p1Score').textContent = this.p1Score + (this.stylePoints > 0 ? ` (+${this.stylePoints})` : '');
        document.getElementById('p2Score').textContent = this.p2Score;
        document.getElementById('energyFill').style.width = (this.energy / this.maxEnergy * 100) + '%';
    }
    
    draw() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.w, this.h);
        gradient.addColorStop(0, '#0a1a0a');
        gradient.addColorStop(0.5, '#0d1f0d');
        gradient.addColorStop(1, '#0a1a0a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
        
        for (let i = 0; i < 3; i++) {
            this.ctx.strokeStyle = `rgba(0,255,136,${0.02 + i * 0.01})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(this.w / 2, this.h / 2, 80 + i * 20, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.save();
        this.ctx.setLineDash([10, 10]);
        this.ctx.lineDashOffset = -Date.now() / 50;
        this.ctx.strokeStyle = 'rgba(0,255,136,0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.w / 2, 0);
        this.ctx.lineTo(this.w / 2, this.h);
        this.ctx.stroke();
        this.ctx.restore();
        
        const pulse = Math.sin(Date.now() / 500) * 0.2 + 0.8;
        this.ctx.strokeStyle = `rgba(0,255,136,${0.3 * pulse})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(this.w / 2, this.h / 2, 80, 0, Math.PI * 2);
        this.ctx.stroke();
        
        const goalSize = 80;
        const goalY = this.h / 2 + this.goalOffset;
        
        const goalGlow = Math.sin(Date.now() / 300) * 0.3 + 0.7;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#ff0000';
        this.ctx.strokeStyle = `rgba(255,0,0,${goalGlow})`;
        this.ctx.lineWidth = 12;
        this.ctx.beginPath();
        this.ctx.moveTo(0, goalY - goalSize);
        this.ctx.lineTo(0, goalY + goalSize);
        this.ctx.stroke();
        
        this.ctx.shadowColor = '#0066ff';
        this.ctx.strokeStyle = `rgba(0,102,255,${goalGlow})`;
        this.ctx.beginPath();
        this.ctx.moveTo(this.w, goalY - goalSize);
        this.ctx.lineTo(this.w, goalY + goalSize);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        if (this.shield) {
            const shieldPulse = Math.sin(Date.now() / 200) * 0.2 + 0.6;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#00d4ff';
            const shieldGrad = this.ctx.createLinearGradient(this.shield.x, 0, this.shield.x + this.shield.w, 0);
            shieldGrad.addColorStop(0, `rgba(0,212,255,${shieldPulse})`);
            shieldGrad.addColorStop(0.5, `rgba(0,255,255,${shieldPulse + 0.2})`);
            shieldGrad.addColorStop(1, `rgba(0,212,255,${shieldPulse})`);
            this.ctx.fillStyle = shieldGrad;
            this.ctx.fillRect(this.shield.x, this.shield.y - this.shield.h / 2, this.shield.w, this.shield.h);
            this.ctx.shadowBlur = 0;
        }
        
        if (this.portal1 && this.portal2) {
            const portalSpin = Date.now() / 1000;
            [this.portal1, this.portal2].forEach(portal => {
                const portalGrad = this.ctx.createRadialGradient(portal.x, portal.y, 0, portal.x, portal.y, portal.r);
                portalGrad.addColorStop(0, 'rgba(138,43,226,0.9)');
                portalGrad.addColorStop(0.5, 'rgba(75,0,130,0.6)');
                portalGrad.addColorStop(1, 'rgba(138,43,226,0.2)');
                this.ctx.fillStyle = portalGrad;
                this.ctx.beginPath();
                this.ctx.arc(portal.x, portal.y, portal.r, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.save();
                this.ctx.translate(portal.x, portal.y);
                this.ctx.rotate(portalSpin);
                this.ctx.strokeStyle = 'rgba(138,43,226,0.8)';
                this.ctx.lineWidth = 2;
                for (let i = 0; i < 6; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(portal.r, 0);
                    this.ctx.stroke();
                    this.ctx.rotate(Math.PI / 3);
                }
                this.ctx.restore();
            });
        }
        
        if (this.field === 'magnetic') {
            this.ctx.strokeStyle = 'rgba(255,0,255,0.3)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.w / 2, this.h / 2, 150, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.barriers.forEach(barrier => {
            const barrierGrad = this.ctx.createLinearGradient(barrier.x, barrier.y - barrier.h / 2, barrier.x, barrier.y + barrier.h / 2);
            barrierGrad.addColorStop(0, 'rgba(255,165,0,0.3)');
            barrierGrad.addColorStop(0.5, 'rgba(255,165,0,0.9)');
            barrierGrad.addColorStop(1, 'rgba(255,165,0,0.3)');
            this.ctx.fillStyle = barrierGrad;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ffa500';
            this.ctx.fillRect(barrier.x, barrier.y - barrier.h / 2, barrier.w, barrier.h);
            this.ctx.shadowBlur = 0;
        });
        
        if (this.aiming && this.aimStart && this.aimCurrent) {
            const dx = this.aimCurrent.x - this.aimStart.x;
            const dy = this.aimCurrent.y - this.aimStart.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            this.ctx.strokeStyle = 'rgba(0,255,136,0.7)';
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.aimStart.x, this.aimStart.y);
            this.ctx.lineTo(this.aimCurrent.x, this.aimCurrent.y);
            this.ctx.stroke();
            
            const arrowSize = 15;
            const angle = Math.atan2(dy, dx);
            this.ctx.fillStyle = 'rgba(0,255,136,0.9)';
            this.ctx.beginPath();
            this.ctx.moveTo(this.aimCurrent.x, this.aimCurrent.y);
            this.ctx.lineTo(
                this.aimCurrent.x - arrowSize * Math.cos(angle - Math.PI / 6),
                this.aimCurrent.y - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            this.ctx.lineTo(
                this.aimCurrent.x - arrowSize * Math.cos(angle + Math.PI / 6),
                this.aimCurrent.y - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            this.ctx.closePath();
            this.ctx.fill();
            
            const powerPercent = Math.min(dist / 200, 1);
            this.ctx.fillStyle = `rgba(0,255,136,${0.3 + powerPercent * 0.4})`;
            this.ctx.beginPath();
            this.ctx.arc(this.aimStart.x, this.aimStart.y, this.striker.r + 10 * powerPercent, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        const strikerGrad = this.ctx.createRadialGradient(this.striker.x, this.striker.y, 0, this.striker.x, this.striker.y, this.striker.r);
        strikerGrad.addColorStop(0, '#00ffff');
        strikerGrad.addColorStop(0.7, '#00d4ff');
        strikerGrad.addColorStop(1, '#0066ff');
        this.ctx.fillStyle = strikerGrad;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#00d4ff';
        this.ctx.beginPath();
        this.ctx.arc(this.striker.x, this.striker.y, this.striker.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        if (this.turn === 1) {
            const ringPulse = Math.sin(Date.now() / 200) * 3 + 5;
            this.ctx.strokeStyle = '#00ff88';
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ff88';
            this.ctx.beginPath();
            this.ctx.arc(this.striker.x, this.striker.y, this.striker.r + ringPulse, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
        
        if (this.aiStriker) {
            const aiGrad = this.ctx.createRadialGradient(this.aiStriker.x, this.aiStriker.y, 0, this.aiStriker.x, this.aiStriker.y, this.aiStriker.r);
            aiGrad.addColorStop(0, '#ff6666');
            aiGrad.addColorStop(0.7, '#ff4444');
            aiGrad.addColorStop(1, '#cc0000');
            this.ctx.fillStyle = aiGrad;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#ff4444';
            this.ctx.beginPath();
            this.ctx.arc(this.aiStriker.x, this.aiStriker.y, this.aiStriker.r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            if (this.turn === 2) {
                const ringPulse = Math.sin(Date.now() / 200) * 3 + 5;
                this.ctx.strokeStyle = '#ff8888';
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#ff8888';
                this.ctx.beginPath();
                this.ctx.arc(this.aiStriker.x, this.aiStriker.y, this.aiStriker.r + ringPulse, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }
        }
        
        const ballGrad = this.ctx.createRadialGradient(this.ball.x - 5, this.ball.y - 5, 0, this.ball.x, this.ball.y, this.ball.r);
        if (this.frozen) {
            ballGrad.addColorStop(0, '#ffffff');
            ballGrad.addColorStop(0.5, '#00d4ff');
            ballGrad.addColorStop(1, '#0066ff');
        } else {
            ballGrad.addColorStop(0, '#ffffff');
            ballGrad.addColorStop(0.8, '#f0f0f0');
            ballGrad.addColorStop(1, '#cccccc');
        }
        this.ctx.fillStyle = ballGrad;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = this.frozen ? '#00d4ff' : '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        if (this.ball.vx !== 0 || this.ball.vy !== 0) {
            const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
            const trailLength = Math.min(speed * 3, 30);
            const angle = Math.atan2(this.ball.vy, this.ball.vx);
            const trailGrad = this.ctx.createLinearGradient(
                this.ball.x, this.ball.y,
                this.ball.x - Math.cos(angle) * trailLength,
                this.ball.y - Math.sin(angle) * trailLength
            );
            trailGrad.addColorStop(0, 'rgba(255,255,255,0.5)');
            trailGrad.addColorStop(1, 'rgba(255,255,255,0)');
            this.ctx.strokeStyle = trailGrad;
            this.ctx.lineWidth = this.ball.r;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.ball.x, this.ball.y);
            this.ctx.lineTo(
                this.ball.x - Math.cos(angle) * trailLength,
                this.ball.y - Math.sin(angle) * trailLength
            );
            this.ctx.stroke();
        }
    }
    
    loop() {
        if (!this.playerClass) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
    
    restart() {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('classSelect').style.display = 'block';
        this.reset();
    }
}

const game = new NeoGoal();
