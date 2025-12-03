// Sistema de tradução para Code Recall
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    loading: 'Carregando...',
    play: '▶️ Jogar',
    credits: 'ℹ️ Créditos',
    menu: '🏠 Menu',
    sequence: 'Sequência',
    level: 'Nível',
    grid: 'Grade',
    colors: 'cores',
    getReady: 'Prepare-se...',
    watchSequence: 'Observe a sequência',
    yourTurn: 'Sua vez! Repita a sequência',
    gameOver: '💀 Game Over',
    finalSequence: 'Sequência Final',
    playAgain: '🔄 Jogar Novamente',
    mainMenu: '🏠 Menu Principal'
  },
  en: {
    loading: 'Loading...',
    play: '▶️ Play',
    credits: 'ℹ️ Credits',
    menu: '🏠 Menu',
    sequence: 'Sequence',
    level: 'Level',
    grid: 'Grid',
    colors: 'colors',
    getReady: 'Get ready...',
    watchSequence: 'Watch the sequence',
    yourTurn: 'Your turn! Repeat the sequence',
    gameOver: '💀 Game Over',
    finalSequence: 'Final Sequence',
    playAgain: '🔄 Play Again',
    mainMenu: '🏠 Main Menu'
  },
  es: {
    loading: 'Cargando...',
    play: '▶️ Jugar',
    credits: 'ℹ️ Créditos',
    menu: '🏠 Menú',
    sequence: 'Secuencia',
    level: 'Nivel',
    grid: 'Cuadrícula',
    colors: 'colores',
    getReady: 'Prepárate...',
    watchSequence: 'Observa la secuencia',
    yourTurn: '¡Tu turno! Repite la secuencia',
    gameOver: '💀 Fin del Juego',
    finalSequence: 'Secuencia Final',
    playAgain: '🔄 Jugar de Nuevo',
    mainMenu: '🏠 Menú Principal'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const loadingText = document.querySelector('.loading-text');
  if (loadingText) loadingText.textContent = t('loading');
  
  const playBtn = document.querySelector('.main-menu-btn.primary');
  if (playBtn) playBtn.textContent = t('play');
  
  const creditsBtn = document.querySelectorAll('.main-menu-btn')[1];
  if (creditsBtn) creditsBtn.textContent = t('credits');
  
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) menuBtn.textContent = t('menu');
  
  const scoreLabel = document.querySelector('.score-label');
  if (scoreLabel) scoreLabel.textContent = t('sequence');
  
  const statusText = document.querySelector('#statusText');
  if (statusText) {
    const text = statusText.textContent;
    if (text.includes('Prepare') || text.includes('Get ready') || text.includes('Prepárate')) {
      statusText.textContent = t('getReady');
    } else if (text.includes('Observe') || text.includes('Watch') || text.includes('Observa')) {
      statusText.textContent = t('watchSequence');
    } else if (text.includes('Sua vez') || text.includes('Your turn') || text.includes('Tu turno')) {
      statusText.textContent = t('yourTurn');
    }
  }
  
  const levelIndicator = document.querySelector('#levelIndicator');
  if (levelIndicator) {
    const match = levelIndicator.textContent.match(/\d+x\d+/);
    const colorMatch = levelIndicator.textContent.match(/\d+(?= cores| colors| colores)/);
    if (match && colorMatch) {
      levelIndicator.textContent = t('grid') + ': ' + match[0] + ' (' + colorMatch[0] + ' ' + t('colors') + ')';
    } else if (match) {
      levelIndicator.textContent = t('grid') + ': ' + match[0];
    }
  }
  
  const gameOverTitle = document.querySelector('.modal-title');
  if (gameOverTitle) gameOverTitle.textContent = t('gameOver');
  
  const modalScore = document.querySelector('.modal-score');
  if (modalScore) modalScore.innerHTML = t('finalSequence') + ': <span id="finalScore">' + (document.querySelector('#finalScore')?.textContent || '0') + '</span>';
  
  const modalBtns = document.querySelectorAll('.modal-btn');
  if (modalBtns[0]) modalBtns[0].textContent = t('playAgain');
  if (modalBtns[1]) modalBtns[1].textContent = t('mainMenu');
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
