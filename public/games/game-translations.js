// Sistema de tradução para jogos
const gameTranslations = {
  pt: {
    // Potato Clicker
    potatoClicker: {
      title: "Potato Clicker",
      menu: "Menu",
      play: "Jogar",
      credits: "Créditos",
      loading: "Carregando...",
      potatoes: "Batatas",
      perSecond: "por segundo",
      upgrades: "Melhorias",
      autoClicker: "Auto Clicker",
      potatoFarm: "Fazenda de Batatas",
      factory: "Fábrica",
      save: "Salvo!",
      clickPotato: "Clique na batata!"
    },
    // NeoSnake
    neoSnake: {
      title: "NeoSnake",
      score: "Pontuação",
      highScore: "Recorde",
      gameOver: "Fim de Jogo",
      pressSpace: "Pressione ESPAÇO para reiniciar",
      dash: "Dash",
      shield: "Escudo",
      magnet: "Ímã"
    },
    // Local Chess
    localChess: {
      title: "Local Chess",
      white: "Brancas",
      black: "Pretas",
      turn: "Vez",
      tokens: "Fichas",
      check: "Xeque",
      checkmate: "Xeque-mate",
      newGame: "Novo Jogo"
    },
    // Code Recall
    codeRecall: {
      title: "Code Recall",
      level: "Nível",
      watch: "Observe",
      yourTurn: "Sua vez",
      gameOver: "Fim de Jogo",
      finalScore: "Pontuação Final",
      playAgain: "Jogar Novamente"
    },
    // Patience
    patience: {
      title: "Patience",
      time: "Tempo",
      stability: "Estabilidade",
      hold: "Segure para estabilizar",
      gameOver: "Fim de Jogo",
      newRecord: "Novo Recorde!"
    },
    // NeoGoal
    neoGoal: {
      title: "NeoGoal",
      player: "Jogador",
      ai: "IA",
      selectClass: "Escolha sua Classe",
      accelerator: "Acelerador",
      tank: "Tanque",
      tactical: "Tático",
      energy: "Energia",
      goal: "GOL!",
      win: "Vitória!",
      lose: "Derrota!"
    }
  },
  en: {
    // Potato Clicker
    potatoClicker: {
      title: "Potato Clicker",
      menu: "Menu",
      play: "Play",
      credits: "Credits",
      loading: "Loading...",
      potatoes: "Potatoes",
      perSecond: "per second",
      upgrades: "Upgrades",
      autoClicker: "Auto Clicker",
      potatoFarm: "Potato Farm",
      factory: "Factory",
      save: "Saved!",
      clickPotato: "Click the potato!"
    },
    // NeoSnake
    neoSnake: {
      title: "NeoSnake",
      score: "Score",
      highScore: "High Score",
      gameOver: "Game Over",
      pressSpace: "Press SPACE to restart",
      dash: "Dash",
      shield: "Shield",
      magnet: "Magnet"
    },
    // Local Chess
    localChess: {
      title: "Local Chess",
      white: "White",
      black: "Black",
      turn: "Turn",
      tokens: "Tokens",
      check: "Check",
      checkmate: "Checkmate",
      newGame: "New Game"
    },
    // Code Recall
    codeRecall: {
      title: "Code Recall",
      level: "Level",
      watch: "Watch",
      yourTurn: "Your Turn",
      gameOver: "Game Over",
      finalScore: "Final Score",
      playAgain: "Play Again"
    },
    // Patience
    patience: {
      title: "Patience",
      time: "Time",
      stability: "Stability",
      hold: "Hold to stabilize",
      gameOver: "Game Over",
      newRecord: "New Record!"
    },
    // NeoGoal
    neoGoal: {
      title: "NeoGoal",
      player: "Player",
      ai: "AI",
      selectClass: "Select Your Class",
      accelerator: "Accelerator",
      tank: "Tank",
      tactical: "Tactical",
      energy: "Energy",
      goal: "GOAL!",
      win: "Victory!",
      lose: "Defeat!"
    }
  },
  es: {
    // Potato Clicker
    potatoClicker: {
      title: "Potato Clicker",
      menu: "Menú",
      play: "Jugar",
      credits: "Créditos",
      loading: "Cargando...",
      potatoes: "Patatas",
      perSecond: "por segundo",
      upgrades: "Mejoras",
      autoClicker: "Auto Clicker",
      potatoFarm: "Granja de Patatas",
      factory: "Fábrica",
      save: "¡Guardado!",
      clickPotato: "¡Haz clic en la patata!"
    },
    // NeoSnake
    neoSnake: {
      title: "NeoSnake",
      score: "Puntuación",
      highScore: "Récord",
      gameOver: "Fin del Juego",
      pressSpace: "Presiona ESPACIO para reiniciar",
      dash: "Dash",
      shield: "Escudo",
      magnet: "Imán"
    },
    // Local Chess
    localChess: {
      title: "Local Chess",
      white: "Blancas",
      black: "Negras",
      turn: "Turno",
      tokens: "Fichas",
      check: "Jaque",
      checkmate: "Jaque mate",
      newGame: "Nuevo Juego"
    },
    // Code Recall
    codeRecall: {
      title: "Code Recall",
      level: "Nivel",
      watch: "Observa",
      yourTurn: "Tu Turno",
      gameOver: "Fin del Juego",
      finalScore: "Puntuación Final",
      playAgain: "Jugar de Nuevo"
    },
    // Patience
    patience: {
      title: "Patience",
      time: "Tiempo",
      stability: "Estabilidad",
      hold: "Mantén para estabilizar",
      gameOver: "Fin del Juego",
      newRecord: "¡Nuevo Récord!"
    },
    // NeoGoal
    neoGoal: {
      title: "NeoGoal",
      player: "Jugador",
      ai: "IA",
      selectClass: "Elige tu Clase",
      accelerator: "Acelerador",
      tank: "Tanque",
      tactical: "Táctico",
      energy: "Energía",
      goal: "¡GOL!",
      win: "¡Victoria!",
      lose: "¡Derrota!"
    }
  }
};

// Função para obter tradução
function getTranslation(game, key, lang = 'pt') {
  return gameTranslations[lang]?.[game]?.[key] || key;
}

// Listener para mensagens do parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'CHANGE_LANGUAGE') {
    const lang = event.data.language;
    if (window.updateGameLanguage) {
      window.updateGameLanguage(lang);
    }
  }
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gameTranslations, getTranslation };
}
