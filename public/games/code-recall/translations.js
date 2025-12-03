// Sistema de tradução para Code Recall
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    level: 'Nível',
    watch: 'Observe',
    yourTurn: 'Sua vez',
    gameOver: 'Fim de Jogo',
    finalScore: 'Pontuação Final',
    playAgain: 'Jogar Novamente',
    language: 'Idioma / Language'
  },
  en: {
    level: 'Level',
    watch: 'Watch',
    yourTurn: 'Your Turn',
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    playAgain: 'Play Again',
    language: 'Language / Idioma'
  },
  es: {
    level: 'Nivel',
    watch: 'Observa',
    yourTurn: 'Tu Turno',
    gameOver: 'Fin del Juego',
    finalScore: 'Puntuación Final',
    playAgain: 'Jugar de Nuevo',
    language: 'Idioma / Language'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const levelLabel = document.querySelector('[style*="Nível"]');
  if (levelLabel) levelLabel.textContent = t('level') + ':';
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
