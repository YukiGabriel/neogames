import '../styles/globals.css';
import GlobalNotification from '../components/GlobalNotification';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
      <GlobalNotification />
    </LanguageProvider>
  );
}
