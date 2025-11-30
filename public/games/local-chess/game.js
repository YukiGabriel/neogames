// Game State
const canvas = document.getElementById('chessBoard');
const ctx = canvas.getContext('2d');

const BOARD_SIZE = 8;
const TILE_SIZE = canvas.width / BOARD_SIZE;

let board = [];
let selectedPiece = null;
let currentTurn = 'white';
let whiteFI = 3;
let blackFI = 3;
let turnCount = 0;
let extraMoveUsed = false;
let gameMode = 'local';
let aiDifficulty = 'medium';

// Zones (simplified 4 zones)
const zones = [
    { name: 'Centro', squares: [[3,3],[3,4],[4,3],[4,4]], control: 'neutral' },
    { name: 'Norte', squares: [[0,0],[0,1],[1,0],[1,1],[0,6],[0,7],[1,6],[1,7]], control: 'neutral' },
    { name: 'Sul', squares: [[6,0],[6,1],[7,0],[7,1],[6,6],[6,7],[7,6],[7,7]], control: 'neutral' },
    { name: 'Leste', squares: [[2,6],[2,7],[3,6],[3,7],[4,6],[4,7],[5,6],[5,7]], control: 'neutral' }
];

// Piece symbols
const pieces = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
};

function initGame() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    
    // Setup pieces
    const setup = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
    for (let i = 0; i < 8; i++) {
        board[0][i] = { type: setup[i], color: 'black' };
        board[1][i] = { type: 'pawn', color: 'black' };
        board[6][i] = { type: 'pawn', color: 'white' };
        board[7][i] = { type: setup[i], color: 'white' };
    }
    
    currentTurn = 'white';
    whiteFI = 3;
    blackFI = 3;
    turnCount = 0;
    extraMoveUsed = false;
    selectedPiece = null;
    
    updateZoneControl();
    updateUI();
    render();
}

function startGame(mode, difficulty) {
    gameMode = mode;
    aiDifficulty = difficulty || 'medium';
    
    const menu = document.getElementById('mainMenu');
    menu.classList.add('hidden');
    menu.classList.remove('visible');
    document.getElementById('difficultyMenu').style.display = 'none';
    document.getElementById('gameContainer').classList.add('active');
    document.getElementById('menuBtn').style.display = 'block';
    
    initGame();
    canvas.addEventListener('click', handleClick);
}

function showDifficultyMenu() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('difficultyMenu').style.display = 'flex';
}

function hideDifficultyMenu() {
    document.getElementById('mainMenu').style.display = 'flex';
    document.getElementById('difficultyMenu').style.display = 'none';
}

function showMainMenu() {
    const menu = document.getElementById('mainMenu');
    menu.classList.remove('hidden');
    menu.classList.add('visible');
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('menuBtn').style.display = 'none';
    
    canvas.removeEventListener('click', handleClick);
}

function showCredits() {
    const modal = document.createElement('div');
    modal.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);padding:40px;border-radius:20px;border:3px solid #ffd700;z-index:10001;text-align:center;color:white;max-width:400px;`;
    modal.innerHTML = `
        <h2 style="color:#ffd700;margin-bottom:20px;font-size:2rem;">♟️ Local Chess</h2>
        <p style="margin:15px 0;font-size:1.1rem;">Desenvolvido para <strong>NeoGames</strong></p>
        <p style="margin:15px 0;color:#aaa;">Xadrez estratégico com controle territorial e recursos!</p>
        <button onclick="this.parentElement.remove();document.getElementById('creditsOverlay').remove()" style="margin-top:20px;padding:12px 30px;background:#ffd700;color:#1a1a2e;border:none;border-radius:10px;font-size:1rem;font-weight:bold;cursor:pointer;">Fechar</button>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'creditsOverlay';
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;`;
    overlay.onclick = () => { modal.remove(); overlay.remove(); };
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    
    if (selectedPiece) {
        if (isValidMove(selectedPiece, {x, y})) {
            const gameEnded = movePiece(selectedPiece, {x, y});
            selectedPiece = null;
            render();
            
            if (!gameEnded) {
                if (!extraMoveUsed) {
                    endTurn();
                }
                extraMoveUsed = false;
            }
        } else {
            selectedPiece = null;
            render();
        }
    } else {
        const piece = board[y][x];
        if (piece && piece.color === currentTurn) {
            selectedPiece = {x, y, piece};
        }
        render();
    }
}

