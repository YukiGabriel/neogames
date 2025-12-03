// Sistema de tradução para Local Chess
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    white: 'Brancas',
    black: 'Pretas',
    turn: 'Vez',
    tokens: 'Fichas',
    check: 'Xeque',
    checkmate: 'Xeque-mate',
    newGame: 'Novo Jogo',
    language: 'Idioma / Language'
  },
  en: {
    white: 'White',
    black: 'Black',
    turn: 'Turn',
    tokens: 'Tokens',
    check: 'Check',
    checkmate: 'Checkmate',
    newGame: 'New Game',
    language: 'Language / Idioma'
  },
  es: {
    white: 'Blancas',
    black: 'Negras',
    turn: 'Turno',
    tokens: 'Fichas',
    check: 'Jaque',
    checkmate: 'Jaque mate',
    newGame: 'Nuevo Juego',
    language: 'Idioma / Language'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const turnLabel = document.querySelector('[style*="Vez"]');
  if (turnLabel) turnLabel.textContent = t('turn') + ':';
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
