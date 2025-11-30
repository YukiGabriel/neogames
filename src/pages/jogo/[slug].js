import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import GameGrid from '../../components/GameGrid';
import { games, getGameBySlug, getSimilarGames } from '../../data/games';
import styles from '../../styles/GamePage.module.css';

export default function GamePage({ game, similarGames }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (!document.fullscreenElement) {
      iframe.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <Head>
        <title>{game.title} - Jogar Online Grátis | NeoGames</title>
        <meta name="description" content={game.description} />
        <meta name="keywords" content={`${game.title}, ${game.category}, jogos online, jogar grátis`} />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.gameSection}>
            <h1 className={styles.title}>{game.title}</h1>
            
            <div className={styles.playerWrapper}>
              <iframe
                id="game-iframe"
                src={game.embedUrl}
                className={styles.player}
                allowFullScreen
                title={game.title}
              />
              <button onClick={toggleFullscreen} className={styles.fullscreenBtn}>
                ⛶ Tela Cheia
              </button>
            </div>

            <div className={styles.info}>
              <div className={styles.infoSection}>
                <h2>Sobre o Jogo</h2>
                <p>{game.description}</p>
              </div>

              <div className={styles.infoSection}>
                <h2>Como Jogar</h2>
                <p>{game.instructions}</p>
              </div>

              <div className={styles.meta}>
                <span className={styles.category}>📁 {game.category}</span>
                <span className={styles.plays}>👥 {game.plays.toLocaleString()} jogadas</span>
              </div>
            </div>
          </div>

          <GameGrid title="🎯 Mais Jogos Como Este" games={similarGames} />
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = games.map(game => ({
    params: { slug: game.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const game = getGameBySlug(params.slug);
  const similarGames = getSimilarGames(game.id, game.category);

  return {
    props: {
      game,
      similarGames,
    },
  };
}
