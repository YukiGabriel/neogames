// Sistema de tradução para Emoji Crush
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    loading: 'Carregando...',
    play: '▶️ Jogar',
    credits: 'ℹ️ Créditos',
    menu: '🏠 Menu',
    points: 'Pontos',
    moves: 'Movimentos',
    level: 'Nível',
    goal: 'Meta',
    coins: 'moedas',
    stars: 'estrelas',
    days: 'dias',
    fury: '⚡ FÚria',
    activateFury: '⚡ ATIVAR PODER DA FÚRIA (100%)',
    noMoves: '😢 Sem Movimentos!',
    score: 'Pontuação',
    tryAgain: '🔄 Tentar Novamente',
    nextLevel: '➡️ Próximo Nível',
    levelComplete: '🎉 Nível Completo!'
  },
  en: {
    loading: 'Loading...',
    play: '▶️ Play',
    credits: 'ℹ️ Credits',
    menu: '🏠 Menu',
    points: 'Points',
    moves: 'Moves',
    level: 'Level',
    goal: 'Goal',
    coins: 'coins',
    stars: 'stars',
    days: 'days',
    fury: '⚡ Fury',
    activateFury: '⚡ ACTIVATE FURY POWER (100%)',
    noMoves: '😢 No Moves Left!',
    score: 'Score',
    tryAgain: '🔄 Try Again',
    nextLevel: '➡️ Next Level',
    levelComplete: '🎉 Level Complete!'
  },
  es: {
    loading: 'Cargando...',
    play: '▶️ Jugar',
    credits: 'ℹ️ Créditos',
    menu: '🏠 Menú',
    points: 'Puntos',
    moves: 'Movimientos',
    level: 'Nivel',
    goal: 'Meta',
    coins: 'monedas',
    stars: 'estrellas',
    days: 'días',
    fury: '⚡ Furia',
    activateFury: '⚡ ACTIVAR PODER DE FURIA (100%)',
    noMoves: '😢 ¡Sin Movimientos!',
    score: 'Puntuación',
    tryAgain: '🔄 Intentar de Nuevo',
    nextLevel: '➡️ Siguiente Nivel',
    levelComplete: '🎉 ¡Nivel Completado!'
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
  
  const statLabels = document.querySelectorAll('.stat > div:last-child');
  if (statLabels[0]) statLabels[0].textContent = t('points');
  if (statLabels[1]) statLabels[1].textContent = t('moves');
  
  const levelTitle = document.querySelector('.level-title');
  if (levelTitle) {
    const levelNum = document.querySelector('#level')?.textContent || '1';
    levelTitle.innerHTML = t('level') + ' <span id="level">' + levelNum + '</span>';
  }
  
  const furyFill = document.querySelector('#furyFill');
  if (furyFill) furyFill.textContent = t('fury');
  
  const furyBtn = document.querySelector('#furyBtn');
  if (furyBtn) furyBtn.textContent = t('activateFury');
  
  const gameOverTitle = document.querySelector('#gameOver .modal-title');
  if (gameOverTitle) gameOverTitle.textContent = t('noMoves');
  
  const gameOverScore = document.querySelector('#gameOver .modal-score');
  if (gameOverScore) {
    const score = document.querySelector('#finalScore')?.textContent || '0';
    gameOverScore.innerHTML = t('score') + ': <span id="finalScore">' + score + '</span>';
  }
  
  const gameOverBtns = document.querySelectorAll('#gameOver .btn');
  if (gameOverBtns[0]) gameOverBtns[0].textContent = t('tryAgain');
  if (gameOverBtns[1]) gameOverBtns[1].textContent = t('nextLevel');
  
  const levelCompleteTitle = document.querySelector('#levelComplete .modal-title');
  if (levelCompleteTitle) levelCompleteTitle.textContent = t('levelComplete');
  
  const levelScoreLabel = document.querySelectorAll('#levelComplete .modal-score')[0];
  if (levelScoreLabel) {
    const score = document.querySelector('#levelScore')?.textContent || '0';
    levelScoreLabel.innerHTML = t('score') + ': <span id="levelScore">' + score + '</span>';
  }
  
  const coinsLabel = document.querySelectorAll('#levelComplete .modal-score')[1];
  if (coinsLabel) {
    const coins = document.querySelector('#coinsEarned')?.textContent || '0';
    coinsLabel.innerHTML = '💰 +<span id="coinsEarned">' + coins + '</span> ' + t('coins');
  }
  
  const nextLevelBtn = document.querySelector('#levelComplete .btn');
  if (nextLevelBtn) nextLevelBtn.textContent = t('nextLevel');
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
  }, 100);
});
