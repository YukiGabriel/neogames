// Sistema de tradução para Patience
let currentLang = localStorage.getItem('gameLang') || 'pt';

const translations = {
  pt: {
    loading: 'Carregando...',
    time: 'Tempo',
    best: 'Melhor',
    stability: 'Estabilidade',
    streak: 'Sequência',
    fragments: 'Fragmentos',
    hold: 'Pressione e segure para estabilizar o núcleo',
    instructions: 'Mantenha-o no centro pelo maior tempo possível',
    gameOver: '💫 Fim da Estabilidade',
    tryAgain: '🔄 Tentar Novamente',
    newRecord: '🎉 Novo Recorde!'
  },
  en: {
    loading: 'Loading...',
    time: 'Time',
    best: 'Best',
    stability: 'Stability',
    streak: 'Streak',
    fragments: 'Fragments',
    hold: 'Press and hold to stabilize the core',
    instructions: 'Keep it centered as long as possible',
    gameOver: '💫 Stability Lost',
    tryAgain: '🔄 Try Again',
    newRecord: '🎉 New Record!'
  },
  es: {
    loading: 'Cargando...',
    time: 'Tiempo',
    best: 'Mejor',
    stability: 'Estabilidad',
    streak: 'Racha',
    fragments: 'Fragmentos',
    hold: 'Presiona y mantén para estabilizar el núcleo',
    instructions: 'Manténlo centrado el mayor tiempo posible',
    gameOver: '💫 Estabilidad Perdida',
    tryAgain: '🔄 Intentar de Nuevo',
    newRecord: '¡Nuevo Récord!'
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function updateGameLanguage() {
  const loadingText = document.querySelector('.loadingText');
  if (loadingText) loadingText.textContent = t('loading');
  
  const labels = document.querySelectorAll('#ui .stat > div:first-child');
  if (labels[0]) labels[0].textContent = t('time');
  if (labels[1]) labels[1].textContent = t('best');
  if (labels[2]) labels[2].textContent = t('stability');
  
  const streak = document.querySelector('#streak');
  if (streak) streak.innerHTML = '🔥 ' + t('streak') + ': <span id="streakValue">' + (document.querySelector('#streakValue')?.textContent || '0') + '</span>';
  
  const instructions = document.querySelector('#instructions');
  if (instructions) instructions.innerHTML = t('hold') + '<br>' + t('instructions');
  
  const gameOverTitle = document.querySelector('#gameOver h2');
  if (gameOverTitle) gameOverTitle.textContent = t('gameOver');
  
  const btnRestart = document.querySelector('#gameOver .btn');
  if (btnRestart) btnRestart.textContent = t('tryAgain');
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
