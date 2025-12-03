import { useState, useEffect } from 'react';
import styles from '../styles/GlobalNotification.module.css';

export default function GlobalNotification() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkMessages();
    const interval = setInterval(checkMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      
      if (data.messages.length > 0) {
        const latestMessage = data.messages[0];
        const lastShown = localStorage.getItem('lastShownMessage');
        
        if (lastShown !== latestMessage.id.toString()) {
          setMessage(latestMessage);
          setVisible(true);
          localStorage.setItem('lastShownMessage', latestMessage.id.toString());
        }
      }
    } catch (error) {
      console.error('Erro ao verificar mensagens:', error);
    }
  };

  const closeNotification = () => {
    setVisible(false);
    setTimeout(() => setMessage(null), 300);
  };

  if (!message || !visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.notification}>
        <div className={styles.header}>
          <span className={styles.icon}>📢</span>
          <h3>Mensagem da Administração</h3>
          <button onClick={closeNotification} className={styles.closeBtn}>✕</button>
        </div>
        <p className={styles.message}>{message.text}</p>
        <div className={styles.footer}>
          <span className={styles.timestamp}>{message.timestamp}</span>
          <button onClick={closeNotification} className={styles.okBtn}>OK</button>
        </div>
      </div>
    </div>
  );
}
