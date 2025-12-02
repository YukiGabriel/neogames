import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Legal.module.css';

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre Nós - NeoGames</title>
        <meta name="description" content="Conheça a história e a equipe por trás da NeoGames" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>🕹️ Sobre Nós: A Missão da NeoGames</h1>

          <section className={styles.section}>
            <h2>A Simplicidade Encontra a Diversão</h2>
            <p>
              A NeoGames nasceu de uma missão clara e poderosa: criar jogos e sites simples, mas profundamente 
              divertidos, para o prazer de todos. Acreditamos que a melhor diversão não precisa ser complicada, 
              e nossa plataforma é construída sobre esse princípio. Nosso objetivo é que, ao visitar o NeoGames, 
              você encontre um refúgio de desafios rápidos, alegria instantânea e competições viciantes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Uma História de Paixão e Amizade</h2>
            <p>
              A NeoGames não é o produto de um grande estúdio; é a realização de um sonho compartilhado entre 
              dois amigos, <strong>Yuki Gabriel Martins de Sousa</strong> e <strong>Rafael da Silva Lima</strong>. 
              Juntos, Yuki e Rafael uniram suas visões e paixão por jogos para construir esta plataforma do zero.
            </p>
            <p>
              Aqui, o termo "Neo" no nome representa o novo começo, a nossa dedicação à inovação e a promessa 
              de um futuro repleto de experiências originais.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Criado por Gamers, Para Gamers</h2>
            <p>
              Nosso maior diferencial é que cada jogo que você encontra no NeoGames é criado inteiramente por 
              nós, os fundadores. Do conceito inicial e das linhas de código em Next.js, à arte e ao design de 
              gameplay do Emoji Crush, NeoGoal e outros títulos, tudo é desenvolvido internamente.
            </p>
            <p>
              Essa abordagem nos permite ter um controle total sobre a qualidade e a singularidade de cada 
              experiência que oferecemos, garantindo que você jogue algo verdadeiramente original.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Conheça a Equipe</h2>
            <p>
              Nossa equipe é pequena, mas impulsionada pela paixão por criar e inovar:
            </p>
            <ul>
              <li>
                <strong>Yuki Gabriel Martins de Sousa & Rafael da Silva Lima:</strong> Os fundadores e principais 
                desenvolvedores, dedicados a transformar ideias em jogos funcionais e divertidos.
              </li>
              <li>
                <strong>Clenilson Lopes de Sousa:</strong> Nosso terceiro membro, que ocasionalmente nos oferece 
                apoio essencial e traz sua valiosa experiência para garantir a excelência técnica dos nossos projetos.
              </li>
            </ul>
            <p>
              Somos uma equipe de amigos, desenvolvedores e sonhadores, e nossa maior satisfação é ver nosso 
              trabalho trazer alegria aos jogadores.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Nosso Público: Para Todos</h2>
            <p>
              O NeoGames foi criado para toda e qualquer pessoa que ame jogar. Nossa biblioteca é cuidadosamente 
              equilibrada para atender a todos:
            </p>
            
            <h3>Casual</h3>
            <p>
              Jogos simples e relaxantes, como o <strong>Patience</strong> e o <strong>Code Recall</strong>, 
              para momentos de foco e diversão rápida.
            </p>

            <h3>Competitivo</h3>
            <p>
              Jogos com alto skill ceiling, como o <strong>NeoGoal</strong> e o <strong>NeoSnake</strong>, 
              que desafiam os mais experientes a subir nos rankings e provar sua maestria.
            </p>

            <p>
              Seja você uma criança em busca de um passatempo, um adolescente em busca de competição, ou um 
              adulto querendo uma pausa rápida, há um jogo feito com carinho esperando por você aqui.
            </p>
          </section>

          <div className={styles.acceptance}>
            <p>
              🎮 Obrigado por fazer parte da nossa jornada. Juntos, estamos construindo algo especial!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
