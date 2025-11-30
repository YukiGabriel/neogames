import Head from 'next/head';
import Header from '../../components/Header';
import GameGrid from '../../components/GameGrid';
import { categories, getGamesByCategory } from '../../data/games';
import styles from '../../styles/Category.module.css';

export default function CategoryPage({ category, games }) {
  return (
    <>
      <Head>
        <title>{category} - Jogos Online Gratuitos | NeoGames</title>
        <meta name="description" content={`Jogue os melhores jogos de ${category} online grátis no NeoGames`} />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Jogos de {category}</h1>
          <GameGrid games={games} />
        </div>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const paths = categories.slice(1).map(category => ({
    params: { category: category.toLowerCase() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const category = categories.find(c => c.toLowerCase() === params.category);
  const games = getGamesByCategory(category);

  return {
    props: {
      category,
      games,
    },
  };
}