function isValidMove(from, to) {
    const piece = board[from.y][from.x];
    if (!piece) return false;
    
    const target = board[to.y][to.x];
    if (target && target.color === piece.color) return false;
    
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    
    switch(piece.type) {
        case 'pawn':
            const dir = piece.color === 'white' ? -1 : 1;
            if (to.x === from.x && !target) {
                if (to.y === from.y + dir) return true;
                if ((from.y === 6 && piece.color === 'white') || (from.y === 1 && piece.color === 'black')) {
                    if (to.y === from.y + dir * 2) return true;
                }
            }
            if (dx === 1 && to.y === from.y + dir && target) return true;
            return false;
        case 'rook':
            return (dx === 0 || dy === 0) && isPathClear(from, to);
        case 'knight':
            return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
        case 'bishop':
            return dx === dy && isPathClear(from, to);
        case 'queen':
            return (dx === 0 || dy === 0 || dx === dy) && isPathClear(from, to);
        case 'king':
            return dx <= 1 && dy <= 1;
    }
    return false;
}

function isPathClear(from, to) {
    const dx = Math.sign(to.x - from.x);
    const dy = Math.sign(to.y - from.y);
    let x = from.x + dx;
    let y = from.y + dy;
    
    while (x !== to.x || y !== to.y) {
        if (board[y][x]) return false;
        x += dx;
        y += dy;
    }
    return true;
}

function movePiece(from, to) {
    const captured = board[to.y][to.x];
    board[to.y][to.x] = board[from.y][from.x];
    board[from.y][from.x] = null;
    
    if (captured && captured.type === 'king') {
        gameOver(currentTurn);
        return true;
    }
    return false;
}

function endTurn() {
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    turnCount++;
    
    updateZoneControl();
    generateFI();
    updateUI();
    
    if (isKingInCheck(currentTurn)) {
        showCheckAlert(currentTurn);
    }
    
    if (gameMode === 'ai' && currentTurn === 'black') {
        setTimeout(makeAIMove, 500);
    }
}

function updateZoneControl() {
    zones.forEach(zone => {
        let white = 0, black = 0;
        zone.squares.forEach(([y, x]) => {
            const piece = board[y][x];
            if (piece) {
                if (piece.color === 'white') white++;
                else black++;
            }
        });
        zone.control = white > black ? 'white' : black > white ? 'black' : 'neutral';
    });
}

function generateFI() {
    const whiteZones = zones.filter(z => z.control === 'white').length;
    const blackZones = zones.filter(z => z.control === 'black').length;
    
    whiteFI += whiteZones;
    blackFI += blackZones;
}

function useExtraMove(color) {
    if (color !== currentTurn) return;
    const fi = color === 'white' ? whiteFI : blackFI;
    
    if (fi >= 2) {
        if (color === 'white') whiteFI -= 2;
        else blackFI -= 2;
        extraMoveUsed = true;
        updateUI();
        showNotification('⚡ Movimento extra ativado!');
    }
}

function updateUI() {
    document.getElementById('whiteFI').textContent = whiteFI;
    document.getElementById('blackFI').textContent = blackFI;
    document.getElementById('whiteZones').textContent = zones.filter(z => z.control === 'white').length;
    document.getElementById('blackZones').textContent = zones.filter(z => z.control === 'black').length;
    
    const whitePieces = board.flat().filter(p => p && p.color === 'white').length;
    const blackPieces = board.flat().filter(p => p && p.color === 'black').length;
    document.getElementById('whitePieces').textContent = whitePieces;
    document.getElementById('blackPieces').textContent = blackPieces;
    
    document.getElementById('turnIndicator').textContent = `Turno: ${currentTurn === 'white' ? 'Brancas' : 'Pretas'}`;
    
    document.getElementById('whiteExtraMove').disabled = currentTurn !== 'white' || whiteFI < 2;
    document.getElementById('blackExtraMove').disabled = currentTurn !== 'black' || blackFI < 2;
    
    const zonesHTML = zones.map(z => `
        <div class="zone-item ${z.control}">
            <strong>${z.name}</strong><br>
            <small>${z.control === 'neutral' ? 'Neutro' : z.control === 'white' ? 'Brancas' : 'Pretas'}</small>
        </div>
    `).join('');
    document.getElementById('zonesControl').innerHTML = zonesHTML;
}

