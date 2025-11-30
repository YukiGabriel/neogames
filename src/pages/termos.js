import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Legal.module.css';

export default function Termos() {
  return (
    <>
      <Head>
        <title>Termos de Uso - NeoGames</title>
        <meta name="description" content="Termos de Uso da plataforma NeoGames" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>📜 Termos de Uso</h1>
          <p className={styles.updated}>Última atualização: 15 de janeiro de 2024</p>

          <section className={styles.section}>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar a plataforma NeoGames, você concorda integralmente com estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
            </p>
            <p>
              <strong>Definições:</strong>
            </p>
            <ul>
              <li><strong>NeoGames/Plataforma:</strong> Refere-se ao site e todos os serviços oferecidos</li>
              <li><strong>Usuário:</strong> Qualquer pessoa que acesse ou utilize a Plataforma</li>
              <li><strong>Jogos:</strong> Todos os jogos disponíveis na Plataforma (Emoji Crush, Local Chess, NeoSnake, Potato Clicker, Code Recall, etc.)</li>
              <li><strong>Recursos Virtuais:</strong> Moedas, boosters, fichas de influência e outros itens virtuais</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. Condições de Uso e Requisitos</h2>
            <h3>2.1 Idade Mínima</h3>
            <p>
              Você deve ter pelo menos 13 anos de idade para utilizar a NeoGames. Usuários menores de 18 anos 
              devem ter permissão dos pais ou responsáveis legais.
            </p>
            
            <h3>2.2 Contas de Usuário</h3>
            <ul>
              <li>Você deve fornecer informações verdadeiras e atualizadas ao criar uma conta</li>
              <li>Você é responsável pela segurança da sua senha e por todas as atividades em sua conta</li>
              <li>Não compartilhe suas credenciais de acesso com terceiros</li>
              <li>Notifique-nos imediatamente sobre qualquer uso não autorizado da sua conta</li>
              <li>Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Propriedade Intelectual e Licença de Uso</h2>
            <h3>3.1 Propriedade da Plataforma</h3>
            <p>
              Todos os conteúdos da NeoGames, incluindo código-fonte, design, logotipos, gráficos e jogos 
              proprietários (como Emoji Crush, NeoSnake, Local Chess, Potato Clicker e Code Recall) são de 
              propriedade exclusiva da NeoGames e protegidos por direitos autorais e outras leis de propriedade intelectual.
            </p>
            
            <h3>3.2 Licença Limitada</h3>
            <p>
              Concedemos a você uma licença limitada, não exclusiva, não transferível e revogável para usar a 
              Plataforma e jogar os Jogos exclusivamente para fins de entretenimento pessoal e não comercial.
            </p>
            
            <h3>3.3 Conteúdo de Terceiros</h3>
            <p>
              Alguns jogos podem ser desenvolvidos por terceiros. Esses jogos pertencem aos seus respectivos 
              criadores, e a NeoGames atua apenas como plataforma de hospedagem e distribuição.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Regras de Conduta e Uso Proibido</h2>
            <h3>4.1 Atividades Proibidas</h3>
            <p>Ao utilizar a NeoGames, você concorda em NÃO:</p>
            <ul>
              <li>Utilizar cheats, bots, hacks, scripts ou qualquer método para obter vantagem injusta nos jogos</li>
              <li>Modificar, descompilar ou fazer engenharia reversa de qualquer parte da Plataforma</li>
              <li>Praticar assédio, bullying ou usar linguagem odiosa contra outros usuários</li>
              <li>Enviar spam, conteúdo malicioso ou realizar atividades ilegais</li>
              <li>Tentar atacar, desabilitar ou sobrecarregar os servidores (DDoS, injeção de código, etc.)</li>
              <li>Violar a privacidade de outros usuários ou coletar dados pessoais sem consentimento</li>
              <li>Usar a Plataforma para fins comerciais sem autorização prévia</li>
            </ul>
            
            <h3>4.2 Penalidades</h3>
            <p>Violações destes Termos podem resultar em:</p>
            <ul>
              <li>Aviso formal</li>
              <li>Suspensão temporária da conta</li>
              <li>Encerramento permanente da conta</li>
              <li>Perda de todo progresso e recursos virtuais</li>
              <li>Ações legais, quando aplicável</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Itens e Moedas Virtuais</h2>
            <h3>5.1 Natureza dos Recursos Virtuais</h3>
            <p>
              Todos os itens virtuais, moedas, boosters, fichas de influência e outros recursos disponíveis na 
              Plataforma são licenças limitadas e não possuem valor monetário no mundo real. Eles não podem ser 
              trocados por dinheiro ou transferidos para outras plataformas.
            </p>
            
            <h3>5.2 Compras e Reembolsos</h3>
            <ul>
              <li>Compras de recursos virtuais são finais e geralmente não são reembolsáveis</li>
              <li>Reembolsos podem ser concedidos apenas em casos excepcionais e a nosso critério</li>
              <li>Preços podem ser alterados a qualquer momento sem aviso prévio</li>
            </ul>
            
            <h3>5.3 Risco de Perda</h3>
            <p>
              Em caso de encerramento da conta por violação destes Termos, todos os recursos virtuais serão 
              perdidos sem direito a reembolso ou compensação.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Limitação de Responsabilidade</h2>
            <h3>6.1 Disponibilidade "Como Está"</h3>
            <p>
              A Plataforma e os Jogos são fornecidos "COMO ESTÃO" (AS IS) e "CONFORME DISPONÍVEIS", sem garantias 
              de qualquer tipo, expressas ou implícitas. Não garantimos que os serviços estarão livres de erros, 
              falhas, vírus ou interrupções.
            </p>
            
            <h3>6.2 Limitação de Danos</h3>
            <p>
              A NeoGames não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, 
              consequenciais ou punitivos resultantes do uso ou da incapacidade de usar a Plataforma, incluindo 
              perda de dados, lucros cessantes ou interrupção de negócios.
            </p>
            
            <h3>6.3 Links de Terceiros</h3>
            <p>
              A Plataforma pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, 
              políticas de privacidade ou práticas desses sites.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Modificações e Encerramento</h2>
            <h3>7.1 Alterações nos Termos</h3>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão 
              em vigor imediatamente após a publicação. O uso continuado da Plataforma após as mudanças constitui 
              aceitação dos novos Termos.
            </p>
            
            <h3>7.2 Encerramento de Serviços</h3>
            <p>
              Podemos suspender ou encerrar a Plataforma ou qualquer jogo a qualquer momento, com ou sem aviso 
              prévio, sem responsabilidade perante os usuários.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Lei Aplicável e Jurisdição</h2>
            <p>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa 
              relacionada a estes Termos será resolvida exclusivamente nos tribunais competentes do Brasil.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do email: 
              <strong> contato@neogames.com.br</strong>
            </p>
          </section>

          <div className={styles.acceptance}>
            <p>
              ✅ Ao utilizar a NeoGames, você declara ter lido, compreendido e concordado com todos os termos 
              e condições aqui estabelecidos.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
