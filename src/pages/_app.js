import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from 'next/router';
import DefaultLayout from "@/components/templates/DefaultLayout";
import AdminLayout from "@/components/templates/AdminLayout";
import { Toaster } from 'react-hot-toast'; 

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

  return (
    <>
      {/* Toaster for notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      {/* Conditional Layout Rendering */}
      {isAuthPage ? (
        <Component {...pageProps} />
      ) : isAdminPage ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      )}
    </>
  );
}