function render() {
    // Board
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#ecf0f1' : '#34495e';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            
            // Zone highlights
            zones.forEach(zone => {
                if (zone.squares.some(([zy, zx]) => zx === x && zy === y)) {
                    ctx.fillStyle = zone.control === 'white' ? 'rgba(52,152,219,0.3)' : 
                                   zone.control === 'black' ? 'rgba(231,76,60,0.3)' : 
                                   'rgba(149,165,166,0.2)';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            });
        }
    }
    
    // Selected piece
    if (selectedPiece) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 4;
        ctx.strokeRect(selectedPiece.x * TILE_SIZE, selectedPiece.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    
    // Pieces
    ctx.font = `${TILE_SIZE * 0.7}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const piece = board[y][x];
            if (piece) {
                ctx.fillStyle = piece.color === 'white' ? '#fff' : '#000';
                ctx.strokeStyle = piece.color === 'white' ? '#000' : '#fff';
                ctx.lineWidth = 2;
                const symbol = pieces[piece.color][piece.type];
                ctx.strokeText(symbol, x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
                ctx.fillText(symbol, x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
            }
        }
    }
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.style.cssText = `position:fixed;top:20px;right:20px;background:rgba(0,0,0,0.9);color:#ffd700;padding:20px;border-radius:10px;font-size:1.2rem;z-index:3000;border:2px solid #ffd700;`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function makeAIMove() {
    const blackPieces = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const piece = board[y][x];
            if (piece && piece.color === 'black') {
                blackPieces.push({x, y, piece});
            }
        }
    }
    
    let validMoves = [];
    for (const from of blackPieces) {
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                if (isValidMove(from, {x, y})) {
                    const score = evaluateMove(from, {x, y});
                    validMoves.push({from, to: {x, y}, score});
                }
            }
        }
    }
    
    if (validMoves.length > 0) {
        let move;
        
        if (aiDifficulty === 'easy') {
            if (Math.random() < 0.5) {
                move = validMoves[Math.floor(Math.random() * validMoves.length)];
            } else {
                validMoves.sort((a, b) => b.score - a.score);
                move = validMoves[0];
            }
        } else if (aiDifficulty === 'medium') {
            validMoves.sort((a, b) => b.score - a.score);
            const topMoves = validMoves.slice(0, 3);
            move = topMoves[Math.floor(Math.random() * topMoves.length)];
        } else {
            validMoves.sort((a, b) => b.score - a.score);
            move = validMoves[0];
        }
        
        const gameEnded = movePiece(move.from, move.to);
        render();
        
        if (!gameEnded) {
            endTurn();
        }
    }
}

function evaluateMove(from, to) {
    let score = 0;
    const piece = board[from.y][from.x];
    const target = board[to.y][to.x];
    
    // Valores das peças
    const pieceValues = {
        pawn: 10,
        knight: 30,
        bishop: 30,
        rook: 50,
        queen: 90,
        king: 1000
    };
    
    // Simular movimento para avaliar posição resultante
    const originalTarget = board[to.y][to.x];
    board[to.y][to.x] = piece;
    board[from.y][from.x] = null;
    
    // Captura de peças com bônus
    if (target) {
        score += pieceValues[target.type] * 15;
        // Bônus por capturar peça mais valiosa com peça menos valiosa
        if (pieceValues[piece.type] < pieceValues[target.type]) {
            score += 20;
        }
    }
    
    // Controle do centro (mais importante no meio do jogo)
    const centerDist = Math.abs(to.x - 3.5) + Math.abs(to.y - 3.5);
    score += (7 - centerDist) * 3;
    
    // Mobilidade (quantos movimentos a peça tem na nova posição)
    let mobility = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            if (isValidMove({x: to.x, y: to.y, piece}, {x, y})) {
                mobility++;
            }
        }
    }
    score += mobility * 2;
    
    // Proteção do rei
    const kingPos = findKing('black');
    if (kingPos) {
        const distToKing = Math.abs(to.x - kingPos.x) + Math.abs(to.y - kingPos.y);
        if (distToKing <= 2) score += 8;
        
        // Penalidade se o rei está exposto
        let kingThreats = 0;
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                const p = board[y][x];
                if (p && p.color === 'white' && isValidMove({x, y, piece: p}, kingPos)) {
                    kingThreats++;
                }
            }
        }
        score -= kingThreats * 15;
    }
    
    // Ameaça ao rei inimigo (muito importante)
    const enemyKing = findKing('white');
    if (enemyKing) {
        if (isValidMove({x: to.x, y: to.y, piece}, enemyKing)) {
            score += 100; // Xeque!
        }
        const distToEnemyKing = Math.abs(to.x - enemyKing.x) + Math.abs(to.y - enemyKing.y);
        if (distToEnemyKing <= 2) score += 25;
    }
    
    // Desenvolvimento de peças
    if (from.y <= 1 && to.y > 1) score += 8;
    
    // Controle de zonas (importante para recursos)
    zones.forEach(zone => {
        if (zone.squares.some(([zy, zx]) => zx === to.x && zy === to.y)) {
            score += 12;
            // Bônus extra se a zona está contestada
            if (zone.control === 'neutral') score += 5;
        }
    });
    
    // Proteção mútua (peças protegendo outras)
    let protectedPieces = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const p = board[y][x];
            if (p && p.color === 'black' && isValidMove({x: to.x, y: to.y, piece}, {x, y})) {
                protectedPieces++;
            }
        }
    }
    score += protectedPieces * 3;
    
    // Penalidade por deixar peça em perigo
    let threats = 0;
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const p = board[y][x];
            if (p && p.color === 'white' && isValidMove({x, y, piece: p}, {x: to.x, y: to.y})) {
                threats++;
            }
        }
    }
    score -= threats * pieceValues[piece.type] * 0.5;
    
    // Avançar peões (importante no endgame)
    if (piece.type === 'pawn') {
        score += (7 - to.y) * 3; // Quanto mais avançado, melhor
        if (to.y === 7) score += 80; // Prestes a promover!
    }
    
    // Ativar torres e rainha
    if ((piece.type === 'rook' || piece.type === 'queen') && from.y === 0) {
        score += 10;
    }
    
    // Restaurar tabuleiro
    board[from.y][from.x] = piece;
    board[to.y][to.x] = originalTarget;
    
    return score;
}

