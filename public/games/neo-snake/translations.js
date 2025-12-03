// Sistema de tradução para NeoSnake
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    loading: 'Carregando...',
    play: '▶️ Jogar',
    credits: 'ℹ️ Créditos',
    menu: '🏠 Menu',
    score: 'Pontuação',
    length: 'Tamanho',
    level: 'Nível',
    xp: 'XP',
    abilities: '⚡ Habilidades',
    dash: 'Dash',
    shield: 'Escudo',
    magnet: 'Ímã',
    gameOver: '💀 Game Over',
    finalScore: 'Pontuação',
    finalLength: 'Tamanho',
    xpGained: 'XP Ganho',
    playAgain: '🔄 Jogar Novamente',
    mainMenu: '🏠 Menu Principal'
  },
  en: {
    loading: 'Loading...',
    play: '▶️ Play',
    credits: 'ℹ️ Credits',
    menu: '🏠 Menu',
    score: 'Score',
    length: 'Length',
    level: 'Level',
    xp: 'XP',
    abilities: '⚡ Abilities',
    dash: 'Dash',
    shield: 'Shield',
    magnet: 'Magnet',
    gameOver: '💀 Game Over',
    finalScore: 'Score',
    finalLength: 'Length',
    xpGained: 'XP Gained',
    playAgain: '🔄 Play Again',
    mainMenu: '🏠 Main Menu'
  },
  es: {
    loading: 'Cargando...',
    play: '▶️ Jugar',
    credits: 'ℹ️ Créditos',
    menu: '🏠 Menú',
    score: 'Puntuación',
    length: 'Tamaño',
    level: 'Nivel',
    xp: 'XP',
    abilities: '⚡ Habilidades',
    dash: 'Impulso',
    shield: 'Escudo',
    magnet: 'Imán',
    gameOver: '💀 Fin del Juego',
    finalScore: 'Puntuación',
    finalLength: 'Tamaño',
    xpGained: 'XP Ganado',
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
  
  const labels = document.querySelectorAll('.hud-item .hud-label');
  if (labels[0]) labels[0].textContent = t('score');
  if (labels[1]) labels[1].textContent = t('length');
  if (labels[2]) labels[2].textContent = t('level');
  if (labels[3]) labels[3].textContent = t('xp');
  
  const abilityTitle = document.querySelector('.ability-title');
  if (abilityTitle) abilityTitle.textContent = t('abilities');
  
  const dashBtn = document.querySelector('#dashBtn');
  const shieldBtn = document.querySelector('#shieldBtn');
  const magnetBtn = document.querySelector('#magnetBtn');
  if (dashBtn) dashBtn.innerHTML = '🚀 ' + t('dash') + '<span class="ability-cooldown" id="dashCooldown"></span>';
  if (shieldBtn) shieldBtn.innerHTML = '🛡️ ' + t('shield') + '<span class="ability-cooldown" id="shieldCooldown"></span>';
  if (magnetBtn) magnetBtn.innerHTML = '🧲 ' + t('magnet') + '<span class="ability-cooldown" id="magnetCooldown"></span>';
  
  const gameOverTitle = document.querySelector('.modal-title');
  if (gameOverTitle) gameOverTitle.textContent = t('gameOver');
  
  const modalStats = document.querySelectorAll('.modal-stats');
  if (modalStats[0]) modalStats[0].innerHTML = t('finalScore') + ': <span id="finalScore">' + (document.querySelector('#finalScore')?.textContent || '0') + '</span>';
  if (modalStats[1]) modalStats[1].innerHTML = t('finalLength') + ': <span id="finalLength">' + (document.querySelector('#finalLength')?.textContent || '0') + '</span>';
  if (modalStats[2]) modalStats[2].innerHTML = t('xpGained') + ': <span id="finalXP">' + (document.querySelector('#finalXP')?.textContent || '0') + '</span>';
  
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
