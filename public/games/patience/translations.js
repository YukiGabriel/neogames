// Sistema de tradução para Patience
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    time: 'Tempo',
    stability: 'Estabilidade',
    hold: 'Segure para estabilizar',
    gameOver: 'Fim de Jogo',
    newRecord: 'Novo Recorde!',
    language: 'Idioma / Language'
  },
  en: {
    time: 'Time',
    stability: 'Stability',
    hold: 'Hold to stabilize',
    gameOver: 'Game Over',
    newRecord: 'New Record!',
    language: 'Language / Idioma'
  },
  es: {
    time: 'Tiempo',
    stability: 'Estabilidad',
    hold: 'Mantén para estabilizar',
    gameOver: 'Fin del Juego',
    newRecord: '¡Nuevo Récord!',
    language: 'Idioma / Language'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const timeLabel = document.querySelector('[style*="Tempo"]');
  if (timeLabel) timeLabel.textContent = t('time') + ':';
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
