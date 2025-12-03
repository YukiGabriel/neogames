# Guia de Implementação de Tradução nos Jogos

## Arquivos Criados

✅ **Sistemas de tradução criados para:**
- `neo-snake/translations.js`
- `code-recall/translations.js`
- `patience/translations.js`
- `local-chess/translations.js`
- `neogoal/translations.js`
- `potato-clicker/translations.js` (já implementado completamente)

## Como Implementar em Cada Jogo

### Passo 1: Adicionar o script de tradução no HTML

No arquivo `index.html` de cada jogo, adicione antes do `</body>`:

```html
<script src="translations.js"></script>
<script src="game.js"></script>
```

### Passo 2: Adicionar o seletor de idioma no menu

Copie o código do arquivo `language-selector-snippet.html` e cole no menu principal do jogo.

**Localização sugerida:**
- Se o jogo tem menu principal: adicione no menu
- Se o jogo não tem menu: adicione no topo da tela ou em um botão de configurações

### Passo 3: Usar traduções no código JavaScript

No arquivo `game.js` de cada jogo, substitua textos fixos por chamadas à função `t()`:

**ANTES:**
```javascript
scoreText.textContent = 'Pontuação: ' + score;
```

**DEPOIS:**
```javascript
const scoreLabel = typeof t === 'function' ? t('score') : 'Pontuação';
scoreText.textContent = scoreLabel + ': ' + score;
```

### Passo 4: Atualizar a função updateGameLanguage()

No arquivo `translations.js` de cada jogo, expanda a função `updateGameLanguage()` para atualizar TODOS os textos visíveis do jogo.

## Exemplo Completo: NeoSnake

### 1. HTML (index.html)
```html
<!-- No menu principal -->
<div class="menu">
    <h1>🐍 NeoSnake</h1>
    <button onclick="startGame()">▶️ Jogar</button>
    
    <!-- Seletor de idioma -->
    <div style="margin: 20px auto; max-width: 300px;">
        <h3 style="color: #00d4ff; text-align: center;">🌍 Idioma</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <button onclick="changeGameLanguage('pt')" id="langPT">🇧🇷 PT</button>
            <button onclick="changeGameLanguage('en')" id="langEN">🇺🇸 EN</button>
            <button onclick="changeGameLanguage('es')" id="langES">🇪🇸 ES</button>
        </div>
    </div>
</div>

<!-- Antes do </body> -->
<script src="translations.js"></script>
<script src="game.js"></script>
```

### 2. JavaScript (game.js)
```javascript
// Usar traduções
function updateScore() {
    const scoreLabel = typeof t === 'function' ? t('score') : 'Pontuação';
    scoreElement.textContent = scoreLabel + ': ' + score;
}

function gameOver() {
    const gameOverText = typeof t === 'function' ? t('gameOver') : 'Fim de Jogo';
    const pressSpaceText = typeof t === 'function' ? t('pressSpace') : 'Pressione ESPAÇO';
    alert(gameOverText + '\\n' + pressSpaceText);
}
```

## Traduções Disponíveis por Jogo

### NeoSnake
- score, highScore, gameOver, pressSpace, dash, shield, magnet

### Code Recall
- level, watch, yourTurn, gameOver, finalScore, playAgain

### Patience
- time, stability, hold, gameOver, newRecord

### Local Chess
- white, black, turn, tokens, check, checkmate, newGame

### NeoGoal
- player, ai, selectClass, accelerator, tank, tactical, energy, goal, win, lose

### Potato Clicker
- 50+ traduções (totalmente implementado)

## Adicionar Novas Traduções

Para adicionar novas strings de tradução, edite o arquivo `translations.js` do jogo:

```javascript
const translations = {
  pt: {
    novaChave: 'Texto em Português',
    // ...
  },
  en: {
    novaChave: 'Text in English',
    // ...
  },
  es: {
    novaChave: 'Texto en Español',
    // ...
  }
};
```

## Status de Implementação

| Jogo | translations.js | Seletor UI | Integração game.js |
|------|----------------|------------|-------------------|
| Potato Clicker | ✅ | ✅ | ✅ |
| NeoSnake | ✅ | ⏳ | ⏳ |
| Code Recall | ✅ | ⏳ | ⏳ |
| Patience | ✅ | ⏳ | ⏳ |
| Local Chess | ✅ | ⏳ | ⏳ |
| NeoGoal | ✅ | ⏳ | ⏳ |
| Emoji Crush | ⏳ | ⏳ | ⏳ |

✅ = Completo | ⏳ = Pendente