function findKing(color) {
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const piece = board[y][x];
            if (piece && piece.type === 'king' && piece.color === color) {
                return {x, y};
            }
        }
    }
    return null;
}

function isKingInCheck(color) {
    const kingPos = findKing(color);
    if (!kingPos) return false;
    
    const enemyColor = color === 'white' ? 'black' : 'white';
    
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const piece = board[y][x];
            if (piece && piece.color === enemyColor) {
                if (isValidMove({x, y, piece}, kingPos)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function showCheckAlert(color) {
    const kingPos = findKing(color);
    if (!kingPos) return;
    
    // Alerta visual no tabuleiro
    const checkOverlay = document.createElement('div');
    checkOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,0,0,0.2);
        pointer-events: none;
        z-index: 999;
        animation: checkFlash 0.5s ease-in-out 3;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes checkFlash {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(checkOverlay);
    setTimeout(() => checkOverlay.remove(), 1500);
    
    // Notificação
    showNotification(`⚠️ XEQUE! Rei ${color === 'white' ? 'Branco' : 'Preto'} em perigo!`);
    
    // Destacar rei no tabuleiro
    render();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 6;
    ctx.strokeRect(kingPos.x * TILE_SIZE, kingPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    
    ctx.fillStyle = 'rgba(255,0,0,0.3)';
    ctx.fillRect(kingPos.x * TILE_SIZE, kingPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameOver(winner) {
    canvas.removeEventListener('click', handleClick);
    
    const modal = document.createElement('div');
    modal.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);padding:40px;border-radius:20px;border:3px solid #ffd700;z-index:10001;text-align:center;color:white;min-width:400px;`;
    modal.innerHTML = `
        <h2 style="color:#ffd700;margin-bottom:20px;font-size:2.5rem;">♔ Xeque-Mate!</h2>
        <p style="margin:20px 0;font-size:1.5rem;">${winner === 'white' ? 'Brancas' : 'Pretas'} Venceram!</p>
        <p style="margin:15px 0;color:#aaa;">Turnos: ${turnCount}</p>
        <button onclick="this.parentElement.remove();document.getElementById('gameOverOverlay').remove();startGame(gameMode);" style="margin:10px;padding:15px 30px;background:#ffd700;color:#1a1a2e;border:none;border-radius:10px;font-size:1.1rem;font-weight:bold;cursor:pointer;">🔄 Jogar Novamente</button>
        <button onclick="this.parentElement.remove();document.getElementById('gameOverOverlay').remove();showMainMenu();" style="margin:10px;padding:15px 30px;background:rgba(255,215,0,0.3);color:white;border:2px solid #ffd700;border-radius:10px;font-size:1.1rem;font-weight:bold;cursor:pointer;">🏠 Menu Principal</button>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'gameOverOverlay';
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;`;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}
