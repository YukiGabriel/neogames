import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/GameCard.module.css';

export default function GameCard({ game }) {
  const { t, translateCategory } = useLanguage();
  
  return (
    <Link href={`/jogo/${game.slug}`} className={styles.card}>
      <div className={styles.thumbnail}>
        <Image 
          src={game.thumbnail} 
          alt={game.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
        <div className={styles.overlay}>
          <span className={styles.playButton}>▶ {t('play')}</span>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{game.title}</h3>
        <div className={styles.meta}>
          <span className={styles.category}>{translateCategory(game.category)}</span>
          <span className={styles.plays}>{game.plays.toLocaleString()} {t('plays')}</span>
        </div>
      </div>
    </Link>
  );
}
