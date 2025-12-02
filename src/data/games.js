export const games = [
  {
    id: 1,
    title: "Potato Clicker",
    slug: "potato-clicker",
    category: "Quebra-cabeça",
    thumbnail: "/thumbnails/potato_clicker.jpg",
    description: "Clique na batata e construa seu império de batatas! Compre upgrades e automatize sua produção.",
    instructions: "Clique na batata para ganhar batatas. Use as batatas para comprar upgrades que geram batatas automaticamente!",
    embedUrl: "/games/potato-clicker/index.html",
    plays: 0,
    featured: true
  },
  {
    id: 2,
    title: "Emoji Crush",
    slug: "emoji-crush",
    category: "Quebra-cabeça",
    thumbnail: "/thumbnails/emoji_crush.jpg",
    description: "Combine 3 ou mais emojis iguais neste viciante jogo match-3! Crie combos especiais e complete níveis desafiadores.",
    instructions: "Troque emojis adjacentes para formar linhas de 3 ou mais iguais. Combine 4+ para criar power-ups especiais! Use boosters para ajudar em níveis difíceis.",
    embedUrl: "/games/emoji-crush/index.html",
    plays: 0,
    featured: true
  },
  {
    id: 3,
    title: "NeoSnake",
    slug: "neo-snake",
    category: "Ação",
    thumbnail: "/thumbnails/neosnake.png",
    description: "O clássico Snake reimaginado! Use habilidades especiais, desvie de obstáculos e cresça sua NeoCobra ao máximo.",
    instructions: "Use as setas ou WASD para mover. Pressione 1/Q para Dash, 2/E para Escudo, 3/R para Ímã. Colete bits de energia e evite obstáculos!",
    embedUrl: "/games/neo-snake/index.html",
    plays: 0,
    featured: true
  },
  {
    id: 4,
    title: "Local Chess",
    slug: "local-chess",
    category: "Estratégia",
    thumbnail: "/thumbnails/local_chess.png",
    description: "Xadrez estratégico com controle territorial! Conquiste zonas, gere Fichas de Influência e use recursos para vencer.",
    instructions: "Clique nas peças para mover. Controle zonas do tabuleiro para gerar Fichas (FI). Use FI para movimentos extras e habilidades especiais!",
    embedUrl: "/games/local-chess/index.html",
    plays: 0,
    featured: true
  },
  {
    id: 5,
    title: "Code Recall",
    slug: "code-recall",
    category: "Quebra-cabeça",
    thumbnail: "/thumbnails/code_recall.jpg",
    description: "Jogo de memória visual! Observe e repita a sequência de cores. Até onde sua memória consegue chegar?",
    instructions: "Observe a sequência de cores que acende. Depois, clique nos botões na mesma ordem. A cada rodada, uma nova cor é adicionada!",
    embedUrl: "/games/code-recall/index.html",
    plays: 0,
    featured: true
  },
  {
    id: 6,
    title: "Patience",
    slug: "patience",
    category: "Quebra-cabeça",
    thumbnail: "/thumbnails/patience_estabilidade_quantica.jpg",
    description: "Estabilidade Quântica! Mantenha o núcleo no centro resistindo a forças externas. Controle fino e timing são essenciais.",
    instructions: "Pressione e segure para estabilizar o núcleo. Mantenha-o na zona central pelo maior tempo possível. Cuidado com as forças quânticas!",
    embedUrl: "/games/patience/index.html",
    plays: 0,
    featured: true
  },
  {
    id: 7,
    title: "NeoGoal",
    slug: "neogoal",
    category: "Esportes",
    thumbnail: "/thumbnails/neogoal.jpg",
    description: "Esporte estratégico 1v1! Escolha sua classe, use cartas táticas e domine campos dinâmicos. Física de precisão com profundidade tática.",
    instructions: "Escolha uma classe (Acelerador/Tanque/Tático). Arraste da bola para mirar e ajustar potência. Use cartas táticas gastando energia. Primeiro a 3 gols vence!",
    embedUrl: "/games/neogoal/index.html",
    plays: 0,
    featured: true
  }
];

export const categories = ["Todos", "Ação", "Quebra-cabeça", "Estratégia", "Esportes"];

export const getGameBySlug = (slug) => games.find(game => game.slug === slug);

export const getGamesByCategory = (category) => {
  if (category === "Todos") return games;
  return games.filter(game => game.category === category);
};

export const getFeaturedGames = () => games.filter(game => game.featured);

export const getMostPlayedGames = () => [...games].sort((a, b) => b.plays - a.plays).slice(0, 6);

export const getSimilarGames = (currentGameId, category) => {
  return games
    .filter(game => game.id !== currentGameId && game.category === category)
    .slice(0, 4);
};
