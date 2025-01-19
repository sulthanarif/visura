import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from 'next/router';
import DefaultLayout from "@/components/templates/DefaultLayout";


export default function App({ Component, pageProps }) {

  const router = useRouter();
  const isImportantPage = router.pathname === '/login' || router.pathname === '/signup' || router.pathname === '/forgot-password' || router.pathname === '/reset-password' || router.pathname === '/confirmation';

  if (isImportantPage) {
    return <Component {...pageProps} />;
  }
  return (
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  );
}

