# 🎮 Como Adicionar Seus Próprios Jogos

## 📁 Estrutura de Pastas

```
public/
├── games/              # Seus jogos ficam aqui
│   ├── meu-jogo-1/    # Cada jogo em sua pasta
│   │   └── index.html
│   ├── meu-jogo-2/
│   │   ├── index.html
│   │   ├── game.js
│   │   └── style.css
│   └── exemplo-simples/
│       └── index.html
└── thumbnails/         # Miniaturas dos jogos (300x200px)
    └── meu-jogo.png
```

## 🚀 Passo a Passo

### 1. Criar o Jogo

Crie uma pasta em `public/games/nome-do-jogo/` com um arquivo `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Meu Jogo</title>
    <style>
        body { margin: 0; background: #000; }
        canvas { display: block; margin: 0 auto; }
    </style>
</head>
<body>
    <canvas id="game"></canvas>
    <script>
        // SEU CÓDIGO DO JOGO AQUI
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        function gameLoop() {
            // Lógica do jogo
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    </script>
</body>
</html>
```

### 2. Adicionar Miniatura (Opcional)

Salve uma imagem 300x200px em `public/thumbnails/meu-jogo.png`

### 3. Registrar no Sistema

Edite `src/data/games.js` e adicione:

```javascript
{
  id: 9,
  title: "Meu Jogo Incrível",
  slug: "meu-jogo-incrivel",
  category: "Ação",  // Ação, Quebra-cabeça ou Esportes
  thumbnail: "/thumbnails/meu-jogo.png",
  description: "Descrição do seu jogo",
  instructions: "Como jogar: use WASD para mover",
  embedUrl: "/games/nome-do-jogo/index.html",
  plays: 0,
  featured: true  // true = aparece na home
}
```

## 🎨 Tecnologias Suportadas

- **HTML5 Canvas** - Jogos 2D/3D
- **JavaScript Puro** - Sem frameworks necessários
- **Phaser.js** - Framework de jogos
- **Three.js** - Jogos 3D
- **PixiJS** - Renderização 2D rápida
- **Matter.js** - Física 2D
- **Qualquer biblioteca JS** que rode no browser

## 💡 Exemplos de Jogos

### Jogo Simples (já incluído)
- `public/games/exemplo-simples/` - Quadrado que se move

### Ideias para Criar:

**Simples:**
- Jogo da cobrinha
- Pong
- Flappy Bird clone
- Jogo da memória
- Tic-tac-toe

**Intermediário:**
- Plataforma 2D
- Space shooter
- Tower defense
- Puzzle match-3
- Corrida top-down

**Complexo:**
- RPG
- Roguelike
- Metroidvania
- Multiplayer (com WebSocket)

## 🔧 Dicas

1. **Teste localmente**: Acesse `http://localhost:3000/jogo/seu-slug`
2. **Responsivo**: Use `canvas.width = window.innerWidth` para mobile
3. **Performance**: Use `requestAnimationFrame` para animações
4. **Assets**: Coloque imagens/sons na pasta do jogo
5. **Sem reload**: O Next.js atualiza automaticamente

## 📦 Bibliotecas Recomendadas

Adicione no `<head>` do seu jogo:

```html
<!-- Phaser 3 -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>

<!-- Three.js -->
<script src="https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js"></script>

<!-- Matter.js (Física) -->
<script src="https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js"></script>
```

## 🎯 Próximos Passos

1. Explore o exemplo em `public/games/exemplo-simples/`
2. Crie sua primeira pasta de jogo
3. Desenvolva o HTML5 do jogo
4. Registre em `games.js`
5. Teste em `npm run dev`
