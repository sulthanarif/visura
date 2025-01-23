import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useRouter } from 'next/router';
import DefaultLayout from "@/components/templates/DefaultLayout";
import AdminLayout from "@/components/templates/AdminLayout";
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { decodeToken } from '@/utils/authHelpers';


export default function App({ Component, pageProps }) {
  const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isTokenValid, setIsTokenValid] = useState(false);


  // Auth pages that don't need layout
  const isAuthPage = 
     router.pathname === '/login' 
  || router.pathname === '/signup' 
  || router.pathname === '/forgotpassword' 
  || router.pathname === '/resetpassword'
  || router.pathname === '/otpsignupconfirmation'
  || router.pathname === '/otpforgotpasswordconfirmation';

  // Admin pages that use AdminLayout
  const isAdminPage = router.pathname.startsWith('/admin');


    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = decodeToken(token);
                if (decoded) {
                    setUser(decoded);
                    setIsTokenValid(true);
                  } else {
                     setIsTokenValid(false);
                    }
               
            } else {
              setIsTokenValid(false);
            }
                
             setLoading(false);

        };
        checkAuth();
    }, []);

  useEffect(() => {
      if(!isAuthPage && !loading){
           if (!isTokenValid) {
               router.push('/login');
           } 
      }
  }, [isTokenValid, router, loading, isAuthPage]);

    if(loading) {
        return <div>Loading ...</div>;
    }


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
           isTokenValid ? (
              <AdminLayout>
                 <Component {...pageProps} />
              </AdminLayout>
           ): null
      ) :  isTokenValid ? (
         <DefaultLayout>
             <Component {...pageProps} />
         </DefaultLayout>
      ) : null
        
      }
    </>
  );
}