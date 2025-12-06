class Patience {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.init();
        this.setupControls();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 100));
        
        this.gameLoop();
    }

    setupCanvas() {
        const size = Math.min(window.innerWidth - 40, window.innerHeight - 200, 600);
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    resize() {
        const oldSize = this.canvas.width;
        this.setupCanvas();
        const scale = this.canvas.width / oldSize;
        
        if (this.core) {
            this.core.x = this.centerX + (this.core.x - oldSize / 2) * scale;
            this.core.y = this.centerY + (this.core.y - oldSize / 2) * scale;
        }
        
        this.render();
    }

    init() {
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        this.core = {
            x: this.centerX,
            y: this.centerY,
            vx: 0,
            vy: 0,
            radius: 15,
            mass: 1
        };

        this.stabilityZone = 50;
        this.time = 0;
        this.bestTime = parseFloat(localStorage.getItem('patienceBest')) || 0;
        this.stability = 100;
        this.gameOver = false;
        this.isHolding = false;
        this.holdForce = 0;
        this.zenStreak = parseInt(localStorage.getItem('patienceStreak')) || 0;
        this.fragments = [];
        this.fragmentTimer = 0;
        this.fragmentInterval = 300;
        this.score = 0;
        
        this.forces = {
            wind: { x: 0, y: 0, strength: 0.02 },
            pulse: { timer: 0, interval: 180, strength: 2 },
            massChange: { timer: 0, interval: 300 }
        };

        this.particles = [];
        this.rings = [];
        
        document.getElementById('best').textContent = this.bestTime.toFixed(1) + 's';
        document.getElementById('streakValue').textContent = this.zenStreak;
    }

    setupControls() {
        const hold = () => { if (!this.gameOver) this.isHolding = true; };
        const release = () => { this.isHolding = false; };

        this.canvas.addEventListener('mousedown', hold);
        this.canvas.addEventListener('mouseup', release);
        this.canvas.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            hold(); 
        }, { passive: false });
        this.canvas.addEventListener('touchend', (e) => { 
            e.preventDefault(); 
            release(); 
        }, { passive: false });
        
        document.addEventListener('mouseup', release);
        document.addEventListener('touchend', release);
    }

    update() {
        if (this.gameOver) return;

        this.time += 1/60;
        
        // Fragmentos de energia
        this.fragmentTimer++;
        if (this.fragmentTimer >= this.fragmentInterval) {
            this.fragmentTimer = 0;
            this.spawnFragment();
        }
        
        // Atualizar fragmentos
        this.fragments = this.fragments.filter(f => {
            f.life--;
            const dist = Math.sqrt(Math.pow(this.core.x - f.x, 2) + Math.pow(this.core.y - f.y, 2));
            if (dist < this.core.radius + 10) {
                this.score += 10;
                this.stability = Math.min(100, this.stability + 10);
                this.createCollectEffect(f.x, f.y);
                return false;
            }
            return f.life > 0;
        });
        
        // Forças externas
        this.forces.wind.x = Math.sin(this.time * 0.5) * this.forces.wind.strength;
        this.forces.wind.y = Math.cos(this.time * 0.7) * this.forces.wind.strength;
        
        // Pulso magnético
        this.forces.pulse.timer++;
        if (this.forces.pulse.timer >= this.forces.pulse.interval) {
            this.forces.pulse.timer = 0;
            const angle = Math.random() * Math.PI * 2;
            this.core.vx += Math.cos(angle) * this.forces.pulse.strength;
            this.core.vy += Math.sin(angle) * this.forces.pulse.strength;
            this.createRing();
        }

        // Mudança de massa
        this.forces.massChange.timer++;
        if (this.forces.massChange.timer >= this.forces.massChange.interval) {
            this.forces.massChange.timer = 0;
            this.core.mass = 0.7 + Math.random() * 0.6;
        }

        // Controle do jogador
        if (this.isHolding) {
            this.holdForce = Math.min(100, this.holdForce + 3);
            const dx = this.centerX - this.core.x;
            const dy = this.centerY - this.core.y;
            const force = (0.15 * (this.holdForce / 100)) / this.core.mass;
            this.core.vx += dx * force;
            this.core.vy += dy * force;
            this.createParticle();
        } else {
            this.holdForce = Math.max(0, this.holdForce - 5);
        }
        
        document.getElementById('forceFill').style.height = this.holdForce + '%';

        // Aplicar forças
        this.core.vx += this.forces.wind.x;
        this.core.vy += this.forces.wind.y;
        
        // Fricção
        this.core.vx *= 0.98;
        this.core.vy *= 0.98;

        // Movimento
        this.core.x += this.core.vx;
        this.core.y += this.core.vy;

        // Distância do centro
        const dist = Math.sqrt(Math.pow(this.core.x - this.centerX, 2) + Math.pow(this.core.y - this.centerY, 2));
        
        // Estabilidade
        if (dist <= this.stabilityZone) {
            this.stability = Math.min(100, this.stability + 0.5);
        } else {
            this.stability -= (dist - this.stabilityZone) * 0.1;
        }

        if (this.stability <= 0) {
            this.die();
        }

        // Atualizar partículas
        this.particles = this.particles.filter(p => {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha = p.life / 30;
            return p.life > 0;
        });

        // Atualizar anéis
        this.rings = this.rings.filter(r => {
            r.radius += 2;
            r.alpha -= 0.02;
            return r.alpha > 0;
        });

        this.updateUI();
    }

    createParticle() {
        if (Math.random() < 0.3) {
            this.particles.push({
                x: this.core.x,
                y: this.core.y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 30,
                alpha: 1
            });
        }
    }

    createRing() {
        this.rings.push({
            x: this.core.x,
            y: this.core.y,
            radius: this.core.radius,
            alpha: 1
        });
    }

    spawnFragment() {
        const angle = Math.random() * Math.PI * 2;
        const dist = this.stabilityZone + 30 + Math.random() * 50;
        this.fragments.push({
            x: this.centerX + Math.cos(angle) * dist,
            y: this.centerY + Math.sin(angle) * dist,
            life: 180
        });
    }

    createCollectEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 30,
                alpha: 1,
                color: '#ffd700'
            });
        }
    }

    updateUI() {
        document.getElementById('time').textContent = this.time.toFixed(1) + 's';
        document.getElementById('stability').textContent = Math.floor(this.stability) + '%';
    }

    draw() {
        // Background
        const gradient = this.ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, this.canvas.width);
        gradient.addColorStop(0, '#1a1a3e');
        gradient.addColorStop(1, '#0a0a1e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid sutil
        this.ctx.strokeStyle = 'rgba(0,212,255,0.05)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        // Zona de estabilidade
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.stabilityZone, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0,212,255,0.1)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(0,212,255,0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Ponto central
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.fill();

        // Anéis de pulso
        for (const ring of this.rings) {
            this.ctx.beginPath();
            this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0,212,255,${ring.alpha * 0.5})`;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // Fragmentos de energia
        for (const f of this.fragments) {
            const alpha = Math.min(1, f.life / 60);
            const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
            
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, 8 * pulse, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255,215,0,${alpha * 0.3})`;
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255,215,0,${alpha})`;
            this.ctx.fill();
            this.ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // Partículas
        for (const p of this.particles) {
            const color = p.color || '0,212,255';
            this.ctx.fillStyle = `rgba(${color},${p.alpha})`;
            this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        }

        // Linha de conexão
        if (this.isHolding) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(this.core.x, this.core.y);
            this.ctx.strokeStyle = 'rgba(0,212,255,0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        // Núcleo quântico
        const coreGradient = this.ctx.createRadialGradient(this.core.x, this.core.y, 0, this.core.x, this.core.y, this.core.radius * 2);
        coreGradient.addColorStop(0, '#ffffff');
        coreGradient.addColorStop(0.5, '#00d4ff');
        coreGradient.addColorStop(1, 'rgba(0,102,255,0)');
        
        this.ctx.beginPath();
        this.ctx.arc(this.core.x, this.core.y, this.core.radius * 2, 0, Math.PI * 2);
        this.ctx.fillStyle = coreGradient;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.core.x, this.core.y, this.core.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Barra de estabilidade
        const barWidth = this.canvas.width - 40;
        const barHeight = 20;
        const barX = 20;
        const barY = this.canvas.height - 40;

        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        const stabilityColor = this.stability > 50 ? '#00d4ff' : this.stability > 25 ? '#ffaa00' : '#ff4444';
        this.ctx.fillStyle = stabilityColor;
        this.ctx.fillRect(barX, barY, (barWidth * this.stability) / 100, barHeight);

        this.ctx.strokeStyle = 'rgba(0,212,255,0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    die() {
        this.gameOver = true;
        
        if (this.time > this.bestTime) {
            this.bestTime = this.time;
            this.zenStreak++;
            localStorage.setItem('patienceBest', this.bestTime.toString());
            localStorage.setItem('patienceStreak', this.zenStreak.toString());
            NeoGamesSave.save('patience', { bestTime: this.bestTime, zenStreak: this.zenStreak });
        } else {
            this.zenStreak = 0;
            localStorage.setItem('patienceStreak', '0');
        }

        document.getElementById('finalTime').textContent = this.time.toFixed(1);
        document.getElementById('finalBest').textContent = this.bestTime.toFixed(1);
        
        const gameOverDiv = document.getElementById('gameOver');
        const existingScore = gameOverDiv.querySelector('.scoreInfo');
        if (!existingScore) {
            const scoreP = document.createElement('p');
            scoreP.className = 'scoreInfo';
            scoreP.innerHTML = `Fragmentos: <span id="finalScore">0</span> | Sequência: <span id="finalStreak">0</span>`;
            gameOverDiv.insertBefore(scoreP, gameOverDiv.querySelector('.btn'));
        }
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalStreak').textContent = this.zenStreak;
        
        gameOverDiv.style.display = 'block';

        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.core.x,
                y: this.core.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 60,
                alpha: 1
            });
        }
    }

    restart() {
        document.getElementById('gameOver').style.display = 'none';
        this.init();
        this.gameOver = false;
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

let game;

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('menuBtn').style.display = 'block';
    if (!game) game = new Patience();
}

function showMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('menuBtn').style.display = 'none';
    if (game) {
        game.gameOver = true;
        document.getElementById('gameOver').style.display = 'none';
    }
}

function showCredits() {
    alert('💫 Patience\n\nEstabilidade Quântica!\nMantenha o núcleo no centro.\n\n© 2024 NeoGames');
}
