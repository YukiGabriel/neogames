import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameGrid from '../components/GameGrid';
import { getFeaturedGames, getMostPlayedGames } from '../data/games';
import styles from '../styles/Home.module.css';

export default function Home({ featuredGames, mostPlayedGames }) {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    checkAdminMessages();
    
    // Verificar a cada 2 segundos
    const interval = setInterval(checkAdminMessages, 2000);
    
    // Listener para mudanças no localStorage (funciona entre abas)
    const handleStorageChange = (e) => {
      if (e.key === 'adminMessages' || e.key === 'adminBroadcast') {
        checkAdminMessages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAdminMessages = () => {
    const messages = localStorage.getItem('adminMessages');
    if (messages) {
      const parsed = JSON.parse(messages);
      if (parsed.length > 0) {
        const lastShown = sessionStorage.getItem('lastShownMessage');
        const latestMessage = parsed[0];
        
        if (lastShown !== String(latestMessage.id)) {
          setNotification(latestMessage);
          sessionStorage.setItem('lastShownMessage', String(latestMessage.id));
        }
      }
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <>
      <Head>
        <title>NeoGames - Jogos Online Gratuitos e Instantâneos</title>
        <meta name="description" content="Jogue os melhores jogos online gratuitos no NeoGames. Ação, quebra-cabeças, esportes e muito mais!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      {notification && (
        <div className={styles.notification}>
          <div className={styles.notificationContent}>
            <button onClick={closeNotification} className={styles.closeBtn}>×</button>
            <h3>📢 Mensagem do Administrador</h3>
            <p>{notification.text}</p>
            <small>{notification.timestamp}</small>
          </div>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.container}>
          <GameGrid title="🔥 Jogos do Momento no NeoGames" games={featuredGames} />
          
          <div className={styles.adsSection}>
            <div className={styles.announcement}>
              <h2 className={styles.announcementTitle}>NeoGames: Em Desenvolvimento - Uma Nova Plataforma de Jogos</h2>
              <p className={styles.announcementBody}>
                Bem-vindo à NeoGames! Estamos atualmente empolgados em construir uma nova plataforma de jogos online, 
                focada em experiências divertidas e acessíveis. Todos os jogos que você vê mencionados (como Emoji Crush, 
                Local Chess, NeoSnake, Potato Clicker e Code Recall) estão em diversas fases de desenvolvimento.
              </p>
              <p className={styles.announcementBody}>
                Nossa missão é criar um espaço onde a diversão seja ilimitada. Agradecemos sua paciência e interesse 
                enquanto trabalhamos para dar vida a este projeto. Volte sempre para acompanhar nosso progresso!
              </p>
              <p className={styles.announcementFooter}>NeoGames: Juntos construindo o futuro dos jogos.</p>
            </div>
          </div>
          
          <GameGrid title="🎮 Mais Jogados na Última Semana" games={mostPlayedGames} />
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      featuredGames: getFeaturedGames(),
      mostPlayedGames: getMostPlayedGames(),
    },
  };
}
