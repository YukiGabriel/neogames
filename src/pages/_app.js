import '../styles/globals.css';
import GlobalNotification from '../components/GlobalNotification';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GlobalNotification />
    </>
  );
}
