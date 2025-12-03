import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { aboutContent } from '../locales/aboutContent';
import styles from '../styles/Legal.module.css';

export default function Sobre() {
  const { t, language } = useLanguage();
  const content = aboutContent[language];
  
  return (
    <>
      <Head>
        <title>Sobre Nós - NeoGames</title>
        <meta name="description" content="Conheça a história e a equipe por trás da NeoGames" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('aboutPageTitle')}</h1>

          <section className={styles.section}>
            <h2>{content.section1.title}</h2>
            <p>{content.section1.text}</p>
          </section>

          <section className={styles.section}>
            <h2>{content.section2.title}</h2>
            <p>{content.section2.text1}</p>
            <p>{content.section2.text2}</p>
          </section>

          <section className={styles.section}>
            <h2>{content.section3.title}</h2>
            <p>{content.section3.text1}</p>
            <p>{content.section3.text2}</p>
          </section>

          <section className={styles.section}>
            <h2>{content.section4.title}</h2>
            <p>{content.section4.text}</p>
            <ul>
              <li><strong>{content.section4.team1}</strong></li>
              <li><strong>{content.section4.team2}</strong></li>
            </ul>
            <p>{content.section4.text2}</p>
          </section>

          <section className={styles.section}>
            <h2>{content.section5.title}</h2>
            <p>{content.section5.text}</p>
            
            <h3>{content.section5.casual}</h3>
            <p>{content.section5.casualText}</p>

            <h3>{content.section5.competitive}</h3>
            <p>{content.section5.competitiveText}</p>

            <p>{content.section5.text2}</p>
          </section>

          <div className={styles.acceptance}>
            <p>{content.thanks}</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
