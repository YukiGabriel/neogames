import GameCard from './GameCard';
import styles from '../styles/GameGrid.module.css';

export default function GameGrid({ title, games }) {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
