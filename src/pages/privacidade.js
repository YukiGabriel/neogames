import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Legal.module.css';

export default function Privacidade() {
  return (
    <>
      <Head>
        <title>Política de Privacidade - NeoGames</title>
        <meta name="description" content="Política de Privacidade da plataforma NeoGames" />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>🛡️ Política de Privacidade</h1>
          <p className={styles.updated}>Última atualização: 15 de janeiro de 2024</p>

          <section className={styles.section}>
            <h2>1. Introdução e Nosso Compromisso</h2>
            <p>
              A NeoGames está comprometida em proteger a privacidade e os dados pessoais de seus usuários. 
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos suas 
              informações quando você utiliza nossa plataforma de jogos online.
            </p>
            <p>
              Ao utilizar a NeoGames, você concorda com a coleta e uso de suas informações conforme descrito 
              nesta Política. Esta Política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
            </p>
            <p>
              <strong>Contato para Questões de Privacidade:</strong> privacidade@neogames.com.br
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Informações que Coletamos</h2>
            
            <h3>2.1 Dados Fornecidos pelo Usuário</h3>
            <ul>
              <li><strong>Nome de Usuário (Nick):</strong> Para identificação na plataforma</li>
              <li><strong>Endereço de E-mail:</strong> Para login, recuperação de senha e comunicações</li>
              <li><strong>Senha:</strong> Armazenada de forma criptografada para segurança da conta</li>
            </ul>
            <p><strong>Finalidade:</strong> Criar e gerenciar sua conta, autenticação e recuperação de acesso.</p>

            <h3>2.2 Dados de Atividade na Plataforma</h3>
            <ul>
              <li><strong>Pontuações e Progresso:</strong> Resultados em jogos como Emoji Crush, NeoSnake, Local Chess, Potato Clicker e Code Recall</li>
              <li><strong>Itens Virtuais:</strong> Boosters, moedas, fichas de influência e outros recursos adquiridos</li>
              <li><strong>Histórico de Jogos:</strong> Jogos acessados, tempo de jogo e preferências</li>
              <li><strong>Conquistas e Rankings:</strong> Progresso e posição em leaderboards</li>
            </ul>
            <p><strong>Finalidade:</strong> Fornecer funcionalidades dos jogos, salvar progresso, personalizar experiência e exibir rankings.</p>

            <h3>2.3 Dados Automáticos de Dispositivo e Conexão</h3>
            <ul>
              <li><strong>Endereço IP:</strong> Para segurança e localização aproximada</li>
              <li><strong>Tipo de Navegador e Sistema Operacional:</strong> Para otimização de compatibilidade</li>
              <li><strong>Geolocalização Aproximada:</strong> Baseada no IP, para conteúdo regionalizado</li>
              <li><strong>Identificador de Dispositivo:</strong> Para reconhecimento de dispositivos móveis</li>
              <li><strong>Dados de Navegação:</strong> Páginas visitadas, tempo de permanência, cliques</li>
            </ul>
            <p><strong>Finalidade:</strong> Segurança, prevenção de fraudes, análise de desempenho e personalização de conteúdo.</p>

            <h3>2.4 Dados de Transação</h3>
            <ul>
              <li><strong>Histórico de Compras:</strong> Itens virtuais adquiridos, valores e datas</li>
              <li><strong>Método de Pagamento:</strong> Tipo (cartão, PayPal, etc.) - dados completos são processados por terceiros seguros</li>
            </ul>
            <p>
              <strong>Importante:</strong> Não armazenamos dados completos de cartão de crédito. Pagamentos são processados 
              por provedores certificados (Stripe, PayPal, Mercado Pago).
            </p>
            <p><strong>Finalidade:</strong> Processar compras, emitir recibos e conformidade fiscal.</p>

            <h3>2.5 Cookies e Tecnologias Semelhantes</h3>
            <p>
              Utilizamos cookies, web beacons e tecnologias similares para:
            </p>
            <ul>
              <li>Lembrar preferências e configurações do usuário</li>
              <li>Manter sessões de login ativas</li>
              <li>Analisar o desempenho do site (Google Analytics)</li>
              <li>Exibir publicidade relevante (cookies de terceiros)</li>
            </ul>
            <p>Você pode gerenciar cookies nas configurações do seu navegador.</p>
          </section>

          <section className={styles.section}>
            <h2>3. Como Usamos Seus Dados</h2>
            
            <h3>3.1 Fornecer e Manter os Serviços</h3>
            <p>
              Utilizamos seus dados para permitir login, salvar progresso dos jogos, processar compras de itens 
              virtuais e manter a plataforma operacional.
            </p>
            <p><strong>Base Legal:</strong> Execução de contrato e legítimo interesse.</p>

            <h3>3.2 Melhorar a Plataforma</h3>
            <p>
              Analisamos dados de uso para identificar bugs, entender quais jogos são mais populares, otimizar 
              desempenho e desenvolver novos recursos.
            </p>
            <p><strong>Base Legal:</strong> Legítimo interesse.</p>

            <h3>3.3 Comunicação</h3>
            <p>
              Enviamos e-mails sobre:
            </p>
            <ul>
              <li>Atualizações de conta e segurança (obrigatório)</li>
              <li>Alterações nos Termos de Uso ou Política de Privacidade (obrigatório)</li>
              <li>Novos jogos, promoções e newsletters (opcional - requer consentimento)</li>
            </ul>
            <p><strong>Base Legal:</strong> Execução de contrato e consentimento (para marketing).</p>

            <h3>3.4 Segurança e Prevenção de Fraudes</h3>
            <p>
              Utilizamos dados para verificar identidades, detectar e banir usuários que utilizam cheats, 
              proteger contra ataques DDoS e garantir a integridade da plataforma.
            </p>
            <p><strong>Base Legal:</strong> Legítimo interesse e cumprimento de obrigação legal.</p>

            <h3>3.5 Publicidade e Marketing</h3>
            <p>
              Exibimos anúncios relevantes através de parceiros publicitários. Cookies de terceiros podem ser 
              usados para rastreamento e personalização de anúncios.
            </p>
            <p><strong>Base Legal:</strong> Consentimento (você pode gerenciar preferências de cookies).</p>
          </section>

          <section className={styles.section}>
            <h2>4. Compartilhamento de Informações</h2>
            
            <h3>4.1 Provedores de Serviços</h3>
            <p>
              Compartilhamos dados com empresas terceirizadas que nos auxiliam a operar a plataforma:
            </p>
            <ul>
              <li><strong>Hospedagem:</strong> AWS, Google Cloud, Vercel (armazenamento de dados)</li>
              <li><strong>Análise:</strong> Google Analytics (análise de tráfego e comportamento)</li>
              <li><strong>Pagamentos:</strong> Stripe, PayPal, Mercado Pago (processamento de transações)</li>
              <li><strong>E-mail:</strong> SendGrid, Mailchimp (envio de comunicações)</li>
            </ul>
            <p>Esses provedores têm acesso limitado aos dados e são obrigados a protegê-los.</p>

            <h3>4.2 Parceiros de Publicidade</h3>
            <p>
              Trabalhamos com redes de anúncios (Google AdSense, etc.) que podem coletar dados através de 
              cookies para exibir anúncios personalizados. Consulte as políticas de privacidade desses parceiros.
            </p>

            <h3>4.3 Transferências Internacionais</h3>
            <p>
              Alguns de nossos provedores de serviços estão localizados fora do Brasil. Garantimos que essas 
              transferências sejam realizadas com medidas de proteção adequadas, incluindo cláusulas contratuais 
              padrão e certificações de segurança.
            </p>

            <h3>4.4 Requisitos Legais</h3>
            <p>
              Podemos divulgar seus dados se exigido por lei, ordem judicial ou para proteger nossos direitos, 
              propriedade ou segurança.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Seus Direitos (LGPD)</h2>
            <p>
              De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
            </p>

            <h3>5.1 Direito de Acesso</h3>
            <p>
              Você pode solicitar uma cópia de todos os dados pessoais que mantemos sobre você.
            </p>

            <h3>5.2 Direito de Correção</h3>
            <p>
              Você pode corrigir dados incompletos, inexatos ou desatualizados (ex: alterar e-mail ou nome de usuário).
            </p>

            <h3>5.3 Direito de Exclusão (Esquecimento)</h3>
            <p>
              Você pode solicitar a exclusão de seus dados pessoais, exceto quando a lei exigir sua retenção 
              (ex: histórico de compras para fins fiscais por 5 anos).
            </p>

            <h3>5.4 Direito de Portabilidade</h3>
            <p>
              Você pode solicitar seus dados em formato estruturado e legível por máquina para transferência a outro serviço.
            </p>

            <h3>5.5 Direito de Oposição e Revogação</h3>
            <p>
              Você pode se opor ao processamento de seus dados para fins de marketing ou revogar consentimentos 
              previamente concedidos (ex: cancelar inscrição de newsletters).
            </p>

            <h3>5.6 Como Exercer Seus Direitos</h3>
            <p>
              Para exercer qualquer um desses direitos, entre em contato conosco através de:
            </p>
            <ul>
              <li><strong>E-mail:</strong> privacidade@neogames.com.br</li>
              <li><strong>Assunto:</strong> "Solicitação LGPD - [Seu Direito]"</li>
            </ul>
            <p>
              Responderemos sua solicitação em até 15 dias úteis. Podemos solicitar informações adicionais para 
              verificar sua identidade.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Segurança e Retenção de Dados</h2>
            
            <h3>6.1 Medidas de Segurança</h3>
            <p>
              Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, 
              perda, destruição ou alteração:
            </p>
            <ul>
              <li>Criptografia de senhas (bcrypt/hash)</li>
              <li>Conexões HTTPS/SSL para transmissão segura</li>
              <li>Firewalls e sistemas de detecção de intrusão</li>
              <li>Controle de acesso restrito aos dados</li>
              <li>Backups regulares e planos de recuperação</li>
            </ul>
            <p>
              Apesar de nossos esforços, nenhum sistema é 100% seguro. Você também é responsável por manter 
              sua senha segura.
            </p>

            <h3>6.2 Retenção de Dados</h3>
            <p>
              Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta Política:
            </p>
            <ul>
              <li><strong>Dados de Conta:</strong> Enquanto a conta estiver ativa ou conforme necessário para fornecer serviços</li>
              <li><strong>Dados de Transação:</strong> 5 anos (conformidade fiscal)</li>
              <li><strong>Logs de Segurança:</strong> 6 meses</li>
              <li><strong>Dados de Marketing:</strong> Até revogação do consentimento</li>
            </ul>
            <p>
              Após o período de retenção, os dados serão excluídos ou anonimizados de forma segura.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Privacidade de Menores</h2>
            <p>
              A NeoGames não coleta intencionalmente dados de crianças menores de 13 anos. Se você é pai ou 
              responsável e acredita que seu filho forneceu dados pessoais, entre em contato conosco para que 
              possamos excluir essas informações.
            </p>
            <p>
              Usuários entre 13 e 18 anos devem ter permissão dos pais ou responsáveis para usar a plataforma.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas 
              práticas ou por razões legais. Notificaremos você sobre alterações significativas através de:
            </p>
            <ul>
              <li>Aviso destacado no site</li>
              <li>E-mail para o endereço cadastrado</li>
              <li>Atualização da data no topo desta página</li>
            </ul>
            <p>
              Recomendamos que você revise esta Política periodicamente. O uso continuado da plataforma após 
              as alterações constitui aceitação da nova Política.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Contato</h2>
            <p>
              Para dúvidas, solicitações ou reclamações sobre esta Política de Privacidade ou sobre o tratamento 
              de seus dados pessoais, entre em contato:
            </p>
            <ul>
              <li><strong>E-mail de Privacidade:</strong> privacidade@neogames.com.br</li>
              <li><strong>E-mail Geral:</strong> contato@neogames.com.br</li>
            </ul>
            <p>
              Você também tem o direito de apresentar uma reclamação à Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </section>

          <div className={styles.acceptance}>
            <p>
              🛡️ Ao utilizar a NeoGames, você declara ter lido, compreendido e concordado com esta Política de Privacidade 
              e com o tratamento de seus dados pessoais conforme aqui descrito.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
