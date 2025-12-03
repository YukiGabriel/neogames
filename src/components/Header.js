import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { games, categories } from '../data/games';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [theme, setTheme] = useState('dark');
  const { language, changeLanguage, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.body.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query === 'MILOSWGAY') {
      setSearchQuery('');
      setSuggestions([]);
      router.push('/admin');
      return;
    }

    if (query.length > 0) {
      const filtered = games.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (slug) => {
    setSearchQuery('');
    setSuggestions([]);
    router.push(`/jogo/${slug}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoNeo}>Neo</span>
          <span className={styles.logoGames}>Games</span>
        </Link>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          {suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map(game => (
                <div
                  key={game.id}
                  className={styles.suggestion}
                  onClick={() => handleSuggestionClick(game.slug)}
                >
                  <img src={game.thumbnail} alt={game.title} />
                  <span>{game.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className={styles.nav}>
          <Link href="/categoria/acao" className={styles.navLink}>{t('action')}</Link>
          <Link href="/categoria/quebra-cabeca" className={styles.navLink}>{t('puzzle')}</Link>
          <Link href="/categoria/estrategia" className={styles.navLink}>{t('strategy')}</Link>
        </nav>

        <select value={language} onChange={(e) => changeLanguage(e.target.value)} className={styles.langSelect}>
          <option value="pt">🇧🇷 PT</option>
          <option value="en">🇺🇸 EN</option>
          <option value="es">🇪🇸 ES</option>
        </select>

        <button onClick={toggleTheme} className={styles.themeToggle} title={theme === 'dark' ? t('lightTheme') : t('darkTheme')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
