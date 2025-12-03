// Sistema de tradução para NeoGoal
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    player: 'Jogador',
    ai: 'IA',
    selectClass: 'Escolha sua Classe',
    accelerator: 'Acelerador',
    tank: 'Tanque',
    tactical: 'Tático',
    energy: 'Energia',
    goal: 'GOL!',
    win: 'Vitória!',
    lose: 'Derrota!',
    language: 'Idioma / Language'
  },
  en: {
    player: 'Player',
    ai: 'AI',
    selectClass: 'Select Your Class',
    accelerator: 'Accelerator',
    tank: 'Tank',
    tactical: 'Tactical',
    energy: 'Energy',
    goal: 'GOAL!',
    win: 'Victory!',
    lose: 'Defeat!',
    language: 'Language / Idioma'
  },
  es: {
    player: 'Jugador',
    ai: 'IA',
    selectClass: 'Elige tu Clase',
    accelerator: 'Acelerador',
    tank: 'Tanque',
    tactical: 'Táctico',
    energy: 'Energía',
    goal: '¡GOL!',
    win: '¡Victoria!',
    lose: '¡Derrota!',
    language: 'Idioma / Language'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const playerLabel = document.querySelector('[style*="Jogador"]');
  if (playerLabel) playerLabel.textContent = t('player') + ':';
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
