import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h3 className={styles.logo}>🎮 NeoGames</h3>
            <p className={styles.description}>
              Plataforma de jogos online gratuitos. Diversão ilimitada, sem downloads.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}>📘 Facebook</a>
              <a href="#" className={styles.socialLink}>🐦 Twitter</a>
              <a href="#" className={styles.socialLink}>📸 Instagram</a>
            </div>
          </div>

          <div className={styles.section}>
            <h4>Categorias</h4>
            <ul className={styles.links}>
              <li><a href="/">Todos os Jogos</a></li>
              <li><a href="/?categoria=acao">Ação</a></li>
              <li><a href="/?categoria=quebra-cabeca">Quebra-cabeça</a></li>
              <li><a href="/?categoria=estrategia">Estratégia</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Sobre</h4>
            <ul className={styles.links}>
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Anuncie</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>Legal</h4>
            <ul className={styles.links}>
              <li><a href="/termos">Termos de Uso</a></li>
              <li><a href="/privacidade">Política de Privacidade</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2024 NeoGames. Todos os direitos reservados.</p>
          <p className={styles.madeWith}>Feito com 💙 para jogadores</p>
        </div>
      </div>
    </footer>
  );
}
