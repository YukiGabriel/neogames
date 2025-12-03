// Sistema de tradução para Local Chess
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    loading: 'Carregando...',
    local2p: '👥 Local (2 Jogadores)',
    vsAI: '🤖 vs IA',
    credits: 'ℹ️ Créditos',
    chooseDifficulty: '🎯 Escolha a Dificuldade',
    easy: '😊 Fácil',
    medium: '😐 Médio',
    hard: '😈 Difícil',
    back: '⬅️ Voltar',
    menu: '🏠 Menu',
    whitePlayer: '⚔️ Jogador Branco',
    blackPlayer: '⚔️ Jogador Preto',
    white: 'Brancas',
    black: 'Pretas',
    turn: 'Turno',
    tokens: 'Fichas',
    zones: 'Zonas',
    pieces: 'Peças',
    extraMove: '⚡ Movimento Extra (2 FI)',
    zoneControl: '🗺️ Controle de Zonas',
    center: 'Centro',
    north: 'Norte',
    south: 'Sul',
    east: 'Leste',
    west: 'Oeste'
  },
  en: {
    loading: 'Loading...',
    local2p: '👥 Local (2 Players)',
    vsAI: '🤖 vs AI',
    credits: 'ℹ️ Credits',
    chooseDifficulty: '🎯 Choose Difficulty',
    easy: '😊 Easy',
    medium: '😐 Medium',
    hard: '😈 Hard',
    back: '⬅️ Back',
    menu: '🏠 Menu',
    whitePlayer: '⚔️ White Player',
    blackPlayer: '⚔️ Black Player',
    white: 'White',
    black: 'Black',
    turn: 'Turn',
    tokens: 'Tokens',
    zones: 'Zones',
    pieces: 'Pieces',
    extraMove: '⚡ Extra Move (2 FI)',
    zoneControl: '🗺️ Zone Control',
    center: 'Center',
    north: 'North',
    south: 'South',
    east: 'East',
    west: 'West'
  },
  es: {
    loading: 'Cargando...',
    local2p: '👥 Local (2 Jugadores)',
    vsAI: '🤖 vs IA',
    credits: 'ℹ️ Créditos',
    chooseDifficulty: '🎯 Elige Dificultad',
    easy: '😊 Fácil',
    medium: '😐 Medio',
    hard: '😈 Difícil',
    back: '⬅️ Volver',
    menu: '🏠 Menú',
    whitePlayer: '⚔️ Jugador Blanco',
    blackPlayer: '⚔️ Jugador Negro',
    white: 'Blancas',
    black: 'Negras',
    turn: 'Turno',
    tokens: 'Fichas',
    zones: 'Zonas',
    pieces: 'Piezas',
    extraMove: '⚡ Movimiento Extra (2 FI)',
    zoneControl: '🗺️ Control de Zonas',
    center: 'Centro',
    north: 'Norte',
    south: 'Sur',
    east: 'Este',
    west: 'Oeste'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const loadingText = document.querySelector('.loading-text');
  if (loadingText) loadingText.textContent = t('loading');
  
  const menuBtns = document.querySelectorAll('#mainMenu .main-menu-btn');
  if (menuBtns[0]) menuBtns[0].textContent = t('local2p');
  if (menuBtns[1]) menuBtns[1].textContent = t('vsAI');
  if (menuBtns[2]) menuBtns[2].textContent = t('credits');
  
  const diffTitle = document.querySelector('#difficultyMenu .main-menu-title');
  if (diffTitle) diffTitle.textContent = t('chooseDifficulty');
  
  const diffBtns = document.querySelectorAll('#difficultyMenu .main-menu-btn');
  if (diffBtns[0]) diffBtns[0].textContent = t('easy');
  if (diffBtns[1]) diffBtns[1].textContent = t('medium');
  if (diffBtns[2]) diffBtns[2].textContent = t('hard');
  if (diffBtns[3]) diffBtns[3].textContent = t('back');
  
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) menuBtn.textContent = t('menu');
  
  const panelTitles = document.querySelectorAll('.panel-title');
  if (panelTitles[0]) panelTitles[0].textContent = t('whitePlayer');
  if (panelTitles[1]) panelTitles[1].textContent = t('blackPlayer');
  if (panelTitles[2]) panelTitles[2].textContent = t('zoneControl');
  
  const leftStatLabels = document.querySelectorAll('.left-panel .stat-label');
  if (leftStatLabels[0]) leftStatLabels[0].textContent = t('tokens') + ' (FI)';
  if (leftStatLabels[1]) leftStatLabels[1].textContent = t('zones');
  if (leftStatLabels[2]) leftStatLabels[2].textContent = t('pieces');
  
  const rightStatLabels = document.querySelectorAll('.right-panel .stat-item .stat-label');
  if (rightStatLabels[0]) rightStatLabels[0].textContent = t('tokens') + ' (FI)';
  if (rightStatLabels[1]) rightStatLabels[1].textContent = t('zones');
  if (rightStatLabels[2]) rightStatLabels[2].textContent = t('pieces');
  
  const turnIndicator = document.querySelector('#turnIndicator');
  if (turnIndicator) {
    const isBrancas = turnIndicator.textContent.includes('Brancas');
    turnIndicator.textContent = t('turn') + ': ' + (isBrancas ? t('white') : t('black'));
  }
  
  const whiteExtraMove = document.querySelector('#whiteExtraMove');
  if (whiteExtraMove) whiteExtraMove.textContent = t('extraMove');
  
  const blackExtraMove = document.querySelector('#blackExtraMove');
  if (blackExtraMove) blackExtraMove.textContent = t('extraMove');
  
  const zoneItems = document.querySelectorAll('.zone-item');
  zoneItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes('centro') || text.includes('center')) {
      const parts = item.textContent.split(':');
      if (parts.length > 1) item.textContent = t('center') + ':' + parts[1];
    }
    if (text.includes('norte') || text.includes('north')) {
      const parts = item.textContent.split(':');
      if (parts.length > 1) item.textContent = t('north') + ':' + parts[1];
    }
    if (text.includes('sul') || text.includes('south') || text.includes('sur')) {
      const parts = item.textContent.split(':');
      if (parts.length > 1) item.textContent = t('south') + ':' + parts[1];
    }
    if (text.includes('leste') || text.includes('east') || text.includes('este')) {
      const parts = item.textContent.split(':');
      if (parts.length > 1) item.textContent = t('east') + ':' + parts[1];
    }
    if (text.includes('oeste') || text.includes('west')) {
      const parts = item.textContent.split(':');
      if (parts.length > 1) item.textContent = t('west') + ':' + parts[1];
    }
  });
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
