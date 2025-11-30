# 📱 Como Acessar o NeoGames pelo Celular

## Método 1: Mesma Rede WiFi (Recomendado)

### Passo 1: Descobrir o IP do seu PC
No terminal do Windows:
```bash
ipconfig
```
Procure por **"Endereço IPv4"** (exemplo: `192.168.1.5`)

### Passo 2: Iniciar o servidor
```bash
npm run dev
```

### Passo 3: Acessar no celular
1. Conecte o celular na **mesma WiFi** do PC
2. Abra o navegador do celular
3. Digite: `http://SEU_IP:3000`
   - Exemplo: `http://192.168.1.5:3000`

---

## Método 2: Ngrok (Acesso pela Internet)

### Passo 1: Instalar Ngrok
1. Acesse: https://ngrok.com/download
2. Baixe e extraia o ngrok.exe
3. Crie conta grátis em: https://dashboard.ngrok.com/signup

### Passo 2: Configurar
```bash
ngrok config add-authtoken SEU_TOKEN
```

### Passo 3: Iniciar servidor Next.js
```bash
npm run dev
```

### Passo 4: Criar túnel (em outro terminal)
```bash
ngrok http 3000
```

### Passo 5: Acessar
O ngrok mostrará uma URL pública:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

Acesse essa URL de qualquer dispositivo!

---

## Método 3: Configurar Next.js para aceitar conexões externas

### Edite package.json:
```json
"scripts": {
  "dev": "next dev -H 0.0.0.0"
}
```

Depois siga o **Método 1**.

---

## ⚠️ Firewall do Windows

Se não funcionar, libere a porta 3000:

1. Painel de Controle → Firewall do Windows
2. Configurações Avançadas → Regras de Entrada
3. Nova Regra → Porta → TCP → 3000
4. Permitir conexão

---

## 🎮 Testando

Acesse no celular:
- Home: `http://SEU_IP:3000`
- Potato Clicker: `http://SEU_IP:3000/jogo/potato-clicker`

---

## 💡 Dicas

- **WiFi**: Mais rápido e estável
- **Ngrok**: Compartilhar com amigos pela internet
- **Firewall**: Pode bloquear conexões externas
- **IP Dinâmico**: Pode mudar ao reiniciar o roteador
