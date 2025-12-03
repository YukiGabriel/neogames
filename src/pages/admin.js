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
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
      
      if (res.ok) {
        setMessage('');
        await loadMessages();
        alert('Mensagem enviada para todos os dispositivos!');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem!');
    }
  };

  const deleteMessage = async (id) => {
    try {
      await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      await loadMessages();
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
    }
  };

  const clearAll = async () => {
    if (confirm('Limpar todas as mensagens?')) {
      try {
        await fetch('/api/messages', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: 'all' })
        });
        await loadMessages();
      } catch (error) {
        console.error('Erro ao limpar mensagens:', error);
      }
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
