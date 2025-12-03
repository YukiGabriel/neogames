import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.logo}>🎮 NeoGames</h3>
            <p className={styles.description}>
              {t('footerDescription')}
            </p>
            <div className={styles.social}>
              <a href="https://www.instagram.com/neogames_studios/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} title="Instagram">
                <img src="/icons/instagram-svgrepo-com.svg" alt="Instagram" style={{width: '24px', height: '24px', display: 'block'}} />
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4>{t('categoriesTitle')}</h4>
            <ul className={styles.links}>
              <li><a href="/">{t('allGamesLink')}</a></li>
              <li><a href="/?categoria=acao">{t('action')}</a></li>
              <li><a href="/?categoria=quebra-cabeca">{t('puzzle')}</a></li>
              <li><a href="/?categoria=estrategia">{t('strategy')}</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>{t('aboutTitle')}</h4>
            <ul className={styles.links}>
              <li><a href="/sobre">{t('aboutUs')}</a></li>
              <li><a href="#">{t('contact')}</a></li>
              <li><a href="#">{t('advertise')}</a></li>
              <li><a href="#">{t('blog')}</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>{t('legalTitle')}</h4>
            <ul className={styles.links}>
              <li><a href="/termos">{t('terms')}</a></li>
              <li><a href="/privacidade">{t('privacy')}</a></li>
              <li><a href="#">{t('cookies')}</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2025 NeoGames. {t('rights')}</p>
          <p className={styles.madeWith}>{t('madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
