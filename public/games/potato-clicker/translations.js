// Sistema de tradução para Potato Clicker
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    potatoes: 'batatas',
    perSecond: '/seg',
    menu: 'Menu',
    play: 'Jogar',
    credits: 'Créditos',
    loading: 'Carregando...',
    saveGame: 'Salvar Jogo',
    saved: 'Salvo!',
    upgrades: 'Upgrades',
    skins: 'Skins',
    achievements: 'Conquistas',
    leaderboard: 'Placar Local',
    globalLeaderboard: 'Placar Global',
    stats: 'Estatísticas',
    prestige: 'Prestígio',
    settings: 'Personalização',
    yourName: 'Seu Nome:',
    edit: 'Editar',
    playersFromAllDevices: 'Jogadores de todos os dispositivos',
    currentMultiplier: 'Multiplicador Atual',
    nextPrestige: 'Próximo Prestígio:',
    prestigeBtn: 'PRESTÍGIO',
    prestigeRequires: '(Requer 10.000.000 batatas)',
    themes: 'Temas',
    language: 'Idioma / Language',
    purple: 'Roxo',
    blue: 'Azul',
    green: 'Verde',
    red: 'Vermelho',
    orange: 'Laranja',
    pink: 'Rosa',
    keybind: 'Keybind de Clique',
    keybindDesc: 'Defina uma tecla para clicar na batata sem usar o mouse',
    setKey: 'Definir Tecla',
    remove: 'Remover',
    promoCodes: 'Códigos Promocionais',
    promoDesc: 'Digite um código para resgatar recompensas',
    enterCode: 'Digite o código...',
    redeem: 'Resgatar',
    owned: 'Possui:',
    clickUpgrades: 'Upgrades de Clique',
    autoProduction: 'Produção Automática',
    multiplier: 'Multiplicador:',
    perClick: '/clique',
    noPlayers: 'Nenhum jogador ainda. Seja o primeiro!',
    loadingLeaderboard: 'Carregando placar global...',
    prestigeConfirm: 'Prestígio resetará tudo mas aumentará o multiplicador. Continuar?',
    prestigeSuccess: 'Prestígio',
    nameChanged: 'Nome alterado para:',
    keybindSet: 'Keybind definida:',
    keybindRemoved: 'Keybind removida!',
    enterName: 'Digite seu nome de jogador:',
    pressKey: 'Pressione uma tecla...',
    key: 'Tecla:',
    codeInvalid: 'Código inválido!',
    codeUsed: 'Código já usado!',
    codeEnter: 'Digite um código!',
    codeRedeemed: 'resgatado!',
    newSkin: 'Nova skin:',
    unlocked: 'Desbloqueada',
    creditsText: '🥔 Potato Clicker\n\nDesenvolvido por: NeoGames\nVersão: 1.0\n\nObrigado por jogar!',
    // Upgrades de Clique
    cursor: 'Cursor',
    ironHand: 'Mão de Ferro',
    mechanicalArm: 'Braço Mecânico',
    cyberArm: 'Braço Cibernético',
    electricPower: 'Poder Elétrico',
    flamingTouch: 'Toque Flamejante',
    diamondFinger: 'Dedo Diamante',
    divineClick: 'Clique Divino',
    cosmicClick: 'Clique Cósmico',
    royalClick: 'Clique Real',
    supremeClick: 'Clique Supremo',
    // Upgrades Automáticos
    farmer: 'Fazendeiro',
    tractor: 'Trator',
    factory: 'Fábrica',
    robot: 'Robô',
    city: 'Cidade',
    spaceship: 'Nave Espacial',
    planet: 'Planeta',
    galaxy: 'Galáxia',
    magicPortal: 'Portal Mágico',
    dimension: 'Dimensão',
    universe: 'Universo',
    multiverse: 'Multiverso',
    omniverse: 'Omniverso'
  },
  en: {
    potatoes: 'potatoes',
    perSecond: '/sec',
    menu: 'Menu',
    play: 'Play',
    credits: 'Credits',
    loading: 'Loading...',
    saveGame: 'Save Game',
    saved: 'Saved!',
    upgrades: 'Upgrades',
    skins: 'Skins',
    achievements: 'Achievements',
    leaderboard: 'Local Leaderboard',
    globalLeaderboard: 'Global Leaderboard',
    stats: 'Statistics',
    prestige: 'Prestige',
    settings: 'Settings',
    yourName: 'Your Name:',
    edit: 'Edit',
    playersFromAllDevices: 'Players from all devices',
    currentMultiplier: 'Current Multiplier',
    nextPrestige: 'Next Prestige:',
    prestigeBtn: 'PRESTIGE',
    prestigeRequires: '(Requires 10,000,000 potatoes)',
    themes: 'Themes',
    language: 'Language / Idioma',
    purple: 'Purple',
    blue: 'Blue',
    green: 'Green',
    red: 'Red',
    orange: 'Orange',
    pink: 'Pink',
    keybind: 'Click Keybind',
    keybindDesc: 'Set a key to click the potato without using the mouse',
    setKey: 'Set Key',
    remove: 'Remove',
    promoCodes: 'Promo Codes',
    promoDesc: 'Enter a code to redeem rewards',
    enterCode: 'Enter code...',
    redeem: 'Redeem',
    owned: 'Owned:',
    clickUpgrades: 'Click Upgrades',
    autoProduction: 'Auto Production',
    multiplier: 'Multiplier:',
    perClick: '/click',
    noPlayers: 'No players yet. Be the first!',
    loadingLeaderboard: 'Loading global leaderboard...',
    prestigeConfirm: 'Prestige will reset everything but increase the multiplier. Continue?',
    prestigeSuccess: 'Prestige',
    nameChanged: 'Name changed to:',
    keybindSet: 'Keybind set:',
    keybindRemoved: 'Keybind removed!',
    enterName: 'Enter your player name:',
    pressKey: 'Press a key...',
    key: 'Key:',
    codeInvalid: 'Invalid code!',
    codeUsed: 'Code already used!',
    codeEnter: 'Enter a code!',
    codeRedeemed: 'redeemed!',
    newSkin: 'New skin:',
    unlocked: 'Unlocked',
    creditsText: '🥔 Potato Clicker\n\nDeveloped by: NeoGames\nVersion: 1.0\n\nThank you for playing!',
    // Click Upgrades
    cursor: 'Cursor',
    ironHand: 'Iron Hand',
    mechanicalArm: 'Mechanical Arm',
    cyberArm: 'Cyber Arm',
    electricPower: 'Electric Power',
    flamingTouch: 'Flaming Touch',
    diamondFinger: 'Diamond Finger',
    divineClick: 'Divine Click',
    cosmicClick: 'Cosmic Click',
    royalClick: 'Royal Click',
    supremeClick: 'Supreme Click',
    // Auto Upgrades
    farmer: 'Farmer',
    tractor: 'Tractor',
    factory: 'Factory',
    robot: 'Robot',
    city: 'City',
    spaceship: 'Spaceship',
    planet: 'Planet',
    galaxy: 'Galaxy',
    magicPortal: 'Magic Portal',
    dimension: 'Dimension',
    universe: 'Universe',
    multiverse: 'Multiverse',
    omniverse: 'Omniverse'
  },
  es: {
    potatoes: 'patatas',
    perSecond: '/seg',
    menu: 'Menú',
    play: 'Jugar',
    credits: 'Créditos',
    loading: 'Cargando...',
    saveGame: 'Guardar Juego',
    saved: '¡Guardado!',
    upgrades: 'Mejoras',
    skins: 'Skins',
    achievements: 'Logros',
    leaderboard: 'Tabla Local',
    globalLeaderboard: 'Tabla Global',
    stats: 'Estadísticas',
    prestige: 'Prestigio',
    settings: 'Configuración',
    yourName: 'Tu Nombre:',
    edit: 'Editar',
    playersFromAllDevices: 'Jugadores de todos los dispositivos',
    currentMultiplier: 'Multiplicador Actual',
    nextPrestige: 'Próximo Prestigio:',
    prestigeBtn: 'PRESTIGIO',
    prestigeRequires: '(Requiere 10.000.000 patatas)',
    themes: 'Temas',
    language: 'Idioma / Language',
    purple: 'Morado',
    blue: 'Azul',
    green: 'Verde',
    red: 'Rojo',
    orange: 'Naranja',
    pink: 'Rosa',
    keybind: 'Tecla de Clic',
    keybindDesc: 'Define una tecla para hacer clic en la patata sin usar el ratón',
    setKey: 'Definir Tecla',
    remove: 'Eliminar',
    promoCodes: 'Códigos Promocionales',
    promoDesc: 'Ingresa un código para canjear recompensas',
    enterCode: 'Ingresa el código...',
    redeem: 'Canjear',
    owned: 'Posee:',
    clickUpgrades: 'Mejoras de Clic',
    autoProduction: 'Producción Automática',
    multiplier: 'Multiplicador:',
    perClick: '/clic',
    noPlayers: '¡Ningún jugador aún. Sé el primero!',
    loadingLeaderboard: 'Cargando tabla global...',
    prestigeConfirm: 'El prestigio reiniciará todo pero aumentará el multiplicador. ¿Continuar?',
    prestigeSuccess: 'Prestigio',
    nameChanged: 'Nombre cambiado a:',
    keybindSet: 'Tecla definida:',
    keybindRemoved: '¡Tecla eliminada!',
    enterName: 'Ingresa tu nombre de jugador:',
    pressKey: 'Presiona una tecla...',
    key: 'Tecla:',
    codeInvalid: '¡Código inválido!',
    codeUsed: '¡Código ya usado!',
    codeEnter: '¡Ingresa un código!',
    codeRedeemed: '¡canjeado!',
    newSkin: 'Nueva skin:',
    unlocked: 'Desbloqueada',
    creditsText: '🥔 Potato Clicker\n\nDesarrollado por: NeoGames\nVersión: 1.0\n\n¡Gracias por jugar!',
    // Mejoras de Clic
    cursor: 'Cursor',
    ironHand: 'Mano de Hierro',
    mechanicalArm: 'Brazo Mecánico',
    cyberArm: 'Brazo Cibernético',
    electricPower: 'Poder Eléctrico',
    flamingTouch: 'Toque Flamante',
    diamondFinger: 'Dedo Diamante',
    divineClick: 'Clic Divino',
    cosmicClick: 'Clic Cósmico',
    royalClick: 'Clic Real',
    supremeClick: 'Clic Supremo',
    // Mejoras Automáticas
    farmer: 'Granjero',
    tractor: 'Tractor',
    factory: 'Fábrica',
    robot: 'Robot',
    city: 'Ciudad',
    spaceship: 'Nave Espacial',
    planet: 'Planeta',
    galaxy: 'Galaxia',
    magicPortal: 'Portal Mágico',
    dimension: 'Dimensión',
    universe: 'Universo',
    multiverse: 'Multiverso',
    omniverse: 'Omniverso'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  // Atualizar textos estáticos
  if (typeof formatNumber !== 'undefined') {
    document.getElementById('count').textContent = formatNumber(potatoes) + ' ' + t('potatoes');
    document.getElementById('perSecond').textContent = formatNumber(potatoesPerSecond * prestigeMultiplier) + t('perSecond');
  }
  
  // Atualizar botões
  const saveBtn = document.querySelector('.save-btn');
  if (saveBtn) saveBtn.innerHTML = '💾 ' + t('saveGame');
  
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn) menuBtn.innerHTML = '🏠 ' + t('menu');
  
  // Atualizar menu principal
  const mainMenuBtns = document.querySelectorAll('.main-menu-btn');
  if (mainMenuBtns[0]) mainMenuBtns[0].innerHTML = '▶️ ' + t('play');
  if (mainMenuBtns[1]) mainMenuBtns[1].innerHTML = 'ℹ️ ' + t('credits');
  
  // Atualizar loading
  const loadingText = document.querySelector('.loading-text');
  if (loadingText) loadingText.textContent = t('loading');
  
  // Atualizar títulos das seções
  const sectionTitles = document.querySelectorAll('.section-title');
  const sectionData = [
    {icon: '⚡', key: 'upgrades'},
    {icon: '🎨', key: 'skins'},
    {icon: '🏆', key: 'achievements'},
    {icon: '🏆', key: 'leaderboard'},
    {icon: '📊', key: 'stats'},
    {icon: '⭐', key: 'prestige'},
    {icon: '⚙️', key: 'settings'},
    {icon: '🌍', key: 'globalLeaderboard'}
  ];
  sectionTitles.forEach((title, index) => {
    if (sectionData[index]) {
      title.innerHTML = sectionData[index].icon + ' ' + t(sectionData[index].key);
    }
  });
  
  // Atualizar prestígio
  const prestigeBtn = document.getElementById('prestigeBtn');
  if (prestigeBtn) {
    prestigeBtn.innerHTML = `⭐ ${t('prestigeBtn')} ⭐<br><span style="font-size: 0.9rem;">${t('prestigeRequires')}</span>`;
  }
  
  const currentMultText = document.querySelector('.prestige-info div:last-child');
  if (currentMultText) currentMultText.textContent = t('currentMultiplier');
  
  const nextPrestigeLabel = document.querySelector('[style*="Próximo Prestígio"]');
  if (nextPrestigeLabel) nextPrestigeLabel.textContent = t('nextPrestige');
  
  // Atualizar configurações
  const settingsHeaders = document.querySelectorAll('#settings h3');
  if (settingsHeaders[0]) settingsHeaders[0].innerHTML = '🌍 ' + t('language');
  if (settingsHeaders[1]) settingsHeaders[1].innerHTML = '🎨 ' + t('themes');
  if (settingsHeaders[2]) settingsHeaders[2].innerHTML = '⌨️ ' + t('keybind');
  if (settingsHeaders[3]) settingsHeaders[3].innerHTML = '🎫 ' + t('promoCodes');
  
  const settingsDescs = document.querySelectorAll('#settings p');
  if (settingsDescs[0]) settingsDescs[0].textContent = t('keybindDesc');
  if (settingsDescs[1]) settingsDescs[1].textContent = t('promoDesc');
  
  // Atualizar botões de tema
  const themeBtns = document.querySelectorAll('.theme-btn');
  const themeNames = ['purple', 'blue', 'green', 'red', 'orange', 'pink'];
  themeBtns.forEach((btn, i) => {
    if (i >= 3 && i < 9 && themeNames[i-3]) {
      btn.textContent = t(themeNames[i-3]);
    }
  });
  
  // Atualizar keybind buttons
  const keybindBtns = document.querySelectorAll('.keybind-btn');
  if (keybindBtns[0] && !keybindBtns[0].textContent.includes(':')) {
    keybindBtns[0].textContent = t('setKey');
  }
  if (keybindBtns[1]) keybindBtns[1].textContent = t('remove');
  if (keybindBtns[2]) keybindBtns[2].textContent = t('redeem');
  
  // Atualizar placeholder
  const codeInput = document.getElementById('codeInput');
  if (codeInput) codeInput.placeholder = t('enterCode');
  
  // Atualizar leaderboard
  const yourNameLabel = document.querySelector('[style*="Seu Nome"]');
  if (yourNameLabel) yourNameLabel.textContent = t('yourName');
  
  const editBtn = document.querySelector('[onclick="setPlayerName()"]');
  if (editBtn) editBtn.innerHTML = '✏️ ' + t('edit');
  
  const playersInfo = document.querySelector('[style*="Jogadores de todos"]');
  if (playersInfo) playersInfo.innerHTML = '🌐 ' + t('playersFromAllDevices');
  
  // Re-renderizar upgrades com tradução
  if (typeof renderUpgrades !== 'undefined') renderUpgrades();
}

// Listener para mudanças de idioma
window.addEventListener('message', (event) => {
  if (event.data.type === 'CHANGE_LANGUAGE') {
    currentLang = event.data.language;
    localStorage.setItem('gameLang', currentLang);
    updateGameLanguage();
  }
});

// Função para mudar idioma
function changeGameLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gameLang', lang);
  updateGameLanguage();
  
  // Atualizar botões ativos
  document.querySelectorAll('[id^="lang"]').forEach(btn => btn.classList.remove('active'));
  document.getElementById('lang' + lang.toUpperCase()).classList.add('active');
}

// Aplicar idioma ao carregar
window.addEventListener('load', () => {
  setTimeout(() => {
    updateGameLanguage();
    // Marcar idioma ativo
    const langBtn = document.getElementById('lang' + currentLang.toUpperCase());
    if (langBtn) langBtn.classList.add('active');
  }, 100);
});
