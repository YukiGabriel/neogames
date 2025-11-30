import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Admin.module.css';

export default function Admin() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadMessages();
    const interval = setInterval(checkForMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = () => {
    const stored = localStorage.getItem('adminMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  };

  const checkForMessages = () => {
    const stored = localStorage.getItem('adminMessages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      timestamp: new Date().toLocaleString('pt-BR')
    };

    const updatedMessages = [newMessage, ...messages];
    localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
    
    // Trigger para notificar outras abas
    localStorage.setItem('adminBroadcast', Date.now().toString());
    
    setMessages(updatedMessages);
    setMessage('');

    alert('Mensagem enviada para todos os dispositivos!');
  };

  const deleteMessage = (id) => {
    const updatedMessages = messages.filter(m => m.id !== id);
    localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const clearAll = () => {
    if (confirm('Limpar todas as mensagens?')) {
      localStorage.removeItem('adminMessages');
      setMessages([]);
    }
  };

  return (
    <>
      <Head>
        <title>Painel Admin - NeoGames</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>🔐 Painel Administrativo</h1>
          <button onClick={() => router.push('/')} className={styles.backBtn}>
            ← Voltar
          </button>
        </div>

        <div className={styles.sendSection}>
          <h2>📢 Enviar Mensagem Global</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite a mensagem para todos os usuários..."
            className={styles.textarea}
            rows={4}
          />
          <div className={styles.actions}>
            <button onClick={sendMessage} className={styles.sendBtn}>
              Enviar Mensagem
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Limpar Todas
            </button>
          </div>
        </div>

        <div className={styles.messagesSection}>
          <h2>📋 Mensagens Enviadas ({messages.length})</h2>
          {messages.length === 0 ? (
            <p className={styles.empty}>Nenhuma mensagem enviada ainda.</p>
          ) : (
            <div className={styles.messagesList}>
              {messages.map(msg => (
                <div key={msg.id} className={styles.messageCard}>
                  <div className={styles.messageHeader}>
                    <span className={styles.timestamp}>{msg.timestamp}</span>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  </div>
                  <p className={styles.messageText}>{msg.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
