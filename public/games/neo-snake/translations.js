// Sistema de tradução para NeoSnake
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    score: 'Pontuação',
    highScore: 'Recorde',
    gameOver: 'Fim de Jogo',
    pressSpace: 'Pressione ESPAÇO para reiniciar',
    dash: 'Dash',
    shield: 'Escudo',
    magnet: 'Ímã',
    language: 'Idioma / Language'
  },
  en: {
    score: 'Score',
    highScore: 'High Score',
    gameOver: 'Game Over',
    pressSpace: 'Press SPACE to restart',
    dash: 'Dash',
    shield: 'Shield',
    magnet: 'Magnet',
    language: 'Language / Idioma'
  },
  es: {
    score: 'Puntuación',
    highScore: 'Récord',
    gameOver: 'Fin del Juego',
    pressSpace: 'Presiona ESPACIO para reiniciar',
    dash: 'Dash',
    shield: 'Escudo',
    magnet: 'Imán',
    language: 'Idioma / Language'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  // Atualizar textos do jogo
  const scoreLabel = document.querySelector('[style*="Pontuação"]');
  if (scoreLabel) scoreLabel.textContent = t('score') + ':';
  
  const highScoreLabel = document.querySelector('[style*="Recorde"]');
  if (highScoreLabel) highScoreLabel.textContent = t('highScore') + ':';
}

function changeGameLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gameLang', lang);
  updateGameLanguage();
  
  document.querySelectorAll('[id^="lang"]').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById('lang' + lang.toUpperCase());
  if (btn) btn.classList.add('active');
}

window.addEventListener('load', () => {
  setTimeout(() => {
    updateGameLanguage();
    const langBtn = document.getElementById('lang' + currentLang.toUpperCase());
    if (langBtn) langBtn.classList.add('active');
  }, 100);
});
