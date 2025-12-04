const translations = {
    pt: {
        loading: 'Carregando',
        preparingTable: 'Preparando a mesa...',
        modeTitle: 'Modo de Jogo',
        local: 'Local (2 Jogadores)',
        vsAI: 'vs IA',
        difficultyTitle: 'Dificuldade da IA',
        easy: 'Fácil',
        medium: 'Médio',
        hard: 'Difícil',
        credits: 'Créditos',
        creditsDesc: 'Sinuca de precisão digital com física realista',
        player: 'Jogador',
        type: 'Tipo',
        solids: 'Lisas',
        stripes: 'Listradas',
        victory: 'Vitória!',
        won: 'venceu!',
        playAgain: 'Jogar Novamente',
        menu: 'Menu',
        instructions: 'Arraste para mirar • Clique para ajustar força • Use o controle de efeito',
        aiTurn: 'Vez da IA...',
        extraTurn: '🎯 Jogada Extra!',
        solidsTitle: 'Lisas',
        stripedTitle: 'Listradas',
        turnStatusLabel: 'Status'
    },
    en: {
        loading: 'Loading',
        preparingTable: 'Preparing table...',
        modeTitle: 'Game Mode',
        local: 'Local (2 Players)',
        vsAI: 'vs AI',
        difficultyTitle: 'AI Difficulty',
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        credits: 'Credits',
        creditsDesc: 'Digital precision pool with realistic physics',
        player: 'Player',
        type: 'Type',
        solids: 'Solids',
        stripes: 'Stripes',
        victory: 'Victory!',
        won: 'won!',
        playAgain: 'Play Again',
        menu: 'Menu',
        instructions: 'Drag to aim • Click to adjust power • Use spin control',
        aiTurn: 'AI Turn...',
        extraTurn: '🎯 Extra Turn!',
        solidsTitle: 'Solids',
        stripedTitle: 'Stripes',
        turnStatusLabel: 'Status'
    },
    es: {
        loading: 'Cargando',
        preparingTable: 'Preparando la mesa...',
        modeTitle: 'Modo de Juego',
        local: 'Local (2 Jugadores)',
        vsAI: 'vs IA',
        difficultyTitle: 'Dificultad de la IA',
        easy: 'Fácil',
        medium: 'Medio',
        hard: 'Difícil',
        credits: 'Créditos',
        creditsDesc: 'Billar de precisión digital con física realista',
        player: 'Jugador',
        type: 'Tipo',
        solids: 'Lisas',
        stripes: 'Rayadas',
        victory: '¡Victoria!',
        won: 'ganó!',
        playAgain: 'Jugar de Nuevo',
        menu: 'Menú',
        instructions: 'Arrastra para apuntar • Clic para ajustar fuerza • Usa control de efecto',
        aiTurn: 'Turno de la IA...',
        extraTurn: '🎯 ¡Turno Extra!',
        solidsTitle: 'Lisas',
        stripedTitle: 'Rayadas',
        turnStatusLabel: 'Estado'
    }
};

let currentLang = localStorage.getItem('neopoolLang') || 'pt';

function t(key) {
    return translations[currentLang][key] || key;
}

function changeGameLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('neopoolLang', lang);
    updateGameLanguage();
}

function updateGameLanguage() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    const elements = {
        loadingTitle: 'loading',
        loadingText: 'preparingTable',
        modeTitle: 'modeTitle',
        difficultyTitle: 'difficultyTitle',
        creditsText: 'credits',
        creditsDesc: 'creditsDesc',
        playerLabel: 'player',
        typeLabel: 'type',
        victoryText: 'victory',
        winnerLabel: 'player',
        wonText: 'won',
        playAgainBtn: 'playAgain',
        menuBtn: 'menu',
        instructions: 'instructions',
        solidsTitle: 'solidsTitle',
        stripedTitle: 'stripedTitle',
        turnStatusLabel: 'turnStatusLabel'
    };

    Object.entries(elements).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t(key);
    });

    const localBtn = document.getElementById('localBtn');
    const aiBtn = document.getElementById('aiBtn');
    if (localBtn) localBtn.innerHTML = '👥 ' + t('local');
    if (aiBtn) aiBtn.innerHTML = '🤖 ' + t('vsAI');

    document.querySelectorAll('.difficulty').forEach(btn => {
        const diff = btn.dataset.difficulty;
        const emoji = diff === 'easy' ? '😊' : diff === 'medium' ? '😐' : '😤';
        btn.textContent = emoji + ' ' + t(diff);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => changeGameLanguage(btn.dataset.lang));
    });
    updateGameLanguage();
});
