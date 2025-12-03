// Sistema de tradução para NeoGoal
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    loading: 'Carregando...',
    you: 'Você',
    ai: 'IA',
    yourTurn: 'SEU TURNO',
    selectClass: '⚽ Escolha sua Classe',
    accelerator: '⚡ Acelerador',
    acceleratorDesc: '+15% velocidade após ricochete. Estilo arriscado e imprevisível.',
    tank: '🛡️ Tanque',
    tankDesc: 'Para 20% mais rápido. Controle e defesa estratégica.',
    tactical: '🎯 Tático',
    tacticalDesc: 'Mira 50% mais longa. Precisão e planejamento.',
    gameMode: '🎮 Modo de Jogo',
    vsAI: '🤖 vs IA',
    vsAIDesc: 'Jogue contra a inteligência artificial. Escolha a dificuldade.',
    twoPlayers: '👥 2 Jogadores',
    twoPlayersDesc: 'Jogue localmente com um amigo. Turnos alternados.',
    aiDifficulty: '🎯 Dificuldade da IA',
    easy: '🟢 Fácil',
    easyDesc: 'IA com 65% precisão. Ideal para iniciantes.',
    medium: '🟡 Médio',
    mediumDesc: 'IA com 80% precisão. Desafio equilibrado.',
    hard: '🟠 Difícil',
    hardDesc: 'IA com 92% precisão. Para jogadores experientes.',
    expert: '🔴 Expert',
    expertDesc: 'IA com 98% precisão. Desafio extremo!',
    victory: '🏆 Vitória!',
    score: 'Placar',
    playAgain: '🔄 Jogar Novamente',
    menu: '🏠 Menu'
  },
  en: {
    loading: 'Loading...',
    you: 'You',
    ai: 'AI',
    yourTurn: 'YOUR TURN',
    selectClass: '⚽ Select Your Class',
    accelerator: '⚡ Accelerator',
    acceleratorDesc: '+15% speed after bounce. Risky and unpredictable style.',
    tank: '🛡️ Tank',
    tankDesc: 'Stops 20% faster. Strategic control and defense.',
    tactical: '🎯 Tactical',
    tacticalDesc: '50% longer aim. Precision and planning.',
    gameMode: '🎮 Game Mode',
    vsAI: '🤖 vs AI',
    vsAIDesc: 'Play against artificial intelligence. Choose difficulty.',
    twoPlayers: '👥 2 Players',
    twoPlayersDesc: 'Play locally with a friend. Alternating turns.',
    aiDifficulty: '🎯 AI Difficulty',
    easy: '🟢 Easy',
    easyDesc: 'AI with 65% accuracy. Ideal for beginners.',
    medium: '🟡 Medium',
    mediumDesc: 'AI with 80% accuracy. Balanced challenge.',
    hard: '🟠 Hard',
    hardDesc: 'AI with 92% accuracy. For experienced players.',
    expert: '🔴 Expert',
    expertDesc: 'AI with 98% accuracy. Extreme challenge!',
    victory: '🏆 Victory!',
    score: 'Score',
    playAgain: '🔄 Play Again',
    menu: '🏠 Menu'
  },
  es: {
    loading: 'Cargando...',
    you: 'Tú',
    ai: 'IA',
    yourTurn: 'TU TURNO',
    selectClass: '⚽ Elige tu Clase',
    accelerator: '⚡ Acelerador',
    acceleratorDesc: '+15% velocidad después del rebote. Estilo arriesgado e impredecible.',
    tank: '🛡️ Tanque',
    tankDesc: 'Para 20% más rápido. Control y defensa estratégica.',
    tactical: '🎯 Táctico',
    tacticalDesc: 'Puntero 50% más largo. Precisión y planificación.',
    gameMode: '🎮 Modo de Juego',
    vsAI: '🤖 vs IA',
    vsAIDesc: 'Juega contra la inteligencia artificial. Elige dificultad.',
    twoPlayers: '👥 2 Jugadores',
    twoPlayersDesc: 'Juega localmente con un amigo. Turnos alternados.',
    aiDifficulty: '🎯 Dificultad de la IA',
    easy: '🟢 Fácil',
    easyDesc: 'IA con 65% precisión. Ideal para principiantes.',
    medium: '🟡 Medio',
    mediumDesc: 'IA con 80% precisión. Desafío equilibrado.',
    hard: '🟠 Difícil',
    hardDesc: 'IA con 92% precisión. Para jugadores experimentados.',
    expert: '🔴 Experto',
    expertDesc: 'IA con 98% precisión. ¡Desafío extremo!',
    victory: '🏆 ¡Victoria!',
    score: 'Marcador',
    playAgain: '🔄 Jugar de Nuevo',
    menu: '🏠 Menú'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const loadingText = document.querySelector('.loadingText');
  if (loadingText) loadingText.textContent = t('loading');
  
  const classSelectTitle = document.querySelector('#classSelect h2');
  if (classSelectTitle) classSelectTitle.textContent = t('selectClass');
  
  const classCards = document.querySelectorAll('#classSelect .classCard');
  if (classCards[0]) {
    classCards[0].querySelector('h3').textContent = t('accelerator');
    classCards[0].querySelector('p').textContent = t('acceleratorDesc');
  }
  if (classCards[1]) {
    classCards[1].querySelector('h3').textContent = t('tank');
    classCards[1].querySelector('p').textContent = t('tankDesc');
  }
  if (classCards[2]) {
    classCards[2].querySelector('h3').textContent = t('tactical');
    classCards[2].querySelector('p').textContent = t('tacticalDesc');
  }
  
  const modeSelectTitle = document.querySelector('#modeSelect h2');
  if (modeSelectTitle) modeSelectTitle.textContent = t('gameMode');
  
  const modeCards = document.querySelectorAll('#modeSelect .classCard');
  if (modeCards[0]) {
    modeCards[0].querySelector('h3').textContent = t('vsAI');
    modeCards[0].querySelector('p').textContent = t('vsAIDesc');
  }
  if (modeCards[1]) {
    modeCards[1].querySelector('h3').textContent = t('twoPlayers');
    modeCards[1].querySelector('p').textContent = t('twoPlayersDesc');
  }
  
  const diffSelectTitle = document.querySelector('#difficultySelect h2');
  if (diffSelectTitle) diffSelectTitle.textContent = t('aiDifficulty');
  
  const diffCards = document.querySelectorAll('#difficultySelect .classCard');
  if (diffCards[0]) {
    diffCards[0].querySelector('h3').textContent = t('easy');
    diffCards[0].querySelector('p').textContent = t('easyDesc');
  }
  if (diffCards[1]) {
    diffCards[1].querySelector('h3').textContent = t('medium');
    diffCards[1].querySelector('p').textContent = t('mediumDesc');
  }
  if (diffCards[2]) {
    diffCards[2].querySelector('h3').textContent = t('hard');
    diffCards[2].querySelector('p').textContent = t('hardDesc');
  }
  if (diffCards[3]) {
    diffCards[3].querySelector('h3').textContent = t('expert');
    diffCards[3].querySelector('p').textContent = t('expertDesc');
  }
  
  const uiLabels = document.querySelectorAll('#ui .stat > div:first-child');
  if (uiLabels[0]) uiLabels[0].textContent = t('you');
  if (uiLabels[1]) uiLabels[1].textContent = t('ai');
  
  const turnIndicator = document.querySelector('#turnIndicator');
  if (turnIndicator) turnIndicator.textContent = t('yourTurn');
  
  const gameOverTitle = document.querySelector('#gameOver h2');
  if (gameOverTitle) gameOverTitle.textContent = t('victory');
  
  const gameOverScore = document.querySelector('#gameOver p');
  if (gameOverScore) {
    const scoreText = document.querySelector('#finalScore')?.textContent || '0 - 0';
    gameOverScore.innerHTML = t('score') + ': <span id="finalScore">' + scoreText + '</span>';
  }
  
  const gameOverBtns = document.querySelectorAll('#gameOver .btn');
  if (gameOverBtns[0]) gameOverBtns[0].textContent = t('playAgain');
  if (gameOverBtns[1]) gameOverBtns[1].textContent = t('menu');
}

function changeGameLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gameLang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(lang.toUpperCase())) btn.classList.add('active');
  });
  updateGameLanguage();
}

window.addEventListener('load', () => {
  setTimeout(() => {
    updateGameLanguage();
    const langBtn = document.getElementById('lang' + currentLang.toUpperCase());
    if (langBtn) langBtn.classList.add('active');
  }, 100);
});
