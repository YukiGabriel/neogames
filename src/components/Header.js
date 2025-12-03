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

    if (query === 'NEONOVERLOAD') {
      setSearchQuery('');
      setSuggestions([]);
      document.body.classList.add('neon-overload-active');
      return;
    }

    if (query === 'ZENMODE') {
      setSearchQuery('');
      setSuggestions([]);
      document.body.classList.add('zen-mode-active');
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKfj8LdjHAU5k9jyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs/y2Ik2CBhnu+znnnsMD1Cn4/C3YxwFOZPY8sx5LAUkd8fw3ZBBChRftOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs5557DA9Qp+Pwt2McBTmT2PLMeSwFJHfH8N2QQQoUX7Tr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OeeewwPUKfj8LdjHAU5k9jyzHksBSR3x/DdkEEKFF+06+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znnnsMD1Cn4/C3YxwFOZPY8sx5LAUkd8fw3ZBBChRftOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs5557DA9Qp+Pwt2McBTmT2PLMeSwFJHfH8N2QQQoUX7Tr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OeeewwPUKfj8LdjHAU5k9jyzHksBSR3x/DdkEEKFF+06+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znnnsMD1Cn4/C3YxwFOZPY8sx5LAUkd8fw3ZBBChRftOvrqFUUCkaf4PK+bCEFK4LP8tmJNggYZ7vs5557DA9Qp+Pwt2McBTmT2PLMeSwFJHfH8N2QQQoUX7Tr66hVFApGn+DyvmwhBSuCz/LZiTYIGGe77OeeewwPUKfj8LdjHAU5k9jyzHksBSR3x/DdkEEKFF+06+uoVRQKRp/g8r5sIQUrgs/y2Yk2CBhnu+znnnsMD1Cn4/C3Yw==');
      audio.volume = 0.3;
      audio.play();
      setTimeout(() => {
        document.body.classList.remove('zen-mode-active');
      }, 10000);
      return;
    }

    if (query === 'SNAKEMANIA') {
      setSearchQuery('');
      setSuggestions([]);
      const canvas = document.createElement('canvas');
      canvas.id = 'snake-bg';
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;opacity:0.6;pointer-events:none';
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const snakes = Array(5).fill().map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 6,
        dy: (Math.random() - 0.5) * 6,
        trail: [],
        color: ['#00ff00', '#00ffff', '#ff00ff', '#ffff00', '#ff0080'][Math.floor(Math.random() * 5)]
      }));
      const animate = () => {
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        snakes.forEach(s => {
          s.x += s.dx;
          s.y += s.dy;
          if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
          if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
          s.trail.push({ x: s.x, y: s.y });
          if (s.trail.length > 50) s.trail.shift();
          s.trail.forEach((p, i) => {
            const alpha = i / s.trail.length;
            const size = 8 + (i / s.trail.length) * 8;
            ctx.shadowBlur = 20;
            ctx.shadowColor = s.color;
            ctx.fillStyle = s.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
            ctx.fill();
          });
        });
        if (document.getElementById('snake-bg')) requestAnimationFrame(animate);
      };
      animate();
      setTimeout(() => {
        canvas.remove();
      }, 15000);
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
