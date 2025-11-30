import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { games, categories } from '../data/games';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

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
            placeholder="Buscar jogos..."
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
          {categories.slice(1).map(category => (
            <Link
              key={category}
              href={`/categoria/${category.toLowerCase()}`}
              className={styles.navLink}
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
