import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from 'next/router';
import DefaultLayout from "@/components/templates/DefaultLayout";
import AdminLayout from "@/components/templates/AdminLayout";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // Auth pages that don't need layout
  const isAuthPage = 
     router.pathname === '/login' 
  || router.pathname === '/signup' 
  || router.pathname === '/forgot-password' 
  || router.pathname === '/reset-password'
  || router.pathname === '/otpsignupconfirmation'
  || router.pathname === '/otpforgotpasswordconfirmation';

  // Admin pages that use AdminLayout
  const isAdminPage = router.pathname.startsWith('/admin');

  if (isAuthPage) {
    return <Component {...pageProps} />;
  }

  if (isAdminPage) {
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  return (
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  );
}