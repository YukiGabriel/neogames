import Link from 'next/link';
import styles from '../styles/GameCard.module.css';

export default function GameCard({ game }) {
  return (
    <Link href={`/jogo/${game.slug}`} className={styles.card}>
      <div className={styles.thumbnail}>
        <img src={game.thumbnail} alt={game.title} />
        <div className={styles.overlay}>
          <span className={styles.playButton}>▶ Jogar</span>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{game.title}</h3>
        <div className={styles.meta}>
          <span className={styles.category}>{game.category}</span>
          <span className={styles.plays}>{game.plays.toLocaleString()} jogadas</span>
        </div>
      </div>
    </Link>
  );
}
